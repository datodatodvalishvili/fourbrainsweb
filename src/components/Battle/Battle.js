import React from "react";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";

export default function Battle({ battle, joinBattle }) {
  return (
    <ListItem key={battle.id} disableGutters>
      <div className="team-inner">
        <h1>Tournament:</h1>
        <h3>{battle.tournament}</h3>
        <p>Date: {battle.date} </p>
        <p>Host: {battle.host} </p>
        <p>Places left: {battle.places_left}</p>
        <Button variant="outlined" onClick={() => joinBattle(battle.id)}>
          Join battle
        </Button>
      </div>
    </ListItem>
  );
}
