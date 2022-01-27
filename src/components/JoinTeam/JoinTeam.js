import React, { useState } from "react";
import FourBrainsAPI from "../../axios/FourBrainsAPI";
async function JoinTeamAPI(teamID, setTeam, token) {
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
      setTeam();
    });
}

export default function JoinTeam({ setTeam, token }) {
  const [teamID, setTeamID] = useState();
  const handleSubmit = async (e) => {
    e.preventDefault();
    JoinTeamAPI(teamID, setTeam, token);
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
