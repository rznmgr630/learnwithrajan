import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Learn with Rajan",
    short_name: "Learn with Rajan",
    description: "Free, beginner-friendly learning paths for programming, Japanese, DevOps, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1020",
    theme_color: "#0b1020",
  };
}
