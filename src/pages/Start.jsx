import React from "react";
import { FaUserDoctor } from "react-icons/fa6";
import { TbBrandShopee } from "react-icons/tb";
import { Link } from "react-router-dom";

const Start = () => {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Choose your own option.....</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20vh",
          marginTop: "20%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/FindReport2">
            <FaUserDoctor style={{ fontSize: "15vh", color: "skyblue" }} />
          </Link>
          <h6 style={{ fontSize: "2vh" }}>Doctor's Use</h6>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link to="/RetailorsSheet">
            <TbBrandShopee style={{ fontSize: "15vh", color: "skyblue" }} />
          </Link>
          <h6 style={{ fontSize: "2vh" }}>Retailer's Use</h6>
        </div>
      </div>
    </div>
  );
};

export default Start;
