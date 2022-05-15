import React, { useState } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";
import Timer from "../Timer/Timer";
import Confirmation from "./Confirmation";
import Button from "@mui/material/Button";
import { selectGameState, nextQuestion, setQn } from "../../state/gameSlice";
import { useDispatch, useSelector } from "react-redux";

export default function QuestionBox({ timeUp, startQuestion, token }) {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const [startTime, setStartTime] = useState(0);
  const [open, setOpen] = useState(false);

  const handleClickBack = async (event) => {
    setOpen(true);
  };
  const handleClickNext = async (event) => {
    //setOpen(true);
    dispatch(nextQuestion({ qn: gameState.qn, token: token }));
    dispatch(setQn(gameState.qn + 1));
    setStartTime(0);
  };

  const handleBack = async (event) => {
    dispatch(nextQuestion({ qn: gameState.qn - 2, token: token }));
    dispatch(setQn(gameState.qn - 1));
    setStartTime(0);
  };

  const startTimer = () => {
    setStartTime(Date.now());
    startQuestion();
  };

  const qnArr = [...Array(gameState.questionNumber).keys()];

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        margin: 1,
        marginBottom: 0,
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      <Confirmation
        open={open}
        setOpen={setOpen}
        successCallback={handleBack}
      />
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <IconButton onClick={handleClickBack} size="medium" sx={{ ml: 2 }}>
          <ArrowBackIosNewIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <Grid item xs={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question</InputLabel>
            <Select
              variant="outlined"
              value={gameState.qn}
              label="Question"
              disabled
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
        <IconButton onClick={handleClickNext} size="medium" sx={{ ml: 2 }}>
          <ArrowForwardIosIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
      </Grid>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          margin: 1,
          marginBottom: 0,
          flexGrow: 1,
          minHeight: 0,
          height: 200,
        }}
      >
        <h3>{gameState.question.question_text}</h3>
      </Paper>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          margin: 1,
          marginBottom: 0,
          flexGrow: 1,
          minHeight: 0,
          height: 145,
          textAlign: "center",
        }}
      >
        {startTime !== 0 ? (
          <Timer
            startTime={startTime}
            setStartTime={setStartTime}
            timeUp={timeUp}
          />
        ) : (
          <Button sx={{ height: 115 }} variant="outlined" onClick={startTimer}>
            Start timer
          </Button>
        )}
      </Paper>
    </Paper>
  );
}
