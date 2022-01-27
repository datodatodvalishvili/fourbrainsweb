import React from "react";
import Button from "@mui/material/Button";
import TeamMembers from "./TeamMembers";
import ListItem from "@mui/material/ListItem";

export default function Team({ team, leaveTeam }) {
  return (
    <ListItem key={team.id} disableGutters>
      <div className="team-inner">
        <h1>Your team</h1>
        <p>Team ID: {team.id} </p>
        <p>Team name: {team.name} </p>
        <TeamMembers />
        <Button
          variant="outlined"
          color="error"
          onClick={() => leaveTeam(team.id)}
        >
          Leave Team
        </Button>
      </div>
    </ListItem>
  );
}
