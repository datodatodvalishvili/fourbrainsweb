import React, { useEffect } from "react";
import { useCurrentUser } from "../../context/UserContext";
import Logout from "../Logout/Logout";
import Profile from "./Profile";

export default function NavBar({ setToken }) {
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  useEffect(() => {
    fetchCurrentUser();
    //eslint-disable-next-line
  }, []);
  return (
    <nav className="navbar navbar-light bg-light justify-content-between">
      <a href="/" className="navbar-brand">
        4brains
      </a>
      <div className="navbar-nav">
        {currentUser && (
          <Profile currentUser = {currentUser}/>
        )}
        <Logout setToken={setToken} />
      </div>
    </nav>
  );
}
