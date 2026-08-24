/**
 * Opening one section of a single-open accordion collapses the previous one,
 * which shifts everything below it. Bringing the just-opened element back into
 * view keeps its heading where the reader expects it.
 *
 * Call with the element to align, after the toggle that expands it.
 */
export function scrollOpenSectionIntoView(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}
