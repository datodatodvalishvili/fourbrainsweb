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

export const inviteToTeam = createAsyncThunk(
  "teams/inviteToTeam",
  async (data) => {
    let teamMember = null;
    await FourBrainsAPI.post(
      "4brains/team/player/membership/update/",
      {
        team_id: data.team_id,
        player_id: data.player_id,
        new_status: "inv",
      },
      {
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }
    )
      .then(function (response) {
        if (response.data.success) {
          teamMember = data;
        } else {
          teamMember = null;
        }
      })
      .catch(function (error) {
        teamMember = null;
      });
    return teamMember;
  }
);

export const updateMemberStatus = createAsyncThunk(
  "teams/updateMemberStatus",

  async (data) => {
    let teamMember = null;
    await FourBrainsAPI.post(
      "4brains/team/player/membership/update/",
      {
        team_id: data.team_id,
        player_id: data.player_id,
        new_status: data.status,
      },
      {
        headers: {
          Authorization: `Token ${data.token}`,
        },
      }
    )
      .then(function (response) {
        if (response.data.success) {
          teamMember = data;
        } else {
          teamMember = null;
        }
      })
      .catch(function (error) {
        console.log(error.data);
        teamMember = null;
      });
    return teamMember;
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
        const objIndex = state.teams.findIndex(
          (obj) => obj.id == action.payload.id
        );
        state.teams[objIndex] = action.payload;
      })
      .addCase(getTeamDetails.rejected, (state, action) => {
        state.isLoading = false;
        const objIndex = state.teams.findIndex(
          (obj) => obj.id == action.payload.id
        );
        state.teams[objIndex] = null;
      })
      .addCase(inviteToTeam.fulfilled, (state, action) => {
        const objIndex = state.teams.findIndex(
          (obj) => obj.id == action.payload.team_id
        );
        state.teams[objIndex].members_data.push(action.payload);
      })
      .addCase(inviteToTeam.rejected, (state, action) => {
      })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        const objIndex = state.teams.findIndex(
          (obj) => obj.id == action.payload.team_id
        );
        const memberIndex = state.teams[objIndex].members_data.findIndex(
          (obj) => obj.player_id == action.payload.player_id
        );
        state.teams[objIndex].members_data[memberIndex].status =
          action.payload.status;
        if (action.payload.updateCurUser === true)
          state.teams[objIndex].membership = action.payload.status;
      })
      .addCase(updateMemberStatus.rejected, (state, action) => {
      });
  },
});

export const selectTeams = (state) => state.teams.teams;
export const selectIsLoading = (state) => state.teams.isLoading;

export default teamsSlice.reducer;
