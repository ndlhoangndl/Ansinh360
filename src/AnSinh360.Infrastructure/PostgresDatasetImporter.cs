using System.Text.Json;
using AnSinh360.Application;
using AnSinh360.Domain;
using Microsoft.EntityFrameworkCore;

namespace AnSinh360.Infrastructure;

public sealed class PostgresDatasetImporter(DatasetDbContext db)
{
    public async Task<ImportResult> ImportAsync(DatasetSnapshot data, CancellationToken token = default)
    {
        var validation = new DatasetValidator().Validate(data);
        if (!validation.IsValid) throw new InvalidDataException($"Import rejected: {validation.ErrorCount} integrity errors. Run validate for details.");
        if ((await db.Database.GetPendingMigrationsAsync(token)).Any())
            throw new InvalidOperationException("Pending database migrations. Run the migrate command first.");
        await using var transaction = await db.Database.BeginTransactionAsync(token);
        try
        {
            // Serialize imports across processes. PostgreSQL releases this lock at transaction end.
            await db.Database.ExecuteSqlRawAsync("SELECT pg_advisory_xact_lock(36020261004)", token);
            var existing = await db.ReadSnapshotAsync(token);
            var plans = DatasetCatalog.Tables.Select(t => ImportPlanner.Plan(t, data.Records[t.EntityType], existing.Records[t.EntityType])).ToArray();
            var counts = plans.ToDictionary(p => p.Table.TableName, p => new TableImportCount(p.Inserts.Count, p.Updates.Count, p.Unchanged, p.Retained));
            foreach (var plan in plans)
            {
                db.AddRange(plan.Inserts);
                foreach (var row in plan.Updates)
                {
                    var current = await db.FindAsync(plan.Table.EntityType, plan.Table.KeyValues(row), token);
                    db.Entry(current!).CurrentValues.SetValues(row);
                }
                // Tables are saved in parent-before-child order, within this one transaction.
                await db.SaveChangesAsync(token);
            }
            Guid? batchId = null;
            if (plans.Any(p => p.Inserts.Count + p.Updates.Count > 0) || !await db.ImportBatches.AnyAsync(b => b.Fingerprint == data.Fingerprint, token))
            {
                var batch = new ImportBatch
                {
                    Id = Guid.NewGuid(), DatasetVersion = data.Version, Fingerprint = data.Fingerprint,
                    ImportedAt = DateTimeOffset.UtcNow,
                    FileHashesJson = JsonSerializer.Serialize(data.FileHashes), CountsJson = JsonSerializer.Serialize(counts)
                };
                db.ImportBatches.Add(batch);
                await db.SaveChangesAsync(token);
                batchId = batch.Id;
            }
            await transaction.CommitAsync(token);
            db.ChangeTracker.Clear();
            return new(data.Fingerprint, batchId, counts);
        }
        catch
        {
            await transaction.RollbackAsync(CancellationToken.None);
            db.ChangeTracker.Clear();
            throw;
        }
    }
}
