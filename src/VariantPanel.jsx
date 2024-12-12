import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import AddVariable from "./AddVariable";

const VariantPanel = ({ variableData }) => {

    const [showVariable, setShowVariable] = useState(false);

    return (
        <div>
            <div
                style={{
                    position: "fixed",
                    bottom: "20px",
                    left: "55px",
                    zIndex: "1000",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    backgroundColor: '#ffffff',
                    padding: '10px',
                    borderRadius: '15px',
                    width: '250px',
                    height: '220px',
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                }}
            >
                <strong
                    style={{ fontSize: "1.1rem", color: "#737376", cursor: "pointer", textAlign: 'center' }}
                >
                    Variables
                </strong>

                <div style={{
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    maxHeight: '100px',
                    padding: '10px',
                    scrollBehavior: 'smooth',
                }}>
                    {
                        variableData.map((variable, index) => (
                            <div
                                key={index}
                                style={{
                                    backgroundColor: "#ffffff",
                                    borderBottom: '1px solid #ddd',
                                }}
                            >
                                <p
                                    style={{ margin: 0, fontSize: "0.95rem", color: "#555" }}
                                >
                                    {variable}
                                </p>
                            </div>
                        ))
                    }
                </div>
                <button
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: 'none',
                        backgroundColor: "#007BFF",
                        color: '#fff',
                        fontSize: '24px',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#007BFF'}
                    onClick={() => setShowVariable(prevState => !prevState)}
                >
                    +
                </button>
            </div>
            <AddVariable showVariable={showVariable} setShowVariable={setShowVariable} variableData={variableData}/>
        </div>

    );
}
export default VariantPanel;