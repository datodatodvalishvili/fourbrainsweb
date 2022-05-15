import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Player from "../SoundPlayer/SoundPlayer";

function CircularProgressWithLabel({ timeLeft }) {
  return (
    <div style={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={timeLeft * 1.6666}
          size={100}
        />
        {timeLeft < 10 && (
          <Player
            url={
              "https://assets.mixkit.co/sfx/download/mixkit-slow-tick-tock-clock-timer-1050.wav"
            }
          />
        )}
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            sx={{ fontSize: 50 }}
          >
            {timeLeft}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

const calculateTimeLeft = (StartDate) => {
  let difference = Math.floor(StartDate + 60 * 1000 - Date.now());
  let seconds = 0;
  if (difference > 0) {
    seconds = Math.floor((difference / 1000) % 60);
  }
  return seconds;
};

export default function Timer({ setStartTime, timeUp, startTime }) {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(startTime));
    }, 100);
    return () => {
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    console.log(timeLeft);
    if (timeLeft <= 0) {
      timeUp(timeLeft);
      setStartTime(0);
    }
  }, [timeLeft]);

  return <CircularProgressWithLabel timeLeft={timeLeft} />;
}
