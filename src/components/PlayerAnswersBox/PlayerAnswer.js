import React from "react";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { selectGameState } from "../../state/gameSlice";
import {  useSelector } from "react-redux";

export default function PlayerAnswer({ setIsCorrect, answer }) {
  let className;
  const gameState = useSelector(selectGameState);
  switch (answer.is_correct) {
    case true:
      className = "player-answer-top-box answer-correct";
      break;
    case false:
      className = "player-answer-top-box answer-wrong";
      break;
    default:
      className = "player-answer-top-box";
  }

  return (
    <Grid item xs={2}>
      <div className={className}>
        <div>Team: {answer.teamId}</div>
        <div>{answer.answer}</div>
      </div>
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <Grid item xs={6}>
          <div className="answer-buttons-correct">
            <IconButton
              onClick={() => setIsCorrect(true, answer)}
              size="medium"
              disabled={gameState.answerCheckDisasbled}
              sx={{ color: "white" }}
            >
              <CheckIcon sx={{ width: 30, height: 30, marginRight: 0 }} />
            </IconButton>
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="answer-buttons-wrong">
            <IconButton
              onClick={() => setIsCorrect(false, answer)}
              size="medium"
              disabled={gameState.answerCheckDisasbled}
              sx={{ color: "white" }}
            >
              <ClearIcon sx={{ width: 30, height: 30, marginRight: 0 }} />
            </IconButton>
          </div>
        </Grid>
      </Grid>
    </Grid>
  );
}
