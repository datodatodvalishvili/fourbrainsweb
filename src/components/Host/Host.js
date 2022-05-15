import React, { useEffect } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import QuestionBox from "../QuestionBox/QuestionBox";
import AnswerBox from "../AnswerBox/AnswerBox";
import PlayerAnswersBox from "../PlayerAnswersBox/PlayerAnswersBox";
import Grid from "@mui/material/Grid";
import { ref, update } from "firebase/database";
import db from "../FireBase/FireBaseConfig";
import { useObject } from "react-firebase-hooks/database";
import { useNavigate, useParams } from "react-router-dom";
import {
  setAnswerArray,
  selectGameState,
  nextQuestion,
  getBattleDetails,
  selectBattleStarted,
  setAnswerCheckDisasbled,
  setBattleID,
} from "../../state/gameSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Host({ token }) {
  const dispatch = useDispatch();
  dispatch(setBattleID(useParams().battleID));
  const battleStarted = useSelector(selectBattleStarted);
  const gameState = useSelector(selectGameState);
  const [answers, loading, error] = useObject(
    ref(db, `4brains/battle/${gameState.battleID}/answers`)
  );

  const navigate = useNavigate();

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
      dispatch(setAnswerArray(ansArray));
    }
  }, [answers]);

  useEffect(() => {
    if (battleStarted)
      dispatch(nextQuestion({ token: token, qn: gameState.qn - 1 }));
    else dispatch(getBattleDetails({ token: token }));
  }, [battleStarted]);

  async function submitAnswer(decision, answerOb) {
    FourBrainsAPI.post(
      "4brains/battle/team/question/answer/submit/",
      {
        battle_id: gameState.battleID,
        question_id: answerOb.id,
        team_id: answerOb.teamId,
        answer_time: answerOb.answer_time / 1000,
        answer_text: answerOb.answer,
        decision: decision ,//IsCorrect ? 1 : 0,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
      .then(function (response) {})
      .catch(function (error) {});
  }

  async function submitCheckAnswer(answerOb) {
    FourBrainsAPI.post(
      "4brains/battle/team/question/answer/submit&check/",
      {
        battle_id: gameState.battleID,
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
            `4brains/battle/${gameState.battleID}/answers/${answerOb.teamId}_${answerOb.qn}/is_correct`
          ] = IsCorrect;
          update(ref(db), updates);
        } else {
          submitAnswer(-1, answerOb);
        }
      })
      .catch(function (error) {});
  }
  async function setIsCorrect(IsCorrect, answerOb) {
    const updates = {};
    updates[
      `4brains/battle/${gameState.battleID}/answers/${answerOb.teamId}_${answerOb.qn}/is_correct`
    ] = IsCorrect;

    submitAnswer(IsCorrect ? 1 : 0, answerOb);

    update(ref(db), updates);
  }

  function timeUp() {
    const updates = {};
    updates[`4brains/battle/${gameState.battleID}/curq/answer`] =
      gameState.question.answers;
    if (gameState.questionNumber === gameState.qn) {
      updates[`4brains/battle/${gameState.battleID}/curq/gameOver`] = true;
      navigate(`/scoreboard/${gameState.battleID}`);
    }
    update(ref(db), updates);
  }

  function startQuestion() {
    dispatch(setAnswerCheckDisasbled(false));
    const updates = {};
    updates[`4brains/battle/${gameState.battleID}/curq/start_time`] =
      Date.now();
    updates[`4brains/battle/${gameState.battleID}/curq/is_active`] = true;

    update(ref(db), updates);
  }

  return (
    <Grid container spacing={{ xs: 0, md: 0 }}>
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
        height="100vh"
      >
        <QuestionBox
          startQuestion={startQuestion}
          timeUp={timeUp}
          token={token}
        />
        <AnswerBox />
      </Grid>
      <Grid
        height="100vh"
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <PlayerAnswersBox setIsCorrect={setIsCorrect} />
      </Grid>
    </Grid>
  );
}
