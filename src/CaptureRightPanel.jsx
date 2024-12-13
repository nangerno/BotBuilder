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

const CaptureRightPanel = ({
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
  title,
  setTitle
}) => {
  const [newVariable, setNewVariable] = useState([]);
  const [count, setCount] = useState([]);
  useEffect(() => {
    setNewVariable(variableData);
    const len = Object.values(variantConditions).map((innerObj) => {
      if (Object.keys(innerObj).length === 0) {
        return "Condition";
      }
      if (Object.values(innerObj).every((value) => value.trim() === "")) {
        return "Condition";
      }
      const nonEmptyCount = Object.values(innerObj).filter(
        (value) => value.trim() !== ""
      ).length;
      return nonEmptyCount > 0 ? nonEmptyCount : "Condition";
    });

    setCount(len.length > 0 ? len : ["Condition"]);
  }, [variableData, variantConditions, conditions]);
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
      <FiChevronsLeft style={{ float: "right", cursor: "pointer" }} onClick={handleExtendWindow}/>
      <h3 style={{ borderBottom: "1px solid #ddd", padding: "10px" }} onInput={(e) => setTitle(e.currentTarget.textContent)} >
        {title}
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
          {!isFocused && !newMessage && (
            <span
              style={{
                position: "absolute",
                left: "5px",
                top: "5px",
                color: "#aaa",
                pointerEvents: "none",
              }}
            >
              {/* Enter your message... */}
            </span>
          )}
          <div
            id="messageInput"
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
            style={{
              minHeight: "100px",
              paddingTop: "10px",
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              outline: "none",
              padding: "10px",
              border: "1px solid #ddd",
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            dangerouslySetInnerHTML={{ __html: newMessage }}
          />
        </div>
      </div>
      <br></br>
      <strong>{isFocused?"Description":"System Prompt"}</strong>
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
      {variants.map((variant) => (
        <div
          key={variant.id}
          style={{
            marginBottom: "10px",
            marginTop: "15px",
            paddingBotton: "10px",
            borderBottom: "1px solid #ddd",
            // justifyContent: 'center'
          }}
        >
          <div style={{ position: "relative" }}>
            {!isFocused && !variant.message && (
              <span
                style={{
                  position: "absolute",
                  left: "5px",
                  top: "5px",
                  color: "#aaa",
                  pointerEvents: "none",
                }}
              >
                {/* Enter your message... */}
              </span>
            )}
            <div
                contentEditable
                suppressContentEditableWarning
                onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
                style={{
                  minHeight: "50vh",
                  maxHeight: "55vh",
                  padding: "10px",
                  fontSize: "16px",
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #ddd",
                  outline: "none",
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                dangerouslySetInnerHTML={{ __html: variant.message }}
              />
          </div>
        </div>
      ))}
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

export default CaptureRightPanel;
