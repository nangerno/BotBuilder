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

const PromptNodeWindow = ({
  promptWindowRef,
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
  isOpenModal,
  setIsModalOpen,
  title,
  setTitle
}) => {
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const openModal = () => {
  //     setIsModalOpen(true);
  //   };

  // Function to close the modal
  //   const closeModal = () => {
  //     setIsModalOpen(false);
  //   };
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
    console.log(isOpenModal);
    setCount(len.length > 0 ? len : ["Condition"]);
  }, [variableData, variantConditions, conditions, isOpenModal]);

  return (
    <>
      {/* Modal Overlay */}
      {isOpenModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 100001,
          }}
          onClick={handleExtendWindow}
        >
          <div
            ref={promptWindowRef}
            style={{
              width: "70%",
              backgroundColor: "#f9f9f9",
              padding: "20px",
              border: "1px solid #ddd",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              overflowX: "hidden",
              maxHeight: "80vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              zIndex: 100003,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.3)",
              borderRadius: "10px",
            }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <h3 style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
              {title}
            </h3>

            <div
              style={{ marginBottom: "10px", borderBottom: "1px solid #ddd" }}
            >
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
                <button
                  onClick={handleInsertLink}
                  className="message-toolbaar-icon"
                >
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
                  onInput={(e) =>
                    handleMessageChange(e.currentTarget.innerHTML)
                  }
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
            <br />
            <strong>System Prompt</strong>
            <div>
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  style={{
                    marginBottom: "10px",
                    marginTop: "15px",
                    paddingBotton: "10px",
                    borderBottom: "1px solid #ddd",
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
                      onInput={(e) =>
                        handleMessageChange(e.currentTarget.innerHTML)
                      }
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
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007BFF")
              }
            >
              Save
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PromptNodeWindow;
