import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  FiMessageCircle,
  FiPlus,
  FiSmile,
  FiMessageSquare,
  FiCrosshair,
} from "react-icons/fi";
import { RiColorFilterAiLine } from "react-icons/ri";
const Toolbar = ({ nodes, addNode }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  let timeoutId;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    setIsDropdownOpen(true);
  };
  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => setIsDropdownOpen(false), 300);
  };

  const handleNodeSelection = (nodeType) => {
    addNode(nodeType);
    setIsDropdownOpen(false);
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "20px",
        zIndex: "1000",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        backgroundColor: "#ffffff",
        padding: "10px",
        borderRadius: "15px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div
        style={{ position: "relative" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <FiMessageCircle
          size={40}
          style={{
            cursor: "pointer",
          }}
        />
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Talk
        </div>
        {isDropdownOpen && (
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "100%",
              marginLeft: "10px",
              backgroundColor: "#fff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              zIndex: "1001",
              borderRadius: "5px",
            }}
          >
            <div
              onClick={() => handleNodeSelection("Message node")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                width: "150px",
                transition: "background-color 0.4s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiMessageSquare size={20} />
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Message node
              </span>
            </div>
            <div
              onClick={() => handleNodeSelection("Prompt node")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                width: "150px",
                transition: "background-color 0.4s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <RiColorFilterAiLine size={20} />
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Prompt node
              </span>
            </div>
            <div
              onClick={() => handleNodeSelection("Capture node")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "10px",
                cursor: "pointer",
                borderBottom: "1px solid #ddd",
                width: "150px",
                transition: "background-color 0.4s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <FiCrosshair size={20} />
              <span
                style={{
                  fontSize: "0.95rem",
                  fontWeight: "500",
                }}
              >
                Capture node
              </span>
            </div>
          </div>
        )}
      </div>
      <div style={{ position: "relative" }}>
        <FiSmile
          size={40}
          style={{
            cursor: "pointer",
          }}
        />
        <div
          style={{
            fontSize: "14px",
            fontWeight: "500",
            textAlign: "center",
          }}
        >
          Listen
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
