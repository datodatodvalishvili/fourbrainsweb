import React, { useState } from "react";
import "./Login.css";
import FourBrainsAPI from "../../axios/FourBrainsAPI";

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
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();
  const [errorMsg, setErrorMsg] = useState();
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
    <form onSubmit={handleSubmit}>
      <h1>Please Log In</h1>
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
      <button type="submit" className="btn btn-primary btn-block">
        Submit
      </button>
      <div>{errorMsg && <p className="error"> {errorMsg} </p>}</div>
      <p className="forgot-password text-right">
        Not registered?<a href="/signup"> sign up</a>
      </p>
      <p className="forgot-password text-right">
        Forgot <a href="/password-restore">password?</a>
      </p>
    </form>
  );
}
