import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
import { useNavigate } from "react-router";

async function passwordRestoreApi(username, setErrorMsg, navigate) {
  FourBrainsAPI.post("user/password/get-reset-link/", {
    user_string: username,
  })
    .then(function (response) {
      // handle success
      if (response.data.success) {
        navigate("/");
      } else {
        console.log(response.data);
        setErrorMsg("Server error!");
      }
    })
    .catch(function (error) {
      console.log(error.data);
      setErrorMsg("Server error!");
    });
}

export default function PasswordRestore() {
  const [username, setUserName] = useState();
  const [errorMsg, setErrorMsg] = useState();
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
    <form onSubmit={handleSubmit}>
      <h1>Restore password</h1>
      <div className="form-group">
        <label>
          <p>Username or password</p>
          <input
            className="form-control"
            type="text"
            onChange={(e) => setUserName(e.target.value)}
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
    </form>
  );
}
