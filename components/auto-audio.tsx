"use client";

import { useEffect, useRef, useState } from "react";

export function AutoAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [needsGesture, setNeedsGesture] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = 0.7;

    const attemptPlayback = async () => {
      try {
        await audio.play();
        setNeedsGesture(false);
      } catch {
        setNeedsGesture(true);
      }
    };

    void attemptPlayback();
  }, []);

  const startPlayback = async () => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    await audio.play();
    setNeedsGesture(false);
  };

  return (
    <div className="audio-panel" aria-label="Projector Bach audio player">
      <audio
        ref={audioRef}
        src="/audio/projector-bach.mp3"
        autoPlay
        loop
        controls
        preload="auto"
      >
        Your browser does not support the audio element.
      </audio>
      {needsGesture ? (
        <button className="noise-button" type="button" onClick={startPlayback}>
          Enter the noise
        </button>
      ) : null}
    </div>
  );
}
