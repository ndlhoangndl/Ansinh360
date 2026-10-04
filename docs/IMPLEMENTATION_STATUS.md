# Phase 1 implementation status

Date: 2026-10-04 (Asia/Saigon). Dataset: `v1.0-RC1`.

**Phase 1 implementation and offline verification are complete. Live PostgreSQL migration application, real database import, and database idempotency/rollback verification are blocked by local environment.** This is the explicitly approved Docker/WSL exception. Phase 2 has not started.

## 1. Architecture and projects created

A single ASP.NET Core application with a CLI and a shared PostgreSQL data layer; no microservices.

| Project | Responsibility |
|---|---|
| `AnSinh360.Domain` | Fourteen verbatim CSV entity types, natural keys, column catalog |
| `AnSinh360.Application` | RFC 4180 CSV reader, integrity/contract validator, import comparison planner |
| `AnSinh360.Infrastructure` | EF Core/Npgsql context, initial migration, transactional PostgreSQL importer and audit |
| `AnSinh360.Cli` | `validate`, `summary`, `plan`, `migrate`, `import`, `verify-idempotency` |
| `AnSinh360.Api` | `GET /health`, process liveness only |
| `AnSinh360.Tests` | CSV, validator, import-planning, schema, health, and opt-in PostgreSQL tests |

Pinned SDK: .NET 8.0.419. EF Core, relational provider and migration tool: 8.0.25. Npgsql EF provider: 8.0.11. CsvHelper: 33.0.1. Dependency lock files are included. PostgreSQL 16 is configured in Docker Compose. EF/Npgsql setup follows [Npgsql documentation](https://www.npgsql.org/efcore/); migration generation follows [Microsoft EF Core documentation](https://learn.microsoft.com/en-us/ef/core/managing-schemas/migrations/).

## 2. File/folder tree

```text
AnSinh360.sln
global.json
Directory.Build.props
NuGet.Config
compose.yaml
.env.example
.config/
  dotnet-tools.json
src/
  AnSinh360.Domain/
    AnSinh360.Domain.csproj
    DatasetMapping.cs
    DatasetMetadata.cs, OfficialSource.cs, LifeEvent.cs, Policy.cs
    PolicyRule.cs, Service.cs, ServiceRule.cs, Opportunity.cs
    PolicyServiceMap.cs, DatasetTestCase.cs, VerificationLog.cs
    ServiceChecklist.cs, ProfileField.cs, EnumDefinition.cs
    packages.lock.json
  AnSinh360.Application/
    AnSinh360.Application.csproj
    CsvDatasetReader.cs, DatasetSnapshot.cs
    DatasetValidator.cs, ImportPlanner.cs
    packages.lock.json
  AnSinh360.Infrastructure/
    AnSinh360.Infrastructure.csproj
    DatasetDbContext.cs, DatasetDbContextFactory.cs
    ImportBatch.cs, PostgresDatasetImporter.cs
    Migrations/
      20261004071648_InitialDataset.cs
      20261004071648_InitialDataset.Designer.cs
      DatasetDbContextModelSnapshot.cs
    packages.lock.json
  AnSinh360.Cli/
    AnSinh360.Cli.csproj, Program.cs, packages.lock.json
  AnSinh360.Api/
    AnSinh360.Api.csproj, Program.cs, packages.lock.json
tests/
  AnSinh360.Tests/
    AnSinh360.Tests.csproj, DatasetFixture.cs
    CsvReaderTests.cs, ValidatorTests.cs, ImportPlannerTests.cs
    SchemaTests.cs, HealthTests.cs, PostgresIntegrationTests.cs
    packages.lock.json
scripts/
  verify-phase1.ps1
docs/
  00_MAIN_CONTEXT_AN_SINH_360.md/.docx (unchanged)
  IMPLEMENTATION_STATUS.md
  DATABASE_SCHEMA.md
  reports/
    dataset-validation.json, dataset-summary.json, import-plan.json
    initial-migration.sql, source-inspection.json, build.txt
    tests/phase1-tests.trx
data/
  00_README.csv through 13_ENUMS.csv (unchanged)
  AN_SINH_360_DATASET_MASTER.xlsx (unchanged)
references/
  KH_CUOC_THI_2026.docx (unchanged)
  V2_PHU_LUC_BAO_CAO_CUOC_THI.docx (unchanged)
README.md
.gitignore
```

Ignored `bin/`, `obj/`, and inspection scratch files are excluded from this tree.

## 3. Database schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for every table, original column, key and relationship, and [initial-migration.sql](reports/initial-migration.sql) for the exact DDL. Fourteen dataset tables plus `import_batches`, with 12 restrictive foreign keys. All CSV values remain text. Enum definitions have composite key `(enum_group, value)`; every other dataset table uses its original ID/key. Migration generation and pending-model-change check passed without connecting to PostgreSQL. Migration application: **blocked by local environment**.

## 4. Real dataset counts and import status

The reader and validator loaded the real files from `data/`, not mock seed data. There are **382 CSV records** including metadata and verification history. These are source/load counts, **not successful PostgreSQL import counts**.

| CSV | Destination table | Source rows | PostgreSQL import |
|---|---|---:|---|
| `00_README.csv` | `dataset_metadata` | 30 | blocked by local environment |
| `01_SOURCES.csv` | `sources` | 40 | blocked by local environment |
| `02_LIFE_EVENTS.csv` | `life_events` | 3 | blocked by local environment |
| `03_POLICIES.csv` | `policies` | 12 | blocked by local environment |
| `04_POLICY_RULES.csv` | `policy_rules` | 54 | blocked by local environment |
| `05_SERVICES.csv` | `services` | 22 | blocked by local environment |
| `06_SERVICE_RULES.csv` | `service_rules` | 23 | blocked by local environment |
| `07_OPPORTUNITIES.csv` | `opportunities` | 7 | blocked by local environment |
| `08_POLICY_SERVICE_MAP.csv` | `policy_service_maps` | 23 | blocked by local environment |
| `09_TEST_CASES.csv` | `dataset_test_cases` | 20 | blocked by local environment |
| `10_VERIFICATION_LOG.csv` | `verification_logs` | 51 | blocked by local environment |
| `11_SERVICE_CHECKLISTS.csv` | `service_checklists` | 27 | blocked by local environment |
| `12_PROFILE_FIELDS.csv` | `profile_fields` | 41 | blocked by local environment |
| `13_ENUMS.csv` | `enum_definitions` | 29 | blocked by local environment |

Dataset fingerprint: `efee8674f0eae2ea77729b8e3a8142b0cb1a37cf6f801d8ad77b71fd1a55f2bb`. Per-file SHA-256 values are recorded in [dataset-summary.json](reports/dataset-summary.json). All 14 file hashes match the initial inspection. No original CSV, workbook, context or reference document has been edited.

The empty-database import plan contains 382 inserts. The planner test applies those inserts as its comparison baseline and confirms the second plan has 0 inserts, 0 updates, and 382 unchanged rows. This validates planning logic only. The real PostgreSQL importer is implemented; actual import counts are **unverified**, and database idempotency is **blocked by local environment**. No PostgreSQL import success report has been fabricated.

Importer behavior: validate first; reject structural errors; allow warnings; require applied migrations; use one transaction and a PostgreSQL advisory transaction lock; insert missing keys; update only differing original cells using ordinal comparison; retain rows absent from the incoming dataset; record changed imports with source hashes and counts. Unchanged repeats do not create duplicate audit rows. Any database failure rolls back all imported tables and the audit. Rollback and database concurrency behavior require live integration verification.

## 5. Validation errors and warnings

Validation date defaults to the dataset `updated_at` (2026-10-04) for reproducibility. `--as-of` permits an explicit diagnostic date without altering stored dates or statuses.

**0 blocking errors; 84 non-blocking warnings.** Full record-level details are in [dataset-validation.json](reports/dataset-validation.json).

| Code | Count |
|---|---:|
| `ENUM_VALUE_UNDECLARED` | 35 |
| `OFFICIAL_PORTAL_SLUG_ANOMALY` | 1 |
| `OPPORTUNITY_SCHEDULE_UNSPECIFIED` | 1 |
| `PARTIAL_DATE` | 12 |
| `PROFILE_RULE_DERIVED_FIELD_UNRESOLVED` | 2 |
| `PROFILE_RULE_TYPE_MISMATCH` | 4 |
| `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | 12 |
| `SERVICE_RULE_PROFILE_FIELD_UNRESOLVED` | 17 |

Blocking checks cover required files/nonempty tables, required dataset version and update date, exact headers, RFC 4180 record shape, strict UTF-8, PostgreSQL-incompatible NUL, empty/duplicate keys, invalid literal booleans/integers/full dates, broken direct and pipe-list references, unknown life events, missing article provenance for VERIFIED_RULE, source URL syntax, and inverted opportunity intervals. Literal validation never changes the original cell. No eligibility result is calculated.

## Dataset contract issues to resolve before Phase 2

The following **18 PolicyRule-to-ProfileField issues** are retained verbatim and explicitly non-blocking. No `YES`/`NO`, `LEGAL`, money-range, boolean/numeric or date-derived conversion is implemented.

| Rule | Diagnostic | Unresolved contract |
|---|---|---|
| `PR_JOB_002` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_003: rule literal 'true' is outside the exact ENUM domain 'LEGAL&#124;UNLAWFUL&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_003` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_008: rule literal 'false' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_008` | `PROFILE_RULE_DERIVED_FIELD_UNRESOLVED` | 'months_since_termination' has no ProfileField definition or approved derivation contract. |
| `PR_JOB_009` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_009: rule literal 'false' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_012` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_003: rule literal 'true' is outside the exact ENUM domain 'LEGAL&#124;UNLAWFUL&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_013` | `PROFILE_RULE_DERIVED_FIELD_UNRESOLVED` | 'months_since_termination' has no ProfileField definition or approved derivation contract. |
| `PR_JOB_014` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_009: rule literal 'false' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_HOUSE_002` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_HOUSE_003: rule literal 'false' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_HOUSE_005` | `PROFILE_RULE_TYPE_MISMATCH` | PF_HOUSE_006: avg_monthly_actual_income_12m_vnd is MONEY_RANGE (<=25M&#124;25-35M&#124;>35M); rule requires numeric LTE 25000000. No conversion approved. |
| `PR_HOUSE_007` | `PROFILE_RULE_TYPE_MISMATCH` | PF_HOUSE_006: avg_monthly_actual_income_12m_vnd is MONEY_RANGE (<=25M&#124;25-35M&#124;>35M); rule requires numeric LTE 35000000. No conversion approved. |
| `PR_HOUSE_009` | `PROFILE_RULE_TYPE_MISMATCH` | PF_HOUSE_007: couple_total_avg_monthly_actual_income_12m_vnd is MONEY_RANGE (<=50M&#124;>50M); rule requires numeric LTE 50000000. No conversion approved. |
| `PR_CHILD_004` | `PROFILE_RULE_TYPE_MISMATCH` | PF_CHILD_006: total_compulsory_bhxh_months_before_birth is BOOLEAN (true&#124;false); rule requires numeric GTE 12. No conversion approved. |
| `PR_CHILD_011` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_CHILD_004: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_CHILD_013` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_CHILD_011: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_CHILD_014` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_CHILD_012: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_CHILD_016` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_CHILD_014: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_009A` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_005: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |
| `PR_JOB_010A` | `PROFILE_RULE_VALUE_DOMAIN_MISMATCH` | PF_JOB_005: rule literal 'true' is outside the exact ENUM domain 'YES&#124;NO&#124;UNKNOWN'. No conversion approved. |

Seventeen additional **ServiceRule field-contract warnings** were discovered by reading identifier tokens only. Expressions are retained and never evaluated. Fields such as `location`, `is_receiving_unemployment`, and `prefers_offline` do not have exact ProfileField definitions. `policy_match`, pause/resume flags and opportunity-derived fields also lack an approved contract; no alias or derivation is assumed.

| Service rule | Unresolved field |
|---|---|
| `SR001` | Condition field 'policy_match' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR002` | Condition field 'is_receiving_unemployment' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR003` | Condition field 'needs_pause' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR004` | Condition field 'needs_resume' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR005` | Condition field 'is_receiving_unemployment' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR007` | Condition field 'location' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR009` | Condition field 'prefers_offline' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR010` | Condition field 'policy_match' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR011` | Condition field 'location' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR013` | Condition field 'policy_match' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR014` | Condition field 'policy_match' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR016` | Condition field 'policy_match' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR017` | Condition field 'location' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR018` | Condition field 'location' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR019` | Condition field 'location' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR020` | Condition field 'matching_opportunity_status' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |
| `SR021` | Condition field 'no_matching_open_opportunity' has no exact ProfileField definition or approved derived-field/alias contract. Expression preserved and not evaluated. |

Before a matching engine is implemented, approve canonical input types, literal domains, UNKNOWN behavior, money-range boundaries, derived-field names and calendar/time calculations, service-rule aliases, and output-to-input contracts. Existing legal thresholds, articles and procedure records remain untouched. Output parameter rules deliberately do not require a user ProfileField.

## 6. Tests executed and results

`dotnet test AnSinh360.sln -c Release --no-build --no-restore --logger "trx;LogFileName=phase1-tests.trx" --results-directory docs/reports/tests`

Final result: **35 tests total; 32 passed; 0 failed; 3 skipped**. The skipped tests explicitly report **blocked by local environment**. Machine-readable evidence: [phase1-tests.trx](reports/tests/phase1-tests.trx).

Passed coverage includes: real CSV table counts and fingerprints; verbatim ProfileField/PolicyRule/source values; quoted commas, escaped quotes, multiline Vietnamese, whitespace, BOM and empty cells; invalid UTF-8, malformed CSV and missing files; duplicate/empty keys; broken source/policy/service/list references; invalid dates/date intervals; non-mutating contract diagnostics; all money-range mismatches and service-rule aliases; the DATASET provenance marker; output rule fields; 382-row repeat-import planning; changed cells, retained rows and composite enum keys; PostgreSQL EF model/provider/FKs and generated migration SQL; invalid dataset rejection before database access; HTTP 200 liveness with no database.

The three implemented opt-in PostgreSQL tests cover:

1. Migration application, 382-row real import, every original cell, repeat-import idempotency and unchanged audit count.
2. An injected failure during service insertion and rollback of every table plus audit.
3. One-cell update followed by an unchanged repeat import.

Set `AS360_TEST_CONNECTION_STRING` only for a dedicated local PostgreSQL instance/account with CREATEDB. Tests create randomly named `as360_test_*` databases and drop only those generated test databases after execution. The 20 supplied journey test cases are loaded as dataset records, not executed as matching tests; a matching engine is outside this phase.

## 7. dotnet build result

`dotnet build AnSinh360.sln -c Release --no-restore` succeeded: **0 warnings, 0 errors**. Evidence: [build.txt](reports/build.txt). SDK 8.0.419. The EF Core relational reference is explicitly aligned at 8.0.25 to avoid a transitive assembly-version mismatch. `dotnet ef migrations has-pending-model-changes` confirms no model drift from the generated migration.

## 8. Exact commands to reproduce locally

Run these commands in PowerShell from the repository root. The installed SDK on this machine is outside PATH; the script automatically finds `%USERPROFILE%/.dotnet/dotnet.exe`. On other machines, install the .NET 8 SDK and put `dotnet` on PATH.

### Offline build, validation and tests

```powershell
Set-Location -LiteralPath "D:\Ý tưởng dự án Liên Chiểu"
./scripts/verify-phase1.ps1
```

This runs locked NuGet restore, local EF tool restore, Release build, real-file validation/summary/import plan, migration drift check/SQL generation and all tests. Warnings do not produce a failure exit code. PostgreSQL tests are explicitly skipped when their connection variable is unset.

### PostgreSQL import and integration verification once Docker is repaired

```powershell
Copy-Item -LiteralPath .env.example -Destination .env
# Edit .env and replace POSTGRES_PASSWORD before starting PostgreSQL.
docker compose up -d --wait postgres

$localPassword = Read-Host 'PostgreSQL password used in .env'
$env:AS360_CONNECTION_STRING = "Host=localhost;Port=5432;Database=ansinh360;Username=ansinh360;Password=$localPassword"
$env:AS360_TEST_CONNECTION_STRING = "Host=localhost;Port=5432;Database=postgres;Username=ansinh360;Password=$localPassword"
./scripts/verify-phase1.ps1 -WithPostgres
```

If `POSTGRES_PORT` is changed in `.env`, use the same port in both connection strings. The Compose account is the local PostgreSQL administrator created by the image. `.env` is ignored by Git; credentials are not committed. To stop the container while retaining data: `docker compose stop postgres`.

Individual commands after the offline build:

```powershell
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- validate --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- summary --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- plan --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- migrate
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- import --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- verify-idempotency --data data
dotnet run --project src/AnSinh360.Cli -c Release --no-build -- summary --database
dotnet run --project src/AnSinh360.Api -c Release --no-build -- --urls http://localhost:5080
# In another terminal:
Invoke-RestMethod http://localhost:5080/health
```

On this machine, replace `dotnet` in individual commands with `& "$env:USERPROFILE/.dotnet/dotnet.exe"` if needed. `GET /health` is process liveness only and remains available while PostgreSQL is unavailable. Exit codes: 0 success (including warnings), 1 execution/configuration failure, 2 dataset integrity failure, 3 failed database idempotency verification.

Migration regeneration is unnecessary for normal reproduction. The existing migration can be applied with `migrate`; SQL generation is offline.

## 9. Dataset inconsistencies discovered

- The 18 policy/profile and 17 service/profile representation issues are listed above, all non-blocking.
- The enum catalog is incomplete: source `legal_status` contains operational statuses such as CURRENT_SERVICE/CLOSED_OPPORTUNITY; one source level is A0/A1; eight service-type cells and two verification-log statuses are outside their exact enum groups. There are 35 such cell warnings. No new enum definitions are synthesized.
- Twelve publication-date cells contain only a year or year/month. They remain text with partial-date warnings.
- `OPP_JOB_001` is ACTIVE_RECURRING with empty opening/closing dates; retain it and refresh the actual schedule before use.
- `SRC_JOB_DN_001` has the approved portal-slug anomaly. Preserve its URL and VERIFIED_OFFICIAL. The portal-content verification is supplied by the user; this run does not independently certify legal/source contents.
- Verification history contains earlier and later entries for the superseded housing source on the same date. Preserve log order/IDs and history; do not treat every historical entry as the current source status.
- Workbook inspection found only empty trailing source-sheet rows and formatting differences (numeric Excel values such as 100.0 versus CSV 100). There are no substantive local workbook/CSV content differences after accounting for those representations. No workbook value is used to replace a CSV value.

No genuine legal/business-data conflict has been established by these structural checks. Legal eligibility, source authenticity, procedure semantics and authoritative conflict resolution are not inferred by the importer.

## 10. Decisions and assumptions

- Latest user execution scope takes precedence over the wider roadmap in the baseline documents. Only Phase 1 is implemented.
- `data/*.csv` is the import input. Local workbook, main context and reference DOCX files were inspected; a live Google Sheet refresh is not performed.
- Store original decoded UTF-8 CSV cells, not CSV quoting syntax or BOM bytes. Original file hashes retain byte-level provenance. No trim, casing normalization, pipe expansion, enum conversion, number/date coercion or rule evaluation is performed.
- Empty strings remain empty; partial dates remain partial. All statuses, historical sources and logs are retained.
- Database imports update changed keys and retain missing rows; no implicit deletion or snapshot replacement. Successful changed runs receive an audit row; an identical repeat does not.
- Validation checks integrity and representation only. It does not authorize a recommendation or replace team legal/source sign-off.
- Docker/WSL availability is an environmental exception explicitly approved by the user. Do not replace PostgreSQL with SQLite, an in-memory database or a different architecture.
- Health is process liveness; summary is CLI output from CSV or PostgreSQL, labeled by source. No navigation API is created.

## 11. Review before Phase 2

1. Restore Docker/WSL externally, then run `./scripts/verify-phase1.ps1 -WithPostgres` to close live migration/import/idempotency/rollback verification.
2. Formally approve and normalize all policy/profile and service/profile contracts above before implementing a matching engine.
3. Reconcile the partial enum catalog, partial-date policy, dataset-level provenance marker, historical log ordering and recurring schedule representation.
4. Perform the baseline team legal/source sign-off and source archive/refresh steps before using data in recommendations.
5. Review the intentional raw-text archival schema and retention behavior when planning any future normalized evaluation models.

**Phase 1 stop point:** Phase 2 backend is not implemented. At that checkpoint, no Policy Matching Engine, Service Resolver, opportunity matching, `POST /api/navigate`, frontend/Next.js or AI/LLM integration had been added.

## Frontend demo priority — 04/10/2026

The user's subsequent frontend-first request superseded contract sync for this run. A standalone Next.js/React/TypeScript/Tailwind competition demo now exists in `apps/web`, using local JSON generated from the existing CSVs. Backend Phase 1 code, schema, migration and Docker/PostgreSQL architecture were not changed. Original CSVs were not changed or normalized.

The demo implements three journey cards, the five-question/four-screen job-loss flow, housing and child previews, official sources, local checklist interaction and visual-only reminders. It uses an explicit sample scenario and the dataset snapshot date, without implementing the backend matching engine. Frontend tests: **6 passed**; TypeScript and production Webpack build passed; dev startup and production browser QA at 390 × 844 / 1280 × 900 passed.

See [frontend demo report](frontend/DEMO_REPORT.md) for routes, run commands, screenshots, scope and limitations. The earlier Docker-dependent backend verification remains blocked by the local environment; its status is unchanged. Dataset contract issues listed above remain pending repository normalization and review before backend Phase 2.

**STOP: frontend demo scope completed; backend Phase 2 and contract sync have not continued.**

### Frontend redesign follow-up

The existing demo has been redesigned in place: single column with 800px desktop content, four job question screens (BHTN and contribution category share one screen), a progressive 1.9-second analysis screen, reasons and unresolved conditions in the policy card, a dedicated service card and four action cards. Housing/child flows and the original legal dataset are retained. Unknown/negative facts use verification indicators rather than confirmed green checks. Production build and TypeScript passed; **8 tests passed**; mobile and desktop interaction checks passed. See [redesign report](frontend/REDESIGN_REPORT.md). No backend, database, API, AI or authentication was added. Work stopped after the requested redesign.

## Final frontend demo polish — 04/10/2026

Completed the authorized frontend-only polish pass. Four single-question screens, deterministic 1.9-second analysis, concise result explanation, official provenance, service/opportunity cards, four action cards, preselected 60-second demo shortcut and persistent recording mode are implemented. Manual missing contribution months remain unresolved; no conversion or legal-data change was introduced. Dev/build use the committed JSON snapshot without CSV parsing. Nine tests and production build passed; clean npm install/dev/build verified. Vercel configuration and npm lockfile added; deployment has not been performed. See `docs/frontend/POLISH_REPORT.md`. Phase 2 backend remains outside this request.

## Frontend navigation and demo copy correction

Replaced the internal pipeline stepper with four user-facing stages: Tình huống → Một vài câu hỏi → Dành cho bạn → Việc cần làm. Analysis remains a 1.9-second transition within stage 2; question count is separately labeled Câu 1/4. Results contain all policy/service/opportunity outputs. The product mechanism module is explanation only. Requested Vietnamese copy updated throughout. Existing single-page query routing, recording mode and sample behavior retained. TypeScript, nine tests and npm production build passed. See `docs/frontend/NAVIGATION_COPY_REPORT.md`. Scope remains frontend UX/copy only.

## Frontend explainability and actionability pass

Completed frontend-only guidance for the three existing journeys. Added answer-only situation summaries, clear recommendation status, reasons, missing-information sections, plain-language explanations, high-level preparation checklists and immediate actions before official sources. Job preparation marks persist into its timed action cards. Family actions use the selected service's reception guidance. Rental never inherits purchase paperwork or unprovided residency/income facts. Four-stage user navigation retained. npm production build, TypeScript and 12/12 frontend tests passed; mobile flows verified. Source datasets, canonical URLs, legal definitions and backend scope remain unchanged. See `docs/frontend/EXPLAINABILITY_REPORT.md`.

## Frontend action-first UX — 04/10/2026

Completed result and personal to-do redesign for the three existing demo journeys. Housing group answers reuse the approved dataset enum verbatim and remain self reported. Early-stage housing shows prerequisite decisions, not a dossier to submit. Hòa Hiệp 4 remains SCHEDULED in the fixed snapshot. One primary CTA per result/action view; official provenance is collapsed at the end. No backend, API, AI, authentication, database or source/legal data changes. TypeScript, 13 frontend tests and npm production build passed. Browser QA and screenshots recorded in [ACTION_FIRST_REPORT.md](frontend/ACTION_FIRST_REPORT.md). Stopped at this requested UX pass.

## Final frontend demo UX refinement — 04/10/2026

Completed the final competition UX pass. Four-step navigation and four initial job questions retained. Added practical preparation categories, information-origin guidance, dataset-backed providers/submission channels, and concise execution steps. Missing termination information reuses the existing approved enum without semantic conversion or policy execution. One primary CTA per major screen; redundant input and explanations reduced, judge explanation and provenance collapsed. TypeScript and 14 frontend tests passed; final npm build passed. Standalone Vercel configuration remains available; no deployment performed. No backend, CSV, legal-rule or canonical-source edits. See [final report](frontend/FINAL_UX_REFINEMENT_REPORT.md). Stopped after the requested refinement.
