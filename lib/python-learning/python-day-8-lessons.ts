import type { LessonDay } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });

export const PYTHON_DAY_8_LESSONS: LessonDay = {
  day: 8, label: same("Phase 1 · Core Python"), title: same("Dictionaries"), totalMinutes: 85, difficulty: same("Beginner"),
  overview: same("Model named facts with keys and values, safely handle missing data, and use standard-library tools for grouped data."),
  lessons: [
    {
      id: "python-dictionary-basics", title: same("Keys connect names to values"), durationMinutes: 19,
      explanation: same("A <b>dictionary</b> maps a unique, hashable key to a value. It is the natural shape for a shipment with named fields such as ID, customer, status, and weight. Modern Python preserves insertion order, but its main strength is lookup by meaningful key instead of numeric position.\n\nUse `record[\"status\"]` when a missing status is a programming error that should be noticed. Use `record.get(\"status\")` or a default when missing data is expected. A dictionary can contain nested dictionaries and lists, which mirrors JSON from APIs, but deeply nested structures become difficult to validate and update without clear boundaries."),
      diagram: "shipment\n  ├─ \"id\"       → \"PKG-42\"\n  ├─ \"status\"   → \"packed\"\n  └─ \"customer\" → {\"name\": \"Mina\"}",
      codeExample: { title: same("Model one shipment"), code: "shipment = {\n    \"id\": \"PKG-42\",\n    \"status\": \"packed\",\n    \"customer\": {\"name\": \"Mina\", \"city\": \"Tokyo\"},\n}\n\nprint(shipment[\"status\"])\nprint(shipment.get(\"weight_kg\", 0))" },
      keyTakeaways: [same("Dictionary keys are unique and meaningful."), same("Use bracket lookup when a key must exist."), same("Use `get()` for expected optional values."), same("Nested dictionaries can model related data.")],
      commonMistakes: [same("Using an unhashable list as a dictionary key."), same("Accessing an optional key with brackets and getting `KeyError`."), same("Letting deeply nested data spread through unrelated parts of an app.")],
      quiz: [{ question: same("Which access is safest for an optional delivery note?"), options: [same("`shipment.get(\"note\")`"), same("`shipment[\"note\"]` always"), same("`shipment.note`"), same("`set(shipment)`")], correctIndex: 0, explanation: same("`get()` returns `None` or a supplied default when the key is missing.") }],
    },
    {
      id: "python-dictionary-methods", title: same("Update, inspect, and unpack mappings"), durationMinutes: 20,
      explanation: same("`keys()`, `values()`, and `items()` provide views of a dictionary's contents. Loop over `items()` when you need each key and value. `update()` merges new values into a dictionary, and `{**base, **changes}` builds a new merged mapping. Dictionary unpacking is useful for an immutable-style update of a small record.\n\nBe explicit about collision rules. When two mappings provide the same key, the later one wins. That is useful for a shipment status change, but dangerous if untrusted client input can overwrite server-controlled fields such as price or permission. Whitelist the keys an external request is allowed to change."),
      diagram: "base = {\"status\": \"packed\", \"priority\": \"normal\"}\nchanges = {\"status\": \"shipped\"}\n\n{**base, **changes} → status is shipped",
      codeExample: { title: same("Create a revised shipment record"), code: "shipment = {\"id\": \"PKG-42\", \"status\": \"packed\"}\nupdate = {\"status\": \"shipped\"}\nrevised = {**shipment, **update}\n\nfor key, value in revised.items():\n    print(f\"{key}: {value}\")" },
      keyTakeaways: [same("`items()` gives key-value pairs."), same("`update()` mutates the original mapping."), same("`{**a, **b}` returns a new merged mapping."), same("Later duplicate keys win during a merge.")],
      commonMistakes: [same("Assuming `update()` returns the updated dictionary. It returns `None`."), same("Blindly merging client data into a protected server record."), same("Changing a dictionary while iterating directly over its live keys view.")],
      quiz: [{ question: same("What happens if both unpacked dictionaries have `\"status\"`?"), options: [same("The later dictionary's value wins"), same("Python raises `KeyError`"), same("Both values are kept"), same("The first value wins")], correctIndex: 0, explanation: same("Dictionary construction processes the later key assignment last.") }],
    },
    {
      id: "python-defaultdict-counter", title: same("Group and count with defaultdict and Counter"), durationMinutes: 22,
      explanation: same("`collections.defaultdict` creates a default value for a missing key, which makes grouping easier. `defaultdict(list)` can group package IDs by city without checking whether each city has a list already. `collections.Counter` counts repeated hashable values, making it useful for status summaries or most-common error codes.\n\nThese are tools for practical data modeling, not substitutes for a database schema. Choose data shapes that make invalid states hard to represent. A shipment record should have stable named fields; a `Counter` is a derived report, not the source of truth for an order's lifecycle."),
      diagram: "events: [\"packed\", \"shipped\", \"packed\"]\n                 │ Counter\n                 ▼\n{\"packed\": 2, \"shipped\": 1}",
      codeExample: { title: same("Group and count shipment events"), code: "from collections import Counter, defaultdict\n\npackages_by_city = defaultdict(list)\npackages_by_city[\"Tokyo\"].append(\"PKG-1\")\npackages_by_city[\"Osaka\"].append(\"PKG-2\")\n\nstatus_counts = Counter([\"packed\", \"shipped\", \"packed\"])\nprint(status_counts[\"packed\"])" },
      keyTakeaways: [same("`defaultdict(list)` simplifies grouping."), same("`Counter` counts repeated values."), same("Keep source records separate from derived summaries."), same("A nested dictionary should follow an intentional shape.")],
      commonMistakes: [same("Using `defaultdict` when an absent key should be an error."), same("Treating a `Counter` as a validation system for lifecycle transitions."), same("Mixing unrelated fields into one unstructured mapping.")],
      quiz: [{ question: same("Which tool groups package IDs by city without an initial-key check?"), options: [same("`defaultdict(list)`"), same("`Counter`"), same("`frozenset`"), same("A tuple")], correctIndex: 0, explanation: same("The list factory creates the missing city's collection when first accessed.") }],
    },
  ],
  finalQuiz: [
    { question: same("What should a dictionary key be?"), options: [same("Unique and hashable"), same("Always a list"), same("Always numeric"), same("Mutable only")], correctIndex: 0, explanation: same("Keys need stable hashing and uniquely identify a mapping entry.") },
    { question: same("When is bracket lookup appropriate?"), options: [same("When a missing key is an error"), same("When a key is optional"), same("When sorting a list"), same("When creating a set")], correctIndex: 0, explanation: same("A missing bracket lookup raises `KeyError`, which exposes an invalid expected record.") },
    { question: same("What does `Counter` represent well?"), options: [same("Counts of repeated statuses"), same("A mutable shipping queue"), same("A fixed coordinate"), same("A missing value")], correctIndex: 0, explanation: same("Counter maps each item to its frequency.") },
    { question: same("Why whitelist mergeable client fields?"), options: [same("To stop protected values being overwritten"), same("To make dictionaries immutable"), same("To remove all keys"), same("To avoid loops")], correctIndex: 0, explanation: same("A merge accepts later values, so external input needs an explicit boundary.") },
  ],
  project: { name: same("Shipment Manifest"), goal: same("Model, update, group, and summarize shipment data."), brief: same("The delivery tracker now needs a realistic record shape and a compact reporting view."), steps: [same("Create nested dictionaries for three shipments."), same("Use `get()` for each optional note and bracket access for required IDs."), same("Create a revised record with dictionary unpacking."), same("Group IDs by city with `defaultdict(list)`."), same("Count statuses with `Counter` and display the report.")], acceptance: [same("Required and optional fields are accessed differently."), same("An update does not silently allow protected data to be overwritten."), same("The city grouping creates lists only when a city appears."), same("The status report matches the source records.")], stretch: [same("Write a small sanitizer that selects only allowed update keys.")] },
};
