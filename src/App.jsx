import React, { useState } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";

// Define custom node types
const CustomNode = ({ data }) => {
  return (
    <div style={{
      padding: '15px',
      border: '2px solid #007bff', // A blue border for nodes
      borderRadius: '8px',
      backgroundColor: '#f9f9f9', // Light background for nodes
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Slight shadow for better visibility
      width: '200px'
    }}>
      <strong>{data.label}</strong>
      {data.options && (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {data.options.map((option, index) => (
            <li key={index} style={{ margin: '5px 0', fontSize: '14px' }}>
              {option}
            </li>
          ))}
        </ul>
      )}
      <Handle type="source" position="right" style={{ background: '#007bff' }} />
      <Handle type="target" position="left" style={{ background: '#007bff' }} />
    </div>
  );
};

const initialNodes = [
  {
    id: "1",
    type: "custom", // Using custom type
    data: { label: "I'm Wobi's bot", options: ["1", "2", "No match", "No reply"] }, // Added options to the main node
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    type: "custom",
    data: { label: "Option A", options: ["1", "No match"] },
    position: { x: 100, y: 150 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "Option B", options: ["2", "No reply"] },
    position: { x: 400, y: 150 },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#007bff", strokeWidth: 2 } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#007bff", strokeWidth: 2 } },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleDeploy = () => {
    // Placeholder for deploy functionality
    alert("Bot deployed! (This is a placeholder action.)");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
        nodeTypes={{ custom: CustomNode }} // Register custom node type
        style={{ background: "#f0f0f0" }}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Deploy Button */}
      <div style={{ position: 'absolute', bottom: '20px', left: '20px' }}>
        <button onClick={handleDeploy} style={{
          padding: '10px',
          backgroundColor: '#007bff',
          color: '#fff',
          borderRadius: '5px',
          border: 'none',
          cursor: 'pointer'
        }}>
          Deploy Bot
        </button>
      </div>
    </div>
  );
}

export default App;
