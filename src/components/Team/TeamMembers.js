import React from "react";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import IconButton from "@mui/material/IconButton";
import { TransitionGroup } from "react-transition-group";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Invitation from "./Invitation";
import { Typography } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import HourglassFullIcon from "@mui/icons-material/HourglassFull";
import { updateMemberStatus } from "../../state/teamsSlice";
import { useDispatch } from "react-redux";
import { useCurrentUser } from "../../context/UserContext";

export default function TeamMembers({ team }) {
  const dispach = useDispatch();
  const { currentUser } = useCurrentUser();
  const removeTeamMember = (id) => {
    dispach(
      updateMemberStatus({
        token: currentUser.token,
        player_id: id,
        team_id: team.id,
        status: "del",
      })
    );
  };

  const acceptTeamMember = (id) => {
    dispach(
      updateMemberStatus({
        token: currentUser.token,
        player_id: id,
        team_id: team.id,
        status: "mmb",
      })
    );
  };

  //if (currentMemberType === "inv") return <div></div>;
  return (
    <div>
      <TransitionGroup
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="ul"
      >
        {team.members_data &&
          team.members_data
            .filter((member) => member.status !== "del")
            .map((member) => (
              <Collapse key={member.player_id}>
                <ListItem
                  key={member.player_id}
                  disableGutters
                  secondaryAction={
                    <>
                      {team.membership === "mng" && member.status === "mmb" && (
                        <Tooltip title="Kick user">
                          <IconButton
                            onClick={() => removeTeamMember(member.player_id)}
                          >
                            <ClearIcon color="error" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {member.status === "inv" && (
                        <Tooltip title="Invitation sent">
                          <HourglassFullIcon />
                        </Tooltip>
                      )}
                      {member.status === "req" && (
                        <>
                          <Tooltip title="Request sent">
                            <HourglassFullIcon />
                          </Tooltip>
                          {team.membership === "mng" && (
                            <>
                              <Tooltip title="Accept request">
                                <IconButton
                                  onClick={() =>
                                    acceptTeamMember(member.player_id)
                                  }
                                >
                                  <CheckIcon color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Decline request">
                                <IconButton
                                  onClick={() =>
                                    removeTeamMember(member.player_id)
                                  }
                                >
                                  <ClearIcon color="error" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                        </>
                      )}
                      {member.status === "mng" && (
                        <Tooltip title="Team manager">
                          <VerifiedUserIcon />
                        </Tooltip>
                      )}
                      {member.status === "mmb" && (
                        <Tooltip title="Team member">
                          <PersonIcon />
                        </Tooltip>
                      )}
                    </>
                  }
                >
                  <ListItemAvatar>
                    <Avatar></Avatar>
                  </ListItemAvatar>
                  {member.player_id == currentUser.id ? (
                    <ListItemText
                      primary={
                        <Typography variant="h5">
                          {member.player_username}
                        </Typography>
                      }
                    />
                  ) : (
                    <ListItemText
                      primary={
                        <Typography>{member.player_username}</Typography>
                      }
                    />
                  )}
                </ListItem>
              </Collapse>
            ))}
        {team.membership === "mng" && <Invitation team={team} />}
      </TransitionGroup>
    </div>
  );
}
