namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("00_README.csv", "dataset_metadata", "key")]
public sealed class DatasetMetadata
{
    [DatasetColumn(0, "key")]
    public string Key { get; set; } = "";

    [DatasetColumn(1, "value")]
    public string Value { get; set; } = "";

    [DatasetColumn(2, "notes")]
    public string Notes { get; set; } = "";

}
