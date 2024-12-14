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

const PromptNode = ({ data, onClick }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data.label);
  const [isHovered, setIsHovered] = useState(false);
  const handleLabelClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleLabelChange = (e) => {
    setEditedLabel(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };
  return (
    <div
      style={{
        padding: "10px",
        border: "2px solid rgb(245, 242, 242)",
        borderRadius: "10px",
        fontWeight: "400",
        backgroundColor: `${data.style.backgroundColor}`,
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        width: "220px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
      }}
      onClick={onClick}
    >
      {isEditing ? (
        <input
          type="text"
          value={editedLabel}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          autoFocus
          style={{
            fontSize: "1.1rem",
            color: "#808080",
            fontWeight: "bold",
            border: "none",
            background: "transparent",
            width: "100%",
            pointerEvents: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <strong
          style={{ fontSize: "1.1rem", color: "#808080", cursor: "pointer" }}
          onClick={handleLabelClick}
        >
          {editedLabel}
        </strong>
      )}

      <div
        style={{
          backgroundColor: "#ffffff",
          padding: "10px",
          borderRadius: "5px",
          marginTop: "10px",
          border: "2px solid rgb(245, 242, 242)",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.95rem",
            color: "#808080",
            position: "relative",
            paddingRight: "30px",
          }}
          dangerouslySetInnerHTML={{ __html: data.message }}
        ></p>

        <Handle
          type="target"
          position="left"
          style={{
            background: "#ddd",
            position: "absolute",
            top: "50%",
            left: "-5px",
            transform: "translateY(-50%)",
            transition: "background-color 0.3s ease",
            border: "1px solid rgb(110, 110, 110)",
          }}
        />
        <Handle
          type="source"
          position="right"
          style={{
            background: "#ddd",
            position: "absolute",
            top: "50%",
            right: "-5px",
            transform: "translateY(-50%)",
            border: "1px solid rgb(110, 110, 110)",
            transition: "background-color 0.3s ease",
          }}
        />
      </div>
    </div>
  );
};
export default PromptNode;