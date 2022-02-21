import { configureStore } from "@reduxjs/toolkit";

import teamsSlice from "./teamsSlice";

export default configureStore({
  reducer: {
    teams: teamsSlice,
  },
});
