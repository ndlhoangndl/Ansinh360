using AnSinh360.Application;
using AnSinh360.Domain;
using AnSinh360.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Npgsql;
using System.Data.Common;

namespace AnSinh360.Tests;

public sealed class PostgresFactAttribute : FactAttribute
{
    public PostgresFactAttribute()
    {
        if (string.IsNullOrWhiteSpace(Environment.GetEnvironmentVariable("AS360_TEST_CONNECTION_STRING")))
            Skip = "blocked by local environment: PostgreSQL/Docker unavailable; AS360_TEST_CONNECTION_STRING is not set.";
    }
}

[Trait("Category", "PostgreSQL")]
public sealed class PostgresIntegrationTests
{
    [PostgresFact]
    public async Task Real_dataset_migrates_imports_verbatim_and_second_import_is_idempotent()
    {
        await using var database = await TestDatabase.CreateAsync();
        await using var db = database.Context();
        await db.Database.MigrateAsync();
        var data = DatasetFixture.Read();
        var importer = new PostgresDatasetImporter(db);
        var first = await importer.ImportAsync(data);
        Assert.Equal(382, first.Inserted);
        Assert.Equal(0, first.Updated);
        Assert.NotNull(first.ImportBatchId);
        var second = await importer.ImportAsync(data);
        Assert.Equal(0, second.Inserted);
        Assert.Equal(0, second.Updated);
        Assert.Equal(382, second.Unchanged);
        Assert.Null(second.ImportBatchId);
        Assert.Equal(1, await db.ImportBatches.CountAsync());
        var stored = await db.ReadSnapshotAsync();
        foreach (var table in DatasetCatalog.Tables)
        {
            Assert.Equal(data.Records[table.EntityType].Count, stored.Records[table.EntityType].Count);
            var plan = ImportPlanner.Plan(table, data.Records[table.EntityType], stored.Records[table.EntityType]);
            Assert.Empty(plan.Inserts);
            Assert.Empty(plan.Updates);
        }
    }

    [PostgresFact]
    public async Task Mid_import_failure_rolls_back_every_table_and_audit_row()
    {
        await using var database = await TestDatabase.CreateAsync();
        await using (var setup = database.Context()) await setup.Database.MigrateAsync();
        var failure = new FailServiceInsert();
        await using (var failing = database.Context(failure))
            await Assert.ThrowsAnyAsync<Exception>(() => new PostgresDatasetImporter(failing).ImportAsync(DatasetFixture.Read()));
        Assert.True(failure.Triggered, "The injected mid-import failure must actually be reached.");
        await using var verify = database.Context();
        var stored = await verify.ReadSnapshotAsync();
        Assert.All(stored.Counts.Values, count => Assert.Equal(0, count));
        Assert.Equal(0, await verify.ImportBatches.CountAsync());
    }

    [PostgresFact]
    public async Task Changed_cell_updates_one_record_then_becomes_idempotent()
    {
        await using var database = await TestDatabase.CreateAsync();
        await using var db = database.Context();
        await db.Database.MigrateAsync();
        var data = DatasetFixture.Read();
        var importer = new PostgresDatasetImporter(db);
        await importer.ImportAsync(data);
        // Mutates a test snapshot only, never a supplied CSV.
        data.Rows<DatasetMetadata>()[0].Notes += " test annotation";
        var update = await importer.ImportAsync(data);
        Assert.Equal(0, update.Inserted);
        Assert.Equal(1, update.Updated);
        Assert.Equal(381, update.Unchanged);
        var repeated = await importer.ImportAsync(data);
        Assert.Equal(382, repeated.Unchanged);
        Assert.Equal(0, repeated.Updated);
        Assert.Equal(2, await db.ImportBatches.CountAsync());
    }

    private sealed class FailServiceInsert : DbCommandInterceptor
    {
        public bool Triggered { get; private set; }
        public override ValueTask<InterceptionResult<DbDataReader>> ReaderExecutingAsync(DbCommand command, CommandEventData eventData,
            InterceptionResult<DbDataReader> result, CancellationToken cancellationToken = default)
        {
            if (command.CommandText.Contains("INSERT INTO dataset.services", StringComparison.Ordinal))
            {
                Triggered = true;
                throw new InvalidOperationException("Injected test failure during services insert.");
            }
            return ValueTask.FromResult(result);
        }
    }

    private sealed class TestDatabase(string adminConnection, string databaseName, string connectionString) : IAsyncDisposable
    {
        public static async Task<TestDatabase> CreateAsync()
        {
            var builder = new NpgsqlConnectionStringBuilder(Environment.GetEnvironmentVariable("AS360_TEST_CONNECTION_STRING")!);
            // Tests require a dedicated local administrator account with CREATEDB.
            builder.Database = "postgres";
            var admin = builder.ConnectionString;
            var name = "as360_test_" + Guid.NewGuid().ToString("N");
            await using var connection = new NpgsqlConnection(admin);
            await connection.OpenAsync();
            await using var command = new NpgsqlCommand($"CREATE DATABASE \"{name}\"", connection);
            await command.ExecuteNonQueryAsync();
            builder.Database = name;
            return new(admin, name, builder.ConnectionString);
        }

        public DatasetDbContext Context(IInterceptor? interceptor = null)
        {
            var options = new DbContextOptionsBuilder<DatasetDbContext>().UseNpgsql(connectionString);
            if (interceptor != null) options.AddInterceptors(interceptor);
            return new(options.Options);
        }

        public async ValueTask DisposeAsync()
        {
            if (!databaseName.StartsWith("as360_test_", StringComparison.Ordinal)) throw new InvalidOperationException("Unexpected test database name.");
            using (var poolConnection = new NpgsqlConnection(connectionString)) NpgsqlConnection.ClearPool(poolConnection);
            await using var connection = new NpgsqlConnection(adminConnection);
            await connection.OpenAsync();
            await using var command = new NpgsqlCommand($"DROP DATABASE \"{databaseName}\" WITH (FORCE)", connection);
            await command.ExecuteNonQueryAsync();
        }
    }
}
