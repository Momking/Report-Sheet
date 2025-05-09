import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TestName } from "../Components/Data/TestName";

const PopUpCard = ({ testData, onClose }) => {
  const [headers, setHeaders] = useState([]);
  const [test, setTest] = useState([]);
  const [normalValue, setNormalValue] = useState([]);
  const [findings, setFindings] = useState([]);

  return (
    <div
      style={{
        position: "fixed",
        backgroundColor: "rgba(0,0,0,0.5)",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "50",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={onClose}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        style={{
          width: "70%",
          maxWidth: "100%",
          height: "70%",
          background: "white",
          borderRadius: "5px",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <AiOutlineClose
          style={{
            position: "absolute",
            right: "4px",
            top: "4px",
            fontSize: "22px",
            color: "red",
            cursor: "pointer",
          }}
          onClick={onClose}
        />
        <h2
          style={{
            width: "fit",
            marginTop: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#ff9999",
            borderRadius: "0.2rem",
          }}
        >
          {testData.TestName}
        </h2>
        <div
          style={{
            border: "3px solid #ddd",
            borderRadius: "4px",
            overflowY: "auto",
            height: "100vh",
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex" }}>
            <div
              style={{
                width: "10%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                color: "black",
              }}
            >
              <label htmlFor="email" className="input-label">
                Sr no.&nbsp;
              </label>
              {headers.length + 1}
            </div>
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                color: "black",
              }}
            >
              <label htmlFor="email" className="input-label">
                TEST NAME&nbsp;
              </label>
              {TestName[1][1]}
            </div>
            <div
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
                color: "black",
              }}
            >
              <label htmlFor="email" className="input-label">
                Normal Value&nbsp;
              </label>
              {TestName[1][2]}
            </div>
            <div
              style={{
                width: "25%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #ddd",
              }}
            >
              <label htmlFor="email" className="input-label">
                Findings&nbsp;
              </label>
              <input
                key={headers.length + 1}
                style={{
                  fontSize: "17px",
                  padding: "2px",
                  color: "black",
                  borderRadius: "1px",
                  border: "1px solid #ddd",
                  backgroundColor: "#ffffff",
                }}
                type="text"
                pattern="^\d*\.?\d{0,2}$"
                autoComplete="off"
                name={`Rate1${headers.length + 1}`}
                id="name"
                placeholder="Rate"
              />
              {findings}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpCard;
