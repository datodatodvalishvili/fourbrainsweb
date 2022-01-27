import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import QuestionBox from "../QuestionBox/QuestionBox";
import AnswerBox from "../AnswerBox/AnswerBox";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

export default function Host({ token }) {
  const [battleStarted, setBattleStarted] = useState(false);
  const [battleID, setBattleID] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [correctAnswersArray, setCorrectAnswersArray] = useState([]);
  const [gameState, setGameState] = useState(0);
  const [question, setQuestion] = useState({
    qn: 0,
    question_text: "",
    answer: "",
    source: "",
    comment: "",
  });

  const startBattle = () => {
    console.log("Battle Start!");
    getBattleDetails();
    nextQuestion(0);
  };

  const nextQuestion = async (qn) => {
    try {
      console.log(token);
      FourBrainsAPI.get(`4brains/battle/${battleID}/question/${qn + 1}`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(function (response) {
          // handle success
          if (response.data.question_data) {
            setCorrectAnswersArray([
              ...correctAnswersArray,
              response.data.question_data.answer,
            ]);
            setGameState(1);
            setQuestion(response.data.question_data);
          } else alert("Server error");
        })
        .catch(function (error) {
          console.error(error.response.data);
          alert(error.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const getBattleDetails = async () => {
    try {
      console.log(token);
      FourBrainsAPI.get(`4brains/battle/${battleID}/details/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(function (response) {
          // handle success
          if (response.data.battle) {
            setQuestionNumber(response.data.battle.n_questions);
            setBattleStarted(true);
          } else alert("Server error");
        })
        .catch(function (error) {
          console.error(error.response.data);
          alert(error.message);
        });
    } catch (error) {
      console.error(error);
    }
  };

  if (!battleStarted)
    return (
      <div className="auth-inner">
        <h1>Enter battle ID</h1>
        <TextField
          id="outlined-number"
          label="Battle ID"
          type="number"
          value={battleID}
          onChange={(event) => {
            setBattleID(event.target.value);
          }}
        />
        <Button variant="contained" color="info" onClick={() => startBattle()}>
          Start Battle
        </Button>
      </div>
    );
  else
    return (
      <Grid container spacing={{ xs: 0, md: 0 }}>
        <Grid
          item
          xs={6}
          sx={{
            height: 500,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <QuestionBox
            question={question}
            nextQuestion={nextQuestion}
            questionNumber={questionNumber}
          />
        </Grid>
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 500,
          }}
        >
          <AnswerBox question={question} />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "column",
            height: 460,
          }}
        >
          <Paper
            elevation={5}
            sx={{
              margin: 1,
              flexGrow: 1,
              minHeight: 0,
            }}
          />
        </Grid>
      </Grid>
    );
}
