import React, { createContext, useState, useContext } from "react";
import FourBrainsAPI from "../axios/FourBrainsAPI";

export const CurrentUserContext = createContext();

export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    first_name: "",
    last_name: "",
    id: 0,
    username: "",
    phone_prefix: "",
    phone: "",
    email: "",
    token: "",
  });

  const fetchCurrentUser = async () => {
    const tokenString = localStorage.getItem("token");
    try {
      FourBrainsAPI.get(`user/get-details/`, {
        headers: {
          Authorization: `Token ${tokenString}`,
        },
      })
        .then(function (response) {
          let resData = response.data.user_data;
          resData.token = tokenString;
          setCurrentUser(resData);
        })
        .catch(function (error) {
          setCurrentUser(null);
        });
    } catch (error) {
      setCurrentUser(null);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, fetchCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => useContext(CurrentUserContext);
