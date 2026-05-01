"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UfoCardType } from "@/types";
import { useEffect, useEffectEvent } from "react";

type Mode = "prev" | "next";

type Props = {
  record: UfoCardType;
  mode: Mode;
}

const transitionTypes: Record<Mode, string[]> = {
  prev: ["nav-back"],
  next: ["nav-forward"],
};

export default function AudioRecordingContentArrow({ record, mode }: Props) {
  const router = useRouter();

  const handleKeyDownEffect = useEffectEvent((event: KeyboardEvent) => {
    if (!record) return;

    if (event.key === 'ArrowLeft' && mode === 'prev') {
      router.push(`/audio-recordings/${record.id}`, {
        transitionTypes: transitionTypes[mode],
      })
    }

    if (event.key === "ArrowRight" && mode === 'next') {
      router.push(`/audio-recordings/${record.id}`, {
        transitionTypes: transitionTypes[mode],
      })
    }
  })

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDownEffect);
    return () => {
      document.removeEventListener("keydown", handleKeyDownEffect);
    }
  }, []);

  if (record) {
    return (
      <span 
        style={mode === 'next' ? {zIndex: '999' ,position: 'absolute', top: '50%', right: '0%', padding: '1rem', color: 'white' } : { zIndex: '999' ,position: "absolute", top: '50%', left: '0%', padding: '1rem', color: 'white' }}
      >
        <Link
          color="white"
          href={`/audio-recordings/${record.id}`}
          transitionTypes={transitionTypes[mode]}
        >
          {mode === "prev" ? "←" : "→"}
        </Link>
      </span>
    )
  }

  return (
    <span>
      {mode === "prev" ? "←" : "→"}
    </span>
  );
}