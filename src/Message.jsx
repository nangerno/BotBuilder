import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  Handle,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType
} from "react-flow-renderer";
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaLink, FaPlay, FaClock } from "react-icons/fa";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";
const CustomNode = ({ data, onClick }) => {
  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid #ffffff",
        borderRadius: "10px",
        fontWeight: "400",
        backgroundColor: "#dde4ea",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        width: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      onClick={onClick}
    >
      <strong style={{ fontSize: "1.1rem", color: "#737376" }}>{data.label}</strong>
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "5px",
          marginTop: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#555"}}>{data.message}</p>
      </div>
      <Handle type="target" position="left" style={{ background: "#007bff", marginTop: "10px" }} />
    </div>
  );
};

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: {
      label: "Rename",
      message: "Hi, I'm Wobi's bot, here to help you with your accident. What's your name, is it an accident or theft, and in what city did it happen?",
    },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

function Message() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messageDivRef = useRef(null); 

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params }, eds)), []);

  const addNode = useCallback((label) => {
    const newNode = {
      id: (nodes.length + 1).toString(),
      type: "custom",
      data: {
        label,
        message: `This is a ${label} node.`,
        bgColor: "#e0f7fa"
      },
      position: { x: Math.random() * (window.innerWidth - 100), y: Math.random() * (window.innerHeight - 100) },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes.length]);

  const editNode = useCallback((id, newLabel, newMessage) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, label: newLabel, message: newMessage } }
          : node
      )
    );
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setNewMessage(node.data.message);
  }, []);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    if (window.confirm(`Delete node "${node.data.label}"?`)) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    }
  }, []);

  const handleMessageChange = (event) => {
    setNewMessage(event.target.value); // Update the message as it is being edited
  };

  const handleSaveMessage = () => {
    if (selectedNode) {
      editNode(selectedNode.id, selectedNode.data.label, newMessage); // Save the new message to the node
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {

      if (messageDivRef.current && !messageDivRef.current.contains(event.target)) {
        console.log("Outside click detected");
        setSelectedNode(null); // Close the message div
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  

  const handlePlay = () => {
    alert("Playing the bot message! (This is a placeholder action.)");
  };

  const handleBold = () => {
    setNewMessage((prevMessage) => `<b>${prevMessage}</b>`); // Apply bold
  };

  const handleItalic = () => {
    setNewMessage((prevMessage) => `<i>${prevMessage}</i>`); // Apply italic
  };

  const handleUnderline = () => {
    setNewMessage((prevMessage) => `<u>${prevMessage}</u>`); // Apply underline
  };

  const handleMidline = () => {
    setNewMessage((prevMessage) => `<s>${prevMessage}</s>`); // Apply strikethrough
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      setNewMessage((prevMessage) => `<a href="${url}">${prevMessage}</a>`); // Insert link
    }
  };
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onConnect={onConnect}
          fitView
          nodeTypes={nodeTypes}
          style={{ backgroundColor: "#f0f0f0" }}
          nodesDraggable={true}
          onNodeClick={onNodeClick}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeContextMenu={onNodeContextMenu}
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {/* Add Node Dropdown */}
        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: "1000" }}>
          <select
            onChange={(e) => {
              if (e.target.value) {
                addNode(e.target.value);
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
      </div>
      <div
        ref={messageDivRef}
        style={{
          width: "300px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          borderLeft: "1px solid #ddd",
          display: selectedNode ? "block" : "none",
        }}
      >
        <h3>Message</h3>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ marginBottom: '5px' }}>
            <button onClick={handlePlay} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaPlay /></button>
            <button onClick={handleBold} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaBold /></button>
            <button onClick={handleItalic} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaItalic /></button>
            <button onClick={handleUnderline} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaUnderline /></button>
            <button onClick={handleMidline} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaStrikethrough /></button>
            <button onClick={handleInsertLink} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaLink /></button>
            <button onClick={handleInsertLink} style={{ marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaClock /></button>
          </div>
          <textarea
            value={newMessage}
            onChange={handleMessageChange}
            rows="6"
            style={{ width: "100%", padding: "5px", fontSize: "16px" }}
          />
        </div>
        <hr></hr>
        <strong>Variants</strong>
        <button onClick={handlePlay} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9", float: 'right' }}>+</button>
        <br></br>
        <br></br>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ marginBottom: '5px' }}>
            <button onClick={handlePlay} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9", float: 'right' }}>-</button>
            <button onClick={handlePlay} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaPlay /></button>
            <button onClick={handleBold} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaBold /></button>
            <button onClick={handleItalic} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaItalic /></button>
            <button onClick={handleUnderline} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaUnderline /></button>
            <button onClick={handleMidline} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaStrikethrough /></button>
            <button onClick={handleInsertLink} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaLink /></button>
            <button onClick={handleInsertLink} style={{  marginRight: "5px", border:'none', backgroundColor: "#f9f9f9" }}><FaClock /></button>
          </div>
          <textarea
            value={newMessage}
            onChange={handleMessageChange}
            rows="6"
            style={{ width: "100%", padding: "5px", fontSize: "16px" }}
          />
          <button style={{ marginTop: '5px', border: '1px solid black', borderRadius: '4px' }}>Condition</button>
        </div>
        <hr></hr>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center"}}>
            <button
              onClick={handleSaveMessage}
              style={{
                padding: "10px",
                backgroundColor: "#007bff",
                color: "#fff",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                marginTop: "10px"
              }}
            >
              Generate
            </button>
          </div>
      </div>
    </div>
  );
}

export default Message;
