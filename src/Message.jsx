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
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaLink, FaPlay, FaClock, FaRobot, FaMinus, FaCommentAlt } from "react-icons/fa";
import { FcSms, FcList } from "react-icons/fc";
import { PiBracketsSquareFill, PiCornersOut, PiContactlessPayment, PiChalkboardTeacher } from "react-icons/pi";
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
        backgroundColor: `${data.style.backgroundColor}`,
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
        <p
          style={{ margin: 0, fontSize: "0.95rem", color: "#555" }}
          dangerouslySetInnerHTML={{ __html: data.message }}
        ></p>
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
      style: { backgroundColor: '#dde4ea' }
    },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];

const Message = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedColorNode, setSelectedColorNode] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messageDivRef = useRef(null);
  const conditionDivRef = useRef(null);
  const [variants, setVariants] = useState([{ id: 0, message: "" }]);
  const [visibleCondition, setVisibleCondition] = useState(null);
  const [conditionValues, setConditionValues] = useState({});
  const [variantConditions, setVariantConditions] = useState({});
  const [conditions, setConditions] = useState([{ id: 1 }]);
  const [conditionCount, setConditionCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  //state to manage color
  const [selectedColorValue, setSelectedColorValue] = useState(255);

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
        style: { backgroundColor: '#dde4ea' }
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
  const editNodeColor = useCallback((id, newColor) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              style: { ...node.data.style, backgroundColor: newColor }
            }
          }
          : node
      )
    );
  }, []);


  const onNodeClick = useCallback((event, node) => {
    setNewMessage(node.data.message);
    setSelectedNode(prevNode => {
      if (prevNode && prevNode.id === node.id) {
        // If clicking the same node, hide the message dashboard
        // return null;
        setSelectedNode(node);
      } else {
        // If clicking a different node, show its message
        setNewMessage(node.data.message);
        return node;
      }
    });
    setContextMenuPosition(null);
    setVisibleCondition(null);
  }, []);

  const onNodeContextMenu = useCallback((event, node) => {

    event.preventDefault();
    event.stopPropagation();
    setVisibleCondition(null);
    setContextMenuPosition({ x: event.clientX, y: event.clientY });
    // if (window.confirm(`Delete node "${node.data.label}"?`)) {
    //   setNodes((nds) => nds.filter((n) => n.id !== node.id));
    //   setEdges((eds) => eds.filter((edge) => edge.source !== node.id && edge.target !== node.id));
    // }
    if (event.button == 2) {
      setSelectedColorNode(node)
    } else if (event.button == 1) {
      setSelectedNode(node)
    }
  }, []);
  const handleColorChange = (color) => {
    setSelectedColorValue(color);
    // setCircleColors(circleColors.map((_, index) => (index === 0 ? color : circleColors[index])));
    editNodeColor(selectedColorNode.id, color);
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
    setVisibleCondition(null);
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
    console.log("ddd---", variantConditions[variantId]);
    const openedConditionValue = variantConditions[variantId] || {};
    setConditionValues(openedConditionValue);

    setVisibleCondition(prevCondition =>
      prevCondition && prevCondition.variantId === variantId ? null : { variantId, activeTab: "all" }
    );

    if (!variantConditions[variantId] || Object.keys(variantConditions[variantId]).length === 0) {
      setVariantConditions(prevConditions => ({
        ...prevConditions,
        [variantId]: {}
      }));
    }
  };
  const setActiveTabForCondition = (tab) => {
    setVisibleCondition(prevCondition =>
      prevCondition ? { ...prevCondition, activeTab: tab } : null
    );
  };
  const addCondition = () => {
    setConditionCount(prevCount => prevCount + 1);
    setConditions((prevConditions) => [
      ...prevConditions,
      { id: prevConditions.length + 1 }
    ]);
    // setConditionValues((prevValues) => [...prevValues, '']);
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
    setIsDropdownOpen(false);
  };
  // const handleConditionChange = (index, value) => {
  //   const updatedConditions = [...conditionValues];
  //   updatedConditions[index] = value;
  //   setConditionValues(updatedConditions);
  // };
  const handleConditionChange = (variantId, conditionId, value) => {

    console.log("---->>>>>", variantConditions)
    setConditionValues(prev => ({
      ...prev,
      [conditionId]: value
    }));

    setVariantConditions(prev => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [conditionId]: value
      }
    }));
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
              borderRadius: '8px',
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
              zIndex: '100',
              padding: '15px',
              width: '200px',
            }}
          >
            {/* Range input for color selection */}
            {/* <input
            type="range"
            min="0"
            max="255"
            value={selectedColorValue} // Assume you have a state for this
            onChange={(e) => handleRangeChange(e.target.value)} // Define this function to handle changes
            style={{
              margin: '10px 0',
              width: '100%',
              accentColor: '#007BFF', // Modern styling for range thumb
            }}
          /> */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              {[
                { color: "#ff0000", label: "Red" },
                { color: "#00ff00", label: "Green" },
                { color: "#0000ff", label: "Blue" },
                { color: "#ffff00", label: "Yellow" },
              ].map(({ color, label }) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  aria-label={`Select ${label}`}
                  style={{
                    backgroundColor: color,
                    border: "none",
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    margin: '5px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.1)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                />
              ))}
            </div>
          </div>

        )}
        {/* <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: "1000" }}>
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
                left: "100%",
                marginLeft: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                zIndex: "1001",
                width: "150px",
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
        </div> */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            zIndex: "1000",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            backgroundColor: '#ffffff',
            padding: '10px',
            borderRadius: '15px'
          }}

        >
          <div style={{ position: "relative" }} onMouseEnter={toggleDropdown}
            onMouseLeave={toggleDropdown}>
            <PiContactlessPayment
              size={40}
              color="#333"
              style={{
                cursor: "pointer",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Talk
            </div>
            {isDropdownOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "0",
                  left: "100%",
                  marginLeft: "10px",
                  backgroundColor: "#fff",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  zIndex: "1001",
                  width: "150px",
                  borderRadius: '5px'
                }}
              >
                <div
                  onClick={() => handleNodeSelection("Message Node")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                    transition: "background-color 0.4s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <FcSms size={20} color="#333" />
                  <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#333" }}>
                    Message Node
                  </span>
                </div>
                {/* <div
                  onClick={() => handleNodeSelection("Decision Node")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px",
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                    transition: "background-color 0.2s ease, transform 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#f5f5f5";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  <FaRobot size={20} color="#333" />
                  <span style={{ fontSize: "0.95rem", fontWeight: "500", color: "#333" }}>
                    Decision Node
                  </span>
                </div> */}
              </div>
            )}

          </div>
          <div style={{ position: "relative" }}>
            <PiChalkboardTeacher
              size={40}
              color="#333"
              style={{
                cursor: "pointer",
              }}
            />
            <div
              style={{
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Listen
            </div>
          </div>
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
            backgroundColor: "#007BFF",
            color: '#fff',
            fontSize: '24px',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            float: 'right',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'}
        >
          +
        </button>
        <br></br>
        <br></br>
        {variants.map((variant) => (
          <div key={variant.id} style={{ marginBottom: "10px", marginTop: '15px', paddingBotton: '10px', borderBottom: '1px solid #ddd' }}>
            <button
              style={{
                border: 'none',
                backgroundColor: "#007BFF",
                color: '#fff',
                fontSize: '20px',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                float: 'right',
              }}
              onClick={() => removeVariant(variant.id)}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
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
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '8px 12px',
                marginTop: '5px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9',
                color: '#333',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background-color 0.3s, border-color 0.3s',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e6e6e6';
                e.currentTarget.style.borderColor = '#999';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                e.currentTarget.style.borderColor = '#ccc';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.backgroundColor = '#dcdcdc';
                e.currentTarget.style.borderColor = '#666';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.backgroundColor = '#e6e6e6';
                e.currentTarget.style.borderColor = '#999';
              }}
              onClick={() => handleCondition(variant.id)}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <PiCornersOut size={19} />
              </span>
              Condition
              {/* Uncomment and adjust the conditional rendering logic as needed */}
              {/* {conditions.length === 1 && conditionValues[index] === '' ? ' Condition' : ' ' + conditions.length} */}
            </button>

            {visibleCondition !== null && (
              <div
                ref={conditionDivRef}
                style={{
                  width: "350px",
                  height: `${50 + (conditionCount - 1) * 31}px`,
                  maxHeight: '50%',
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
                  transition: "height 0.3s ease-in-out",
                  overflowY: "visible"
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
                    <input
                      onChange={(e) => handleConditionChange(visibleCondition.variantId, condition.id, e.target.value)}
                      value={variantConditions[visibleCondition.variantId]?.[condition.id] || ''}
                      type="text"
                      placeholder="value or {var}"
                      style={{ backgroundColor: "#f9f9f9", marginRight: "5px", border: 'none', outline: 'none' }}
                    />
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
              width: '100%',
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007BFF'}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default Message;
