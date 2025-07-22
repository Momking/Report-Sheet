import React from "react";
import styled from "styled-components";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../Context/AuthContext";
import TestList from "../../Components/TestList";

const TestMaster = () => {
    const {currestUser} = useAuth();

    return(
        <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
            <Navbar destination={"/doctor_use/TestAdmission"} />
            <Wrapper>
                <div className="container">
                    <div className="modal">
                        <div className="modal-container">
                            <div className="modal-left">
                                <h1 className="modal-title">Test Master</h1>
                                <br/>
                            </div>
                            <div
                                className="modal-right"
                                style={{
                                color: "black",
                                width: "15%",
                                overflowY: "auto",
                                height: "80vh",
                                }}
                            >
                                <TestList onAdmissionIDSelect={handleAdmissionIDSelect} />
                            </div>
                        </div>
                    </div>
                </div>
            </Wrapper>
        </div>
    );
}

const Wrapper = styled.section`
  .container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #eef3f3;
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
    color: #023656;
  }
  .form-error {
    font-size: 1.4rem;
    color: #b22b27;
  }
  .modal-desc {
    margin: 0.375vw 0 3.62vh 0;
  }
  .modal-left {
    padding: 3.75vw 3.62vh 2.14vh;
    background: #e2eff5;
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
    // padding: 1.2rem 3.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
    border-radius: 10px;
    background: #2975ad;
    transition: 0.3s;
    cursor: pointer;
    font-family: "Nunito", sans-serif;
  }
  .input-button:hover {
    color: #2975ad;
    background: #fff;
  }

  .input-label {
    font-size: 15px;
    // text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.7px;
    color: #12263e;
    transition: 0.3s;
  }

  .input-block {
    display: flex;
    flex-direction: column;
    padding: 0.625hw 1.2vh 0.96vh;
    // border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    transition: 0.3s;
  }

  .input-block input {
    outline: 0;
    border: 0;
    padding: 4px 4px 1px;
    border-radius: 10px;
    font-size: 15px;
  }

  .input-block input::-moz-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input:-ms-input-placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block input::placeholder {
    color: #ccc;
    opacity: 1;
  }
  .input-block:focus-within {
    border-color: #8c7569;
  }
  .input-block:focus-within .input-label {
    color: rgba(140, 117, 105, 0.8);
  }

  .search-list {
    color: #2d4b62;
    font-size: 20px;
    font-weight: 300;
    padding: 10px 10px 10px;
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

export default TestMaster;