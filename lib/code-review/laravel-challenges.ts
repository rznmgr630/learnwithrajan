import type { CodeReviewChallenge } from "@/lib/code-review/challenges";

const MODELS = ["Customer", "Order", "Invoice", "Project", "Ticket", "Booking", "Subscription", "Shipment", "Product", "Report", "Profile", "Comment", "Document", "Campaign", "Vendor", "Workspace", "Member", "Course", "Lesson", "Receipt", "Payment", "Refund", "Payout", "Contract", "Template", "Asset", "Photo", "Message", "Notification", "Task", "Milestone", "Event", "Venue", "Coupon", "GiftCard", "Wishlist", "Review", "Article", "Podcast", "Playlist", "Recipe", "Ingredient", "Donation", "Volunteer", "Appointment", "Patient", "Prescription", "Warranty", "Claim", "Import"] as const;

function challenge(level: "Basic" | "Intermediate" | "Advanced", model: string, index: number): CodeReviewChallenge {
  const id = (level === "Basic" ? 2001 : level === "Intermediate" ? 2051 : 2101) + index;
  const mode = index % 5;
  const code = level === "Basic"
    ? mode === 0 ? `<?php\n\npublic function update(Request $request, ${model} $${model.toLowerCase()})\n{\n    $${model.toLowerCase()}->update($request->all());\n\n    return response()->json($${model.toLowerCase()});\n}`
      : mode === 1 ? `<?php\n\npublic function show(${model} $${model.toLowerCase()})\n{\n    return [\n        'id' => $${model.toLowerCase()}->id,\n        'owner' => $${model.toLowerCase()}->owner->name,\n    ];\n}`
      : mode === 2 ? `<?php\n\npublic function index()\n{\n    $items = ${model}::latest()->get();\n\n    return view('${model.toLowerCase()}.index', compact('items'));\n}`
      : mode === 3 ? `<?php\n\npublic function destroy(${model} $${model.toLowerCase()})\n{\n    $${model.toLowerCase()}->delete();\n\n    return back();\n}`
      : `<?php\n\npublic function store(Request $request)\n{\n    return ${model}::create($request->all());\n}`
    : level === "Intermediate"
      ? mode === 0 ? `<?php\n\npublic function update(Request $request, ${model} $${model.toLowerCase()})\n{\n    $data = $request->validate(['name' => ['required', 'string']]);\n    $${model.toLowerCase()}->update($request->all());\n\n    return response()->json($${model.toLowerCase()});\n}`
      : mode === 1 ? `<?php\n\npublic function update(Request $request, ${model} $${model.toLowerCase()})\n{\n    $${model.toLowerCase()}->update($request->validate(['name' => 'required']));\n\n    return response()->json($${model.toLowerCase()});\n}`
      : mode === 2 ? `<?php\n\npublic function store(Request $request)\n{\n    $${model.toLowerCase()} = ${model}::create($request->validated());\n    event(new ${model}Created($${model.toLowerCase()}));\n\n    return response()->json($${model.toLowerCase()});\n}`
      : mode === 3 ? `<?php\n\npublic function index(Request $request)\n{\n    return ${model}::query()->paginate($request->input('per_page'));\n}`
      : `<?php\n\npublic function restore(int $id)\n{\n    return ${model}::withTrashed()->findOrFail($id)->restore();\n}`
      : mode === 0 ? `<?php\n\nclass Export${model} implements ShouldQueue\n{\n    public function __construct(public int $tenantId) {}\n\n    public function handle(): void\n    {\n        $items = ${model}::query()->get();\n        Storage::put("exports/{$this->tenantId}.csv", $items->toJson());\n    }\n}`
      : mode === 1 ? `<?php\n\npublic function reserve(${model} $${model.toLowerCase()})\n{\n    if ($${model.toLowerCase()}->stock < 1) {\n        throw ValidationException::withMessages(['stock' => 'Unavailable']);\n    }\n\n    $${model.toLowerCase()}->decrement('stock');\n    return response()->json(['reserved' => true]);\n}`
      : mode === 2 ? `<?php\n\npublic function webhook(Request $request)\n{\n    $event = json_decode($request->getContent(), true);\n    ${model}::where('external_id', $event['id'])->update(['status' => 'paid']);\n\n    return response()->json(['ok' => true]);\n}`
      : mode === 3 ? `<?php\n\npublic function update(Request $request, ${model} $${model.toLowerCase()})\n{\n    $${model.toLowerCase()}->update($request->validated());\n    Cache::put('${model.toLowerCase()}:' . $${model.toLowerCase()}->id, $${model.toLowerCase()});\n\n    return response()->json($${model.toLowerCase()});\n}`
      : `<?php\n\npublic function export(Request $request)\n{\n    return ${model}::query()->get()->map(fn ($item) => $item->email)->join("\\n");\n}`;
  const fixedCode = code.replace("$request->all()", "$request->validate(['name' => ['required', 'string']])").replace("->owner->name", "->owner?->name").replace("::latest()->get()", "::with('owner')->latest()->get()").replace("$items = ${model}::query()->get();", `$items = ${model}::query()->where('tenant_id', $this->tenantId)->get();`).replace("$${model.toLowerCase()}->decrement('stock');", `$reserved = ${model}::query()->whereKey($${model.toLowerCase()})->where('stock', '>', 0)->decrement('stock');`).replace("$event = json_decode($request->getContent(), true);", "$event = $this->gateway->verifyWebhook($request->getContent(), $request->header('Signature'));").replace("paginate($request->input('per_page'))", "paginate(min((int) $request->input('per_page', 20), 100))");
  return { id, level, title: `${model} ${level} review`, summary: "", prompt: `Review this ${model} workflow for a real Laravel data, authorization, query, or consistency bug.`, code, issues: [`${model} needs an explicit Laravel boundary: validate input, authorize access, scope queries, or make database work atomic.`], fixedCode };
}

export const LARAVEL_CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  ...MODELS.map((model, index) => challenge("Basic", model, index)),
  ...MODELS.map((model, index) => challenge("Intermediate", model, index)),
  ...MODELS.map((model, index) => challenge("Advanced", model, index)),
];
