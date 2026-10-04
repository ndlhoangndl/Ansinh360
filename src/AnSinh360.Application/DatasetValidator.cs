using System.Globalization;
using System.Text.RegularExpressions;
using AnSinh360.Domain;

namespace AnSinh360.Application;

/// <summary>Structural integrity and contract diagnostics only. Never evaluates eligibility or converts facts.</summary>
public sealed class DatasetValidator
{
    public ValidationReport Validate(DatasetSnapshot data, DateOnly? asOf = null)
    {
        var issues = new List<ValidationIssue>(data.LoadIssues);
        var dateText = data.Rows<DatasetMetadata>().FirstOrDefault(r => r.Key == "updated_at")?.Value;
        var validMetadataDate = DateOnly.TryParseExact(dateText, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var d);
        DateOnly? date = asOf ?? (validMetadataDate ? d : null);
        if (!validMetadataDate)
            issues.Add(new("ERROR", "INVALID_DATASET_METADATA", "00_README.csv", "updated_at", "value", "Dataset updated_at must be a full ISO date; no fallback date is invented."));
        if (string.IsNullOrWhiteSpace(data.Version))
            issues.Add(new("ERROR", "INVALID_DATASET_METADATA", "00_README.csv", "dataset_version", "value", "Dataset version is required."));
        void Issue(string severity, string code, DatasetTable table, object row, string field, string message) =>
            issues.Add(new(severity, code, table.FileName, string.Join('|', table.KeyColumns.Select(c => c.Read(row))), field, message));
        void Warn<T>(string code, T row, string field, string message) where T : class => Issue("WARNING", code, DatasetCatalog.For<T>(), row, field, message);
        void Error<T>(string code, T row, string field, string message) where T : class => Issue("ERROR", code, DatasetCatalog.For<T>(), row, field, message);

        foreach (var table in DatasetCatalog.Tables)
        {
            if (data.Records[table.EntityType].Count == 0)
                issues.Add(new("ERROR", "EMPTY_TABLE", table.FileName, "", "", "Required dataset table has no records."));
            var seen = new HashSet<string>(StringComparer.Ordinal);
            foreach (var row in data.Records[table.EntityType])
            {
                foreach (var key in table.KeyColumns)
                    if (string.IsNullOrWhiteSpace(key.Read(row))) Issue("ERROR", "EMPTY_KEY", table, row, key.Name, "Natural key must not be empty.");
                if (!seen.Add(table.Key(row))) Issue("ERROR", "DUPLICATE_KEY", table, row, "", "Duplicate natural key.");
                foreach (var column in table.Columns)
                {
                    var value = column.Read(row);
                    if (value.Length == 0) continue;
                    if (column.Name is "primary_demo" or "required" or "persist_default" or "active")
                        if (!bool.TryParse(value, out _)) Issue("ERROR", "INVALID_BOOLEAN", table, row, column.Name, "Expected a boolean literal; original text is preserved.");
                    if (column.Name is "priority" or "capacity" or "item_order")
                        if (!int.TryParse(value, NumberStyles.None, CultureInfo.InvariantCulture, out _)) Issue("ERROR", "INVALID_INTEGER", table, row, column.Name, "Expected a non-negative integer literal; original text is preserved.");
                    if (column.Name is "published_at" or "effective_from" or "effective_to" or "last_verified_at" or "last_verified" or "checked_at" or "open_from" or "open_until")
                    {
                        if (column.Name == "published_at" && (Regex.IsMatch(value, @"^\d{4}$") || Regex.IsMatch(value, @"^\d{4}-(0[1-9]|1[0-2])$")))
                            Issue("WARNING", "PARTIAL_DATE", table, row, column.Name, $"Partial date '{value}' preserved without inventing a day.");
                        else if (!DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
                            Issue("ERROR", "INVALID_DATE", table, row, column.Name, $"Invalid ISO date '{value}'.");
                    }
                }
            }
        }

        var sources = data.Rows<OfficialSource>().Select(x => x.SourceId).ToHashSet(StringComparer.Ordinal);
        var policies = data.Rows<Policy>().Select(x => x.PolicyId).ToHashSet(StringComparer.Ordinal);
        var services = data.Rows<Service>().Select(x => x.ServiceId).ToHashSet(StringComparer.Ordinal);
        var events = data.Rows<LifeEvent>().Select(x => x.LifeEventId).ToHashSet(StringComparer.Ordinal);
        var profiles = data.Rows<ProfileField>().Select(x => x.FieldName).ToHashSet(StringComparer.Ordinal);
        var ruleIds = data.Rows<PolicyRule>().Select(x => x.RuleId).Concat(data.Rows<ServiceRule>().Select(x => x.RuleId)).ToHashSet(StringComparer.Ordinal);
        void Ref<T>(T row, string field, string value, HashSet<string> allowed, bool optional = false, bool multi = false) where T : class
        {
            if (optional && value == "") return;
            foreach (var id in multi ? value.Split('|') : [value])
                if (!allowed.Contains(id)) Error("BROKEN_REFERENCE", row, field, $"Unknown reference '{id}'.");
        }
        foreach (var table in DatasetCatalog.Tables)
            foreach (var row in data.Records[table.EntityType])
                foreach (var column in table.Columns.Where(c => c.Name is "journey" or "event"))
                    if (column.Read(row) != "ALL" && !events.Contains(column.Read(row)))
                        Issue("ERROR", "UNKNOWN_LIFE_EVENT", table, row, column.Name, $"Unknown life event '{column.Read(row)}'.");
        foreach (var p in data.Rows<Policy>()) Ref(p, "legal_source_id", p.LegalSourceId, sources);
        foreach (var r in data.Rows<PolicyRule>())
        {
            Ref(r, "policy_id", r.PolicyId, policies);
            Ref(r, "source_id", r.SourceId, sources);
            if (r.VerificationStatus == "VERIFIED_RULE" && string.IsNullOrWhiteSpace(r.SourceArticle))
                Error("MISSING_RULE_PROVENANCE", r, "source_article", "VERIFIED_RULE requires article/clause provenance.");
        }
        foreach (var s in data.Rows<Service>()) Ref(s, "source_id", s.SourceId, sources);
        foreach (var r in data.Rows<ServiceRule>()) Ref(r, "service_id", r.ServiceId, services);
        foreach (var m in data.Rows<PolicyServiceMap>()) { Ref(m, "policy_id", m.PolicyId, policies); Ref(m, "service_id", m.ServiceId, services); }
        foreach (var c in data.Rows<ServiceChecklist>()) { Ref(c, "service_id", c.ServiceId, services); Ref(c, "source_id", c.SourceId, sources); }
        foreach (var p in data.Rows<ProfileField>()) Ref(p, "source_rule_ids", p.SourceRuleIds, ruleIds, optional: true, multi: true);
        foreach (var t in data.Rows<DatasetTestCase>())
        {
            Ref(t, "expected_policies", t.ExpectedPolicies, policies, optional: true, multi: true);
            Ref(t, "expected_services", t.ExpectedServices, services, optional: true, multi: true);
            Ref(t, "expected_missing_fields", t.ExpectedMissingFields, profiles, optional: true, multi: true);
        }
        foreach (var log in data.Rows<VerificationLog>())
            if (log.SourceId != "DATASET") Ref(log, "source_id", log.SourceId, sources);
        foreach (var s in data.Rows<OfficialSource>())
        {
            Ref(s, "supersedes", s.Supersedes, sources, optional: true, multi: true);
            Ref(s, "superseded_by", s.SupersededBy, sources, optional: true, multi: true);
            if (!Uri.TryCreate(s.CanonicalUrl, UriKind.Absolute, out var url) || url.Scheme is not ("https" or "http"))
                Error("INVALID_SOURCE_URL", s, "canonical_url", "Source must have an absolute HTTP(S) URL.");
            if (s.SourceId == "SRC_JOB_DN_001" && s.CanonicalUrl == "https://cttdt.danangportal.gov.vn/vi/web/dng/w/so-xay-dung")
                Warn("OFFICIAL_PORTAL_SLUG_ANOMALY", s, "canonical_url", "Official portal slug is semantically inconsistent with current rendered page title/content. User verified this official source; preserve canonical_url and VERIFIED_OFFICIAL.");
        }
        foreach (var o in data.Rows<Opportunity>())
        {
            Ref(o, "policy_id", o.PolicyId, policies); Ref(o, "service_id", o.ServiceId, services); Ref(o, "source_id", o.SourceId, sources);
            var hasFrom = DateOnly.TryParseExact(o.OpenFrom, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var from);
            var hasUntil = DateOnly.TryParseExact(o.OpenUntil, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var until);
            if (hasFrom && hasUntil && from > until) Error("INVALID_DATE_INTERVAL", o, "open_until", "Closing date precedes opening date.");
            if (!hasFrom || !hasUntil) Warn("OPPORTUNITY_SCHEDULE_UNSPECIFIED", o, "open_from|open_until", "Opening/closing schedule is incomplete; retained verbatim. Refresh before Phase 2 use.");
            if (date.HasValue && hasFrom && hasUntil && ((o.Status == "OPEN" && (date.Value < from || date.Value > until)) || (o.Status == "SCHEDULED" && date.Value >= from)))
                Warn("OPPORTUNITY_STATUS_REVIEW", o, "status", $"Stored status needs review as of {date.Value:yyyy-MM-dd}; no automatic status change.");
        }

        foreach (var group in data.Rows<ProfileField>().GroupBy(p => p.FieldName).Where(g => g.Count() > 1))
            foreach (var p in group) Warn("PROFILE_FIELD_AMBIGUOUS", p, "field_name", "Multiple profile definitions use this field name; no definition is selected automatically.");
        foreach (var r in data.Rows<PolicyRule>().Where(r => r.LogicConnector != "OUTPUT"))
        {
            var definitions = data.Rows<ProfileField>().Where(p => p.FieldName == r.Field).ToArray();
            if (definitions.Length == 0)
            {
                Warn("PROFILE_RULE_DERIVED_FIELD_UNRESOLVED", r, "field", $"'{r.Field}' has no ProfileField definition or approved derivation contract.");
                continue;
            }
            if (definitions.Length != 1) continue;
            var p = definitions[0];
            if (r.Operator is "GTE" or "LTE" or "GT" or "LT" && p.DataType is not ("INTEGER" or "DECIMAL"))
                Warn("PROFILE_RULE_TYPE_MISMATCH", r, "field|operator|value", $"{p.FieldId}: {p.FieldName} is {p.DataType} ({p.AllowedValues}); rule requires numeric {r.Operator} {r.Value}. No conversion approved.");
            if (p.DataType == "ENUM" && r.Operator is "EQ" or "IN" && r.Value.Split('|').Any(v => !p.AllowedValues.Split('|').Contains(v, StringComparer.Ordinal)))
                Warn("PROFILE_RULE_VALUE_DOMAIN_MISMATCH", r, "value", $"{p.FieldId}: rule literal '{r.Value}' is outside the exact ENUM domain '{p.AllowedValues}'. No conversion approved.");
        }

        // Read identifier tokens for contract diagnostics only. Conditions are never evaluated.
        foreach (var r in data.Rows<ServiceRule>())
            foreach (var field in Regex.Matches(r.Condition, @"\b([a-z][a-z0-9_]*)\s*(?:>=|<=|!=|=|<|>)")
                .Select(m => m.Groups[1].Value).Distinct(StringComparer.Ordinal))
                if (!profiles.Contains(field))
                    Warn("SERVICE_RULE_PROFILE_FIELD_UNRESOLVED", r, "condition", $"Condition field '{field}' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated.");

        // The supplied enum catalog is partial. Catalog gaps are representation warnings, not new enum values.
        void EnumCheck<T>(T row, string field, string group, string value) where T : class
        {
            if (!data.Rows<EnumDefinition>().Any(e => e.EnumGroup == group && e.Value == value))
                Warn("ENUM_VALUE_UNDECLARED", row, field, $"'{value}' is not declared in enum group {group}; preserved verbatim.");
        }
        foreach (var s in data.Rows<OfficialSource>()) { EnumCheck(s, "source_level", "SOURCE_LEVEL", s.SourceLevel); EnumCheck(s, "verification_status", "VERIFY_STATUS", s.VerificationStatus); EnumCheck(s, "legal_status", "LEGAL_STATUS", s.LegalStatus); }
        foreach (var s in data.Rows<Service>()) { EnumCheck(s, "service_type", "SERVICE_TYPE", s.ServiceType); EnumCheck(s, "status", "SERVICE_STATUS", s.Status); }
        foreach (var o in data.Rows<Opportunity>()) EnumCheck(o, "status", "OPPORTUNITY_STATUS", o.Status);
        foreach (var r in data.Rows<PolicyRule>()) EnumCheck(r, "verification_status", "VERIFY_STATUS", r.VerificationStatus);
        foreach (var c in data.Rows<ServiceChecklist>()) EnumCheck(c, "verification_status", "VERIFY_STATUS", c.VerificationStatus);
        foreach (var log in data.Rows<VerificationLog>()) EnumCheck(log, "verification_status", "VERIFY_STATUS", log.VerificationStatus);

        return new(data.Version, data.Fingerprint, date, data.Counts, issues);
    }
}
