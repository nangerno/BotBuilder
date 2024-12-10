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
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);

  const handleLabelClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelChange = (e) => {
    setEditedLabel(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
    }
  };

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
      {isEditing ? (
        <input
          type="text"
          value={editedLabel}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          autoFocus
          style={{
            fontSize: "1.1rem",
            color: "#737376",
            fontWeight: "bold",
            border: "none",
            background: "transparent",
            width: "100%"
          }}
        />
      ) : (
        <strong
          style={{ fontSize: "1.1rem", color: "#737376", cursor: "pointer" }}
          onClick={handleLabelClick}
        >
          {editedLabel}
        </strong>
      )}
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "5px",
          marginTop: "10px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#555" }}>{data.message}</p>
      </div>
      <Handle type="target" position="left" style={{ background: "#007bff", marginTop: "10px" }} />
      <Handle type="source" position="right" style={{ background: "#007bff", marginTop: "10px" }} />
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
  const conditionDivRef = useRef(null);
  const [variants, setVariants] = useState([{ id: 0, message: "" }]);
  const [visibleCondition, setVisibleCondition] = useState(null);
  const [conditions, setConditions] = useState([{ id: 1 }]);
  const [conditionCount, setConditionCount] = useState(1);


  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({
    ...params, type: 'smoothstep',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: '#888888',
    }
  }, eds)), []);

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
    // setSelectedNode(node);
    setNewMessage(node.data.message);
    setSelectedNode(prevNode => {
      if (prevNode && prevNode.id === node.id) {
        // If clicking the same node, hide the message dashboard
        return null;
      } else {
        // If clicking a different node, show its message
        setNewMessage(node.data.message);
        return node;
      }
    });
  }, []);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    if (window.confirm(`Delete node "${node.data.label}"?`)) {
      setNodes((nds) => nds.filter((n) => n.id !== node.id));
      setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    }
  }, []);

  const handleMessageChange = (id, value) => {
    if (id === 'main') {
      setNewMessage(value);
    } else {
      setVariants(prevVariants =>
        prevVariants.map(variant =>
          variant.id === id ? { ...variant, message: value } : variant
        )
      );
    }
    // setVariants(variants.map(variant =>
    //   variant.id === id ? { ...variant, message: value } : variant
    // ));
    // setNewMessage(event.target.value);
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
        // setSelectedNode(null);
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
    setNewMessage((prevMessage) => `<b>${prevMessage}</b>`);
  };

  const handleItalic = () => {
    setNewMessage((prevMessage) => `<i>${prevMessage}</i>`);
  };

  const handleUnderline = () => {
    setNewMessage((prevMessage) => `<u>${prevMessage}</u>`);
  };

  const handleMidline = () => {
    setNewMessage((prevMessage) => `<s>${prevMessage}</s>`);
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      setNewMessage((prevMessage) => `<a href="${url}">${prevMessage}</a>`);
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
  const addVariant = () => {
    setVariants([...variants, { id: variants.length, message: "" }]);
  };

  const removeVariant = (variantId) => {
    setVariants(prevVariants => prevVariants.filter(v => v.id !== variantId));

    // Remove the condition div if it's visible for the removed variant
    setVisibleCondition(prevCondition =>
      prevCondition && prevCondition.variantId === variantId ? null : prevCondition
    );
  };
  const handleCondition = (variantId) => {
    setVisibleCondition(prevCondition =>
      prevCondition && prevCondition.variantId === variantId ? null : { variantId, activeTab: "all" }
    );
  };
  const setActiveTabForCondition = (tab) => {
    setVisibleCondition(prevCondition =>
      prevCondition ? { ...prevCondition, activeTab: tab } : null
    );
  };
  const addCondition = () => {
    setConditionCount(prevCount => prevCount + 1);
    setConditions([...conditions, { id: conditions.length + 1 }]);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(condition => condition.id !== id));
    setConditionCount(prevCount => Math.max(1, prevCount - 1));
  };

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
          {/* <MiniMap /> */}
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
      {visibleCondition !== null && (
        <div
          ref={conditionDivRef}
          style={{
            width: "350px",
            height: `${50 + (conditionCount - 1) * 40}px`,
            backgroundColor: "#f9f9f9",
            padding: "20px",
            borderLeft: "1px solid #ddd",
            display: visibleCondition !== null ? "block" : "none",
            position: "absolute",
            top: `${350 + variants.findIndex(v => v.id === visibleCondition.variantId) * 100}px`,
            right: "350px",
            overflow: "hidden",
            borderRadius: '10px',
            zIndex: 10001,
            transition: "height 0.3s ease-in-out"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #ddd", width: "70%" }}>
              <div
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: visibleCondition.activeTab === "all" ? "#fff" : "#f0f0f0",
                  borderBottom: visibleCondition.activeTab === "all" ? "2px solid #007bff" : "none"
                }}
                onClick={() => setActiveTabForCondition("all")}
              >
                Match all
              </div>
              <div
                style={{
                  padding: "5px 10px",
                  cursor: "pointer",
                  backgroundColor: visibleCondition.activeTab === "any" ? "#fff" : "#f0f0f0",
                  borderBottom: visibleCondition.activeTab === "any" ? "2px solid #007bff" : "none"
                }}
                onClick={() => setActiveTabForCondition("any")}
              >
                Match any
              </div>
            </div>
            <div>
              <button style={{ marginRight: "5px", cursor: 'pointer' }}>?</button>
              <button style={{ cursor: 'pointer' }} onClick={addCondition}>+</button>
            </div>
          </div>
          {conditions.map((condition, index) => (
            <div key={condition.id} style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <p style={{ margin: "0 5px" }}>if</p>
              <select style={{ marginRight: "15px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <option>variable</option>
              </select>
              <p style={{ margin: "0 5px" }}>is</p>
              <input type="text" placeholder="value or {var}" style={{ backgroundColor: "#f9f9f9", marginRight: "5px", border: 'none' }} />
              <button
                style={{
                  cursor: conditions.length > 1 ? 'pointer' : 'not-allowed',
                  opacity: conditions.length > 1 ? 1 : 0.5
                }}
                onClick={() => conditions.length > 1 && removeCondition(condition.id)}
                disabled={conditions.length === 1}
              >
                -
              </button>
            </div>
          ))}
        </div>
      )}
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
            <button onClick={handlePlay} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaPlay /></button>
            <button onClick={handleBold} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaBold /></button>
            <button onClick={handleItalic} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaItalic /></button>
            <button onClick={handleUnderline} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaUnderline /></button>
            <button onClick={handleMidline} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaStrikethrough /></button>
            <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaLink /></button>
            <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaClock /></button>
          </div>
          <textarea
            value={newMessage}
            placeholder="Enter agent message"
            onChange={(e) => {
              handleMessageChange('main', e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = e.target.scrollHeight + 'px';
            }}
            rows="6"
            style={{
              width: "100%",
              padding: "5px",
              fontSize: "16px",
              border: 'none',
              resize: 'none',
              overflow: 'hidden',
              boxSizing: 'border-box',
              border: 'none',
              outline: 'none',
              backgroundColor: "#f9f9f9"
            }}
          />
        </div>
        <hr></hr>
        <strong>Variants</strong>
        <button onClick={addVariant} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9", float: 'right' }}>+</button>
        <br /><br />
        {variants.map((variant, index) => (
          <div key={variant.id} style={{ marginBottom: "10px" }}>
            <div style={{ marginBottom: '5px' }}>
              <button
                onClick={() => removeVariant(variant.id)}
                style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9", float: 'right' }}
              >
                -
              </button>
              <button onClick={handlePlay} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaPlay /></button>
              <button onClick={handleBold} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaBold /></button>
              <button onClick={handleItalic} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaItalic /></button>
              <button onClick={handleUnderline} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaUnderline /></button>
              <button onClick={handleMidline} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaStrikethrough /></button>
              <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaLink /></button>
              <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaClock /></button>
            </div>
            <textarea
              value={variant.message}
              placeholder="Enter agent message"
              onChange={(e) => {
                handleMessageChange(variant.id, e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              rows="1"
              style={{
                width: "100%",
                padding: "5px",
                fontSize: "16px",
                border: 'none',
                resize: 'none',
                overflow: 'hidden',
                boxSizing: 'border-box',
                border: 'none',
                outline: 'none',
                backgroundColor: "#f9f9f9"

              }}
            />
            <button
              style={{ marginTop: '5px', border: '1px solid black', borderRadius: '4px' }}
              onClick={() => handleCondition(variant.id)}
            >
              Condition
            </button>
          </div>
        ))}
        <hr></hr>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <button
            onClick={handleSaveMessage}
            style={{
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              borderRadius: "5px",
              border: "none",
              cursor: "pointer",
              marginTop: "10px",
              width: '100%'
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
