import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = ({ destination }) => {
  return (
    <div style={{ display: "flex" }}>
      <Link
        to={destination}
        style={{
          backgroundColor: "#2d3748",
          padding: "8px",
          borderRadius: "10px",
          width: "fit-content",
        }}
      >
        <BsArrowLeft style={{ fontSize: "30px" }} />
      </Link>
    </div>
  );
};

export default BackButton;
