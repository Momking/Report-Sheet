import React, { useState } from "react";
import styled from "styled-components";
import Navbar from "../../Components/Navbar";
import { useAuth } from "../../Context/AuthContext";
import TestList from "../../Components/TestList";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const TestMaster = () => {
    const {currentUser} = useAuth();
    const [testName, setTestName] = useState();
    const [rate, setRate] = useState();
    const [unit, setUnit] = useState();
    const [grounpName, setGroupName] = useState();
    const [value, setValue] = useState({
        normalValue: "",
        minValue: "",
        maxValue: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent page reload
      
        const testDataRef = doc(db, currentUser.uid, "TestName");
        const testDataSnapshot = await getDoc(testDataRef);
      
        let existingTestArray = [];
      
        if (testDataSnapshot.exists()) {
          existingTestArray = testDataSnapshot.data().TestName || [];
        }
      
        const newTest = {
          "TEST NAME": testName?.toUpperCase() || "",
          "RATE": Number(rate) || 0,
          "UNIT": unit?.toUpperCase() || "",
          "GROUP -NAME ": grounpName?.toUpperCase() || "",
          "NORMAL  VALUE": value.normalValue || "",
          "MIN - VALUE": value.minValue ? Number(value.minValue) : null,
          "MAX VALUE": value.maxValue ? Number(value.maxValue) : null,
          "RATE(DISC)": 0,
          "SO.NO": existingTestArray.length + 1,
        };
      
        const updatedTestArray = [...existingTestArray, newTest];
      
        await setDoc(testDataRef, { TestName: updatedTestArray });
      
        alert("Test saved successfully.");
      };
      
      

    const handleNew = () => {
        setTestName();
        setRate();
        setUnit()
        setGroupName()
        setValue({
            normalValue: "",
            minValue: "",
            maxValue: "",
        })
    }

    const handleTestChange = (testData) => {
        setTestName(testData["TEST NAME"]);
        setRate(testData["RATE"]);
        setUnit(testData["UNIT"])
        setGroupName(testData["GROUP -NAME "])
        setValue({
            normalValue: testData["NORMAL  VALUE"],
            minValue: testData["MIN - VALUE"],
            maxValue: testData["MAX VALUE"],
        })
    }

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
                                <form onSubmit={handleSubmit} id="formId">
                                    <div className="input-block">
                                        <div
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <div
                                                style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "5vh",
                                            }}
                                            >
                                                <div>
                                                    <label htmlFor="email" className="input-label" style={{marginRight: "3vh"}}>
                                                        Test Name:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={testName}
                                                        onChange={(e) => setTestName(e.target.value)}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="input-label">
                                                        Test Rate:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={rate}
                                                        onChange={(e) => setRate(e.target.value)}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "5vh",
                                            }}
                                            >
                                                <div>
                                                    <label htmlFor="email" className="input-label">
                                                        Normal Value:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={value.normalValue}
                                                        onChange={(e) => setValue({normalValue: e.target.value})}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="input-label">
                                                        Unit:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={unit}
                                                        onChange={(e) => setUnit(e.target.value)}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                padding: "5vh",
                                            }}
                                            >
                                                <div>
                                                    <label htmlFor="email" className="input-label" style={{marginRight: "3vh"}}>
                                                        Min Value:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={value.minValue}
                                                        onChange={(e) => setValue({minValue: e.target.value})}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="email" className="input-label">
                                                        Max Value:&nbsp;
                                                    </label>
                                                    <input
                                                        type="name"
                                                        autoComplete="off"
                                                        name="Patient Name"
                                                        id="email"
                                                        placeholder="Email"
                                                        defaultValue={value.maxValue}
                                                        onChange={(e) => setValue({maxValue: e.target.value})}
                                                        style={{textTransform: "uppercase"}}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-buttons">
                                        <button
                                            className="input-button"
                                            type="button"
                                            onClick={handleNew}
                                            style={{ marginRight: "2px" }}
                                        >
                                            NEW TEST
                                        </button>
                                        <div style={{ padding: "2px" }}>
                                        
                                        <button
                                            className="input-button"
                                            type="submit"
                                            style={{ marginRight: "2px" }}
                                        >
                                            SAVE
                                        </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div
                                className="modal-right"
                                style={{
                                color: "black",
                                width: "35%",
                                overflowY: "auto",
                                height: "80vh",
                                }}
                            >
                                <TestList onTestNameSelect={handleTestChange}/>
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
    font-size: 13px;
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
    border-radius: 3px;
    font-size: 15px;
    color: black;
    background: #fff;
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
  // .input-block:focus-within .input-label {
  //   color: rgba(140, 117, 105, 0.8);
  // }

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