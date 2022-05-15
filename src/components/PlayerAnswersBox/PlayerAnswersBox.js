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
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
import PlayerAnswer from "./PlayerAnswer";
import Button from "@mui/material/Button";
import { selectGameState, setQnAnswers } from "../../state/gameSlice";
import { useDispatch, useSelector } from "react-redux";
import AnswerBox from "../AnswerBox/AnswerBox";

export default function PlayerAnswersBox({ setIsCorrect }) {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  const [value, setValue] = useState("1");
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };
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
        <Grid item xs={1}>
          <IconButton
            onClick={handleClickBack}
            size="medium"
            sx={{ ml: 2, marginTop: 2 }}
          >
            <ArrowBackIosNewIcon sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Grid>
        <Grid item xs={2}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Question</InputLabel>
            <Select
              variant="outlined"
              value={gameState.qnAnswers}
              label="Question"
              onChange={handleChange}
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
        <Grid item xs={1}>
          <IconButton
            onClick={handleClickNext}
            size="medium"
            sx={{ ml: 2, marginTop: 2 }}
          >
            <ArrowForwardIosIcon sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Grid>
        <Grid item xs={4}>
          <div className="correct-answer-text">
            {gameState.correctAnswersArray[gameState.qnAnswers]}
          </div>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            onClick={handleClickAllTrue}
            size="small"
            sx={{ ml: 1, marginTop: 2 }}
            disabled={gameState.answerCheckDisasbled}
          >
            Mark remaining correct
          </Button>
          <Button
            variant="outlined"
            onClick={handleClickAllFalse}
            size="small"
            sx={{ ml: 2, marginTop: 1 }}
            disabled={gameState.answerCheckDisasbled}
          >
            Mark remaining false
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChangeTab}
              aria-label="lab API tabs example"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Player answers" value="1" />
              <Tab label="Question" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
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
          </TabPanel>
          <TabPanel value="2">
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
            <AnswerBox />
          </TabPanel>
        </TabContext>
      </Box>
    </Paper>
  );
}
