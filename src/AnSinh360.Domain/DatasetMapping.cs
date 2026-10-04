using System.Reflection;

namespace AnSinh360.Domain;

[AttributeUsage(AttributeTargets.Class)]
public sealed class DatasetTableAttribute(string fileName, string tableName, params string[] keys) : Attribute
{
    public string FileName { get; } = fileName;
    public string TableName { get; } = tableName;
    public string[] Keys { get; } = keys;
}

[AttributeUsage(AttributeTargets.Property)]
public sealed class DatasetColumnAttribute(int order, string name) : Attribute
{
    public int Order { get; } = order;
    public string Name { get; } = name;
}

public sealed record DatasetColumn(string Name, PropertyInfo Property)
{
    public string Read(object entity) => (string)Property.GetValue(entity)!;
}

public sealed class DatasetTable(Type entityType)
{
    public Type EntityType { get; } = entityType;
    private DatasetTableAttribute Mapping { get; } = entityType.GetCustomAttribute<DatasetTableAttribute>()!;
    public string FileName => Mapping.FileName;
    public string TableName => Mapping.TableName;
    public IReadOnlyList<DatasetColumn> Columns { get; } = entityType.GetProperties()
        .Where(p => p.IsDefined(typeof(DatasetColumnAttribute)))
        .OrderBy(p => p.GetCustomAttribute<DatasetColumnAttribute>()!.Order)
        .Select(p => new DatasetColumn(p.GetCustomAttribute<DatasetColumnAttribute>()!.Name, p)).ToArray();
    public IEnumerable<DatasetColumn> KeyColumns => Mapping.Keys.Select(k => Columns.Single(c => c.Name == k));
    public string Key(object entity) => System.Text.Json.JsonSerializer.Serialize(KeyColumns.Select(c => c.Read(entity)));
    public object[] KeyValues(object entity) => KeyColumns.Select(c => (object)c.Read(entity)).ToArray();
    public string Value(object entity, string column) => Columns.Single(c => c.Name == column).Read(entity);
}

public static class DatasetCatalog
{
    public static IReadOnlyList<DatasetTable> Tables { get; } = typeof(DatasetCatalog).Assembly.GetTypes()
        .Where(t => t.IsDefined(typeof(DatasetTableAttribute)))
        .Select(t => new DatasetTable(t)).OrderBy(t => t.FileName, StringComparer.Ordinal).ToArray();
    public static DatasetTable For<T>() => Tables.Single(t => t.EntityType == typeof(T));
}
