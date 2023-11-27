import React, { useEffect, useState } from "react";
import vis, { DataSet, Edge, Network, Node, Options } from "vis";
import { runQuery } from "./neo4jHelper";
import { Integer } from "neo4j-driver";
import { useParams } from "react-router-dom";

// interface Props {
//   queNo: string;
//   [key: string]: string | undefined;
// }

// const { queNo } = useParams<Props>();
// {queNo}: Props
const Graph = () => {
  const [graphData, setGraphData] = useState<{
    nodes: DataSet<Node>;
    edges: DataSet<Edge>;
  }>();

  const [network, setNetwork] = useState<Network>();
  const [options, setOptions] = useState<Options>();
  const uniqueNodes = new Set<string>();
  const uniqueEdges = new Set<string>();
  const [questionNo, setQuestionNo] = useState(1);
  const [selectedValue, setSelectedValue] = useState("Select Faculty");
  const [selectedResearchArea, setSelectedResearchArea] = useState(
    "Select Research Area"
  );
  const [selectedResearchArea_1, setSelectedResearchArea_1] = useState(
    "Select Research Area 1"
  );
  const [selectedResearchArea_2, setSelectedResearchArea_2] = useState(
    "Select Research Area 2"
  );
  const [query, setQuery] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [arrList, setArrList] = useState<string[]>([]);

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

  const fetchQuery = () => {
    if (questionNo == 1) {
      return (
        "MATCH (n:Faculty)-[r:RESEARCHS_IN]->(m:Research_Field) " +
        'WHERE n.faculty_name = "' +
        selectedValue +
        '" RETURN n,r,m'
      );
    } else if (questionNo == 2) {
      return (
        'MATCH (n:Faculty)-[r:RESEARCHS_IN]-(OtherNodes) Where OtherNodes.name = "' +
        selectedResearchArea +
        '" RETURN n, OtherNodes as m,r'
      );
    } else if (questionNo == 3) {
      return (
        "MATCH (f:Faculty)-[:RESEARCHS_IN]-(field:Research_Field),(f:Faculty)-[:RESEARCHS_IN]-(sfield:Super_Research_Field) " +
        "With count(sfield) as s_count, sfield WHERE s_count >= 5 RETURN sfield"
      );
    } else if (questionNo == 4) {
      return (
        "MATCH (subs)-[:SUB_FIELD_OF]->(OtherNodes:Super_Research_Field) WHERE NOT EXISTS((:Faculty)-[:RESEARCHS_IN]->(OtherNodes))" +
        " WITH DISTINCT OtherNodes as SuperFields WITH collect(SuperFields.name) as originallist MATCH (subs)-[:SUB_FIELD_OF]->(SuperFields)" +
        " WHERE EXISTS((:Faculty)-[:RESEARCHS_IN]->(subs)) WITH DISTINCT SuperFields as SuperFieldss, originallist WITH *,collect(SuperFieldss.name) as newlist" +
        " UNWIND newlist as onelist WITH collect(onelist) as thislist, originallist Return [x IN originallist WHERE NOT x IN thislist] as final"
      );
    } else if (questionNo == 5) {
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
    setQuery(fetchQuery());
    console.log(query);

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
      }, 5000);

      setGraphData({ nodes, edges });
    }

    //   console.log(JSON.stringify(results));
  };

  const renderData = async () => {
    setMessage("");

    try {
      setQuery(fetchQuery());
      const result = await runQuery(query);

      console.log(JSON.stringify(result));

      if (result) {
        const tempList: string[] = [];

        result.forEach((record) => {
          if (questionNo === 3) {
            console.log(record.get("sfield").properties.name);
            tempList.push(record.get("sfield").properties.name);
          } else if (questionNo === 5) {
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

  useEffect(() => {
    setQuestionNo(5);
    // fetchData();
  }, []);

  return (
    <>
      <div className="container">
        <div className="row col-md-1">
          <br />
          <br />
        </div>
        {/* -----------------  Question No 1 -------------------------------------------- */}
        {questionNo === 1 && (
          <div className={questionNo === 1 ? "row col-md-12" : "d-none"}>
            <div className="col-md-4">
              <label className="col-md-3" htmlFor="dropdown">
                Department: {questionNo}
              </label>
              <select id="dropdown" className="col-sm-8">
                <option value="cs">Computer Science</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="col-md-3" htmlFor="dropdown">
                Faculty:
              </label>
              <select
                id="dropdown"
                value={selectedValue}
                onChange={handleDropdownChange}
                className="col-md-8"
              >
                <option value="">Select Faculty</option>
                <option value="Theodore Manikas">Theodore Manikas</option>
                <option value="Labiba Jahan">Labiba Jahan</option>
                <option value="Eric Larson">Eric Larson</option>
                <option value="Ginger Alford">Ginger Alford</option>
                <option value="Jia Zhang">Jia Zhang</option>
                <option value="Jeff Tian">Jeff Tian</option>
                <option value="Kasilingam Periyasamy">
                  Kasilingam Periyasamy
                </option>
                <option value="Klyne Smith">Klyne Smith</option>
              </select>
            </div>
            <div className="col-md-3">
              <div className="col-md-3"></div>
              <button
                type="submit"
                className="col-md-4 btn btn-primary"
                onClick={handleButtonClick}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* -----------------  Question No 2 -------------------------------------------- */}
        {questionNo === 2 && (
          <div
            className="row col-md-12"
            style={{ display: questionNo === 2 ? "block" : "none" }}
          >
            <div className="col-md-4">
              <label className="col-md-3" htmlFor="departmentDropdown">
                Department:
              </label>
              <select id="departmentDropdown" className="col-sm-8">
                <option value="cs">Computer Science</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="col-md-4" htmlFor="researchAreaDropdown">
                Research Areas:
              </label>
              <select
                id="researchAreaDropdown"
                className="col-md-8"
                value={selectedResearchArea}
                onChange={handleChangeInResearchArea}
              >
                <option>Select Research Area</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Natural Language Processing">
                  Natural Language Processing
                </option>
                <option value="Narrative Understanding">
                  Narrative Understanding
                </option>
                <option value="AI and Software Engineering">
                  AI and Software Engineering
                </option>
                <option value="Software Maintenance and Evolution">
                  Software Maintenance and Evolution
                </option>
                <option value="Data Mining">Data Mining</option>
                <option value="Artificial Intelligence">
                  Artificial Intelligence
                </option>
                <option value="Database Systems">Database Systems</option>
              </select>
            </div>

            <div className="col-md-3">
              <button
                type="submit"
                className="col-md-4 btn btn-primary"
                onClick={handleButtonClick}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* -----------------  Question No 5 -------------------------------------------- */}
        {questionNo === 5 && (
          <div className="row">
            {/* Research Area 1 */}
            <div className="col-md-3">
              <label className="col-md-5" htmlFor="dropdown1">
                Research Area 1:
              </label>
              <select
                id="dropdown1"
                className="col-md-7"
                value={selectedResearchArea_1}
                onChange={handleChangeInResearchArea_1}
              >
                <option value="">Select Research Area</option>
                <option value="Data Mining">Data Mining</option>
              </select>
            </div>

            {/* Research Area 2 */}
            <div className="col-md-3">
              <label className="col-md-5" htmlFor="dropdown2">
                Research Area 2:
              </label>
              <select
                id="dropdown2"
                className="col-sm-7"
                value={selectedResearchArea_2}
                onChange={handleChangeInResearchArea_2}
              >
                <option value="">Select Research Area</option>
                <option value="Machine Learning">Machine Learning</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="col-md-2">
              <div className="col-md-1"></div>
              <button
                type="submit"
                className="col-md-4 btn btn-primary"
                onClick={renderData}
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* -----------------  Query TextArea -------------------------------------------- */}
        <div>
          <div className="row">
            <br />
          </div>
          <div className="row">
            <div className="col-md-12">
              <label htmlFor="exampleText" className="form-label">
                Query
              </label>
              <textarea
                id="exampleText"
                className="form-control"
                value={query}
                readOnly
              ></textarea>
            </div>
          </div>
        </div>

        {/* ------------------- Information Section ------------------------------------------*/}
        <div>
          <div className="row">
            <br />
            <br />
          </div>
          <div
            className="row"
            style={{ border: "10px solid white", height: "1000px" }}
          >
            <div className="col-md-4">
              <div
                className="p-4"
                style={{ height: "500px", border: "1px solid white" }}
              >
                {arrList.length > 0 ? (
                  <div className="col-md-12">
                    <h3>Information</h3>
                    {arrList.map((item, i) => (
                      <div key={i} className="form-control mb-4 px-0">
                        {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>
                    <h3>No other Information</h3>
                  </div>
                )}
              </div>
            </div>

            <div className="col-md-8 p-4">
              {graphData && (
                <div id="graph-container" className="p-4">
                  {/* This is where the graph will be rendered */}
                </div>
              )}
            </div>
            <br />
            <br />
          </div>
        </div>

        {/* <div>
          <h2>Graph Visualization</h2>
          <div>
            <div id="graph-container" className="p-4"> */}
        {/* <!-- This is where the graph will be rendered  --> */}
        {/* </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default Graph;
