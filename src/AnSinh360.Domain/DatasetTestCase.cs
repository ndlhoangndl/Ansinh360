namespace AnSinh360.Domain;

/// <summary>Verbatim decoded CSV cells. No semantic conversion is performed.</summary>
[DatasetTable("09_TEST_CASES.csv", "dataset_test_cases", "test_id")]
public sealed class DatasetTestCase
{
    [DatasetColumn(0, "test_id")]
    public string TestId { get; set; } = "";

    [DatasetColumn(1, "journey")]
    public string Journey { get; set; } = "";

    [DatasetColumn(2, "input_summary")]
    public string InputSummary { get; set; } = "";

    [DatasetColumn(3, "expected_policies")]
    public string ExpectedPolicies { get; set; } = "";

    [DatasetColumn(4, "expected_services")]
    public string ExpectedServices { get; set; } = "";

    [DatasetColumn(5, "expected_missing_fields")]
    public string ExpectedMissingFields { get; set; } = "";

    [DatasetColumn(6, "expected_result")]
    public string ExpectedResult { get; set; } = "";

    [DatasetColumn(7, "status")]
    public string Status { get; set; } = "";

}
