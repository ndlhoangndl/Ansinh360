namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("11_SERVICE_CHECKLISTS.csv", "service_checklists", "checklist_id")]
public sealed class ServiceChecklist
{
    [DatasetColumn(0, "checklist_id")]
    public string ChecklistId { get; set; } = "";

    [DatasetColumn(1, "service_id")]
    public string ServiceId { get; set; } = "";

    [DatasetColumn(2, "item_order")]
    public string ItemOrder { get; set; } = "";

    [DatasetColumn(3, "requirement_type")]
    public string RequirementType { get; set; } = "";

    [DatasetColumn(4, "document_or_step")]
    public string DocumentOrStep { get; set; } = "";

    [DatasetColumn(5, "required")]
    public string Required { get; set; } = "";

    [DatasetColumn(6, "condition")]
    public string Condition { get; set; } = "";

    [DatasetColumn(7, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(8, "source_detail")]
    public string SourceDetail { get; set; } = "";

    [DatasetColumn(9, "verification_status")]
    public string VerificationStatus { get; set; } = "";

    [DatasetColumn(10, "notes")]
    public string Notes { get; set; } = "";

}
