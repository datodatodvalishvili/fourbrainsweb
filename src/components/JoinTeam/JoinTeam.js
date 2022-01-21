import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
async function JoinTeamAPI(teamID, setErrorMsg, setTeam, token) {
  FourBrainsAPI.post(
    "4brains/team/join/",
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    },
    {
      team_id: teamID,
    }
  )
    .then(function (response) {
      // handle success
      if (response.data.token) {
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

export default function JoinTeam({ setTeam, token }) {
  const [teamID, setTeamID] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    JoinTeamAPI(teamID, setErrorMsg, setTeam, token);
  };
  return (
    <div className="auth-inner">
      <form onSubmit={handleSubmit}>
        <h1>Join team</h1>
        <div className="form-group">
          <label>
            <p>Team ID</p>
            <input
              className="form-control"
              type="text"
              onChange={(e) => setTeamID(e.target.value)}
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
