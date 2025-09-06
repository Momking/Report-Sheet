import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { TestName } from "../Components/Data/TestName";

const WaitBar = ({ message }) => {

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
    >
      <h1>{message}</h1>
    </div>
  );
};

export default WaitBar;
