/**
 * Removes RichText-style markers for aria-labels and other plain-text contexts.
 * Inline code becomes its inner text; paired asterisks are dropped.
 */
export function stripRichMarkers(text: string): string {
  return text.replace(/`([^`]*)`/g, "$1").replace(/\*\*/g, "");
}
