import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";

export default function PlayerAnswer({ answer, setIsCorrect }) {
  let className;
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
    <Grid item xs={1}>
      <Paper
        elevation={5}
        sx={{
          margin: 1,
          marginLeft: 3,
          flexGrow: 1,
          minHeight: 0,
          height: 150,
        }}
      >
        <div className={className}>
          <div>Team: {answer.teamId}</div>
          <div>Answer: {answer.answer}</div>
        </div>
        <Grid container spacing={{ xs: 0, md: 0 }}>
          <Grid item xs={6}>
            <div className="answer-buttons-correct">
              <IconButton
                onClick={() => setIsCorrect(true, answer)}
                size="medium"
                sx={{ ml: 1 }}
              >
                <CheckIcon sx={{ width: 40, height: 40, marginLeft: 0 }} />
              </IconButton>
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="answer-buttons-wrong">
              <IconButton
                onClick={() => setIsCorrect(false, answer)}
                size="medium"
                sx={{ ml: 1 }}
              >
                <ClearIcon sx={{ width: 40, height: 40, marginLeft: 0 }} />
              </IconButton>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
