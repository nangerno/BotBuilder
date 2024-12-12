import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";

const VariantPanel = () => {
    const variableData = ['variable1', 'variable2', 'variable3', 'variable3', 'variable3', 'variable3'];
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
                    height: '400px',
                    border: '1px solid #007bff',
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
                }}
            >
                <strong
                    style={{ fontSize: "1.1rem", color: "#737376", cursor: "pointer", textAlign: 'center' }}
                >
                    Variables
                </strong>
                {
                    variableData.map((variable, index) => (
                        <div
                            key={index}
                            style={{
                                backgroundColor: "#ffffff",
                                padding: "10px",
                                borderRadius: "5px",
                                border: '1px solid #007bff',
                                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
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
                >
                    +
                </button>
            </div>
        </div>

    );
}
export default VariantPanel;