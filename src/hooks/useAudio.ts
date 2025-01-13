import { useEffect, useRef, useState } from "react";

export const useAudio = (url: string) => {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Créer l'élément audio
    audio.current = new Audio(url);

    // Gérer le chargement
    audio.current.addEventListener("loadeddata", () => {
      setIsLoaded(true);
    });

    // Gérer les erreurs
    audio.current.addEventListener("error", () => {
      const error = audio.current?.error;
      if (error) {
        console.error("Error loading audio:", {
          code: error.code,
          message: error.message,
          url: url,
        });
      }
    });

    // Charger l'audio
    audio.current.load();

    return () => {
      if (audio.current) {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.removeEventListener("loadeddata", () => {});
        audio.current.removeEventListener("error", () => {});
      }
    };
  }, [url]);

  const play = async () => {
    if (!audio.current || !isLoaded) return;

    try {
      audio.current.currentTime = 0;
      await audio.current.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const stop = () => {
    if (!audio.current) return;

    audio.current.pause();
    audio.current.currentTime = 0;
  };

  return { play, stop, isLoaded };
};
