namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("10_VERIFICATION_LOG.csv", "verification_logs", "log_id")]
public sealed class VerificationLog
{
    [DatasetColumn(0, "log_id")]
    public string LogId { get; set; } = "";

    [DatasetColumn(1, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(2, "checked_at")]
    public string CheckedAt { get; set; } = "";

    [DatasetColumn(3, "verification_status")]
    public string VerificationStatus { get; set; } = "";

    [DatasetColumn(4, "note")]
    public string Note { get; set; } = "";

    [DatasetColumn(5, "checked_by")]
    public string CheckedBy { get; set; } = "";

}
