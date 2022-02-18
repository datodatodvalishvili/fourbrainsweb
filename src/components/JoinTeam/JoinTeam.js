import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useCurrentUser } from "../../context/UserContext";

async function JoinTeamAPI(teamID, setTeam, token, player_id) {
  FourBrainsAPI.post(
    "4brains/team/player/membership/update",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
    {
      team_id: teamID,
      player_id: player_id,
      new_status: "inv",
    }
  )
    .then(function (response) {
      // handle success
      if (response.data.token) {
        setTeam();
      } else {
        alert("Server error");
        setTeam();
      }
    })
    .catch(function (error) {
      setTeam();
    });
}

export default function JoinTeam({ setTeam, token }) {
  const { currentUser } = useCurrentUser();
  const [teamID, setTeamID] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    JoinTeamAPI(teamID, setTeam, token, currentUser.id);
  };
  return (
    <div className="auth-inner">
      <Stack spacing={2}>
        <h1>Join team</h1>
        <TextField
          id="outlined-teamID"
          label="Team ID"
          value={teamID}
          onChange={(event) => {
            setTeamID(event.target.value);
          }}
        />
        <Button variant="contained" color="info" onClick={handleSubmit}>
          Join team
        </Button>
      </Stack>
    </div>
  );
}
