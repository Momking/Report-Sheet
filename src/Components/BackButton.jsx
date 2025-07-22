import React from "react";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const BackButton = ({ destination }) => {
  return (
    <div style={{ display: "flex" }}>
      <Link
        to={destination}
        style={{
          paddingTop: "7px",
          padding: "5px",
          width: "fit-content",
        }}
      >
        <BsArrowLeft style={{ fontSize: "3.5vh",}} />
      </Link>
    </div>
  );
};

export default BackButton;
