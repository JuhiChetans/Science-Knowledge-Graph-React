import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ScienceKnowledgeGraphInfo from "./ScienceKnowledgeGraphInfo";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

function FAQs() {
  const [selectedIndex, setSelectedIndex] = useState();
  const questions = [
    "1. Find the given faculty’s research fields.",
    "2. Find all faculty working in a given field.",
    "3. What are research strengths of the department?",
    "4. What are research weaknesses of the department? (We can hire more people in those fields).",
    "5. Research faculty working in field X and Y (X or Y), faculty working in multiple areas.",
  ];

  const handleQuestionSelect = (index: number) => {
    console.log("Selected question: ", index + 1);
    const queNo = index + 1;
    // Do something with the selected question
  };

  return (
    <>
      <ScienceKnowledgeGraphInfo />
      <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item md={12} justifyContent={"flex-start"} alignItems={"center"}>
          <Item sx={{ textAlign: "center" }}>
            <Typography
              component="h6"
              variant="h5"
              color="darkslategray"
              noWrap
              sx={{ flexGrow: 1, textAlign: "left", fontWeight: "bold", color: "darkblue" }}
            >
              FAQs
            </Typography>
          </Item>
        </Grid>
      </Grid>
      <List
        component="nav"
        aria-label="mailbox folders"
        sx={{ justifyContent: "center" }}
      >
        {questions.map((question, index) => (
          <React.Fragment key={question}>
            <ListItem button component={Link} to={`/graph/${index + 1}`}>
              <ListItemText primary={question} />
            </ListItem>
            {index < questions.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </List>
    </>
  );
}

export default FAQs;

