import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import TeamMembers from "./TeamMembers";
import ListItem from "@mui/material/ListItem";
import { getTeamDetails } from "../../state/teamsSlice";
import { useDispatch } from "react-redux";

export default function Team({ team, leaveTeam, setSelectedTeamID, token }) {
  const dispach = useDispatch();
  useEffect(() => {
    if (!team.members_data) {
      dispach(getTeamDetails({ ...team, token: token }));
    }
  }, []);
  return (
    <ListItem key={team.id} disableGutters>
      <div className="team-inner">
        <h1>Your team</h1>
        <p>Team ID: {team.id} </p>
        <p>Team name: {team.name} </p>
        <TeamMembers team={team} />
        <Button
          variant="outlined"
          color="error"
          onClick={() => leaveTeam(team.id)}
        >
          Leave Team
        </Button>
        <Button
          variant="outlined"
          onClick={() => setSelectedTeamID(team.id)}
          sx={{ marginLeft: 2 }}
        >
          Join battle
        </Button>
      </div>
    </ListItem>
  );
}
