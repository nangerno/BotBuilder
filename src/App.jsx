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
    <div style={{ padding: 10, border: '1px solid #222', borderRadius: '5px', backgroundColor: '#fff' }}>
      <strong>{data.label}</strong>
      <Handle type="source" position="right" />
      <Handle type="target" position="left" />
    </div>
  );
};

const initialNodes = [
  {
    id: "1",
    type: "input",
    data: { label: "I'm Wobi's bot" },
    position: { x: 250, y: 5 },
  },
  {
    id: "2",
    data: { label: "Option A" },
    position: { x: 100, y: 100 },
  },
  {
    id: "3",
    data: { label: "Option B" },
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

  const handleDeploy = () => {
    // Placeholder for deploy functionality
    alert("Bot deployed! (This is a placeholder action.)");
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes.map((node) => ({
          ...node,
          type: node.type || 'custom', // Use custom type if defined
        }))}
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