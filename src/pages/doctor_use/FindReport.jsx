import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useAuth } from "../../Context/AuthContext";
import Invoice from "../../Components/Print/Invoice";
import { FiChevronRight } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";
import { useLocation, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import AppTopNav from "../../Components/TopNavbar";
import { useSidebar } from "../../Context/SidebarContext";

const FindReport = () => {
  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [printVisible, setPrintVisible] = useState(false);
  const [pidValue, setPidValue] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [patientName, setPatientName] = useState([]);
  const [age, setAge] = useState([]);
  const [sex, setSex] = useState([]);
  const [date, setDate] = useState([]);
  const [searchDate, setSearchDate] = useState();
  const [status, setStatus] = useState([]);
  const [centerName, setCenterName] = useState([]);
  const [centerID, setCenterID] = useState([]);
  const [patientID, setPatientID] = useState([]);
  const [name, setName] = useState();
  const [useButton, setUseButton] = useState([]);
  const [error, setError] = useState();
  const { currentUser } = useAuth();
  const receiptRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarExpanded } = useSidebar();
  const { enqueueSnackbar } = useSnackbar("");
  const [chooseYear, setChooseYear] = useState(
    `Year: ${new Date().getFullYear()}`
  );

  const freeSpace = () => {
    setHeaders([]);
    setPatientName([]);
    setDate([]);
    setAge([]);
    setSex([]);
    setStatus([]);
    setCenterName([]);
    setCenterID([]);
    setPatientID([]);
    setUseButton([]);
  };

  const handlePrintReceipt = useReactToPrint({
    content: () => receiptRef.current,
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

  const handleFind = async (e, check) => {
    console.log("e: ", e);
    setUserData([]);
    try {
      const userDocRef = doc(db, currentUser.uid, `${e}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userFetchData = userDocSnapshot.data();
        setUserData(userFetchData);
        if (userData && check) {
          setTimeout(handlePrintReceipt, 100);
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
    try {
      console.log(searchDate);
      if (name && currentUser?.uid && searchDate) {
        const userDocRef = doc(db, currentUser.uid, "Name list");
        const docSnap = await getDoc(userDocRef);


        if (docSnap.exists()) {
          const new_name = name.toUpperCase();
          const useData = docSnap.data()[new_name][searchDate];
          if(useData != undefined){
            setData(useData);
            handleAddMultipleTests(useData, null, null);
          }else{
            enqueueSnackbar("Name not fount", { variant: "info" });
          }
        } else {
          enqueueSnackbar("Name not fount", { variant: "info" });
        }
      } else if(searchDate && !name && currentUser?.uid) {
        await fetchUserData(searchDate);
      } else if(name && !searchDate && currentUser?.uid){
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
            console.log("dont: ", result);
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
    const newDate = [];
    const newStatus = [];
    const newCenterName = [];
    const newCenterID = [];
    const newPatientID = [];
    const newButtons = [];
    for (let i = 0; i < count; i++) {
      const key = keys[i];
      const data2 = val[key];

      newHeaders.push(
        [headers.length + i + 1]
      );
      newPatientName.push(
        [data2?.PatientName]
      );
      newPatientID.push(
        [data2?.PatientID]
      );
      newAge.push(
        [data2?.Age]
      );
      newSex.push(
        [data2?.Sex]
      );
      newStatus.push(
        [data2?.Status]
      );
      newDate.push(
        [data2?.RegistrationOn? `${data2?.RegistrationOn.split("-")[2]} / ${data2?.RegistrationOn.split("-")[1]} / ${" "}
          ${data2?.RegistrationOn.split("-")[0][2]}${data2?.RegistrationOn.split("-")[0][3]}` :
          `${day.split(": ")[1]} / ${month.split(": ")[1]} / ${" "}
          ${chooseYear.split(": ")[1][2]}${chooseYear.split(": ")[1][3]}`]
      );
      newCenterName.push(
        [data2?.CenterName]
      );
      newCenterID.push(
        [data2?.CenterID]
      );
      newButtons.push(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "2px",
            justifyContent: "space-around",
            borderTop: "1px solid #ddd",
            // height: "30px",
          }}
          >
          <button
            className="input-button"
            style={{
              fontSize: "15px",
              padding: "2px",
              height: "25px",
              width: "45%",
              background: "#499c5eff",
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
              background: "#4c77c7ff"
              // borderRadius: "2px",
            }}
            onClick={() => {
              navigate("/doctor_use/TestReport", {
                state: {
                  AdiValue: data2?.PatientID,
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
    setAge((prevAge) => [...prevAge, ...newAge]);
    setSex((prevSex) => [...prevSex, ...newSex]);
    setPatientID((prevPatientID) => [...prevPatientID, ...newPatientID]);
    setDate((prevDate) => [...prevDate, ...newDate]);
    setStatus((prevStatus) => [...prevStatus, ...newStatus]);
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
    <div>
      <div style={{display: "none"}}>
      {printVisible && userData && <Receipt ref={receiptRef} printData={userData} printVisible={printVisible}/>}
      </div>
      <PageWrapper>
        <AppTopNav sidebarExpanded={sidebarExpanded} />
        <Navbar destination={"/"} />
        <Main $sidebarExpanded={sidebarExpanded}>
          <StickyBar>
            <BreadCrumb>
              <span className="muted">Patient Entry</span>
              <FiChevronRight />
              <span className="active">Find Report</span>
            </BreadCrumb>
          </StickyBar>
          <Card>
            <h1 className="page-title">Search lab reports</h1>
            <FiltersGrid>
              <div className="filter-cell">
                <label>Duration</label>
                <input
                  type="date"
                  className="mini-input"
                  value={searchDate || ""}
                  onChange={e => setSearchDate(e.target.value)}
                />
              </div>
              <div className="filter-cell">
                <label>Patient first name</label>
                <input
                  className="mini-input"
                  value={name || ""}
                  onChange={e => setName(e.target.value)}
                  placeholder="Type name"
                />
              </div>
              <div className="filter-cell">
                <label>Status</label>
                <select className="mini-input">
                  <option value="">Any</option>
                  <option>Signed off</option>
                  <option>Pending</option>
                </select>
              </div>
              <div className="filter-cell">
                <label>Reg. no.</label>
                <input
                  className="mini-input"
                  value={pidValue || ""}
                  onChange={e => setPidValue(e.target.value)}
                  placeholder="Reg. no."
                />
              </div>
              <div className="filter-cell filter-btncell">
                <button
                  className="search-btn"
                  onClick={() => {
                    if (pidValue){
                      navigate("/doctor_use/TestAdmission", { state: { PidValue: pidValue } });
                    }else{
                      setName(name);
                      searchBy();
                    }
                  }}
                >Search</button>
                <button className="clear-btn" onClick={freeSpace}>Clear</button>
              </div>
            </FiltersGrid>
          </Card>
          {/* --- Data Table Panel --- */}
          <Card className="table-panel">
            <ScrollTable>
              <thead>
                <tr>
                  <th>REG. NO.</th>
                  <th>DATE/TIME</th>
                  <th>PATIENT</th>
                  <th>REFERRED BY</th>
                  <th>TOTAL AMOUNT</th>
                  <th>CC</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {headers.map((header, idx) => (
                  <tr key={idx}>
                    <td>{patientID[idx]}</td>
                    <td>{date[idx]}</td>
                    <td>{patientName[idx]}</td>
                    <td>{centerID[idx]}</td>
                    <td>{sex[idx]}</td>
                    <td>{centerName[idx]}</td>
                    <td>
                      {useButton[idx]}
                    </td>
                    {/* <td>
                      <span className={`status-chip ${paid[idx] ? "signed" : "pending"}`}>
                        {paid[idx] ? "Signed off" : "Pending"}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </ScrollTable>
          </Card>
        </Main>
        {/* {userData && <Receipt ref={invoiceRef} printData={userData} />} */}
      </PageWrapper>
      </div>
    );
  };
    
    // --- STYLING ---
    
    const PageWrapper = styled.div`
      min-height: 100vh;
      background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f7fafd"};
      display: flex;
      .navbar {
        flex-shrink: 0;
      }
    `;
    
    const Main = styled.main`
      flex: 1;
      min-width: 0;
      padding: 78px 36px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "225px" : "76px")};
      transition: padding-left 0.18s cubic-bezier(.61,-0.01,.51,.99);
  
      @media (max-width: 1100px) {
        padding-left: ${({ $sidebarExpanded }) => ($sidebarExpanded ? "80px" : "41px")};
      }
  
      @media (max-width: 700px) {
        padding-left: 2vw;
      }
  
  `;

  const StickyBar = styled.div`
  position: sticky;
  top: 58px;
  z-index: 50;
  // background: ${({ theme }) => theme.bg};
  padding: 8px 2px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BreadCrumb = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  font-size: 0.92em;

  .muted {
    color: ${({ theme }) => theme.textSoft};
    font-weight: 500;
  }

  .active {
    color: ${({ theme }) => theme.text};
    font-weight: 800;
  }

  svg {
    color: ${({ theme }) => theme.textSoft};
    font-size: 1.1em;
  }
`;
  
  const FiltersGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, 1fr) 110px;
    row-gap: 14px;
    column-gap: 18px;
    margin-bottom: 7px;
    .filter-cell {
      display: flex;
      flex-direction: column;
      label {
        font-size: 0.93em;
        color: ${({ theme }) => (theme.isDark) ? theme.text : "#5175ac"};
        font-weight: 600;
        margin-bottom: 3px;
        padding-left: 1px;
      }
      .mini-input {
        height: 33px;
        border: 1px solid #d7e2f8;
        border-radius: 6px;
        padding: 2px 9px;
        font-size: 0.97em;
        background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fafcff"};
        color: ${({ theme }) => (theme.isDark) ? theme.text : "#171d19"};
        transition: border-color 0.13s;
        &:focus { border: 1.5px solid #3793f4; outline: none; }
      }
      select {
        min-width: 70px;
      }
      &.filter-btncell {
        flex-direction: row;
        align-items: end;
        gap: 8px;
        padding-top: 19px;
      }
    }
    .search-btn {
      background: ${({ theme }) => (theme.isDark) ? "#33a3fd" : "#037aff"};
      color: ${({ theme }) => (theme.isDark) ? theme.text : "#fff"};
      border: none;
      border-radius: 6.5px;
      padding: 0 12px;
      height: 33px;
      font-size: 0.97em;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.16s;
      &:hover { background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#035fc7"}; }
      margin-right: 7px;
    }
    .clear-btn {
      background: ${({ theme }) => (theme.isDark) ? "#33a3fd" : "#037aff"};
      border: none;
      color: ${({ theme }) => (theme.isDark) ? theme.text : "#0d63b7"};
      font-weight: 600;
      padding: 0 12px;
      height: 33px;
      font-size: 0.96em;
      cursor: pointer;
      margin-left: 0px;
      &:hover { background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#035fc7"}; }
      &::after { content: ""; }
    }
    @media (max-width: 1100px) { grid-template-columns: repeat(2, 1fr); }
    @media (max-width: 700px)   { grid-template-columns: 1fr; }
  `;
  
  const Card = styled.section`
    background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
    border-radius: 11px;
    box-shadow: 0 2px 18px #e0e7f1cc;
    margin-bottom: 28px;
    padding: 25px 19px 11px 22px;
    overflow-x: auto;      /* ENABLE horizontal scroll */
    -webkit-overflow-scrolling: touch;
  
    .page-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: ${({ theme }) => (theme.isDark) ? theme.text : "#203669"};
      margin-bottom: 18px;
      letter-spacing: 0.01em;
    }
  
    &.table-panel {
      margin-top: 0;
      padding: 24px 19px 16px 19px;
    }
  `;
  
  const ScrollTable = styled.table`
    width: 100%;
    border-spacing: 0;
    border-collapse: separate;
    min-width: 800px;  /* Minimum width to force scroll on smaller screens */
  
    thead tr {
      background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f3f7fa"};
    }
  
    thead th {
      color: ${({ theme }) => (theme.isDark) ? theme.text : "#36598b"};
      font-weight: 700;
      font-size: 0.98em;
      border-bottom: 1.5px solid #d6e0f7;
      padding: 10px 12px;
      white-space: nowrap;
    }
  
    tbody {
      tr {
        background: ${({ theme }) => (theme.isDark) ? theme.bg : "#fff"};
        box-shadow: 0 1px 12px #e0e7f1cc;
        transition: box-shadow 0.12s;
      }
  
      tr:hover {
        background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f5faff"};
      }
  
      td {
        font-size: 0.95em;
        padding: 8px 10px;
        border-bottom: 1px solid #e1e7f3;
        white-space: nowrap;
        line-height: 1.3;
        vertical-align: middle;
        color: ${({ theme }) => (theme.isDark) ? theme.text : "#28314d"};
        letter-spacing: 0.01em;
        min-width: 90px; /* Ensure column min width */
      }
  
      .table-actions {
        white-space: nowrap;
      }
  
      .status-chip {
        border-radius: 12px;
        padding: 4px 14px;
        font-weight: 600;
        font-size: 0.9em;
        &.signed {
          background: #d5f7e6;
          color: #1a9a5a;
        }
        &.pending {
          background: #fff4dc;
          color: #a87811;
        }
      }
    }
  
    @media (max-width: 900px) {
      min-width: 600px;
    }
  
    @media (max-width: 600px) {
      min-width: 500px;
    }
  
    @media print {
      min-width: auto;
      width: 100%;
    }
  `;
export default FindReport;
