import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import IconButton from "@mui/material/IconButton";

export default function PlayerAnswersBox({ questionNumber }) {
  const [qn, setQn] = useState(1);
  const [timerStarted, setTimerStarted] = useState(false);
  const handleClickBack = async (event) => {
    setQn(qn - 1);
  };
  const handleClickNext = async (event) => {
    setQn(qn + 1);
  };
  const handleChange = async (event, newValue) => {
    setQn(newValue.props.value);
  };

  const qnArr = [...Array(questionNumber).keys()];

  return (
    <Paper
      elevation={5}
      sx={{
        margin: 1,
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
        elevation={5}
        sx={{
          margin: 1,
          flexGrow: 1,
          minHeight: 0,
        }}
      ></Paper>
    </Paper>
  );
}
