import React, { useState, useEffect } from "react";
import CreateTeam from "../CreateTeam/CreateTeam";
import JoinTeam from "../JoinTeam/JoinTeam";
import BattlePick from "../Battle/BattlePick";
import Team from "../Team/Team";
import Loading from "../Loading/Loading";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import Grid from "@mui/material/Grid";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

async function GetTeam(token, setTeams, setIsLoading) {
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
          setIsLoading(false);
        }
      } else {
        teams = null;
        setIsLoading(false);
      }
    })
    .catch(function (error) {
      teams = null;
      setIsLoading(false);
    });
  if (teams) {
    teams = await GetTeamDetails(token, teams, setIsLoading);
  }

  setTeams(teams);
}

async function GetTeamDetails(token, teams, setIsLoading) {
  await teams.forEach(function (arrayItem, idx, array) {
    FourBrainsAPI.get(`4brains/team/${arrayItem.id}/info/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then(function (response) {
        // handle success
        if (response.data.success) {
          if (response.data.members_data[0]) {
            arrayItem.members_data = response.data.members_data;
          } else {
            arrayItem.members_data = null;
          }
        } else {
          arrayItem.members_data = null;
        }
        if (idx === array.length - 1) {
          setIsLoading(false);
        }
      })
      .catch(function (error) {
        arrayItem.members_data = null;
        if (idx === array.length - 1) {
          setIsLoading(false);
        }
      });
  });
  return teams;
}

export default function Home({ token }) {
  const [selectedTeamID, setSelectedTeamID] = useState(0);
  const [teams, setTeams] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTeamsAPI();
  }, []);
  const setTeamsAPI = async () => {
    await GetTeam(token, setTeams, setIsLoading);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const leaveTeam = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
  };
  const joinBattleAPI = async (battle_id) => {
    FourBrainsAPI.post(
      "4brains/battle/team/join/",
      {
        battle_id: battle_id,
        team_id: selectedTeamID,
        battle_code: "0000",
      },
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then(function (response) {
        // handle success
        if (response.data.success) {
          setSelectedTeamID(0);
          setOpen(true);
        } else {
        }
      })
      .catch(function (error) {
        console.log(error.data);
      });
  };
  const joinBattle = (id) => {
    joinBattleAPI(id);
  };

  if (isLoading) return <Loading />;
  if (selectedTeamID) {
    return (
      <BattlePick
        token={token}
        teamID={selectedTeamID}
        joinBattle={joinBattle}
      />
    );
  }
  if (!teams)
    return (
      <div className="auth-wrapper d-flex flex-row">
        <CreateTeam setTeam={setTeamsAPI} token={token} />
        <JoinTeam setTeam={setTeamsAPI} token={token} />
      </div>
    );
  else {
    const listTeams = teams.map((team) => (
      <Grid item xs={4} key={team.id}>
        <Team
          team={team}
          leaveTeam={leaveTeam}
          setSelectedTeamID={setSelectedTeamID}
          team={team}
        />
      </Grid>
    ));
    return (
      <div>
        <Grid container spacing={2}>
          {listTeams}
          <Grid item xs={4}>
            <CreateTeam setTeam={setTeamsAPI} token={token} />
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Battle joined successfully!
          </Alert>
        </Snackbar>
      </div>
    );
  }
}
