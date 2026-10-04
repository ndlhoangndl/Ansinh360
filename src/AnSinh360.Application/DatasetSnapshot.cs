using AnSinh360.Domain;

namespace AnSinh360.Application;

public sealed record ValidationIssue(string Severity, string Code, string File, string RecordId, string Field, string Message);

public sealed class DatasetSnapshot
{
    public Dictionary<Type, List<object>> Records { get; } = DatasetCatalog.Tables.ToDictionary(t => t.EntityType, _ => new List<object>());
    public Dictionary<string, string> FileHashes { get; } = new(StringComparer.Ordinal);
    public List<ValidationIssue> LoadIssues { get; } = [];
    public string Fingerprint { get; set; } = "";
    public IReadOnlyList<T> Rows<T>() => Records[typeof(T)].Cast<T>().ToArray();
    public string Version => Rows<DatasetMetadata>().FirstOrDefault(r => r.Key == "dataset_version")?.Value ?? "";
    public IReadOnlyDictionary<string, int> Counts => DatasetCatalog.Tables.ToDictionary(t => t.TableName, t => Records[t.EntityType].Count);
}

public sealed record ValidationReport(string DatasetVersion, string Fingerprint, DateOnly? AsOf,
    IReadOnlyDictionary<string, int> Counts, IReadOnlyList<ValidationIssue> Issues)
{
    public int ErrorCount => Issues.Count(i => i.Severity == "ERROR");
    public int WarningCount => Issues.Count(i => i.Severity == "WARNING");
    public bool IsValid => ErrorCount == 0;
}
