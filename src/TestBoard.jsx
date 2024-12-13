import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
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
import MessageNode from "./node/MessageNode";
import MsgPanel from "./MsgPanel";

const initialNodes = [
  {
    id: "1",
    type: "custom",
    data: {
      label: "Message node 1",
      message:
        "Hi, I'm Wobi's bot, here to help you with your accident. What's your name, is it an accident or theft, and in what city did it happen?",
      style: { backgroundColor: "#dde4ea" },
    },
    position: { x: 100, y: 100 },
  },
];

const initialEdges = [];
const TestBoard = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);

  const [selectedColorNode, setSelectedColorNode] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messageDivRef = useRef(null);
  const conditionDivRef = useRef(null);
  const [variants, setVariants] = useState([{ id: 0, message: "" }]);
  
  const [variantConditions, setVariantConditions] = useState({"0":{"0":""}});
  
  const [conditionCount, setConditionCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const nodeTypes = useMemo(() => ({ custom: MessageNode }), []);

  const [variableData, setVariableData] = useState([]);
  const [variableType, setVariableTypeData] = useState([]);
  const [appliedColor, setAppliedColor] = useState(null);

  //valid
  const [visibleCondition, setVisibleCondition] = useState(null);
  const [conditions, setConditions] = useState([{ id: 0 }]);

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
    (label) => {
      const count = nodes.reduce((acc, node) => {
        if (node.data.label.includes(label)) {
          return acc + 1;
        }
        return acc;
      }, 1);
      const newNode = {
        id: (nodes.length + 1).toString(),
        type: "custom",
        data: {
          label: `${label} ${count}`,
          message: `${label} ${count}`,
          style: { backgroundColor: "#dde4ea" },
        },
        position: {
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [nodes.length]
  );

  const editNode = useCallback((id, newLabel, newMessage) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: { ...node.data, label: newLabel, message: newMessage },
            }
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
                style: { ...node.data.style, backgroundColor: newColor },
              },
            }
          : node
      )
    );
  }, []);

  const onNodeClick = useCallback((event, node) => {
    setNewMessage(node.data.message);
    setSelectedNode((prevNode) => {
      if (prevNode && prevNode.id === node.id) {
        setSelectedNode(node);
      } else {
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
    if (event.button == 2) {
      setSelectedColorNode(node);
    } else if (event.button == 1) {
      setSelectedNode(node);
    }
  }, []);
  const handleColorChange = (color) => {
    setAppliedColor(color);
    editNodeColor(selectedColorNode.id, color);
    setContextMenuPosition(null);
  };

  const handleMessageChange = (id, value) => {
    if (id === "main") {
      setNewMessage(value);
    } else {
      setVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === id ? { ...variant, message: value } : variant
        )
      );
    }
  };

  const handleSaveMessage = () => {
    if (selectedNode) {
      const currentContent = document.getElementById("messageInput").innerHTML;
      editNode(selectedNode.id, selectedNode.data.label, currentContent);
    }
    setSelectedNode(null);
    setVisibleCondition(null);
  };

  const handleFormatText = (format) => {
    document.execCommand(format);
    handleMessageChange(newMessage);
  };

  const handlePlay = () => {
    const currentContent = document.getElementById("messageInput").innerHTML;
    setNewMessage(currentContent);
    editNode(selectedNode.id, selectedNode.data.label, currentContent);
  };
  const handleDelay = () => {
    console.log("handleDelay func is comming soon!");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      document.execCommand("createLink", false, url);
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




  const setActiveTabForCondition = (tab) => {
    setVisibleCondition((prevCondition) =>
      prevCondition ? { ...prevCondition, activeTab: tab } : null
    );
  };

  ////Valid function
  const addVariant = () => {
    setVariants([...variants, { id: variants.length, message: "" }]);
  };

  const removeVariant = (variantId) => {
    setVariants((prevVariants) =>
      prevVariants.filter((v) => v.id !== variantId)
    );
    // remove variant and rearrange id
    const filteredVariants = variants.filter((variant)=> variant.id!== variantId);
    setVariants(
        filteredVariants.map((variant, index) => ({
            ...variant,
            id: index
        }))
    )
    setVisibleCondition((prevCondition) =>
      prevCondition && prevCondition.variantId === variantId
        ? null
        : prevCondition
    );
  };

  const handleCondition = (variantId) => {
    setVisibleCondition((prevCondition) =>
      prevCondition && prevCondition.variantId === variantId
        ? null
        : { variantId, activeTab: "all" }
    );
    
  };

  const addCondition = (variantId, conditionId, value) => {

    // setVariantConditions(prevState => ({
    //     ...prevState,
    //     [variantId]: {
    //       ...prevState[variantId],
    //       [conditionId]: "",
    //     }
    //   }));
    console.log({variantId, conditionId, value})
  };

  const removeCondition = (variantId, conditionId) => {
    // remove condtion and rearrange id
    const filteredConditions = conditions.filter((condition) => condition.id !== conditionId);
    setConditions(
        filteredConditions.map((condition, index) => ({
            ...condition,
            id: index
        }))
    )

    
  };

  const handleConditionChange = (variantId, conditionId, value) => {
    setVariantConditions((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [conditionId]: value,
      },
    }));
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
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
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
            zIndex: "100",
            padding: "15px",
            width: "200px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            {[
              { color: "#a1c972", label: "Red" },
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
                  borderRadius: "50%",
                  width: "40px",
                  height: "40px",
                  margin: "5px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            ))}
          </div>
        </div>
      )}
      <MsgPanel
        messageDivRef={messageDivRef}
        conditionDivRef={conditionDivRef}
        isFocused={isFocused}
        setIsFocused={setIsFocused}
        newMessage={newMessage}
        variants={variants}
        variantConditions={variantConditions}
        visibleCondition={visibleCondition}
        conditionCount={conditionCount}
        conditions={conditions}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        handlePlay={handlePlay}
        handleInsertLink={handleInsertLink}
        handleDelay={handleDelay}
        addVariant={addVariant}
        removeVariant={removeVariant}
        handleMessageChange={handleMessageChange}
        handleSaveMessage={handleSaveMessage}
        handleFormatText={handleFormatText}
        handleCondition={handleCondition}
        addCondition={addCondition}
        removeCondition={removeCondition}
        setActiveTabForCondition={setActiveTabForCondition}
        handleConditionChange={handleConditionChange}
        variableData={variableData}
      />
    </div>
  );
};

export default TestBoard;
