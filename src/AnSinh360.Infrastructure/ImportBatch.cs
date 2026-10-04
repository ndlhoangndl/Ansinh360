namespace AnSinh360.Infrastructure;

public sealed class ImportBatch
{
    public Guid Id { get; set; }
    public string DatasetVersion { get; set; } = "";
    public string Fingerprint { get; set; } = "";
    public DateTimeOffset ImportedAt { get; set; }
    public string FileHashesJson { get; set; } = "{}";
    public string CountsJson { get; set; } = "{}";
}
