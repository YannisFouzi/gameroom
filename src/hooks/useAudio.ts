import { useEffect, useRef, useState } from "react";

export function useAudio(url: string) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    audio.current = new Audio(url);

    const handleCanPlayThrough = () => {
      setIsLoaded(true);
    };

    const handleError = (e: ErrorEvent) => {
      console.warn(`Erreur de chargement audio (${url}):`, e.message);
      // On évite de bloquer l'application si l'audio ne charge pas
      setIsLoaded(true);
    };

    audio.current.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.current.addEventListener("error", handleError);

    return () => {
      if (audio.current) {
        audio.current.removeEventListener(
          "canplaythrough",
          handleCanPlayThrough
        );
        audio.current.removeEventListener("error", handleError);
        audio.current = null;
      }
    };
  }, [url]);

  const play = () => {
    if (audio.current) {
      // Reset l'audio avant de jouer
      audio.current.currentTime = 0;
      // Catch l'erreur si la lecture échoue
      audio.current.play().catch((err) => {
        console.warn(`Erreur de lecture audio (${url}):`, err);
      });
    }
  };

  const stop = () => {
    if (audio.current) {
      audio.current.pause();
      audio.current.currentTime = 0;
    }
  };

  return { play, stop, isLoaded };
}
