import { useState } from "react";
import FourBrainsAPI from "./axios/FourBrainsAPI";
export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem("token");
    if (tokenString) {
      try {
        FourBrainsAPI.get(`user/get-details/`, {
          headers: {
            Authorization: `Token ${tokenString}`,
          },
        })
          .then(function (response) {})
          .catch(function (error) {
            saveToken("");
            return "";
          });
      } catch (error) {}
    }

    return tokenString;
  };

  const [token, setToken] = useState(getToken());

  const saveToken = (userToken) => {
    localStorage.setItem("token", userToken);
    setToken(userToken);
  };

  return {
    setToken: saveToken,
    token,
  };
}
