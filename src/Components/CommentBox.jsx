import React from "react";
import { AiOutlineClose } from "react-icons/ai";

const CommentBox = ({ testData, onClose }) => {
  return (
    <div>
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
          <textarea
            style={{
              fontSize: "20px",
              padding: "2px",
              borderRadius: "1px",
              border: "1px solid #ddd",
              height: "100%",
              width: "100%",
              resize: "vertical",
            }}
            rows="10"
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
