namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("01_SOURCES.csv", "sources", "source_id")]
public sealed class OfficialSource
{
    [DatasetColumn(0, "source_id")]
    public string SourceId { get; set; } = "";

    [DatasetColumn(1, "journey")]
    public string Journey { get; set; } = "";

    [DatasetColumn(2, "title")]
    public string Title { get; set; } = "";

    [DatasetColumn(3, "document_number")]
    public string DocumentNumber { get; set; } = "";

    [DatasetColumn(4, "source_type")]
    public string SourceType { get; set; } = "";

    [DatasetColumn(5, "source_level")]
    public string SourceLevel { get; set; } = "";

    [DatasetColumn(6, "issuing_authority")]
    public string IssuingAuthority { get; set; } = "";

    [DatasetColumn(7, "publisher")]
    public string Publisher { get; set; } = "";

    [DatasetColumn(8, "canonical_url")]
    public string CanonicalUrl { get; set; } = "";

    [DatasetColumn(9, "published_at")]
    public string PublishedAt { get; set; } = "";

    [DatasetColumn(10, "effective_from")]
    public string EffectiveFrom { get; set; } = "";

    [DatasetColumn(11, "effective_to")]
    public string EffectiveTo { get; set; } = "";

    [DatasetColumn(12, "verification_status")]
    public string VerificationStatus { get; set; } = "";

    [DatasetColumn(13, "last_verified_at")]
    public string LastVerifiedAt { get; set; } = "";

    [DatasetColumn(14, "notes")]
    public string Notes { get; set; } = "";

    [DatasetColumn(15, "legal_status")]
    public string LegalStatus { get; set; } = "";

    [DatasetColumn(16, "supersedes")]
    public string Supersedes { get; set; } = "";

    [DatasetColumn(17, "superseded_by")]
    public string SupersededBy { get; set; } = "";

    [DatasetColumn(18, "archive_status")]
    public string ArchiveStatus { get; set; } = "";

}
