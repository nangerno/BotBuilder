import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";

// Define node and edge types outside the component
const nodeTypes = {};
const edgeTypes = {};

const initialNodes = [
  {
    id: "1",
    type: "input", 
    data: { label: "I'm Wobi's bot" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "1" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "2" },
    position: { x: 400, y: 100 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes}  // Pass nodeTypes if you have custom nodes
        edgeTypes={edgeTypes}  // Pass edgeTypes if you have custom edges
        style={{ background: "#f0f0f0" }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}

export default App;
