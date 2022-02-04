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
import Button from "@mui/material/Button";

export default function QuestionBox({
  question,
  nextQuestion,
  questionNumber,
  timeUp,
  startQuestion,
}) {
  const [qn, setQn] = useState(1);
  const [timerStarted, setTimerStarted] = useState(false);
  const handleClickBack = async (event) => {
    await nextQuestion(qn - 2);
    setQn(qn - 1);
    setTimerStarted(false);
  };
  const handleClickNext = async (event) => {
    await nextQuestion(qn);
    setQn(qn + 1);
    setTimerStarted(false);
  };
  const handleChange = async (event, newValue) => {
    await nextQuestion(newValue.props.value - 1);
    setQn(newValue.props.value);
    setTimerStarted(false);
  };

  const startTimer = () => {
    setTimerStarted(true);
    startQuestion();
  };

  const qnArr = [...Array(questionNumber).keys()];

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
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <IconButton onClick={handleClickBack} size="medium" sx={{ ml: 2 }}>
          <ArrowBackIosNewIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <Grid item xs={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question</InputLabel>
            <Select
              variant="outlined"
              value={qn}
              label="Question"
              onChange={handleChange}
            >
              {qnArr.map((q) => (
                <MenuItem key={q + 1} value={q + 1}>
                  <h2>
                    {q + 1}/{questionNumber}
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
        <h3>{question.question_text}</h3>
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
        {timerStarted ? (
          <Timer setTimerStarted={setTimerStarted} timeUp={timeUp} />
        ) : (
          <Button
            sx={{ width: 860, height: 115, margin: 0 }}
            variant="outlined"
            onClick={startTimer}
          >
            Start timer
          </Button>
        )}
      </Paper>
    </Paper>
  );
}
