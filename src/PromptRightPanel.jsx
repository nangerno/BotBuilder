import React, { useState, useEffect, useRef } from "react";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaLink,
  FaPlay,
  FaClock,
} from "react-icons/fa";
import { PiCornersOut } from "react-icons/pi";
import { FaRegCaretSquareLeft } from "react-icons/fa";
import { FiPlusCircle, FiMinusCircle, FiChevronsLeft } from "react-icons/fi";

const PromptRightPanel = ({
  promptDivRef,
  isFocused,
  setIsFocused,
  newMessage,
  selectedNode,
  setSelectedNode,
  handlePlay,
  handleInsertLink,
  handleDelay,
  addVariant,
  removeVariant,
  variants,
  variantConditions,
  visibleCondition,
  conditionCount,
  conditions,
  handleSaveMessage,
  handleNodeContentChange,
  handleFormatText,
  handleCondition,
  addCondition,
  removeCondition,
  setActiveTabForCondition,
  handleConditionChange,
  variableData,
  handleExtendWindow,
  promptNodeTitle,
  handlePromptContentChange,
  newPrompt,
  promptNodeTitles,
}) => {
  const editableRef = useRef(null);
  const promptNode = selectedNode?.type === "Prompt node" ? selectedNode : null;

  return (
    <div
      ref={promptDivRef}
      style={{
        width: "380px",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderLeft: "1px solid #ddd",
        display: selectedNode ? "block" : "none",
        overflowX: "hidden",
        maxHeight: "100%",
        overflowY: "auto",
        flexDirection: "column",
      }}
    >
      <div>
        <FaRegCaretSquareLeft
          size={20}
          style={{ float: "right", cursor: "pointer" }}
          onClick={handleExtendWindow}
        />
      </div>
      <h3
        style={{
          borderBottom: "1px solid #ddd",
          paddingLeft: "0px",
          paddingBottom: "10px",
        }}
      >
        {promptNodeTitles[selectedNode?.id] || "Description"}
      </h3>

      <div style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}>
        <div>
          <button onClick={handlePlay} className="message-toolbaar-icon">
            <FaPlay className="icon-style" />
          </button>
          <button
            onClick={() => handleFormatText("bold")}
            className="message-toolbaar-icon"
          >
            <FaBold className="icon-style" />
          </button>

          <button
            onClick={() => handleFormatText("italic")}
            className="message-toolbaar-icon"
          >
            <FaItalic className="icon-style" />
          </button>
          <button
            onClick={() => handleFormatText("underline")}
            className="message-toolbaar-icon"
          >
            <FaUnderline className="icon-style" />
          </button>
          <button
            onClick={() => handleFormatText("strikeThrough")}
            className="message-toolbaar-icon"
          >
            <FaStrikethrough className="icon-style" />
          </button>
          <button onClick={handleInsertLink} className="message-toolbaar-icon">
            <FaLink className="icon-style" />
          </button>
          <button onClick={handleDelay} className="message-toolbaar-icon">
            <FaClock className="icon-style" />
          </button>
        </div>
        <div style={{ position: "relative" }}>
          <div
            id="nodeContentDiv"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleNodeContentChange(e.currentTarget.innerHTML)}
            style={{
              minHeight: "100px",
              paddingTop: "10px",
              backgroundColor: "#f9f9f9",
              outline: "none",
              padding: "10px",
              border: "1px solid #ddd",
              position: "relative",
            }}
            dangerouslySetInnerHTML={{ __html: newMessage }}
          />
        </div>
      </div>
      <br></br>
      <strong>System prompt</strong>
      <br></br>
      <br></br>
      <div>
        <button onClick={handlePlay} className="message-toolbaar-icon">
          <FaPlay className="icon-style" />
        </button>
        <button
          onClick={() => handleFormatText("bold")}
          className="message-toolbaar-icon"
        >
          <FaBold className="icon-style" />
        </button>
        <button
          onClick={() => handleFormatText("italic")}
          className="message-toolbaar-icon"
        >
          <FaItalic className="icon-style" />
        </button>
        <button
          onClick={() => handleFormatText("underline")}
          className="message-toolbaar-icon"
        >
          <FaUnderline className="icon-style" />
        </button>
        <button
          onClick={() => handleFormatText("strikeThrough")}
          className="message-toolbaar-icon"
        >
          <FaStrikethrough className="icon-style" />
        </button>
        <button onClick={handleInsertLink} className="message-toolbaar-icon">
          <FaLink className="icon-style" />
        </button>
        <button onClick={handleDelay} className="message-toolbaar-icon">
          <FaClock className="icon-style" />
        </button>
      </div>
      <div
        style={{
          marginBottom: "10px",
          marginTop: "0",
          paddingBotton: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            ref={editableRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => {
              handlePromptContentChange(e.currentTarget.innerHTML);
            }}
            style={{
              overflowY: "auto",
              minHeight: "10vh",
              height: `${isFocused ? "40vh" : "10vh"}`,
              maxHeight: "40vh",
              paddingTop: "10px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              outline: "none",
              padding: "10px",
              border: "1px solid #ddd",
              whiteSpace: "pre-wrap",
            }}
            placeholder="Enter your prompt here"
            onFocus={() => setIsFocused(true)}
            // onBlur={() => setIsFocused(false)}
            dangerouslySetInnerHTML={{ __html: newPrompt }}
          />
        </div>
      </div>

      <button
        onClick={handleSaveMessage}
        style={{
          padding: "10px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          width: "100%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          marginTop: "auto",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#007BFF")}
      >
        Save
      </button>
    </div>
  );
};

export default PromptRightPanel;
