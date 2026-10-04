namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("02_LIFE_EVENTS.csv", "life_events", "life_event_id")]
public sealed class LifeEvent
{
    [DatasetColumn(0, "life_event_id")]
    public string LifeEventId { get; set; } = "";

    [DatasetColumn(1, "name")]
    public string Name { get; set; } = "";

    [DatasetColumn(2, "description")]
    public string Description { get; set; } = "";

    [DatasetColumn(3, "primary_demo")]
    public string PrimaryDemo { get; set; } = "";

    [DatasetColumn(4, "status")]
    public string Status { get; set; } = "";

}
