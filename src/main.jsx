import React from "react";
import ReactDOM from "react-dom/client";
import Board from "./Board";
import TestBoard from "./TestBoard";
import "./index.css";

ReactDOM.createRoot(document.getElementById("app")).render(
  <React.StrictMode>
    <Board />
    {/* <TestBoard /> */}
  </React.StrictMode>
);
