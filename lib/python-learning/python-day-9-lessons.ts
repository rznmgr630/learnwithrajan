import type { LessonDay } from "@/lib/learn/lesson-types";

const same = (en: string) => ({ en, np: en, jp: en });

export const PYTHON_DAY_9_LESSONS: LessonDay = {
  day: 9, label: same("Phase 1 · Core Python"), title: same("Loops"), totalMinutes: 80, difficulty: same("Beginner"),
  overview: same("Repeat work safely with loops, stop or skip intentionally, and keep iteration patterns readable as data grows."),
  lessons: [
    {
      id: "python-for-range", title: same("Repeat over values with for and range"), durationMinutes: 20,
      explanation: same("A `for` loop visits each item in an iterable, such as a list, string, dictionary, or range. Use it when you know the collection to process. `range(stop)` produces a sequence of integers from zero up to, but not including, stop. `range(start, stop, step)` controls the beginning and increment.\n\nIn a batch delivery report, process each package rather than indexing manually. When you need both a position and a value, use `enumerate()` instead of maintaining your own counter. This avoids off-by-one bugs and makes the intent obvious."),
      diagram: "packages = [\"A\", \"B\", \"C\"]\nfor index, package in enumerate(packages):\n  0 → A\n  1 → B\n  2 → C",
      codeExample: { title: same("Number a pickup report"), code: "packages = [\"PKG-1\", \"PKG-2\", \"PKG-3\"]\n\nfor number, package_id in enumerate(packages, start=1):\n    print(f\"{number}. {package_id}\")\n\nfor hour in range(9, 18, 2):\n    print(f\"Dispatch run at {hour}:00\")" },
      keyTakeaways: [same("Use `for` to process each iterable item."), same("`range` excludes its stop value."), same("Use `enumerate()` for index and value."), same("Name the loop item after its business meaning.")],
      commonMistakes: [same("Writing `range(len(items))` when you only need each item."), same("Expecting `range(3)` to include 3."), same("Changing the list structure while iterating over it.")],
      quiz: [{ question: same("What does `range(3)` produce?"), options: [same("0, 1, 2"), same("1, 2, 3"), same("0, 1, 2, 3"), same("Three random numbers")], correctIndex: 0, explanation: same("The stop value is excluded.") }],
    },
    {
      id: "python-while-control", title: same("Use while, break, continue, and pass intentionally"), durationMinutes: 20,
      explanation: same("A `while` loop repeats while its condition is truthy. Use it when you do not know the iteration count ahead of time, such as retrying an operation with a fixed limit. Update the condition inside the loop or it can run forever. `break` exits the nearest loop early, `continue` skips to the next iteration, and `pass` is a placeholder that does nothing.\n\nA loop should have a visible termination rule. Avoid `while True` unless the loop has a carefully reviewed break or lifecycle management. In production retries, add maximum attempts, backoff, logging, and a clear failure result instead of retrying forever."),
      diagram: "attempt < max_attempts?\n  │ yes\n  ▼\ntry work → success? → break\n  │ no\n  └─ attempt += 1",
      codeExample: { title: same("Retry a simulated dispatch check"), code: "max_attempts = 3\nattempt = 0\n\nwhile attempt < max_attempts:\n    attempt += 1\n    if attempt == 1:\n        continue  # simulated temporary delay\n    print(f\"Dispatch check passed on attempt {attempt}\")\n    break\nelse:\n    print(\"Dispatch check failed\")" },
      keyTakeaways: [same("A `while` loop needs a changing or bounded condition."), same("`break` exits a loop and `continue` skips one iteration."), same("`pass` is a temporary no-op placeholder."), same("Bound retries and make failure visible.")],
      commonMistakes: [same("Forgetting to update a while-loop counter."), same("Using `break` when only the current item should be skipped."), same("Leaving `pass` in unfinished production logic.")],
      quiz: [{ question: same("What does `continue` do?"), options: [same("Skips the rest of the current iteration"), same("Exits every loop"), same("Stops the program"), same("Copies the iterable")], correctIndex: 0, explanation: same("Control returns to the loop's next iteration.") }],
    },
    {
      id: "python-loop-patterns", title: same("Pair and nest iterations carefully"), durationMinutes: 18,
      explanation: same("`zip()` pairs items from multiple iterables, such as package IDs and statuses. It stops at the shortest input, which is safe only when truncation is acceptable. Validate lengths first if each package must have a status. Nested loops process combinations, such as checking each package against each available driver, but their work grows quickly as both collections grow.\n\nUse nested loops for small, understandable combinations. For larger matching problems, consider indexing data with dictionaries or sets rather than comparing every pair. Start by stating what one iteration represents, then decide whether a loop is the right shape."),
      diagram: "zip([\"A\", \"B\"], [\"packed\", \"shipped\"])\n  │\n  ▼\n(A, packed)\n(B, shipped)",
      codeExample: { title: same("Pair package IDs and statuses"), code: "package_ids = [\"PKG-1\", \"PKG-2\"]\nstatuses = [\"packed\", \"shipped\"]\n\nif len(package_ids) != len(statuses):\n    raise ValueError(\"Every package needs one status\")\n\nfor package_id, status in zip(package_ids, statuses):\n    print(f\"{package_id}: {status}\")" },
      keyTakeaways: [same("`zip()` pairs corresponding values."), same("`zip()` stops at the shortest input."), same("Nested loops process combinations."), same("Avoid quadratic work when a lookup structure can help.")],
      commonMistakes: [same("Losing unpaired items because `zip()` truncates silently."), same("Writing a nested loop before considering a dictionary lookup."), same("Using `pass` to silently ignore an impossible data state.")],
      quiz: [{ question: same("What happens when zip receives lists of unequal length?"), options: [same("It stops at the shorter list"), same("It fills missing values with `None`"), same("It raises automatically"), same("It duplicates values")], correctIndex: 0, explanation: same("Zip only produces pairs while every input has another item.") }],
    },
  ],
  finalQuiz: [
    { question: same("What is the clearest way to receive both index and list item?"), options: [same("`enumerate(items)`"), same("`range(items)`"), same("`id(items)`"), same("`set(items)`")], correctIndex: 0, explanation: same("Enumerate yields a counter and the current item.") },
    { question: same("What should every retry `while` loop have?"), options: [same("A termination rule or maximum attempt count"), same("An empty list"), same("A tuple key"), same("A raw string")], correctIndex: 0, explanation: same("Without a stopping condition, the loop may run forever.") },
    { question: same("When should `break` be used?"), options: [same("When no further iterations should run"), same("When only one item should be skipped"), same("When a list is copied"), same("When a dictionary is missing")], correctIndex: 0, explanation: same("Break exits the nearest loop immediately.") },
    { question: same("Why check lengths before zip in a manifest?"), options: [same("To avoid silently dropping an unpaired package or status"), same("To make zip faster"), same("To change list order"), same("To remove duplicates")], correctIndex: 0, explanation: same("Zip truncates to its shortest input.") },
  ],
  project: { name: same("Dispatch Batch Processor"), goal: same("Process a batch of package IDs and statuses with clear loop control."), brief: same("The tracker now processes multiple shipments and must make mismatched batch data visible."), steps: [same("Create matching package-ID and status lists."), same("Validate their lengths, then pair them with `zip()`."), same("Use `enumerate()` to number a report."), same("Skip a `cancelled` status with `continue`."), same("Add a bounded while-loop retry simulation."), same("Write a small nested loop for a few package-driver combinations.")], acceptance: [same("Every matched package has exactly one status line."), same("Mismatched lists cause a clear failure."), same("Retries never loop forever."), same("The output explains skipped packages.")], stretch: [same("Replace the nested driver matching loop with a set or dictionary lookup.")] },
};
