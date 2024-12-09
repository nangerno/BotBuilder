import React, { useState, useMemo, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";

// Custom Node Component
const CustomNode = ({ data }) => {
  return (
    <div
      style={{
        padding: "15px",
        border: "2px solid #007bff",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "200px",
        cursor: 'move', // Indicates that the node is movable
      }}
    >
      <strong>{data.label}</strong>
      {data.options && (
        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {data.options.map((option, index) => (
            <li key={index} style={{ margin: "5px 0", fontSize: "14px" }}>
              {option}
            </li>
          ))}
        </ul>
      )}
      <Handle type="source" position="right" style={{ background: "#007bff" }} />
      <Handle type="target" position="left" style={{ background: "#007bff" }} />
    </div>
  );
};

// Initial Nodes and Edges
const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "I'm Wobi's bot", options: ["1", "2", "No match", "No reply"] },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "custom",
    data: { label: "Option A", options: ["1", "No match"] },
    position: { x: 550, y: 20 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "Option B", options: ["2", "No reply"] },
    position: { x: 550, y: 200 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
    style: { stroke: "#007bff", strokeWidth: 2 },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    animated: true,
    style: { stroke: "#007bff", strokeWidth: 2 },
  },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  // Memoize nodeTypes to prevent re-creation on each render
  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const addNode = (label, options) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: "custom",
      data: { label, options },
      position: { x: Math.random() * (window.innerWidth - 200), y: Math.random() * (window.innerHeight - 200) }, // Ensure nodes are within view
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const editNode = (id, newLabel, newOptions) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel, options: newOptions } }
          : node
      )
    );
  };

  const onNodeDoubleClick = (event, node) => {
    const newLabel = prompt("Enter new label:", node.data.label);
    const newOptionsString = prompt("Enter new options (comma-separated):", node.data.options.join(", "));
    if (newLabel && newOptionsString) {
      const newOptions = newOptionsString.split(",").map(opt => opt.trim());
      editNode(node.id, newLabel, newOptions);
    }
  };

  const onNodeContextMenu = (event, node) => {
    event.preventDefault();
    if (window.confirm(`Delete node "${node.data.label}"?`)) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    }
  };

  const handleDeploy = () => {
    alert("Bot deployed! (This is a placeholder action.)");
  };

  // Handle changes to nodes and edges
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onConnect={onConnect}
        fitView
        nodeTypes={nodeTypes} // Use the memoized nodeTypes
        style={{ backgroundColor:"#f0f0f0" }}
        nodesDraggable={true} // Ensure this is set to true
        onNodesChange={onNodesChange} // Handle nodes change
        onEdgesChange={onEdgesChange} // Handle edges change
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      {/* Dropdown to add nodes */}
      <div style={{ position:"absolute", top:"20px", left:"20px", zIndex:"1000" }}>
        <select
          onChange={(e) => {
            if (e.target.value) {
              addNode(e.target.value, ["Option A", "Option B"]);
              e.target.value = ""; // Reset the dropdown after adding a node
            }
          }}
          style={{ padding:"5px", fontSize:"16px" }}
        >
          <option value="">Add New Node</option>
          <option value="New Node A">New Node A</option>
          <option value="New Node B">New Node B</option>
        </select>
      </div>

      {/* Deploy Button */}
      <div style={{ position:"absolute", top:"60px", left:"20px" }}>
        <button
          onClick={handleDeploy}
          style={{
            padding:"10px",
            backgroundColor:"#007bff",
            color:"#fff",
            borderRadius:"5px",
            border:"none",
            cursor:"pointer"
          }}
        >
          Deploy Bot
        </button>
      </div>
    </div>
  );
}

export default App;