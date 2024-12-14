import React, { useState, useEffect } from "react";
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
import { FiPlusCircle, FiMinusCircle, FiChevronsLeft } from "react-icons/fi";

const PromptRightPanel = ({
  promptDivRef,
  conditionDivRef,
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
  handleMessageChange,
  handleFormatText,
  handleCondition,
  addCondition,
  removeCondition,
  setActiveTabForCondition,
  handleConditionChange,
  variableData,
  handleExtendWindow,
  promptNodeTitle
}) => {

  const [firstClick, setFirstClick] = useState(false);
  const [firstDesClick, setFirstDesClick] = useState(false);
  const handleFirstClick = () => {
    setFirstClick(true);
  }
  const handleFirstDesClick = () => {
    setFirstDesClick(true);
  }
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div>
        <FiChevronsLeft
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
        {promptNodeTitle}
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
            id="messageInput"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              handleMessageChange(e.currentTarget.innerHTML)}}
            style={{
              minHeight: "100px",
              paddingTop: "10px",
              backgroundColor: "#f9f9f9",
              outline: "none",
              padding: "10px",
              border: "1px solid #ddd",
              position: "relative",
            }}
            onFocus={() => {setIsFocused(true), handleFirstDesClick()}}
            onBlur={() => setIsFocused(false)}
            dangerouslySetInnerHTML={{ __html: `${!firstDesClick?"Description...":""}` }}
          />
        </div>
      </div>
      <br></br>
      <strong>System prompt</strong>
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
          marginTop: "15px",
          paddingBotton: "10px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{ position: "relative" }}>
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
            style={{
              minHeight: "10vh",
              height: `${firstClick?"40vh":"10vh"}`,
              maxHeight: "40vh",
              padding: "10px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              outline: "none",
            }}
            onFocus={() => {setIsFocused(true), handleFirstClick()}}
            onBlur={() => setIsFocused(false)}
            dangerouslySetInnerHTML={{ __html: `${!firstClick?"Enter your prompt...":""}` }}
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