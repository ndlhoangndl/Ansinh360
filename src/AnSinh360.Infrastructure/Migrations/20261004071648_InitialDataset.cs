using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AnSinh360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class InitialDataset : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dataset");

            migrationBuilder.CreateTable(
                name: "dataset_metadata",
                schema: "dataset",
                columns: table => new
                {
                    key = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dataset_metadata", x => x.key);
                });

            migrationBuilder.CreateTable(
                name: "dataset_test_cases",
                schema: "dataset",
                columns: table => new
                {
                    test_id = table.Column<string>(type: "text", nullable: false),
                    journey = table.Column<string>(type: "text", nullable: false),
                    input_summary = table.Column<string>(type: "text", nullable: false),
                    expected_policies = table.Column<string>(type: "text", nullable: false),
                    expected_services = table.Column<string>(type: "text", nullable: false),
                    expected_missing_fields = table.Column<string>(type: "text", nullable: false),
                    expected_result = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dataset_test_cases", x => x.test_id);
                });

            migrationBuilder.CreateTable(
                name: "enum_definitions",
                schema: "dataset",
                columns: table => new
                {
                    enum_group = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    label_vi = table.Column<string>(type: "text", nullable: false),
                    meaning = table.Column<string>(type: "text", nullable: false),
                    active = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_enum_definitions", x => new { x.enum_group, x.value });
                });

            migrationBuilder.CreateTable(
                name: "import_batches",
                schema: "dataset",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    dataset_version = table.Column<string>(type: "text", nullable: false),
                    fingerprint = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    imported_at = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    file_hashes = table.Column<string>(type: "jsonb", nullable: false),
                    counts = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_import_batches", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "life_events",
                schema: "dataset",
                columns: table => new
                {
                    life_event_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    primary_demo = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_life_events", x => x.life_event_id);
                });

            migrationBuilder.CreateTable(
                name: "profile_fields",
                schema: "dataset",
                columns: table => new
                {
                    field_id = table.Column<string>(type: "text", nullable: false),
                    journey = table.Column<string>(type: "text", nullable: false),
                    field_name = table.Column<string>(type: "text", nullable: false),
                    question_vi = table.Column<string>(type: "text", nullable: false),
                    data_type = table.Column<string>(type: "text", nullable: false),
                    allowed_values = table.Column<string>(type: "text", nullable: false),
                    required_when = table.Column<string>(type: "text", nullable: false),
                    source_rule_ids = table.Column<string>(type: "text", nullable: false),
                    sensitivity = table.Column<string>(type: "text", nullable: false),
                    persist_default = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_profile_fields", x => x.field_id);
                });

            migrationBuilder.CreateTable(
                name: "sources",
                schema: "dataset",
                columns: table => new
                {
                    source_id = table.Column<string>(type: "text", nullable: false),
                    journey = table.Column<string>(type: "text", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    document_number = table.Column<string>(type: "text", nullable: false),
                    source_type = table.Column<string>(type: "text", nullable: false),
                    source_level = table.Column<string>(type: "text", nullable: false),
                    issuing_authority = table.Column<string>(type: "text", nullable: false),
                    publisher = table.Column<string>(type: "text", nullable: false),
                    canonical_url = table.Column<string>(type: "text", nullable: false),
                    published_at = table.Column<string>(type: "text", nullable: false),
                    effective_from = table.Column<string>(type: "text", nullable: false),
                    effective_to = table.Column<string>(type: "text", nullable: false),
                    verification_status = table.Column<string>(type: "text", nullable: false),
                    last_verified_at = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false),
                    legal_status = table.Column<string>(type: "text", nullable: false),
                    supersedes = table.Column<string>(type: "text", nullable: false),
                    superseded_by = table.Column<string>(type: "text", nullable: false),
                    archive_status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sources", x => x.source_id);
                });

            migrationBuilder.CreateTable(
                name: "verification_logs",
                schema: "dataset",
                columns: table => new
                {
                    log_id = table.Column<string>(type: "text", nullable: false),
                    source_id = table.Column<string>(type: "text", nullable: false),
                    checked_at = table.Column<string>(type: "text", nullable: false),
                    verification_status = table.Column<string>(type: "text", nullable: false),
                    note = table.Column<string>(type: "text", nullable: false),
                    checked_by = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_verification_logs", x => x.log_id);
                });

            migrationBuilder.CreateTable(
                name: "policies",
                schema: "dataset",
                columns: table => new
                {
                    policy_id = table.Column<string>(type: "text", nullable: false),
                    policy_name = table.Column<string>(type: "text", nullable: false),
                    journey = table.Column<string>(type: "text", nullable: false),
                    category = table.Column<string>(type: "text", nullable: false),
                    target_group = table.Column<string>(type: "text", nullable: false),
                    summary = table.Column<string>(type: "text", nullable: false),
                    legal_source_id = table.Column<string>(type: "text", nullable: false),
                    effective_from = table.Column<string>(type: "text", nullable: false),
                    effective_to = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    last_verified = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policies", x => x.policy_id);
                    table.ForeignKey(
                        name: "FK_policies_sources_legal_source_id",
                        column: x => x.legal_source_id,
                        principalSchema: "dataset",
                        principalTable: "sources",
                        principalColumn: "source_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "services",
                schema: "dataset",
                columns: table => new
                {
                    service_id = table.Column<string>(type: "text", nullable: false),
                    service_name = table.Column<string>(type: "text", nullable: false),
                    service_type = table.Column<string>(type: "text", nullable: false),
                    journey = table.Column<string>(type: "text", nullable: false),
                    supported_intents = table.Column<string>(type: "text", nullable: false),
                    provider = table.Column<string>(type: "text", nullable: false),
                    location = table.Column<string>(type: "text", nullable: false),
                    online_url = table.Column<string>(type: "text", nullable: false),
                    procedure_code = table.Column<string>(type: "text", nullable: false),
                    address = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    source_id = table.Column<string>(type: "text", nullable: false),
                    last_verified = table.Column<string>(type: "text", nullable: false),
                    processing_time = table.Column<string>(type: "text", nullable: false),
                    fee = table.Column<string>(type: "text", nullable: false),
                    submission_channels = table.Column<string>(type: "text", nullable: false),
                    result_or_action = table.Column<string>(type: "text", nullable: false),
                    freshness_rule = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.service_id);
                    table.ForeignKey(
                        name: "FK_services_sources_source_id",
                        column: x => x.source_id,
                        principalSchema: "dataset",
                        principalTable: "sources",
                        principalColumn: "source_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "policy_rules",
                schema: "dataset",
                columns: table => new
                {
                    rule_id = table.Column<string>(type: "text", nullable: false),
                    policy_id = table.Column<string>(type: "text", nullable: false),
                    rule_group = table.Column<string>(type: "text", nullable: false),
                    logic_connector = table.Column<string>(type: "text", nullable: false),
                    field = table.Column<string>(type: "text", nullable: false),
                    @operator = table.Column<string>(name: "operator", type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: false),
                    required = table.Column<string>(type: "text", nullable: false),
                    match_reason = table.Column<string>(type: "text", nullable: false),
                    missing_reason = table.Column<string>(type: "text", nullable: false),
                    source_id = table.Column<string>(type: "text", nullable: false),
                    source_article = table.Column<string>(type: "text", nullable: false),
                    verification_status = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_rules", x => x.rule_id);
                    table.ForeignKey(
                        name: "FK_policy_rules_policies_policy_id",
                        column: x => x.policy_id,
                        principalSchema: "dataset",
                        principalTable: "policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_policy_rules_sources_source_id",
                        column: x => x.source_id,
                        principalSchema: "dataset",
                        principalTable: "sources",
                        principalColumn: "source_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "opportunities",
                schema: "dataset",
                columns: table => new
                {
                    opportunity_id = table.Column<string>(type: "text", nullable: false),
                    policy_id = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    location = table.Column<string>(type: "text", nullable: false),
                    open_from = table.Column<string>(type: "text", nullable: false),
                    open_until = table.Column<string>(type: "text", nullable: false),
                    capacity = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false),
                    source_id = table.Column<string>(type: "text", nullable: false),
                    last_verified = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_opportunities", x => x.opportunity_id);
                    table.ForeignKey(
                        name: "FK_opportunities_policies_policy_id",
                        column: x => x.policy_id,
                        principalSchema: "dataset",
                        principalTable: "policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_opportunities_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "dataset",
                        principalTable: "services",
                        principalColumn: "service_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_opportunities_sources_source_id",
                        column: x => x.source_id,
                        principalSchema: "dataset",
                        principalTable: "sources",
                        principalColumn: "source_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "policy_service_maps",
                schema: "dataset",
                columns: table => new
                {
                    map_id = table.Column<string>(type: "text", nullable: false),
                    policy_id = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false),
                    intent = table.Column<string>(type: "text", nullable: false),
                    priority = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_policy_service_maps", x => x.map_id);
                    table.ForeignKey(
                        name: "FK_policy_service_maps_policies_policy_id",
                        column: x => x.policy_id,
                        principalSchema: "dataset",
                        principalTable: "policies",
                        principalColumn: "policy_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_policy_service_maps_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "dataset",
                        principalTable: "services",
                        principalColumn: "service_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "service_checklists",
                schema: "dataset",
                columns: table => new
                {
                    checklist_id = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false),
                    item_order = table.Column<string>(type: "text", nullable: false),
                    requirement_type = table.Column<string>(type: "text", nullable: false),
                    document_or_step = table.Column<string>(type: "text", nullable: false),
                    required = table.Column<string>(type: "text", nullable: false),
                    condition = table.Column<string>(type: "text", nullable: false),
                    source_id = table.Column<string>(type: "text", nullable: false),
                    source_detail = table.Column<string>(type: "text", nullable: false),
                    verification_status = table.Column<string>(type: "text", nullable: false),
                    notes = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_checklists", x => x.checklist_id);
                    table.ForeignKey(
                        name: "FK_service_checklists_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "dataset",
                        principalTable: "services",
                        principalColumn: "service_id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_service_checklists_sources_source_id",
                        column: x => x.source_id,
                        principalSchema: "dataset",
                        principalTable: "sources",
                        principalColumn: "source_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "service_rules",
                schema: "dataset",
                columns: table => new
                {
                    rule_id = table.Column<string>(type: "text", nullable: false),
                    @event = table.Column<string>(name: "event", type: "text", nullable: false),
                    intent = table.Column<string>(type: "text", nullable: false),
                    condition = table.Column<string>(type: "text", nullable: false),
                    service_id = table.Column<string>(type: "text", nullable: false),
                    priority = table.Column<string>(type: "text", nullable: false),
                    status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_rules", x => x.rule_id);
                    table.ForeignKey(
                        name: "FK_service_rules_services_service_id",
                        column: x => x.service_id,
                        principalSchema: "dataset",
                        principalTable: "services",
                        principalColumn: "service_id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_import_batches_fingerprint",
                schema: "dataset",
                table: "import_batches",
                column: "fingerprint");

            migrationBuilder.CreateIndex(
                name: "IX_opportunities_policy_id",
                schema: "dataset",
                table: "opportunities",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_opportunities_service_id",
                schema: "dataset",
                table: "opportunities",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_opportunities_source_id",
                schema: "dataset",
                table: "opportunities",
                column: "source_id");

            migrationBuilder.CreateIndex(
                name: "IX_opportunities_status",
                schema: "dataset",
                table: "opportunities",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "IX_policies_legal_source_id",
                schema: "dataset",
                table: "policies",
                column: "legal_source_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_rules_field",
                schema: "dataset",
                table: "policy_rules",
                column: "field");

            migrationBuilder.CreateIndex(
                name: "IX_policy_rules_policy_id",
                schema: "dataset",
                table: "policy_rules",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_rules_source_id",
                schema: "dataset",
                table: "policy_rules",
                column: "source_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_service_maps_policy_id",
                schema: "dataset",
                table: "policy_service_maps",
                column: "policy_id");

            migrationBuilder.CreateIndex(
                name: "IX_policy_service_maps_service_id",
                schema: "dataset",
                table: "policy_service_maps",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_profile_fields_field_name",
                schema: "dataset",
                table: "profile_fields",
                column: "field_name");

            migrationBuilder.CreateIndex(
                name: "IX_service_checklists_service_id",
                schema: "dataset",
                table: "service_checklists",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_checklists_source_id",
                schema: "dataset",
                table: "service_checklists",
                column: "source_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_rules_service_id",
                schema: "dataset",
                table: "service_rules",
                column: "service_id");

            migrationBuilder.CreateIndex(
                name: "IX_services_source_id",
                schema: "dataset",
                table: "services",
                column: "source_id");

            migrationBuilder.CreateIndex(
                name: "IX_sources_verification_status",
                schema: "dataset",
                table: "sources",
                column: "verification_status");

            migrationBuilder.CreateIndex(
                name: "IX_verification_logs_source_id",
                schema: "dataset",
                table: "verification_logs",
                column: "source_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "dataset_metadata",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "dataset_test_cases",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "enum_definitions",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "import_batches",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "life_events",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "opportunities",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "policy_rules",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "policy_service_maps",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "profile_fields",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "service_checklists",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "service_rules",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "verification_logs",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "policies",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "services",
                schema: "dataset");

            migrationBuilder.DropTable(
                name: "sources",
                schema: "dataset");
        }
    }
}
