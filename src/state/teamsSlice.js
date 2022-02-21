import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FourBrainsAPI from "../axios/FourBrainsAPI";

const initialState = {
  teams: [],
  isLoading: true,
};

export const getTeamDetails = createAsyncThunk(
  "teams/getTeamDetails",
  async (data) => {
    let teamDetails = null;
    await FourBrainsAPI.get(`4brains/team/${data.id}/info/`, {
      headers: {
        Authorization: `Token ${data.token}`,
      },
    })
      .then(function (response) {
        // handle success
        if (response.data.success) {
          if (response.data.members_data[0]) {
            console.log({
              ...data,
              members_data: response.data.members_data,
            });
            teamDetails = {
              ...data,
              members_data: response.data.members_data,
            };
          } else {
            teamDetails = {
              ...data,
              members_data: null,
            };
          }
        } else {
          teamDetails = {
            ...data,
            members_data: null,
          };
        }
      })
      .catch(function (error) {
        teamDetails = {
          ...data,
          members_data: null,
        };
      });
    return teamDetails;
  }
);

export const getTeams = createAsyncThunk(
  "teams/getTeams",
  async (token, setErrorMsg) => {
    let teams = null;
    await FourBrainsAPI.get("4brains/user/teams/get/", {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(function (response) {
        // handle success
        if (response.data.success) {
          if (response.data.teams[0]) {
            teams = response.data.teams;
          } else {
            teams = null;
          }
        } else {
          teams = null;
        }
      })
      .catch(function (error) {
        teams = null;
      });
    return teams;
  }
);

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setGameState(state, action) {
      state.teams = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getTeams.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getTeams.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams = action.payload;
      })
      .addCase(getTeams.rejected, (state, action) => {
        state.isLoading = false;
        state.teams = null;
      })
      .addCase(getTeamDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getTeamDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.teams[action.payload.index] = action.payload;
      })
      .addCase(getTeamDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.teams[action.payload.index] = null;
      });
  },
});

export const selectTeams = (state) => state.teams.teams;
export const selectIsLoading = (state) => state.teams.isLoading;

export default teamsSlice.reducer;
