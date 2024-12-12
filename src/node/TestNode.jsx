import React, { useState, useMemo, useCallback } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "react-flow-renderer";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";

const CustomNode = ({ data }) => {
  const itemHeight = 2;
  const handleOffset = 10;

  return (
    <div
      style={{
        padding: "15px",
        border: "2px solid rgb(255, 255, 255)",
        borderRadius: "8px",
        backgroundColor: "rgba(163, 181, 192)",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "200px",
        cursor: "move",
      }}
    >
      <strong>{data.label}</strong>
      <div style={{ backgroundColor: "rgba(255, 255, 255)" }}>
        {data.options && (
          <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
            {data.options.map((option, index) => (
              <li
                key={index}
                style={{
                  padding: "2px",
                  fontSize: "14px",
                  position: "relative",
                }}
              >
                <button
                  style={{
                    padding: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                  onClick={() => alert(`Option selected: ${option}`)}
                >
                  {option}
                </button>
                <Handle
                  type="source"
                  position="right"
                  id={`${option}-handle`}
                  style={{
                    position: "absolute",
                    top: `${(index + 1) * itemHeight + handleOffset}px`,
                    background: "#007bff",
                  }}
                />
              </li>
            ))}
          </ul>
        )}
        <Handle
          type="target"
          position="left"
          style={{ background: "#007bff" }}
        />
      </div>
    </div>
  );
};

// Initial Nodes and Edges
const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: { label: "Start", options: ["Option A", "Option B", "Option C"] },
    position: { x: 100, y: 100 },
  },
  {
    id: "2",
    type: "custom",
    data: { label: "Node A", options: ["Yes", "No", "Maybe"] },
    position: { x: 400, y: 0 },
  },
  {
    id: "3",
    type: "custom",
    data: { label: "Node B", options: ["Continue", "Stop"] },
    position: { x: 400, y: 200 },
  },
];

const initialEdges = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    sourceHandle: "Option A-handle",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888888",
    },
  },
  {
    id: "e1-3",
    source: "1",
    target: "3",
    sourceHandle: "Option B-handle",
    type: "smoothstep",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: "#888888",
    },
  },
];

const TestNode = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#888888",
            },
          },
          eds
        )
      ),
    []
  );

  const addNode = useCallback(
    (label, options) => {
      const newNode = {
        id: (nodes.length + 1).toString(),
        type: "custom",
        data: { label, options },
        position: {
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length]
  );

  const editNode = useCallback((id, newLabel, newOptions) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, label: newLabel, options: newOptions },
            }
          : node
      )
    );
  }, []);

  const onNodeDoubleClick = useCallback(
    (event, node) => {
      const newLabel = prompt("Enter new label:", node.data.label);
      const newOptionsString = prompt(
        "Enter new options (comma-separated):",
        node.data.options.join(", ")
      );
      if (newLabel && newOptionsString) {
        const newOptions = newOptionsString.split(",").map((opt) => opt.trim());
        editNode(node.id, newLabel, newOptions);
      }
    },
    [editNode]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    if (window.confirm(`Delete node "${node.data.label}"?`)) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== node.id && edge.target !== node.id)
      );
    }
  }, []);

  const handleDeploy = useCallback(() => {
    alert("Bot deployed! (This is a placeholder action.)");
  }, []);

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
        nodeTypes={nodeTypes}
        style={{ backgroundColor: "#f0f0f0" }}
        nodesDraggable={true}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDoubleClick={onNodeDoubleClick}
        onNodeContextMenu={onNodeContextMenu}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: "1000",
        }}
      >
        <select
          onChange={(e) => {
            if (e.target.value) {
              addNode(e.target.value, ["Option A", "Option B", "Option C"]);
              e.target.value = "";
            }
          }}
          style={{ padding: "5px", fontSize: "16px" }}
        >
          <option value="">Add New Node</option>
          <option value="Decision Node">Decision Node</option>
          <option value="Action Node">Action Node</option>
        </select>
      </div>

      <div
        style={{
          position: "absolute",
          top: "60px",
          left: "20px",
          zIndex: "1000",
        }}
      >
        <button
          onClick={handleDeploy}
          style={{
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Deploy Bot
        </button>
      </div>

      {/* Color Picker Section */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "20px",
          zIndex: "1000",
        }}
      >
        <input
          type="color"
          onChange={(e) => {
            document.documentElement.style.setProperty(
              "--main-color",
              e.target.value
            );
          }}
          defaultValue="#007bff"
          title="Pick a color for nodes and edges"
        />
      </div>
    </div>
  );
};

export default TestNode;
