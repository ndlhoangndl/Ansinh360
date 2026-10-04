namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("12_PROFILE_FIELDS.csv", "profile_fields", "field_id")]
public sealed class ProfileField
{
    [DatasetColumn(0, "field_id")]
    public string FieldId { get; set; } = "";

    [DatasetColumn(1, "journey")]
    public string Journey { get; set; } = "";

    [DatasetColumn(2, "field_name")]
    public string FieldName { get; set; } = "";

    [DatasetColumn(3, "question_vi")]
    public string QuestionVi { get; set; } = "";

    [DatasetColumn(4, "data_type")]
    public string DataType { get; set; } = "";

    [DatasetColumn(5, "allowed_values")]
    public string AllowedValues { get; set; } = "";

    [DatasetColumn(6, "required_when")]
    public string RequiredWhen { get; set; } = "";

    [DatasetColumn(7, "source_rule_ids")]
    public string SourceRuleIds { get; set; } = "";

    [DatasetColumn(8, "sensitivity")]
    public string Sensitivity { get; set; } = "";

    [DatasetColumn(9, "persist_default")]
    public string PersistDefault { get; set; } = "";

    [DatasetColumn(10, "notes")]
    public string Notes { get; set; } = "";

}
