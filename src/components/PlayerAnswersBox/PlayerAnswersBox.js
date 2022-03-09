import React from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import PlayerAnswer from "./PlayerAnswer";
import Button from "@mui/material/Button";
import {
  selectGameState,
  setQnAnswers,
} from "../../state/gameSlice";
import { useDispatch, useSelector } from "react-redux";

export default function PlayerAnswersBox({ setIsCorrect }) {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const handleClickBack = async (event) => {
    dispatch(setQnAnswers(gameState.qnAnswers - 1));
  };
  const handleClickNext = async (event) => {
    dispatch(setQnAnswers(gameState.qnAnswers + 1));
  };
  const handleChange = async (event, newValue) => {
    dispatch(setQnAnswers(newValue.props.value));
  };

  const handleClickAllTrue = async (event) => {
    for (const answer of gameState.answerArray) {
      if (
        (answer.is_correct !== true) &
        (answer.is_correct !== false) &
        (answer.qn === gameState.qnAnswers)
      ) {
        setIsCorrect(true, answer);
      }
    }
  };
  const handleClickAllFalse = async (event) => {
    for (const answer of gameState.answerArray) {
      if (
        (answer.is_correct !== true) &
        (answer.is_correct !== false) &
        (answer.qn === gameState.qnAnswers)
      ) {
        setIsCorrect(false, answer);
      }
    }
  };

  const qnArr = [...Array(gameState.questionNumber).keys()];

  return (
    <Paper
      elevation={5}
      sx={{
        margin: 1,
        flexGrow: 1,
        minHeight: 0,
        paddingLeft: 2,
      }}
    >
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <IconButton
          onClick={handleClickBack}
          size="medium"
          sx={{ ml: 2 }}
          disabled={gameState.answerCheckDisasbled}
        >
          <ArrowBackIosNewIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <Grid item xs={1}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question</InputLabel>
            <Select
              variant="outlined"
              value={gameState.qnAnswers}
              label="Question"
              onChange={handleChange}
              disabled={gameState.answerCheckDisasbled}
            >
              {qnArr.map((q) => (
                <MenuItem key={q + 1} value={q + 1}>
                  <h2>
                    {q + 1}/{gameState.questionNumber}
                  </h2>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <IconButton
          onClick={handleClickNext}
          size="medium"
          sx={{ ml: 2 }}
          disabled={gameState.answerCheckDisasbled}
        >
          <ArrowForwardIosIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <div className="correct-answer-text">
          {gameState.correctAnswersArray[gameState.qnAnswers]}
        </div>
        <Button
          variant="outlined"
          onClick={handleClickAllTrue}
          size="medium"
          sx={{ ml: 1 }}
          disabled={gameState.answerCheckDisasbled}
        >
          Mark remaining correct
        </Button>
        <Button
          variant="outlined"
          onClick={handleClickAllFalse}
          size="medium"
          sx={{ ml: 2 }}
          disabled={gameState.answerCheckDisasbled}
        >
          Mark remaining false
        </Button>
      </Grid>
      <Grid container sx={{ marginLeft: 4 }} spacing={{ xs: 2, md: 0 }}>
        {gameState.answerArray
          .filter((answer) => answer.qn === gameState.qnAnswers)
          .map((answer) => (
            <PlayerAnswer
              key={answer.teamId + answer.qn}
              answer={answer}
              setIsCorrect={setIsCorrect}
            />
          ))}
      </Grid>
    </Paper>
  );
}
