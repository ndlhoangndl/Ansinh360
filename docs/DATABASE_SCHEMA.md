# Phase 1 database schema

PostgreSQL schema: `dataset`. All original CSV columns are required PostgreSQL `text` columns. An empty CSV cell is stored as the empty string, never converted to null. C# entities expose the original cells as strings. This preserves identifiers, partial dates, boolean spelling, ranges, expressions and provenance without semantic normalization.

The exact generated DDL is in [initial-migration.sql](reports/initial-migration.sql). The EF migration and model snapshot are committed under `src/AnSinh360.Infrastructure/Migrations/`.

## Dataset tables

### `dataset_metadata`

Source: `data/00_README.csv`. Natural primary key: `key`. Real source rows: **30**.

Columns: `key`, `value`, `notes`.

### `sources`

Source: `data/01_SOURCES.csv`. Natural primary key: `source_id`. Real source rows: **40**.

Columns: `source_id`, `journey`, `title`, `document_number`, `source_type`, `source_level`, `issuing_authority`, `publisher`, `canonical_url`, `published_at`, `effective_from`, `effective_to`, `verification_status`, `last_verified_at`, `notes`, `legal_status`, `supersedes`, `superseded_by`, `archive_status`.

### `life_events`

Source: `data/02_LIFE_EVENTS.csv`. Natural primary key: `life_event_id`. Real source rows: **3**.

Columns: `life_event_id`, `name`, `description`, `primary_demo`, `status`.

### `policies`

Source: `data/03_POLICIES.csv`. Natural primary key: `policy_id`. Real source rows: **12**.

Columns: `policy_id`, `policy_name`, `journey`, `category`, `target_group`, `summary`, `legal_source_id`, `effective_from`, `effective_to`, `status`, `last_verified`.

### `policy_rules`

Source: `data/04_POLICY_RULES.csv`. Natural primary key: `rule_id`. Real source rows: **54**.

Columns: `rule_id`, `policy_id`, `rule_group`, `logic_connector`, `field`, `operator`, `value`, `required`, `match_reason`, `missing_reason`, `source_id`, `source_article`, `verification_status`, `notes`.

### `services`

Source: `data/05_SERVICES.csv`. Natural primary key: `service_id`. Real source rows: **22**.

Columns: `service_id`, `service_name`, `service_type`, `journey`, `supported_intents`, `provider`, `location`, `online_url`, `procedure_code`, `address`, `phone`, `status`, `source_id`, `last_verified`, `processing_time`, `fee`, `submission_channels`, `result_or_action`, `freshness_rule`.

### `service_rules`

Source: `data/06_SERVICE_RULES.csv`. Natural primary key: `rule_id`. Real source rows: **23**.

Columns: `rule_id`, `event`, `intent`, `condition`, `service_id`, `priority`, `status`.

### `opportunities`

Source: `data/07_OPPORTUNITIES.csv`. Natural primary key: `opportunity_id`. Real source rows: **7**.

Columns: `opportunity_id`, `policy_id`, `service_id`, `name`, `location`, `open_from`, `open_until`, `capacity`, `status`, `source_id`, `last_verified`, `notes`.

### `policy_service_maps`

Source: `data/08_POLICY_SERVICE_MAP.csv`. Natural primary key: `map_id`. Real source rows: **23**.

Columns: `map_id`, `policy_id`, `service_id`, `intent`, `priority`, `notes`.

### `dataset_test_cases`

Source: `data/09_TEST_CASES.csv`. Natural primary key: `test_id`. Real source rows: **20**.

Columns: `test_id`, `journey`, `input_summary`, `expected_policies`, `expected_services`, `expected_missing_fields`, `expected_result`, `status`.

### `verification_logs`

Source: `data/10_VERIFICATION_LOG.csv`. Natural primary key: `log_id`. Real source rows: **51**.

Columns: `log_id`, `source_id`, `checked_at`, `verification_status`, `note`, `checked_by`.

### `service_checklists`

Source: `data/11_SERVICE_CHECKLISTS.csv`. Natural primary key: `checklist_id`. Real source rows: **27**.

Columns: `checklist_id`, `service_id`, `item_order`, `requirement_type`, `document_or_step`, `required`, `condition`, `source_id`, `source_detail`, `verification_status`, `notes`.

### `profile_fields`

Source: `data/12_PROFILE_FIELDS.csv`. Natural primary key: `field_id`. Real source rows: **41**.

Columns: `field_id`, `journey`, `field_name`, `question_vi`, `data_type`, `allowed_values`, `required_when`, `source_rule_ids`, `sensitivity`, `persist_default`, `notes`.

### `enum_definitions`

Source: `data/13_ENUMS.csv`. Natural primary key: `enum_group`, `value`. Real source rows: **29**.

Columns: `enum_group`, `value`, `label_vi`, `meaning`, `active`.

## Import audit

`dataset.import_batches`: `id uuid` primary key; `dataset_version text`; `fingerprint varchar(64)` indexed; `imported_at timestamp with time zone`; `file_hashes jsonb`; `counts jsonb`. An unchanged repeat import does not add another audit row. Changed imports retain audit history. Original-file SHA-256 hashes are stored independently from table statistics.

## Foreign keys and indexes

All 12 foreign keys use `ON DELETE RESTRICT`:

- `policies.legal_source_id` → `sources.source_id`
- `policy_rules.policy_id` → `policies.policy_id`
- `policy_rules.source_id` → `sources.source_id`
- `services.source_id` → `sources.source_id`
- `service_rules.service_id` → `services.service_id`
- `opportunities.policy_id` → `policies.policy_id`
- `opportunities.service_id` → `services.service_id`
- `opportunities.source_id` → `sources.source_id`
- `policy_service_maps.policy_id` → `policies.policy_id`
- `policy_service_maps.service_id` → `services.service_id`
- `service_checklists.service_id` → `services.service_id`
- `service_checklists.source_id` → `sources.source_id`

Foreign-key indexes are generated by EF. Additional indexes cover profile field names, policy rule fields, source verification status, opportunity status, verification-log source IDs, and import fingerprints.

`journey=ALL`, source supersession lists, profile rule-ID lists, and expected policy/service/field lists remain verbatim strings. Their references are checked by the validator. `verification_logs.source_id` includes the dataset-level marker `DATASET`, so it intentionally has no source foreign key; all other values must reference an existing source. No synthetic source or life-event row is invented.

EF additionally maintains its migration-history table in the default database schema. Database creation and migration application have not been verified on a live PostgreSQL server in this run.
