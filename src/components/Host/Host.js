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
import Stack from "@mui/material/Stack";

export default function Host({ token }) {
  const [battleID, setBattleID] = useState(0);
  const [correctAnswersArray, setCorrectAnswersArray] = useState([]);
  const [answers, loading, error] = useObject(
    ref(db, `4brains/battle/${battleID}/answers`)
  );
  const [battleStarted, setBattleStarted] = useState(false);
  const [qn, setQn] = useState(1);
  const [qnAnswers, setQnAnswers] = useState(1);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answerCheckDisasbled, setAnswerCheckDisasbled] = useState(true);
  const [question, setQuestion] = useState({
    qn: 0,
    id: 0,
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
      id: "",
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
        if (ansOb.is_correct !== true && ansOb.is_correct !== false) {
          submitCheckAnswer(ansOb);
        }
      }

      ansArray.sort(compare);
      setAnswerArray(ansArray);
    }
  }, [answers]);

  async function submitAnswer(IsCorrect, answerOb) {
    console.log(answerOb);
    FourBrainsAPI.post(
      "4brains/battle/team/question/answer/submit/",
      {
        battle_id: battleID,
        question_id: answerOb.id,
        team_id: answerOb.teamId,
        answer_time: answerOb.answer_time / 1000,
        answer_text: answerOb.answer,
        decision: IsCorrect ? 1 : 0,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }

  async function submitCheckAnswer(answerOb) {
    FourBrainsAPI.post(
      "4brains/battle/team/question/answer/submit&check/",
      {
        battle_id: battleID,
        question_id: answerOb.id,
        team_id: answerOb.teamId,
        answer_time: answerOb.answer_time / 1000,
        answer_text: answerOb.answer,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
      .then(function (response) {
        const IsCorrect = response.data.closest_levenshtein_score === 0;
        if (IsCorrect) {
          const updates = {};
          updates[
            `4brains/battle/${battleID}/answers/${answerOb.teamId}_${answerOb.qn}/is_correct`
          ] = IsCorrect;
          update(ref(db), updates);
        }
      })
      .catch(function (error) {
        console.log(error.response.data);
      });
  }
  async function setIsCorrect(IsCorrect, answerOb) {
    const updates = {};
    updates[
      `4brains/battle/${battleID}/answers/${answerOb.teamId}_${answerOb.qn}/is_correct`
    ] = IsCorrect;

    submitAnswer(IsCorrect, answerOb);

    update(ref(db), updates);
  }

  const startBattle = () => {
    console.log("Battle Start!");
    getBattleDetails();
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
            const tempArray = correctAnswersArray.slice(0);
            tempArray[qn + 1] = response.data.question_data.answers;
            setCorrectAnswersArray(tempArray);
            setQuestion(response.data.question_data);
            setAnswerCheckDisasbled(true);
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
            setQn(response.data.battle.n_current_question);
            setQnAnswers(response.data.battle.n_current_qanswers);
            nextQuestion(response.data.battle.n_current_question - 1);
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
    updates[`4brains/battle/${battleID}/curq/answer`] = question.answers;

    update(ref(db), updates);
  }

  function startQuestion() {
    setAnswerCheckDisasbled(false);
    const updates = {};
    updates[`4brains/battle/${battleID}/curq/start_time`] = Date.now();
    updates[`4brains/battle/${battleID}/curq/is_active`] = true;

    update(ref(db), updates);
  }

  if (!battleStarted)
    return (
      <div className="auth-inner">
        <Stack spacing={2}>
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
          <Button
            variant="contained"
            color="info"
            onClick={() => startBattle()}
          >
            Start Battle
          </Button>
        </Stack>
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
            qn={qn}
            setQn={setQn}
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
          <PlayerAnswersBox
            questionNumber={questionNumber}
            answerArray={answerArray}
            setIsCorrect={setIsCorrect}
            correctAnswersArray={correctAnswersArray}
            qnAnswers={qnAnswers}
            setQnAnswers={setQnAnswers}
            answerCheckDisasbled={answerCheckDisasbled}
          />
        </Grid>
      </Grid>
    );
}
