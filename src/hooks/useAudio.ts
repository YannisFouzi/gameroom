export const useAudio = (url: string) => {
  const audio = new Audio(url);

  return {
    play: () => {
      audio.currentTime = 0;
      audio.play();
    },
  };
};
