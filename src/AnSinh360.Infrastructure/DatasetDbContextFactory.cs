using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace AnSinh360.Infrastructure;

public sealed class DatasetDbContextFactory : IDesignTimeDbContextFactory<DatasetDbContext>
{
    public DatasetDbContext CreateDbContext(string[] args) => Create(
        Environment.GetEnvironmentVariable("AS360_CONNECTION_STRING") ?? "Host=localhost;Database=ansinh360;Username=ansinh360");

    public static DatasetDbContext Create(string connectionString) => new(
        new DbContextOptionsBuilder<DatasetDbContext>().UseNpgsql(connectionString).Options);
}
