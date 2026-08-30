"use client";

import { useState } from "react";

/**
 * Round profile photo — served from public/profile-image.png.
 * Falls back to a clean "H" monogram if the file is missing.
 */
export function Avatar({ size = 160, ring = true }: { size?: number; ring?: boolean }) {
  const [ok, setOk] = useState(true);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      {ring && <span className="absolute -inset-1.5 rounded-full border border-marigold/40" />}
      <div className="h-full w-full overflow-hidden rounded-full border border-line bg-ink-card">
        {ok ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/profile-image.png"
            alt="Muhammed Hashim EA"
            onError={() => setOk(false)}
            className="h-full w-full object-cover object-[center_22%]"
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gradient-to-br from-marigold to-marigold-deep">
            <span
              className="font-display font-medium text-ink"
              style={{ fontSize: size * 0.42, lineHeight: 1 }}
            >
              H
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
