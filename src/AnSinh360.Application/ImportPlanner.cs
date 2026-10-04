using AnSinh360.Domain;

namespace AnSinh360.Application;

public sealed record TableImportPlan(DatasetTable Table, IReadOnlyList<object> Inserts, IReadOnlyList<object> Updates, int Unchanged, int Retained);
public sealed record TableImportCount(int Inserted, int Updated, int Unchanged, int Retained);
public sealed record ImportResult(string Fingerprint, Guid? ImportBatchId, IReadOnlyDictionary<string, TableImportCount> Tables)
{
    public int Inserted => Tables.Values.Sum(t => t.Inserted);
    public int Updated => Tables.Values.Sum(t => t.Updated);
    public int Unchanged => Tables.Values.Sum(t => t.Unchanged);
}

/// <summary>Compares original cell strings using ordinal equality. Never deletes or interprets rules.</summary>
public static class ImportPlanner
{
    public static TableImportPlan Plan(DatasetTable table, IReadOnlyList<object> incoming, IReadOnlyList<object> existing)
    {
        var old = existing.ToDictionary(table.Key, StringComparer.Ordinal);
        var seen = new HashSet<string>(StringComparer.Ordinal);
        var inserts = new List<object>();
        var updates = new List<object>();
        var unchanged = 0;
        foreach (var row in incoming)
        {
            var key = table.Key(row);
            if (!seen.Add(key)) throw new InvalidDataException($"Duplicate key in {table.FileName}: {key}");
            if (!old.TryGetValue(key, out var prior)) inserts.Add(row);
            else if (table.Columns.Any(c => !string.Equals(c.Read(row), c.Read(prior), StringComparison.Ordinal))) updates.Add(row);
            else unchanged++;
        }
        return new(table, inserts, updates, unchanged, old.Keys.Count(k => !seen.Contains(k)));
    }
}
