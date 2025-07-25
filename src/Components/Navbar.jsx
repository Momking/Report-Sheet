import React from "react";
import BackButton from "./BackButton";
import { Link, useNavigate } from "react-router-dom";
import { doSignOut } from "../config/auth";
import styled from "styled-components";

const Navbar = ({ destination }) => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <div 
        style={{
          padding: "1vh 10vh",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: "100",
        }}
        >
        <div 
          style={{
            padding: "1vh",
            width: "100%",
            borderRadius: "15px",
            backgroundColor: "#e2eff5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <BackButton destination={destination} />
          <ul style={{ flex: "1", listStyle: "none", textAlign: "center" }}>
            <Link to="/doctor_use/FindAdmission">
              <li className="nav-item">Test Admission</li>
            </Link>
            <Link to="/doctor_use/FindReport">
              <li className="nav-item">Test Report</li>
            </Link>
            <Link to="/doctor_use/TestMaster">
              <li className="nav-item">Test Master</li>
            </Link>
            <Link to="/doctor_use/AccountMaster">
              <li className="nav-item">Account Master</li>
            </Link>
            <Link>
              <li className="nav-item">Patient List</li>
            </Link>
            <Link to="/doctor_use/Configure">
              <li className="nav-item">Settings</li>
            </Link>
            <Link to="">
              <li className="nav-item">Daily Case Report</li>
            </Link>
            <Link to="/excelFile">
              <li className="nav-item">Test Group</li>
            </Link>
            <Link to="/About">
              <li className="nav-item">About</li>
            </Link>
          </ul>
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/login");
              });
            }}
            className="log-out-bar"
          >
            Logout
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.section`

.nav-item {
  display: inline-block;
  margin: 1vh 2vh;
  font-weight: 800;
  font-size: 1vw;
  color: #132333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-item:hover {
  color: #ffffff;
  background-color: #2d3748;
  border-radius: 5px;
  padding: 0.4vh 1vh;
}

.log-out-bar {
  font-size: small;
  color:  #fff;
  background-color: #2971ab;
}

.log-out-bar:hover {
  color: #2971ab;
  background-color:  #fff;
  padding: 1vh 4vh;
  transition: all 0.3s ease;
}

`

export default Navbar;
