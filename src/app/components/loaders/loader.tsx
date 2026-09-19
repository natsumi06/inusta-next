"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FRAME_PATHS = [
  "/loading/Slice1.svg",
  "/loading/Slice2.svg",
  "/loading/Slice3.svg",
  "/loading/Slice4.svg",
  "/loading/Slice5.svg",
  "/loading/Slice6.svg",
  "/loading/Slice7.svg",
  "/loading/Slice8.svg",
] as const;
const FRAME_INTERVAL_MS = 125;

export default function Loader() {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrame((currentFrame) => (currentFrame + 1) % FRAME_PATHS.length);
    }, FRAME_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      role="status"
      className="absolute left-1/2 top-2/4 -translate-x-1/2 -translate-y-1/2"
    >
      <Image
        src={FRAME_PATHS[frame]}
        alt=""
        aria-hidden="true"
        width={112}
        height={112}
        priority
      />
    </div>
  );
}
