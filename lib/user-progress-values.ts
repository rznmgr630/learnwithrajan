export function nextProgressValues<T>(values: Set<T>, value: T) {
  const next = new Set(values);
  const wasCompleted = next.delete(value);
  if (!wasCompleted) next.add(value);
  return { values: next, wasCompleted };
}
