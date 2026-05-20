"use client";

import { useEffect, useRef } from "react";

export function AutoAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 1;
    audio.loop = true;

    const attemptPlayback = async () => {
      try {
        audio.muted = false;
        await audio.play();
        removeGestureListeners();
        return true;
      } catch {
        return false;
      }
    };

    const forcePlayback = () => {
      void attemptPlayback();
    };

    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", forcePlayback);
      window.removeEventListener("click", forcePlayback);
      window.removeEventListener("keydown", forcePlayback);
      window.removeEventListener("touchstart", forcePlayback);
    };

    void attemptPlayback();

    window.addEventListener("pointerdown", forcePlayback, { passive: true });
    window.addEventListener("click", forcePlayback, { passive: true });
    window.addEventListener("keydown", forcePlayback);
    window.addEventListener("touchstart", forcePlayback, { passive: true });

    return removeGestureListeners;
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
