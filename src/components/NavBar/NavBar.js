import React, { useEffect } from "react";
import { useCurrentUser } from "../../context/UserContext";
import Logout from "../Logout/Logout";

export default function NavBar({ setToken }) {
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  useEffect(() => fetchCurrentUser(), []);
  return (
    <nav className="navbar navbar-light bg-light justify-content-between">
      <a className="navbar-brand">4brains</a>
      <div className="navbar-nav">
        {currentUser && (
          <div>
            Welcome, {currentUser.first_name} {currentUser.last_name}(
            {currentUser.username})
          </div>
        )}
        <Logout setToken={setToken} />
      </div>
    </nav>
  );
}
