import type { ChallengeLevel, CodeReviewChallenge } from "@/lib/code-review/challenges";

type Template = readonly [string, string, string, string, string];

const BASIC: Template[] = [
  ["Missing validation", "A profile endpoint saves a display name. Empty names must not reach the database.", `<?php

public function update(Request $request, User $user)
{
    $user->update($request->all());

    return response()->json($user);
}` , `<?php

public function update(Request $request, User $user)
{
    $data = $request->validate([
        'name' => ['required', 'string', 'max:100'],
    ]);

    $user->update($data);

    return response()->json($user);
}`, "Calling `all()` accepts every browser field. Validate and allow-list the fields this endpoint owns."],
  ["N plus one orders", "An orders page displays each customer's name. It must not make one extra query for every order.", `<?php

public function index()
{
    $orders = Order::latest()->get();

    return view('orders.index', compact('orders'));
}` , `<?php

public function index()
{
    $orders = Order::query()
        ->with('customer')
        ->latest()
        ->get();

    return view('orders.index', compact('orders'));
}`, "The view triggers a customer query for each order. Eager-load the relationship in the controller."],
  ["Optional relation", "A member may not have a profile yet. The API must not throw while formatting a member response.", `<?php

public function show(User $user)
{
    return [
        'name' => $user->name,
        'city' => $user->profile->city,
    ];
}` , `<?php

public function show(User $user)
{
    return [
        'name' => $user->name,
        'city' => $user->profile?->city,
    ];
}`, "The code assumes every user has a profile. Use Laravel's null-safe operator for optional relationships."],
];

const INTERMEDIATE: Template[] = [
  ["Mass assignment", "A settings form updates a user. A crafted request must not change their role.", `<?php

public function update(Request $request, User $user)
{
    $data = $request->validate([
        'name' => ['required', 'string'],
        'email' => ['required', 'email'],
    ]);

    $user->update($request->all());

    return redirect()->route('settings');
}` , `<?php

public function update(Request $request, User $user)
{
    $data = $request->validate([
        'name' => ['required', 'string'],
        'email' => ['required', 'email'],
    ]);

    $user->update($data);

    return redirect()->route('settings');
}`, "The request is validated but then ignored. Updating with `all()` reopens mass-assignment risk."],
  ["Missing policy", "A signed-in user edits a project by ID. They may only edit a project their account owns.", `<?php

public function update(Request $request, Project $project)
{
    $data = $request->validate([
        'name' => ['required', 'string'],
    ]);

    $project->update($data);

    return response()->json($project);
}` , `<?php

public function update(Request $request, Project $project)
{
    $this->authorize('update', $project);

    $data = $request->validate([
        'name' => ['required', 'string'],
    ]);

    $project->update($data);

    return response()->json($project);
}`, "Route model binding finds a project but does not authorize access. Enforce the policy before writing."],
  ["Failed transaction", "Creating an order decrements stock and stores the order. Both changes must succeed or neither should persist.", `<?php

public function store(Request $request, Product $product)
{
    $product->decrement('stock');

    $order = Order::create([
        'product_id' => $product->id,
        'user_id' => $request->user()->id,
    ]);

    return response()->json($order);
}` , `<?php

public function store(Request $request, Product $product)
{
    $order = DB::transaction(function () use ($request, $product) {
        $product->decrement('stock');

        return Order::create([
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
        ]);
    });

    return response()->json($order);
}`, "Separate writes can leave stock changed without an order. Put the related database work in one transaction."],
];

const ADVANCED: Template[] = [
  ["Tenant export leak", "A queued CSV export must include only the authenticated tenant's customers.", `<?php

class ExportCustomers implements ShouldQueue
{
    public function __construct(public int $tenantId) {}

    public function handle(): void
    {
        $customers = Customer::query()
            ->with('orders')
            ->get();

        Storage::put(
            "exports/{$this->tenantId}.csv",
            $customers->pluck('email')->join("\\n"),
        );
    }
}` , `<?php

class ExportCustomers implements ShouldQueue
{
    public function __construct(public int $tenantId) {}

    public function handle(): void
    {
        $customers = Customer::query()
            ->where('tenant_id', $this->tenantId)
            ->with('orders')
            ->get();

        Storage::put(
            "exports/{$this->tenantId}.csv",
            $customers->pluck('email')->join("\\n"),
        );
    }
}`, "The job carries tenant context but never applies it. Scope the worker query, not just the HTTP request."],
  ["Race condition stock", "Two checkout requests compete for the final item. The stock check and decrement must be atomic.", `<?php

public function reserve(Request $request, Product $product)
{
    $customer = $request->user();

    if ($product->stock < 1) {
        throw ValidationException::withMessages([
            'product' => 'Sold out',
        ]);
    }

    $product->decrement('stock');

    Reservation::create([
        'product_id' => $product->id,
        'user_id' => $customer->id,
        'status' => 'pending',
    ]);

    activity()
        ->performedOn($product)
        ->causedBy($customer)
        ->log('product reserved');

    return response()->json(['reserved' => true]);
}` , `<?php

public function reserve(Request $request, Product $product)
{
    $customer = $request->user();

    $reserved = Product::query()
        ->whereKey($product)
        ->where('stock', '>', 0)
        ->decrement('stock');

    if ($reserved !== 1) {
        throw ValidationException::withMessages([
            'product' => 'Sold out',
        ]);
    }

    Reservation::create([
        'product_id' => $product->id,
        'user_id' => $customer->id,
        'status' => 'pending',
    ]);

    activity()
        ->performedOn($product)
        ->causedBy($customer)
        ->log('product reserved');

    return response()->json(['reserved' => true]);
}`, "Checking an in-memory model and decrementing later allows overselling. Use one conditional database update."],
  ["Unsafe webhook", "A payment webhook must verify its signature before it trusts the parsed event.", `<?php

public function handle(Request $request)
{
    $payload = $request->getContent();
    $event = json_decode($payload, true);

    if ($event['type'] === 'payment.succeeded') {
        $order = Order::where('payment_id', $event['data']['id'])
            ->firstOrFail();

        $order->update(['status' => 'paid']);

        ReceiptJob::dispatch($order);

        Log::info('Payment processed', [
            'order_id' => $order->id,
            'payment_id' => $event['data']['id'],
        ]);
    }

    return response()->json(['ok' => true]);
}` , `<?php

public function handle(Request $request)
{
    $payload = $request->getContent();
    $signature = $request->header('Stripe-Signature');
    $event = $this->gateway->verifyWebhook(
        $payload,
        $signature,
    );

    if ($event->type === 'payment.succeeded') {
        $order = Order::where('payment_id', $event->data->id)
            ->firstOrFail();

        $order->update(['status' => 'paid']);

        ReceiptJob::dispatch($order);

        Log::info('Payment processed', [
            'order_id' => $order->id,
            'payment_id' => $event->data->id,
        ]);
    }

    return response()->json(['ok' => true]);
}`, "A public endpoint must not accept arbitrary JSON as a payment event. Verify the raw payload and signature first."],
];

function createChallenges(level: ChallengeLevel, startId: number, templates: Template[]): CodeReviewChallenge[] {
  return Array.from({ length: 50 }, (_, index) => {
    const [title, prompt, code, fixedCode, issue] = templates[index % templates.length];
    return {
      id: startId + index,
      level,
      title: `${title} ${Math.floor(index / templates.length) + 1}`,
      summary: "",
      prompt,
      code,
      issues: [issue],
      fixedCode,
    };
  });
}

export const LARAVEL_CODE_REVIEW_CHALLENGES = [
  ...createChallenges("Basic", 2001, BASIC),
  ...createChallenges("Intermediate", 2051, INTERMEDIATE),
  ...createChallenges("Advanced", 2101, ADVANCED),
];
