import React, { useState, useEffect } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useCurrentUser } from "../../context/UserContext";
import { updateMemberStatus } from "../../state/teamsSlice";
import { useDispatch } from "react-redux";
import Loading from "../Loading/Loading";

export default function JoinTeam() {
  const { currentUser } = useCurrentUser();
  const [teamID, setTeamID] = useState("");
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [team, setTeam] = useState();
  const [isLoading, setIsLoading] = useState();
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    setErrorText("");
    setTeam(null);
    if (teamID) {
      const delayInput = setTimeout(() => {
        setIsLoading(true);
        try {
          FourBrainsAPI.get(`4brains/team/${teamID}/mininfo/`, {
            headers: { Authorization: `Token ${currentUser.token}` },
          })
            .then(function (response) {
              if (response.data.success) {
                setTeam(response.data.team_data);
              } else {
                setErrorText("Team not found!");
              }
            })
            .catch(function (error) {
              setErrorText("Team not found!");
            });
        } catch (error) {
          setErrorText("Team not found!");
        }
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(delayInput);
    }
  }, [teamID]);

  const handleClickOpen = () => {
    setTeamID("");
    setOpen(true);
  };

  const sendRequest = () => {
    dispatch(
      updateMemberStatus({
        token: currentUser.token,
        player_id: currentUser.id,
        team_id: team.id,
        status: "req",
      })
    );
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div className="auth-inner">
      <Stack spacing={2}>
        <h1>Join team</h1>
        <Button variant="contained" color="info" onClick={handleClickOpen}>
          Join team
        </Button>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Send request</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Team ID/Name"
                type="text"
                fullWidth
                variant="standard"
                value={teamID}
                error={errorText !== ""}
                helperText={errorText}
                onChange={(event) => {
                  setTeamID(event.target.value);
                }}
              />
              {isLoading && <Loading />}
              {team && (
                <Grid container spacing={0}>
                  <Grid item xs={12}>
                    <Avatar>{team.name.charAt(0)}</Avatar>
                  </Grid>
                  <Grid item xs={12}>
                    <div>ID: {team.id}</div>
                  </Grid>
                  <Grid item xs={12}>
                    <div>Name: {team.name}</div>
                  </Grid>
                  <Grid item xs={12}>
                    <div>Manager: {team.manager}</div>
                  </Grid>
                </Grid>
              )}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button disabled={!team} onClick={sendRequest}>
              Send
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </div>
  );
}
