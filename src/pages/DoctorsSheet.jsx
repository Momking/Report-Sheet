import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Components/Navbar";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData } from "../Components/storeUserData";
import { useAuth } from "../Context/AuthContext";
import { db } from "../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Invoice from "../Components/Print/Invoice";
import { useReactToPrint } from "react-to-print";
import { BsArrowLeft } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { TestName } from "../Components/Data/TestName";

const DoctorsSheet = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { PidValue, date } = location.state || {};
  const [headers, setHeaders] = useState([]);
  const [testData, setTestData] = useState({ tests: [] });
  const [test, setTest] = useState([]);
  const [rate, setRate] = useState([]);
  const [vno, setVno] = useState("");
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();
  const componentRef = useRef(null);
  const [printData, setPrintData] = useState([]);
  const [saveAndPrint, setSaveAndPrint] = useState(false);
  const { enqueueSnackbar } = useSnackbar("");

  const handleTestChange = (e, index) => {
    let value = e.target.value.split(",");
    const updateRate = [...rate];
    const updateTest = [...test];
    if (value !== "") {
      updateRate[index] = (
        <input
          key={index}
          style={{
            fontSize: "17px",
            padding: "2px",
            color: "black",
            borderRadius: "1px",
            border: "1px solid #ddd",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`Rate${index}`}
          id="name"
          placeholder="Rate"
          defaultValue={value[6]}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
      updateTest[index] = (
        <input
          key={index}
          style={{
            fontSize: "17px",
            padding: "2px",
            color: "black",
            borderRadius: "1px",
            border: "1px solid #ddd",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`TestName${index}`}
          id="name"
          placeholder="Rate"
          defaultValue={value[1]}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
    }
    setRate(updateRate);
    setTest(updateTest);
  };

  const handleClick = () => {
    const index = headers.length;
    console.log(headers.length);
    if (headers.length === 0 || test[headers.length - 1].type !== "select") {
      const newHeader = (
        <h1
          key={index}
          style={{ color: "black", fontSize: "10px", border: "1px solid #ddd" }}
        >
          {index + 1}
        </h1>
      );

      const newTest = (
        <select
          id="options"
          name={`TestName1${index}`}
          onChange={(e) => handleTestChange(e, index)}
          style={{
            fontSize: "17px",
            padding: "2px",
            borderRadius: "1px",
            border: "1px solid #ddd",
            minWidth: "50%",
          }}
        >
          {TestName.map((name, i) => (
            <option key={i} value={name}>
              {name[1]}
            </option>
          ))}
        </select>
      );

      const newRate = (
        <input
          key={index}
          style={{
            fontSize: "17px",
            padding: "2px",
            color: "black",
            borderRadius: "1px",
            border: "1px solid #ddd",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`Rate1${index}`}
          id="name"
          placeholder="Rate"
          onChange={handleChange}
          onBlur={handleBlur}
        />
      );

      if (headers.length < 20) {
        setHeaders([...headers, newHeader]);
        setTest([...test, newTest]);
        setRate([...rate, newRate]);
      }
    } else {
      enqueueSnackbar("Fill up the test option", {
        variant: "info",
      });
    }
  };

  const handleAddMultipleTests = (count) => {
    const newHeaders = [];
    const newTests = [];
    const newRates = [];

    for (let i = 0; i < count; i++) {
      newHeaders.push(
        <h1
          key={headers.length + i}
          style={{ color: "black", fontSize: "10px", border: "1px solid #ddd" }}
        >
          {headers.length + i + 1}
        </h1>
      );
      newTests.push(
        <input
          key={test.length + i}
          style={{
            fontSize: "17px",
            padding: "2px",
            borderRadius: "1px",
            border: "1px solid #ddd",
          }}
          type="text"
          autoComplete="off"
          name={`TestName${test.length + i}`}
          id="name"
          placeholder="Test name"
          defaultValue={testData.tests[test.length + i]?.TestName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
      newRates.push(
        <input
          key={rate.length + i}
          style={{
            fontSize: "17px",
            padding: "2px",
            borderRadius: "1px",
            border: "1px solid #ddd",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`Rate${rate.length + i}`}
          id="name"
          placeholder="Rate"
          defaultValue={testData?.tests[rate.length + i]?.Rate || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
    }

    setHeaders((prevHeaders) => [...prevHeaders, ...newHeaders]);
    setTest((prevTest) => [...prevTest, ...newTests]);
    setRate((prevRate) => [...prevRate, ...newRates]);
  };

  const handleClick2 = () => {
    if (headers.length > 0) {
      setHeaders(headers.slice(0, -1));
      setTest(test.slice(0, -1));
      setRate(rate.slice(0, -1));
    }
  };
  const handleFind = async (e) => {
    try {
      let userDocRef = null;
      if (e.length != undefined) {
        userDocRef = doc(db, currentUser.uid, `${e}`);
      } else {
        userDocRef = doc(db, currentUser.uid, vno);
      }
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        handleNew2();
        const userFetchData = userDocSnapshot.data();
        setTestData(userFetchData);
      } else {
        setError(true);
        enqueueSnackbar("Voucher no doesn't exist", { variant: "info" });
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching data from Firestore: ", error);
      enqueueSnackbar("Something went wrong", {
        variant: "info",
      });
    }
  };

  useEffect(() => {
    if (testData.tests) {
      handleAddMultipleTests(testData.tests.length);
    }
  }, [testData]);

  useEffect(() => {
    if (PidValue) {
      handleFind(PidValue);
    }
  }, [PidValue]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleNew = () => {
    setVno("");
    setError(false);
    setHeaders([]);
    setTest([]);
    setRate([]);
    setTestData({ tests: [] });
    setPrintData([]);
    document.getElementById("formId").reset();
  };

  const handleNew2 = () => {
    setError(false);
    setHeaders([]);
    setTest([]);
    setRate([]);
    setTestData({ tests: [] });
    setPrintData([]);
    document.getElementById("formId").reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let newTest = test;
    if (test[test.length - 1].props.name === `TestName1${test.length - 1}`) {
      handleClick2();
      newTest = test.slice(0, -1);
    }
    setVno(formData.get("Patient ID"));
    if (vno) {
      const exportData = {
        PatientName: formData.get("Patient Name"),
        PatientID: formData.get("Patient ID"),
        RegistrationOn: formData.get("Registration On"),
        Age: formData.get("Age"),
        ContactDetails: formData.get("Contact Details"),
        CollectionOn: formData.get("Collection On"),
        Sex: formData.get("Sex"),
        RefByDr: formData.get("Ref By Dr"),
        ReportingOn: formData.get("Reporting On"),
        CenterID: formData.get("Center ID"),
        CenterName: formData.get("Center Name"),
        tests: newTest.map((_, index) => ({
          TestName: formData.get(`TestName${index}`),
          Rate: formData.get(`Rate${index}`),
        })),
        EmailAddress: formData.get("Email Address"),
        GrandAmount: formData.get("Grand Amount"),
        AdvanceAmount: formData.get("Advance Amount"),
        Discount: formData.get("Discount"),
        BalanceAmount: formData.get("Balance Amount"),
      };
      console.log(exportData);
      await storeUserData(vno, exportData, currentUser);

      const newPendingData = {
        [vno]: {
          PatientID: vno,
          PatientName: formData.get("Patient Name"),
          Age: formData.get("Age"),
          Sex: formData.get("Sex"),
          Status: "Pending",
          CenterID: formData.get("Center ID"),
          CenterName: formData.get("Center Name"),
          GrandAmount: formData.get("Grand Amount"),
          AdvanceAmount: formData.get("Advance Amount"),
          Discount: formData.get("Discount"),
          BalanceAmount: formData.get("Balance Amount"),
        },
      };
      const date = formData.get("Registration On");
      let [year, month, day] = date.split("-");
      month = `Month: ${month}`;
      day = `Date: ${day}`;

      const yearData = {
        [month]: {
          [day]: {
            [vno]: {
              PatientID: vno,
              PatientName: formData.get("Patient Name"),
              Age: formData.get("Age"),
              Sex: formData.get("Sex"),
              Status: "Pending",
              CenterID: formData.get("Center ID"),
              CenterName: formData.get("Center Name"),
              GrandAmount: formData.get("Grand Amount"),
              AdvanceAmount: formData.get("Advance Amount"),
              Discount: formData.get("Discount"),
              BalanceAmount: formData.get("Balance Amount"),
            },
          },
        },
      };
      //-----------------------------------------------------
      const pendingReportRef2 = doc(db, currentUser.uid, `Year: ${year}`);
      const pendingReportSnapshot2 = await getDoc(pendingReportRef2);
      let existingPendingData2 = {};

      if (pendingReportSnapshot2.exists()) {
        existingPendingData2 = pendingReportSnapshot2.data();
      }

      const updatedPendingData2 = { ...existingPendingData2 };
      if (!updatedPendingData2[month]) {
        updatedPendingData2[month] = {};
      }
      if (!updatedPendingData2[month][day]) {
        updatedPendingData2[month][day] = {};
      }
      updatedPendingData2[month][day][vno] = {
        PatientID: vno,
        PatientName: formData.get("Patient Name"),
        Age: formData.get("Age"),
        Sex: formData.get("Sex"),
        Status: "Pending",
        CenterID: formData.get("Center ID"),
        CenterName: formData.get("Center Name"),
        GrandAmount: formData.get("Grand Amount"),
        AdvanceAmount: formData.get("Advance Amount"),
        Discount: formData.get("Discount"),
        BalanceAmount: formData.get("Balance Amount"),
      };
      await setDoc(pendingReportRef2, updatedPendingData2);
      //-------------------------------------------------------

      setPrintData(exportData);
      if (saveAndPrint === true) {
        setTimeout(handlePrint, 100);
      }
      setTimeout(handleNew, 200);
      enqueueSnackbar("Your Report saved", { variant: "info" });
    } else {
      enqueueSnackbar("Voucher no is empty", { variant: "info" });
    }
  };

  const handleBlur = (e) => {};
  const handleChange = () => {};

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      <Navbar destination={"/"} />
      <Wrapper>
        {printData && <Invoice ref={componentRef} printData={printData} />}
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <button
                onClick={() => navigate("/FindReport2", { state: { date } })}
                style={{
                  position: "absolute",
                  fontSize: "15px",
                  height: "7%",
                  backgroundColor: "#2d3748",
                  padding: "8px",
                  borderRadius: "10px",
                  width: "fit-content",
                  cursor: "pointer",
                }}
              >
                <BsArrowLeft />
                &nbsp; Go back to Patient List
              </button>
              <div className="modal-left">
                <h1 className="modal-title">NEW REGISTRATION</h1>
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
                        }}
                      >
                        <div>
                          <label htmlFor="email" className="input-label">
                            Patient Name:&nbsp;
                          </label>
                          <input
                            type="name"
                            autoComplete="off"
                            name="Patient Name"
                            id="email"
                            placeholder="Email"
                            defaultValue={testData.PatientName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="name" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Patient
                            ID:&nbsp;
                          </label>
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Patient ID"
                            id="name"
                            placeholder="Name"
                            defaultValue={testData.PatientID}
                            onChange={(e) => setVno(e.target.value)}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="name" className="input-label">
                            Registration On:&nbsp;
                          </label>
                          <input
                            type="date"
                            autoComplete="off"
                            name="Registration On"
                            id="name"
                            placeholder="currentDate.toISOString().split('T')[0]"
                            defaultValue={
                              testData.Date
                                ? new Date(testData.RegistrationOn)
                                    .toISOString()
                                    .split("T")[0]
                                : getCurrentDateIST()
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <label htmlFor="email" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age:&nbsp;
                          </label>
                          <input
                            type="text"
                            // pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Age"
                            id="email"
                            placeholder="Email"
                            defaultValue={testData.Age}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="input-label">
                            Contact Details:&nbsp;
                          </label>
                          <input
                            pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Contact Details"
                            id="email"
                            placeholder="Email"
                            defaultValue={testData.ContactDetails}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="name" className="input-label">
                            Collection On:&nbsp;
                          </label>
                          <input
                            type="date"
                            autoComplete="off"
                            name="Collection On"
                            id="name"
                            placeholder="currentDate.toISOString().split('T')[0]"
                            defaultValue={
                              testData.Date
                                ? new Date(testData.CollectionOn)
                                    .toISOString()
                                    .split("T")[0]
                                : getCurrentDateIST()
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <label htmlFor="email" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sex:&nbsp;
                          </label>
                          <select
                            id="options"
                            name="Sex"
                            defaultValue={testData.Sex}
                            style={{
                              fontSize: "15px",
                              padding: "2px",
                              borderRadius: "1px",
                              border: "1px solid #ddd",
                            }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Neutral">Neutral</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="name" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ref
                            By Dr:&nbsp;
                          </label>
                          <input
                            type="name"
                            autoComplete="off"
                            name="Ref By Dr"
                            id="name"
                            placeholder="Doctor's Name"
                            defaultValue={testData.RefByDr}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="name" className="input-label">
                            Reporting On:&nbsp;
                          </label>
                          <input
                            type="date"
                            autoComplete="off"
                            name="Reporting On"
                            id="name"
                            placeholder="currentDate.toISOString().split('T')[0]"
                            defaultValue={
                              testData.Date
                                ? new Date(testData.ReportingOn)
                                    .toISOString()
                                    .split("T")[0]
                                : getCurrentDateIST()
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <div>
                          <label htmlFor="email" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Center ID:&nbsp;
                          </label>
                          <input
                            type="name"
                            autoComplete="off"
                            name="Center ID"
                            id="email"
                            placeholder="Email"
                            defaultValue={testData.CenterID}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="input-label">
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Center
                            Name:&nbsp;
                          </label>
                          <input
                            type="name"
                            autoComplete="off"
                            name="Center Name"
                            id="email"
                            placeholder="Email"
                            defaultValue={testData.CenterName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      border: "3px solid #ddd",
                      borderRadius: "4px",
                      overflowY: "auto",
                      height: "20vh",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #ddd",
                        }}
                      >
                        <label htmlFor="email" className="input-label">
                          Sr no.&nbsp;
                        </label>
                        {headers}
                      </div>
                      <div
                        style={{
                          width: "60%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #ddd",
                        }}
                      >
                        <label htmlFor="email" className="input-label">
                          INVESTIGATION NAME&nbsp;
                        </label>
                        {test}
                      </div>
                      <div
                        style={{
                          width: "20%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #ddd",
                        }}
                      >
                        <label htmlFor="email" className="input-label">
                          RATE&nbsp;
                        </label>
                        {rate}
                      </div>
                    </div>
                  </div>
                  <div className="input-block">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <label htmlFor="Email" className="input-label">
                          Email Address:&nbsp;
                        </label>
                        <input
                          type="Email"
                          autoComplete="off"
                          name="Email Address"
                          id="Email"
                          placeholder="Email"
                          defaultValue={testData.EmailAddress}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                      <button
                        className="input-button2"
                        type="button"
                        onClick={handleClick}
                        style={{
                          padding: "0px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          height: "35px",
                        }}
                      >
                        Add test
                      </button>
                      <button
                        className="input-button2"
                        type="button"
                        onClick={handleClick2}
                        style={{
                          padding: "0px",
                          paddingLeft: "5px",
                          paddingRight: "5px",
                          height: "35px",
                        }}
                      >
                        Remove test
                      </button>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <label htmlFor="Email" className="input-label">
                          &nbsp;&nbsp;&nbsp;&nbsp;Grand Amount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Grand Amount"
                            // value={amount2}
                            placeholder="0"
                            defaultValue={testData.GrandAmount || 0}
                            onChange={handleChange}
                            readOnly
                          />
                        </label>
                        <label htmlFor="Email" className="input-label">
                          Advance Amount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Advance Amount"
                            // value={amount2}
                            placeholder="0"
                            defaultValue={testData.AdvanceAmount || 0}
                            onChange={handleChange}
                            readOnly
                          />
                        </label>
                        <label htmlFor="Email" className="input-label">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Discount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Discount"
                            // value={amount2}
                            placeholder="0"
                            defaultValue={testData.Discount || 0}
                            onChange={handleChange}
                            readOnly
                          />
                        </label>
                        <label htmlFor="Email" className="input-label">
                          &nbsp;&nbsp;Balance Amount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Balance Amount"
                            // value={amount2}
                            placeholder="0"
                            defaultValue={testData.BalanceAmount || 0}
                            onChange={handleChange}
                            readOnly
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="modal-buttons">
                    <button
                      className="input-button"
                      type="button"
                      onClick={handleFind}
                    >
                      Find a Report
                    </button>
                    <div style={{ padding: "2px" }}>
                      <button
                        className="input-button"
                        type="button"
                        onClick={handleNew}
                        style={{ marginRight: "2px" }}
                      >
                        NEW REPORT
                      </button>
                      <button
                        className="input-button"
                        type="submit"
                        style={{ marginRight: "2px" }}
                        onClick={() => setSaveAndPrint(false)}
                      >
                        SAVE
                      </button>
                      <button
                        className="input-button"
                        type="submit"
                        onClick={() => setSaveAndPrint(true)}
                      >
                        SAVE & PRINT
                      </button>
                    </div>
                  </div>
                </form>
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
    padding: 50px 30px 20px;
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
    // padding: 1.2rem 3.2rem;
    outline: none;
    text-transform: uppercase;
    border: 0;
    color: #fff;
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
    // border: 1px solid #ddd;
    // border-radius: 4px;
    margin-bottom: 10px;
    transition: 0.3s;
  }

  .input-block input {
    outline: 0;
    border: 0;
    padding: 4px 4px 1px;
    border-radius: 3px;
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

  @media (max-width: 750px) {
    .modal-container {
      max-width: 90vw;
    }

    .modal-right {
      display: none;
    }
    .flexChange {
      flex-direction: column;
    }
  }
`;

export default DoctorsSheet;
