import { FocusGoalsPage } from "@/components/learn/FocusGoalsPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Focus and Goals", "Set meaningful goals, focus better, and build a practical system for steady progress.", "/learn/focus-goals");

export default function FocusGoalsRoute() {
  return <FocusGoalsPage />;
}
