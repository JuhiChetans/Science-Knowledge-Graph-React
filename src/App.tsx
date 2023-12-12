import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import FAQs from "./FAQs";
import Graph from "./Graph";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Header from "./Header";

import { styled, createTheme, ThemeProvider } from "@mui/material/styles";


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

const App: React.FC = () => {

  return (
    <>
      <Header />
      <br />
      <br />
      <Router>
        <Switch>
          <Route path="/" exact>
            {" "}
            <FAQs />{" "}
          </Route>
          <Route path="/graph/:questionNo">
            {" "}
            <Graph />{" "}
          </Route>
        </Switch>
      </Router>
    </>
  );
};

export default App;

