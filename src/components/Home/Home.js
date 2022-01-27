import React, { useState, useEffect } from "react";
import CreateTeam from "../CreateTeam/CreateTeam";
import JoinTeam from "../JoinTeam/JoinTeam";
import Team from "../Team/Team";
import Loading from "../Loading/Loading";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import Grid from "@mui/material/Grid";

async function GetTeam(token, setTeams, setIsLoading) {
  FourBrainsAPI.get("4brains/user/teams/get/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then(function (response) {
      // handle success
      if (response.data.success) {
        if (response.data.teams[0]) {
          setTeams(response.data.teams);
          setIsLoading(false);
        } else {
          setTeams(null);
          setIsLoading(false);
        }
      } else {
        setTeams(null);
        setIsLoading(false);
      }
    })
    .catch(function (error) {
      setTeams(null);
      setIsLoading(false);
    });
}

export default function Home({ token }) {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTeamsAPI();
    //eslint-disable-next-line
  }, []);
  const setTeamsAPI = async () => {
    await GetTeam(token, setTeams, setIsLoading);
  };
  const leaveTeam = (id) => {
    setTeams(teams.filter((team) => team.id !== id));
    console.log(id);
  };

  if (isLoading) return <Loading />;
  if (!teams)
    return (
      <div className="auth-wrapper d-flex flex-row">
        <CreateTeam setTeam={setTeamsAPI} token={token} />
        <JoinTeam setTeam={setTeamsAPI} token={token} />
      </div>
    );
  else {
    const listTeams = teams.map((team) => (
      <Grid item xs={4}>
        <Team team={team} leaveTeam={leaveTeam} />
      </Grid>
    ));
    return (
      <Grid container spacing={2}>
        {listTeams}
      </Grid>
    );
  }
}
