import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import FourBrainsAPI from "../axios/FourBrainsAPI";

const initialState = {
  teams: [],
  isLoading: true,
};

const getTeamDetails = async (team_id, token) => {
  try {
    const response = await FourBrainsAPI.get(`4brains/team/${team_id}/info/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (response.data.success) {
      if (response.data.members_data[0]) {
        return response.data.members_data;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const getTeams = createAsyncThunk(
  "teams/getTeams",
  async (token, setErrorMsg) => {
    try {
      const response = await FourBrainsAPI.get("4brains/user/teams/get/", {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.data.success) {
        if (response.data.teams[0]) {
          const teams = response.data.teams;
          const teams_final = await Promise.all(
            teams.map(async (team) => {
              return {
                ...team,
                members_data: await getTeamDetails(team.id, token),
              };
            })
          );
          return teams_final;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);

export const inviteToTeam = createAsyncThunk(
  "teams/inviteToTeam",
  async (data) => {
    try {
      let response = await FourBrainsAPI.post(
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
      );
      if (response.data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
);

export const updateMemberStatus = createAsyncThunk(
  "teams/updateMemberStatus",

  async (data) => {
    try {
      const response = await FourBrainsAPI.post(
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
      );

      if (response.data.success) {
        return data;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
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
      .addCase(inviteToTeam.fulfilled, (state, action) => {
        const objIndex = state.teams.findIndex(
          (obj) => obj.id == action.payload.team_id
        );
        state.teams[objIndex].members_data.push(action.payload);
      })
      .addCase(inviteToTeam.rejected, (state, action) => {})
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
      .addCase(updateMemberStatus.rejected, (state, action) => {});
  },
});

export const selectTeams = (state) => state.teams.teams;
export const selectIsLoading = (state) => state.teams.isLoading;

export default teamsSlice.reducer;
