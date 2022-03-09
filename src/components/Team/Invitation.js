import React, { useState, useEffect } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useCurrentUser } from "../../context/UserContext";
import Loading from "../Loading/Loading";
import { inviteToTeam } from "../../state/teamsSlice";
import { useDispatch } from "react-redux";

export default function Invitation({ team }) {
  const dispatch = useDispatch();
  const { currentUser } = useCurrentUser();
  const [playerID, setPlayerID] = useState("");

  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [player, setPlayer] = useState();
  const [errorText, setErrorText] = useState("");

  const handleClickOpen = () => {
    setPlayerID("");
    setOpen(true);
  };

  const sendInvitation = () => {
    dispatch(
      inviteToTeam({
        token: currentUser.token,
        player_id: player.id,
        player_username: player.username,
        team_id: team.id,
        status: "inv",
      })
    );
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setErrorText("");
    setPlayer(null);
    if (playerID) {
      const delayInput = setTimeout(() => {
        setIsLoading(true);
        try {
          FourBrainsAPI.get(`4brains/player/${playerID}/mininfo/`, {
            headers: { Authorization: `Token ${currentUser.token}` },
          })
            .then(function (response) {
              if (response.data.success) {
                setPlayer(response.data.player_data);
              } else {
                setErrorText("Player not found!");
              }
            })
            .catch(function (error) {
              setErrorText("Player not found!");
            });
        } catch (error) {
          setErrorText("Player not found!");
        }
        setIsLoading(false);
      }, 1500);
      return () => clearTimeout(delayInput);
    }
  }, [playerID]);

  return (
    <div>
      <ListItem autoFocus button onClick={handleClickOpen}>
        <ListItemAvatar>
          <Avatar>
            <AddIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Add member" />
      </ListItem>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Send invite</DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Player ID/Username"
              type="text"
              fullWidth
              variant="standard"
              value={playerID}
              error={errorText !== ""}
              helperText={errorText}
              onChange={(event) => {
                setPlayerID(event.target.value);
              }}
            />
            {isLoading && <Loading />}
            {player && (
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Avatar>DD</Avatar>
                </Grid>
                <Grid item xs={12}>
                  <div>ID: {player.id}</div>
                </Grid>
                <Grid item xs={12}>
                  <div>Name: {player.fullname}</div>
                </Grid>
                <Grid item xs={12}>
                  <div>Username: {player.username}</div>
                </Grid>
              </Grid>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={!player} onClick={sendInvitation}>
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
