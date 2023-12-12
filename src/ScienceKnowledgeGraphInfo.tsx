import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}));

export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid
        container
        spacing={12}
        direction="column"
        justifyContent="space-evenly"
        alignItems="stretch"
      >
        <Grid item md={12}>
          <Item>
            <Typography
              component="h5"
              variant="h6"
              color="inherit"
              gutterBottom
              sx={{ flexGrow: 1 }}
            >
              The Science Knowledge Graph serves as a valuable tool for
              researchers, academics, and anyone interested in exploring and
              understanding the complex web of relationships within a particular
              scientific field. It aids in knowledge discovery, trend analysis,
              and the identification of key contributors and influential works
              within the domain. The Science Knowledge Graph serves as a
              valuable tool for researchers, academics, and anyone interested in
              exploring and understanding the complex web of relationships
              within a particular scientific field. It aids in knowledge
              discovery, trend analysis, and the identification of key
              contributors and influential works within the domain. The Science
              Knowledge Graph serves as a valuable tool for researchers,
              academics, and anyone interested in exploring and understanding
              the complex web of relationships within a particular scientific
              field. It aids in knowledge discovery, trend analysis, and the
              identification of key contributors and influential works within
              the domain.
            </Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
