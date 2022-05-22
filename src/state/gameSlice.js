import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FourBrainsAPI from "../axios/FourBrainsAPI";

const initialState = {
  battleID: 0,
  correctAnswersArray: [],
  battleStarted: false,
  qn: 1,
  qnAnswers: 1,
  questionNumber: 0,
  answerCheckDisasbled: true,
  question: {
    qn: 0,
    id: 0,
    question_text: "",
    answer: "",
    source: "",
    comment: "",
  },
  questionAnswers: {
    qn: 0,
    id: 0,
    question_text: "",
    answer: "",
    source: "",
    comment: "",
  },
  answerArray: [
    {
      answer: "",
      answer_time: "",
      teamId: "",
      qn: "",
      id: "",
      correctAnswer: "",
    },
  ],
};

export const nextQuestion = createAsyncThunk(
  "game/nextQuestion",
  async (data, { getState }) => {
    let respObj = null;
    const state = getState();
    try {
      await FourBrainsAPI.get(
        `4brains/battle/${state.game.battleID}/question/${data.qn + 1}/mode/1`,
        {
          headers: { Authorization: `Token ${data.token}` },
        }
      )
        .then(function (response) {
          // handle success
          if (response.data.question_data) {
            const tempArray = state.game.correctAnswersArray.slice(0);
            tempArray[data.qn + 1] = response.data.question_data.answers;
            respObj = {
              correctAnswersArray: tempArray,
              question: response.data.question_data,
              answerCheckDisasbled: true,
              qnAnswers:
                response.data.question_data.qn === 1
                  ? 1
                  : response.data.question_data.qn - 1,
            };
          }
        })
        .catch(function (error) {
          console.error(error.response.data);
        });
    } catch (error) {
      console.error(error);
    }
    return respObj;
  }
);

export const nextQuestionAnswers = createAsyncThunk(
  "game/nextQuestionAnswers",
  async (data, { getState }) => {
    let respObj = null;
    const state = getState();
    try {
      await FourBrainsAPI.get(
        `4brains/battle/${state.game.battleID}/question/${data.qn + 1}/mode/2`,
        {
          headers: { Authorization: `Token ${data.token}` },
        }
      )
        .then(function (response) {
          // handle success
          if (response.data.question_data) {
            respObj = {
              questionAnswers: response.data.question_data,
            };
          }
        })
        .catch(function (error) {
          console.error(error.response.data);
        });
    } catch (error) {
      console.error(error);
    }
    return respObj;
  }
);

export const getBattleDetails = createAsyncThunk(
  "game/getBattleDetails",
  async (data, { getState }) => {
    let respObj = null;
    const state = getState();
    try {
      await FourBrainsAPI.get(`4brains/battle/${state.game.battleID}/teams/`, {
        headers: { Authorization: `Token ${data.token}` },
      })
        .then(function (response) {
          if (response.data.battle) {
            respObj = {
              questionNumber: response.data.battle.n_questions,
              battleStarted: true,
              qn: !response.data.battle.n_current_question
                ? 1
                : response.data.battle.n_current_question,
              qnAnswers: response.data.battle.n_current_qanswers,
            };
          }
        })
        .catch(function (error) {
          console.error(error.response.data);
        });
    } catch (error) {
      console.error(error);
    }
    return respObj;
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setQn(state, action) {
      state.qn = action.payload;
    },
    setQnAnswers(state, action) {
      state.qnAnswers = action.payload;
    },

    setAnswerArray(state, action) {
      state.answerArray = action.payload;
    },
    setBattleID(state, action) {
      state.battleID = action.payload;
    },
    setAnswerCheckDisasbled(state, action) {
      state.answerCheckDisasbled = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(nextQuestion.fulfilled, (state, action) => {
        state.correctAnswersArray = action.payload.correctAnswersArray;
        state.question = action.payload.question;
        state.answerCheckDisasbled = action.payload.answerCheckDisasbled;
        state.qnAnswers = action.payload.qnAnswers;
      })
      .addCase(nextQuestionAnswers.fulfilled, (state, action) => {
        console.log(action.payload);
        state.questionAnswers = action.payload.questionAnswers;
        state.qnAnswers = action.payload.questionAnswers.qn;
      })
      .addCase(getBattleDetails.fulfilled, (state, action) => {
        state.questionNumber = action.payload.questionNumber;
        state.battleStarted = action.payload.battleStarted;
        state.qn = action.payload.qn;
        state.qnAnswers = action.payload.qnAnswers;
      });
  },
});

export const selectGameState = (state) => state.game;
export const selectBattleStarted = (state) => state.game.battleStarted;

export default gameSlice.reducer;

export const {
  setAnswerArray,
  setAnswerCheckDisasbled,
  setBattleID,
  setQn,
  setQnAnswers,
} = gameSlice.actions;
