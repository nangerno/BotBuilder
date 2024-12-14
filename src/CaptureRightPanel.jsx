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
  captureRef,
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
  setTitle,
}) => {
  console.log(variableData);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [dropItem, setDropItem] = useState(variableData);
  const [selectedItem, setSelectedItem] = useState([]);
  const [toggleState, setToggleState] = useState([false, false]);
  const [ruleItem, setRuleItem] = useState(["Enter rule"]);
  const [ruleText, setRuleText] = useState("");

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleToggle = (index) => {
    setToggleState((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  const handleSelect = (item) => {
    setDropdownVisible(!isDropdownVisible);
    setSelectedItem((prevSelected) => [...prevSelected, item]);
    setDropItem((prelist) => prelist.filter((selected) => selected !== item));
  };

  const addItemToList = (item) => {
    setDropItem((prelist) => [...prelist, item]);
    setSelectedItem((preitem) =>
      preitem.filter((selected) => selected !== item)
    );
  };
  useEffect(() => {
    setDropItem(variableData.length > 0 ? variableData : ["---No variable---"]);
  }, [variableData]);
  return (
    <div
      ref={captureRef}
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
      <h3
        style={{
          borderBottom: "1px solid #ddd",
          padding: "10px",
          paddingLeft: "0px",
        }}
        onInput={(e) => setTitle(e.currentTarget.textContent)}
      >
        Capture
      </h3>

      <strong>Entities</strong>
      <FiPlusCircle
        style={{ float: "right", cursor: "pointer" }}
        size={20}
        onClick={toggleDropdown}
      />

      <div
        style={{
          position: "relative",
          minHeight: "3%",
          borderBottom: "1px solid #ddd",
        }}
      >
        {isDropdownVisible && (
          <div
            style={{
              marginTop: "10px",
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "5px",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              position: "absolute",
              top: "0",
              left: "0",
              zIndex: 2,
              width: "100%",
            }}
          >
            {dropItem.map((variable, index) => (
              <p
                key={index}
                style={{ textAlign: "center" }}
                onClick={() => handleSelect(variable)}
              >
                {variable}
              </p>
            ))}
          </div>
        )}

        <div style={{ zIndex: 1 }}>
          {selectedItem.map((item, index) => (
            <p key={index}>
              {item}
              <FiMinusCircle
                style={{ float: "right", cursor: "pointer" }}
                size={20}
                onClick={() => addItemToList(item)}
              />
            </p>
          ))}
        </div>
      </div>

      {[0, 1].map((index) => (
        <div key={index}>
          <p>
            {index > 0 ? "Listen for other triggers" : "Automatically reprompt"}
            <button
              onClick={() => handleToggle(index)}
              style={{
                float: "right",
                cursor: "pointer",
                backgroundColor: toggleState[index] ? "#007bff" : "#ddd",
                border: "none",
                borderRadius: "5px",
                padding: "5px 10px",
                color: "#fff",
              }}
            >
              {toggleState[index] ? "On" : "Off"}
            </button>
          </p>
        </div>
      ))}
      <div style={{ borderTop: "1px solid #ddd", padding: "10px" }}></div>
      <strong>Rules</strong>
      <FiPlusCircle
        style={{ float: "right", cursor: "pointer" }}
        size={20}
        // onClick={}
      />
      {ruleItem.map((item, index) => (
        <div key={index} style={{paddingTop: "10px"}}>
          <FiMinusCircle
            style={{ float: "right", cursor: "pointer"}}
            size={20}
          />
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => handleMessageChange(e.currentTarget.innerHTML)}
            style={{
              fontSize: "16px",
              backgroundColor: "#f9f9f9",
              border: "none",
              outline: "none",
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            dangerouslySetInnerHTML={{ __html: item + " " + (index + 1) }}
          />
        </div>
      ))}
    </div>
  );
};

export default CaptureRightPanel;
