namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("05_SERVICES.csv", "services", "service_id")]
public sealed class Service
{
    [DatasetColumn(0, "service_id")]
    public string ServiceId { get; set; } = "";

    [DatasetColumn(1, "service_name")]
    public string ServiceName { get; set; } = "";

    [DatasetColumn(2, "service_type")]
    public string ServiceType { get; set; } = "";

    [DatasetColumn(3, "journey")]
    public string Journey { get; set; } = "";

    [DatasetColumn(4, "supported_intents")]
    public string SupportedIntents { get; set; } = "";

    [DatasetColumn(5, "provider")]
    public string Provider { get; set; } = "";

    [DatasetColumn(6, "location")]
    public string Location { get; set; } = "";

    [DatasetColumn(7, "online_url")]
    public string OnlineUrl { get; set; } = "";

    [DatasetColumn(8, "procedure_code")]
    public string ProcedureCode { get; set; } = "";

    [DatasetColumn(9, "address")]
    public string Address { get; set; } = "";

    [DatasetColumn(10, "phone")]
    public string Phone { get; set; } = "";

    [DatasetColumn(11, "status")]
    public string Status { get; set; } = "";

    [DatasetColumn(12, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(13, "last_verified")]
    public string LastVerified { get; set; } = "";

    [DatasetColumn(14, "processing_time")]
    public string ProcessingTime { get; set; } = "";

    [DatasetColumn(15, "fee")]
    public string Fee { get; set; } = "";

    [DatasetColumn(16, "submission_channels")]
    public string SubmissionChannels { get; set; } = "";

    [DatasetColumn(17, "result_or_action")]
    public string ResultOrAction { get; set; } = "";

    [DatasetColumn(18, "freshness_rule")]
    public string FreshnessRule { get; set; } = "";

}
