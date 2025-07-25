import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../Context/AuthContext";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom";
import Receipt from "../../Components/Print/Receipt";

const FindAdmission = () => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [pidValue, setPidValue] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [age, setAge] = useState([]);
  const [sex, setSex] = useState([]);
  const [t_amount, setT_amount] = useState([]);
  const [paid, setPaid] = useState([]);
  const [dues, setDues] = useState([]);
  const [rebate, setRebate] = useState([]);
  const [centerName, setCenterName] = useState([]);
  const [centerID, setCenterID] = useState([]);
  const [patientID, setPatientID] = useState([]);
  const [name, setName] = useState();
  const [date, setDate] = useState();
  const [useButton, setUseButton] = useState([]);
  const [error, setError] = useState();
  const { currentUser } = useAuth();
  const invoiceRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar("");
  const [chooseYear, setChooseYear] = useState(
    `Year: ${new Date().getFullYear()}`
  );

  const freeSpace = () => {
    setHeaders([]);
    setPatientName([]);
    setAge([]);
    setSex([]);
    setT_amount([]);
    setPaid([]);
    setDues([]);
    setRebate([]);
    setCenterName([]);
    setCenterID([]);
    setPatientID([]);
    setUseButton([]);
    setName();
    setDate();
  };

  const handlePrintInvoice = useReactToPrint({
    content: () => invoiceRef.current,
  });

  const handleFind = async (e, check) => {
    setUserData([]);
    try {
      const userDocRef = doc(db, currentUser.uid, `${e}`);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        setUserData(userFetchData);
        if (userData && check) {
          setTimeout(handlePrintInvoice, 100);
        }
        return userFetchData;
      } else {
        setError(true);
      }
    } catch (error) {
      setError(true);
      console.error("Error fetching data from Firestore: ", error);
    }
  };

  const searchBy = async () => {
    console.log(date);
    try {
      if (name && currentUser?.uid && date) {
        console.log("name and date only");
        const userDocRef = doc(db, currentUser.uid, "Name list");
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const new_name = name.toUpperCase();
          const useData = docSnap.data()[new_name][date];
          if(useData != undefined){
            setData(useData);
            handleAddMultipleTests(useData, null, null);
          }else{
            enqueueSnackbar("Name not fount", { variant: "info" });
          }
        } else {
          enqueueSnackbar("Name not fount", { variant: "info" });
        }
      } else if(date && !name && currentUser?.uid) {
        console.log("date only");
        await fetchUserData(date);
      } else if(name && !date && currentUser?.uid){
        console.log("name only");
        const userDocRef = doc(db, currentUser.uid, "Name list");
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const new_name = name.toUpperCase();
          const dates = docSnap.data()[new_name];
          const result = {};
          for (const date in dates) {
            const vnos = dates[date];
      
            for (const vno in vnos) {
              result[vno] = vnos[vno];
            }
          }
          if(result != undefined){
            setData(result);
            handleAddMultipleTests(result, null, null);
          }else{
            enqueueSnackbar("Name with required date not fount", { variant: "info" });
          }
        } else {
          enqueueSnackbar("Name with required date not fount", { variant: "info" });
        }
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
      setError("Error fetching data.");
    }
  };

  const handleAddMultipleTests = (val, month1, day1) => {
    freeSpace();
    let month = "", day = "";
    if(!name){
      month = `Month: ${month1}`;
      day = `Date: ${day1}`;
      val = val[month][day];
    }
    const count = Object.keys(val).length;
    const keys = Object.keys(val);
    
    const newHeaders = [];
    const newPatientName = [];
    const newAge = [];
    const newSex = [];
    const newT_amount = [];
    const newPaid = [];
    const newDues = [];
    const newRebate = [];
    const newCenterName = [];
    const newCenterID = [];
    const newPatientID = [];
    const newButtons = [];
    
    for (let i = 0; i < count; i++) {
      const key = keys[i];
      const data2 = val[key];
      newHeaders.push(
        <h1
          key={headers.length + i}
          style={{
            color: "black",
            fontSize: "12px",
            borderTop: "1px solid #ddd",
            height: "30px",
          }}
        >
          {headers.length + i + 1}
        </h1>
      );

      newPatientName.push(
        <p
          style={{
            fontSize: "17px",
            padding: "2px",
            borderRadius: "1px",
            height: "30px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.PatientName}
        </p>
      );

      newPatientID.push(
        <p
          style={{
            fontSize: "17px",
            padding: "2px",
            borderRadius: "1px",
            height: "30px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.PatientID}
        </p>
      );

      newAge.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.Age}
        </p>
      );
      newSex.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.Sex}
        </p>
      );
      newT_amount.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.GrandAmount}
        </p>
      );
      newPaid.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.AdvanceAmount}
        </p>
      );
      newDues.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.BalanceAmount}
        </p>
      );
      newRebate.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.Discount}
        </p>
      );
      newCenterName.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.CenterName}
        </p>
      );
      newCenterID.push(
        <p
          style={{
            fontSize: "17px",
            padding: "1px",
            height: "30px",
            borderRadius: "1px",
            borderTop: "1px solid #ddd",
            color: "black",
          }}
        >
          {data2?.CenterID}
        </p>
      );
      newButtons.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "2px",
            justifyContent: "space-between",
            borderTop: "1px solid #ddd",
            height: "30px",
          }}
        >
          <button
            className="input-button"
            style={{
              fontSize: "15px",
              padding: "2px",
              height: "25px",
              width: "45%",
              // borderRadius: "2px",
            }}
            onClick={() => {
              handleFind(data2?.PatientID, true);
            }}
            name={`button1${headers.length + i}`}
            id="name"
          >
            Print
          </button>
          <button
            className="input-button"
            style={{
              fontSize: "15px",
              padding: "2px",
              height: "25px",
              width: "45%",
              // borderRadius: "2px",
            }}
            onClick={() => {
              console.log("ask: ",data2),
              navigate("/doctor_use/TestAdmission", {
                state: {
                  PidValue: data2?.PatientID,
                  date: `${chooseYear.split(" ")[1]}-${month1}-${day1}`,
                },
              });
            }}
            name={`button2${headers.length + i}`}
            id="name"
          >
            Update
          </button>
        </div>
      );
    }

    setHeaders((prevHeaders) => [...prevHeaders, ...newHeaders]);
    setPatientName((prevPatientName) => [
      ...prevPatientName,
      ...newPatientName,
    ]);
    setPatientID((prevPatientID) => [...prevPatientID, ...newPatientID]);
    setAge((prevAge) => [...prevAge, ...newAge]);
    setSex((prevSex) => [...prevSex, ...newSex]);
    setT_amount((prevT_amount) => [...prevT_amount, ...newT_amount]);
    setPaid((prePaid) => [...prePaid, ...newPaid]);
    setDues((prevDues) => [...prevDues, ...newDues]);
    setRebate((prevRebate) => [...prevRebate, ...newRebate]);
    setCenterName((prevCenterName) => [...prevCenterName, ...newCenterName]);
    setCenterID((prevCenterID) => [...prevCenterID, ...newCenterID]);
    setUseButton((prevButton) => [...prevButton, ...newButtons]);
  };

  const fetchUserData = async (initialDate) => {
    try {
      if (chooseYear && currentUser?.uid) {
        const userDocRef = doc(db, currentUser.uid, chooseYear);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          const useData = docSnap.data();
          setData(useData);
          const [year, month, day] = initialDate.split("-");
          handleAddMultipleTests(useData, month, day);
        } else {
          setError("No data found for the selected year.");
        }
      }
    } catch (error) {
      console.error("Error fetching data from Firestore: ", error);
      setError("Error fetching data.");
    }
  };

  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    const date = now.toLocaleDateString("en-CA", options); // 'en-CA' locale formats date as YYYY-MM-DD
    return date;
  };

  useEffect(() => {
    const initialDate = location.state?.date || getCurrentDateIST();
    fetchUserData(initialDate);
  }, [chooseYear, location.state]);

  return (
    <div style={{ backgroundColor: "#efedee", width: "100%", height: "100vh" }}>
      {userData && <Receipt ref={invoiceRef} printData={userData} />}
      <Navbar destination={"/"} />
      <Wrapper>
        <div className="container">
          <div className="modal">
            <div className="modal-container">
              <div className="modal-left">
                <button
                  className="input-button"
                  style={{
                    display: "flex",
                    justifyContent: "space-evenly",
                  }}
                  onClick={() => {
                    navigate("/doctor_use/TestAdmission");
                  }}
                >
                  <h4>New Registration</h4>
                </button>
                <h1 className="modal-title">Admission</h1>
                <br/>
                <div
                  className="input-block"
                  style={{
                    color: "#052d28",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "row", color: "#052d28" }}>
                    <h4 className="search-list">Patient Name: &nbsp;</h4>
                    <input
                      style={{
                        fontSize: "17px",
                        padding: "2px",
                        border: "2px solid #ddd",
                        backgroundColor: "#ffffff",
                        color: "black",
                      }}
                      type="text"
                      autoComplete="off"
                      name="Date"
                      id="name"
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <h4 className="search-list">Patient ID: &nbsp;</h4>
                    <input
                      style={{
                        fontSize: "17px",
                        padding: "2px",
                        border: "2px solid #ddd",
                        backgroundColor: "#ffffff",
                        color: "black",
                      }}
                      type="text"
                      autoComplete="off"
                      name="Date"
                      id="name"
                      onChange={(e) => {
                        setPidValue(e.target.value);
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <h4 className="search-list">Date: &nbsp;</h4>
                    <input
                      style={{
                        backgroundColor: "#ffffff",
                        color: "black",
                        border: "2px solid #ddd",
                      }}
                      type="date"
                      autoComplete="off"
                      name="Date"
                      id="name"
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      defaultValue={location.state?.date || getCurrentDateIST()}
                    />
                  </div>
                  <button
                    className="input-button"
                    onClick={() => {
                      if (pidValue){
                        console.log("pid");
                        navigate("/doctor_use/TestAdmission", {
                          state: {
                            PidValue: pidValue,
                          },
                        });
                      }else{
                        console.log("searchby");
                        setName(name);
                        searchBy();
                      }
                    }}
                  >
                    Search
                  </button>
                </div>
                <div
                  style={{
                    border: "3px solid #ddd",
                    borderRadius: "4px",
                    overflowY: "auto",
                    MaxHeight: "50vh",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        width: "10%",
                        display: "flex",
                        flexDirection: "column",
                        borderTop: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Sr no.&nbsp;
                      </label>
                      {headers}
                    </div>
                    <div style={{width: "1px", backgroundColor: "#ddd", height: "19.4vh", MaxHeight: "70vh"}}></div>
                    <div
                      style={{
                        width: "35%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        PATIENT NAME
                      </label>
                      {patientName}
                    </div>
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        PATIENT ID
                      </label>
                      {patientID}
                    </div>
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Age&nbsp;
                      </label>
                      {age}
                    </div>
                    {/* <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Sex&nbsp;
                      </label>
                      {sex}
                    </div> */}
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        T_Amount&nbsp;
                      </label>
                      {t_amount}
                    </div>
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Paid&nbsp;
                      </label>
                      {paid}
                    </div>
                    {/* <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Dues&nbsp;
                      </label>
                      {dues}
                    </div> */}
                    {/* <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Rebate&nbsp;
                      </label>
                      {rebate}
                    </div> */}
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Ref Dr.&nbsp;
                      </label>
                      {centerName}
                    </div>
                    <div
                      style={{
                        width: "15%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        C. ID&nbsp;
                      </label>
                      {centerID}
                    </div>
                    <div
                      style={{
                        width: "21%",
                        display: "flex",
                        flexDirection: "column",
                        border: "1px solid #ddd",
                      }}
                    >
                      <label htmlFor="email" className="input-label">
                        Buttons&nbsp;
                      </label>
                      {useButton}
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

export default FindAdmission;
