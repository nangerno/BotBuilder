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
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaLink, FaPlay, FaClock, FaRobot, FaMinus } from "react-icons/fa";
import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";

const CustomNode = ({ data, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);
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
        border: "2px solid rgb(245, 242, 242)",
        borderRadius: "10px",
        fontWeight: "400",
        backgroundColor: "#dde4ea",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
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
            width: "100%",
            pointerEvents: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
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
          border: '1px solid #007bff',
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <p style={{ margin: 0, fontSize: "0.95rem", color: "#555" }}>{data.message}</p>
      </div>
      <Handle
        type="target"
        position="left"
        style={{
          background: isHovered ? "#007bff" : "transparent",
          border: isHovered ? "" : "none",
          marginTop: "10px",
          transition: "background-color 0.3s ease"
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
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
  const [isFocused, setIsFocused] = useState(false);
  //state to manage color
  const [selectedColorValue, setSelectedColorValue] = useState(255);
  const [circleColors, setCircleColors] = useState(["#ff0000", "#00ff00", "#0000ff", "#ffff00"]);

  const [contextMenuPosition, setContextMenuPosition] = useState(null);

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
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    console.log("yes")
    // if (window.confirm(`Delete node "${node.data.label}"?`)) {
    //   setNodes((nds) => nds.filter((n) => n.id !== node.id));
    //   setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    // }
  }, []);
  const handleColorChange = (color) => {
    setSelectedColorValue(color);
    // Example logic to change circle colors
    setCircleColors(circleColors.map((_, index) => (index === 0 ? color : circleColors[index])));

    // Hide context menu after selection
    setContextMenuPosition(null);
  };

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
      const currentContent = document.getElementById('messageInput').innerHTML;
      editNode(selectedNode.id, selectedNode.data.label, currentContent);
    }
    setSelectedNode(null);
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

  const handleFormatText = (format) => {
    document.execCommand(format);
    // Update the message to reflect changes
    handleMessageChange(newMessage);
  };

  const handlePlay = () => {
    const currentContent = document.getElementById('messageInput').innerHTML;
    setNewMessage(currentContent);
    editNode(selectedNode.id, selectedNode.data.label, currentContent);
  };
  const handleDelay = () => {
    alert("Delay Action");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      document.execCommand('createLink', false, url);
      handleMessageChange(newMessage);
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
  const handleRangeChange = (value) => {
    setSelectedColorValue(value);
    handleColorChange(`rgb(${value}, 0, 0)`);
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  const handleNodeSelection = (nodeType) => {
    addNode(nodeType);
    setIsDropdownOpen(false); // Close dropdown after selection
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
        {contextMenuPosition && (
          <div
            style={{
              position: 'absolute',
              top: contextMenuPosition.y,
              left: contextMenuPosition.x,
              backgroundColor: 'white',
              borderRadius: '5px',
              boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
              zIndex: '100',
              padding: '10px',
            }}
          >
            {/* Range input for color selection */}
            <input
              type="range"
              min="0"
              max="255"
              value={selectedColorValue} // Assume you have a state for this
              onChange={(e) => handleRangeChange(e.target.value)} // Define this function to handle changes
              style={{ marginTop: '10px', width: '100%' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <button
                onClick={() => handleColorChange("#ff0000")}
                style={{
                  backgroundColor: "#ff0000",
                  color: "white",
                  border: "none",
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '5px'
                }}
              />
              <button
                onClick={() => handleColorChange("#00ff00")}
                style={{
                  backgroundColor: "#00ff00",
                  color: "white",
                  border: "none",
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '5px'
                }}
              />
              <button
                onClick={() => handleColorChange("#0000ff")}
                style={{
                  backgroundColor: "#0000ff",
                  color: "white",
                  border: "none",
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '5px'
                }}
              />
              <button
                onClick={() => handleColorChange("#ffff00")}
                style={{
                  backgroundColor: "#ffff00",
                  color: "black",
                  border: "none",
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  margin: '5px'
                }}
              />


            </div>
          </div>
        )}
        <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: "1000" }}>
          <FaRobot
            size={40}
            color="#333"
            style={{
              cursor: "pointer",
            }}
            onClick={toggleDropdown}
          />

          {isDropdownOpen && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "100%", // Position the dropdown to the right of the icon
                marginLeft: "10px", // Space between the icon and the dropdown
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: "1001",
                width: "150px", // Adjust dropdown width
              }}
            >
              <div
                onClick={() => handleNodeSelection("Decision Node")}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Decision Node
              </div>
              <div
                onClick={() => handleNodeSelection("Action Node")}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                }}
              >
                Action Node
              </div>
            </div>
          )}
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
            border: "1px solid #ddd",
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
              <select style={{ marginRight: "15px", border: 'none', backgroundColor: "#f9f9f9", outline: 'none' }}>
                <option>variable</option>
              </select>
              <p style={{ margin: "0 5px" }}>is</p>
              <input type="text" placeholder="value or {var}" style={{ backgroundColor: "#f9f9f9", marginRight: "5px", border: 'none', outline: 'none' }} />
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
        <h3 style={{ borderBottom: "1px solid #ddd", padding: '10px' }}>Message</h3>
        <div style={{ marginBottom: "10px", borderBottom: '1px solid #ddd' }}>
          <div>
            <button onClick={handlePlay} style={{ marginRight: "5px", marginBottom: '5px', border: 'none', backgroundColor: "#f9f9f9" }}><FaPlay /></button>
            <button onClick={() => handleFormatText('bold')} style={{ marginRight: "5px", marginBottom: '5px', border: 'none', backgroundColor: "#f9f9f9" }}><FaBold /></button>
            <button onClick={() => handleFormatText('italic')} style={{ marginRight: "5px", marginBottom: '5px', border: 'none', backgroundColor: "#f9f9f9" }}><FaItalic /></button>
            <button onClick={() => handleFormatText('underline')} style={{ marginRight: "5px", marginBottom: '5px', border: 'none', backgroundColor: "#f9f9f9" }}><FaUnderline /></button>
            <button onClick={() => handleFormatText('strikeThrough')} style={{ marginRight: "5px", marginBottom: '5px', border: 'none', backgroundColor: "#f9f9f9" }}><FaStrikethrough /></button>
            <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', marginBottom: '5px', backgroundColor: "#f9f9f9" }}><FaLink /></button>
            <button onClick={handleDelay} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}><FaClock /></button>
          </div>
          <div style={{ position: 'relative' }}>
            {!isFocused && !newMessage && (
              <span style={{
                position: 'absolute',
                left: '5px',
                top: '5px',
                color: '#aaa',
                pointerEvents: 'none',
              }}>
                {/* Enter your message... */}
              </span>
            )}
            <div
              id="messageInput"
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
              style={{
                minHeight: '100px',
                paddingTop: '10px',
                fontSize: '16px',
                backgroundColor: "#f9f9f9",
                outline: 'none',
                border: 'none'
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              dangerouslySetInnerHTML={{ __html: newMessage }}
            />
          </div>
        </div>
        <strong>Variants</strong>
        <button
  onClick={addVariant}
  style={{
    border: 'none',
    backgroundColor: "#007BFF", // Vibrant blue color
    color: '#fff', // White text for contrast
    fontSize: '24px', // Adjusted font size for a circular button
    width: '20px', // Set width
    height: '20px', // Set height to match width for a perfect circle
    borderRadius: '50%', // Make the button fully circular
    display: 'flex', // Center the text horizontally and vertically
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer', // Pointer cursor on hover
    transition: 'all 0.3s ease', // Smooth transition for hover effects
    float: 'right', // Keep floating right if necessary
  }}
  onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'} // Darker blue on hover
  onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'} // Return to original color
>
  +
</button>
  <br></br>
  <br></br>
        {variants.map((variant, index) => (
          <div key={variant.id} style={{ marginBottom: "10px", marginTop: '15px', paddingBotton: '10px', borderBottom: '1px solid #ddd' }}>
            <button
              onClick={() => removeVariant(variant.id)}
              style={{
                border: 'none',
                backgroundColor: "#007BFF", // Vibrant blue color
                color: '#fff', // White text for contrast
                fontSize: '24px', // Adjusted font size for a circular button
                width: '20px', // Set width
                height: '20px', // Set height to match width for a perfect circle
                borderRadius: '50%', // Make the button fully circular
                display: 'flex', // Center the text horizontally and vertically
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer', // Pointer cursor on hover
                transition: 'all 0.3s ease', // Smooth transition for hover effects
                float: 'right', // Keep floating right if necessary
              }}
            >
              -
            </button>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <button onClick={handlePlay} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaPlay />
              </button>
              <button onClick={() => handleFormatText('bold')} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaBold />
              </button>
              <button onClick={() => handleFormatText('italic')} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaItalic />
              </button>
              <button onClick={() => handleFormatText('underline')} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaUnderline />
              </button>
              <button onClick={() => handleFormatText('strikeThrough')} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaStrikethrough />
              </button>
              <button onClick={handleInsertLink} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaLink />
              </button>
              <button onClick={handleDelay} style={{ marginRight: "5px", border: 'none', backgroundColor: "#f9f9f9" }}>
                <FaClock />
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              {!isFocused && !variant.message && (
                <span style={{
                  position: 'absolute',
                  left: '5px',
                  top: '5px',
                  color: '#aaa',
                  pointerEvents: 'none',
                }}>
                  {/* Enter your message... */}
                </span>
              )}
              <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
                style={{
                  minHeight: '10px',
                  padding: '5px',
                  fontSize: '16px',
                  backgroundColor: "#f9f9f9",
                  border: 'none',
                  outline: 'none'
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                dangerouslySetInnerHTML={{ __html: variant.message }}
              />
            </div>
            <button
              style={{ marginTop: '5px', marginBottom: '10px', border: '1px solid black', borderRadius: '4px' }}
              onClick={() => handleCondition(variant.id)}
            >
              Condition
            </button>
          </div>
        ))}

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
              // marginTop: "10px",
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
