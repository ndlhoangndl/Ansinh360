using AnSinh360.Application;

namespace AnSinh360.Tests;

internal static class DatasetFixture
{
    public static string DataDirectory => Path.Combine(AppContext.BaseDirectory, "data");
    public static DatasetSnapshot Read() => new CsvDatasetReader().Read(DataDirectory);
}
