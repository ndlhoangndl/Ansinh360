using System.Reflection;
using AnSinh360.Application;
using AnSinh360.Domain;
using Microsoft.EntityFrameworkCore;

namespace AnSinh360.Infrastructure;

public sealed class DatasetDbContext(DbContextOptions<DatasetDbContext> options) : DbContext(options)
{
    public DbSet<ImportBatch> ImportBatches => Set<ImportBatch>();

    protected override void OnModelCreating(ModelBuilder model)
    {
        model.HasDefaultSchema("dataset");
        foreach (var table in DatasetCatalog.Tables)
        {
            var entity = model.Entity(table.EntityType);
            entity.ToTable(table.TableName);
            entity.HasKey(table.KeyColumns.Select(c => c.Property.Name).ToArray());
            foreach (var column in table.Columns)
                entity.Property(column.Property.Name).HasColumnName(column.Name).HasColumnType("text").IsRequired();
        }
        void Reference<T, TPrincipal>(string property) where T : class where TPrincipal : class =>
            model.Entity<T>().HasOne<TPrincipal>().WithMany().HasForeignKey(property).OnDelete(DeleteBehavior.Restrict);
        Reference<Policy, OfficialSource>(nameof(Policy.LegalSourceId));
        Reference<PolicyRule, Policy>(nameof(PolicyRule.PolicyId));
        Reference<PolicyRule, OfficialSource>(nameof(PolicyRule.SourceId));
        Reference<Service, OfficialSource>(nameof(Service.SourceId));
        Reference<ServiceRule, Service>(nameof(ServiceRule.ServiceId));
        Reference<Opportunity, Policy>(nameof(Opportunity.PolicyId));
        Reference<Opportunity, Service>(nameof(Opportunity.ServiceId));
        Reference<Opportunity, OfficialSource>(nameof(Opportunity.SourceId));
        Reference<PolicyServiceMap, Policy>(nameof(PolicyServiceMap.PolicyId));
        Reference<PolicyServiceMap, Service>(nameof(PolicyServiceMap.ServiceId));
        Reference<ServiceChecklist, Service>(nameof(ServiceChecklist.ServiceId));
        Reference<ServiceChecklist, OfficialSource>(nameof(ServiceChecklist.SourceId));
        model.Entity<ProfileField>().HasIndex(p => p.FieldName);
        model.Entity<PolicyRule>().HasIndex(p => p.Field);
        model.Entity<OfficialSource>().HasIndex(s => s.VerificationStatus);
        model.Entity<Opportunity>().HasIndex(o => o.Status);
        model.Entity<VerificationLog>().HasIndex(l => l.SourceId);
        // VerificationLog.SourceId includes the literal DATASET. Pipe-delimited and ALL references
        // remain raw text and are checked by the validator instead of coercing them into foreign keys.
        var batch = model.Entity<ImportBatch>();
        batch.ToTable("import_batches");
        batch.HasKey(b => b.Id);
        batch.Property(b => b.Id).HasColumnName("id");
        batch.Property(b => b.DatasetVersion).HasColumnName("dataset_version").HasColumnType("text").IsRequired();
        batch.Property(b => b.Fingerprint).HasColumnName("fingerprint").HasMaxLength(64).IsRequired();
        batch.Property(b => b.ImportedAt).HasColumnName("imported_at");
        batch.Property(b => b.FileHashesJson).HasColumnName("file_hashes").HasColumnType("jsonb").IsRequired();
        batch.Property(b => b.CountsJson).HasColumnName("counts").HasColumnType("jsonb").IsRequired();
        batch.HasIndex(b => b.Fingerprint);
    }

    public async Task<DatasetSnapshot> ReadSnapshotAsync(CancellationToken cancellationToken = default)
    {
        var snapshot = new DatasetSnapshot();
        var method = typeof(DatasetDbContext).GetMethod(nameof(ReadRowsAsync), BindingFlags.Instance | BindingFlags.NonPublic)!;
        foreach (var table in DatasetCatalog.Tables)
        {
            var task = (Task<List<object>>)method.MakeGenericMethod(table.EntityType).Invoke(this, [cancellationToken])!;
            snapshot.Records[table.EntityType] = await task;
        }
        return snapshot;
    }

    private async Task<List<object>> ReadRowsAsync<T>(CancellationToken token) where T : class =>
        (await Set<T>().AsNoTracking().ToListAsync(token)).Cast<object>().ToList();
}
