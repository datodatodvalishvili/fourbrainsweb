import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { useCurrentUser } from "../../context/UserContext";
async function CreateTeamAPI(teamName, token) {
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
      } else {
        alert("Server error");
      }
    })
    .catch(function (error) {});
}

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const { currentUser } = useCurrentUser();
  const handleSubmit = async (e) => {
    e.preventDefault();
    CreateTeamAPI(teamName, currentUser.token);
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
