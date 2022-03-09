import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useNavigate } from "react-router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

async function passwordRestoreApi(username, setErrorMsg, navigate) {
  FourBrainsAPI.post("user/password/get-reset-link/", {
    user_string: username,
  })
    .then(function (response) {
      // handle success
      if (response.data.success) {
        navigate("/");
      } else {
        setErrorMsg("Server error!");
      }
    })
    .catch(function (error) {
      setErrorMsg("Server error!");
    });
}

export default function PasswordRestore() {
  const [username, setUserName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    passwordRestoreApi(
      {
        username,
      },
      setErrorMsg,
      navigate
    );
  };
  return (
    <Stack spacing={2}>
      <h1>Restore password</h1>
      <TextField
        id="outlined-username"
        label="Username or Email"
        value={username}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <Button variant="contained" color="info" onClick={handleSubmit}>
        Submit
      </Button>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <p className="forgot-password text-right">
        Not registered?<a href="/signup"> sign up</a>
      </p>
    </Stack>
  );
}
