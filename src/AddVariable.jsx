import React, { useState, useEffect } from "react";

import { FiPlusCircle, FiMinusCircle } from "react-icons/fi";

const AddVariable = ({
  showVariableModal,
  setShowVariableModal,
  variableData,
  setVariableData,
  selectedVariable,
  selectedVariableType,
  editIndex,
  setEditIndex,
  appliedColor,
  handleColorChange,
  colorVariable,
  setColorVariable,
  handleClickColor,
}) => {
  const [newVariable, setNewVariable] = useState("");
  const [variableType, setVariableType] = useState("");
  const [valueData, setValueData] = useState([]);
  useEffect(() => {
    setNewVariable(selectedVariable);
    setVariableType(selectedVariableType);
  }, [selectedVariable, selectedVariableType]);

  const rgbToHex = (rgb) => {
    const result = rgb.match(/\d+/g);
    if (!result || result.length !== 3) return null;
    const r = parseInt(result[0]).toString(16).padStart(2, "0");
    const g = parseInt(result[1]).toString(16).padStart(2, "0");
    const b = parseInt(result[2]).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  };
  const handleCreateVariable = () => {
    if (newVariable !== "") {
      const input = newVariable.trim();

      // Validation checks
      const isUnique = !variableData.includes(input);
      const startsWithLetter = /^[a-zA-Z]/.test(input);
      const noSpaces = !/\s/.test(input);
      const isSnakeCase = /^[a-zA-Z][a-zA-Z0-9_]*$/.test(input);

      if (!startsWithLetter) {
        alert("Variable names must start with a letter.");
        return;
      }

      if (!noSpaces) {
        alert("Variable names must not contain spaces.");
        return;
      }

      if (!isSnakeCase) {
        alert(
          "Variable names must use underscores and alphanumeric characters only."
        );
        return;
      }

      if (!isUnique) {
        alert("Variable name must be unique.");
        return;
      }

      if (editIndex === null) {
        setVariableData((prevData) => [...prevData, newVariable]);
      } else {
        setVariableData((prevData) => {
          const updatedData = [...prevData];
          updatedData[editIndex] = newVariable;
          return updatedData;
        });
      }
    } else if (editIndex !== null) {
      setVariableData((prevData) => {
        const updatedData = [...prevData];
        updatedData.splice(editIndex, 1);
        return updatedData;
      });
    }

    setNewVariable("");

    setShowVariableModal(false);
  };
  const handleVariableChange = (event) => {
    setNewVariable(event.target.value);
  };
  const addValue = () => {
    setValueData((prevData) => [...prevData, ""]);
  };
  const deleteValue = () => {
    setValueData((prevData) => {
      const updatedData = [...prevData];
      updatedData.splice(editIndex, 1);
      return updatedData;
    });
  };
  return (
    <div
      style={{
        display: showVariableModal ? "flex" : "none",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        zIndex: "10003",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
          maxWidth: "400px",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "#ddd",
            padding: "20px",
            width: "100%",
            position: "absolute",
            top: "0",
            left: "0",
            borderTopLeftRadius: "10px",
            borderTopRightRadius: "10px",
            boxSizing: "border-box",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "1.4rem",
              margin: "0",
            }}
          >
            {selectedVariable ? "Edit Variable" : "Create Variable"}
          </h2>
        </div>
        <div style={{ marginBottom: "15px", marginTop: "60px" }}>
          <label
            htmlFor="name"
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "1rem",
            }}
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={newVariable}
            placeholder="Enter variable name"
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "1rem",
              boxSizing: "border-box",
              outline: "none",
              transition: "border 0.3s ease, box-shadow 0.3s ease",
            }}
            onFocus={(e) =>
              (e.target.style.boxShadow = "0px 0px 8px rgba(0, 123, 255, 0.3)")
            }
            onBlur={(e) => (e.target.style.boxShadow = "none")}
            onChange={handleVariableChange}
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="variable-type"
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
              fontSize: "1rem",
            }}
          >
            Variable Type:
          </label>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <select
              id="variable-type"
              onChange={(e) => {
                setVariableType(e.target.value);
              }}
              value={variableType}
              style={{
                width: "70%",
                padding: "12px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                fontSize: "1rem",
                boxSizing: "border-box",
                outline: "none",
                transition: "border 0.3s ease, box-shadow 0.3s ease",
              }}
              onFocus={(e) =>
                (e.target.style.boxShadow =
                  "0px 0px 8px rgba(0, 123, 255, 0.3)")
              }
              onBlur={(e) => (e.target.style.boxShadow = "none")}
            >
              <option value="0">Select type</option>
              <option value="1">Date</option>
              <option value="2">Number</option>
              <option value="3">String</option>
              <option value="4">URL</option>
              <option value="5">Currency</option>
            </select>
            <div
              style={{
                display: "flex",
                gap: "5px",
                marginLeft: "auto",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#a1c972",
                  border: `2px solid ${
                    colorVariable == "#a1c972" ? "#ff0000" : "#ddd"
                  }`,
                  padding: "4px",
                  boxSizing: "content-box",
                }}
                onClick={(e) =>
                  handleClickColor(rgbToHex(e.target.style.backgroundColor))
                }
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#f3dcf0",
                  border: `2px solid ${
                    colorVariable == "#f3dcf0" ? "#ff0000" : "#ddd"
                  }`,
                  padding: "4px",
                  boxSizing: "content-box",
                }}
                onClick={(e) =>
                  handleClickColor(rgbToHex(e.target.style.backgroundColor))
                }
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#ffd4de",
                  border: `2px solid ${
                    colorVariable == "#ffd4de" ? "#ff0000" : "#ddd"
                  }`,
                  padding: "4px",
                  boxSizing: "content-box",
                }}
                onClick={(e) =>
                  handleClickColor(rgbToHex(e.target.style.backgroundColor))
                }
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#caead5",
                  border: `2px solid ${
                    colorVariable == "#caead5" ? "#ff0000" : "#ddd"
                  }`,
                  padding: "4px",
                  boxSizing: "content-box",
                }}
                onClick={(e) =>
                  handleClickColor(rgbToHex(e.target.style.backgroundColor))
                }
              ></div>
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "10px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <label
              htmlFor="variable-type"
              style={{
                display: "block",
                fontWeight: "bold",
                marginBottom: "8px",
                fontSize: "1rem",
              }}
            >
              Values:
            </label>
            <FiPlusCircle
              style={{ float: "right", cursor: "pointer" }}
              size={30}
              onClick={addValue}
            />
          </div>
          {valueData.map((data, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "10px",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "3px solid #ddd",
                paddingBottom: "10px",
              }}
            >
              <div>
                <input
                  type="text"
                  style={{
                    border: "none",
                    outline: "none",
                    paddingTop: "10px",
                    fontSize: "15px",
                  }}
                  placeholder="Enter entity value"
                />

                <br></br>
                <input
                  type="text"
                  style={{
                    border: "none",
                    outline: "none",
                    fontSize: "13px",
                    fontStyle: "italic",
                    width: "200%",
                  }}
                  placeholder="Add synonyms, comma separated"
                />
              </div>
              <FiMinusCircle
                style={{ float: "right", cursor: "pointer", marginTop: "13px" }}
                size={30}
                onClick={deleteValue}
              />
            </div>
          ))}
        </div>
        <div style={{ textAlign: "right" }}>
          <button
            style={{
              backgroundColor: "#ddd",
              border: "none",
              padding: "12px 30px",
              fontSize: "1.1rem",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              boxSizing: "border-box",
              marginRight: "10px",
              textAlign: "center",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor = "rgba(0, 0, 0, 0.3)")
            }
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ddd")}
            onClick={() => setShowVariableModal(false)}
          >
            Cancel
          </button>
          <button
            style={{
              backgroundColor: newVariable === "" ? "#ddd" : "#007BFF",
              color: newVariable === "" ? "#000" : "#fff",
              border: "none",
              padding: "12px 30px",
              fontSize: "1.1rem",
              borderRadius: "5px",
              cursor: newVariable === "" ? "not-allowed" : "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              boxSizing: "border-box",
              textAlign: "center",
            }}
            onMouseEnter={(e) =>
              (e.target.style.backgroundColor =
                newVariable === "" ? "#ddd" : "#0056b3")
            }
            onMouseLeave={(e) =>
              (e.target.style.backgroundColor =
                newVariable === "" ? "#ddd" : "#007BFF")
            }
            onClick={() => handleCreateVariable()}
            disabled={newVariable === ""}
          >
            {selectedVariable ? "Save" : "Create Variable"}
          </button>
        </div>

        <button
          style={{
            position: "absolute",
            top: "20px",
            right: "10px",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#888",
            cursor: "pointer",
          }}
          onClick={() => setShowVariableModal(false)}
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AddVariable;
