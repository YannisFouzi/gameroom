import { useEffect, useRef } from "react";

export const useAudio = (url: string) => {
  const audio = useRef(new Audio(url));

  useEffect(() => {
    return () => {
      audio.current.pause();
      audio.current.currentTime = 0;
    };
  }, []);

  const play = () => {
    audio.current.currentTime = 0;
    audio.current.play();
  };

  const stop = () => {
    audio.current.pause();
    audio.current.currentTime = 0;
  };

  return { play, stop };
};
