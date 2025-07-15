import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = ({ destination }) => {
  return (
    <div style={{ display: "flex" }}>
      <Link
        to={destination}
        style={{
          backgroundColor: "white",
          paddingTop: "7px",
          padding: "5px",
          borderRadius: "50%",
          width: "fit-content",
        }}
      >
        <BsArrowLeft style={{ fontSize: "30px", }} />
      </Link>
    </div>
  );
};

export default BackButton;
