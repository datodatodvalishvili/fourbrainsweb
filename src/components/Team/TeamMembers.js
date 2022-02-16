import React, { useState } from "react";
import Collapse from "@mui/material/Collapse";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import { TransitionGroup } from "react-transition-group";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

export default function TeamMembers() {
  const [teamMembers, setTeamMembers] = useState([
    "Dato Dvalishvili",
    "Sandro Tar Mouravi",
    "Giorgi Gogoladze",
  ]);

  const [playerID, setPlayerID] = useState("");

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setPlayerID("");
    setOpen(true);
  };

  const sendInvitation = () => {
    console.log(playerID);
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const removeTeamMember = (name) => {
    setTeamMembers(teamMembers.filter((member) => member !== name));
  };

  return (
    <div>
    <TransitionGroup
      sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
      component="ul"
    >
      {teamMembers.map((value) => (
        <Collapse key={value}>
          <ListItem
            key={value}
            disableGutters
            secondaryAction={
              <IconButton onClick={() => removeTeamMember(value)}>
                <ClearIcon color="error" />
              </IconButton>
            }
          >
            <ListItemAvatar>
              <Avatar></Avatar>
            </ListItemAvatar>
            <ListItemText primary={value} />
          </ListItem>
        </Collapse>
      ))}
      
    </TransitionGroup>
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
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Player ID"
            type="text"
            fullWidth
            variant="standard"
            value={playerID}
            onChange={(event) => {
              setPlayerID(event.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={sendInvitation}>Send</Button>
        </DialogActions>
      </Dialog>
      </div>
  );
}
