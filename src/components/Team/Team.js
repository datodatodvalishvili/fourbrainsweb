import React from "react";
import Button from "@mui/material/Button";
import TeamMembers from "./TeamMembers";
import ListItem from "@mui/material/ListItem";
import { updateMemberStatus } from "../../state/teamsSlice";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "../../context/UserContext";

export default function Team({ team, setSelectedTeamID }) {
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser();

  const acceptInvite = (id) => {
    dispatch(
      updateMemberStatus({
        token: currentUser.token,
        player_id: currentUser.id,
        team_id: team.id,
        status: "mmb",
        updateCurUser: true,
      })
    );
  };
  const declineInvite = (id) => {
    dispatch(
      updateMemberStatus({
        token: currentUser.token,
        player_id: currentUser.id,
        team_id: team.id,
        status: "del",
        updateCurUser: true,
      })
    );
  };

  if (team.membership === "req") {
    return (
      <ListItem key={team.id} disableGutters>
        <div className="team-inner">
          <h1>Pending request</h1>
          <p>Team ID: {team.id} </p>
          <p>Team name: {team.name} </p>
          <TeamMembers team={team} />
        </div>
      </ListItem>
    );
  }
  if (team.membership === "inv") {
    return (
      <ListItem key={team.id} disableGutters>
        <div className="team-inner">
          <h1>Invitation</h1>
          <p>Team ID: {team.id} </p>
          <p>Team name: {team.name} </p>
          <TeamMembers team={team} />
          <Button
            variant="outlined"
            color="error"
            onClick={() => declineInvite(team.id)}
          >
            Decline
          </Button>
          <Button
            variant="outlined"
            onClick={() => acceptInvite(team.id)}
            sx={{ marginLeft: 2 }}
          >
            Accept
          </Button>
        </div>
      </ListItem>
    );
  }
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
          onClick={() => declineInvite(team.id)}
        >
          Leave Team
        </Button>
        {team.membership === "mng" && (
          <Button
            variant="outlined"
            onClick={() => setSelectedTeamID(team.id)}
            sx={{ marginLeft: 2 }}
          >
            Join battle
          </Button>
        )}
      </div>
    </ListItem>
  );
}
