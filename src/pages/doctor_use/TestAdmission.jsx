import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData } from "../../Components/storeUserData";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../config/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useReactToPrint } from "react-to-print";
import { BsArrowLeft, BsInputCursorText } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import Receipt from "../../Components/Print/Receipt";
import Select from "react-select";
import AppTopNav from "../../Components/TopNavbar";
import { useSidebar } from "../../Context/SidebarContext";

const TestAdmission = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { PidValue, date } = location.state || {};
  const { sidebarExpanded } = useSidebar();
  const [printVisible, setPrintVisible] = useState(false);
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
  const [grandAmount, setGrandAmount] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [TestName, setTestName] = useState([]);
  const [initials, setInitials] = useState({grandAmount: 0, advanceAmount: 0, discount: 0, balanceAmount: 0})

  useEffect(() => {
    let total = 0;
    for (const x of rate) {
      if (typeof x === "number") {
        total += x;
      } else if (typeof x?.props?.defaultValue === "string" && !isNaN(x.props.defaultValue)) {
        total += parseFloat(x.props.defaultValue);
      }else if(typeof x?.props?.defaultValue === "number" && !isNaN(x.props.defaultValue))  {
        total += x?.props?.defaultValue;
      }
    }
    setGrandAmount(total);
    if(testData.tests.length != 0){
      setAdvanceAmount(testData.AdvanceAmount);
      setDiscount(testData.Discount);
      setBalanceAmount(total - testData.AdvanceAmount - testData.Discount);
    }else{
      setBalanceAmount(total - discount - advanceAmount);
    }
  }, [rate, discount, advanceAmount])

  const handleTestChange = (e, index) => {
    const selectedTestName = e.target.value;

    const selectedTest = TestName.find(test => test["TEST NAME"] === selectedTestName);

    if (!selectedTest) return;

    const selectedRate = selectedTest["RATE"];

    const updateRate = [...rate];
    const updateTest = [...test];
      updateRate[index] = (
        <input
          key={index}
          style={{
            fontSize: "17px",
            padding: "2px",
            color: ({ theme }) => (theme.isDark) ? theme.text : "black",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            background: ({ theme }) => (theme.isDark) ? theme.bg : "#fff",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`Rate${index}`}
          id="name"
          placeholder="Rate"
          defaultValue={selectedRate}
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
            color: ({ theme }) => (theme.isDark) ? theme.text : "black",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            background: ({ theme }) => (theme.isDark) ? theme.bg : "#fff",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`TestName${index}`}
          id="name"
          placeholder="Rate"
          defaultValue={selectedTestName}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
    setRate(updateRate);
    setTest(updateTest);
  };

  const handleClick = () => {
    const index = headers.length;
    console.log("type: ", test[test.length - 1]?.type);
    if (headers.length === 0 || test[test.length - 1]?.type === "input") {
      const newHeader = (
        <h1
          key={index}
          style={{
            color: ({ theme }) => (theme.isDark) ? theme.text : "black",
            fontSize: "13px",
            borderTop: "1px solid #ddd",
            height: "29px",
          }}
        >
          {index + 1}
        </h1>
      );
  
      const options = TestName.map((test) => ({
        value: test["TEST NAME"],
        label: test["TEST NAME"],
      }));
  
      const newTest = (
        <Select
          key={index}
          options={options}
          onChange={(selectedOption) => handleTestChange({ target: { value: selectedOption.value } }, index)}
          placeholder="Search test..."
          menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused
                ? ({ theme }) => (theme.isDark ? theme.bg : "#eee") // Hover effect
                : ({ theme }) => (theme.isDark ? theme.bg : "#fff"),
              color: state.isFocused ? ({ theme }) => (theme.isDark ? theme.text : "#000") : ({ theme }) => (theme.isDark ? theme.text : "#000"),
              padding: 10,
              zIndex: "100",
            }),
            singleValue: (provided) => ({
              ...provided,
              color: isDark ? "#fff" : "#000", // Selected value text color
            }),
            placeholder: (provided) => ({
              ...provided,
              color: isDark ? "#aaa" : "#555", // Placeholder text color
            }),
            control: (provided) => ({
              ...provided,
              minWidth: "50%",
              color: ({ theme }) => (theme.isDark) ? theme.text : "black",       // Selected vs non-selected text color
              backgroundColor: ({ theme }) => (theme.isDark) ? theme.bg : "#fff", // Selected vs default background
              borderRadius: "1px",
              borderTop: "1px solid #ddd",
              fontSize: "17px",
              zIndex: "100",
            }),
          }}
        />
      );
  
      const newRate = (
        <input
          key={index}
          style={{
            fontSize: "21px",
            padding: "3px",
            color: ({ theme }) => (theme.isDark) ? theme.text : "#ccc",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            background: ({ theme }) => (theme.isDark) ? theme.bg : "#fff",
          }}
          type="text"
          pattern="^\d*\.?\d{0,2}$"
          autoComplete="off"
          name={`Rate1${index}`}
          id="name"
          placeholder="Rate"
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
        />
      );
  
      if (headers.length < 30) {
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
          style={{ color: ({ theme }) => (theme.isDark) ? theme.text : "black", fontSize: "13px", borderTop: "1px solid #ddd", height: "29px"}}
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
            borderTop: "1px solid #ddd",
            color: ({ theme }) => (theme.isDark) ? theme.text :"black",
            background: ({ theme }) => (theme.isDark) ? theme.bg : "#fff",
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
            borderTop: "1px solid #ddd",
            color: ({ theme }) => (theme.isDark) ? theme.text : "black",
            background: ({ theme }) => (theme.isDark) ? theme.bg : "#fff",
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
        setVno(e);
        userDocRef = doc(db, currentUser.uid, `${e}`);
      } else {
        userDocRef = doc(db, currentUser.uid, vno);
      }
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        handleNew2();
        const userFetchData = userDocSnapshot.data();
        setInitials({
          grandAmount: userFetchData.GrandAmount,
          advanceAmount: userFetchData.AdvanceAmount,
          discount: userFetchData.Discount,
          balanceAmount: userFetchData.BalanceAmount,
        });
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
    onBeforeGetContent: () => {
      setPrintVisible(true);
      return new Promise(resolve => {
        setTimeout(resolve, 200); // allow render before print
      });
    },
    onAfterPrint: () => {
      setPrintVisible(false);
    },
  });

  const handleNew = () => {
    // setVno("");
    setError(false);
    setHeaders([]);
    setTest([]);
    setRate([]);
    setAdvanceAmount(0);
    setDiscount(0);
    setBalanceAmount(0);
    setGrandAmount(0);
    setTestData({ tests: [] });
    setPrintData([]);
    document.getElementById("formId").reset();
    importID(1);
  };

  const handleNew2 = () => {
    setError(false);
    setHeaders([]);
    setTest([]);
    setRate([]);
    setAdvanceAmount(0);
    setDiscount(0);
    setBalanceAmount(0);
    setGrandAmount(0);
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

    if (vno) {
      const exportData = {
        PatientName: formData.get("Patient Name"),
        PatientID: formData.get("Patient ID").toString(),
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

      const new_vno = formData.get("Patient ID").toString();
      await storeUserData(new_vno, exportData, currentUser);

      //----------------------------------------------------

      const pendingReportRef = doc(db, currentUser.uid, `PendingReport`);
      const pendingReportSnapshot = await getDoc(pendingReportRef);
      let existingPendingData = {};
      
      if (pendingReportSnapshot.exists()) {
        existingPendingData = pendingReportSnapshot.data();
      }
      
      const updatedPendingData = { ...existingPendingData };
    
      updatedPendingData[new_vno] = {
        PatientID: new_vno,
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

      await setDoc(pendingReportRef, updatedPendingData);
      //-----------------------------------------------------
      // FINDING BY DATE.
      
      const date = formData.get("Registration On");
      let [year, month, day] = date.split("-");
      month = `Month: ${month}`;
      day = `Date: ${day}`;

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
      updatedPendingData2[month][day][new_vno] = {
        PatientID: new_vno,
        PatientName: formData.get("Patient Name"),
        Age: formData.get("Age"),
        Sex: formData.get("Sex"),
        Status: "Pending",
        RegistrationOn: formData.get("Registration On"),
        CenterID: formData.get("Center ID"),
        CenterName: formData.get("Center Name"),
        RefByDr: formData.get("Ref By Dr"),
        GrandAmount: formData.get("Grand Amount"),
        AdvanceAmount: formData.get("Advance Amount"),
        Discount: formData.get("Discount"),
        BalanceAmount: formData.get("Balance Amount"),
      };
      await setDoc(pendingReportRef2, updatedPendingData2);
      //-------------------------------------------------------
      // FINDING BY NAME AND DATE.

      const name = formData.get("Patient Name").toUpperCase();
      const pendingReportRef3 = doc(db, currentUser.uid, `Name list`);
      const pendingReportSnapshot3 = await getDoc(pendingReportRef3);
      let existingPendingData3 = {};

      if (pendingReportSnapshot3.exists()) {
        existingPendingData3 = pendingReportSnapshot3.data();
      }

      const updatedPendingData3 = { ...existingPendingData3 };

      if (!updatedPendingData3[name]) {
        updatedPendingData3[name] = {};
      }

      if (!updatedPendingData3[name][date]) {
        updatedPendingData3[name][date] = {};
      }

      updatedPendingData3[name][date][new_vno] = {
        PatientID: new_vno,
        PatientName: formData.get("Patient Name"),
        Age: formData.get("Age"),
        Sex: formData.get("Sex"),
        Status: "Pending",
        RegistrationOn: formData.get("Registration On"),
        CenterID: formData.get("Center ID"),
        CenterName: formData.get("Center Name"),
        GrandAmount: formData.get("Grand Amount"),
        AdvanceAmount: formData.get("Advance Amount"),
        Discount: formData.get("Discount"),
        BalanceAmount: formData.get("Balance Amount"),
      };
      await setDoc(pendingReportRef3, updatedPendingData3);
      //---------------------------------------------------------
      // TESTMASTER

      const accountMasterRef = doc(db, currentUser.uid, `Account Master`);
      const accountMasterSnapshot = await getDoc(accountMasterRef);
      let existingAccountMasterData = {};

      if (accountMasterSnapshot.exists()) {
        existingAccountMasterData = accountMasterSnapshot.data();
      }

      const updatedAccountMaster = { ...existingAccountMasterData };

      if (!updatedAccountMaster[year]) {
        updatedAccountMaster[year] = {};
      }

      if (!updatedAccountMaster[year][month]) {
        updatedAccountMaster[year][month] = {};
      }

      if (!updatedAccountMaster[year][month][date]) {
        updatedAccountMaster[year][month][date] = {
          GrandAmount: 0,
          AdvanceAmount: 0,
          Discount: 0,
          BalanceAmount: 0,
        };
      }

      updatedAccountMaster[year][month][date] = {
        GrandAmount: parseFloat(formData.get("Grand Amount")) + parseFloat(updatedAccountMaster[year][month][date].GrandAmount) - initials.grandAmount,
        AdvanceAmount: parseFloat(formData.get("Advance Amount")) + parseFloat(updatedAccountMaster[year][month][date].AdvanceAmount) - initials.advanceAmount,
        Discount: parseFloat(formData.get("Discount")) + parseFloat(updatedAccountMaster[year][month][date].Discount) - initials.discount,
        BalanceAmount: parseFloat(formData.get("Balance Amount")) + parseFloat(updatedAccountMaster[year][month][date].BalanceAmount) - initials.balanceAmount,
      }

      await setDoc(accountMasterRef, updatedAccountMaster);

      //---------------------------------------------------------

      const idRef = doc(db, "Users", currentUser.uid);
      const idRefDoc = await getDoc(idRef);

      if (idRefDoc.exists() && !PidValue) {
        const userData = idRefDoc.data();
        const newVID = parseFloat(userData.VID) + 1;

        const updatedData = {
          ...userData,
          VID: newVID,
        };

        await setDoc(idRef, updatedData);
      }

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

  const importID = async (check = 0) => {
    console.log("hi\n");
    const idRef = doc(db, "Users", currentUser.uid);
    const idRefDoc = await getDoc(idRef);

    const testRefDoc = await getDoc(doc(db, currentUser.uid, "TestName"));
    if (testRefDoc.exists()) {
      setTestName(testRefDoc.data().TestName || []);
    }

    if(idRefDoc.exists()){
      const id = idRefDoc.data();
      let temp = parseFloat(id.VID) + 1;
      if(!vno || check){
        console.log(temp);
        setVno(temp);
      }
    }
  }

  useEffect(() => {
    importID();
  }, [])

  const handleBlur = (e) => {};
  const handleChange = (e) => {
    const { name, value } = e.target;
    const num = parseFloat(value) || 0;

    if (name === "Discount") {
      setDiscount(num);
    } else if (name === "Advance Amount") {
      setAdvanceAmount(num);
    }
  };

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  return (
    <div style={{ backgroundColor: "#eef3f3", width: "100%", height: "100vh" }}>
      <AppTopNav sidebarExpanded={sidebarExpanded} />
      <Navbar destination={"/"} />
      <Wrapper $sidebarExpanded={sidebarExpanded}>
        {printData && <Receipt ref={componentRef} printData={printData} printVisible={printVisible}/>}
        <div className="container" >
          <div className="modal">
            <div className="modal-container">
              <div className="modal-left">
                <BackButton onClick={() => navigate("/doctor_use/FindAdmission", { state: { date } })}>
                  <BsArrowLeft /> Go back to Patient List
                </BackButton>
                <h1 className="modal-title">NEW REGISTRATION</h1>
                <br/>
                <form onSubmit={handleSubmit} id="formId">
                  <div className="input-block">
                    <div
                      className="form-row"
                      style={{
                        display: "flex",
                        // flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        className="form-row"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "30%",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Patient Name:
                          </label>
                          <input
                            style={{textTransform: "uppercase", width: "20vw", flex: "1"}}
                            type="name"
                            autoComplete="off"
                            name="Patient Name"
                            id="email"
                            placeholder="Patient Name"
                            defaultValue={testData.PatientName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Patient
                            ID:
                          </label>
                          <input
                            style={{flex: "1"}}
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Patient ID"
                            id="name"
                            placeholder="Patient ID"
                            defaultValue={testData.PatientID? testData.PatientID: vno.toString()}
                            onChange={(e) => setVno(e.target.value.toString())}
                            onBlur={handleBlur}
                            readOnly
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Registration On:
                          </label>
                          <input
                            style={{flex: "1"}}
                            type="date"
                            autoComplete="off"
                            name="Registration On"
                            id="name"
                            placeholder="currentDate.toISOString().split('T')[0]"
                            defaultValue={
                              testData.RegistrationOn
                                ? new Date(testData.RegistrationOn)
                                    .toISOString()
                                    .split("T")[0]
                                : getCurrentDateIST()
                            }
                            onChange={handleChange}
                            onBlur={handleBlur}
                            readOnly
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Center ID:
                          </label>
                          <input
                            style={{flex: "1"}}
                            type="name"
                            autoComplete="off"
                            name="Center ID"
                            id="email"
                            placeholder="Center ID"
                            defaultValue={testData.CenterID}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                      </div>
                      <div
                        className="form-row"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "30%",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Age:
                          </label>
                          <input
                            style={{flex: "1"}}
                            type="text"
                            // pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Age"
                            id="email"
                            placeholder="Age"
                            defaultValue={testData.Age}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                          Contact Details:
                          </label>
                          <input
                            style={{flex: "1"}}
                            pattern="^\d*\.?\d{0,2}$"
                            autoComplete="off"
                            name="Contact Details"
                            id="email"
                            placeholder="Contact Details"
                            defaultValue={testData.ContactDetails}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Collection On:
                          </label>
                          <input
                            style={{flex: "1"}}
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
                        className="form-row"
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          width: "30%",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Sex:
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
                              flex: "1"
                            }}
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Neutral">Neutral</option>
                          </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                          Ref By Dr:
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
                            style={{textTransform: "uppercase", flex: "1"}}
                          />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Reporting On:
                          </label>
                          <input
                            style={{flex: "1"}}
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
                        <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                          <label htmlFor="email" className="input-label" style={{ width: "15vh", textAlign: "left", }}>
                            Center Name:
                          </label>
                          <input
                            type="name"
                            autoComplete="off"
                            name="Center Name"
                            id="email"
                            placeholder="Center Name"
                            defaultValue={testData.CenterName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{textTransform: "uppercase", flex: "1"}}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="testName" style={{ overflowY: "auto" }} >
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
                      className="form-row"
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
                        className="input-button"
                        type="button"
                        onClick={handleClick}
                        style={{
                          padding: "5px",
                          height: "35px",
                        }}
                      >
                        Add test
                      </button>
                      <button
                        className="input-button"
                        type="button"
                        onClick={handleClick2}
                        style={{
                          padding: "5px",
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
                            value={grandAmount}
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
                            // value={advanceAmount}
                            // placeholder="0"
                            defaultValue={testData.AdvanceAmount || 0}
                            onChange={handleChange}
                          />
                        </label>
                        <label htmlFor="Email" className="input-label">
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Discount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Discount"
                            // value={discount}
                            // placeholder="0"
                            defaultValue={testData.Discount || 0}
                            onChange={handleChange}
                          />
                        </label>
                        <label htmlFor="Email" className="input-label">
                          &nbsp;Balance Amount:&nbsp;
                          <input
                            type="text"
                            pattern="^\d*\.?\d{0,2}$"
                            name="Balance Amount"
                            value={balanceAmount}
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
    top: 48px;
    left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "200px" : "70px")};
    right: 0;
    bottom: 0;
    width: ${({ $sidebarExpanded }) =>
      $sidebarExpanded ? "calc(100vw - 200px)" : "calc(100vw - 90px)"};
    background-color: ${({ theme }) => (theme.isDark) ? theme.bg : "#eef2f8"};
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 1rem;
    overflow-y: auto;
    max-height: 95vh;
    transition: left 0.2s ease, width 0.2s ease;
  }

  /* Modal Dialog */
  .modal {
    width: 100%;
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "rgba(34, 57, 87, 0.15)"};
    display: fixed;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
    transition: opacity 0.3s ease;
  }

  .modal .modal-container {
    display: flex;
    max-width: 95vw;
    height: 90vh;
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#fff"};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
  }

  /* Left Section */
  .modal-left {
    background: ${({ theme }) => (theme.isDark) ? theme.card : "#f5faff"};
    flex: 1.5;
    padding: 1.5rem 2rem 1rem 2rem;
    overflow-y: auto;
    font-family: "Nunito", sans-serif;
  }

  .modal-left .modal-title {
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#103d72"};
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  /* Errors */
  .form-error {
    font-size: 1.1rem;
    color: #c53030;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  /* Labels */
  .modal-left label {
    display: block;
    font-weight: 600;
    font-size: 0.8rem;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#124880"};
    margin-bottom: 0.3rem;
    letter-spacing: 0.025em;
  }

  /* Input Fields */
  .input-block {
    margin-bottom: 1rem;
  }

  .input-block input,
  .input-block select {
    width: 100%;
    padding: 0.45rem 0.6rem;
    font-size: 0.85rem;
    border: 1.5px solid #cbd7e6;
    border-radius: 6px;
    background-color: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6fbff"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#1f3c68"};
    outline-offset: 2px;
    transition: border-color 0.2s ease;
    box-sizing: border-box;
  }

  .input-block input::placeholder,
  .input-block select:disabled {
    color:${({ theme }) => (theme.isDark) ? theme.text :  "#a1b5d1"};
  }

  .input-block input:focus,
  .input-block select:focus {
    border-color: #2a6ade;
    background-color: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#e9f0fd"};
    outline: none;
  }

  /* Inline input groups (2-3 inputs side by side) */
  .input-inline-groups {
    display: flex;
    gap: 0.8rem;
  }

  /* Form layout groups */
  .form-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .form-col {
    flex: 1 1 23%;
    min-width: 150px;
  }

  /* Buttons */
  .input-button {
    background: #1a73e8;
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#fff"};
    font-weight: 700;
    padding: 0.6rem 1.25rem;
    margin-top: 1rem;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background-color 0.25s ease;
  }

  .input-button:hover:not(:disabled) {
    background-color: #155ab6;
  }

  .input-button:disabled {
    background-color: ${({ theme }) => (theme.isDark) ? theme.text : "#8faecc"};
    cursor: not-allowed;
  }

  .input-button-small {
    background: ${({ theme }) => (theme.isDark) ? theme.bg : "#ccc9c0"};
    color: ${({ theme }) => (theme.isDark) ? theme.text : "#59534a"};
    border-radius: 6px;
    font-size: 0.75rem;
    padding: 0.35rem 0.8rem;
    margin-left: 0.6rem;
  }

  .input-button-small:hover:not(:disabled) {
    background-color: #bfb8ad;
  }

  /* Scrollable test list */
  .test-list {
    max-height: 26vh;
    overflow-y: auto;
    border: 1.8px solid #c7d0db;
    border-radius: 6px;
    background-color: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
    padding: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 900px) {
    .container {
      left: 10px;
      width: 95%;
    }

    .modal-left {
      padding: 1rem 1rem 0.75rem 1rem;
    }

    .modal .modal-container {
      flex-direction: column;
      height: auto;
      max-height: 94vh;
    }

    .form-row {
      flex-direction: column;
      gap: 0.6rem;
    }

    .form-col {
      flex: 1 1 100%;
      min-width: auto;
    }

    .input-button {
      width: 100%;
      margin-top: 0.5rem;
    }
  }
`;

const BackButton = styled.button`
  background: ${({ theme }) => (theme.isDark) ? "#33a3fd" : "#e5eefe"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#114177"};
  border: none;
  border-radius: 7px;
  font-weight: 600;
  font-size: 1.1rem;
  padding: 8px 18px;
  margin-bottom: 16px;
  cursor: pointer;
  display: flex; align-items: center; gap: 9px;
  box-shadow: 0 1px 7px #b9c9e844;

  &:hover { background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#c7daf5"}; }
`;


export default TestAdmission;
