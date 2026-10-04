namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("06_SERVICE_RULES.csv", "service_rules", "rule_id")]
public sealed class ServiceRule
{
    [DatasetColumn(0, "rule_id")]
    public string RuleId { get; set; } = "";

    [DatasetColumn(1, "event")]
    public string Event { get; set; } = "";

    [DatasetColumn(2, "intent")]
    public string Intent { get; set; } = "";

    [DatasetColumn(3, "condition")]
    public string Condition { get; set; } = "";

    [DatasetColumn(4, "service_id")]
    public string ServiceId { get; set; } = "";

    [DatasetColumn(5, "priority")]
    public string Priority { get; set; } = "";

    [DatasetColumn(6, "status")]
    public string Status { get; set; } = "";

}
