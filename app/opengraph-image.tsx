import { ImageResponse } from "next/og";

export const alt = "Learn with Rajan";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0b1020",
          color: "#f8fafc",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ color: "#67e8f9", display: "flex", fontSize: 30, fontWeight: 700 }}>
          learn.rajanmidun.com.np
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: "-4px" }}>Learn with Rajan</div>
          <div style={{ color: "#cbd5e1", display: "flex", fontSize: 34, marginTop: 22 }}>
            Practical learning paths, built for beginners.
          </div>
        </div>
        <div style={{ color: "#94a3b8", display: "flex", fontSize: 28 }}>
          Programming  •  Japanese  •  DevOps  •  Personal growth
        </div>
      </div>
    ),
    size,
  );
}
