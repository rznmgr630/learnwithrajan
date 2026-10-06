export type ChallengeLevel = "Basic" | "Intermediate" | "Advanced";

export type CodeReviewChallenge = {
  id: number;
  level: ChallengeLevel;
  title: string;
  summary: string;
  prompt: string;
  code: string;
  issues: string[];
  fixedCode: string;
};

export const CODE_REVIEW_PROBLEMS_PER_LEVEL = 50;

export const CODE_REVIEW_CHALLENGE_TEMPLATE: CodeReviewChallenge = {
  id: 10,
  level: "Basic",
  title: "Short internal title",
  summary: "Short internal summary",
  prompt: "Explain what the code must achieve without naming the bug.",
  code: "console.log(\"Add the buggy code here\");",
  issues: ["Explain the issue, why it matters, and the safer approach."],
  fixedCode: "console.log(\"Add one possible fix here\");",
};

const INITIAL_CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  {
    id: 1,
    level: "Basic",
    title: "Adding twice",
    summary: "A button should add two points.",
    prompt: "This helper belongs to a game scoreboard. It receives the current score and should give the player exactly two extra points. The caller may use the returned result to update the screen, save the score, or calculate a reward. Check whether the function keeps its work contained and can be safely reused for any starting score.",
    code: `let score = 0;

function addTwo() {
  score = score + 1;
  score = score + 1;
  console.log(score);
}

addTwo();`,
    issues: ["This code works, but it hides its result in a global variable. Returning the new score makes the function reusable and easier to test."],
    fixedCode: `function addTwo(score) {
  return score + 2;
}

console.log(addTwo(0));`,
  },
  {
    id: 2,
    level: "Basic",
    title: "Wrong comparison",
    summary: "Only adults may continue.",
    prompt: "A registration page uses this function before continuing to an adults-only area. A person who is 18 or older should be allowed through, while someone younger than 18 should not. Check the exact boundary, because that is where rules like this often fail.",
    code: `function canContinue(age) {
  return age > 18;
}

console.log(canContinue(18));`,
    issues: ["Age 18 is an adult, but `>` excludes it. The comparison must include the boundary with `>=`."],
    fixedCode: `function canContinue(age) {
  return age >= 18;
}

console.log(canContinue(18));`,
  },
  {
    id: 3,
    level: "Basic",
    title: "Empty cart",
    summary: "Calculate the total price of cart items.",
    prompt: "A shopping cart calls this helper to calculate its total. It should return the sum of all prices and must also return a useful result when the cart has no items yet. Try the normal path and the empty-cart path before deciding whether the function is safe to use in checkout.",
    code: `function cartTotal(prices) {
  return prices.reduce((total, price) => total + price);
}

console.log(cartTotal([]));`,
    issues: ["`reduce` without an initial value throws for an empty array. Start the total at `0`."],
    fixedCode: `function cartTotal(prices) {
  return prices.reduce((total, price) => total + price, 0);
}

console.log(cartTotal([]));`,
  },
  {
    id: 4,
    level: "Intermediate",
    title: "Mutating a discount",
    summary: "Apply a discount without changing the original cart.",
    prompt: "A checkout page needs to show a discounted preview without changing the original cart. The same cart object is still needed elsewhere for the regular total. After applying the discount, the preview should contain lower prices while the original cart stays unchanged.",
    code: `const cart = [{ name: "Book", price: 20 }];

function applyDiscount(items) {
  items.forEach((item) => {
    item.price = item.price * 0.9;
  });
  return items;
}

console.log(applyDiscount(cart));
console.log(cart);`,
    issues: ["The function mutates the caller's cart. Shared data changing unexpectedly causes hard-to-find UI and checkout bugs. Return new item objects instead."],
    fixedCode: `const cart = [{ name: "Book", price: 20 }];

function applyDiscount(items) {
  return items.map((item) => ({
    ...item,
    price: item.price * 0.9,
  }));
}

console.log(applyDiscount(cart));
console.log(cart);`,
  },
  {
    id: 5,
    level: "Intermediate",
    title: "Lost async result",
    summary: "Load a user and greet them.",
    prompt: "This screen loads a user from a service and then greets them by name. The greeting must happen only after the service has returned a user. Review the order in which the code runs, including what happens before the delayed request finishes.",
    code: `function loadUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Maya" }), 100);
  });
}

function greetUser() {
  let user;
  loadUser().then((result) => {
    user = result;
  });
  console.log("Hello, " + user.name);
}

greetUser();`,
    issues: ["The promise finishes after `console.log` runs, so `user` is still undefined. Return or await the promise before using its result."],
    fixedCode: `function loadUser() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ name: "Maya" }), 100);
  });
}

async function greetUser() {
  const user = await loadUser();
  console.log(\`Hello, \${user.name}\`);
}

greetUser();`,
  },
  {
    id: 6,
    level: "Intermediate",
    title: "Duplicate users",
    summary: "Convert user records into a lookup by ID.",
    prompt: "An import job converts user records into a lookup by ID. Every ID is expected to belong to one person. If the input contains the same ID twice, the import must not quietly lose a record. Decide what a safe, understandable outcome should be for duplicate data.",
    code: `function usersById(users) {
  return users.reduce((lookup, user) => {
    lookup[user.id] = user;
    return lookup;
  }, {});
}

console.log(usersById([
  { id: "a1", name: "Maya" },
  { id: "a1", name: "Ravi" },
]));`,
    issues: ["A duplicate ID silently overwrites earlier data. For data that must be unique, detect duplicates and fail clearly instead of losing information."],
    fixedCode: `function usersById(users) {
  return users.reduce((lookup, user) => {
    if (lookup[user.id]) {
      throw new Error(\`Duplicate user ID: \${user.id}\`);
    }
    lookup[user.id] = user;
    return lookup;
  }, {});
}

console.log(usersById([{ id: "a1", name: "Maya" }]));`,
  },
  {
    id: 7,
    level: "Advanced",
    title: "Leaking private fields",
    summary: "Return a safe public account response.",
    prompt: "This helper prepares account data for a browser response after a user signs in. The browser needs enough data to display the profile, but it must never receive credentials, recovery secrets, or anything that could help another person access the account. Review every returned field as if the response were visible in developer tools.",
    code: `function publicAccount(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    passwordHash: account.passwordHash,
    resetToken: account.resetToken,
  };
}

console.log(publicAccount({
  id: "u1",
  name: "Maya",
  email: "maya@example.com",
  passwordHash: "hashed-secret",
  resetToken: "token-123",
}));`,
    issues: ["This response leaks a password hash and reset token. Sensitive fields must never leave the server, even if a password is hashed."],
    fixedCode: `function publicAccount(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
  };
}

console.log(publicAccount({
  id: "u1",
  name: "Maya",
  email: "maya@example.com",
}));`,
  },
  {
    id: 8,
    level: "Advanced",
    title: "Slow repeated search",
    summary: "Find products requested by a list of IDs.",
    prompt: "A product page receives a large catalogue and a list of product IDs to display. It should return the matching products in the requested order. The code works for two items, but review how much repeated work it performs when both lists contain thousands of entries.",
    code: `function findProducts(products, wantedIds) {
  return wantedIds.map((id) => {
    return products.find((product) => product.id === id);
  });
}

const products = [
  { id: "p1", name: "Book" },
  { id: "p2", name: "Pen" },
];

console.log(findProducts(products, ["p2", "p1"]));`,
    issues: ["Each requested ID scans the whole products list. That becomes slow at scale. Build a lookup once, then read each product directly."],
    fixedCode: `function findProducts(products, wantedIds) {
  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );
  return wantedIds
    .map((id) => productsById.get(id))
    .filter(Boolean);
}

console.log(findProducts([{ id: "p1", name: "Book" }], ["p1"]));`,
  },
  {
    id: 9,
    level: "Advanced",
    title: "Unsafe HTML preview",
    summary: "Render a user-written profile bio.",
    prompt: "A profile page displays a bio written by another user. The bio should appear exactly as text, even when it contains angle brackets, HTML-looking text, or an attempt to run browser code. Review how the function builds its output before it is inserted into a page.",
    code: `function profileBio(bio) {
  return \`<section class="bio">\${bio}</section>\`;
}

console.log(profileBio("<img src=x onerror=alert('oops')>"));`,
    issues: ["Interpolating untrusted text into HTML creates an XSS risk. Keep user text as text content, or sanitize it with a trusted HTML sanitizer before rendering."],
    fixedCode: `function profileBio(bio) {
  const section = document.createElement("section");
  section.className = "bio";
  section.textContent = bio;
  return section;
}

console.log(profileBio("A safe profile bio").outerHTML);`,
  },
];

function generatedProblem(id: number, level: ChallengeLevel, index: number): CodeReviewChallenge {
  const basic = [
    {
      code: `function hasItems(items) {\n  return items.length > 0;\n}\n\nconsole.log(hasItems([]));`,
      fixedCode: `function hasItems(items) {\n  return items.length !== 0;\n}\n\nconsole.log(hasItems([]));`,
      prompt: "A screen uses this helper to decide whether to show an empty state. It must return a boolean for any array, including an empty one. Review whether the code communicates that rule clearly and handles the expected input.",
      issue: "The code works, but `items.length !== 0` states the intent more directly: the array has at least one item. Prefer the clearest condition when code is read more often than it is written.",
    },
    {
      code: `function welcome(name) {\n  return "Hello " + name;\n}\n\nconsole.log(welcome());`,
      fixedCode: `function welcome(name = "there") {\n  return \`Hello \${name}\`;\n}\n\nconsole.log(welcome());`,
      prompt: "A notification uses this helper when a person signs in. A name is normally available, but older accounts may not have one. The notification should remain friendly and readable instead of showing missing data.",
      issue: "An optional name becomes `undefined` in the message. Provide a safe default before formatting user-facing text.",
    },
    {
      code: `function firstLetter(word) {\n  return word[0].toUpperCase();\n}\n\nconsole.log(firstLetter(""));`,
      fixedCode: `function firstLetter(word) {\n  return word ? word[0].toUpperCase() : "";\n}\n\nconsole.log(firstLetter(""));`,
      prompt: "A profile form uses this helper to create an initial from a name. Names are usually present, but an empty string can appear while a user is editing. The helper should not crash during that normal UI state.",
      issue: "An empty string has no first character, so calling `toUpperCase` fails. Handle the empty input before reading its first character.",
    },
    {
      code: `function isFree(total) {\n  return total === "0";\n}\n\nconsole.log(isFree(0));`,
      fixedCode: `function isFree(total) {\n  return total === 0;\n}\n\nconsole.log(isFree(0));`,
      prompt: "A checkout page uses this helper to choose between a free confirmation and a payment flow. Prices arrive as numbers. Verify that the helper compares values using the same type supplied by the rest of the app.",
      issue: "The function compares a number with a string, so a free order is rejected. Keep value types consistent instead of relying on implicit conversions.",
    },
    {
      code: `function lastItem(items) {\n  return items[items.length];\n}\n\nconsole.log(lastItem(["a", "b"]));`,
      fixedCode: `function lastItem(items) {\n  return items[items.length - 1];\n}\n\nconsole.log(lastItem(["a", "b"]));`,
      prompt: "A list page needs to show the most recently added item. Review how JavaScript array positions are counted and what index represents the final item in a non-empty list.",
      issue: "Array indexes start at zero, so `items.length` is one past the final item. Subtract one before reading the last element.",
    },
  ] as const;

  const intermediate = [
    {
      code: `const preferences = { theme: "light", alerts: true };\n\nfunction disableAlerts(value) {\n  value.alerts = false;\n  return value;\n}\n\nconsole.log(disableAlerts(preferences));\nconsole.log(preferences);`,
      fixedCode: `const preferences = { theme: "light", alerts: true };\n\nfunction disableAlerts(value) {\n  return { ...value, alerts: false };\n}\n\nconsole.log(disableAlerts(preferences));\nconsole.log(preferences);`,
      prompt: "A settings preview turns off alerts temporarily. The saved preferences object is still needed for other parts of the page. The preview should be changed without silently changing the caller's original settings.",
      issue: "The helper mutates shared input. Return a new object so callers can decide whether to keep the change.",
    },
    {
      code: `function loadTotal() {\n  return Promise.resolve(42);\n}\n\nfunction showTotal() {\n  const total = loadTotal();\n  console.log(total + 1);\n}\n\nshowTotal();`,
      fixedCode: `function loadTotal() {\n  return Promise.resolve(42);\n}\n\nasync function showTotal() {\n  const total = await loadTotal();\n  console.log(total + 1);\n}\n\nshowTotal();`,
      prompt: "A dashboard loads a total from an asynchronous service and then adds a small adjustment. The calculation must use the resolved number, not the pending request object.",
      issue: "The function tries to calculate with a Promise. Await the asynchronous result before doing number work.",
    },
    {
      code: `function activeNames(users) {\n  return users.filter((user) => {\n    user.active;\n  });\n}\n\nconsole.log(activeNames([{ active: true }]));`,
      fixedCode: `function activeNames(users) {\n  return users.filter((user) => user.active);\n}\n\nconsole.log(activeNames([{ active: true }]));`,
      prompt: "A member page should keep only active users before rendering them. Review what the filter callback returns for each user and whether that return value represents the rule.",
      issue: "The block callback does not return a value, so every user is filtered out. Return the active condition explicitly or use an expression body.",
    },
    {
      code: `function addTag(tags, tag) {\n  tags.push(tag);\n  return tags;\n}\n\nconst current = ["news"];\nconsole.log(addTag(current, "sale"));\nconsole.log(current);`,
      fixedCode: `function addTag(tags, tag) {\n  return [...tags, tag];\n}\n\nconst current = ["news"];\nconsole.log(addTag(current, "sale"));\nconsole.log(current);`,
      prompt: "A product editor previews a new tag before saving. The currently saved tag list must stay unchanged until the user confirms. Check whether the helper changes data owned by its caller.",
      issue: "`push` changes the original array. Return a new array for a temporary or preview update.",
    },
    {
      code: `function average(values) {\n  const total = values.reduce((sum, value) => sum + value, 0);\n  return total / values.length;\n}\n\nconsole.log(average([]));`,
      fixedCode: `function average(values) {\n  if (values.length === 0) return 0;\n  const total = values.reduce((sum, value) => sum + value, 0);\n  return total / values.length;\n}\n\nconsole.log(average([]));`,
      prompt: "A report shows the average score for a selected group. A group may have no results yet. The report should show a predictable value or explicit empty state, not an invalid calculation.",
      issue: "Dividing by zero produces `NaN`. Define how the helper handles an empty collection before calculating.",
    },
  ] as const;

  const advanced = [
    {
      code: `function accountResponse(account) {\n  return {\n    id: account.id,\n    email: account.email,\n    role: account.role,\n    internalNotes: account.internalNotes,\n    sessionToken: account.sessionToken,\n  };\n}\n\nconsole.log(accountResponse({\n  id: "u1",\n  email: "maya@example.com",\n  role: "member",\n  internalNotes: "VIP",\n  sessionToken: "secret",\n}));`,
      fixedCode: `function accountResponse(account) {\n  return {\n    id: account.id,\n    email: account.email,\n    role: account.role,\n  };\n}\n\nconsole.log(accountResponse({\n  id: "u1",\n  email: "maya@example.com",\n  role: "member",\n}));`,
      prompt: "An API prepares account data for a browser client. The client needs identity and display information only. Internal staff notes and session secrets must remain on the server, even when the caller is an authenticated user.",
      issue: "The API returns private notes and a session token. Use an explicit allow-list of fields that are safe for the client.",
    },
    {
      code: `function orderLines(products, ids) {\n  return ids.map((id) => {\n    const product = products.find((item) => item.id === id);\n    return product ? { id: product.id, name: product.name } : null;\n  });\n}\n\nconsole.log(orderLines(\n  [{ id: "p1", name: "Book" }],\n  ["p1"],\n));`,
      fixedCode: `function orderLines(products, ids) {\n  const byId = new Map(products.map((item) => [item.id, item]));\n  return ids.map((id) => {\n    const product = byId.get(id);\n    return product ? { id: product.id, name: product.name } : null;\n  });\n}\n\nconsole.log(orderLines([{ id: "p1", name: "Book" }], ["p1"]));`,
      prompt: "An order page turns requested product IDs into display lines. It works with a small catalogue, but this endpoint can receive thousands of products and IDs. Review repeated work inside the loop and consider a structure that supports fast lookups.",
      issue: "Each ID scans the full products array. Build a lookup once to avoid repeated linear searches.",
    },
    {
      code: `async function saveProfile(profile) {\n  try {\n    await fetch("/api/profile", {\n      method: "POST",\n      body: JSON.stringify(profile),\n    });\n    return { ok: true };\n  } catch {\n    return { ok: true };\n  }\n}\n\nconsole.log("Profile save ready");`,
      fixedCode: `async function saveProfile(profile) {\n  const response = await fetch("/api/profile", {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(profile),\n  });\n  if (!response.ok) throw new Error("Profile could not be saved");\n  return { ok: true };\n}\n\nconsole.log("Profile save ready");`,
      prompt: "A profile form saves changes to an API. Users need an accurate success or failure result so they do not believe changes were saved when the request failed. Review network errors, unsuccessful HTTP responses, and request format.",
      issue: "The catch block reports success after a failure, and HTTP errors are not checked. Report failures honestly and verify the response status.",
    },
    {
      code: `function searchUsers(users, query) {\n  return users.filter((user) =>\n    user.name.toLowerCase().includes(query.toLowerCase()),\n  );\n}\n\nconsole.log(searchUsers([\n  { name: "Maya" },\n  { name: "Ravi" },\n], "ma"));`,
      fixedCode: `function searchUsers(users, query) {\n  const normalizedQuery = query.trim().toLowerCase();\n  if (!normalizedQuery) return [];\n  return users.filter((user) =>\n    user.name.toLowerCase().includes(normalizedQuery),\n  );\n}\n\nconsole.log(searchUsers([{ name: "Maya" }], "ma"));`,
      prompt: "An admin page searches user names. Search input can contain leading spaces or be empty. An empty request should not unexpectedly return every account, especially when the result may be large or sensitive.",
      issue: "An empty search matches every name. Normalize input and decide on an explicit empty-query behaviour.",
    },
    {
      code: `function auditEvent(event) {\n  console.log("audit", event);\n  return true;\n}\n\nfunction deleteAccount(account) {\n  auditEvent({\n    action: "delete",\n    accountId: account.id,\n    email: account.email,\n    password: account.password,\n  });\n  return "deleted";\n}\n\nconsole.log(deleteAccount({\n  id: "u1",\n  email: "maya@example.com",\n  password: "secret",\n}));`,
      fixedCode: `function auditEvent(event) {\n  console.log("audit", event);\n  return true;\n}\n\nfunction deleteAccount(account) {\n  auditEvent({\n    action: "delete",\n    accountId: account.id,\n  });\n  return "deleted";\n}\n\nconsole.log(deleteAccount({ id: "u1" }));`,
      prompt: "An account deletion flow records an audit event. Audit logs are often widely accessible to support and operations teams. They need an action and account reference, but they do not need credentials or unnecessary personal data.",
      issue: "The audit event logs a password and email. Logs must use data minimization because they are long-lived and broadly accessible.",
    },
  ] as const;

  const source = level === "Basic" ? basic[index % basic.length] : level === "Intermediate" ? intermediate[index % intermediate.length] : advanced[index % advanced.length];
  return {
    id,
    level,
    title: `${level} review ${index + 1}`,
    summary: "Review the code before revealing the expected answer.",
    prompt: source.prompt,
    code: source.code,
    issues: [source.issue],
    fixedCode: source.fixedCode,
  };
}

const EXPLICIT_BASIC_CHALLENGES: CodeReviewChallenge[] = [
  {
    id: 10, level: "Basic", title: "Coupon state", summary: "", prompt: "A checkout page must apply a coupon only when the API marks it as active. The API sends a boolean. Review whether this comparison accepts only the intended value.",
    code: `function canApplyCoupon(coupon) {\n  return coupon.active == true;\n}\n\nconsole.log(canApplyCoupon({ active: "true" }));`,
    issues: ["Loose equality accepts values that are not the boolean `true`. Use strict equality or return the boolean field directly."],
    fixedCode: `function canApplyCoupon(coupon) {\n  return coupon.active === true;\n}\n\nconsole.log(canApplyCoupon({ active: true }));`,
  },
  {
    id: 11, level: "Basic", title: "Seat count", summary: "", prompt: "A booking screen needs one label for every available seat. The first seat is 1 and the final seat must be included. Review the loop boundary.",
    code: `function seatLabels(count) {\n  const labels = [];\n  for (let seat = 1; seat < count; seat += 1) labels.push(seat);\n  return labels;\n}\n\nconsole.log(seatLabels(3));`,
    issues: ["The final seat is skipped because the loop stops before `count`. Include the upper boundary."],
    fixedCode: `function seatLabels(count) {\n  const labels = [];\n  for (let seat = 1; seat <= count; seat += 1) labels.push(seat);\n  return labels;\n}\n\nconsole.log(seatLabels(3));`,
  },
  {
    id: 12, level: "Basic", title: "Invoice total", summary: "", prompt: "An invoice adds a base price and delivery fee received from a form. Both values must be treated as money amounts before calculating the total.",
    code: `function invoiceTotal(price, delivery) {\n  return price + delivery;\n}\n\nconsole.log(invoiceTotal("20", "5"));`,
    issues: ["Form values are strings, so `+` joins text instead of adding money. Convert and validate numeric input at the boundary."],
    fixedCode: `function invoiceTotal(price, delivery) {\n  return Number(price) + Number(delivery);\n}\n\nconsole.log(invoiceTotal("20", "5"));`,
  },
  {
    id: 13, level: "Basic", title: "Optional avatar", summary: "", prompt: "A member directory shows an avatar URL when one exists. New members may not have an avatar yet, but the directory must still render safely.",
    code: `function avatarUrl(member) {\n  return member.avatar.url;\n}\n\nconsole.log(avatarUrl({ name: "Maya" }));`,
    issues: ["The code assumes `avatar` always exists. Check optional nested data before reading its URL."],
    fixedCode: `function avatarUrl(member) {\n  return member.avatar?.url ?? "/avatar-placeholder.png";\n}\n\nconsole.log(avatarUrl({ name: "Maya" }));`,
  },
  {
    id: 14, level: "Basic", title: "Recent orders", summary: "", prompt: "A dashboard shows the three newest orders but must not change the order of the original list used elsewhere on the page.",
    code: `function recentOrders(orders) {\n  return orders.sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);\n}\n\nconsole.log(recentOrders([{ createdAt: 1 }, { createdAt: 2 }]));`,
    issues: ["`sort` mutates the input array. Copy the list before sorting when callers may reuse the original order."],
    fixedCode: `function recentOrders(orders) {\n  return [...orders].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);\n}\n\nconsole.log(recentOrders([{ createdAt: 1 }, { createdAt: 2 }]));`,
  },
  {
    id: 15, level: "Basic", title: "Feature flag", summary: "", prompt: "A product launches a new checkout only when the feature flag is enabled. A missing flag must keep the existing checkout active.",
    code: `function checkoutVersion(flags) {\n  if (flags.newCheckout) return "new";\n  return "old";\n}\n\nconsole.log(checkoutVersion({ newCheckout: "false" }));`,
    issues: ["The string `\"false\"` is truthy in JavaScript. Feature flags should be parsed as booleans before they control a release path."],
    fixedCode: `function checkoutVersion(flags) {\n  return flags.newCheckout === true ? "new" : "old";\n}\n\nconsole.log(checkoutVersion({ newCheckout: false }));`,
  },
  {
    id: 16, level: "Basic", title: "Tax rounding", summary: "", prompt: "A receipt calculates tax in cents. Customers must never see a floating-point number with many decimal places.",
    code: `function tax(price) {\n  return price * 0.1;\n}\n\nconsole.log(tax(0.29));`,
    issues: ["Floating-point arithmetic can produce display values such as `0.029`. Round at the money boundary before presenting or storing the amount."],
    fixedCode: `function tax(price) {\n  return Math.round(price * 0.1 * 100) / 100;\n}\n\nconsole.log(tax(0.29));`,
  },
];

const EXPLICIT_BASIC_CHALLENGES_PHASE_TWO: CodeReviewChallenge[] = [
  {
    id: 17, level: "Basic", title: "Search input", summary: "", prompt: "A product search sends the typed phrase to an API. Whitespace-only input should not trigger an unnecessary request or look like a real search.",
    code: `function shouldSearch(query) {\n  return query.length > 0;\n}\n\nconsole.log(shouldSearch("   "));`,
    issues: ["Whitespace has a length, so the function treats an empty search as valid. Trim user input before checking it."],
    fixedCode: `function shouldSearch(query) {\n  return query.trim().length > 0;\n}\n\nconsole.log(shouldSearch("   "));`,
  },
  {
    id: 18, level: "Basic", title: "Retry count", summary: "", prompt: "A payment request may be retried at most three times. Review whether the guard allows a fourth request after all retries have been used.",
    code: `function canRetry(attempts) {\n  return attempts <= 3;\n}\n\nconsole.log(canRetry(3));`,
    issues: ["If `attempts` means retries already used, the third retry is already exhausted. The comparison must match the business definition of the counter."],
    fixedCode: `function canRetry(attempts) {\n  return attempts < 3;\n}\n\nconsole.log(canRetry(3));`,
  },
  {
    id: 19, level: "Basic", title: "Unread badge", summary: "", prompt: "A notification badge should show a count only when unread notifications exist. A zero count should not leave an empty badge visible.",
    code: `function badgeText(unreadCount) {\n  return unreadCount ? unreadCount : "0";\n}\n\nconsole.log(badgeText(0));`,
    issues: ["Returning the string `\"0\"` makes it easy for the UI to render a badge when none is needed. Return `null` for no badge and let the UI hide it."],
    fixedCode: `function badgeText(unreadCount) {\n  return unreadCount > 0 ? String(unreadCount) : null;\n}\n\nconsole.log(badgeText(0));`,
  },
  {
    id: 20, level: "Basic", title: "Profile age", summary: "", prompt: "A profile form validates age before saving. An age must be a whole number in the accepted range, not just text that starts with a valid number.",
    code: `function isValidAge(age) {\n  return parseInt(age, 10) >= 18;\n}\n\nconsole.log(isValidAge("18years"));`,
    issues: ["`parseInt` accepts partial values like `18years`. Validate the complete value and range instead of accepting a numeric prefix."],
    fixedCode: `function isValidAge(age) {\n  const value = Number(age);\n  return Number.isInteger(value) && value >= 18 && value <= 120;\n}\n\nconsole.log(isValidAge("18years"));`,
  },
  {
    id: 21, level: "Basic", title: "Saved address", summary: "", prompt: "A checkout should use a customer's default address when it exists. A customer may have no saved addresses yet, so the helper needs a safe fallback.",
    code: `function defaultAddress(addresses) {\n  return addresses.find((address) => address.default).street;\n}\n\nconsole.log(defaultAddress([]));`,
    issues: ["`find` can return `undefined`, so accessing `street` crashes for a new customer. Handle a missing default before reading its fields."],
    fixedCode: `function defaultAddress(addresses) {\n  return addresses.find((address) => address.default)?.street ?? null;\n}\n\nconsole.log(defaultAddress([]));`,
  },
  {
    id: 22, level: "Basic", title: "Price filter", summary: "", prompt: "A catalogue filters products below a maximum price. Products priced exactly at the selected maximum must remain visible.",
    code: `function withinBudget(product, maximum) {\n  return product.price < maximum;\n}\n\nconsole.log(withinBudget({ price: 50 }, 50));`,
    issues: ["The strict comparison removes a product at the selected maximum. Include the stated boundary with `<=`."],
    fixedCode: `function withinBudget(product, maximum) {\n  return product.price <= maximum;\n}\n\nconsole.log(withinBudget({ price: 50 }, 50));`,
  },
  {
    id: 23, level: "Basic", title: "Shipping country", summary: "", prompt: "A shipping form checks whether a country is supported. Country codes may arrive in lowercase from a browser or integration, but the supported list is uppercase.",
    code: `function canShipTo(country) {\n  return ["JP", "NP", "US"].includes(country);\n}\n\nconsole.log(canShipTo("jp"));`,
    issues: ["The result depends on letter case. Normalize external values before comparing them with canonical codes."],
    fixedCode: `function canShipTo(country) {\n  return ["JP", "NP", "US"].includes(country.toUpperCase());\n}\n\nconsole.log(canShipTo("jp"));`,
  },
];

function basicReview(id: number, prompt: string, code: string, issue: string, fixedCode: string): CodeReviewChallenge {
  return { id, level: "Basic", title: `Basic review ${id}`, summary: "", prompt, code, issues: [issue], fixedCode };
}

const EXPLICIT_BASIC_CHALLENGES_PHASE_THREE: CodeReviewChallenge[] = [
  basicReview(24, "A cart must display every item name, including the first item.", `function itemNames(items) {\n  return items.slice(1).map((item) => item.name);\n}\nconsole.log(itemNames([{ name: "Book" }]));`, "Starting at index one drops the first cart item.", `function itemNames(items) {\n  return items.map((item) => item.name);\n}\nconsole.log(itemNames([{ name: "Book" }]));`),
  basicReview(25, "A loyalty balance must treat a zero balance as a valid number.", `function balanceText(balance) {\n  return balance || "Unknown";\n}\nconsole.log(balanceText(0));`, "Zero is falsy, so a valid balance is replaced with a fallback.", `function balanceText(balance) {\n  return balance ?? "Unknown";\n}\nconsole.log(balanceText(0));`),
  basicReview(26, "A user role check must reject values outside the allowed roles.", `function isRole(role) {\n  return role === "admin" || "editor";\n}\nconsole.log(isRole("guest"));`, "The string `editor` is always truthy, so every role passes.", `function isRole(role) {\n  return role === "admin" || role === "editor";\n}\nconsole.log(isRole("guest"));`),
  basicReview(27, "An order status label must have a safe value for unknown statuses.", `function statusLabel(status) {\n  const labels = { paid: "Paid", pending: "Pending" };\n  return labels[status].toUpperCase();\n}\nconsole.log(statusLabel("cancelled"));`, "Unknown statuses produce undefined and crash the label renderer.", `function statusLabel(status) {\n  const labels = { paid: "Paid", pending: "Pending" };\n  return (labels[status] ?? "Unknown").toUpperCase();\n}\nconsole.log(statusLabel("cancelled"));`),
  basicReview(28, "A percentage should accept a decimal rate such as 0.15.", `function discount(price, rate) {\n  return price - price * (rate / 100);\n}\nconsole.log(discount(100, 0.15));`, "The function divides an already decimal rate by 100 again.", `function discount(price, rate) {\n  return price - price * rate;\n}\nconsole.log(discount(100, 0.15));`),
  basicReview(29, "A selected tab index must stay inside the tabs array.", `function selectedTab(tabs, index) {\n  return tabs[index + 1];\n}\nconsole.log(selectedTab(["Home", "Orders"], 1));`, "Incrementing the requested index reads past the final tab.", `function selectedTab(tabs, index) {\n  return tabs[index] ?? null;\n}\nconsole.log(selectedTab(["Home", "Orders"], 1));`),
  basicReview(30, "A delivery estimate should use whole days from a numeric API value.", `function deliveryText(days) {\n  return "Arrives in " + days + 1 + " days";\n}\nconsole.log(deliveryText(2));`, "String concatenation changes the arithmetic order and produces `21` days.", `function deliveryText(days) {\n  return \`Arrives in \${days + 1} days\`;\n}\nconsole.log(deliveryText(2));`),
  basicReview(31, "A form should save only after its required email is present.", `function canSave(form) {\n  return form.email !== "";\n}\nconsole.log(canSave({}));`, "A missing email is undefined, which incorrectly passes the check.", `function canSave(form) {\n  return typeof form.email === "string" && form.email.trim() !== "";\n}\nconsole.log(canSave({}));`),
  basicReview(32, "A report needs the highest sale, even if all sales are negative.", `function highestSale(sales) {\n  return Math.max(0, ...sales);\n}\nconsole.log(highestSale([-5, -2]));`, "Starting with zero invents a sale that did not happen.", `function highestSale(sales) {\n  return sales.length ? Math.max(...sales) : null;\n}\nconsole.log(highestSale([-5, -2]));`),
  basicReview(33, "A username comparison should ignore accidental outer spaces.", `function sameUser(a, b) {\n  return a.toLowerCase() === b.toLowerCase();\n}\nconsole.log(sameUser("maya ", "Maya"));`, "Case is normalized but whitespace is not.", `function sameUser(a, b) {\n  return a.trim().toLowerCase() === b.trim().toLowerCase();\n}\nconsole.log(sameUser("maya ", "Maya"));`),
  basicReview(34, "A stock warning should appear when stock reaches the reorder point.", `function needsReorder(stock, minimum) {\n  return stock < minimum;\n}\nconsole.log(needsReorder(5, 5));`, "Stock exactly at the minimum is missed.", `function needsReorder(stock, minimum) {\n  return stock <= minimum;\n}\nconsole.log(needsReorder(5, 5));`),
  basicReview(35, "A name formatter must preserve names containing more than two words.", `function displayName(name) {\n  return name.split(" ")[0] + " " + name.split(" ")[1];\n}\nconsole.log(displayName("Maya Devi Sharma"));`, "The formatter silently drops the final name part.", `function displayName(name) {\n  return name.trim().split(/\\s+/).join(" ");\n}\nconsole.log(displayName("Maya Devi Sharma"));`),
  basicReview(36, "A list count should be numeric before it is displayed in a summary.", `function totalItems(count) {\n  return count + 1;\n}\nconsole.log(totalItems("4"));`, "A string count joins text instead of adding an item.", `function totalItems(count) {\n  return Number(count) + 1;\n}\nconsole.log(totalItems("4"));`),
  basicReview(37, "A product price must not use a negative input.", `function displayPrice(price) {\n  return Math.abs(price);\n}\nconsole.log(displayPrice(-20));`, "Taking an absolute value hides invalid pricing data instead of rejecting it.", `function displayPrice(price) {\n  if (price < 0) throw new Error("Price cannot be negative");\n  return price;\n}\nconsole.log(displayPrice(20));`),
  basicReview(38, "A weekday selector should map Sunday correctly.", `function weekday(day) {\n  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][day];\n}\nconsole.log(weekday(0));`, "JavaScript weekday zero is Sunday, but this array starts with Monday.", `function weekday(day) {\n  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day];\n}\nconsole.log(weekday(0));`),
  basicReview(39, "A password form should not log a secret while debugging.", `function submitLogin(email, password) {\n  console.log({ email, password });\n  return true;\n}\nsubmitLogin("maya@example.com", "secret");`, "Passwords must never be written to browser logs.", `function submitLogin(email, password) {\n  console.log({ email, hasPassword: Boolean(password) });\n  return true;\n}\nsubmitLogin("maya@example.com", "secret");`),
  basicReview(40, "A query builder should encode text supplied by a customer.", `function searchUrl(query) {\n  return "/search?q=" + query;\n}\nconsole.log(searchUrl("tea & coffee"));`, "Special characters change the URL query structure.", `function searchUrl(query) {\n  return \`/search?q=\${encodeURIComponent(query)}\`;\n}\nconsole.log(searchUrl("tea & coffee"));`),
  basicReview(41, "A CSV row should not add a trailing comma after the final value.", `function csv(values) {\n  return values.map((value) => value + ",").join("");\n}\nconsole.log(csv(["a", "b"]));`, "Appending commas inside the map leaves an invalid trailing delimiter.", `function csv(values) {\n  return values.join(",");\n}\nconsole.log(csv(["a", "b"]));`),
  basicReview(42, "A maintenance banner should be visible only while maintenance is enabled.", `function showBanner(settings) {\n  return settings.maintenance || true;\n}\nconsole.log(showBanner({ maintenance: false }));`, "`|| true` makes the banner visible for every setting.", `function showBanner(settings) {\n  return settings.maintenance === true;\n}\nconsole.log(showBanner({ maintenance: false }));`),
  basicReview(43, "A receipt number should keep leading zeroes supplied by the payment provider.", `function receiptNumber(number) {\n  return Number(number);\n}\nconsole.log(receiptNumber("001284"));`, "Converting an identifier to a number removes meaningful leading zeroes.", `function receiptNumber(number) {\n  return String(number);\n}\nconsole.log(receiptNumber("001284"));`),
];

const EXPLICIT_BASIC_CHALLENGES_PHASE_FOUR: CodeReviewChallenge[] = [
  basicReview(44, "A calendar should show the correct month name for JavaScript month numbers.", `function monthName(month) {\n return ["Jan", "Feb", "Mar"][month];\n}\nconsole.log(monthName(1));`, "JavaScript months are zero-based, so index one is February.", `function monthName(month) {\n return ["Jan", "Feb", "Mar"][month - 1];\n}\nconsole.log(monthName(1));`),
  basicReview(45, "A promo input should remove duplicate codes before sending them.", `function promoCodes(codes) {\n return codes;\n}\nconsole.log(promoCodes(["SAVE", "SAVE"]));`, "Duplicate codes can apply the same offer twice.", `function promoCodes(codes) {\n return [...new Set(codes)];\n}\nconsole.log(promoCodes(["SAVE", "SAVE"]));`),
  basicReview(46, "A signup should reject an email containing only spaces.", `function hasEmail(email) {\n return Boolean(email);\n}\nconsole.log(hasEmail("   "));`, "Whitespace is truthy but is not an email address.", `function hasEmail(email) {\n return email.trim().length > 0;\n}\nconsole.log(hasEmail("   "));`),
  basicReview(47, "A points balance should not expose an internal numeric value as a formatted string for later math.", `function bonus(points) {\n return points.toFixed(2) + 10;\n}\nconsole.log(bonus(5));`, "`toFixed` returns text, causing string concatenation.", `function bonus(points) {\n return Number(points.toFixed(2)) + 10;\n}\nconsole.log(bonus(5));`),
  basicReview(48, "A product card should use the inventory value, even when it is zero.", `function stockText(stock) {\n return stock || "Loading";\n}\nconsole.log(stockText(0));`, "Zero stock is replaced by a loading message.", `function stockText(stock) {\n return stock ?? "Loading";\n}\nconsole.log(stockText(0));`),
  basicReview(49, "A phone extension should keep a leading zero.", `function extension(value) {\n return parseInt(value, 10);\n}\nconsole.log(extension("042"));`, "An extension is an identifier, not a number for arithmetic.", `function extension(value) {\n return String(value);\n}\nconsole.log(extension("042"));`),
  basicReview(50, "A quantity control should prevent negative quantities.", `function nextQuantity(quantity) {\n return quantity - 1;\n}\nconsole.log(nextQuantity(0));`, "The control allows a cart quantity below zero.", `function nextQuantity(quantity) {\n return Math.max(0, quantity - 1);\n}\nconsole.log(nextQuantity(0));`),
  basicReview(51, "A locale setting should have a default when storage is empty.", `function locale(saved) {\n return saved.toLowerCase();\n}\nconsole.log(locale(null));`, "Missing storage data crashes the settings screen.", `function locale(saved) {\n return (saved ?? "en").toLowerCase();\n}\nconsole.log(locale(null));`),
  basicReview(52, "A comment preview should limit text without adding an ellipsis to short comments.", `function preview(text) {\n return text.slice(0, 80) + "…";\n}\nconsole.log(preview("Hi"));`, "Short comments get a misleading truncation marker.", `function preview(text) {\n return text.length > 80 ? text.slice(0, 80) + "…" : text;\n}\nconsole.log(preview("Hi"));`),
  basicReview(53, "A region check should avoid changing the shared input object.", `function setRegion(user) {\n user.region = "JP"; return user;\n}\nconsole.log(setRegion({ name: "Maya" }));`, "The helper mutates caller-owned user data.", `function setRegion(user) {\n return { ...user, region: "JP" };\n}\nconsole.log(setRegion({ name: "Maya" }));`),
  basicReview(54, "A transfer form must treat an amount of zero as invalid.", `function canTransfer(amount) {\n return amount >= 0;\n}\nconsole.log(canTransfer(0));`, "Zero is not a meaningful transfer amount.", `function canTransfer(amount) {\n return amount > 0;\n}\nconsole.log(canTransfer(0));`),
  basicReview(55, "A support queue should show the oldest ticket first.", `function oldest(tickets) {\n return tickets[tickets.length];\n}\nconsole.log(oldest(["T1"]));`, "The index points after the final ticket.", `function oldest(tickets) {\n return tickets[0] ?? null;\n}\nconsole.log(oldest(["T1"]));`),
  basicReview(56, "A dashboard should format a fraction as a percentage.", `function percentage(value) {\n return value + "%";\n}\nconsole.log(percentage(0.25));`, "A fraction is displayed as `0.25%` instead of `25%`.", `function percentage(value) {\n return \`\${Math.round(value * 100)}%\`;\n}\nconsole.log(percentage(0.25));`),
];

function intermediateReview(id: number, title: string, prompt: string, code: string, issue: string, fixedCode: string): CodeReviewChallenge {
  return { id, level: "Intermediate", title, summary: "", prompt, code, issues: [issue], fixedCode };
}

const EXPLICIT_INTERMEDIATE_CHALLENGES: CodeReviewChallenge[] = [
  intermediateReview(57, "Cancelled search", "A search box sends a request after each key press. A slow earlier request must not overwrite the results from a later search.", `let visible = "";\n\nfunction search(query, delay) {\n  setTimeout(() => { visible = query; }, delay);\n}\n\nsearch("cat", 200);\nsearch("cats", 50);\nsetTimeout(() => console.log(visible), 250);`, "The slower first request finishes last and replaces newer results. Track the newest request before updating the screen.", `let visible = "";\nlet requestId = 0;\n\nfunction search(query, delay) {\n  const currentId = ++requestId;\n  setTimeout(() => {\n    if (currentId === requestId) visible = query;\n  }, delay);\n}\n\nsearch("cat", 200);\nsearch("cats", 50);\nsetTimeout(() => console.log(visible), 250);`),
  intermediateReview(58, "HTTP error response", "A profile screen loads account data. A server can reply with an error status even when the network request itself completes.", `async function loadProfile() {\n  const response = await Promise.resolve({\n    ok: false,\n    json: async () => ({ message: "Not found" }),\n  });\n  return response.json();\n}\n\nloadProfile().then(console.log);`, "`fetch`-style APIs resolve for HTTP errors. Check `response.ok` before treating the response body as usable data.", `async function loadProfile() {\n  const response = await Promise.resolve({\n    ok: false,\n    json: async () => ({ message: "Not found" }),\n  });\n  if (!response.ok) throw new Error("Profile could not be loaded");\n  return response.json();\n}\n\nloadProfile().catch((error) => console.log(error.message));`),
  intermediateReview(59, "Nested address update", "A checkout lets a user edit a shipping city. The old address object is also used in an order summary until the user saves.", `const order = { shipping: { city: "Tokyo", country: "JP" } };\n\nfunction changeCity(value, city) {\n  value.shipping.city = city;\n  return { ...value };\n}\n\nconst preview = changeCity(order, "Osaka");\nconsole.log(order.shipping.city, preview.shipping.city);`, "Copying only the outer object still shares `shipping`. Copy every changed nested level.", `const order = { shipping: { city: "Tokyo", country: "JP" } };\n\nfunction changeCity(value, city) {\n  return {\n    ...value,\n    shipping: { ...value.shipping, city },\n  };\n}\n\nconst preview = changeCity(order, "Osaka");\nconsole.log(order.shipping.city, preview.shipping.city);`),
  intermediateReview(60, "Missing return after rejection", "A payment helper must stop immediately when the amount is invalid. It must not continue to charge after reporting the error.", `function charge(amount) {\n  if (amount <= 0) {\n    console.log("Invalid amount");\n  }\n  return "Charged " + amount;\n}\n\nconsole.log(charge(0));`, "The invalid path logs an error but still completes the charge. Return or throw when the guard fails.", `function charge(amount) {\n  if (amount <= 0) {\n    throw new Error("Invalid amount");\n  }\n  return \`Charged \${amount}\`;\n}\n\ntry {\n  console.log(charge(0));\n} catch (error) {\n  console.log(error.message);\n}`),
  intermediateReview(61, "Shared default tags", "Each new article should receive its own tag list. Adding a tag to one draft must not affect another draft.", `const defaultTags = [];\n\nfunction createArticle(title) {\n  return { title, tags: defaultTags };\n}\n\nconst first = createArticle("News");\nconst second = createArticle("Guide");\nfirst.tags.push("featured");\nconsole.log(second.tags);`, "Both articles share one array. Create a fresh array for each record.", `function createArticle(title) {\n  return { title, tags: [] };\n}\n\nconst first = createArticle("News");\nconst second = createArticle("Guide");\nfirst.tags.push("featured");\nconsole.log(second.tags);`),
  intermediateReview(62, "Duplicate submit", "A form should create one order even if a customer clicks the submit button twice before the request finishes.", `let orders = 0;\n\nasync function submitOrder() {\n  await Promise.resolve();\n  orders += 1;\n  return "Order created";\n}\n\nPromise.all([submitOrder(), submitOrder()]).then(() => console.log(orders));`, "Nothing prevents two in-flight submissions. Keep submission state and reject a second click until the first finishes.", `let orders = 0;\nlet isSubmitting = false;\n\nasync function submitOrder() {\n  if (isSubmitting) return "Already submitting";\n  isSubmitting = true;\n  try {\n    await Promise.resolve();\n    orders += 1;\n    return "Order created";\n  } finally {\n    isSubmitting = false;\n  }\n}\n\nPromise.all([submitOrder(), submitOrder()]).then(() => console.log(orders));`),
  intermediateReview(63, "Stale total", "A cart removes an item and then displays its total. The displayed number must come from the updated cart.", `function removeItem(cart, id) {\n  const total = cart.reduce((sum, item) => sum + item.price, 0);\n  const items = cart.filter((item) => item.id !== id);\n  return { items, total };\n}\n\nconsole.log(removeItem([{ id: 1, price: 10 }, { id: 2, price: 5 }], 2));`, "The total is calculated before the item is removed. Derive it from the returned items.", `function removeItem(cart, id) {\n  const items = cart.filter((item) => item.id !== id);\n  const total = items.reduce((sum, item) => sum + item.price, 0);\n  return { items, total };\n}\n\nconsole.log(removeItem([{ id: 1, price: 10 }, { id: 2, price: 5 }], 2));`),
  intermediateReview(64, "Timezone date", "A booking page labels a date selected from an HTML date input. The label must stay on the calendar date the customer chose.", `function bookingLabel(dateText) {\n  return new Date(dateText).toLocaleDateString("en-US");\n}\n\nconsole.log(bookingLabel("2026-01-01"));`, "A date-only string is interpreted as UTC, which can display the previous date in some timezones. Treat a calendar date as local parts.", `function bookingLabel(dateText) {\n  const [year, month, day] = dateText.split("-").map(Number);\n  return new Date(year, month - 1, day).toLocaleDateString("en-US");\n}\n\nconsole.log(bookingLabel("2026-01-01"));`),
  intermediateReview(65, "Invalid JSON cache", "A settings page reads a value from storage. Older browsers may contain broken or manually edited JSON.", `function savedTheme(value) {\n  return JSON.parse(value).theme;\n}\n\nconsole.log(savedTheme("not-json"));`, "Invalid JSON crashes the whole settings page. Catch parsing errors and use a safe fallback.", `function savedTheme(value) {\n  try {\n    return JSON.parse(value).theme ?? "system";\n  } catch {\n    return "system";\n  }\n}\n\nconsole.log(savedTheme("not-json"));`),
  intermediateReview(66, "Wrong event target", "A list has a button containing an icon. Clicking the icon should still identify the button's order ID.", `function orderIdFromClick(event) {\n  return event.target.dataset.orderId;\n}\n\nconsole.log(orderIdFromClick({\n  target: { dataset: {} },\n  currentTarget: { dataset: { orderId: "o1" } },\n}));`, "`target` is the inner icon that was clicked. `currentTarget` is the button that owns the handler.", `function orderIdFromClick(event) {\n  return event.currentTarget.dataset.orderId;\n}\n\nconsole.log(orderIdFromClick({\n  target: { dataset: {} },\n  currentTarget: { dataset: { orderId: "o1" } },\n}));`),
  intermediateReview(67, "Retry never resets", "A save button retries after a temporary failure. A later successful save must clear the old retry count.", `let retries = 0;\n\nfunction save(ok) {\n  if (!ok) retries += 1;\n  return retries;\n}\n\nsave(false);\nsave(true);\nconsole.log(retries);`, "A successful request leaves the old failure state behind. Reset retry state after success.", `let retries = 0;\n\nfunction save(ok) {\n  if (!ok) {\n    retries += 1;\n    return retries;\n  }\n  retries = 0;\n  return retries;\n}\n\nsave(false);\nsave(true);\nconsole.log(retries);`),
  intermediateReview(68, "Optional API list", "An analytics response may omit its events list while a report is still loading. The summary must remain usable.", `function eventCount(response) {\n  return response.events.length;\n}\n\nconsole.log(eventCount({ status: "loading" }));`, "The code assumes optional API data already exists. Use a fallback list until it does.", `function eventCount(response) {\n  return (response.events ?? []).length;\n}\n\nconsole.log(eventCount({ status: "loading" }));`),
  intermediateReview(69, "Sorts shared orders", "A dashboard shows newest orders while a second panel still needs the server order unchanged.", `function newestOrders(orders) {\n  return orders.sort((a, b) => b.createdAt - a.createdAt);\n}\n\nconst orders = [{ id: "old", createdAt: 1 }, { id: "new", createdAt: 2 }];\nnewestOrders(orders);\nconsole.log(orders[0].id);`, "`sort` changes the source array. Copy before sorting when another view owns the original order.", `function newestOrders(orders) {\n  return [...orders].sort((a, b) => b.createdAt - a.createdAt);\n}\n\nconst orders = [{ id: "old", createdAt: 1 }, { id: "new", createdAt: 2 }];\nnewestOrders(orders);\nconsole.log(orders[0].id);`),
  intermediateReview(70, "Promise error boundary", "A notification service can fail. The caller needs a handled failure instead of an unhandled rejection.", `function sendNotification() {\n  return Promise.reject(new Error("Service unavailable"));\n}\n\nsendNotification().then(() => console.log("Sent"));`, "The rejection has no handler. Handle the failure where the promise is consumed.", `function sendNotification() {\n  return Promise.reject(new Error("Service unavailable"));\n}\n\nsendNotification()\n  .then(() => console.log("Sent"))\n  .catch((error) => console.log(error.message));`),
  intermediateReview(71, "Falsy delivery note", "A delivery note can be an empty string because the customer intentionally left it blank. Only missing values should receive the fallback.", `function deliveryNote(note) {\n  return note || "No delivery note";\n}\n\nconsole.log(deliveryNote(""));`, "`||` treats an intentional empty value as missing. Use `??` when only null and undefined are absent.", `function deliveryNote(note) {\n  return note ?? "No delivery note";\n}\n\nconsole.log(deliveryNote(""));`),
  intermediateReview(72, "Mismatched IDs", "A permission check compares an account ID from the URL with an ID from an API. The URL value is text and must not be loosely matched.", `function ownsAccount(sessionUserId, accountId) {\n  return sessionUserId == accountId;\n}\n\nconsole.log(ownsAccount(0, ""));`, "Loose equality can treat unrelated values as equal. Normalize IDs and compare strictly.", `function ownsAccount(sessionUserId, accountId) {\n  return String(sessionUserId) === String(accountId);\n}\n\nconsole.log(ownsAccount(0, ""));`),
  intermediateReview(73, "Partial inventory update", "A warehouse update changes stock for one SKU. Other product fields must remain available to the next screen.", `function updateStock(product, stock) {\n  return { id: product.id, stock };\n}\n\nconsole.log(updateStock({ id: "p1", name: "Pen", stock: 2 }, 4));`, "The update drops unrelated product fields. Merge the changed field into the existing record.", `function updateStock(product, stock) {\n  return { ...product, stock };\n}\n\nconsole.log(updateStock({ id: "p1", name: "Pen", stock: 2 }, 4));`),
  intermediateReview(74, "Failed loading state", "A page shows a spinner while an account loads. The spinner must stop whether the request succeeds or fails.", `let loading = true;\n\nasync function loadAccount() {\n  await Promise.reject(new Error("Offline"));\n  loading = false;\n}\n\nloadAccount().catch(() => console.log(loading));`, "The assignment is skipped on failure. Put cleanup in `finally` so it always runs.", `let loading = true;\n\nasync function loadAccount() {\n  try {\n    await Promise.reject(new Error("Offline"));\n  } finally {\n    loading = false;\n  }\n}\n\nloadAccount().catch(() => console.log(loading));`),
  intermediateReview(75, "Map without a result", "An order screen builds display lines for each item. Every callback must return the new line.", `function orderLines(items) {\n  return items.map((item) => {\n    { name: item.name, quantity: item.quantity };\n  });\n}\n\nconsole.log(orderLines([{ name: "Book", quantity: 1 }]));`, "The braces create a block, not an object return. Return the object explicitly or wrap it in parentheses.", `function orderLines(items) {\n  return items.map((item) => ({\n    name: item.name,\n    quantity: item.quantity,\n  }));\n}\n\nconsole.log(orderLines([{ name: "Book", quantity: 1 }]));`),
  intermediateReview(76, "Wrong percentage", "A checkout calculates a 15 percent discount. The displayed discount must be based on the original price.", `function discountedPrice(price, percent) {\n  return price - percent / 100;\n}\n\nconsole.log(discountedPrice(200, 15));`, "The code subtracts only the decimal rate, not a percentage of the price. Multiply the price by the rate.", `function discountedPrice(price, percent) {\n  return price * (1 - percent / 100);\n}\n\nconsole.log(discountedPrice(200, 15));`),
  intermediateReview(77, "One-time coupon", "A checkout can receive the same coupon twice from a retry. It must apply each coupon code only once.", `function couponCodes(codes) {\n  return codes.map((code) => code.toUpperCase());\n}\n\nconsole.log(couponCodes(["save10", "SAVE10"]));`, "Normalizing case is not enough. Remove duplicates after applying the business rule.", `function couponCodes(codes) {\n  return [...new Set(codes.map((code) => code.toUpperCase()))];\n}\n\nconsole.log(couponCodes(["save10", "SAVE10"]));`),
  intermediateReview(78, "Incorrect cache key", "A product cache stores results by product ID and locale. Different locales must not read one another's labels.", `const cache = new Map();\n\nfunction cacheKey(id, locale) {\n  return id;\n}\n\ncache.set(cacheKey("p1", "en"), "Book");\nconsole.log(cache.get(cacheKey("p1", "jp")));`, "The cache key ignores locale, so one result overwrites another. Include every input that changes the response.", `const cache = new Map();\n\nfunction cacheKey(id, locale) {\n  return \`\${id}:\${locale}\`;\n}\n\ncache.set(cacheKey("p1", "en"), "Book");\nconsole.log(cache.get(cacheKey("p1", "jp")));`),
  intermediateReview(79, "Missing URL encoding", "A filter link includes a customer-entered search term. Characters such as `&` must remain part of the term.", `function searchLink(query) {\n  return \`/products?q=\${query}\`;\n}\n\nconsole.log(searchLink("tea & coffee"));`, "Unencoded text can change the URL's query structure. Encode external values at the URL boundary.", `function searchLink(query) {\n  return \`/products?q=\${encodeURIComponent(query)}\`;\n}\n\nconsole.log(searchLink("tea & coffee"));`),
  intermediateReview(80, "Overwritten draft", "Two autosaves start close together. A slow old save must not mark an older draft as the latest saved version.", `let latestSaved = "";\n\nfunction saveDraft(text, delay) {\n  setTimeout(() => { latestSaved = text; }, delay);\n}\n\nsaveDraft("first", 200);\nsaveDraft("second", 50);\nsetTimeout(() => console.log(latestSaved), 250);`, "The old save wins when it finishes last. Version each save and accept only the newest completion.", `let latestSaved = "";\nlet version = 0;\n\nfunction saveDraft(text, delay) {\n  const currentVersion = ++version;\n  setTimeout(() => {\n    if (currentVersion === version) latestSaved = text;\n  }, delay);\n}\n\nsaveDraft("first", 200);\nsaveDraft("second", 50);\nsetTimeout(() => console.log(latestSaved), 250);`),
  intermediateReview(81, "Leaking mutable state", "A settings store exposes preferences to a UI. A caller must not be able to change the store without using its update function.", `const settings = { theme: "dark" };\n\nfunction getSettings() {\n  return settings;\n}\n\ngetSettings().theme = "light";\nconsole.log(settings.theme);`, "Returning the store object lets callers mutate it directly. Return a copy at the boundary.", `const settings = { theme: "dark" };\n\nfunction getSettings() {\n  return { ...settings };\n}\n\ngetSettings().theme = "light";\nconsole.log(settings.theme);`),
  intermediateReview(82, "NaN quantity", "A cart receives a quantity from a text field. Bad input must not turn the order total into `NaN`.", `function lineTotal(price, quantity) {\n  return price * Number(quantity);\n}\n\nconsole.log(lineTotal(10, "two"));`, "`Number` can produce `NaN`. Validate the converted value before calculating money.", `function lineTotal(price, quantity) {\n  const value = Number(quantity);\n  if (!Number.isFinite(value) || value < 0) return null;\n  return price * value;\n}\n\nconsole.log(lineTotal(10, "two"));`),
  intermediateReview(83, "Token expiry unit", "A session expires one hour after it is issued. JavaScript timestamps use milliseconds, not seconds.", `function expiresAt(now) {\n  return now + 60 * 60;\n}\n\nconsole.log(expiresAt(1_000_000));`, "The code adds one hour in seconds to a millisecond timestamp. Use milliseconds consistently.", `function expiresAt(now) {\n  return now + 60 * 60 * 1000;\n}\n\nconsole.log(expiresAt(1_000_000));`),
  intermediateReview(84, "Lost error context", "A payment screen reports an error to support. The original failure message should remain available.", `async function pay() {\n  try {\n    throw new Error("Card declined");\n  } catch {\n    throw new Error("Payment failed");\n  }\n}\n\npay().catch((error) => console.log(error.message));`, "Replacing the error hides the useful cause. Preserve it when adding user-facing context.", `async function pay() {\n  try {\n    throw new Error("Card declined");\n  } catch (error) {\n    throw new Error(\`Payment failed: \${error.message}\`);\n  }\n}\n\npay().catch((error) => console.log(error.message));`),
  intermediateReview(85, "Sparse item rows", "A report lists all orders, including orders without a buyer name. The generated rows must never contain `undefined` names.", `function buyerNames(orders) {\n  return orders.map((order) => order.buyer.name);\n}\n\nconsole.log(buyerNames([{ buyer: null }]));`, "The API can omit a buyer. Handle optional nested data before formatting a row.", `function buyerNames(orders) {\n  return orders.map((order) => order.buyer?.name ?? "Guest");\n}\n\nconsole.log(buyerNames([{ buyer: null }]));`),
  intermediateReview(86, "Shipping threshold", "An order earns free shipping at 50 or more. The threshold must be checked against the subtotal before shipping is added.", `function shipping(subtotal, shippingFee) {\n  return subtotal + shippingFee >= 50 ? 0 : shippingFee;\n}\n\nconsole.log(shipping(45, 10));`, "Adding shipping before testing makes an order qualify itself. Check the subtotal alone.", `function shipping(subtotal, shippingFee) {\n  return subtotal >= 50 ? 0 : shippingFee;\n}\n\nconsole.log(shipping(45, 10));`),
  intermediateReview(87, "Bad comma decimal", "An imported price can use a comma decimal separator. The parser must not silently turn `12,50` into `12`.", `function importedPrice(value) {\n  return parseFloat(value);\n}\n\nconsole.log(importedPrice("12,50"));`, "`parseFloat` stops at the comma and loses money. Normalize the known input format before conversion.", `function importedPrice(value) {\n  return Number(value.replace(",", "."));\n}\n\nconsole.log(importedPrice("12,50"));`),
  intermediateReview(88, "Timer after unmount", "A notification component schedules a message, then closes before the timer runs. Closing must cancel the pending work.", `let message = "";\n\nfunction showLater() {\n  setTimeout(() => { message = "Saved"; }, 100);\n}\n\nshowLater();\nmessage = "Closed";\nsetTimeout(() => console.log(message), 150);`, "The pending timer updates state after the screen is closed. Keep its ID and clear it during cleanup.", `let message = "";\n\nfunction showLater() {\n  return setTimeout(() => { message = "Saved"; }, 100);\n}\n\nconst timer = showLater();\nclearTimeout(timer);\nmessage = "Closed";\nsetTimeout(() => console.log(message), 150);`),
  intermediateReview(89, "Wrong splice result", "An admin removes a member from a copied list. The helper must return the remaining members, not the removed one.", `function removeMember(members, id) {\n  const copy = [...members];\n  return copy.splice(copy.findIndex((member) => member.id === id), 1);\n}\n\nconsole.log(removeMember([{ id: "a" }, { id: "b" }], "a"));`, "`splice` returns removed entries. Return the changed copy after splicing, or use `filter`.", `function removeMember(members, id) {\n  return members.filter((member) => member.id !== id);\n}\n\nconsole.log(removeMember([{ id: "a" }, { id: "b" }], "a"));`),
  intermediateReview(90, "Case-insensitive role", "A partner API sends role names in inconsistent casing. Access must be granted only after normalization.", `function isManager(role) {\n  return role === "manager";\n}\n\nconsole.log(isManager("Manager"));`, "The check depends on the partner's letter casing. Normalize input before comparing canonical roles.", `function isManager(role) {\n  return role?.toLowerCase() === "manager";\n}\n\nconsole.log(isManager("Manager"));`),
  intermediateReview(91, "Missing response header", "An API sends JSON to a browser client. The response must identify its format so the client handles it correctly.", `function response(body) {\n  return { status: 200, body: JSON.stringify(body) };\n}\n\nconsole.log(response({ ok: true }));`, "The body is JSON but its content type is absent. Include the protocol metadata with the response.", `function response(body) {\n  return {\n    status: 200,\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(body),\n  };\n}\n\nconsole.log(response({ ok: true }));`),
  intermediateReview(92, "Object key collision", "A report groups sales by customer ID. IDs such as `__proto__` must behave like ordinary external data.", `function salesByCustomer(sales) {\n  return sales.reduce((result, sale) => {\n    result[sale.customerId] = sale;\n    return result;\n  }, {});\n}\n\nconsole.log(salesByCustomer([{ customerId: "__proto__", total: 10 }]));`, "A plain object has inherited keys and special property names. Use a `Map` for external lookup keys.", `function salesByCustomer(sales) {\n  return sales.reduce((result, sale) => {\n    result.set(sale.customerId, sale);\n    return result;\n  }, new Map());\n}\n\nconsole.log(salesByCustomer([{ customerId: "__proto__", total: 10 }]));`),
  intermediateReview(93, "Rounded too early", "An invoice sums several line items. It should round once at the displayed total, not after every line.", `function invoiceTotal(prices) {\n  return prices.reduce((sum, price) => sum + Math.round(price * 100) / 100, 0);\n}\n\nconsole.log(invoiceTotal([0.105, 0.105]));`, "Rounding each line changes the final amount. Keep precision during calculation and round at the money boundary.", `function invoiceTotal(prices) {\n  const total = prices.reduce((sum, price) => sum + price, 0);\n  return Math.round(total * 100) / 100;\n}\n\nconsole.log(invoiceTotal([0.105, 0.105]));`),
  intermediateReview(94, "Incorrect pagination offset", "A product API returns page two with ten items per page. The offset must skip the first ten products.", `function pageOffset(page, size) {\n  return page * size;\n}\n\nconsole.log(pageOffset(2, 10));`, "Page numbering starts at one, so page two should start at offset ten. Subtract one before multiplying.", `function pageOffset(page, size) {\n  return (page - 1) * size;\n}\n\nconsole.log(pageOffset(2, 10));`),
  intermediateReview(95, "Forgotten async return", "A caller waits for a receipt after creating an order. The wrapper must return the promise so the caller can wait for completion.", `function createReceipt() {\n  Promise.resolve("receipt-1").then(console.log);\n}\n\nconsole.log(createReceipt());`, "The wrapper returns `undefined`, so callers cannot await it. Return the promise chain.", `function createReceipt() {\n  return Promise.resolve("receipt-1");\n}\n\ncreateReceipt().then(console.log);`),
  intermediateReview(96, "Unsafe redirect", "After sign-in, a user can return to a page inside this app. External URLs must not become redirect destinations.", `function nextPath(value) {\n  return value || "/dashboard";\n}\n\nconsole.log(nextPath("https://evil.example"));`, "Accepting any URL enables an open redirect. Allow only local paths.", `function nextPath(value) {\n  return value?.startsWith("/") ? value : "/dashboard";\n}\n\nconsole.log(nextPath("https://evil.example"));`),
  intermediateReview(97, "Incomplete update queue", "A sync queue removes an item only after it is successfully sent. A failed item must stay queued for retry.", `function sync(queue, send) {\n  const item = queue.shift();\n  return send(item);\n}\n\nconst queue = ["change-1"];\nsync(queue, () => Promise.reject(new Error("Offline"))).catch(() => console.log(queue));`, "The item is removed before the send succeeds. Remove it only after a successful result.", `function sync(queue, send) {\n  const item = queue[0];\n  return send(item).then(() => queue.shift());\n}\n\nconst queue = ["change-1"];\nsync(queue, () => Promise.reject(new Error("Offline"))).catch(() => console.log(queue));`),
  intermediateReview(98, "Ambiguous status", "An order API supports only known statuses. A typo must not silently become a valid-looking label.", `function statusLabel(status) {\n  return status[0].toUpperCase() + status.slice(1);\n}\n\nconsole.log(statusLabel("delievered"));`, "Formatting arbitrary input hides invalid states. Validate status values before displaying them.", `function statusLabel(status) {\n  const labels = { pending: "Pending", shipped: "Shipped", delivered: "Delivered" };\n  return labels[status] ?? "Unknown";\n}\n\nconsole.log(statusLabel("delievered"));`),
  intermediateReview(99, "Event listener cleanup", "A live price widget opens and closes repeatedly. Its listener must be removed when the widget closes.", `const listeners = [];\n\nfunction openWidget(listener) {\n  listeners.push(listener);\n}\n\nopenWidget(() => console.log("price"));\nopenWidget(() => console.log("price"));\nconsole.log(listeners.length);`, "Listeners accumulate with no cleanup. Return an unsubscribe function from registration.", `const listeners = [];\n\nfunction openWidget(listener) {\n  listeners.push(listener);\n  return () => {\n    const index = listeners.indexOf(listener);\n    if (index >= 0) listeners.splice(index, 1);\n  };\n}\n\nconst close = openWidget(() => console.log("price"));\nclose();\nconsole.log(listeners.length);`),
  intermediateReview(100, "Fallback hides outage", "A sales dashboard shows a cached total when the live request fails. The UI must still say that the number is stale.", `function salesResult(live, cached) {\n  return live ?? cached;\n}\n\nconsole.log(salesResult(null, 120));`, "The fallback returns a number with no freshness information. Return both the value and its source.", `function salesResult(live, cached) {\n  if (live != null) return { value: live, stale: false };\n  return { value: cached, stale: true };\n}\n\nconsole.log(salesResult(null, 120));`),
  intermediateReview(101, "Blank required fields", "A signup accepts a name from a form. Spaces alone must not pass validation.", `function canCreateAccount(name, email) {\n  return Boolean(name) && Boolean(email);\n}\n\nconsole.log(canCreateAccount("   ", "a@example.com"));`, "Whitespace is truthy but is not a name. Trim form text before validating it.", `function canCreateAccount(name, email) {\n  return name.trim().length > 0 && email.trim().length > 0;\n}\n\nconsole.log(canCreateAccount("   ", "a@example.com"));`),
  intermediateReview(102, "Accidental array mutation", "A recommendation service appends a sponsored result for display. The source recommendations are reused elsewhere unchanged.", `function withSponsored(items, sponsored) {\n  items.unshift(sponsored);\n  return items;\n}\n\nconst recommendations = ["Book"];\nconsole.log(withSponsored(recommendations, "Ad"));\nconsole.log(recommendations);`, "`unshift` mutates caller-owned data. Build a new display list instead.", `function withSponsored(items, sponsored) {\n  return [sponsored, ...items];\n}\n\nconst recommendations = ["Book"];\nconsole.log(withSponsored(recommendations, "Ad"));\nconsole.log(recommendations);`),
  intermediateReview(103, "Parallel dependency", "A checkout needs an exchange rate before converting a price. It cannot calculate with the pending rate request.", `function exchangeRate() {\n  return Promise.resolve(150);\n}\n\nasync function convert(usd) {\n  const rate = exchangeRate();\n  return usd * rate;\n}\n\nconvert(2).then(console.log);`, "The calculation uses a Promise instead of its resolved number. Await the dependency before calculating.", `function exchangeRate() {\n  return Promise.resolve(150);\n}\n\nasync function convert(usd) {\n  const rate = await exchangeRate();\n  return usd * rate;\n}\n\nconvert(2).then(console.log);`),
];

function advancedReview(id: number, title: string, prompt: string, code: string, issue: string, fixedCode: string): CodeReviewChallenge {
  return { id, level: "Advanced", title, summary: "", prompt, code, issues: [issue], fixedCode };
}

const EXPLICIT_ADVANCED_CHALLENGES: CodeReviewChallenge[] = [
  advancedReview(104, "Tenant query", "A multi-company API lists invoices. A signed-in user must never receive another company's invoice.", `function invoices(all, tenantId) {\n  return all.filter((invoice) => invoice.status === "open");\n}\n\nconsole.log(invoices([{ tenantId: "a", status: "open" }, { tenantId: "b", status: "open" }], "a"));`, "The query filters status but not tenant ownership. Scope data at the query boundary.", `function invoices(all, tenantId) {\n  return all.filter((invoice) =>\n    invoice.tenantId === tenantId && invoice.status === "open",\n  );\n}\n\nconsole.log(invoices([{ tenantId: "a", status: "open" }, { tenantId: "b", status: "open" }], "a"));`),
  advancedReview(105, "Idempotent webhook", "A payment provider may deliver the same successful-payment event more than once. A duplicate must not credit the account twice.", `let balance = 0;\n\nfunction paymentWebhook(event) {\n  balance += event.amount;\n}\n\npaymentWebhook({ id: "evt_1", amount: 20 });\npaymentWebhook({ id: "evt_1", amount: 20 });\nconsole.log(balance);`, "Webhook delivery is at least once, so duplicate events are normal. Store processed event IDs before applying the side effect.", `let balance = 0;\nconst processed = new Set();\n\nfunction paymentWebhook(event) {\n  if (processed.has(event.id)) return;\n  processed.add(event.id);\n  balance += event.amount;\n}\n\npaymentWebhook({ id: "evt_1", amount: 20 });\npaymentWebhook({ id: "evt_1", amount: 20 });\nconsole.log(balance);`),
  advancedReview(106, "Authorization before update", "An API updates a document by ID. Only its owner may change it.", `function updateDocument(documents, id, body) {\n  const document = documents.find((item) => item.id === id);\n  document.body = body;\n  return document;\n}\n\nconsole.log(updateDocument([{ id: "d1", ownerId: "maya", body: "old" }], "d1", "new"));`, "The endpoint changes a record without checking ownership. Find it using both the record ID and authenticated user ID.", `function updateDocument(documents, id, userId, body) {\n  const document = documents.find((item) =>\n    item.id === id && item.ownerId === userId,\n  );\n  if (!document) throw new Error("Not found");\n  return { ...document, body };\n}\n\nconsole.log(updateDocument([{ id: "d1", ownerId: "maya", body: "old" }], "d1", "maya", "new"));`),
  advancedReview(107, "Atomic seat booking", "Two customers try to book the final seat at the same time. Only one booking may succeed.", `let seats = 1;\n\nasync function bookSeat() {\n  if (seats > 0) {\n    await Promise.resolve();\n    seats -= 1;\n    return "Booked";\n  }\n  return "Sold out";\n}\n\nPromise.all([bookSeat(), bookSeat()]).then(console.log);`, "Both calls inspect the old seat count before either decrements it. This decision must be atomic in the database or protected by a lock.", `let seats = 1;\nlet booking = false;\n\nasync function bookSeat() {\n  if (booking || seats === 0) return "Sold out";\n  booking = true;\n  try {\n    seats -= 1;\n    return "Booked";\n  } finally {\n    booking = false;\n  }\n}\n\nPromise.all([bookSeat(), bookSeat()]).then(console.log);`),
  advancedReview(108, "Password reset expiry", "A reset link has an expiry timestamp. An expired token must not be accepted.", `function canReset(token) {\n  return Boolean(token);\n}\n\nconsole.log(canReset({ value: "abc", expiresAt: 0 }));`, "Presence is not validity. Compare the token expiry with the current time.", `function canReset(token, now) {\n  return Boolean(token?.value) && token.expiresAt > now;\n}\n\nconsole.log(canReset({ value: "abc", expiresAt: 0 }, Date.now()));`),
  advancedReview(109, "Rate limit identity", "A login endpoint limits attempts. The limit must apply to the caller, not every user globally.", `let attempts = 0;\n\nfunction canAttemptLogin() {\n  attempts += 1;\n  return attempts <= 5;\n}\n\nconsole.log(canAttemptLogin(), canAttemptLogin());`, "One global counter lets one user block everyone. Key rate-limit state by a trusted caller identity.", `const attempts = new Map();\n\nfunction canAttemptLogin(ip) {\n  const next = (attempts.get(ip) ?? 0) + 1;\n  attempts.set(ip, next);\n  return next <= 5;\n}\n\nconsole.log(canAttemptLogin("203.0.113.1"), canAttemptLogin("203.0.113.2"));`),
  advancedReview(110, "SQL parameter boundary", "A search endpoint receives a customer-entered name. Input must remain data, not SQL syntax.", `function userQuery(name) {\n  return \`SELECT * FROM users WHERE name = '\${name}'\`;\n}\n\nconsole.log(userQuery("' OR 1=1 --"));`, "String-built SQL lets input change query meaning. Use parameter placeholders and values.", `function userQuery(name) {\n  return {\n    text: "SELECT * FROM users WHERE name = $1",\n    values: [name],\n  };\n}\n\nconsole.log(userQuery("' OR 1=1 --"));`),
  advancedReview(111, "Unbounded upload", "A document service accepts an uploaded file. It must reject files that exceed the product limit before storing them.", `function acceptUpload(file) {\n  return { saved: true, name: file.name };\n}\n\nconsole.log(acceptUpload({ name: "video.mov", size: 5_000_000_000 }));`, "The code accepts any size. Validate size and content type at the server boundary.", `function acceptUpload(file) {\n  const maximumBytes = 10 * 1024 * 1024;\n  if (file.size > maximumBytes) throw new Error("File is too large");\n  return { saved: true, name: file.name };\n}\n\ntry {\n  console.log(acceptUpload({ name: "video.mov", size: 5_000_000_000 }));\n} catch (error) {\n  console.log(error.message);\n}`),
  advancedReview(112, "Secret in error", "A failed API request is logged for debugging. Credentials must never reach logs.", `function logRequestError(request, error) {\n  console.error({ request, error: error.message });\n}\n\nlogRequestError({ authorization: "Bearer secret", email: "a@example.com" }, new Error("Failed"));`, "Logging the full request exposes an access token. Log only fields needed to diagnose the failure.", `function logRequestError(request, error) {\n  console.error({ email: request.email, error: error.message });\n}\n\nlogRequestError({ authorization: "Bearer secret", email: "a@example.com" }, new Error("Failed"));`),
  advancedReview(113, "Cache invalidation", "A product price is updated. The next public read must not return the old cached product.", `const cache = new Map([["p1", { id: "p1", price: 10 }]]);\n\nfunction updatePrice(product, price) {\n  return { ...product, price };\n}\n\nconsole.log(cache.get("p1"));`, "The write path leaves the old cache entry intact. Invalidate or update it with the successful write.", `const cache = new Map([["p1", { id: "p1", price: 10 }]]);\n\nfunction updatePrice(product, price) {\n  const updated = { ...product, price };\n  cache.set(updated.id, updated);\n  return updated;\n}\n\nupdatePrice({ id: "p1", price: 10 }, 12);\nconsole.log(cache.get("p1"));`),
  advancedReview(114, "Cursor order", "A feed uses a cursor. Records with the same timestamp must still have a stable order.", `function comparePosts(a, b) {\n  return b.createdAt - a.createdAt;\n}\n\nconsole.log(comparePosts({ createdAt: 10, id: "a" }, { createdAt: 10, id: "b" }));`, "Equal timestamps have no tie-breaker, so pages can skip or repeat records. Sort by a unique secondary key.", `function comparePosts(a, b) {\n  if (a.createdAt !== b.createdAt) return b.createdAt - a.createdAt;\n  return b.id.localeCompare(a.id);\n}\n\nconsole.log(comparePosts({ createdAt: 10, id: "a" }, { createdAt: 10, id: "b" }));`),
  advancedReview(115, "Server-side price", "A checkout receives price data from the browser. The server must calculate the charge from trusted catalogue data.", `function chargeOrder(clientPrice, quantity) {\n  return clientPrice * quantity;\n}\n\nconsole.log(chargeOrder(0.01, 2));`, "Browser prices can be changed by anyone. Look up the product price on the server using a product ID.", `function chargeOrder(productId, quantity, catalogue) {\n  const product = catalogue.get(productId);\n  if (!product) throw new Error("Unknown product");\n  return product.price * quantity;\n}\n\nconsole.log(chargeOrder("p1", 2, new Map([["p1", { price: 20 }]])));`),
  advancedReview(116, "Reused nonce", "A payment request has an idempotency key. Each new payment attempt needs a unique key.", `function paymentKey(customerId) {\n  return customerId;\n}\n\nconsole.log(paymentKey("u1"), paymentKey("u1"));`, "Reusing a predictable key can merge separate purchases. Generate a new opaque key per intended operation.", `function paymentKey() {\n  return crypto.randomUUID();\n}\n\nconsole.log(paymentKey() !== paymentKey());`),
  advancedReview(117, "Trusted proxy header", "An API sees `X-Forwarded-For`. It may use that header only when the request came through a trusted proxy.", `function clientIp(request) {\n  return request.headers["x-forwarded-for"] || request.ip;\n}\n\nconsole.log(clientIp({ ip: "10.0.0.1", headers: { "x-forwarded-for": "1.2.3.4" } }));`, "Any client can forge this header when directly connected. Trust it only behind known proxy infrastructure.", `function clientIp(request) {\n  if (request.fromTrustedProxy) return request.headers["x-forwarded-for"] ?? request.ip;\n  return request.ip;\n}\n\nconsole.log(clientIp({ ip: "10.0.0.1", fromTrustedProxy: false, headers: { "x-forwarded-for": "1.2.3.4" } }));`),
  advancedReview(118, "Failed job retry", "A worker retries a failed email job. It must stop after a bounded number of attempts.", `function shouldRetry(job) {\n  return true;\n}\n\nconsole.log(shouldRetry({ attempts: 99 }));`, "An unlimited retry can overload a failing dependency forever. Bound attempts and move exhausted jobs aside.", `function shouldRetry(job) {\n  return job.attempts < 5;\n}\n\nconsole.log(shouldRetry({ attempts: 99 }));`),
  advancedReview(119, "SSRF target", "A preview service fetches a URL supplied by a user. It must not fetch internal network addresses.", `function canPreview(url) {\n  return url.startsWith("http");\n}\n\nconsole.log(canPreview("http://127.0.0.1:3000/admin"));`, "Checking a string prefix permits internal URLs. Parse and allow only approved public hosts or enforce network egress rules.", `function canPreview(url) {\n  const value = new URL(url);\n  return value.protocol === "https:" && value.hostname.endsWith("example.com");\n}\n\nconsole.log(canPreview("http://127.0.0.1:3000/admin"));`),
  advancedReview(120, "Sensitive cache control", "An account page includes private data. Shared browsers and proxies must not cache the response.", `function accountResponse(body) {\n  return { headers: { "Cache-Control": "public, max-age=3600" }, body };\n}\n\nconsole.log(accountResponse({ email: "a@example.com" }));`, "A public cache can serve one person's account data to another. Mark private responses as non-store.", `function accountResponse(body) {\n  return { headers: { "Cache-Control": "no-store" }, body };\n}\n\nconsole.log(accountResponse({ email: "a@example.com" }));`),
  advancedReview(121, "Prototype input", "A preferences endpoint merges a JSON object from a client. Special keys must not alter object prototypes.", `function mergePreferences(current, input) {\n  return { ...current, ...input };\n}\n\nconsole.log(mergePreferences({ theme: "light" }, JSON.parse('{"__proto__":{"admin":true}}')));`, "Blindly merging arbitrary keys can create prototype-related surprises. Allow-list the fields the endpoint accepts.", `function mergePreferences(current, input) {\n  return {\n    ...current,\n    ...(typeof input.theme === "string" ? { theme: input.theme } : {}),\n  };\n}\n\nconsole.log(mergePreferences({ theme: "light" }, JSON.parse('{"__proto__":{"admin":true}}')));`),
  advancedReview(122, "Email enumeration", "A password-reset endpoint should not reveal whether an email is registered.", `function resetMessage(found) {\n  return found ? "Reset email sent" : "No account exists";\n}\n\nconsole.log(resetMessage(false));`, "Different messages let attackers discover accounts. Return the same safe message either way.", `function resetMessage() {\n  return "If an account exists, a reset email has been sent";\n}\n\nconsole.log(resetMessage());`),
  advancedReview(123, "Concurrent balance", "A wallet withdraws money asynchronously. Two withdrawals must not both spend the same balance.", `let balance = 100;\n\nasync function withdraw(amount) {\n  if (balance >= amount) {\n    await Promise.resolve();\n    balance -= amount;\n    return true;\n  }\n  return false;\n}\n\nPromise.all([withdraw(80), withdraw(80)]).then(() => console.log(balance));`, "The check and deduction are separate, allowing an overdraft. Use an atomic conditional update in persistent storage.", `let balance = 100;\nlet locked = false;\n\nasync function withdraw(amount) {\n  if (locked || balance < amount) return false;\n  locked = true;\n  try {\n    balance -= amount;\n    return true;\n  } finally {\n    locked = false;\n  }\n}\n\nPromise.all([withdraw(80), withdraw(80)]).then(() => console.log(balance));`),
  advancedReview(124, "Unsafe regex", "A search filter creates a regular expression from user text. It must not let special characters become expensive regex syntax.", `function matches(name, query) {\n  return new RegExp(query).test(name);\n}\n\nconsole.log(matches("aaaa", "(a+)+$"));`, "User input becomes executable regex syntax, risking catastrophic backtracking. Escape it before constructing a regex.", `function escapeRegExp(value) {\n  return value.replace(/[.*+?^\${}()|[\\]\\\\]/g, "\\\\$&");\n}\n\nfunction matches(name, query) {\n  return new RegExp(escapeRegExp(query), "i").test(name);\n}\n\nconsole.log(matches("aaaa", "(a+)+$"));`),
  advancedReview(125, "Audit log ordering", "An audit log should record a deletion only after the deletion succeeds.", `async function deleteUser(remove, audit) {\n  audit("user_deleted");\n  await remove();\n}\n\ndeleteUser(() => Promise.reject(new Error("DB down")), console.log).catch(() => {});`, "The audit entry claims a deletion that never happened. Perform the state change first, then log success.", `async function deleteUser(remove, audit) {\n  await remove();\n  audit("user_deleted");\n}\n\ndeleteUser(() => Promise.resolve(), console.log);`),
  advancedReview(126, "Unsafe file path", "An export endpoint receives a filename. It must not let `../` leave the export directory.", `function exportPath(name) {\n  return \`/exports/\${name}\`;\n}\n\nconsole.log(exportPath("../../etc/passwd"));`, "Concatenating a path allows traversal. Accept a generated ID or a strict filename allow-list.", `function exportPath(name) {\n  if (!/^[a-z0-9-]+\\.csv$/i.test(name)) throw new Error("Invalid filename");\n  return \`/exports/\${name}\`;\n}\n\ntry {\n  console.log(exportPath("../../etc/passwd"));\n} catch (error) {\n  console.log(error.message);\n}`),
  advancedReview(127, "Role change allow-list", "An account update endpoint receives fields from a profile form. A regular user must not promote themselves by sending an extra field.", `function updateProfile(user, input) {\n  return { ...user, ...input };\n}\n\nconsole.log(updateProfile({ name: "Maya", role: "member" }, { role: "admin" }));`, "Mass assignment accepts fields the form should not control. Copy only editable fields.", `function updateProfile(user, input) {\n  return { ...user, ...(typeof input.name === "string" ? { name: input.name } : {}) };\n}\n\nconsole.log(updateProfile({ name: "Maya", role: "member" }, { role: "admin" }));`),
  advancedReview(128, "Connection cleanup", "A database helper must release a connection when a query fails as well as when it succeeds.", `async function withConnection(pool) {\n  const connection = await pool.get();\n  const result = await connection.query();\n  connection.release();\n  return result;\n}\n\nconsole.log("A failed query leaks the connection");`, "A throw skips `release`, eventually exhausting the pool. Release in `finally`.", `async function withConnection(pool) {\n  const connection = await pool.get();\n  try {\n    return await connection.query();\n  } finally {\n    connection.release();\n  }\n}\n\nconsole.log("The connection is always released");`),
  advancedReview(129, "WebSocket authorization", "A live order channel receives a tenant ID from the browser. Subscription access must be checked server-side.", `function subscribe(socket, tenantId) {\n  socket.rooms.add(tenantId);\n}\n\nconsole.log("Any tenant ID can be joined");`, "The browser chooses the room with no ownership check. Compare it with the authenticated socket identity.", `function subscribe(socket, tenantId) {\n  if (socket.tenantId !== tenantId) throw new Error("Forbidden");\n  socket.rooms.add(tenantId);\n}\n\nconsole.log("Only the authenticated tenant can join");`),
  advancedReview(130, "Exposed source map", "A production error response should not return internal stack traces to a browser.", `function errorResponse(error) {\n  return { status: 500, body: error.stack };\n}\n\nconsole.log(errorResponse(new Error("Database password missing")));`, "Stack traces expose implementation details and sometimes secrets. Log them privately and return a generic message.", `function errorResponse(error) {\n  console.error(error);\n  return { status: 500, body: "Something went wrong" };\n}\n\nconsole.log(errorResponse(new Error("Database password missing")));`),
  advancedReview(131, "Date range authorization", "An export allows a date range. Very large ranges can overload the database and expose too much history.", `function canExport(from, to) {\n  return new Date(to) >= new Date(from);\n}\n\nconsole.log(canExport("2000-01-01", "2026-01-01"));`, "A valid order is not enough. Enforce a maximum span that matches the product and operational budget.", `function canExport(from, to) {\n  const days = (new Date(to) - new Date(from)) / 86_400_000;\n  return days >= 0 && days <= 31;\n}\n\nconsole.log(canExport("2000-01-01", "2026-01-01"));`),
  advancedReview(132, "Stale permission cache", "A user loses an admin role. Cached permissions must not keep granting access after revocation.", `const permissions = new Map([["u1", ["admin"]]]);\n\nfunction revokeAdmin(userId) {\n  return "updated database";\n}\n\nrevokeAdmin("u1");\nconsole.log(permissions.get("u1"));`, "The database changed but the authorization cache did not. Invalidate or refresh permissions after role changes.", `const permissions = new Map([["u1", ["admin"]]]);\n\nfunction revokeAdmin(userId) {\n  permissions.delete(userId);\n  return "updated database";\n}\n\nrevokeAdmin("u1");\nconsole.log(permissions.get("u1"));`),
  advancedReview(133, "User-controlled redirect host", "An email link builder includes a return URL. The host must remain the application's host.", `function confirmationLink(returnTo) {\n  return \`https://app.example/confirm?next=\${returnTo}\`;\n}\n\nconsole.log(confirmationLink("https://evil.example"));`, "The unencoded external URL becomes a redirect target later. Store only validated local paths.", `function confirmationLink(returnTo) {\n  const next = returnTo?.startsWith("/") ? returnTo : "/";\n  return \`https://app.example/confirm?next=\${encodeURIComponent(next)}\`;\n}\n\nconsole.log(confirmationLink("https://evil.example"));`),
  advancedReview(134, "Batch failure visibility", "A batch import processes many rows. One bad row should be reported without pretending the entire batch succeeded.", `async function importRows(rows, save) {\n  await Promise.all(rows.map(save));\n  return { ok: true };\n}\n\nconsole.log("One rejection hides which row failed");`, "A single rejection stops the batch without a useful report. Capture per-row outcomes and surface failures.", `async function importRows(rows, save) {\n  const results = await Promise.allSettled(rows.map(save));\n  return {\n    ok: results.every((result) => result.status === "fulfilled"),\n    failed: results.filter((result) => result.status === "rejected").length,\n  };\n}\n\nconsole.log("The caller receives an honest summary");`),
  advancedReview(135, "Versioned update", "Two editors save the same document. The later save must not silently overwrite a newer version.", `function saveDocument(document, incoming) {\n  return { ...document, body: incoming.body };\n}\n\nconsole.log(saveDocument({ body: "newer", version: 2 }, { body: "older", version: 1 }));`, "The write ignores version conflict. Compare an expected version before accepting the update.", `function saveDocument(document, incoming) {\n  if (incoming.version !== document.version) throw new Error("Document changed");\n  return { ...document, body: incoming.body, version: document.version + 1 };\n}\n\ntry {\n  console.log(saveDocument({ body: "newer", version: 2 }, { body: "older", version: 1 }));\n} catch (error) {\n  console.log(error.message);\n}`),
  advancedReview(136, "Predictable invite token", "An invitation link grants account access. Its token must not be guessable from the recipient ID.", `function inviteToken(userId) {\n  return \`invite-\${userId}\`;\n}\n\nconsole.log(inviteToken(42));`, "Sequential or derived tokens are easy to guess. Generate a cryptographically random token and store a hash.", `function inviteToken() {\n  return crypto.randomUUID();\n}\n\nconsole.log(inviteToken());`),
  advancedReview(137, "Unlimited page size", "A list endpoint accepts a requested page size. The server must cap it to protect memory and response time.", `function pageSize(requested) {\n  return Number(requested) || 20;\n}\n\nconsole.log(pageSize("1000000"));`, "A caller can request an enormous response. Clamp valid numeric input to a server-owned maximum.", `function pageSize(requested) {\n  const value = Number(requested);\n  if (!Number.isInteger(value) || value < 1) return 20;\n  return Math.min(value, 100);\n}\n\nconsole.log(pageSize("1000000"));`),
  advancedReview(138, "CORS credentials", "A private API accepts browser credentials. It must not allow every website to make credentialed requests.", `function corsHeaders(origin) {\n  return {\n    "Access-Control-Allow-Origin": "*",\n    "Access-Control-Allow-Credentials": "true",\n  };\n}\n\nconsole.log(corsHeaders("https://evil.example"));`, "Wildcard origins cannot safely pair with credentials. Allow known origins explicitly.", `function corsHeaders(origin) {\n  const allowed = new Set(["https://app.example"]);\n  if (!allowed.has(origin)) return {};\n  return {\n    "Access-Control-Allow-Origin": origin,\n    "Access-Control-Allow-Credentials": "true",\n  };\n}\n\nconsole.log(corsHeaders("https://evil.example"));`),
  advancedReview(139, "PII analytics", "A product event records a checkout action. Analytics does not need the customer's email or address.", `function checkoutEvent(order) {\n  return { event: "checkout", ...order };\n}\n\nconsole.log(checkoutEvent({ id: "o1", email: "a@example.com", address: "Tokyo" }));`, "Spreading the whole order exports personal data. Build a minimal analytics event.", `function checkoutEvent(order) {\n  return { event: "checkout", orderId: order.id };\n}\n\nconsole.log(checkoutEvent({ id: "o1", email: "a@example.com", address: "Tokyo" }));`),
  advancedReview(140, "Broken circuit breaker", "A downstream service is failing. The app should stop calling it briefly instead of adding more load.", `let failures = 0;\n\nasync function callService(request) {\n  try {\n    return await request();\n  } catch (error) {\n    failures += 1;\n    throw error;\n  }\n}\n\nconsole.log("Calls continue forever after failures");`, "The failure count is recorded but never changes behavior. Open the circuit after a threshold and fail fast.", `let failures = 0;\n\nasync function callService(request) {\n  if (failures >= 3) throw new Error("Service temporarily unavailable");\n  try {\n    const result = await request();\n    failures = 0;\n    return result;\n  } catch (error) {\n    failures += 1;\n    throw error;\n  }\n}\n\nconsole.log("The fourth call fails fast");`),
  advancedReview(141, "Missing transaction", "An order creation writes an order and reduces stock. Both changes must succeed together.", `function createOrder(inventory, orders, productId) {\n  inventory[productId] -= 1;\n  throw new Error("Order insert failed");\n}\n\nconsole.log("Stock changed without an order");`, "Two related writes can leave inconsistent state. Use one database transaction so failure rolls both back.", `async function createOrder(database, productId) {\n  return database.transaction(async (transaction) => {\n    await transaction.decrementStock(productId);\n    return transaction.insertOrder(productId);\n  });\n}\n\nconsole.log("Both writes belong in one transaction");`),
  advancedReview(142, "Deleted resource cache", "A user deletes a profile photo. Cached image metadata must not keep exposing the deleted resource.", `const photoCache = new Map([["photo-1", { ownerId: "u1" }]]);\n\nfunction deletePhoto(id) {\n  return "deleted";\n}\n\ndeletePhoto("photo-1");\nconsole.log(photoCache.get("photo-1"));`, "The delete path leaves cached metadata behind. Remove or invalidate cache entries after deletion.", `const photoCache = new Map([["photo-1", { ownerId: "u1" }]]);\n\nfunction deletePhoto(id) {\n  photoCache.delete(id);\n  return "deleted";\n}\n\ndeletePhoto("photo-1");\nconsole.log(photoCache.get("photo-1"));`),
  advancedReview(143, "Recursive payload", "An API accepts nested categories. Excessive nesting must not overflow recursive processing.", `function countNodes(node) {\n  return 1 + node.children.reduce((sum, child) => sum + countNodes(child), 0);\n}\n\nconsole.log("Deep untrusted trees can exhaust the stack");`, "Unbounded recursion over untrusted input can crash the process. Validate nesting depth or use iterative traversal.", `function countNodes(root) {\n  let count = 0;\n  const stack = [root];\n  while (stack.length) {\n    const node = stack.pop();\n    count += 1;\n    stack.push(...(node.children ?? []));\n  }\n  return count;\n}\n\nconsole.log(countNodes({ children: [] }));`),
  advancedReview(144, "Cache key privacy", "A server-side cache stores personalized dashboard HTML. Different users must never share a cache entry.", `const pages = new Map();\n\nfunction dashboardKey(locale) {\n  return locale;\n}\n\npages.set(dashboardKey("en"), "Maya's dashboard");\nconsole.log(pages.get(dashboardKey("en")));`, "The key omits user identity, so one user's page can be served to another. Include identity or do not cache personalized output.", `const pages = new Map();\n\nfunction dashboardKey(userId, locale) {\n  return \`\${userId}:\${locale}\`;\n}\n\npages.set(dashboardKey("maya", "en"), "Maya's dashboard");\nconsole.log(pages.get(dashboardKey("ravi", "en")));`),
  advancedReview(145, "Webhook signature", "A billing webhook receives JSON and an HTTP header. It must verify the provider signature before trusting the event.", `function handleWebhook(body) {\n  const event = JSON.parse(body);\n  return event.type;\n}\n\nconsole.log(handleWebhook('{"type":"payment.succeeded"}'));`, "Anyone can POST JSON to a public endpoint. Verify the signature against the raw body first.", `function handleWebhook(body, signature, verify) {\n  if (!verify(body, signature)) throw new Error("Invalid signature");\n  return JSON.parse(body).type;\n}\n\nconsole.log(handleWebhook('{"type":"payment.succeeded"}', "valid", () => true));`),
  advancedReview(146, "Privilege cache key", "A permission cache stores decisions for a user and an action. Each action needs a separate cached decision.", `const decisions = new Map();\n\nfunction decisionKey(userId) {\n  return userId;\n}\n\ndecisions.set(decisionKey("u1"), true);\nconsole.log(decisions.get(decisionKey("u1")));`, "A positive decision for one action can leak into another. Include the action and resource scope in the key.", `const decisions = new Map();\n\nfunction decisionKey(userId, action, resourceId) {\n  return \`\${userId}:\${action}:\${resourceId}\`;\n}\n\ndecisions.set(decisionKey("u1", "read", "d1"), true);\nconsole.log(decisions.get(decisionKey("u1", "delete", "d1")));`),
  advancedReview(147, "PII export authorization", "A CSV export includes customer emails. Only a user with export permission may trigger it.", `function exportCustomers(user, customers) {\n  return customers.map((customer) => customer.email).join("\\n");\n}\n\nconsole.log(exportCustomers({ role: "member" }, [{ email: "a@example.com" }]));`, "The export ignores authorization. Check the specific permission before generating sensitive output.", `function exportCustomers(user, customers) {\n  if (!user.permissions.includes("customers:export")) throw new Error("Forbidden");\n  return customers.map((customer) => customer.email).join("\\n");\n}\n\ntry {\n  console.log(exportCustomers({ permissions: [] }, [{ email: "a@example.com" }]));\n} catch (error) {\n  console.log(error.message);\n}`),
  advancedReview(148, "Expired signed URL", "A file download link is signed and expires. Its verifier must reject links after the expiry time.", `function validDownload(signature) {\n  return signature === "valid";\n}\n\nconsole.log(validDownload("valid"));`, "A signature alone can remain usable forever. Validate both signature and an expiry timestamp.", `function validDownload(signature, expiresAt, now) {\n  return signature === "valid" && expiresAt > now;\n}\n\nconsole.log(validDownload("valid", 0, Date.now()));`),
  advancedReview(149, "Background job tenant", "A queued report job runs later without the original request. It must carry and enforce its tenant context.", `function runReport(job, allOrders) {\n  return allOrders;\n}\n\nconsole.log(runReport({ tenantId: "a" }, [{ tenantId: "a" }, { tenantId: "b" }]));`, "The worker ignores tenant scope and returns every order. Apply the job's tenant context inside the worker query.", `function runReport(job, allOrders) {\n  return allOrders.filter((order) => order.tenantId === job.tenantId);\n}\n\nconsole.log(runReport({ tenantId: "a" }, [{ tenantId: "a" }, { tenantId: "b" }]));`),
  advancedReview(150, "Destructive default", "A bulk delete endpoint receives an optional filter. A missing filter must not mean delete everything.", `function deleteWhere(records, filter) {\n  return records.filter((record) => record.status !== filter?.status);\n}\n\nconsole.log(deleteWhere([{ status: "active" }], undefined));`, "An omitted filter has unclear destructive behavior. Require an explicit, validated filter before deletion.", `function deleteWhere(records, filter) {\n  if (!filter?.status) throw new Error("Deletion filter is required");\n  return records.filter((record) => record.status !== filter.status);\n}\n\ntry {\n  console.log(deleteWhere([{ status: "active" }], undefined));\n} catch (error) {\n  console.log(error.message);\n}`),
];

const generatedChallenges = [
  ...EXPLICIT_INTERMEDIATE_CHALLENGES,
  ...EXPLICIT_ADVANCED_CHALLENGES,
];

export const CODE_REVIEW_CHALLENGES: CodeReviewChallenge[] = [
  ...INITIAL_CODE_REVIEW_CHALLENGES,
  ...EXPLICIT_BASIC_CHALLENGES,
  ...EXPLICIT_BASIC_CHALLENGES_PHASE_TWO,
  ...EXPLICIT_BASIC_CHALLENGES_PHASE_THREE,
  ...EXPLICIT_BASIC_CHALLENGES_PHASE_FOUR,
  ...generatedChallenges,
];

export const CODE_REVIEW_LEVELS: ChallengeLevel[] = ["Basic", "Intermediate", "Advanced"];
