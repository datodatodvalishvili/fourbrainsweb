import React, { createContext, useState, useContext } from "react";
import FourBrainsAPI from "../axios/FourBrainsAPI";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUser = async () => {
    const tokenString = localStorage.getItem("token");
    try {
      FourBrainsAPI.get(`user/get-details/`, {
        headers: {
          Authorization: `Token ${tokenString}`,
        },
      })
        .then(function (response) {
          setCurrentUser(response.data.user_data);
        })
        .catch(function (error) {
        });
    } catch (error) {}

    setCurrentUser(null);
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, fetchCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
