import type { ChallengeLevel, CodeReviewChallenge } from "@/lib/code-review/challenges";

type Scenario = { title: string; prompt: string };

const BASIC: Scenario[] = [
  { title: "Optional avatar", prompt: "A member card may receive no avatar from the API. Keep the card safe while preserving a useful fallback." },
  { title: "Quantity field", prompt: "A cart receives quantity from a browser field. Reject text before it reaches money calculations." },
  { title: "Order status", prompt: "An order status comes from an API. Display only the statuses the product supports." },
  { title: "Saved theme", prompt: "Local storage can return no saved theme. Keep the settings page usable on first visit." },
  { title: "Profile address", prompt: "A new customer may not have an address yet. Render their profile without assuming nested data exists." },
];

const INTERMEDIATE: Scenario[] = [
  { title: "API response shape", prompt: "A dashboard consumes a response from another team. Validate the data shape before using it as a customer record." },
  { title: "Draft form update", prompt: "A form updates one nested shipping field. Preserve the rest of the typed draft." },
  { title: "Payment method", prompt: "Checkout supports a fixed set of payment methods. Make missing handling visible when a new method is added." },
  { title: "Search result", prompt: "A search API can return an error result or a data result. Make callers handle both paths." },
  { title: "Feature configuration", prompt: "A release configuration has optional fields. Keep defaults explicit instead of passing undefined into the UI." },
];

const ADVANCED: Scenario[] = [
  { title: "Tenant record", prompt: "A multi-tenant API must not accept an unscoped record as a tenant-owned record." },
  { title: "Webhook event", prompt: "A billing webhook has several event shapes. Process only verified event types with the fields they actually contain." },
  { title: "Permission decision", prompt: "Authorization code must distinguish an allowed decision from a denied decision with a reason." },
  { title: "Versioned document", prompt: "Two editors can update one document. Require a version match before accepting the update." },
  { title: "Background job", prompt: "A queued job must carry its tenant context and reject incomplete payloads before processing." },
];

function basicCode(index: number) {
  const modes = [
    [`function displayName(user: { name: string; avatar?: { url: string } }) {\n  return user.avatar.url;\n}\n\nconsole.log(displayName({ name: "Maya" }));`, `function displayName(user: { name: string; avatar?: { url: string } }) {\n  return user.avatar?.url ?? user.name;\n}\n\nconsole.log(displayName({ name: "Maya" }));`, "Optional nested data is read as if it always exists. Use optional chaining and a fallback."],
    [`function quantity(value: string) {\n  return value * 2;\n}\n\nconsole.log(quantity("2"));`, `function quantity(value: string) {\n  const parsed = Number(value);\n  if (!Number.isInteger(parsed) || parsed < 0) return null;\n  return parsed * 2;\n}\n\nconsole.log(quantity("2"));`, "The value is text, not a number. Convert and validate external form input at the boundary."],
    [`type Status = "pending" | "paid";\n\nfunction label(status: Status) {\n  return status === "pending" ? "Pending" : "Paid";\n}\n\nconsole.log(label("paid"));`, `type Status = "pending" | "paid";\n\nfunction label(status: Status) {\n  const labels: Record<Status, string> = { pending: "Pending", paid: "Paid" };\n  return labels[status];\n}\n\nconsole.log(label("paid"));`, "The conditional silently treats every future status as paid. A `Record` makes missing cases visible to TypeScript."],
  ];
  return modes[index % modes.length];
}

function intermediateCode(index: number) {
  const modes = [
    [`type User = { id: string; name: string };\n\nfunction userName(response: unknown) {\n  return (response as User).name.toUpperCase();\n}\n\nconsole.log(userName({ error: "Offline" }));`, `type User = { id: string; name: string };\n\nfunction isUser(value: unknown): value is User {\n  return typeof value === "object" && value !== null && "id" in value && "name" in value;\n}\n\nfunction userName(response: unknown) {\n  return isUser(response) ? response.name.toUpperCase() : null;\n}\n\nconsole.log(userName({ error: "Offline" }));`, "A type assertion does not validate API data. Narrow `unknown` before trusting it."],
    [`type Draft = { shipping: { city: string; country: string } };\n\nfunction changeCity(draft: Draft, city: string): Draft {\n  draft.shipping.city = city;\n  return draft;\n}\n\nconsole.log(changeCity({ shipping: { city: "Tokyo", country: "JP" } }, "Osaka"));`, `type Draft = { shipping: { city: string; country: string } };\n\nfunction changeCity(draft: Draft, city: string): Draft {\n  return { ...draft, shipping: { ...draft.shipping, city } };\n}\n\nconsole.log(changeCity({ shipping: { city: "Tokyo", country: "JP" } }, "Osaka"));`, "The typed object is still mutable. Return a new nested value so previews do not change saved state."],
    [`type Result = { ok: true; items: string[] } | { ok: false; message: string };\n\nfunction count(result: Result) {\n  return result.items.length;\n}\n\nconsole.log(count({ ok: false, message: "Offline" }));`, `type Result = { ok: true; items: string[] } | { ok: false; message: string };\n\nfunction count(result: Result) {\n  return result.ok ? result.items.length : 0;\n}\n\nconsole.log(count({ ok: false, message: "Offline" }));`, "A union needs a discriminant check before accessing fields that exist on only one branch."],
  ];
  return modes[index % modes.length];
}

function advancedCode(index: number) {
  const modes = [
    [`type TenantId = string;\ntype Record = { id: string; tenantId: TenantId };\n\nfunction load(record: Record) { return record; }\n\nconsole.log(load({ id: "d1", tenantId: "other" }));`, `type TenantId = string & { readonly __brand: "TenantId" };\ntype Record = { id: string; tenantId: TenantId };\n\nfunction load(record: Record, tenantId: TenantId) {\n  if (record.tenantId !== tenantId) throw new Error("Forbidden");\n  return record;\n}\n\nconsole.log("Tenant scope is required");`, "A tenant-shaped record is not authorization. Carry the authenticated tenant context into the query and enforce it."],
    [`type Event = { type: string; data: unknown };\n\nfunction process(event: Event) {\n  return event.data.amount;\n}\n\nconsole.log(process({ type: "payment", data: {} }));`, `type Event =\n  | { type: "payment.succeeded"; data: { amount: number; paymentId: string } }\n  | { type: "refund.created"; data: { refundId: string } };\n\nfunction process(event: Event) {\n  switch (event.type) {\n    case "payment.succeeded": return event.data.amount;\n    case "refund.created": return 0;\n  }\n}\n\nconsole.log(process({ type: "payment.succeeded", data: { amount: 20, paymentId: "p1" } }));`, "An event with `unknown` data is trusted without proof. Use a discriminated union and exhaustive handling."],
    [`type Update = { version: number; body: string };\n\nfunction save(current: Update, incoming: Update) {\n  return { ...current, body: incoming.body };\n}\n\nconsole.log(save({ version: 2, body: "new" }, { version: 1, body: "old" }));`, `type Update = { version: number; body: string };\n\nfunction save(current: Update, incoming: Update) {\n  if (current.version !== incoming.version) throw new Error("Conflict");\n  return { ...current, body: incoming.body, version: current.version + 1 };\n}\n\nconsole.log("The database must also enforce this conditional update");`, "Typing a version is not enough. Optimistic concurrency needs a runtime conditional write."],
    [`type EventMap = Record<string, unknown>;\n\nclass Bus {\n  emit(name: string, payload: unknown) { console.log(name, payload); }\n}\n\nnew Bus().emit("order.paid", { wrong: true });`, `type EventMap = {\n  "order.paid": { orderId: string; amount: number };\n  "order.cancelled": { orderId: string; reason: string };\n};\n\nclass Bus {\n  emit<Name extends keyof EventMap>(name: Name, payload: EventMap[Name]) {\n    console.log(name, payload);\n  }\n}\n\nnew Bus().emit("order.paid", { orderId: "o1", amount: 20 });`, "A stringly typed event bus accepts invalid payloads. Tie each event name to its exact payload with a generic event map."],
    [`type ApiResponse<T> = { data: T };\n\nfunction parseUser(response: ApiResponse<{ id: string }>) {\n  return response.data.email.toLowerCase();\n}\n\nconsole.log(parseUser({ data: { id: "u1" } }));`, `type ApiResponse<T> = { data: T };\ntype User = { id: string; email: string };\n\nfunction parseUser(response: ApiResponse<User>) {\n  return response.data.email.toLowerCase();\n}\n\nconsole.log(parseUser({ data: { id: "u1", email: "a@example.com" } }));`, "A generic wrapper does not guarantee fields its type argument omitted. Model the full contract at the boundary."],
    [`type Permission = "read" | "write" | "delete";\n\nfunction allowed(role: string, permission: Permission) {\n  return role === "admin";\n}\n\nconsole.log(allowed("admin", "delete"));`, `type Role = "admin" | "editor" | "viewer";\ntype Permissions = Record<Role, readonly Permission[]>;\n\nconst permissions: Permissions = {\n  admin: ["read", "write", "delete"],\n  editor: ["read", "write"],\n  viewer: ["read"],\n};\n\nfunction allowed(role: Role, permission: Permission) {\n  return permissions[role].includes(permission);\n}\n\nconsole.log(allowed("admin", "delete"));`, "A boolean admin check hides the authorization policy. A typed permission matrix makes missing role coverage visible."],
  ];
  return modes[index % modes.length];
}

function createChallenges(level: ChallengeLevel, startId: number, scenarios: Scenario[], buildCode: (index: number) => string[]) {
  return Array.from({ length: 50 }, (_, index): CodeReviewChallenge => {
    const scenario = scenarios[index % scenarios.length];
    const [rawCode, rawFixedCode, issue] = buildCode(index);
    const serviceContext = level === "Advanced"
      ? `type RequestContext = { requestId: string; actorId: string; tenantId: string };\n+type AuditEntry = { action: string; requestId: string; actorId: string };\n+\n+const auditLog: AuditEntry[] = [];\n+\n+function audit(context: RequestContext, action: string) {\n+  auditLog.push({\n+    action,\n+    requestId: context.requestId,\n+    actorId: context.actorId,\n+  });\n+}\n+\n+function requireActor(context: RequestContext) {\n+  if (!context.actorId) throw new Error("Unauthenticated");\n+}\n+\n+const context: RequestContext = {\n+  requestId: "req_1",\n+  actorId: "u1",\n+  tenantId: "tenant_a",\n+};\n+\n+requireActor(context);\n+audit(context, "review.started");\n+\n+`
      : "";
    const cleanServiceContext = serviceContext.replaceAll("\n+", "\n");
    const code = `${cleanServiceContext}${rawCode}`;
    const fixedCode = `${cleanServiceContext}${rawFixedCode}`;
    return {
      id: startId + index,
      level,
      title: `${scenario.title} ${Math.floor(index / scenarios.length) + 1}`,
      summary: "",
      prompt: scenario.prompt,
      code,
      issues: [issue],
      fixedCode,
    };
  });
}

export const TYPESCRIPT_CODE_REVIEW_CHALLENGES = [
  ...createChallenges("Basic", 1001, BASIC, basicCode),
  ...createChallenges("Intermediate", 1051, INTERMEDIATE, intermediateCode),
  ...createChallenges("Advanced", 1101, ADVANCED, advancedCode),
];
