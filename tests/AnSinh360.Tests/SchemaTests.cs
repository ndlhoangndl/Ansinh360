using AnSinh360.Application;
using AnSinh360.Domain;
using AnSinh360.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace AnSinh360.Tests;

public sealed class SchemaTests
{
    [Fact]
    public void PostgreSQL_model_has_text_columns_exact_keys_and_restrict_foreign_keys()
    {
        using var db = DatasetDbContextFactory.Create("Host=localhost;Database=not_connected;Username=test");
        Assert.Equal("Npgsql.EntityFrameworkCore.PostgreSQL", db.Database.ProviderName);
        foreach (var table in DatasetCatalog.Tables)
        {
            var entity = db.Model.FindEntityType(table.EntityType)!;
            Assert.Equal("dataset", entity.GetSchema());
            Assert.Equal(table.TableName, entity.GetTableName());
            Assert.Equal(table.KeyColumns.Select(c => c.Property.Name), entity.FindPrimaryKey()!.Properties.Select(p => p.Name));
            foreach (var column in table.Columns)
            {
                var property = entity.FindProperty(column.Property.Name)!;
                Assert.Equal("text", property.GetColumnType());
                Assert.False(property.IsNullable);
            }
            Assert.All(entity.GetForeignKeys(), fk => Assert.Equal(DeleteBehavior.Restrict, fk.DeleteBehavior));
        }
        Assert.Equal(12, db.Model.GetEntityTypes().Sum(t => t.GetForeignKeys().Count()));
    }

    [Fact]
    public void Migration_sql_is_generated_without_connecting_to_PostgreSQL()
    {
        using var db = DatasetDbContextFactory.Create("Host=localhost;Database=not_connected;Username=test");
        var script = db.GetService<Microsoft.EntityFrameworkCore.Migrations.IMigrator>().GenerateScript();
        Assert.Contains("CREATE TABLE dataset.policy_rules", script, StringComparison.Ordinal);
        Assert.Contains("CREATE TABLE dataset.import_batches", script, StringComparison.Ordinal);
        Assert.Contains("ON DELETE RESTRICT", script, StringComparison.Ordinal);
        Assert.Contains("jsonb", script, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Invalid_dataset_is_rejected_before_any_database_access()
    {
        await using var db = DatasetDbContextFactory.Create("Host=invalid.invalid;Database=not_connected;Username=test");
        var data = DatasetFixture.Read();
        data.Rows<Policy>()[0].LegalSourceId = "MISSING";
        await Assert.ThrowsAsync<InvalidDataException>(() => new PostgresDatasetImporter(db).ImportAsync(data));
    }
}
