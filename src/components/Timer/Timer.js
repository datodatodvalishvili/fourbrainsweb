import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Player from "../SoundPlayer/SoundPlayer";

function CircularProgressWithLabel(props) {
  return (
    <div style={{ textAlign: "center" }}>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} size={100} />
        {props.value > 83.333 && (
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
            {`${60 - Math.round(props.value / 1.66666)}`}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default function Timer({ setTimerStarted, timeUp }) {
  const [progress, setProgress] = React.useState(1);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 99) {
          timeUp();
          setTimerStarted(false);
        }
        return prevProgress >= 99 ? 0 : prevProgress + 1 * 1.66666;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <CircularProgressWithLabel value={progress} />;
}
