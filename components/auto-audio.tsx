"use client";

import { useEffect, useRef } from "react";

export function AutoAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.7;

    const attemptPlayback = async () => {
      try {
        await audio.play();
      } catch {
        // Browsers may block audible autoplay until the first user gesture.
      }
    };

    void attemptPlayback();
  }, []);

  return (
    <audio
      ref={audioRef}
      className="hidden-audio"
      src="/audio/projector-bach.mp3"
      autoPlay
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
}
