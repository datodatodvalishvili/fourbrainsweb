import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useParams } from "react-router-dom";

export default function ScoreBoard({ token }) {
  const { battleID } = useParams();
  const [rows, setRows] = useState([]);
  const columns = [
    { id: "battle_place", label: "#", minWidth: 100 },
    { id: "team_name", label: "Team Name", minWidth: 100 },
    { id: "battle_score", label: "Score", minWidth: 50 },
  ];
  for (let i = 1; i <= 30; i++) {
    columns.push({ id: i, label: i, minWidth: 50 });
  }
  useEffect(() => {
    const getScoreBoard = async () => {
      try {
        FourBrainsAPI.get(`4brains/battle/${battleID}/scoreboard/`, {
          headers: { Authorization: `Token ${token}` },
        })
          .then(function (response) {
            // handle success
            if (response.data.success) {
              const battle_results_tmp = [];
              const battle_results = response.data.battle_results;
              battle_results.forEach(function (item, index) {
                const { battle_answers, ...newRow } = item;
                battle_results_tmp.push({
                  ...newRow,
                  ...item.battle_answers,
                });
              });
              setRows(battle_results_tmp);
            } else console.log(response.data);
          })
          .catch(function (error) {
            console.error(error.response.data);
            alert(error.message);
          });
      } catch (error) {
        console.error(error);
      }
    };
    getScoreBoard();
    const scoreBoardUpdate = setInterval(() => {
      getScoreBoard();
    }, 5000);
    return () => {
      clearInterval(scoreBoardUpdate);
    };
  }, []);

  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align}
                style={{ minWidth: column.minWidth }}
              >
                <b>{column.label}</b>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            return (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.team_id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === "number"
                        ? column.format(value)
                        : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
