import type { LessonDay } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });

export const PYTHON_DAY_6_LESSONS: LessonDay = {
  day: 6, label: same("Phase 1 · Core Python"), title: same("Lists"), totalMinutes: 80, difficulty: same("Beginner"),
  overview: same("Use ordered, mutable collections to manage a changing group of items without losing track of shared references."),
  lessons: [
    {
      id: "python-lists-basics", title: same("Create, read, and update ordered data"), durationMinutes: 18,
      explanation: same("A <b>list</b> is an ordered, mutable collection. A grocery order, a queue of support tickets, and a cart's line items all fit naturally in a list. Create one with square brackets. Indexing and slicing work like strings, but unlike strings you can replace, add, and remove items.\n\nUse a list when order matters and duplicates are allowed. Index carefully: a list starts at `0`, and an invalid index raises `IndexError`. Updating a list changes that shared object, which is useful for a cart but important to communicate when a function receives it."),
      diagram: "cart = [\"book\", \"pen\", \"bag\"]\n         0       1      2\n\ncart[1] = \"notebook\"",
      codeExample: { title: same("Update a shopping cart"), code: "cart = [\"book\", \"pen\", \"bag\"]\ncart[1] = \"notebook\"\n\nprint(cart[0])      # book\nprint(cart[1:])     # notebook, bag\nprint(len(cart))" },
      keyTakeaways: [same("Lists preserve order and allow duplicates."), same("Lists are mutable."), same("Indexing starts at zero and slices exclude their stop index."), same("Use a list when the sequence matters.")],
      commonMistakes: [same("Accessing `items[len(items)]`, which is one position past the final item."), same("Using a list where a unique membership set is needed."), same("Changing a caller's list without making that side effect clear.")],
      quiz: [{ question: same("Which collection is best for ordered cart items that may repeat?"), options: [same("A list"), same("A set"), same("A frozenset"), same("`None`")], correctIndex: 0, explanation: same("Lists retain order and can contain duplicates.") }],
    },
    {
      id: "python-list-methods", title: same("Grow, remove, sort, and search lists"), durationMinutes: 20,
      explanation: same("List methods model common collection changes. `append()` adds one item, `extend()` adds every item from another iterable, `insert()` puts one item at a position, `remove()` deletes the first matching value, and `pop()` removes and returns an item. `sort()` changes the list itself, while `sorted()` returns a new sorted list.\n\nPick methods based on the business rule. A delivery queue might `append()` a new job, but a priority system may need a better structure later. Do not remove items while looping over the same list. Build a new filtered list or iterate over a copy so you do not skip items unexpectedly."),
      diagram: "queue = [\"A\", \"B\"]\n      │ append(\"C\")\n      ▼\n[\"A\", \"B\", \"C\"]\n      │ pop(0)\n      ▼\n[\"B\", \"C\"]",
      codeExample: { title: same("Manage a pickup queue"), code: "queue = [\"PKG-1\", \"PKG-2\"]\nqueue.append(\"PKG-3\")\nnext_package = queue.pop(0)\n\npriority_view = sorted(queue)\nprint(next_package)\nprint(priority_view)" },
      keyTakeaways: [same("`append()` adds one item and `extend()` adds many."), same("`pop()` both removes and returns an item."), same("`sort()` mutates; `sorted()` returns a new list."), same("Avoid mutating a list while iterating over it.")],
      commonMistakes: [same("Expecting `append([\"A\", \"B\"])` to add two items instead of one nested list."), same("Calling `remove()` for a value that is absent."), same("Using `sort()` and assigning its `None` return value back to the variable.")],
      quiz: [{ question: same("Which expression returns a new ordered view without changing `orders`?"), options: [same("`sorted(orders)`"), same("`orders.sort()`"), same("`orders.append()`"), same("`orders.pop()`")], correctIndex: 0, explanation: same("`sorted()` leaves the original list untouched and returns a new list.") }],
    },
    {
      id: "python-list-copies", title: same("Nested lists, copies, and unpacking"), durationMinutes: 22,
      explanation: same("A list can contain other lists, such as rows in a seating chart. Copying needs care: `copy()` or `[:]` makes a <b>shallow copy</b>. It creates a new outer list, but nested mutable objects are still shared. Use `copy.deepcopy()` only when you genuinely need independent nested structures.\n\nList unpacking gives names to positions: `first, second = items`. Use `*rest` when you need the remaining values. Unpacking is readable for a fixed shape, but it will raise an error when the count does not match. Validate external data before treating it as a fixed structure."),
      diagram: "original ─► [[\"A\"], [\"B\"]]\ncopy     ─► new outer list\n                 │\n                 └─ inner lists are shared in a shallow copy",
      codeExample: { title: same("Copy and unpack a route"), code: "route = [[\"Tokyo\", \"Osaka\"], [\"Osaka\", \"Kyoto\"]]\nroute_copy = route.copy()\nroute_copy[0].append(\"Express\")\n\nfirst_leg, *remaining_legs = route\nprint(first_leg)       # nested change is visible\nprint(remaining_legs)" },
      keyTakeaways: [same("Nested lists contain references to inner lists."), same("A shallow copy does not duplicate nested mutable objects."), same("Use unpacking for a known number of values."), same("Use `*rest` for remaining values.")],
      commonMistakes: [same("Creating a matrix with `[[0] * 3] * 3`, which repeats one shared row."), same("Assuming `copy()` makes every nested object independent."), same("Unpacking an arbitrary-length API response without checking its shape.")],
      quiz: [{ question: same("What does a shallow list copy leave shared?"), options: [same("Nested mutable objects"), same("The outer list itself"), same("Every integer's value"), same("The variable name")], correctIndex: 0, explanation: same("The outer list is new, but its elements are the same referenced objects.") }],
    },
  ],
  finalQuiz: [
    { question: same("What does `append()` add?"), options: [same("One item at the end"), same("All items from another list"), same("A sorted copy"), same("A dictionary key")], correctIndex: 0, explanation: same("`append()` treats its argument as one element.") },
    { question: same("What does `pop(0)` do?"), options: [same("Removes and returns the first item"), same("Reads without removal"), same("Sorts the list"), same("Copies the list")], correctIndex: 0, explanation: same("`pop` removes an item and returns it.") },
    { question: same("When should you choose a list?"), options: [same("When order matters and duplicates are useful"), same("When every item must be unique"), same("When the collection can never change"), same("When values need key lookup")], correctIndex: 0, explanation: same("Lists are ordered and mutable, with duplicates allowed.") },
    { question: same("Why can a shallow copy surprise you?"), options: [same("Nested lists remain shared"), same("It deletes the original"), same("It sorts automatically"), same("It changes strings")], correctIndex: 0, explanation: same("Only the outer list is copied.") },
    { question: same("What does `first, *rest = items` require?"), options: [same("At least one item"), same("Exactly two items"), same("A set"), same("An immutable list")], correctIndex: 0, explanation: same("The first item gets `first`; zero or more others go to `rest`.") },
  ],
  project: { name: same("Pickup Queue Manager"), goal: same("Maintain a changing pickup queue safely."), brief: same("The delivery tracker now needs ordered packages, a next-item action, and a clean view of remaining work."), steps: [same("Create a list of package IDs."), same("Append two new packages and remove the next one with `pop(0)`."), same("Show a sorted reporting view without changing the operational queue."), same("Create a nested route list and demonstrate a shallow-copy effect."), same("Unpack the first package and remaining queue for a status report.")], acceptance: [same("The queue preserves arrival order."), same("The next package is removed exactly once."), same("The reporting sort does not mutate the live queue."), same("The code explains shared nested data through behavior, not comments.")], stretch: [same("Write a function that returns `None` when the queue is empty."), same("Add a priority list and explain why a plain list may become too slow at larger scale.")] },
};
