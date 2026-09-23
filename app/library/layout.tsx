import { SiteHeader } from "@/components/SiteHeader";

export default function LibraryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
