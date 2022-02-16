import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
async function CreateTeamAPI(teamName, setTeam, token) {
  FourBrainsAPI.post(
    "4brains/team/create/",
    {
      name: teamName,
      about: "",
      represents_country: "GE",
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

export default function CreateTeam({ setTeam, token }) {
  const [teamName, setTeamName] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    CreateTeamAPI(teamName, setTeam, token);
    setTeamName("");
  };
  return (
    <div className="team-inner">
      <Stack spacing={2}>
        <h1>Create team</h1>
        <TextField
          id="outlined-teamName"
          label="Team name"
          value={teamName}
          onChange={(event) => {
            setTeamName(event.target.value);
          }}
        />
        <Button variant="contained" color="info" onClick={handleSubmit}>
          Create team
        </Button>
      </Stack>
    </div>
  );
}
