import { DSAProblemList } from "@/components/learn/DSAProblemList";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";

export const metadata = {
  title: "Basic DSA Problems",
};

export default function DSABasicPage() {
  return (
    <DSAProblemList problems={DSA_BASIC_PROBLEMS} difficulty="Basic" backHref="/learn/dsa" />
  );
}
