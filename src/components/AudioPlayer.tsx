import React, { useEffect, useRef } from "react";
import musicSrc from "../assets/music.mp3";

export default function AudioPlayer({
  musicPlaying,
  setMusicPlaying,
}: {
  musicPlaying: boolean;
  setMusicPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const musicUrl = musicSrc;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (musicPlaying) {
      audio.play().catch(() => {
        setMusicPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [musicPlaying, setMusicPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    function onPlay() {
      setMusicPlaying(true);
    }
    function onPause() {
      setMusicPlaying(false);
    }
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, [setMusicPlaying]);

  return (
    <>
      <audio ref={audioRef} src={musicUrl} loop preload="auto" />
      <div className="fixed right-6 top-6 z-50">
        <button
          onClick={() => setMusicPlaying((s) => !s)}
          aria-pressed={musicPlaying}
          aria-label={musicPlaying ? "Pausar música" : "Reproducir música"}
          className="rounded-full border border-yellow-400 bg-white/80 px-4 py-2 shadow backdrop-blur-sm font-semibold cursor-pointer hover:bg-yellow-600 hover:text-white"
        >
          {musicPlaying ? "🔊 Pausar música" : "🎵 Reproducir música"}
        </button>
      </div>
    </>
  );
}
