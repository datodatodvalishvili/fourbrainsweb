import React, { useState } from "react";
import "./Signup.css";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useNavigate } from "react-router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

async function signupAPI(data, setErrorMsg, navigate) {
  FourBrainsAPI.post("user/register/", {
    username: data.username,
    password: data.password,
    email: data.email,
    firstname: data.firstName,
    lastname: data.lastName,
  })
    .then(function (response) {
      // handle success
      if (response.data.success) {
        navigate("/");
      } else setErrorMsg(response.data.message);
    })
    .catch(function (error) {
      setErrorMsg("Server error!");
    });
}

export default function Signup({ setToken }) {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorObject, setErrorObject] = useState({});
  let navigate = useNavigate();

  const validateForm = () => {
    let err = false;
    const copyErrorArray = {};
    if (!username) {
      copyErrorArray["username"] = "Please fill username!";
      err = true;
    }
    if (!password) {
      copyErrorArray["password"] = "Please fill password!";
      err = true;
    }
    if (!email) {
      copyErrorArray["email"] = "Please fill email!";
      err = true;
    }
    if (!firstName) {
      copyErrorArray["firstName"] = "Please fill first name!";
      err = true;
    }
    if (!lastName) {
      copyErrorArray["lastName"] = "Please fill last name!";
      err = true;
    }
    if (password !== password1) {
      copyErrorArray["password"] = "The password confirmation does not match!";
      copyErrorArray["password1"] = "The password confirmation does not match!";  
      err = true;
    }
    setErrorObject(copyErrorArray);
    return err;
  };

  const handleSubmit = () => {
    if (validateForm()) {
        return;
      }
      signupAPI(
        {
          username,
          password,
          email,
          firstName,
          lastName,
        },
        setErrorMsg,
        navigate
      );
    };

  return (
    <Stack spacing={2}>
      <h1>Sign up</h1>
      <TextField
        error={errorObject.username}
        helperText={errorObject.username}
        id="outlined-username"
        label="Username"
        value={username}
        onChange={(event) => {
          setUserName(event.target.value);
        }}
      />
      <TextField
        error={errorObject.password}
        helperText={errorObject.password}
        id="outlined-password"
        label="Password"
        value={password}
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      />
      <TextField
        error={errorObject.password1}
        helperText={errorObject.password1}
        id="outlined-password1"
        label="Confirm password"
        value={password1}
        type="password"
        onChange={(event) => {
          setPassword1(event.target.value);
        }}
      />
      <TextField
        error={errorObject.email}
        helperText={errorObject.email}
        id="outlined-email"
        label="Email"
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
        }}
      />
      <TextField
        error={errorObject.firstName}
        helperText={errorObject.firstName}
        id="outlined-first-name"
        label="First name"
        value={firstName}
        onChange={(event) => {
          setFirstName(event.target.value);
        }}
      />
      <TextField
        error={errorObject.lastName}
        helperText={errorObject.lastName}
        id="outlined-last-name"
        label="Last name"
        value={lastName}
        onChange={(event) => {
          setLastName(event.target.value);
        }}
      />
      <Button variant="contained" color="info" onClick={handleSubmit}>
        Sign Up
      </Button>
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      <p className="forgot-password text-right">
        Already registered? <a href="/">sign in</a>
      </p>
    </Stack>
  );
}
