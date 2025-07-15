import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData } from "../../Components/storeUserData";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Invoice from "../../Components/Print/Invoice";
import { useReactToPrint } from "react-to-print";
import PendingReport from "../../Components/PendingReport";
import Receipt from "../../Components/Print/Receipt";
import { TestName } from "../../Components/Data/TestName";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import PopUpCard from "../../Components/PopUpCard";
import CommentBox from "../../Components/CommentBox";

const TestReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { AdiValue, date } = location.state || {};
  const [testData, setTestData] = useState({ tests: [] });
  const [headers, setHeaders] = useState([]);
  const [test, setTest] = useState([]);
  const [findings, setFindings] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [adi, setAdi] = useState("");
  const [cards, setCards] = useState(null);
  const [comment, setComment] = useState(null);
  const [error, setError] = useState(false);
  const { currentUser } = useAuth();
  const invoiceRef = useRef(null);
  const receiptRef = useRef(null);
  const [printData, setPrintData] = useState([]);
  const [saveAndPrint, setSaveAndPrint] = useState(false);
  const [saveAndPrint2, setSaveAndPrint2] = useState(false);
  const { enqueueSnackbar } = useSnackbar("");

  const handleAddMultipleTests = (count) => {
    const newHeaders = [];
    const newTests = [];
    const newButtons = [];
    console.log("is enter...");
    for (let i = 0; i < count; i++) {
      newHeaders.push(
        <h1
          key={headers.length + i}
          style={{ color: "black", fontSize: "13px", border: "1px solid #ddd", height: "29px" }}
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
            background: "#606a69",
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
      newButtons.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "2px",
            justifyContent: "space-around",
            border: "1px solid #ddd",
            height: "29px",
          }}
        >
          <button
            className="input-button"
            type="button"
            style={{
              fontSize: "17px",
              padding: "2px",
              // height: "26px",
              borderRadius: "2px",
            }}
            name={`button1${headers.length + i}`}
            onClick={() => setCards(testData?.tests[findings.length + i])}
          >
            Attach-table
          </button>
          <button
            className="input-button"
            type="button"
            style={{
              fontSize: "17px",
              padding: "2px",
              // height: "26px",
              borderRadius: "2px",
            }}
            name={`button2${headers.length + i}`}
            onClick={() => setComment(testData?.tests[findings.length + i])}
          >
            Comment
          </button>
        </div>
      );
    }

    setHeaders((prevHeaders) => [...prevHeaders, ...newHeaders]);
    setTest((prevTest) => [...prevTest, ...newTests]);
    setButtons((prevButtons) => [...prevButtons, ...newButtons]);
  };

  const handleAdmissionIDSelect = (AdmissionID) => {
    setAdi(AdmissionID);
    handleFind(AdmissionID);
  };

  const handleFind = async (e) => {
    try {
      let userDocRef = null;
      if (e.length != undefined) {
        userDocRef = doc(db, currentUser.uid, `RD${e}`);
      } else {
        userDocRef = doc(db, currentUser.uid, `RD${adi}`);
      }
      const userDocSnapshot = await getDoc(userDocRef);
      console.log("doc: ",userDocSnapshot);

      if (userDocSnapshot.exists()) {
        handleNew2();
        const userFetchData = userDocSnapshot.data();
        setTestData(userFetchData);
      } else {
        let userDocInitial = null;
        if (e.length != undefined) {
          userDocInitial = doc(db, currentUser.uid, `${e}`);
        } else {
          userDocInitial = doc(db, currentUser.uid, `${adi}`);
        }

        const userDocInitialSnapshot = await getDoc(userDocInitial);

        if (userDocInitialSnapshot.exists()) {
          handleNew2();
          const userFetchData = userDocInitialSnapshot.data();
          setTestData(userFetchData);
        } else {
          setError(true);
          enqueueSnackbar("Admission ID doesn't exist", { variant: "info" });
        }
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
      handleAdmissionIDSelect;
    }
  }, [testData]);

  useEffect(() => {
    if (AdiValue) {
      handleFind(AdiValue);
    }
  }, [AdiValue]);

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
  });

  const handleNew = () => {
    setAdi("");
    setError(false);
    setHeaders([]);
    setTest([]);
    setButtons([]);
    setTestData({ tests: [] });
    setPrintData([]);
    setSaveAndPrint(false);
    setSaveAndPrint2(false);
    document.getElementById("formId").reset();
  };

  const handleNew2 = () => {
    setError(false);
    setHeaders([]);
    setTest([]);
    setButtons([]);
    setTestData({ tests: [] });
    setPrintData([]);
    setSaveAndPrint(false);
    setSaveAndPrint2(false);
    document.getElementById("formId").reset();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const admissionID = formData.get("Patient ID");
    setAdi(admissionID);

    if (admissionID) {
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
        tests: test.map((_, index) => ({
          TestName: formData.get(`TestName${index}`),
          normalValue: formData.get(`normalValue${index}`),
          findings: formData.get(`findings${index}`),
          buttons: formData.get(`buttons${index}`),
        })),
      };

      await storeUserData(`RD${admissionID}`, exportData, currentUser);
      //===============================================================

      const date = formData.get("Registration On");
      let [year, month, day] = date.split("-");
      month = `Month: ${month}`;
      day = `Date: ${day}`;

      const yearData = {
        [month]: {
          [day]: {
            [admissionID]: {
              PatientID: admissionID,
              PatientName: formData.get("Patient Name"),
              Age: formData.get("Age"),
              Sex: formData.get("Sex"),
              Status: "Pending",
              CenterID: formData.get("Center ID"),
              CenterName: formData.get("Center Name"),
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
      updatedPendingData2[month][day][admissionID] = {
        PatientID: admissionID,
        PatientName: formData.get("Patient Name"),
        Age: formData.get("Age"),
        Sex: formData.get("Sex"),
        Status: "Pending",
        CenterID: formData.get("Center ID"),
        CenterName: formData.get("Center Name"),
      };
      await setDoc(pendingReportRef2, updatedPendingData2);

      //================================================

      setPrintData(exportData);
      if (saveAndPrint2 && !saveAndPrint) {
        setTimeout(handlePrintReceipt, 100);
        setTimeout(handleNew, 1000);
      }

      if (saveAndPrint && !saveAndPrint2) {
        setTimeout(handlePrintInvoice, 100);
        setTimeout(handleNew, 1000);
      }
      if (!saveAndPrint && !saveAndPrint2) {
        handleNew();
      }

      enqueueSnackbar("Your Report saved", { variant: "info" });
    } else {
      enqueueSnackbar("Admission ID is empty", { variant: "info" });
    }
  };

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  const handleBlur = (e) => {};
  const handleChange = () => {};

  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      <Navbar destination={"/"} />
      <Wrapper>
        {printData && <Invoice ref={invoiceRef} printData={printData} />}
        {printData && <Receipt ref={receiptRef} printData={printData} />}
        {cards && <PopUpCard testData={cards} onClose={() => setCards(null)} />}
        {comment && (
          <CommentBox testData={comment} onClose={() => setComment(null)} />
        )}
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <button
                onClick={() => navigate("/doctor_use/FindReport", { state: { date } })}
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
                <h1 className="modal-title">TEST REPORT</h1>
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
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Patient
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
                            onChange={(e) => setAdi(e.target.value)}
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
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Age:&nbsp;
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
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sex:&nbsp;
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
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Center ID:&nbsp;
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
                    className="testName"
                    style={{ overflowY: "auto" }} >
                    <div style={{ display: "flex" }}>
                      <div
                        style={{
                          width: "10%",
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
                          width: "50%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #ddd",
                          color: "black",
                        }}
                      >
                        <label htmlFor="email" className="input-label">
                          TEST NAME&nbsp;
                        </label>
                        {test}
                      </div>
                      <div
                        style={{
                          width: "40%",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #ddd",
                        }}
                      >
                        <label htmlFor="email" className="input-label">
                          Buttons&nbsp;
                        </label>
                        {buttons}
                      </div>
                    </div>
                  </div>
                  <br></br>
                  <div className="modal-buttons">
                      <button
                        className="input-button"
                        type="button"
                        onClick={handleNew}
                        style={{ marginRight: "2px" }}
                      >
                        NEW REPORT
                      </button>
                    <div style={{ padding: "2px" }}>
                      
                      <button
                        className="input-button"
                        type="submit"
                        style={{ marginRight: "2px" }}
                        onClick={() => {
                          setSaveAndPrint(false);
                          setSaveAndPrint2(false);
                        }}
                      >
                        SAVE
                      </button>
                      <button
                        className="input-button"
                        type="submit"
                        style={{ marginRight: "2px" }}
                        onClick={() => {
                          setSaveAndPrint(true);
                          setSaveAndPrint2(false);
                        }}
                      >
                        SAVE & PRINT INVOICE
                      </button>
                      <button
                        className="input-button"
                        type="submit"
                        onClick={() => {
                          setSaveAndPrint2(true);
                          setSaveAndPrint(false);
                        }}
                      >
                        SAVE & PRINT RECEIPT
                      </button>
                    </div>
                  </div>
                </form>
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
                <PendingReport onAdmissionIDSelect={handleAdmissionIDSelect} />
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
    // height: 90vh;
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
    width: 100%;
    flex: 1.5;
    transition-duration: 0.5s;
    opacity: 1;
  }

  .modal-right {
    border: 2px solid #8c7569;
    border-radius: 10px;
    padding: 0px 20px 0px;
    width: 30%:
    flex: 2;
    transition: 0.3s;
    overflow: hidden;
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
    font-size: 13px;
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
    background: #606a69;
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

  .testName {
    overflowY: auto;
    border: 3px solid #ddd;
    borderRadius: 4px;
    height: 35vh;
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

    .testName {
      height: 20vh;
    }

    .input-label {
      font-size: 13px;
    }
  }

  @media (max-width: 1000px) {
    .testName {
      height: 25vh;
    }

    .modal-right {
      display: none;
    }
  }

  @media (max-height: 720px) {
    .testName {
      height: 25vh;
    }

    .input-label {
      font-size: 11px;
    }
  }
`;

export default TestReport;
