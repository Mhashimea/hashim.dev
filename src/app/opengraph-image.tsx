import { ImageResponse } from "next/og";

export const alt = "Hashim — AI & Backend Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#14110e",
          backgroundImage:
            "radial-gradient(1000px 500px at 85% -10%, rgba(232,163,61,0.22), transparent 60%)",
          color: "#ede6da",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              backgroundColor: "#3fb9a6",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: "#e8a33d",
              fontFamily: "monospace",
            }}
          >
            AI &amp; BACKEND ENGINEER
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, lineHeight: 1.05, letterSpacing: -1, maxWidth: 900 }}>
            I build AI agents and the
          </div>
          <div style={{ display: "flex", fontSize: 72, lineHeight: 1.05, letterSpacing: -1 }}>
            backends that&nbsp;
            <span style={{ color: "#e8a33d" }}>run them.</span>
          </div>
          <div style={{ fontSize: 28, color: "#a89c8a", marginTop: 26, maxWidth: 820 }}>
            8+ years shipping production software — agent platforms, real-time voice, RAG.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "monospace" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              border: "1px solid rgba(232,163,61,0.5)",
              backgroundColor: "rgba(232,163,61,0.12)",
              color: "#e8a33d",
              fontSize: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            h
          </div>
          <div style={{ fontSize: 26, color: "#ede6da" }}>hashim.dev</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
