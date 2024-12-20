import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useContext,
} from "react";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  MarkerType,
} from "react-flow-renderer";

import "react-flow-renderer/dist/style.css";
import "react-flow-renderer/dist/theme-default.css";
import MessageNode from "./node/MessageNode";
import PromptNode from "./node/PromptNode";
import CaptureNode from "./node/CaptureNode";
import Toolbar from "./Toolbar";
import MessageRightPanel from "./MessageRightPanel";
import PromptRightPanel from "./PromptRightPanel";
import PromptNodeWindow from "./PromptNodeWindow";
import VariantPanel from "./VariantPanel";
import CaptureRightPanel from "./CaptureRightPanel";

const initialNodes = [
  {
    id: "1",
    type: "Message node",
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

const Board = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedColorNode, setSelectedColorNode] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const messageDivRef = useRef(null);
  const conditionDivRef = useRef(null);
  const promptDivRef = useRef(null);
  const promptWindowRef = useRef(null);
  const captureRef = useRef(null);
  const [variants, setVariants] = useState([{ id: 0, message: "" }]);

  const [visibleCondition, setVisibleCondition] = useState(null);
  const [variantConditions, setVariantConditions] = useState({});
  const [conditions, setConditions] = useState([{ id: 1 }]);
  const [conditionCount, setConditionCount] = useState(1);
  const [isFocused, setIsFocused] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [msgNodeTitles, setMsgNodeTitles] = useState({});
  const [promptNodeTitles, setPromptNodeTitles] = useState({});
  const [captureNodeTitles, setCaptureNodeTitles] = useState({});
  const [colorVariable, setColorVariable] = useState("");

  const [selectedItem, setSelectedItem] = useState([]); // Capture node selected item
  const [scenariosItem, setScenarios] = useState([""]); // Capture node scenarioItem
  const [exitPath, setExitPath] = useState(false); // Capture node exit path
  const [newPrompt, setNewPrompt] = useState(""); // System node new prompt

  const updateNodeTitle = useCallback((nodeId, newTitle) => {
    setMsgNodeTitles((prevTitles) => ({
      ...prevTitles,
      [nodeId]: newTitle,
    }));
    setPromptNodeTitles((prevTitles) => ({
      ...prevTitles,
      [nodeId]: newTitle,
    }));
    setCaptureNodeTitles((prevTitles) => ({
      ...prevTitles,
      [nodeId]: newTitle,
    }));
  }, []);

  const updateNodeLabel = useCallback(
    (nodeId, newLabel) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: newLabel } }
            : node
        )
      );
      updateNodeTitle(nodeId, newLabel); // Update the corresponding title
    },
    [updateNodeTitle]
  );

  const nodeTypes = useMemo(
    () => ({
      "Message node": (props) => (
        <MessageNode {...props} updateNodeLabel={updateNodeLabel} />
      ),
      "Prompt node": (props) => (
        <PromptNode {...props} updateNodeLabel={updateNodeLabel} />
      ),
      "Capture node": (props) => (
        <CaptureNode
          {...props}
          updateNodeLabel={updateNodeLabel}
          selectedItem={selectedItem}
          scenariosItem={scenariosItem}
          exitPath={exitPath}
        />
      ),
    }),
    [updateNodeLabel, selectedItem, scenariosItem, exitPath]
  );

  const [variableData, setVariableData] = useState([]);
  const [variableType, setVariableTypeData] = useState([]);
  const [appliedColor, setAppliedColor] = useState(null);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: {
              type: MarkerType.Arrow,
              markerUnits: "userSpaceOnUse",
              width: 20,
              height: 20,
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
        type: label,
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
      // switch (label) {
      //   case "Message node":
      //     return setMsgNodeTitle(`${label} ${count}`);
      //   case "Prompt node":
      //     return setPromptNodeTitle(`${label} ${count}`);
      //   case "Capture node":
      //     return setCaptureNodeTitle(`${label} ${count}`);
      //   default:
      //     return;
      // }
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

  const handleNodeContentChange = (id, value) => {
    if (id === "main") {
      const updatedHtml = highlightMatches(value);
      setNewMessage(updatedHtml);
      // setNewMessage(value);
    } else {
      setVariants((prevVariants) =>
        prevVariants.map((variant) =>
          variant.id === id ? { ...variant, message: value } : variant
        )
      );
    }
  };

  const handlePromptContentChange = (value) => {
    // Prompt node system prompt
    const updatedHtml = highlightMatches(value);
    setNewPrompt(updatedHtml);
  };

  const highlightMatches = (html) => {
    if (!variableData || variableData.length === 0) return html;
    const escapedData = variableData.map((text) =>
      text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    );
    const wordRegex = new RegExp(
      `(<span[^>]*>)*\\{*(?:${escapedData.join("|")})\\}*(</span>)*`,
      "gi"
    );
    const cleanUpMatch = (match) => {
      let cleaned = match.replace(/<\/?span[^>]*>/gi, "");
      cleaned = cleaned.replace(/[{}]/g, "");
      return `<span style="color: blue;">{${cleaned}}</span>`;
    };
    let result = html.replace(wordRegex, cleanUpMatch);
    return result;
  };

  const handleSaveMessage = () => {
    if (selectedNode) {
      const currentContent =
        document.getElementById("nodeContentDiv").innerHTML;
      editNode(selectedNode.id, selectedNode.data.label, currentContent);
    }
    setSelectedNode(null);
    setVisibleCondition(null);
  };

  const handleExtendWindow = () => {
    // if (selectedNode) {
    //   const currentContent = document.getElementById("nodeContentDiv").innerHTML;
    //   editNode(selectedNode.id, selectedNode.data.label, currentContent);
    // }
    // setSelectedNode(null);
    setIsOpenModal((prevState) => !prevState);
    // setVisibleCondition(null);
  };

  const handleFormatText = (format) => {
    document.execCommand(format);
    handleNodeContentChange(newMessage);
  };

  const handlePlay = () => {
    const currentContent = document.getElementById("nodeContentDiv").innerHTML;
    setNewMessage(currentContent);
    editNode(selectedNode.id, selectedNode.data.label, currentContent);
  };
  const handleDelay = () => {
    alert("😊Comming Soon!");
  };

  const handleInsertLink = () => {
    const url = prompt("Enter the URL");
    if (url) {
      document.execCommand("createLink", false, url);
      handleNodeContentChange(newMessage);
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
    setVariants((prevVariants) =>
      prevVariants.filter((v) => v.id !== variantId)
    );
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

    if (
      !variantConditions[variantId] ||
      Object.keys(variantConditions[variantId]).length === 0
    ) {
      setVariantConditions((prevConditions) => ({
        ...prevConditions,
        [variantId]: {},
      }));
    }
  };
  const setActiveTabForCondition = (tab) => {
    setVisibleCondition((prevCondition) =>
      prevCondition ? { ...prevCondition, activeTab: tab } : null
    );
  };
  const addCondition = () => {
    setConditionCount((prevCount) => prevCount + 1);
    setConditions((prevConditions) => [
      ...prevConditions,
      { id: prevConditions.length + 1 },
    ]);
  };

  const removeCondition = (variantId, conditionId) => {
    setVariantConditions((prev) => ({
      ...prev,
      [variantId]: {
        ...prev[variantId],
        [conditionId]: "",
      },
    }));
    setConditions(
      conditions.filter((condition) => condition.id !== conditionId)
    );
    setConditionCount((prevCount) => Math.max(1, prevCount - 1));
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
  const handleClickColor = (color) => {
    setColorVariable(color);
  };
  const renderConditionLength = (variantId) => {
    const conditionsForVariant = variantConditions[variantId] || {};
    const conditionCount = Object.keys(conditionsForVariant).length;
    return conditionCount === 1 ? " Condition" : " " + conditionCount;
  };

  const renderNodeComponent = () => {
    if (!selectedNode) return null;

    switch (selectedNode.type) {
      case "Prompt node":
        return isOpenModal ? (
          <PromptNodeWindow
            promptWindowRef={promptWindowRef}
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
            handleNodeContentChange={handleNodeContentChange}
            handleSaveMessage={handleSaveMessage}
            handleFormatText={handleFormatText}
            handleCondition={handleCondition}
            renderConditionLength={renderConditionLength}
            addCondition={addCondition}
            removeCondition={removeCondition}
            setActiveTabForCondition={setActiveTabForCondition}
            handleConditionChange={handleConditionChange}
            variableData={variableData}
            handleExtendWindow={handleExtendWindow}
            isOpenModal={isOpenModal}
            setIsOpenModal={setIsOpenModal}
            handlePromptContentChange={handlePromptContentChange}
            newPrompt={newPrompt}
            setNewPrompt={setNewPrompt}
            promptNodeTitles={promptNodeTitles}
          />
        ) : (
          <PromptRightPanel
            promptDivRef={promptDivRef}
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
            handleNodeContentChange={handleNodeContentChange}
            handleSaveMessage={handleSaveMessage}
            handleFormatText={handleFormatText}
            handleCondition={handleCondition}
            renderConditionLength={renderConditionLength}
            addCondition={addCondition}
            removeCondition={removeCondition}
            setActiveTabForCondition={setActiveTabForCondition}
            handleConditionChange={handleConditionChange}
            variableData={variableData}
            handleExtendWindow={handleExtendWindow}
            handlePromptContentChange={handlePromptContentChange}
            newPrompt={newPrompt}
            setNewPrompt={setNewPrompt}
            promptNodeTitles={promptNodeTitles}
          />
        );

      case "Message node":
        return (
          <MessageRightPanel
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
            handleNodeContentChange={handleNodeContentChange}
            handleSaveMessage={handleSaveMessage}
            handleFormatText={handleFormatText}
            handleCondition={handleCondition}
            renderConditionLength={renderConditionLength}
            addCondition={addCondition}
            removeCondition={removeCondition}
            setActiveTabForCondition={setActiveTabForCondition}
            handleConditionChange={handleConditionChange}
            variableData={variableData}
            handleExtendWindow={handleExtendWindow}
            msgNodeTitles={msgNodeTitles}
          />
        );

      case "Capture node":
        return (
          <CaptureRightPanel
            captureRef={captureRef}
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
            handleNodeContentChange={handleNodeContentChange}
            handleSaveMessage={handleSaveMessage}
            handleFormatText={handleFormatText}
            handleCondition={handleCondition}
            renderConditionLength={renderConditionLength}
            addCondition={addCondition}
            removeCondition={removeCondition}
            setActiveTabForCondition={setActiveTabForCondition}
            handleConditionChange={handleConditionChange}
            variableData={variableData}
            handleExtendWindow={handleExtendWindow}
            // captureNodeTitle={[captureNodeTitle]}
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            scenariosItem={scenariosItem}
            setScenarios={setScenarios}
            exitPath={exitPath}
            setExitPath={setExitPath}
            captureNodeTitles={captureNodeTitles}
          />
        );

      default:
        return null;
    }
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
        {/* <Handle />
        <MiniMap /> */}
      </ReactFlow>
      <VariantPanel
        variableData={variableData}
        setVariableData={setVariableData}
        variableType={variableType}
        setVariableTypeData={setVariableTypeData}
        appliedColor={appliedColor}
        handleColorChange={handleColorChange}
        colorVariable={colorVariable}
        setColorVariable={setColorVariable}
        handleClickColor={handleClickColor}
      />
      {contextMenuPosition && (
        <div
          style={{
            position: "absolute",
            top: contextMenuPosition.y,
            left: contextMenuPosition.x,
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            padding: "20px",
            width: "180px",
            border: "1px solid #e0e0e0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {[
              { color: "#a1c972", label: "1" },
              { color: "#f3dcf0", label: "2" },
              { color: "#ffd4de", label: "3" },
              { color: "#caead5", label: "4" },
            ].map(({ color, label }) => (
              <button
                key={color}
                onClick={() => handleColorChange(color)}
                aria-label={`Select ${label}`}
                style={{
                  backgroundColor: color,
                  border: "2px solid #ffffff",
                  borderRadius: "50%",
                  width: "36px",
                  height: "36px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.1)";
                  e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.2)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.12)";
                }}
                onFocus={(e) => {
                  e.target.style.boxShadow = "0 0 0 3px rgba(0, 0, 0, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.boxShadow = "0 1px 3px rgba(0, 0, 0, 0.12)";
                }}
              />
            ))}
          </div>
        </div>
      )}
      <Toolbar nodes={nodes} addNode={addNode} />
      {renderNodeComponent()}
    </div>
  );
};

export default Board;
