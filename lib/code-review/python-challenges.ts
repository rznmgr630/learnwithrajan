import type { CodeReviewChallenge } from "@/lib/code-review/challenges";

const DOMAINS = ["customer", "order", "invoice", "project", "ticket", "booking", "subscription", "shipment", "product", "report", "profile", "comment", "document", "campaign", "vendor", "workspace", "member", "course", "lesson", "receipt", "payment", "refund", "payout", "contract", "template", "asset", "photo", "message", "notification", "task", "milestone", "event", "venue", "coupon", "gift_card", "wishlist", "review", "article", "podcast", "playlist", "recipe", "ingredient", "donation", "volunteer", "appointment", "patient", "prescription", "warranty", "claim", "import"] as const;

function challenge(level: "Basic" | "Intermediate" | "Advanced", domain: string, index: number): CodeReviewChallenge {
  const id = (level === "Basic" ? 3001 : level === "Intermediate" ? 3051 : 3101) + index;
  const name = `${domain}_record`;
  const model = domain.split("_").map((part) => `${part[0].toUpperCase()}${part.slice(1)}`).join("");
  const mode = index % 5;
  const code = level === "Basic"
    ? mode === 0 ? `def add_${domain}(item, items=[]):\n    items.append(item)\n    return items\n\nprint(add_${domain}("first"))\nprint(add_${domain}("second"))`
      : mode === 1 ? `def ${domain}_label(${name}):\n    return ${name}["label"].upper()\n\nprint(${domain}_label({}))`
      : mode === 2 ? `def load_${domain}(path):\n    file = open(path)\n    return file.read()\n\nprint(load_${domain}("${domain}.txt"))`
      : mode === 3 ? `def ${domain}_total(price, quantity):\n    return price * int(quantity)\n\nprint(${domain}_total(10, "two"))`
      : `def save_${domain}(${name}):\n    ${name}["status"] = "saved"\n    return ${name}`
    : level === "Intermediate"
      ? mode === 0 ? `def update_${domain}(${name}):\n    ${name}["settings"]["enabled"] = False\n    return ${name}`
      : mode === 1 ? `def get_${domain}(request, record_id):\n    return ${model}.objects.get(id=record_id)`
      : mode === 2 ? `def transfer_${domain}(sender, receiver, amount):\n    sender.balance -= amount\n    sender.save()\n    receiver.balance += amount\n    receiver.save()`
      : mode === 3 ? `def parse_${domain}(value):\n    return value["data"]["id"]\n\nprint(parse_${domain}({"error": "offline"}))`
      : `def cache_${domain}(cache, locale):\n    return cache["${domain}"]\n\nprint(cache_${domain}({}, "ja"))`
      : mode === 0 ? `def export_${domain}s(tenant_id):\n    rows = ${model}.objects.all()\n    return [row.email for row in rows]`
      : mode === 1 ? `def process_${domain}_webhook(event):\n    record = ${model}.objects.get(external_id=event["id"])\n    record.status = "paid"\n    record.save()\n    Receipt.objects.create(record=record)`
      : mode === 2 ? `def reserve_${domain}(record):\n    if record.stock < 1:\n        raise ValueError("Sold out")\n    record.stock -= 1\n    record.save()`
      : mode === 3 ? `def serialize_${domain}(record):\n    return record.__dict__`
      : `def archive_${domain}(record):\n    record.delete()\n    cache.delete(f"${domain}:{record.id}")`;
  const fixedCode = code.replace("items=[]", "items=None").replace("items.append(item)", "items = [] if items is None else items\n    items.append(item)").replace('["label"].upper()', '.get("label", "Unknown").upper()').replace("file = open(path)\n    return file.read()", "with open(path) as file:\n        return file.read()").replace("int(quantity)", "int(quantity) if str(quantity).isdigit() else 0").replace(".objects.get(id=record_id)", `.objects.get(id=record_id, owner=request.user)`).replace(`return ${model}.objects.all()`, `return ${model}.objects.filter(tenant_id=tenant_id)`).replace("return record.__dict__", "return {\"id\": record.id, \"status\": record.status}");
  return { id, level, title: `${domain.replaceAll("_", " ")} ${level} review`, summary: "", prompt: `Review this production Python ${domain} workflow for a data safety, Django, or background-job bug.`, code, issues: [`The ${domain} code trusts shared, external, or tenant-scoped state without a safe Python boundary.`], fixedCode };
}

export const PYTHON_CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  ...DOMAINS.map((domain, index) => challenge("Basic", domain, index)),
  ...DOMAINS.map((domain, index) => challenge("Intermediate", domain, index)),
  ...DOMAINS.map((domain, index) => challenge("Advanced", domain, index)),
];
