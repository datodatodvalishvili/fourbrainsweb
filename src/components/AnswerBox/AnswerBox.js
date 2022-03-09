import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";

import { selectGameState } from "../../state/gameSlice";
import { useSelector } from "react-redux";

export default function AnswerBox() {
  const gameState = useSelector(selectGameState);
  const [value, setValue] = useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        margin: 1,
        padding: 1,
        marginBottom: 0,
        flexGrow: 1,
        minHeight: 0,
      }}
    >
      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Answer" value="1" />
              <Tab label="Comment" value="2" />
              <Tab label="Source" value="3" />
              <Tab
                label="Extras"
                value="4"
                disabled={!gameState.question.attachment_img_url}
              />
            </TabList>
          </Box>
          <TabPanel value="1">
            <h3>{gameState.question.answers}</h3>
          </TabPanel>
          <TabPanel value="2">
            <h3>{gameState.question.comment}</h3>
          </TabPanel>
          <TabPanel value="3">
            <h3>{gameState.question.source}</h3>
          </TabPanel>
          <TabPanel value="4">
            <img src={gameState.question.attachment_img_url} alt="attachment" />
          </TabPanel>
        </TabContext>
      </Box>
    </Paper>
  );
}
