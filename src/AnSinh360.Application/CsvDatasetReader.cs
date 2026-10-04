using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using AnSinh360.Domain;
using CsvHelper;
using CsvHelper.Configuration;

namespace AnSinh360.Application;

public sealed class CsvDatasetReader
{
    public DatasetSnapshot Read(string directory)
    {
        var snapshot = new DatasetSnapshot();
        using var fingerprint = IncrementalHash.CreateHash(HashAlgorithmName.SHA256);
        foreach (var table in DatasetCatalog.Tables)
        {
            var path = Path.Combine(directory, table.FileName);
            if (!File.Exists(path))
            {
                snapshot.LoadIssues.Add(new("ERROR", "MISSING_FILE", table.FileName, "", "", "Required CSV file is missing."));
                continue;
            }
            var bytes = File.ReadAllBytes(path);
            var hash = Convert.ToHexString(SHA256.HashData(bytes)).ToLowerInvariant();
            snapshot.FileHashes[table.FileName] = hash;
            fingerprint.AppendData(Encoding.UTF8.GetBytes(table.FileName + "\0" + hash + "\n"));
            try
            {
                snapshot.Records[table.EntityType].AddRange(ReadTable(table, bytes));
            }
            catch (Exception ex) when (ex is CsvHelperException or InvalidDataException or DecoderFallbackException)
            {
                snapshot.LoadIssues.Add(new("ERROR", "CSV_FORMAT", table.FileName, "", "", ex.Message));
            }
        }
        snapshot.Fingerprint = Convert.ToHexString(fingerprint.GetHashAndReset()).ToLowerInvariant();
        return snapshot;
    }

    public static IReadOnlyList<object> ReadTable(DatasetTable table, byte[] bytes)
    {
        using var stream = new MemoryStream(bytes);
        using var reader = new StreamReader(stream, new UTF8Encoding(false, true), detectEncodingFromByteOrderMarks: false);
        // A UTF-8 BOM belongs to the file envelope, not the first header.
        if (reader.Peek() == '\uFEFF') reader.Read();
        using var csv = new CsvReader(reader, new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            TrimOptions = TrimOptions.None,
            IgnoreBlankLines = false,
            DetectColumnCountChanges = true,
            Mode = CsvMode.RFC4180,
            ExceptionMessagesContainRawData = false
        });
        if (!csv.Read()) throw new InvalidDataException("CSV is empty.");
        csv.ReadHeader();
        if (!table.Columns.Select(c => c.Name).SequenceEqual(csv.HeaderRecord ?? [], StringComparer.Ordinal))
            throw new InvalidDataException($"Headers must exactly match: {string.Join(',', table.Columns.Select(c => c.Name))}");
        var records = new List<object>();
        while (csv.Read())
        {
            if (csv.Parser.Count != table.Columns.Count)
                throw new InvalidDataException($"Wrong column count at record {csv.Parser.Row}.");
            var entity = Activator.CreateInstance(table.EntityType)!;
            for (var i = 0; i < table.Columns.Count; i++)
            {
                var value = csv.GetField(i) ?? "";
                if (value.Contains('\0')) throw new InvalidDataException($"NUL character at record {csv.Parser.Row}; PostgreSQL text cannot store NUL.");
                table.Columns[i].Property.SetValue(entity, value);
            }
            records.Add(entity);
        }
        return records;
    }
}
