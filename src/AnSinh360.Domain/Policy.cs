namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("03_POLICIES.csv", "policies", "policy_id")]
public sealed class Policy
{
    [DatasetColumn(0, "policy_id")]
    public string PolicyId { get; set; } = "";

    [DatasetColumn(1, "policy_name")]
    public string PolicyName { get; set; } = "";

    [DatasetColumn(2, "journey")]
    public string Journey { get; set; } = "";

    [DatasetColumn(3, "category")]
    public string Category { get; set; } = "";

    [DatasetColumn(4, "target_group")]
    public string TargetGroup { get; set; } = "";

    [DatasetColumn(5, "summary")]
    public string Summary { get; set; } = "";

    [DatasetColumn(6, "legal_source_id")]
    public string LegalSourceId { get; set; } = "";

    [DatasetColumn(7, "effective_from")]
    public string EffectiveFrom { get; set; } = "";

    [DatasetColumn(8, "effective_to")]
    public string EffectiveTo { get; set; } = "";

    [DatasetColumn(9, "status")]
    public string Status { get; set; } = "";

    [DatasetColumn(10, "last_verified")]
    public string LastVerified { get; set; } = "";

}
