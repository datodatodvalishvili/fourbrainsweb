import React, {  } from "react";
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

export default function PlayerAnswersBox({
  questionNumber,
  answerArray,
  setIsCorrect,
  correctAnswersArray,
  qnAnswers,
  setQnAnswers,
  answerCheckDisasbled,
}) {
  const handleClickBack = async (event) => {
    setQnAnswers(qnAnswers - 1);
  };
  const handleClickNext = async (event) => {
    setQnAnswers(qnAnswers + 1);
  };
  const handleChange = async (event, newValue) => {
    setQnAnswers(newValue.props.value);
  };

  const handleClickAllTrue = async (event) => {
    for (const answer of answerArray) {
      if (
        (answer.is_correct !== true) &
        (answer.is_correct !== false) &
        (answer.qn === qnAnswers)
      ) {
        setIsCorrect(true, answer);
      }
    }
  };
  const handleClickAllFalse = async (event) => {
    for (const answer of answerArray) {
      if (
        (answer.is_correct !== true) &
        (answer.is_correct !== false) &
        (answer.qn === qnAnswers)
      ) {
        setIsCorrect(false, answer);
      }
    }
  };

  const qnArr = [...Array(questionNumber).keys()];

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
          disabled={answerCheckDisasbled}
        >
          <ArrowBackIosNewIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <Grid item xs={1}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question</InputLabel>
            <Select
              variant="outlined"
              value={qnAnswers}
              label="Question"
              onChange={handleChange}
              disabled={answerCheckDisasbled}
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
        <IconButton
          onClick={handleClickNext}
          size="medium"
          sx={{ ml: 2 }}
          disabled={answerCheckDisasbled}
        >
          <ArrowForwardIosIcon sx={{ width: 40, height: 40 }} />
        </IconButton>
        <div className="correct-answer-text">
          {correctAnswersArray[qnAnswers]}
        </div>
        <Button
          variant="outlined"
          onClick={handleClickAllTrue}
          size="medium"
          sx={{ ml: 1 }}
          disabled={answerCheckDisasbled}
        >
          Mark remaining correct
        </Button>
        <Button
          variant="outlined"
          onClick={handleClickAllFalse}
          size="medium"
          sx={{ ml: 2 }}
          disabled={answerCheckDisasbled}
        >
          Mark remaining false
        </Button>
      </Grid>
      <Grid container sx={{ marginLeft: 4 }} spacing={{ xs: 2, md: 0 }}>
        {answerArray
          .filter((answer) => answer.qn === qnAnswers)
          .map((answer) => (
            <PlayerAnswer
              key={answer.teamId + answer.qn}
              answer={answer}
              setIsCorrect={setIsCorrect}
              answerCheckDisasbled={answerCheckDisasbled}
            />
          ))}
      </Grid>
    </Paper>
  );
}
