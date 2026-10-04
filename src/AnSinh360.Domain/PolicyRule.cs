namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("04_POLICY_RULES.csv", "policy_rules", "rule_id")]
public sealed class PolicyRule
{
    [DatasetColumn(0, "rule_id")]
    public string RuleId { get; set; } = "";

    [DatasetColumn(1, "policy_id")]
    public string PolicyId { get; set; } = "";

    [DatasetColumn(2, "rule_group")]
    public string RuleGroup { get; set; } = "";

    [DatasetColumn(3, "logic_connector")]
    public string LogicConnector { get; set; } = "";

    [DatasetColumn(4, "field")]
    public string Field { get; set; } = "";

    [DatasetColumn(5, "operator")]
    public string Operator { get; set; } = "";

    [DatasetColumn(6, "value")]
    public string Value { get; set; } = "";

    [DatasetColumn(7, "required")]
    public string Required { get; set; } = "";

    [DatasetColumn(8, "match_reason")]
    public string MatchReason { get; set; } = "";

    [DatasetColumn(9, "missing_reason")]
    public string MissingReason { get; set; } = "";

    [DatasetColumn(10, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(11, "source_article")]
    public string SourceArticle { get; set; } = "";

    [DatasetColumn(12, "verification_status")]
    public string VerificationStatus { get; set; } = "";

    [DatasetColumn(13, "notes")]
    public string Notes { get; set; } = "";

}
