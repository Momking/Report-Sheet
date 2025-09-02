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
import AppTopNav from "../../Components/TopNavbar";
import { useSidebar } from "../../Context/SidebarContext";

const TestReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { AdiValue, date } = location.state || {};
  const [testData, setTestData] = useState({ tests: [] });
  const { sidebarExpanded } = useSidebar();
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
            borderTop: "1px solid #ddd",
            color: "black",
            background: "#fff",
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
            borderTop: "1px solid #ddd",
            color: "black",
            background: "#fff",
            height: "29px",
          }}
        >
          <button
            className="input-button"
            type="button"
            style={{
              fontSize: "15px",
              padding: "2px 20px 0px",
              borderRadius: "3px",
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
              fontSize: "15px",
              padding: "2px 20px 0px",
              borderRadius: "3px",
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
  // Top-level wrapper for background, nav, etc.
  return (
    <LabReportWrapper>
      <AppTopNav sidebarExpanded={sidebarExpanded} />
      <Navbar destination="/" />
      <TopInfoBar>
        <span className="info-icon">!</span>
        <span>Your trial ends in 5 days. Even if you purchase early, duration of trial period is included for free.</span>
      </TopInfoBar>
      <ContentGrid>
        <MainContent>
          <BackBtn onClick={() => navigate("/doctor_use/FindReport", { state: { date } })}>
            <BsArrowLeft /> Back to Patient List
          </BackBtn>
          <HeadingRow>
            <h1 className="lab-title">Lab report</h1>
            <StatusChip signedOff={testData.Status === "Signed off"}>
              {testData.Status}
            </StatusChip>
          </HeadingRow>
          <InfoRow>
            <RegChip>Reg no. {testData.PatientID}</RegChip>
            <RegChip>L1</RegChip>
          </InfoRow>
          <MainCard>
            <InfoTable>
              <tbody>
                <tr>
                  <td><b>Patient Name:</b></td>
                  <td>{testData.PatientName}</td>
                  <td><b>Registered on:</b></td>
                  <td>{testData.RegistrationOn}</td>
                </tr>
                <tr>
                  <td><b>Age / Sex:</b></td>
                  <td>{testData.Age} / {testData.Sex}</td>
                  <td><b>Collected on:</b></td>
                  <td>{testData.CollectionOn}</td>
                </tr>
                <tr>
                  <td><b>Referred By:</b></td>
                  <td>{testData.RefByDr}</td>
                  <td><b>Reported on:</b></td>
                  <td>{testData.ReportingOn}</td>
                </tr>
                <tr>
                  <td><b>Reg. no.:</b></td>
                  <td>{testData.PatientID}</td>
                  <td><b>Center name:</b></td>
                  <td>{testData.CenterName}</td>
                </tr>
              </tbody>
            </InfoTable>
          </MainCard>
          {/* Example: You may display test results below like this */}
          <SectionTitle>HAEMATOLOGY - COMPLETE BLOOD COUNT (CBC)</SectionTitle>
          <TestTable>
            <thead>
              <tr>
                <th style={{ width: "34%" }}>Test</th>
                <th style={{ width: "18%" }}>Value</th>
                <th style={{ width: "18%" }}>Unit</th>
                <th style={{ width: "30%" }}>Reference</th>
              </tr>
            </thead>
            <tbody>
              {(testData.tests || []).map((t, idx) => (
                <tr key={idx}>
                  <td><b>{t.TestName}</b></td>
                  <td style={{ color: '#1748a5', fontWeight: 700 }}>{t.Value}</td>
                  <td>{t.Unit}</td>
                  <td>{t.ReferenceRange}</td>
                </tr>
              ))}
            </tbody>
          </TestTable>
          <ActionRow>
            <BlueBtn>Sign off</BlueBtn>
            <BlueBtn>Final</BlueBtn>
            <BlueBtn outline>Save only</BlueBtn>
          </ActionRow>
        </MainContent>
        <SidebarBox>
          <SidebarSection>
            <SidebarHeading>Sidebar</SidebarHeading>
            <SidebarMenu>
              <SidebarMenuItem active><span>Patient info</span> <EditIcon /></SidebarMenuItem>
              <SidebarMenuItem><span>Doctor info</span> <EditIcon /></SidebarMenuItem>
              <SidebarMenuItem><span>Patient history</span> <EditIcon /></SidebarMenuItem>
              <SidebarMenuItem><span>Recent lab reports</span></SidebarMenuItem>
              <SidebarMenuItem><span>Report activities</span></SidebarMenuItem>
            </SidebarMenu>
          </SidebarSection>
        </SidebarBox>
      </ContentGrid>
    </LabReportWrapper>
  );
}
  
const LabReportWrapper = styled.div`
  min-height: 100vh;
  background: #f7fafd;
`;

const TopInfoBar = styled.div`
  background: #ebf3fc;
  color: #134285;
  padding: 9px 28px;
  font-size: 0.98rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  letter-spacing: 0.01em;
  .info-icon {
    background: #358af3;
    border-radius: 50%;
    color: #fff;
    width: 24px; height: 24px; display: inline-flex;
    align-items: center; justify-content: center;
    margin-right: 12px;
    font-weight: 700;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1.7fr 0.9fr;
  gap: 32px;
  max-width: 1280px;
  margin: 28px auto 0 auto;
  padding: 0 18px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 0;
  }
`;

const MainContent = styled.div`
  min-width: 0;
`;

const BackBtn = styled.button`
  background: #e5eefe;
  color: #114177;
  border: none;
  font-weight: 600;
  font-size: 1.02em;
  border-radius: 7px;
  padding: 8px 17px;
  margin-bottom: 14px;
  cursor: pointer;
  box-shadow: 0 1px 7px #b9c9e844;
  display: flex; align-items: center; gap: 9px;
`;

const HeadingRow = styled.div`
  display: flex; align-items: center; gap: 24px; margin-bottom: 5px;
  .lab-title {
    font-weight: 700;
    font-size: 1.5rem;
    color: #104170;
  }
`;

const StatusChip = styled.span`
  background: ${({ signedOff }) => signedOff ? "#e4f5e9" : "#fdf5db"};
  color: ${({ signedOff }) => signedOff ? "#2b954d" : "#e6a02c"};
  border-radius: 10px;
  padding: 3.5px 20px;
  font-weight: 700;
  font-size: 0.98em;
  border: 1.5px solid ${({ signedOff }) => signedOff ? "#6ed997" : "#f1d28e"};
`;

const InfoRow = styled.div`
  display: flex; align-items: center; gap: 12px; margin-bottom: 4px;
`;

const RegChip = styled.span`
  background: #e2e6f9;
  color: #144098;
  font-size: 0.93em;
  font-weight: 600;
  border-radius: 7px;
  padding: 3.5px 13px;
  margin-right: 6px;
  display: inline-block;
`;

const MainCard = styled.section`
  background: #fff;
  border-radius: 11px;
  box-shadow: 0 2px 18px #e0e7f1bb;
  margin-bottom: 24px;
  padding: 19px 20px 15px 20px;
  font-size: 1em;
`;

const InfoTable = styled.table`
  width: 100%;
  font-size: 0.92em;
  td { padding: 6px 12px; }
  b { font-weight: 900; color: #385685; }
  border-collapse: separate;
`;

const SectionTitle = styled.h2`
  color: #1c2884;
  font-weight: 700;
  letter-spacing: 0.04em;
  font-size: 1.13em;
  margin: 27px 0 16px 0;
`;

const TestTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  thead th {
    color: #335596;
    background: #f3f7fa;
    font-size: 0.96em;
    font-weight: 700;
    border-bottom: 2px solid #e1e7f4;
    padding: 10px 8px;
  }
  tbody td {
    padding: 9px 8px;
    border-bottom: 1px solid #e1e7f4;
    font-size: 1.04em;
    color: #2b3d4d;
  }
  tbody td + td {
    font-family: "Nunito Mono", "Fira Mono", monospace;
    font-size: 1.06em;
  }
`;

const ActionRow = styled.div`
  display: flex; gap: 14px; margin: 26px 0 0 0;
`;

const BlueBtn = styled.button`
  background: ${({ outline }) => outline ? "#fff" : "#2575f6"};
  color: ${({ outline }) => outline ? "#2575f6" : "#fff"};
  border: 1.6px solid #2575f6;
  border-radius: 8px;
  padding: 10px 24px;
  font-weight: 700;
  font-size: 1em;
  box-shadow: 0 1.5px 8px #cbe7ff44;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  &:hover {
    background: ${({ outline }) => outline ? "#ebf2ff" : "#1762c2"};
    color: ${({ outline }) => outline ? "#144088" : "#fff"};
  }
`;

const SidebarBox = styled.aside`
  background: #f7fafe;
  border-radius: 14px;
  box-shadow: 0 2px 18px #e0e7f133;
  min-width: 230px;
  padding: 22px 12px 13px 16px;
  align-self: start;
  margin-top: 4px;
  @media (max-width: 900px) {
    margin-top: 30px;
    min-width: 0;
  }
`;

const SidebarSection = styled.section``;
const SidebarHeading = styled.h3`
  color: #2e437a;
  font-size: 1.08em;
  font-weight: 800;
  margin-bottom: 7px;
`;
const SidebarMenu = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;
const SidebarMenuItem = styled.li`
  color: ${({ active }) => active ? "#337bdb" : "#355384"};
  font-weight: ${({ active }) => active ? 700 : 500};
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 5px;
  border-radius: 7px;
  font-size: 1em;
  margin-bottom: 3px;
  background: ${({ active }) => active ? "#e7f2ff" : "transparent"};
  cursor: pointer;

  &:hover {
    background: #e5f0fc;
    color: #185ebc;
  }
`;

const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="#A9ACBC"><path d="M3.2 12.8l9.2-9.2-1.2-1.2-9.2 9.2V14h1.2zM14.0 3.2c.4-.4.4-1 0-1.4l-.8-.8a1 1 0 0 0-1.4 0l-1.0 1.0 2.2 2.2 1-1z"/></svg>
);


export default TestReport;
