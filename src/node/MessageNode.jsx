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

const MessageNode = ({ data, onClick }) => {
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
        width: "240px",
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
        <strong style={{ cursor: "pointer" }} onClick={handleLabelClick}>
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
            position: "relative",
          }}
          dangerouslySetInnerHTML={{ __html: data.message }}
        ></p>
        {data.label == "Message node 1" ? (
          <>
            <Handle
              type="target"
              position="left"
              style={{
                background: isHovered ? "#007bff" : "transparent",
                border: isHovered ? "" : "none",
                position: "absolute",
                top: "50%",
                left: "-5px",
                transform: "translateY(-50%)",
                transition: "background-color 0.3s ease",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            />
            <Handle
              type="source"
              position="right"
              style={{
                background: "#007bff",
                position: "absolute",
                top: "50%",
                right: "-5px",
                transform: "translateY(-50%)",
              }}
            />
          </>
        ) : (
          <>
            <Handle
              type="target"
              position="left"
              style={{
                background: "#007bff",
                // border: isHovered ? "" : "none",
                position: "absolute",
                top: "50%",
                left: "-5px",
                transform: "translateY(-50%)",
                transition: "background-color 0.3s ease",
              }}
              // onMouseEnter={() => setIsHovered(true)}
              // onMouseLeave={() => setIsHovered(false)}
            />
            <Handle
              type="source"
              position="right"
              style={{
                background: "#007bff",
                position: "absolute",
                top: "50%",
                right: "-5px",
                transform: "translateY(-50%)",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MessageNode;
