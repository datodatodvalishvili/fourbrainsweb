import React, { useState, useEffect } from "react";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => audio.play());
    return () => {
      audio.pause(); 
      audio.removeEventListener("ended", () => audio.pause());
    };
  }, []);

  return [playing];
};

const Player = ({ url }) => {
  const [playing] = useAudio(url);
  return <></>;
};

export default Player;
