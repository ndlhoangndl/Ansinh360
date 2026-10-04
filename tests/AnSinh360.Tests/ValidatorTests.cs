using System.Text.Json;
using AnSinh360.Application;
using AnSinh360.Domain;

namespace AnSinh360.Tests;

public sealed class ValidatorTests
{
    [Fact]
    public void Real_dataset_is_valid_with_nonblocking_contract_and_portal_warnings()
    {
        var result = new DatasetValidator().Validate(DatasetFixture.Read());
        Assert.True(result.IsValid, JsonSerializer.Serialize(result.Issues.Where(i => i.Severity == "ERROR")));
        Assert.Equal(0, result.ErrorCount);
        Assert.Contains(result.Issues, i => i.Code == "PROFILE_RULE_TYPE_MISMATCH" && i.RecordId == "PR_CHILD_004");
        Assert.Contains(result.Issues, i => i.Code == "PROFILE_RULE_VALUE_DOMAIN_MISMATCH" && i.RecordId == "PR_JOB_002");
        Assert.Contains(result.Issues, i => i.Code == "PROFILE_RULE_DERIVED_FIELD_UNRESOLVED" && i.RecordId == "PR_JOB_008");
        Assert.Contains(result.Issues, i => i.Code == "OFFICIAL_PORTAL_SLUG_ANOMALY");
        Assert.All(result.Issues.Where(i => i.Code.StartsWith("PROFILE_RULE_", StringComparison.Ordinal)), i => Assert.Equal("WARNING", i.Severity));
    }

    [Fact]
    public void Validation_does_not_change_any_source_cell()
    {
        var data = DatasetFixture.Read();
        var before = SerializeCells(data);
        new DatasetValidator().Validate(data, new DateOnly(2027, 1, 1));
        Assert.Equal(before, SerializeCells(data));
    }

    [Fact]
    public void Empty_and_duplicate_natural_keys_block_import()
    {
        var data = DatasetFixture.Read();
        data.Records[typeof(LifeEvent)].Add(new LifeEvent { LifeEventId = "JOB_LOSS" });
        data.Records[typeof(LifeEvent)].Add(new LifeEvent());
        var result = new DatasetValidator().Validate(data);
        Assert.False(result.IsValid);
        Assert.Contains(result.Issues, i => i.Code == "DUPLICATE_KEY");
        Assert.Contains(result.Issues, i => i.Code == "EMPTY_KEY");
    }

    [Fact]
    public void Broken_source_policy_service_and_pipe_list_references_are_errors()
    {
        var data = DatasetFixture.Read();
        data.Rows<PolicyRule>()[0].SourceId = "MISSING_SOURCE";
        data.Rows<PolicyRule>()[0].PolicyId = "MISSING_POLICY";
        data.Rows<ServiceRule>()[0].ServiceId = "MISSING_SERVICE";
        data.Rows<DatasetTestCase>()[0].ExpectedServices += "|MISSING_SERVICE";
        var result = new DatasetValidator().Validate(data);
        Assert.False(result.IsValid);
        Assert.Equal(4, result.Issues.Count(i => i.Code == "BROKEN_REFERENCE"));
    }

    [Theory]
    [InlineData("not-a-date", "INVALID_DATE")]
    [InlineData("2026-02-30", "INVALID_DATE")]
    public void Invalid_full_dates_are_errors(string value, string code)
    {
        var data = DatasetFixture.Read();
        data.Rows<Opportunity>()[0].OpenFrom = value;
        Assert.Contains(new DatasetValidator().Validate(data).Issues, i => i.Code == code);
    }

    [Fact]
    public void Inverted_opportunity_date_interval_is_an_error()
    {
        var data = DatasetFixture.Read();
        data.Rows<Opportunity>()[0].OpenUntil = "2026-01-01";
        Assert.Contains(new DatasetValidator().Validate(data).Issues, i => i.Code == "INVALID_DATE_INTERVAL" && i.Severity == "ERROR");
    }

    [Fact]
    public void Undated_recurring_opportunity_and_dataset_log_sentinel_are_retained()
    {
        var data = DatasetFixture.Read();
        var result = new DatasetValidator().Validate(data);
        Assert.Contains(result.Issues, i => i.Code == "OPPORTUNITY_SCHEDULE_UNSPECIFIED" && i.RecordId == "OPP_JOB_001");
        Assert.DoesNotContain(result.Issues, i => i.Code == "BROKEN_REFERENCE" && i.RecordId == "VL051");
        Assert.Equal("DATASET", data.Rows<VerificationLog>().Single(l => l.LogId == "VL051").SourceId);
    }

    [Fact]
    public void Output_rules_do_not_require_profile_input_fields()
    {
        var data = DatasetFixture.Read();
        var result = new DatasetValidator().Validate(data);
        var outputs = data.Rows<PolicyRule>().Where(r => r.LogicConnector == "OUTPUT").Select(r => r.RuleId).ToHashSet();
        Assert.DoesNotContain(result.Issues, i => outputs.Contains(i.RecordId) && i.Code.StartsWith("PROFILE_RULE_", StringComparison.Ordinal));
    }

    [Fact]
    public void Each_money_range_numeric_rule_has_a_warning()
    {
        var result = new DatasetValidator().Validate(DatasetFixture.Read());
        foreach (var id in new[] { "PR_HOUSE_005", "PR_HOUSE_007", "PR_HOUSE_009" })
            Assert.Contains(result.Issues, i => i.RecordId == id && i.Code == "PROFILE_RULE_TYPE_MISMATCH" && i.Severity == "WARNING");
    }

    [Fact]
    public void Service_rule_aliases_and_derived_fields_are_nonblocking_and_not_evaluated()
    {
        var result = new DatasetValidator().Validate(DatasetFixture.Read());
        Assert.True(result.IsValid);
        foreach (var id in new[] { "SR001", "SR002", "SR003", "SR007", "SR009", "SR020", "SR021" })
            Assert.Contains(result.Issues, i => i.RecordId == id && i.Code == "SERVICE_RULE_PROFILE_FIELD_UNRESOLVED" && i.Severity == "WARNING");
    }

    [Fact]
    public void Empty_tables_and_missing_dataset_metadata_cannot_be_silently_imported()
    {
        var result = new DatasetValidator().Validate(new DatasetSnapshot());
        Assert.False(result.IsValid);
        Assert.Null(result.AsOf);
        Assert.Equal(14, result.Issues.Count(i => i.Code == "EMPTY_TABLE"));
        Assert.Equal(2, result.Issues.Count(i => i.Code == "INVALID_DATASET_METADATA"));
    }

    private static string SerializeCells(DatasetSnapshot data) => JsonSerializer.Serialize(DatasetCatalog.Tables.Select(t =>
        data.Records[t.EntityType].Select(row => t.Columns.Select(c => c.Read(row)).ToArray()).ToArray()).ToArray());
}
