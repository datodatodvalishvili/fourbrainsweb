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
import { getTeams, selectTeams, selectIsLoading } from "../../state/teamsSlice";
import { useDispatch, useSelector } from "react-redux";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Home({ token }) {
  const dispach = useDispatch();
  const [selectedTeamID, setSelectedTeamID] = useState(0);
  const teams = useSelector(selectTeams);
  const isLoading = useSelector(selectIsLoading);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispach(getTeams(token));
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
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
          console.log(response.data);
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
        <CreateTeam token={token} />
        <JoinTeam token={token} />
      </div>
    );
  else {
    const listTeams = teams
      .filter((team) => team.membership !== "del")
      .map((team) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
          <Team team={{ ...team }} setSelectedTeamID={setSelectedTeamID} />
        </Grid>
      ));
    return (
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <CreateTeam />
            <JoinTeam />
          </Grid>
          {listTeams}
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
