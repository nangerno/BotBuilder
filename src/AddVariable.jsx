import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

const AddVariable = ({
  showVariableModal,
  setShowVariableModal,
  variableData,
  setVariableData,
  selectedVariable,
  selectedVariableType,
  editIndex,
  setEditIndex
}) => {
  console.log(editIndex)
  const [newVariable, setNewVariable] = useState("");
  const [variableType, setVariableType] = useState("");
  
  useEffect(()=>{
    setNewVariable(selectedVariable);
    setVariableType(selectedVariableType);
  }, [selectedVariable, selectedVariableType]);

  const handleCreateVariable = () => {
    if(newVariable!==''){
      if (editIndex === null) {
        setVariableData((prevData) => [...prevData, newVariable]);
      } else {
        setVariableData((prevData) => {
          const updatedData = [...prevData];
          updatedData[editIndex] = newVariable;
          return updatedData;
        });
      }
      setNewVariable("");
    }
    else {
      setVariableData((prevData) => {
        const updatedData = [...prevData];
        updatedData.splice(editIndex, 1);
        return updatedData;
      });
    }
    
    setShowVariableModal(false);
  };
  const handleVariableChange = (event) => {
    setNewVariable(event.target.value);
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
        zIndex: "100002",
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
              color: "#333",
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
              color: "#333",
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
              color: "#333",
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
                  backgroundColor: "#f0fff0",
                  border: "2px solid #ddd",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff0000")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#00ff00",
                  border: "2px solid #ddd",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff0000")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#0f0f00",
                  border: "2px solid #ddd",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff0000")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              ></div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  backgroundColor: "#0edf0f",
                  border: "2px solid #ddd",
                }}
                onMouseEnter={(e) => (e.target.style.borderColor = "#ff0000")}
                onMouseLeave={(e) => (e.target.style.borderColor = "#ddd")}
              ></div>
            </div>
          </div>
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
              backgroundColor: "#007BFF",
              color: "#fff",
              border: "none",
              padding: "12px 30px",
              fontSize: "1.1rem",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              boxSizing: "border-box",
              textAlign: "center",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#007BFF")}
            onClick={() => handleCreateVariable()}
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
