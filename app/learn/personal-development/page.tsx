import { PersonalDevelopmentTracks } from "@/components/learn/PersonalDevelopmentTracks";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("Personal Development", "Practical learning tracks for focus, discipline, motivation, exercise, devotion, and better daily habits.", "/learn/personal-development");

export default function PersonalDevelopmentPage() {
  return <PersonalDevelopmentTracks />;
}
