import React, { useEffect, useState } from "react";
import vis, { DataSet, Edge, Network, Node, Options } from "vis";
import { runQuery } from "./neo4jHelper";
import { Integer } from "neo4j-driver";
import { useParams } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { experimentalStyled as styled } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
// const { queNo } = useParams<{ queNo: string}>();

interface Params {
  questionNo: string;
}

const Graph = () => {
  const { questionNo } = useParams<Params>();
  console.log("questionNo >> " + JSON.stringify(questionNo));

  const [graphData, setGraphData] = useState<{
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
  }>();

  const [network, setNetwork] = useState<Network>();
  const [options, setOptions] = useState<Options>();
  const uniqueNodes = new Set<string>();
  const uniqueEdges = new Set<string>();
  // const [questionNo, setQuestionNo] = useState(0);
  // setQuestionNo(parseInt(queNo, 10))

  const [selectedValue, setSelectedValue] = React.useState("");
  const [selectedResearchArea, setSelectedResearchArea] = React.useState("");
  const [selectedResearchArea_1, setSelectedResearchArea_1] = useState(
    "Select Research Area 1"
  );
  const [selectedResearchArea_2, setSelectedResearchArea_2] = useState(
    "Select Research Area 2"
  );
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [arrList, setArrList] = useState<string[]>([]);

  const [department, setDepartment] = React.useState("");
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  useEffect(() => {
    // Your initialization logic here
    const query = fetchQuery();
    console.log("query >>" + query);
    if (questionNo === "3" || questionNo === "4") {
      renderData();
    }

    // Cleanup logic (equivalent to ngOnDestroy in Angular) can be returned
    return () => {
      console.log("Component will unmount (onDestroy equivalent)");
    };
  }, []);

  const handleDropdownChange = (event: any) => {
    setSelectedValue(event.target.value);
  };

  const handleChangeInResearchArea = (event: any) => {
    setSelectedResearchArea(event.target.value);
  };

  const handleChangeInResearchArea_1 = (event: any) => {
    setSelectedResearchArea_1(event.target.value);
  };

  const handleChangeInResearchArea_2 = (event: any) => {
    setSelectedResearchArea_2(event.target.value);
  };

  const handleButtonClick = () => {
    fetchData();
  };

  const handleChangeDept = (event: SelectChangeEvent) => {
    setDepartment(event.target.value);
  };

  const handleChangeFaculty = (event: SelectChangeEvent) => {
    setSelectedValue(event.target.value);
  };

  const fetchQuery = async () => {
    if (questionNo == "1") {
      return (
        "MATCH (n:Faculty)-[r:RESEARCHS_IN]->(m:Research_Field) " +
        'WHERE n.faculty_name = "' +
        selectedValue +
        '" RETURN n,r,m'
      );
      // );
    } else if (questionNo == "2") {
      return (
        'MATCH (n:Faculty)-[r:RESEARCHS_IN]-(OtherNodes) Where OtherNodes.name = "' +
        selectedResearchArea +
        '" RETURN n, OtherNodes as m,r'
      );
      // );
    } else if (questionNo == "3") {
      return (
        "MATCH (f:Faculty)-[:RESEARCHS_IN]-(field:Research_Field),(f:Faculty)-[:RESEARCHS_IN]-(sfield:Super_Research_Field) " +
        "With count(sfield) as s_count, sfield WHERE s_count >= 5 RETURN sfield"
      );
      // );
    } else if (questionNo == "4") {
      return (
        "MATCH (subs)-[:SUB_FIELD_OF]->(OtherNodes:Super_Research_Field) WHERE NOT EXISTS((:Faculty)-[:RESEARCHS_IN]->(OtherNodes))" +
        " WITH DISTINCT OtherNodes as SuperFields WITH collect(SuperFields.name) as originallist MATCH (subs)-[:SUB_FIELD_OF]->(SuperFields)" +
        " WHERE EXISTS((:Faculty)-[:RESEARCHS_IN]->(subs)) WITH DISTINCT SuperFields as SuperFieldss, originallist WITH *,collect(SuperFieldss.name) as newlist" +
        " UNWIND newlist as onelist WITH collect(onelist) as thislist, originallist Return [x IN originallist WHERE NOT x IN thislist] as final"
      );
    } else if (questionNo == "5") {
      return (
        "MATCH (faculty:Faculty)-[:RESEARCHS_IN]-(OtherNodes:Super_Research_Field), (faculty:Faculty)-[:RESEARCHS_IN]-(OtherNodess:Research_Field)" +
        ' Where OtherNodes.name = "' +
        selectedResearchArea_1 +
        '" and OtherNodess.name = "' +
        selectedResearchArea_2 +
        '" RETURN faculty'
      );
    }
    return "";
  };

  const fetchData = async () => {
    console.log("Questoin No >>" + questionNo);
    const query = await fetchQuery();
    console.log("query >>" + query);
    setQuery(query);

    if (query) {
      const results = await runQuery(query);

      let nodes = new vis.DataSet();
      let edges = new vis.DataSet<Edge>();

      console.log("..........................................");

      results.forEach((record) => {
        const node1 = record.get("n");
        const node2 = record.get("m");
        const edge = record.get("r");

        console.log(node1.elementId);
        console.log(typeof node1.elementId);

        if (node1 && !uniqueNodes.has(node1.elementId)) {
          uniqueNodes.add(node1.elementId.toString());

          nodes.add({
            id: node1.elementId,
            label: node1.properties.faculty_name,
          });
          console.log("if node 1 >>>>>> " + uniqueNodes.size);
        }
        if (node2 && !uniqueNodes.has(node2.elementId)) {
          uniqueNodes.add(node2.elementId);
          nodes.add({ id: node2.elementId, label: node2.properties.name });
          console.log("if node 2 >>>>> " + uniqueNodes.size);
        }
        if (edge && !uniqueEdges.has(edge.elementId)) {
          uniqueEdges.add(edge.elementId);
          edges.add({
            id: edge.elementId,
            from: node1.elementId,
            to: node2.elementId,
            label: edge.type,
          });
        }
      });
      const container = document.getElementById("graph-container");
      setTimeout(() => {
        setGraphData({ nodes, edges });
        if (container) {
          container.innerHTML = "";
          setOptions({
            autoResize: true,
            width: "1000px",
            height: "600px",
            clickToUse: true,
            layout: {
              hierarchical: {
                enabled: false,
                levelSeparation: 2,
                // improvedLayout: true
              },
            },

            nodes: {
              color: {
                border: "#2B7CE9",
                background: "#97C2FC",
                highlight: {
                  border: "#2B7CE9",
                  background: "#D2E5FF",
                },
                hover: {
                  border: "#2B7CE9",
                  background: "#D2E5FF",
                },
              },
              scaling: {
                min: 15,
                max: 25,
                label: false,
              },
              widthConstraint: {
                minimum: 100,
                maximum: 200,
              },

              shape: "circle",
              size: 25,
            },
            // widthConstraint: edges,

            edges: {
              arrowStrikethrough: true,
              color: {
                color: "#848484",
              },
              hoverWidth: 1.5,
              length: 400,
              // shadow: true,
              smooth: false,

              arrows: {
                to: {
                  enabled: true,
                  scaleFactor: 1,
                  type: "arrow",
                },
              },
              font: {
                align: "middle",
              },
              scaling: {
                label: true,
              },
              widthConstraint: {
                maximum: 200,
              },
              chosen: true,
            },

            physics: {
              enabled: true,
              stabilization: true,
            },
          });

          setNetwork(
            new vis.Network(
              container,
              { nodes: nodes, edges: edges },
              {
                width: "1000px",
                height: "600px",
                autoResize: true,
                clickToUse: true,
                layout: {
                  hierarchical: {
                    enabled: false,
                    levelSeparation: 2,
                  },
                },
                nodes: {
                  color: {
                    border: "#2B7CE9",
                    background: "#97C2FC",
                    highlight: {
                      border: "#2B7CE9",
                      background: "#D2E5FF",
                    },
                    hover: {
                      border: "#2B7CE9",
                      background: "#D2E5FF",
                    },
                  },
                  scaling: {
                    min: 15,
                    max: 25,
                    label: false,
                  },
                  widthConstraint: {
                    minimum: 100,
                    maximum: 200,
                  },

                  shape: "circle",
                  size: 25,
                },
                edges: {
                  arrowStrikethrough: true,
                  color: {
                    color: "#848484",
                  },
                  hoverWidth: 1.5,
                  length: 400,
                  // shadow: true,
                  smooth: false,

                  arrows: {
                    to: {
                      enabled: true,
                      scaleFactor: 1,
                      type: "arrow",
                    },
                  },
                  font: {
                    align: "middle",
                  },
                  scaling: {
                    label: true,
                  },
                  widthConstraint: {
                    maximum: 200,
                  },
                  chosen: true,
                },
              }
            )
          );
        }
      }, 1000);
    }

    //   console.log(JSON.stringify(results));
  };

  const renderData = async () => {
    setMessage("");

    try {
      const query = await fetchQuery();
      setQuery(query);
      const result = await runQuery(query);

      console.log(JSON.stringify(result));

      if (result) {
        const tempList: string[] = [];

        result.forEach((record) => {
          if (questionNo === "3") {
            console.log(record.get("sfield").properties.name);
            tempList.push(record.get("sfield").properties.name);
          } else if (questionNo === "5") {
            console.log(record.get("faculty").properties.faculty_name);
            tempList.push(record.get("faculty").properties.faculty_name);
          }
        });
        setArrList(tempList);
        console.log("Graph data: " + graphData);
      }
    } catch (error) {
      console.error("Error loading graph data:", error);
    }
  };

  // useEffect(() => {
  //   setQuestionNo(5);
  //   // fetchData();
  // }, []);

  return (
    <>
      <div className="container">
        <div className="row col-md-1">
          <br />
          <br />
        </div>
        {/* -----------------  Question No 1 -------------------------------------------- */}
        {questionNo == "1" && (
          <div className={questionNo == "1" ? "row col-md-12" : "d-none"}>
            <Grid container spacing={{ xs: 4, md: 4 }}>
              <Grid item md={12}>
                <Item>
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={department}
                      onChange={handleChangeDept}
                      autoWidth
                      label="Department"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="cs">Computer Science</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Select Faculty
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={selectedValue}
                      onChange={handleChangeFaculty}
                      autoWidth
                      label="Facutly"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Theodore Manikas">
                        Theodore Manikas
                      </MenuItem>
                      <MenuItem value="Labiba Jahan">Labiba Jahan</MenuItem>
                      <MenuItem value="Eric Larson">Eric Larson</MenuItem>
                      <MenuItem value="Ginger Alford">Ginger Alford</MenuItem>
                      <MenuItem value="Jia Zhang">Jia Zhang</MenuItem>
                      <MenuItem value="Jeff Tian">Jeff Tian</MenuItem>
                      <MenuItem value="Kasilingam Periyasamy">
                        Kasilingam Periyasamy
                      </MenuItem>
                      <MenuItem value="Klyne Smith">Klyne Smith</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ paddingLeft: 5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ marginTop: 2 }}
                      onClick={handleButtonClick}
                    >
                      {" "}
                      Submit
                    </Button>
                  </FormControl>
                </Item>
              </Grid>
            </Grid>
          </div>
        )}

        {/* -----------------  Question No 2 -------------------------------------------- */}

        {questionNo == "2" && (
          <div className={questionNo == "2" ? "row col-md-12" : "d-none"}>
            <Grid container spacing={{ xs: 4, md: 4 }}>
              <Grid item md={12}>
                <Item>
                  <FormControl sx={{ m: 1, minWidth: 200 }}>
                    <InputLabel id="demo-simple-select-autowidth-label">
                      Department
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-autowidth-label"
                      id="demo-simple-select-autowidth"
                      value={department}
                      onChange={handleChangeDept}
                      autoWidth
                      label="Department"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="cs">Computer Science</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="researchAreaDropdown">
                      Select Research Area
                    </InputLabel>
                    <Select
                      labelId="researchAreaDropdown"
                      id="researchAreaDropdown"
                      value={selectedResearchArea}
                      onChange={handleChangeInResearchArea}
                      autoWidth
                      label="Research Area"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Machine Learning">
                        Machine Learning{" "}
                      </MenuItem>
                      <MenuItem value="Natural Language Processing">
                        Natural Language Processing
                      </MenuItem>
                      <MenuItem value="Narrative Understanding">
                        Narrative Understanding
                      </MenuItem>
                      <MenuItem value="AI and Software Engineering">
                        AI and Software Engineering
                      </MenuItem>
                      <MenuItem value="Software Maintenance and Evolution">
                        Software Maintenance and Evolution
                      </MenuItem>
                      <MenuItem value="Data Mining">Data Mining</MenuItem>
                      <MenuItem value="Artificial Intelligence">
                        Artificial Intelligence
                      </MenuItem>
                      <MenuItem value="Database Systems">
                        Database Systems
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ paddingLeft: 5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ marginTop: 2 }}
                      onClick={handleButtonClick}
                    >
                      {" "}
                      Submit
                    </Button>
                  </FormControl>
                </Item>
              </Grid>
            </Grid>
          </div>
        )}

        {/* -----------------  Question No 5 -------------------------------------------- */}

        {questionNo == "5" && (
          <div className={questionNo == "5" ? "row col-md-12" : "d-none"}>
            <Grid container spacing={{ xs: 4, md: 4 }}>
              <Grid item md={12}>
                <Item>
                  <FormControl sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="dropdown1">Select Research Area</InputLabel>
                    <Select
                      labelId="dropdown1"
                      id="dropdown1"
                      value={selectedResearchArea_1}
                      onChange={handleChangeInResearchArea_1}
                      autoWidth
                      label="Select Research Area"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Data Mining">Data Mining </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ m: 1, minWidth: 300 }}>
                    <InputLabel id="dropdown1">Select Research Area</InputLabel>
                    <Select
                      labelId="dropdown2"
                      id="dropdown2"
                      value={selectedResearchArea_2}
                      onChange={handleChangeInResearchArea_2}
                      autoWidth
                      label="Select Research Area"
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="Machine Learning">
                        Machine Learning{" "}
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl sx={{ paddingLeft: 5 }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ marginTop: 2 }}
                      onClick={renderData}
                    >
                      {" "}
                      Submit
                    </Button>
                  </FormControl>
                </Item>
              </Grid>
            </Grid>
          </div>
        )}

        {/* -----------------  Query TextArea -------------------------------------------- */}
        <Grid container spacing={{ xs: 4, md: 4 }}>
          <Grid item md={12}>
            <Item>
              <Typography noWrap>
                <FormControl fullWidth sx={{ m: 1, flex: 1 }}>
                  <InputLabel htmlFor="outlined-adornment-query">
                    Cipher Query
                  </InputLabel>

                  <OutlinedInput
                    disabled
                    id="outlined-adornment-query"
                    startAdornment={
                      <InputAdornment position="start">{query}</InputAdornment>
                    }
                    label="Query"
                  />
                </FormControl>
              </Typography>
            </Item>
          </Grid>
        </Grid>

        {/* ------------------- Information Section ------------------------------------------*/}
        <div>
          <div className="row">
            <br />
            <br />
          </div>
          <div className="col-md-8 p-4">
            <div id="graph-container" className="p-4">
              {/* This is where the graph will be rendered */}
            </div>
          </div>

          <br />
          <br />
          <List
            component="nav"
            aria-label="mailbox folders"
            sx={{ justifyContent: "center" }}
          >
            {arrList.map((item, i) => (
              <React.Fragment key={item}>
                <ListItem  component={List}>
                  <ListItemText primary={item} />
                </ListItem>
                {i < arrList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </div>
      </div>
    </>
  );
};

export default Graph;
