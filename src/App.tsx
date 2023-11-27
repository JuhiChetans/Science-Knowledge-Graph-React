// import React, { useEffect, useState} from "react";
// import * as vis from "vis";
// import { fetchGraphData } from "./utils/fetchGraphData.";
// import ForceGraph2D from 'react-force-graph-2d';
// // import { DataSet, Network } from "react-vis-network";
// import { DataSet, Network } from "vis";

// function App( ) {
//   // change the datatypes of nodes and links to be any[]

//   const [graphData, setGraphData] = useState({nodes: [], links: []});

//   useEffect(() => {
//     const fetcchAndSetData = async() => {
//       const data = await fetchGraphData();
//       setGraphData(data);
//       }
//       fetcchAndSetData();
//     }, []);

//   return (
//     <div className="App">
//       <ForceGraph2D graphData={graphData}
//                     nodeLabel="id"
//                     linkDirectionalArrowLength={3.5}
//                     linkDirectionalArrowRelPos={1}
//                     linkCurvature={0.25}>

//       </ForceGraph2D>
//     </div>
//   );
// };
// export default App;

import React from "react";
import { useState } from "react";
// import Graph from "./Graph";
import FAQs from "./FAQs";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useParams,
} from "react-router-dom";
import Graph from "./Graph";
import { Integer } from "neo4j-driver";

const queNo = '';

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <Router>
        <FAQs />
      </Router> */}

      
      {/* <Routes>
        <Route path="/graph/:queNo" element={<Graph queNo={queNo} />} />
      </Routes> */}

      <Graph />
    </div>
  );
};

export default App;
