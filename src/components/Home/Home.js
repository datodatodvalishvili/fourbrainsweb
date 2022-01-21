import React, { useState, useEffect } from "react";
import CreateTeam from "../CreateTeam/CreateTeam";
import JoinTeam from "../JoinTeam/JoinTeam";
import FourBrainsAPI from "../../axios/FourBrainsAPI";

async function GetTeam(token, setTeam, setIsLoading) {
  FourBrainsAPI.get("4brains/user/teams/get/", {
    headers: {
      Authorization: `Token ${token}`,
    },
  })
    .then(function (response) {
      // handle success
      if (response.data.success) {
        if (response.data.teams[0]) {
          setTeam(response.data.teams[0]);
          setIsLoading(false);
        } else {
          setTeam(null);
          setIsLoading(false);
        }
      } else {
        setTeam(null);
        setIsLoading(false);
      }
    })
    .catch(function (error) {
      setTeam(null);
      setIsLoading(false);
    });
}

export default function Home({ token }) {
  const [team, setTeam] = useState();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTeamsAPI();
  }, []);
  const setTeamsAPI = async () => {
    await GetTeam(token, setTeam, setIsLoading);
  };
  if (isLoading) return <></>;
  if (!team)
    return (
      <div className="auth-wrapper d-flex flex-row">
        <CreateTeam setTeam={setTeamsAPI} token={token} />
        <JoinTeam setTeam={setTeamsAPI} token={token} />
      </div>
    );
  else
    return (
      <div className="team-inner">
        <h1>Your team</h1>
        <p>Team ID: {team.id} </p>
        <p>Team name: {team.name} </p>
      </div>
    );
}
