import React from "react";
import "./Logout.css";
import Button from "react-bootstrap/Button";

export default function Logout({ setToken }) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    setToken("");
  };
  return (
    <Button variant="link" onClick={handleSubmit}>
      Logout
    </Button>
  );
}
