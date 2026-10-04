namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("08_POLICY_SERVICE_MAP.csv", "policy_service_maps", "map_id")]
public sealed class PolicyServiceMap
{
    [DatasetColumn(0, "map_id")]
    public string MapId { get; set; } = "";

    [DatasetColumn(1, "policy_id")]
    public string PolicyId { get; set; } = "";

    [DatasetColumn(2, "service_id")]
    public string ServiceId { get; set; } = "";

    [DatasetColumn(3, "intent")]
    public string Intent { get; set; } = "";

    [DatasetColumn(4, "priority")]
    public string Priority { get; set; } = "";

    [DatasetColumn(5, "notes")]
    public string Notes { get; set; } = "";

}
