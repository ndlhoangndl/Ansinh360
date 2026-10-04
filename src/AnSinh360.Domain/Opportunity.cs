namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("07_OPPORTUNITIES.csv", "opportunities", "opportunity_id")]
public sealed class Opportunity
{
    [DatasetColumn(0, "opportunity_id")]
    public string OpportunityId { get; set; } = "";

    [DatasetColumn(1, "policy_id")]
    public string PolicyId { get; set; } = "";

    [DatasetColumn(2, "service_id")]
    public string ServiceId { get; set; } = "";

    [DatasetColumn(3, "name")]
    public string Name { get; set; } = "";

    [DatasetColumn(4, "location")]
    public string Location { get; set; } = "";

    [DatasetColumn(5, "open_from")]
    public string OpenFrom { get; set; } = "";

    [DatasetColumn(6, "open_until")]
    public string OpenUntil { get; set; } = "";

    [DatasetColumn(7, "capacity")]
    public string Capacity { get; set; } = "";

    [DatasetColumn(8, "status")]
    public string Status { get; set; } = "";

    [DatasetColumn(9, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(10, "last_verified")]
    public string LastVerified { get; set; } = "";

    [DatasetColumn(11, "notes")]
    public string Notes { get; set; } = "";

}
