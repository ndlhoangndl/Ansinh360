CREATE TABLE IF NOT EXISTS "__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL,
    CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId")
);

START TRANSACTION;

DO $EF$
BEGIN
    IF NOT EXISTS(SELECT 1 FROM pg_namespace WHERE nspname = 'dataset') THEN
        CREATE SCHEMA dataset;
    END IF;
END $EF$;

CREATE TABLE dataset.dataset_metadata (
    key text NOT NULL,
    value text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_dataset_metadata" PRIMARY KEY (key)
);

CREATE TABLE dataset.dataset_test_cases (
    test_id text NOT NULL,
    journey text NOT NULL,
    input_summary text NOT NULL,
    expected_policies text NOT NULL,
    expected_services text NOT NULL,
    expected_missing_fields text NOT NULL,
    expected_result text NOT NULL,
    status text NOT NULL,
    CONSTRAINT "PK_dataset_test_cases" PRIMARY KEY (test_id)
);

CREATE TABLE dataset.enum_definitions (
    enum_group text NOT NULL,
    value text NOT NULL,
    label_vi text NOT NULL,
    meaning text NOT NULL,
    active text NOT NULL,
    CONSTRAINT "PK_enum_definitions" PRIMARY KEY (enum_group, value)
);

CREATE TABLE dataset.import_batches (
    id uuid NOT NULL,
    dataset_version text NOT NULL,
    fingerprint character varying(64) NOT NULL,
    imported_at timestamp with time zone NOT NULL,
    file_hashes jsonb NOT NULL,
    counts jsonb NOT NULL,
    CONSTRAINT "PK_import_batches" PRIMARY KEY (id)
);

CREATE TABLE dataset.life_events (
    life_event_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    primary_demo text NOT NULL,
    status text NOT NULL,
    CONSTRAINT "PK_life_events" PRIMARY KEY (life_event_id)
);

CREATE TABLE dataset.profile_fields (
    field_id text NOT NULL,
    journey text NOT NULL,
    field_name text NOT NULL,
    question_vi text NOT NULL,
    data_type text NOT NULL,
    allowed_values text NOT NULL,
    required_when text NOT NULL,
    source_rule_ids text NOT NULL,
    sensitivity text NOT NULL,
    persist_default text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_profile_fields" PRIMARY KEY (field_id)
);

CREATE TABLE dataset.sources (
    source_id text NOT NULL,
    journey text NOT NULL,
    title text NOT NULL,
    document_number text NOT NULL,
    source_type text NOT NULL,
    source_level text NOT NULL,
    issuing_authority text NOT NULL,
    publisher text NOT NULL,
    canonical_url text NOT NULL,
    published_at text NOT NULL,
    effective_from text NOT NULL,
    effective_to text NOT NULL,
    verification_status text NOT NULL,
    last_verified_at text NOT NULL,
    notes text NOT NULL,
    legal_status text NOT NULL,
    supersedes text NOT NULL,
    superseded_by text NOT NULL,
    archive_status text NOT NULL,
    CONSTRAINT "PK_sources" PRIMARY KEY (source_id)
);

CREATE TABLE dataset.verification_logs (
    log_id text NOT NULL,
    source_id text NOT NULL,
    checked_at text NOT NULL,
    verification_status text NOT NULL,
    note text NOT NULL,
    checked_by text NOT NULL,
    CONSTRAINT "PK_verification_logs" PRIMARY KEY (log_id)
);

CREATE TABLE dataset.policies (
    policy_id text NOT NULL,
    policy_name text NOT NULL,
    journey text NOT NULL,
    category text NOT NULL,
    target_group text NOT NULL,
    summary text NOT NULL,
    legal_source_id text NOT NULL,
    effective_from text NOT NULL,
    effective_to text NOT NULL,
    status text NOT NULL,
    last_verified text NOT NULL,
    CONSTRAINT "PK_policies" PRIMARY KEY (policy_id),
    CONSTRAINT "FK_policies_sources_legal_source_id" FOREIGN KEY (legal_source_id) REFERENCES dataset.sources (source_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.services (
    service_id text NOT NULL,
    service_name text NOT NULL,
    service_type text NOT NULL,
    journey text NOT NULL,
    supported_intents text NOT NULL,
    provider text NOT NULL,
    location text NOT NULL,
    online_url text NOT NULL,
    procedure_code text NOT NULL,
    address text NOT NULL,
    phone text NOT NULL,
    status text NOT NULL,
    source_id text NOT NULL,
    last_verified text NOT NULL,
    processing_time text NOT NULL,
    fee text NOT NULL,
    submission_channels text NOT NULL,
    result_or_action text NOT NULL,
    freshness_rule text NOT NULL,
    CONSTRAINT "PK_services" PRIMARY KEY (service_id),
    CONSTRAINT "FK_services_sources_source_id" FOREIGN KEY (source_id) REFERENCES dataset.sources (source_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.policy_rules (
    rule_id text NOT NULL,
    policy_id text NOT NULL,
    rule_group text NOT NULL,
    logic_connector text NOT NULL,
    field text NOT NULL,
    operator text NOT NULL,
    value text NOT NULL,
    required text NOT NULL,
    match_reason text NOT NULL,
    missing_reason text NOT NULL,
    source_id text NOT NULL,
    source_article text NOT NULL,
    verification_status text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_policy_rules" PRIMARY KEY (rule_id),
    CONSTRAINT "FK_policy_rules_policies_policy_id" FOREIGN KEY (policy_id) REFERENCES dataset.policies (policy_id) ON DELETE RESTRICT,
    CONSTRAINT "FK_policy_rules_sources_source_id" FOREIGN KEY (source_id) REFERENCES dataset.sources (source_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.opportunities (
    opportunity_id text NOT NULL,
    policy_id text NOT NULL,
    service_id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    open_from text NOT NULL,
    open_until text NOT NULL,
    capacity text NOT NULL,
    status text NOT NULL,
    source_id text NOT NULL,
    last_verified text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_opportunities" PRIMARY KEY (opportunity_id),
    CONSTRAINT "FK_opportunities_policies_policy_id" FOREIGN KEY (policy_id) REFERENCES dataset.policies (policy_id) ON DELETE RESTRICT,
    CONSTRAINT "FK_opportunities_services_service_id" FOREIGN KEY (service_id) REFERENCES dataset.services (service_id) ON DELETE RESTRICT,
    CONSTRAINT "FK_opportunities_sources_source_id" FOREIGN KEY (source_id) REFERENCES dataset.sources (source_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.policy_service_maps (
    map_id text NOT NULL,
    policy_id text NOT NULL,
    service_id text NOT NULL,
    intent text NOT NULL,
    priority text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_policy_service_maps" PRIMARY KEY (map_id),
    CONSTRAINT "FK_policy_service_maps_policies_policy_id" FOREIGN KEY (policy_id) REFERENCES dataset.policies (policy_id) ON DELETE RESTRICT,
    CONSTRAINT "FK_policy_service_maps_services_service_id" FOREIGN KEY (service_id) REFERENCES dataset.services (service_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.service_checklists (
    checklist_id text NOT NULL,
    service_id text NOT NULL,
    item_order text NOT NULL,
    requirement_type text NOT NULL,
    document_or_step text NOT NULL,
    required text NOT NULL,
    condition text NOT NULL,
    source_id text NOT NULL,
    source_detail text NOT NULL,
    verification_status text NOT NULL,
    notes text NOT NULL,
    CONSTRAINT "PK_service_checklists" PRIMARY KEY (checklist_id),
    CONSTRAINT "FK_service_checklists_services_service_id" FOREIGN KEY (service_id) REFERENCES dataset.services (service_id) ON DELETE RESTRICT,
    CONSTRAINT "FK_service_checklists_sources_source_id" FOREIGN KEY (source_id) REFERENCES dataset.sources (source_id) ON DELETE RESTRICT
);

CREATE TABLE dataset.service_rules (
    rule_id text NOT NULL,
    event text NOT NULL,
    intent text NOT NULL,
    condition text NOT NULL,
    service_id text NOT NULL,
    priority text NOT NULL,
    status text NOT NULL,
    CONSTRAINT "PK_service_rules" PRIMARY KEY (rule_id),
    CONSTRAINT "FK_service_rules_services_service_id" FOREIGN KEY (service_id) REFERENCES dataset.services (service_id) ON DELETE RESTRICT
);

CREATE INDEX "IX_import_batches_fingerprint" ON dataset.import_batches (fingerprint);

CREATE INDEX "IX_opportunities_policy_id" ON dataset.opportunities (policy_id);

CREATE INDEX "IX_opportunities_service_id" ON dataset.opportunities (service_id);

CREATE INDEX "IX_opportunities_source_id" ON dataset.opportunities (source_id);

CREATE INDEX "IX_opportunities_status" ON dataset.opportunities (status);

CREATE INDEX "IX_policies_legal_source_id" ON dataset.policies (legal_source_id);

CREATE INDEX "IX_policy_rules_field" ON dataset.policy_rules (field);

CREATE INDEX "IX_policy_rules_policy_id" ON dataset.policy_rules (policy_id);

CREATE INDEX "IX_policy_rules_source_id" ON dataset.policy_rules (source_id);

CREATE INDEX "IX_policy_service_maps_policy_id" ON dataset.policy_service_maps (policy_id);

CREATE INDEX "IX_policy_service_maps_service_id" ON dataset.policy_service_maps (service_id);

CREATE INDEX "IX_profile_fields_field_name" ON dataset.profile_fields (field_name);

CREATE INDEX "IX_service_checklists_service_id" ON dataset.service_checklists (service_id);

CREATE INDEX "IX_service_checklists_source_id" ON dataset.service_checklists (source_id);

CREATE INDEX "IX_service_rules_service_id" ON dataset.service_rules (service_id);

CREATE INDEX "IX_services_source_id" ON dataset.services (source_id);

CREATE INDEX "IX_sources_verification_status" ON dataset.sources (verification_status);

CREATE INDEX "IX_verification_logs_source_id" ON dataset.verification_logs (source_id);

INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion")
VALUES ('20261004071648_InitialDataset', '8.0.25');

COMMIT;

