import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Navbar from "../Components/Navbar";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const ViewReport = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, date } = location.state || {};
  const [test, setTest] = useState([]);

  const handleAddMultipleTests = (count) => {
    const newTests = [];

    for (let i = 0; i < count; i++) {
      newTests.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "2vh",
            justifyContent: "space-evenly",
            alignItems: "center",
            color: "black",
          }}
        >
          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "50%",
            }}
          >
            {userData.tests[test.length + i].TestName}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "20%",
            }}
          >
            {userData.tests[test.length + i].normalValue}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "15%",
            }}
          >
            {userData.tests[test.length + i].findings}
          </p>

          <p
            style={{
              fontSize: "17px",
              padding: "2px",
              borderRadius: "1px",
              width: "15%",
            }}
          >
            {userData.tests[test.length + i].pf1}
          </p>
        </div>
      );
    }
    setTest((prevTest) => [...prevTest, ...newTests]);
  };

  useEffect(() => {
    if (userData.tests.length !== 0)
      handleAddMultipleTests(userData.tests.length);
  }, []);

  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      <Navbar destination={"/FindReport"} />
      <Wrapper>
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <div style={{ display: "flex" }}>
                <BsArrowLeft
                  style={{
                    fontSize: "30px",
                    backgroundColor: "#2d3748",
                    padding: "8px",
                    borderRadius: "10px",
                    width: "fit-content",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/FindReport", { state: { date } })}
                />
              </div>
              <div className="modal-left">
                <div className="input-block">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <label htmlFor="name" className="input-label">
                          Admission ID No:&nbsp;
                        </label>
                        <h4>{userData.AdmissionID}</h4>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <label htmlFor="name" className="input-label">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date:&nbsp;
                        </label>
                        <h4>{userData.Date}</h4>
                      </div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <label htmlFor="name" className="input-label">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ref
                          By Dr:&nbsp;
                        </label>
                        <h4>Dr {userData.RefByDr}</h4>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <label htmlFor="email" className="input-label">
                          Test Collection Center:&nbsp;
                        </label>
                        <h4>{userData.TestCollectionCenter}</h4>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    className="flexChange"
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="email" className="input-label">
                        &nbsp;&nbsp;&nbsp;&nbsp;Patient Name:&nbsp;
                      </label>
                      <h4>{userData.PatientName}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="email" className="input-label">
                        Age:&nbsp;
                      </label>
                      <h4>{userData.Age}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="email" className="input-label">
                        &nbsp;Sex:&nbsp;
                      </label>
                      <h4>{userData.Sex}</h4>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "2vh",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    borderBottom: "1px solid #4d4d4d",
                    color: "black",
                  }}
                >
                  <h4 style={{ width: "50%" }}>TestName</h4>
                  <h4 style={{ width: "20%" }}>Result</h4>
                  <h4 style={{ width: "15%" }}>Reference Value</h4>
                  <h4 style={{ width: "15%" }}>Unit</h4>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    borderBottom: "1px solid #4d4d4d",
                  }}
                >
                  {test}
                </div>
                <div className="input-block">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <label htmlFor="text" className="input-label">
                        Remarks:&nbsp;
                      </label>
                      <h4>{userData.Remark}</h4>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <label htmlFor="Email" className="input-label">
                        &nbsp;&nbsp;&nbsp;UnPaid Amount:&nbsp;
                        {userData.UnPaidAmount}
                      </label>
                      <label htmlFor="Email" className="input-label">
                        Received Amount:&nbsp;{userData.ReceivedAmount}
                      </label>
                      <label htmlFor="Email" className="input-label">
                        &nbsp;&nbsp;Balance Amount:&nbsp;
                        {userData.BalanceAmount}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #efedee;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .modal {
    width: 100%;
    background: rgba(51, 51, 51, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.4s;
  }
  .modal-container {
    display: flex;
    max-width: 95vw;
    width: 100%;
    border-radius: 10px;
    overflow: hidden;
    position: absolute;

    transition-duration: 0.3s;
    background: #fff;
  }
  .modal-title {
    margin: 0;
    font-weight: 400;
    color: #55311c;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 6px 0 30px 0;
  }
  .modal-left {
    padding: 60px 30px 20px;
    background: #fff;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
  }

  .modal.is-open .modal-left {
    transform: translateY(0);
    opacity: 1;
    transition-delay: 0.1s;
  }
  .modal-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .modal-buttons a {
    color: rgba(51, 51, 51, 0.6);
    font-size: 14px;
  }

  .input-button {
    outline: none;
    text-transform: uppercase;
    border: 0;
    border-radius: 4px;
    background: #8c7569;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button:hover {
    background: #55311c;
  }
  .input-button2 {
    outline: none;
    border: 0;
    color: #fff;
    border-radius: 4px;
    background: #8c7569;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button2:hover {
    background: #55311c;
  }

  .input-label {
    font-size: 11px;
    // text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: #8c7569;
    transition: 0.3s;
  }

  .input-block {
    display: flex;
    flex-direction: column;
    padding: 10px 10px 8px;
    color: black;
    // border: 1px solid #ddd;
    // border-radius: 4px;
    margin-bottom: 10px;
    transition: 0.3s;
  }

  @media (max-width: 750px) {
    .modal-container {
      max-width: 90vw;
    }
    .flexChange {
      flex-direction: column;
    }
  }
`;

export default ViewReport;
