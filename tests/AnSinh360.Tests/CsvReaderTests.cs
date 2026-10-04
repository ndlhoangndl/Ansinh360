using System.Text;
using AnSinh360.Application;
using AnSinh360.Domain;

namespace AnSinh360.Tests;

public sealed class CsvReaderTests
{
    [Fact]
    public void Real_dataset_has_all_fourteen_tables_and_expected_counts()
    {
        var data = DatasetFixture.Read();
        Assert.Empty(data.LoadIssues);
        Assert.Equal(new[] { 30, 40, 3, 12, 54, 22, 23, 7, 23, 20, 51, 27, 41, 29 },
            DatasetCatalog.Tables.Select(t => data.Records[t.EntityType].Count));
        Assert.Equal(382, data.Counts.Values.Sum());
        Assert.Equal(14, data.FileHashes.Count);
        Assert.Equal(64, data.Fingerprint.Length);
    }

    [Fact]
    public void Real_contract_definitions_and_portal_source_remain_verbatim()
    {
        var data = DatasetFixture.Read();
        var field = Assert.Single(data.Rows<ProfileField>(), p => p.FieldId == "PF_CHILD_006");
        Assert.Equal("BOOLEAN", field.DataType);
        Assert.Equal("true|false", field.AllowedValues);
        var rule = Assert.Single(data.Rows<PolicyRule>(), p => p.RuleId == "PR_CHILD_004");
        Assert.Equal("GTE", rule.Operator);
        Assert.Equal("12", rule.Value);
        var source = Assert.Single(data.Rows<OfficialSource>(), s => s.SourceId == "SRC_JOB_DN_001");
        Assert.Equal("VERIFIED_OFFICIAL", source.VerificationStatus);
        Assert.Equal("https://cttdt.danangportal.gov.vn/vi/web/dng/w/so-xay-dung", source.CanonicalUrl);
        Assert.Equal("2026", data.Rows<OfficialSource>().Single(s => s.SourceId == "SRC_JOB_PROC_001").PublishedAt);
        Assert.Equal("True", data.Rows<LifeEvent>().Single(e => e.LifeEventId == "JOB_LOSS").PrimaryDemo);
    }

    [Fact]
    public void Rfc4180_quoted_fields_unicode_whitespace_empty_cells_and_bom_are_preserved()
    {
        var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes("key,value,notes\r\nx,\"  Tiếng Việt, \"\"quoted\"\"\r\nnext  \",\r\n")).ToArray();
        var row = Assert.IsType<DatasetMetadata>(Assert.Single(CsvDatasetReader.ReadTable(DatasetCatalog.For<DatasetMetadata>(), bytes)));
        Assert.Equal("  Tiếng Việt, \"quoted\"\r\nnext  ", row.Value);
        Assert.Equal("", row.Notes);
    }

    [Theory]
    [InlineData("key,notes,value\nx,v,n\n")]
    [InlineData("key,value,notes\nx,v\n")]
    [InlineData("key,value,notes\nx,v,n,extra\n")]
    [InlineData("key,value,notes\nx,\"unclosed,n\n")]
    [InlineData("key,value,notes\nx,v\0,n\n")]
    public void Malformed_csv_is_rejected(string csv) =>
        Assert.ThrowsAny<Exception>(() => CsvDatasetReader.ReadTable(DatasetCatalog.For<DatasetMetadata>(), Encoding.UTF8.GetBytes(csv)));

    [Fact]
    public void Invalid_utf8_is_rejected() =>
        Assert.Throws<DecoderFallbackException>(() => CsvDatasetReader.ReadTable(DatasetCatalog.For<DatasetMetadata>(), [0xFF, 0xFF]));

    [Fact]
    public void Missing_files_are_reported_as_errors()
    {
        var snapshot = new CsvDatasetReader().Read(Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString("N")));
        Assert.Equal(14, snapshot.LoadIssues.Count);
        Assert.All(snapshot.LoadIssues, i => Assert.Equal("MISSING_FILE", i.Code));
        Assert.False(new DatasetValidator().Validate(snapshot).IsValid);
    }

    [Fact]
    public void Repeated_reads_have_identical_fingerprints_and_cells()
    {
        var first = DatasetFixture.Read();
        var second = DatasetFixture.Read();
        Assert.Equal(first.Fingerprint, second.Fingerprint);
        Assert.Equal(first.FileHashes, second.FileHashes);
        foreach (var t in DatasetCatalog.Tables)
            Assert.Equal(t.Columns.SelectMany(c => first.Records[t.EntityType].Select(c.Read)),
                t.Columns.SelectMany(c => second.Records[t.EntityType].Select(c.Read)));
    }
}
