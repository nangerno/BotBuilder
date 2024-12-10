import React, { useState, useRef, useEffect } from "react";

const TestComponent = () => {
  const [isVisible, setIsVisible] = useState(true);
  const messageDivRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log("Clicked element:", event.target);

      if (messageDivRef.current && !messageDivRef.current.contains(event.target)) {
        console.log("Outside click detected!");
        setIsVisible(false); // Hide the div on outside click
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <div
        ref={messageDivRef}
        style={{
          width: "300px",
          height: "200px",
          backgroundColor: "#f9f9f9",
          padding: "20px",
          border: "1px solid #ddd",
          display: isVisible ? "block" : "none",
        }}
      >
        Click outside to hide me
      </div>
    </div>
  );
};

export default TestComponent;
