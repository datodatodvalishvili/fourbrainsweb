import React, { useState } from "react";
import "./Signup.css";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useNavigate } from "react-router";

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
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [password1, setPassword1] = useState();
  const [email, setEmail] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [errorMsg, setErrorMsg] = useState();
  let navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username) {
      setErrorMsg("Please fill username!");
      return;
    }
    if (!password) {
      setErrorMsg("Please fill password!");
      return;
    }
    if (!email) {
      setErrorMsg("Please fill email!");
      return;
    }
    if (!firstName) {
      setErrorMsg("Please fill first name!");
      return;
    }
    if (!lastName) {
      setErrorMsg("Please fill last name!");
      return;
    }
    if (password !== password1) {
      setErrorMsg("The password confirmation doesn't match!");
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
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label>
          <p>Username</p>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <p>Password</p>
          <input
            className="form-control"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <p>Confirm password</p>
          <input
            className="form-control"
            type="password"
            onChange={(e) => setPassword1(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <p>E-mail</p>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <p>First name</p>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>
      </div>
      <div className="form-group">
        <label>
          <p>Last name</p>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>
      </div>
      <button type="submit" className="btn btn-primary btn-block">
        Sign Up
      </button>
      <div>{errorMsg && <p className="error"> {errorMsg} </p>}</div>
      <p className="forgot-password text-right">
        Already registered? <a href="/">sign in</a>
      </p>
    </form>
  );
}
