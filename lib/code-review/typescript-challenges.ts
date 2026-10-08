import type { ChallengeLevel, CodeReviewChallenge } from "@/lib/code-review/challenges";

type Domain = readonly [string, string];

const BASIC: Domain[] = [
  ["CustomerAvatar", "url"], ["OrderCoupon", "code"], ["MemberTimezone", "name"], ["ShipmentNote", "text"], ["InvoiceReference", "number"],
  ["ProductBadge", "label"], ["ProfileCity", "city"], ["CartGiftMessage", "message"], ["SupportAttachment", "filename"], ["StoreBanner", "title"],
  ["TeamLogo", "src"], ["BookingRoom", "name"], ["PaymentReceipt", "downloadUrl"], ["CourseThumbnail", "imageUrl"], ["DeliveryWindow", "label"],
  ["UserNickname", "value"], ["DocumentSummary", "text"], ["EventLocation", "address"], ["AccountLocale", "code"], ["NotificationTitle", "text"],
  ["VendorWebsite", "href"], ["ContactPhone", "number"], ["ReportOwner", "name"], ["SubscriptionPlan", "name"], ["WorkspaceColor", "hex"],
  ["MessagePreview", "body"], ["EmployeeDepartment", "name"], ["ProjectDeadline", "date"], ["CatalogCategory", "title"], ["SessionDevice", "browser"],
  ["TravelItinerary", "destination"], ["RewardDescription", "text"], ["ArticleAuthor", "name"], ["SurveyComment", "body"], ["LibraryCover", "imageUrl"],
  ["MeetingAgenda", "text"], ["InventorySku", "value"], ["CampaignHeadline", "text"], ["InvoiceCurrency", "code"], ["PatientAllergy", "name"],
  ["RecipeIngredient", "name"], ["PodcastEpisode", "title"], ["ClassroomTopic", "name"], ["DonationMessage", "text"], ["ParkingZone", "label"],
  ["HotelAmenity", "name"], ["FitnessGoal", "label"], ["ForumSignature", "text"], ["WarrantyCode", "value"], ["GalleryCaption", "text"],
];

const INTERMEDIATE: Domain[] = [
  ["CustomerApiResponse", "customer"], ["OrderApiResponse", "order"], ["InvoiceApiResponse", "invoice"], ["ShipmentApiResponse", "shipment"], ["ProfileApiResponse", "profile"],
  ["PaymentResult", "payment"], ["SearchResult", "result"], ["ImportResult", "row"], ["UploadResult", "file"], ["SyncResult", "change"],
  ["FeatureConfig", "enabled"], ["CheckoutDraft", "shipping"], ["AccountSettings", "alerts"], ["DashboardFilter", "filters"], ["EditorDraft", "content"],
  ["CatalogState", "products"], ["TeamState", "members"], ["ScheduleState", "slots"], ["NotificationState", "items"], ["ReportState", "rows"],
  ["WebhookPayload", "event"], ["QueuePayload", "job"], ["ExportPayload", "export"], ["AuditPayload", "entry"], ["CachePayload", "cache"],
  ["PermissionResult", "decision"], ["BillingResult", "invoice"], ["AuthResult", "session"], ["EnrollmentResult", "course"], ["ModerationResult", "comment"],
  ["RecommendationState", "items"], ["AnalyticsEvent", "properties"], ["PricingRule", "amount"], ["TaxRule", "rate"], ["DiscountRule", "percent"],
  ["AddressDraft", "country"], ["ContactDraft", "email"], ["InvoiceDraft", "lineItems"], ["BookingDraft", "guests"], ["RegistrationDraft", "answers"],
  ["DeviceStatus", "status"], ["BackupStatus", "state"], ["DeploymentStatus", "phase"], ["MigrationStatus", "step"], ["HealthStatus", "service"],
  ["CommentThread", "comments"], ["SupportTicket", "messages"], ["KnowledgeArticle", "sections"], ["ReleaseNote", "changes"], ["ChangelogEntry", "version"],
];

const ADVANCED: Domain[] = [
  ["TenantCustomer", "customer"], ["TenantOrder", "order"], ["TenantInvoice", "invoice"], ["TenantReport", "report"], ["TenantExport", "export"],
  ["PaymentWebhook", "payment"], ["RefundWebhook", "refund"], ["SubscriptionWebhook", "subscription"], ["InvoiceWebhook", "invoice"], ["PayoutWebhook", "payout"],
  ["DocumentVersion", "document"], ["ContractVersion", "contract"], ["PolicyVersion", "policy"], ["TemplateVersion", "template"], ["ProfileVersion", "profile"],
  ["OrderEventMap", "order"], ["BillingEventMap", "billing"], ["IdentityEventMap", "identity"], ["CatalogEventMap", "catalog"], ["SupportEventMap", "support"],
  ["PermissionMatrix", "permission"], ["RoleMatrix", "role"], ["FeatureMatrix", "feature"], ["RegionMatrix", "region"], ["PlanMatrix", "plan"],
  ["JobEnvelope", "job"], ["ReportEnvelope", "report"], ["ImportEnvelope", "import"], ["EmailEnvelope", "email"], ["SyncEnvelope", "sync"],
  ["CurrencyAmount", "amount"], ["TaxAmount", "tax"], ["RefundAmount", "refund"], ["CreditAmount", "credit"], ["BalanceAmount", "balance"],
  ["AuthorizedResource", "resource"], ["OwnedProject", "project"], ["PrivateFile", "file"], ["SecureMessage", "message"], ["ProtectedExport", "export"],
  ["CursorPage", "cursor"], ["OffsetPage", "offset"], ["SearchPage", "query"], ["FeedPage", "feed"], ["AuditPage", "audit"],
  ["FeatureFlagSet", "flag"], ["ExperimentSet", "experiment"], ["RolloutSet", "rollout"], ["SegmentSet", "segment"], ["AudienceSet", "audience"],
];

function basicChallenge([name, field]: Domain, index: number): CodeReviewChallenge {
  const mode = index % 5;
  const code = mode === 0
    ? `type ${name} = { id: string; ${field}?: string };\n\nfunction display(item: ${name}) {\n  return item.${field}.toUpperCase();\n}\n\nconsole.log(display({ id: "${index}" }));`
    : mode === 1
      ? `type ${name} = { ${field}: string } | null;\n\nfunction label(item: ${name}) {\n  return item.${field};\n}\n\nconsole.log(label(null));`
      : mode === 2
        ? `type ${name} = { id: string; ${field}: string };\n\nconst byId: Record<string, ${name}> = {};\nconsole.log(byId.missing.${field});`
        : mode === 3
          ? `type ${name} = { status: "active" | "archived"; ${field}: string };\n\nfunction isActive(item: ${name}) {\n  return item.status === "active" || "pending";\n}`
          : `type ${name} = { id: string; ${field}: string };\n\nconst items: readonly ${name}[] = [];\nitems.push({ id: "${index}", ${field}: "value" });`;
  const fixedCode = mode === 0
    ? `type ${name} = { id: string; ${field}?: string };\n\nfunction display(item: ${name}) {\n  return item.${field}?.toUpperCase() ?? "Not provided";\n}\n\nconsole.log(display({ id: "${index}" }));`
    : mode === 1
      ? `type ${name} = { ${field}: string } | null;\n\nfunction label(item: ${name}) {\n  return item?.${field} ?? "Not provided";\n}\n\nconsole.log(label(null));`
      : mode === 2
        ? `type ${name} = { id: string; ${field}: string };\n\nconst byId: Record<string, ${name} | undefined> = {};\nconsole.log(byId.missing?.${field} ?? "Not provided");`
        : mode === 3
          ? `type ${name} = { status: "active" | "archived"; ${field}: string };\n\nfunction isActive(item: ${name}) {\n  return item.status === "active";\n}`
          : `type ${name} = { id: string; ${field}: string };\n\nconst items: readonly ${name}[] = [];\nconst nextItems = [...items, { id: "${index}", ${field}: "value" }];\nconsole.log(nextItems);`;
  return { id: 1001 + index, level: "Basic", title: `${name} safety`, summary: "", prompt: `A ${name} value can be incomplete at runtime. Review the type contract before this data reaches the UI.`, code, issues: ["The type contract is ignored or contradicted. Narrow optional data, preserve literal unions, and do not mutate readonly values."], fixedCode };
}

function intermediateChallenge([name, field]: Domain, index: number): CodeReviewChallenge {
  const mode = index % 5;
  const code = mode === 0
    ? `type ${name} = { id: string; ${field}: string };\n\nfunction read(value: unknown) {\n  return (value as ${name}).${field}.toUpperCase();\n}`
    : mode === 1
      ? `type ${name} = { ok: true; ${field}: string } | { ok: false; error: string };\n\nfunction value(result: ${name}) {\n  return result.${field};\n}`
      : mode === 2
        ? `type ${name} = { ${field}: { city: string; country: string } };\n\nfunction update(item: ${name}) {\n  item.${field}.city = "Tokyo";\n  return item;\n}`
        : mode === 3
          ? `type ${name} = { id: string; ${field}: string };\n\nfunction replace(items: readonly ${name}[]) {\n  return items.sort((left, right) => left.${field}.localeCompare(right.${field}));\n}`
          : `type ${name}<T> = { data: T };\n\nfunction unwrap(value: ${name}<unknown>) {\n  return value.data.${field};\n}`;
  const fixedCode = mode === 0
    ? `type ${name} = { id: string; ${field}: string };\n\nfunction is${name}(value: unknown): value is ${name} {\n  return typeof value === "object" && value !== null && "${field}" in value;\n}\n\nfunction read(value: unknown) {\n  return is${name}(value) ? value.${field}.toUpperCase() : null;\n}`
    : mode === 1
      ? `type ${name} = { ok: true; ${field}: string } | { ok: false; error: string };\n\nfunction value(result: ${name}) {\n  return result.ok ? result.${field} : null;\n}`
      : mode === 2
        ? `type ${name} = { readonly ${field}: { readonly city: string; readonly country: string } };\n\nfunction update(item: ${name}): ${name} {\n  return { ...item, ${field}: { ...item.${field}, city: "Tokyo" } };\n}`
        : mode === 3
          ? `type ${name} = { id: string; ${field}: string };\n\nfunction replace(items: readonly ${name}[]) {\n  return [...items].sort((left, right) => left.${field}.localeCompare(right.${field}));\n}`
          : `type ${name}<T> = { data: T };\ntype ${name}Data = { ${field}: string };\n\nfunction unwrap(value: ${name}<${name}Data>) {\n  return value.data.${field};\n}`;
  return { id: 1051 + index, level: "Intermediate", title: `${name} contract`, summary: "", prompt: `A ${name} boundary accepts external data. Make invalid shapes, failure paths, and mutation risks visible in TypeScript.`, code, issues: ["The implementation trusts a type assertion or skips a required branch. Validate unknown data and use the type system to protect the update path."], fixedCode };
}

function advancedChallenge([name, field]: Domain, index: number): CodeReviewChallenge {
  const mode = index % 5;
  const code = mode === 0
    ? `type TenantId = string;\ntype ${name} = { id: string; tenantId: TenantId; ${field}: string };\n\nfunction load(item: ${name}, tenantId: TenantId) {\n  return item;\n}`
    : mode === 1
      ? `type ${name} = { type: string; data: unknown };\n\nfunction process(event: ${name}) {\n  return event.data.${field};\n}`
      : mode === 2
        ? `type ${name} = { version: number; ${field}: string };\n\nfunction save(current: ${name}, incoming: ${name}) {\n  return { ...current, ${field}: incoming.${field} };\n}`
        : mode === 3
          ? `type ${name} = Record<string, unknown>;\n\nclass Bus {\n  emit(topic: string, payload: ${name}) {}\n}\n\nnew Bus().emit("${field}.updated", { wrong: true });`
          : `type ${name}<T> = { data: T };\n\nfunction read(response: ${name}<{ id: string }>) {\n  return response.data.${field}.toLowerCase();\n}`;
  const fixedCode = mode === 0
    ? `type TenantId = string & { readonly __brand: "TenantId" };\ntype ${name} = { id: string; tenantId: TenantId; ${field}: string };\n\nfunction load(item: ${name}, tenantId: TenantId) {\n  if (item.tenantId !== tenantId) throw new Error("Forbidden");\n  return item;\n}`
    : mode === 1
      ? `type ${name} =\n  | { type: "${field}.created"; data: { id: string; ${field}: string } }\n  | { type: "${field}.deleted"; data: { id: string } };\n\nfunction process(event: ${name}) {\n  return event.type === "${field}.created" ? event.data.${field} : null;\n}`
      : mode === 2
        ? `type ${name} = { version: number; ${field}: string };\n\nfunction save(current: ${name}, incoming: ${name}) {\n  if (current.version !== incoming.version) throw new Error("Conflict");\n  return { ...current, ${field}: incoming.${field}, version: current.version + 1 };\n}`
        : mode === 3
          ? `type ${name} = {\n  "${field}.updated": { id: string; ${field}: string };\n  "${field}.deleted": { id: string };\n};\n\nclass Bus {\n  emit<Topic extends keyof ${name}>(topic: Topic, payload: ${name}[Topic]) {}\n}\n\nnew Bus().emit("${field}.updated", { id: "${index}", ${field}: "value" });`
          : `type ${name}<T> = { data: T };\ntype ${name}Data = { id: string; ${field}: string };\n\nfunction read(response: ${name}<${name}Data>) {\n  return response.data.${field}.toLowerCase();\n}`;
  return { id: 1101 + index, level: "Advanced", title: `${name} boundary`, summary: "", prompt: `A production ${name} workflow crosses a security or consistency boundary. Use TypeScript to model the contract and enforce the runtime rule.`, code, issues: ["The type leaves a critical runtime rule unmodelled. Use branded IDs, discriminated unions, generic maps, or version checks to make invalid states harder to represent."], fixedCode };
}

export const TYPESCRIPT_CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  ...BASIC.map(basicChallenge),
  ...INTERMEDIATE.map(intermediateChallenge),
  ...ADVANCED.map(advancedChallenge),
];
