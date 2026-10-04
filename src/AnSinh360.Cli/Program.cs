using System.Globalization;
using System.Text;
using System.Text.Json;
using AnSinh360.Application;
using AnSinh360.Domain;
using AnSinh360.Infrastructure;
using Microsoft.EntityFrameworkCore;

Console.OutputEncoding = Encoding.UTF8;
var jsonOptions = new JsonSerializerOptions { WriteIndented = true, PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
try
{
    if (args.Length == 0 || args[0] is "--help" or "help")
    {
        Console.WriteLine("AN SINH 360 Phase 1\nCommands: validate | summary | plan | migrate | import | verify-idempotency\nOptions: --data <directory> (default data), --report <json-file>, --as-of yyyy-MM-dd, --database (summary only)\nDatabase commands require AS360_CONNECTION_STRING. No semantic conversion is performed.");
        return 0;
    }
    var command = args[0];
    if (command is not ("validate" or "summary" or "plan" or "migrate" or "import" or "verify-idempotency")) throw new ArgumentException($"Unknown command '{command}'.");
    var values = new Dictionary<string, string>(StringComparer.Ordinal);
    var database = false;
    for (var i = 1; i < args.Length; i++)
    {
        if (args[i] == "--database") { database = true; continue; }
        if (args[i] is not ("--data" or "--report" or "--as-of") || i + 1 >= args.Length) throw new ArgumentException($"Invalid option '{args[i]}'.");
        values.Add(args[i], args[++i]);
    }
    if (database && command != "summary") throw new ArgumentException("--database is only supported for summary.");
    var inputDirectory = Path.GetFullPath(values.GetValueOrDefault("--data", "data"));
    if (values.TryGetValue("--report", out var reportPath) && DatasetCatalog.Tables.Any(t =>
        string.Equals(Path.GetFullPath(reportPath), Path.Combine(inputDirectory, t.FileName), StringComparison.OrdinalIgnoreCase)))
        throw new ArgumentException("Report output cannot overwrite an input CSV file.");
    DateOnly? asOf = values.TryGetValue("--as-of", out var date) ? DateOnly.ParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture) : null;
    void Output(object result)
    {
        var json = JsonSerializer.Serialize(result, jsonOptions);
        Console.WriteLine(json);
        if (values.TryGetValue("--report", out var path))
        {
            var full = Path.GetFullPath(path);
            Directory.CreateDirectory(Path.GetDirectoryName(full)!);
            File.WriteAllText(full, json + Environment.NewLine, new UTF8Encoding(false));
        }
    }
    DatasetDbContext Connect()
    {
        var connection = Environment.GetEnvironmentVariable("AS360_CONNECTION_STRING");
        if (string.IsNullOrWhiteSpace(connection)) throw new ArgumentException("Set AS360_CONNECTION_STRING for database commands.");
        return DatasetDbContextFactory.Create(connection);
    }
    if (command == "migrate")
    {
        await using var db = Connect();
        await db.Database.MigrateAsync();
        Output(new { status = "migrated", migrations = await db.Database.GetAppliedMigrationsAsync() });
        return 0;
    }
    if (command == "summary" && database)
    {
        await using var db = Connect();
        var data = await db.ReadSnapshotAsync();
        var latest = await db.ImportBatches.AsNoTracking().OrderByDescending(b => b.ImportedAt).FirstOrDefaultAsync();
        Output(new { source = "postgresql", datasetVersion = data.Version, counts = data.Counts, total = data.Counts.Values.Sum(), latestImport = latest });
        return 0;
    }
    var snapshot = new CsvDatasetReader().Read(values.GetValueOrDefault("--data", "data"));
    var report = new DatasetValidator().Validate(snapshot, asOf);
    if (command == "validate" || !report.IsValid)
    {
        Output(report);
        return report.IsValid ? 0 : 2;
    }
    if (command == "summary")
    {
        Output(new { source = "csv", datasetVersion = snapshot.Version, snapshot.Fingerprint, counts = snapshot.Counts,
            total = snapshot.Counts.Values.Sum(), report.ErrorCount, report.WarningCount, snapshot.FileHashes });
        return 0;
    }
    if (command == "plan")
    {
        Output(new { mode = "empty-database-plan-only", databaseWritten = false, snapshot.Fingerprint,
            tables = DatasetCatalog.Tables.ToDictionary(t => t.TableName, t => new TableImportCount(snapshot.Records[t.EntityType].Count, 0, 0, 0)), report.ErrorCount, report.WarningCount });
        return 0;
    }
    await using var importDb = Connect();
    var importer = new PostgresDatasetImporter(importDb);
    var first = await importer.ImportAsync(snapshot);
    if (command == "import") { Output(first); return 0; }
    var beforeBatches = await importDb.ImportBatches.CountAsync();
    var second = await importer.ImportAsync(snapshot);
    var stored = await importDb.ReadSnapshotAsync();
    var differs = DatasetCatalog.Tables.Any(t =>
    {
        var comparison = ImportPlanner.Plan(t, snapshot.Records[t.EntityType], stored.Records[t.EntityType]);
        return comparison.Inserts.Count + comparison.Updates.Count > 0;
    });
    var verified = second.Inserted == 0 && second.Updated == 0 && second.Unchanged == snapshot.Counts.Values.Sum()
        && second.ImportBatchId == null && beforeBatches == await importDb.ImportBatches.CountAsync() && !differs;
    Output(new { verified, first, second, allIncomingCellsEqualDatabase = !differs, auditRowsUnchanged = second.ImportBatchId == null });
    return verified ? 0 : 3;
}
catch (Exception ex)
{
    // Do not echo connection strings, credentials, or database error details.
    Console.Error.WriteLine($"{ex.GetType().Name}: {ex switch
    {
        ArgumentException or InvalidDataException or InvalidOperationException or FormatException => ex.Message,
        _ => "Operation failed. Check local runtime/database connectivity and configuration."
    }}");
    return 1;
}
