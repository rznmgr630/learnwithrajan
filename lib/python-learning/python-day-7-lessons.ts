import type { LessonDay } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });

export const PYTHON_DAY_7_LESSONS: LessonDay = {
  day: 7, label: same("Phase 1 · Core Python"), title: same("Tuples, Sets & Frozensets"), totalMinutes: 75, difficulty: same("Beginner"),
  overview: same("Choose the collection type that states your real rule: fixed positions, unique values, or a read-only set of permissions."),
  lessons: [
    {
      id: "python-tuples", title: same("Tuples protect fixed records"), durationMinutes: 18,
      explanation: same("A <b>tuple</b> is an ordered collection that cannot be changed after creation. Use one for a fixed record such as latitude and longitude, an RGB color, or a function result with a known shape. Tuples support indexing, slicing, and unpacking like lists, but not `append()` or item assignment.\n\nImmutability communicates intent. It does not make every nested object immutable: a tuple containing a list can still expose that list's changes. A one-item tuple needs a comma, `(\"Tokyo\",)`, otherwise it is just a parenthesized string."),
      diagram: "coordinate = (35.6762, 139.6503)\n              latitude  longitude\n\nUnpack: lat, lon = coordinate",
      codeExample: { title: same("Return a fixed location"), code: "warehouse_location = (35.6762, 139.6503)\nlatitude, longitude = warehouse_location\n\nprint(latitude, longitude)\n# warehouse_location[0] = 0  # TypeError" },
      keyTakeaways: [same("Tuples are ordered and immutable."), same("Tuple unpacking names fixed positions."), same("Use a trailing comma for a one-item tuple."), same("Nested mutable values can still change.")],
      commonMistakes: [same("Using a tuple when the collection must grow or shrink."), same("Forgetting the comma in a one-item tuple."), same("Assuming a tuple makes nested lists immutable.")],
      quiz: [{ question: same("What is a strong use case for a tuple?"), options: [same("A fixed latitude and longitude pair"), same("A shopping cart that changes"), same("A unique tag lookup"), same("A missing optional value")], correctIndex: 0, explanation: same("The two positions have a stable meaning and should not be changed casually.") }],
    },
    {
      id: "python-sets", title: same("Sets model unique membership"), durationMinutes: 22,
      explanation: same("A <b>set</b> stores unique, unordered values. It is excellent for removing duplicate tags, checking whether a role is allowed, and comparing two groups. Add with `add()`, remove safely with `discard()`, and use `in` for membership. Do not depend on a set's order for user-facing output. Sort it first when display order matters.\n\nSet operations make group rules explicit: union `|` combines values, intersection `&` finds shared values, difference `-` finds values in one group but not another, and symmetric difference `^` finds values in exactly one group. These operations are common in permission, inventory, and audience comparisons."),
      diagram: "warehouse_a = {\"A\", \"B\"}\nwarehouse_b = {\"B\", \"C\"}\n\na & b → {\"B\"}\na | b → {\"A\", \"B\", \"C\"}",
      codeExample: { title: same("Compare warehouse stock"), code: "warehouse_a = {\"A-1\", \"B-2\"}\nwarehouse_b = {\"B-2\", \"C-3\"}\n\nshared = warehouse_a & warehouse_b\nall_items = warehouse_a | warehouse_b\nonly_a = warehouse_a - warehouse_b\n\nprint(shared, all_items, only_a)" },
      keyTakeaways: [same("Sets automatically remove duplicates."), same("Sets do not promise an order."), same("`in` is a clear membership check."), same("Set operators compare groups directly.")],
      commonMistakes: [same("Using `{}` for an empty set. It creates an empty dictionary; use `set()`."), same("Expecting duplicates to be retained."), same("Displaying unsorted set output as a stable order.")],
      quiz: [{ question: same("Which operation finds values shared by both sets?"), options: [same("Intersection with `&`"), same("Union with `|`"), same("Difference with `-`"), same("Assignment with `=`")], correctIndex: 0, explanation: same("Intersection keeps only values present in each set.") }],
    },
    {
      id: "python-frozensets-choice", title: same("Frozensets and choosing the right collection"), durationMinutes: 18,
      explanation: same("A <b>frozenset</b> is an immutable set. It represents a stable group, such as a default set of supported payment methods. Because it cannot change, it can itself be used as a dictionary key or placed inside another set. Use it when immutability matters, not by default.\n\nChoose a list for ordered repeated items, a tuple for a fixed ordered record, a set for unique membership, and a frozenset for unique membership that must not change. The choice describes the business rule and helps prevent invalid operations before they happen."),
      diagram: "Need order? ─ yes ─► list or tuple\nCan it change? ─ yes ─► list\nNeed unique values? ─► set\nNeed unique, fixed values? ─► frozenset",
      codeExample: { title: same("Keep supported payment methods fixed"), code: "supported_methods = frozenset({\"card\", \"bank_transfer\"})\nrequested_method = \"card\"\n\nif requested_method in supported_methods:\n    print(\"Payment method accepted\")" },
      keyTakeaways: [same("A frozenset is an immutable set."), same("Lists preserve order and duplicates."), same("Tuples preserve order but are fixed."), same("Sets model unique membership.")],
      commonMistakes: [same("Using a set for a sequence whose order users care about."), same("Using a tuple for a collection that needs frequent updates."), same("Trying to add to a frozenset.")],
      quiz: [{ question: same("Which type models a fixed, unique set of supported roles?"), options: [same("`frozenset`"), same("`list`"), same("`tuple`"), same("`str`")], correctIndex: 0, explanation: same("A frozenset communicates unique values that must not be changed.") }],
    },
  ],
  finalQuiz: [
    { question: same("Which type keeps order but cannot be changed?"), options: [same("Tuple"), same("Set"), same("List"), same("Dictionary")], correctIndex: 0, explanation: same("Tuples are ordered and immutable.") },
    { question: same("How do you make an empty set?"), options: [same("`set()`"), same("`{}`"), same("`[]`"), same("`()`")], correctIndex: 0, explanation: same("`{}` is an empty dictionary, not a set.") },
    { question: same("What does `a - b` mean for sets?"), options: [same("Items in a but not b"), same("Items shared by both"), same("All items"), same("A sorted set")], correctIndex: 0, explanation: same("Difference keeps values unique to the left set.") },
    { question: same("Why use a frozenset?"), options: [same("To keep a unique group immutable"), same("To preserve duplicate values"), same("To sort values"), same("To create nested lists")], correctIndex: 0, explanation: same("It is the immutable form of a set.") },
  ],
  project: { name: same("Warehouse Coverage Checker"), goal: same("Compare product coverage across warehouses without duplicate stock codes."), brief: same("This adds group comparisons to the delivery tracker while keeping fixed location data protected."), steps: [same("Represent each warehouse location as a tuple."), same("Create sets of product IDs for two warehouses."), same("Print shared products, all products, and products unique to each warehouse."), same("Store allowed delivery zones as a frozenset."), same("Unpack a warehouse coordinate for reporting.")], acceptance: [same("Duplicate product IDs do not change a set result."), same("Set output is sorted before user-facing display."), same("The allowed-zone collection cannot be modified."), same("Collection choices match their business rules.")], stretch: [same("Add a third warehouse and compute products missing from every location.")] },
};
