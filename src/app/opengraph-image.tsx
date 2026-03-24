import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Mackenzie Rose Bakes | Custom Cakes NYC";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "linear-gradient(135deg, #fce4ec 0%, #fce4ec 50%, #f8bbd0 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative sprinkle dots */}
        {[
          [60, 40, "#f9a8d4", 18, 6, 35],
          [120, 80, "#fbbf24", 14, 5, -20],
          [200, 30, "#a78bfa", 16, 5, 50],
          [350, 60, "#34d399", 18, 6, -40],
          [900, 50, "#fb7185", 16, 5, 25],
          [1050, 90, "#fbbf24", 14, 5, -30],
          [1130, 40, "#a78bfa", 18, 6, 60],
          [80, 500, "#34d399", 16, 5, -50],
          [180, 560, "#f9a8d4", 18, 6, 20],
          [1000, 520, "#fbbf24", 14, 5, -15],
          [1100, 570, "#fb7185", 18, 6, 45],
          [950, 580, "#a78bfa", 14, 5, -55],
          [40, 300, "#fbbf24", 16, 5, 30],
          [1160, 320, "#34d399", 16, 5, -35],
          [600, 30, "#fb7185", 14, 5, 55],
          [700, 590, "#f9a8d4", 18, 6, -20],
        ].map(([x, y, color, h, w, rot], i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}px`,
              top: `${y}px`,
              width: `${w}px`,
              height: `${h}px`,
              background: color as string,
              borderRadius: "3px",
              transform: `rotate(${rot}deg)`,
              opacity: 0.7,
            }}
          />
        ))}

        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.85)",
            borderRadius: "32px",
            padding: "60px 80px",
            boxShadow: "0 8px 60px rgba(233,104,128,0.18)",
            border: "2px solid rgba(249,168,212,0.4)",
          }}
        >
          {/* Cake emoji */}
          <div style={{ fontSize: "90px", marginBottom: "16px", display: "flex" }}>🎂</div>

          {/* Business name */}
          <div
            style={{
              fontSize: "64px",
              fontWeight: "700",
              color: "#881337",
              letterSpacing: "-1px",
              textAlign: "center",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Mackenzie Rose Bakes
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "28px",
              color: "#be185d",
              marginTop: "16px",
              letterSpacing: "0.05em",
              display: "flex",
            }}
          >
            Custom Cakes &amp; Sweets · New York City
          </div>

          {/* Stars */}
          <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ fontSize: "28px", color: "#f59e0b", display: "flex" }}>★</div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
