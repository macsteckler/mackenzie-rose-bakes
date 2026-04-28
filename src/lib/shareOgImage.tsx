import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const SHARE_OG_ALT = "Mackenzie Rose Bakes | Custom Cakes NYC";
export const SHARE_OG_SIZE = { width: 1200, height: 630 };
export const SHARE_OG_CONTENT_TYPE = "image/png";

/** 1200×630 preview with the solid-background logo (good for iMessage, social, etc.). */
export async function shareOpenGraphImageResponse(): Promise<ImageResponse> {
  const logoBuffer = await readFile(
    path.join(process.cwd(), "public", "mackenzielogobackground.jpg")
  );
  const logoSrc = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          background: "#fce8e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Brand logo (JPEG with background) — data URI for Satori / ImageResponse */}
        <img
          src={logoSrc}
          alt=""
          width={520}
          height={520}
          style={{
            objectFit: "contain",
          }}
        />
      </div>
    ),
    { ...SHARE_OG_SIZE }
  );
}
