namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("13_ENUMS.csv", "enum_definitions", "enum_group", "value")]
public sealed class EnumDefinition
{
    [DatasetColumn(0, "enum_group")]
    public string EnumGroup { get; set; } = "";

    [DatasetColumn(1, "value")]
    public string Value { get; set; } = "";

    [DatasetColumn(2, "label_vi")]
    public string LabelVi { get; set; } = "";

    [DatasetColumn(3, "meaning")]
    public string Meaning { get; set; } = "";

    [DatasetColumn(4, "active")]
    public string Active { get; set; } = "";

}
