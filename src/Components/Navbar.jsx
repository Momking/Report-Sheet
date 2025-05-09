import React from "react";
import BackButton from "./BackButton";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../config/auth";

const Navbar = ({ destination }) => {
  const navigate = useNavigate();
  const liStyle = {
    display: "inline-block",
    margin: "1vh 2vh",
    fontSize: "1.2vw",
    color: "white",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        padding: "1vh",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#2d3748",
        zIndex: "100",
      }}
    >
      <BackButton destination={destination} />
      <ul style={{ flex: "1", listStyle: "none", textAlign: "center" }}>
        <Link to="/FindReport2">
          <li style={liStyle}>Patient Entry.</li>
        </Link>
        <Link to="/FindReport">
          <li style={liStyle}>Finding Report</li>
        </Link>
        <Link>
          <li style={liStyle}>Test Master</li>
        </Link>
        <Link>
          <li style={liStyle}>Account Master</li>
        </Link>
        <Link>
          <li style={liStyle}>Patient List</li>
        </Link>
        <Link to="/DoctorsSheet/Configure">
          <li style={liStyle}>Settings</li>
        </Link>
        <Link to="">
          <li style={liStyle}>Daily Case Report</li>
        </Link>
        <Link to="/excelFile">
          <li style={liStyle}>Test Group</li>
        </Link>
        <Link to="/About">
          <li style={liStyle}>About</li>
        </Link>
      </ul>
      <button
        onClick={() => {
          doSignOut().then(() => {
            navigate("/login");
          });
        }}
        style={{
          fontSize: "small",
          // color: "blue",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
