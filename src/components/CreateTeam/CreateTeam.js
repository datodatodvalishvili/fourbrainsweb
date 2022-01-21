import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
async function CreateTeamAPI(teamName, setErrorMsg, setTeam, token) {
  FourBrainsAPI.post(
    "4brains/team/create/",
    {
      name: teamName,
      about: "",
      represents_country: "GE",
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  )
    .then(function (response) {
      // handle success
      if (response.data.success) {
        setTeam();
      } else {
        alert("Server error");
        setTeam();
      }
    })
    .catch(function (error) {
      setErrorMsg("User or password is incorrect!");
      setTeam();
    });
}

export default function CreateTeam({ setTeam, token }) {
  const [teamName, setTeamName] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    CreateTeamAPI(teamName, setErrorMsg, setTeam, token);
  };
  return (
    <div className="auth-inner">
      <form onSubmit={handleSubmit}>
        <h1>Create team</h1>
        <div className="form-group">
          <label>
            <p>Team name</p>
            <input
              className="form-control"
              type="text"
              onChange={(e) => setTeamName(e.target.value)}
            />
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Submit
        </button>
      </form>
    </div>
  );
}
