import { HeroSection } from "@/components/HeroSection";
import { HomeCategoryGrid } from "@/components/HomeCategoryGrid";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <HeroSection />
      <HomeCategoryGrid />
      <SiteFooter />
    </div>
  );
}
