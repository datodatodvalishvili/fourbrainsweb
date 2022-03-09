import { configureStore } from "@reduxjs/toolkit";

import teamsSlice from "./teamsSlice";
import gameSlice from "./gameSlice";

export default configureStore({
  reducer: {
    teams: teamsSlice,
    game: gameSlice,
  },
});
