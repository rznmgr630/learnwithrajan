import { HeroSection } from "@/components/HeroSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <HeroSection />
      <SiteFooter />
    </div>
  );
}
