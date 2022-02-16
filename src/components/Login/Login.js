import React, { useState } from "react";
import "./Login.css";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

async function loginUser(data, setErrorMsg, setToken) {
  FourBrainsAPI.post("user/login/", {
    username: data.username,
    password: data.password,
  })
    .then(function (response) {
      // handle success
      if (response.data.token) {
        setToken(response.data.token);
      } else {
        alert("Server error");
        setToken("");
      }
    })
    .catch(function (error) {
      setErrorMsg("User or password is incorrect!");
      setToken("");
    });
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    loginUser(
      {
        username,
        password,
      },
      setErrorMsg,
      setToken
    );
  };
  return (
    <Stack spacing={2}>
      <h1>Sign in</h1>
      <TextField
        id="outlined-username"
        label="Username"
        value={username}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <TextField
        id="outlined-password"
        label="Password"
        value={password}
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <Button variant="contained" color="info" onClick={handleSubmit}>
        Sign in
      </Button>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <p className="forgot-password text-right">
        Not registered?<a href="/signup"> sign up</a>
      </p>
      <p className="forgot-password text-right">
        Forgot <a href="/password-restore">password?</a>
      </p>
    </Stack>
  );
}
