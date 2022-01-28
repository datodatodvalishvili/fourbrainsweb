import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import QuestionBox from "../QuestionBox/QuestionBox";
import AnswerBox from "../AnswerBox/AnswerBox";
import PlayerAnswersBox from "../PlayerAnswersBox/PlayerAnswersBox";
import Grid from "@mui/material/Grid";
import { ref, update } from "firebase/database";
import db from "../FireBase/FireBaseConfig";
import { useObject } from "react-firebase-hooks/database";

export default function Host({ token }) {
  const [battleID, setBattleID] = useState(0);
  const [correctAnswersArray, setCorrectAnswersArray] = useState([]);
  const [answers, loading, error] = useObject(
    ref(db, `4brains/battle/${battleID}/answers`)
  );
  const [battleStarted, setBattleStarted] = useState(false);

  const [questionNumber, setQuestionNumber] = useState(0);
  const [gameState, setGameState] = useState(0);
  const [question, setQuestion] = useState({
    qn: 0,
    question_text: "",
    answer: "",
    source: "",
    comment: "",
  });
  const [answerArray, setAnswerArray] = useState([
    {
      answer: "",
      answer_time: "",
      teamId: "",
      qn: "",
      correctAnswer: "",
    },
  ]);

  useEffect(() => {
    function compare(a, b) {
      if (a.qn < b.qn) {
        return -1;
      }
      if (a.qn > b.qn) {
        return 1;
      }
      if (a.answer_time < b.answer_time) {
        return -1;
      }
      if (a.answer_time > b.answer_time) {
        return 1;
      }
      return 0;
    }
    if (!loading) {
      let ansArray = [];
      for (const key in answers.val()) {
        let ansOb = answers.val()[key];
        ansArray.push(ansOb);
      }

      ansArray.sort(compare);
      setAnswerArray(ansArray);
    }
  }, [answers]);

  async function setIsCorrect(IsCorrect, answerId) {
    const updates = {};
    updates[
      `4brains/battle/4/answers/${answerArray[answerId].teamId}_${answerArray[answerId].qn}/is_correct`
    ] = IsCorrect;

    update(ref(db), updates);
  }

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

  function timeUp() {
    const updates = {};
    updates[`4brains/battle/${battleID}/curq/answer`] = question.answer;
    updates[`4brains/battle/${battleID}/curq/is_active`] = false;

    update(ref(db), updates);
  }

  function startQuestion() {
    const updates = {};
    updates[`4brains/battle/${battleID}/curq/start_time`] = Date.now();
    updates[`4brains/battle/${battleID}/curq/is_active`] = true;

    update(ref(db), updates);
  }

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
            startQuestion={startQuestion}
            timeUp={timeUp}
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
          <PlayerAnswersBox questionNumber={questionNumber} />
        </Grid>
      </Grid>
    );
}
