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
import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

const MsgPanel = ({
  messageDivRef,
  conditionDivRef,
  isFocused,
  setIsFocused,
  newMessage,
  selectedNode,
  setSelectedNode,
  handlePlay,
  handleInsertLink,
  handleDelay,
  addVariant, //valid
  removeVariant, //valid
  variants,
  variantConditions,
  visibleCondition,
  conditionCount,
  conditions,
  handleSaveMessage,
  handleMessageChange,
  handleFormatText,
  handleCondition,
  addCondition, // valid
  removeCondition, //valid
  setActiveTabForCondition,

  handleConditionChange, // valid
  variableData,
}) => {
  const [newVariable, setNewVariable] = useState([]);
  const [count, setCount] = useState([]);
//   useEffect(() => {
//     setNewVariable(variableData);
//   }, [variableData, conditions]);
//   const handleAddVariant = () => {
//     addVariant();
//   };

  return (
    <div
      ref={messageDivRef}
      style={{
        width: "380px",
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderLeft: "1px solid #ddd",
        display: selectedNode ? "block" : "none",
        overflowX: "hidden",
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      <strong>Variants</strong>
      <FiPlusCircle
        style={{ float: "right", cursor: "pointer" }}
        size={20}
        onClick={addVariant}
      />
      <br></br>
      <br></br>
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
          <FiMinusCircle
            style={{ float: "right", cursor: "pointer", marginTop: "5px" }}
            size={20}
            onClick={() => removeVariant(variant.id)}
          />
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
          <button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "8px 12px",
              marginTop: "5px",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              // backgroundColor: '#f9f9f9',
              backgroundColor: conditionCount == 0 ? "#ddd" : "#f9f9f9",
              color: "#333",
              fontSize: "14px",
              cursor: "pointer",
            }}
            onClick={() => handleCondition(variant.id)}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <PiCornersOut size={19} />
            </span>

            <div key={variant.id}>{count[variant.id]}</div>
          </button>
          {visibleCondition !== null &&
            Object.entries(variantConditions[variant.id] || {}).map(
              ([conditionId, value]) => (
                <div
                  ref={conditionDivRef}
                  key={conditionId}
                  style={{
                    width: "350px",
                    height: `${
                      80 +
                      Object.keys(variantConditions[variant.id]).length * 31
                    }px`,
                    maxHeight: "40%",
                    backgroundColor: "#f9f9f9",
                    padding: "10px",
                    border: "1px solid #ddd",
                    display: visibleCondition !== null ? "block" : "none",
                    position: "absolute",
                    top: `${
                      350 +
                      variants.findIndex(
                        (v) => v.id === visibleCondition.variantId
                      ) *
                        100
                    }px`,
                    right: "350px",
                    borderRadius: "10px",
                    zIndex: 10001,
                    transition: "height 0.3s ease-in-out",
                    overflowX: "hidden",
                    overflowY: "auto",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <button
                      style={{
                        marginTop: "7px",
                        cursor: "pointer",
                        border: "none",
                        outline: "none",
                        backgroundColor: "#f9f9f9",
                        fontSize: "30px",
                        width: "30px",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#ddd")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#f9f9f9")
                      }
                      onClick={addCondition(variant.id, conditionId, value)}
                    >
                      +
                    </button>
                  </div>

                  <div
                    key={conditionId}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1px",
                    }}
                  >
                    <p style={{ margin: "0 5px" }}>if</p>
                    <select
                      style={{
                        marginRight: "15px",
                        border: "none",
                        backgroundColor: "#f9f9f9",
                        outline: "none",
                      }}
                    >
                      <option>variables</option>
                      {newVariable.map((data, index) => (
                        <option key={index} value={index}>
                          {data}
                        </option>
                      ))}
                    </select>
                    <p style={{ margin: "0 5px" }}>is</p>
                    <input
                      onChange={(e) =>
                        handleConditionChange(
                          visibleCondition.variantId,
                          conditionId,
                          e.target.value
                        )
                      }
                      value={
                        variantConditions[visibleCondition.variantId]?.[
                          conditionId
                        ] || ""
                      }
                      type="text"
                      placeholder="value or {var}"
                      style={{
                        backgroundColor: "#f9f9f9",
                        marginRight: "5px",
                        border: "none",
                        outline: "none",
                      }}
                    />
                    <button
                      style={{
                        cursor:
                          Object.keys(variantConditions[variant.id]).length >
                            1 &&
                          Object.keys(variantConditions[variant.id]) != ""
                            ? "pointer"
                            : "not-allowed",
                        opacity:
                          Object.keys(variantConditions[variant.id]).length > 1
                            ? 1
                            : 0.5,
                        border: "none",
                        outline: "none",
                        backgroundColor: "#f9f9f9",
                        fontSize: "30px",
                        paddingRight: "10px",
                        paddingLeft: "10px",
                        marginRight: "30px",
                      }}
                      onClick={() =>
                        Object.keys(variantConditions[variant.id]).length > 1 &&
                        removeCondition(variant.id, conditionId)
                      }
                      disabled={
                        Object.keys(variantConditions[variant.id]).length === 1
                      }
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#ddd")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "#f9f9f9")
                      }
                    >
                      -
                    </button>
                  </div>
                </div>
              )
            )}
        </div>
      ))}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
  );
};

export default MsgPanel;
