using AnSinh360.Application;
using AnSinh360.Domain;

namespace AnSinh360.Tests;

public sealed class ImportPlannerTests
{
    [Fact]
    public void Real_dataset_first_import_plan_has_382_inserts_and_second_has_no_changes()
    {
        var data = DatasetFixture.Read();
        var inserts = 0;
        var unchanged = 0;
        foreach (var table in DatasetCatalog.Tables)
        {
            var first = ImportPlanner.Plan(table, data.Records[table.EntityType], []);
            inserts += first.Inserts.Count;
            Assert.Empty(first.Updates);
            // Pure planning verification only. Actual PostgreSQL integration remains a separate test.
            var second = ImportPlanner.Plan(table, data.Records[table.EntityType], first.Inserts);
            Assert.Empty(second.Inserts);
            Assert.Empty(second.Updates);
            unchanged += second.Unchanged;
        }
        Assert.Equal(382, inserts);
        Assert.Equal(382, unchanged);
    }

    [Fact]
    public void Changed_cell_produces_one_update_and_ordinal_case_is_significant()
    {
        var table = DatasetCatalog.For<DatasetMetadata>();
        object[] prior = [new DatasetMetadata { Key = "a", Value = "True", Notes = "original" }];
        object[] next = [new DatasetMetadata { Key = "a", Value = "true", Notes = "original" }];
        var plan = ImportPlanner.Plan(table, next, prior);
        Assert.Single(plan.Updates);
        Assert.Empty(plan.Inserts);
        Assert.Equal(0, plan.Unchanged);
        Assert.Equal("True", ((DatasetMetadata)prior[0]).Value);
    }

    [Fact]
    public void Missing_incoming_rows_are_retained_and_never_deleted()
    {
        var plan = ImportPlanner.Plan(DatasetCatalog.For<DatasetMetadata>(), [], [new DatasetMetadata { Key = "old" }]);
        Assert.Equal(1, plan.Retained);
        Assert.Empty(plan.Updates);
        Assert.Empty(plan.Inserts);
    }

    [Fact]
    public void Composite_enum_keys_allow_same_value_in_different_groups()
    {
        var plan = ImportPlanner.Plan(DatasetCatalog.For<EnumDefinition>(),
            [new EnumDefinition { EnumGroup = "G1", Value = "ACTIVE" }, new EnumDefinition { EnumGroup = "G2", Value = "ACTIVE" }], []);
        Assert.Equal(2, plan.Inserts.Count);
    }

    [Fact]
    public void Duplicate_import_keys_are_rejected() => Assert.Throws<InvalidDataException>(() =>
        ImportPlanner.Plan(DatasetCatalog.For<DatasetMetadata>(), [new DatasetMetadata { Key = "a" }, new DatasetMetadata { Key = "a" }], []));
}
