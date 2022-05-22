import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";

export default function Lobby({ token, setGameStarted }) {
  const { battleID } = useParams();
  const [rows, setRows] = useState([]);
  const columns = [
    { id: "team_id", label: "ID" },
    { id: "team_name", label: "Team Name" },
    { id: "status_string", label: "Status" },
  ];

  useEffect(() => {
    const getBattleDetails = async () => {
      await FourBrainsAPI.get(`4brains/battle/${battleID}/teams/`, {
        headers: { Authorization: `Token ${token}` },
      })
        .then(function (response) {
          if (response.data.success) {
            setRows(response.data.teams);
          }
        })
        .catch(function (error) {
          console.error(error.response.data);
        });
    };
    getBattleDetails();
    const scoreBoardUpdate = setInterval(() => {
      getBattleDetails();
    }, 5000);
    return () => {
      clearInterval(scoreBoardUpdate);
    };
  }, []);

  return (
    <TableContainer>
      <Button
        sx={{ alignSelf: "center" }}
        variant="contained"
        color="info"
        size="large"
        onClick={() => {
          setGameStarted(true);
        }}
      >
        Start game
      </Button>
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
