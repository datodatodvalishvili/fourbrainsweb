import React, { useEffect } from "react";
import { useCurrentUser } from "../../context/UserContext";
import Profile from "./Profile";

export default function NavBar({ setToken }) {
  const { currentUser } = useCurrentUser();

  useEffect(() => {
    //fetchCurrentUser();
    //eslint-disable-next-line
  }, []);
  return (
    <nav className="navbar navbar-light bg-light justify-content-between">
      <a href="/" className="navbar-brand">
        4brains
      </a>
      <div className="navbar-nav">
        {currentUser && (
          <Profile currentUser={currentUser} setToken={setToken} />
        )}
      </div>
    </nav>
  );
}
