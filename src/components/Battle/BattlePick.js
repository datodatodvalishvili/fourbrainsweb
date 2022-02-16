import React, { useState, useEffect } from "react";
import Battle from "./Battle";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import Grid from "@mui/material/Grid";
import Loading from "../Loading/Loading";

export default function BattlePick({ token, teamID, joinBattle }) {
  const [battles, setBattles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    async function GetBattle() {
      FourBrainsAPI.get(`4brains/team/${teamID}/battles/canjoin/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      })
        .then(function (response) {
          // handle success
          if (response.data.success) {
            setBattles(response.data.battles);
            setIsLoading(false);
          }
        })
        .catch(function (error) {
          setBattles(null);
        });
    }
    GetBattle();
  }, []);

  if (isLoading) return <Loading />;

  const listBattles = battles.map((battle) => (
    <Grid item xs={4} key={battle.id}>
      <Battle battle={battle} joinBattle={joinBattle} />
    </Grid>
  ));
  return (
    <Grid container spacing={2}>
      {listBattles}
    </Grid>
  );
}
