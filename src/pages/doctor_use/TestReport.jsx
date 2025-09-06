import React, { useRef, useState, useEffect } from "react";
import Navbar from "../../Components/Navbar";
import styled from "styled-components";
import { useSnackbar } from "notistack";
import { storeUserData } from "../../Components/storeUserData";
import { useAuth } from "../../Context/AuthContext";
import { db } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import Invoice from "../../Components/Print/Invoice";
import Receipt from "../../Components/Print/Receipt";
import { useReactToPrint } from "react-to-print";
import PendingReport from "../../Components/PendingReport";
import CommentBox from "../../Components/CommentBox";
import { useLocation, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import AppTopNav from "../../Components/TopNavbar";
import { useSidebar } from "../../Context/SidebarContext";
import Barcode from "react-barcode";
import InlineTestCard from "../../Components/InlineTestCard";

const TestReport = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { AdiValue, date } = location.state || {};
  const { currentUser } = useAuth();
  const { sidebarExpanded } = useSidebar();
  const { enqueueSnackbar } = useSnackbar();

  const invoiceRef = useRef(null);
  const receiptRef = useRef(null);

  // State variables
  const [attachedCardData, setAttachedCardData] = useState(null);
  const attachedCardRef = useRef(null);
  const handleAttachTable = (testData) => setAttachedCardData(testData);
  const [testData, setTestData] = useState({ tests: [] });
  const [headers, setHeaders] = useState([]);
  const [test, setTest] = useState([]);
  const [buttons, setButtons] = useState([]);
  const [adi, setAdi] = useState("");
  const [cards, setCards] = useState(null);
  const [comment, setComment] = useState(null);
  const [error, setError] = useState(false);
  const [printData, setPrintData] = useState([]);
  const [saveAndPrint, setSaveAndPrint] = useState(false);
  const [saveAndPrint2, setSaveAndPrint2] = useState(false);

  useEffect(() => {
    // Scroll to attached card when it appears
    if (attachedCardData && attachedCardRef.current) {
      attachedCardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [attachedCardData]);

  // Add multiple tests UI components
  const handleAddMultipleTests = (count) => {
    const newHeaders = [];
    const newTests = [];

    for (let i = 0; i < count; i++) {
      newHeaders.push(
        <HeaderCell key={`header-${headers.length + i}`}>
          {headers.length + i + 1}
        </HeaderCell>
      );
      newTests.push(
        <TestInput
          key={`test-${test.length + i}`}
          type="text"
          name={`TestName${test.length + i}`}
          placeholder="Test name"
          defaultValue={testData.tests[test.length + i]?.TestName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          readOnly
          autoComplete="off"
        />
      );
    }

    setHeaders((prev) => [...prev, ...newHeaders]);
    setTest((prev) => [...prev, ...newTests]);
  };

  const handleAdmissionIDSelect = (AdmissionID) => {
    setAdi(AdmissionID);
    handleFind(AdmissionID);
  };

  // Handle fetching admission data based on AdmissionID or adi
  const handleFind = async (e) => {
    try {
      let userDocRef = null;
      console.log(adi, " this: ", e);
      if (e?.length !== undefined) {
        userDocRef = doc(db, currentUser.uid, `RD${e}`);
      } else {
        userDocRef = doc(db, currentUser.uid, `RD${adi}`);
      }

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        handleNew2();
        const data = userDocSnapshot.data();
        console.log("data: ", data.tests[0].TestName.TestName);
        setTestData(data);
      } else {
        // Try alternate document location
        let userDocInitial = null;

        if (e?.length !== undefined) {
          userDocInitial = doc(db, currentUser.uid, e);
        } else {
          userDocInitial = doc(db, currentUser.uid, adi);
        }

        const userDocInitialSnapshot = await getDoc(userDocInitial);

        if (userDocInitialSnapshot.exists()) {
          handleNew2();
          const data = userDocInitialSnapshot.data();
          setTestData(data);
        } else {
          setError(true);
          enqueueSnackbar("Admission ID doesn't exist", { variant: "info" });
        }
      }
    } catch (err) {
      setError(true);
      console.error("Error fetching data:", err);
      enqueueSnackbar("Something went wrong", { variant: "info" });
    }
  };

  // Sync new tests upon testData update
  useEffect(() => {
    if (testData.tests) {
      handleAddMultipleTests(testData.tests.length);
    }
  }, [testData]);

  // Initial fetch on mount if AdiValue is provided from location state
  useEffect(() => {
    if (AdiValue) {
      handleFind(AdiValue);
    }
  }, [AdiValue]);

  // Print handlers
  const handlePrintInvoice = useReactToPrint({ content: () => invoiceRef.current });
  const handlePrintReceipt = useReactToPrint({ content: () => receiptRef.current });

  // Reset form and state
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
    document.getElementById("formId")?.reset();
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
    document.getElementById("formId")?.reset();
  };

  // Submit handler to save and optionally print
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const admissionID = testData.PatientID;
    setAdi(admissionID);

    if (!admissionID) {
      enqueueSnackbar("Admission ID is empty", { variant: "info" });
      return;
    }

    const exportData = {
      PatientName: testData.PatientName,
      PatientID: testData.PatientID,
      RegistrationOn: testData.RegistrationOn,
      Age: testData.Age,
      ContactDetails: testData.ContactDetails,
      CollectionOn: testData.CollectionOn,
      Sex: testData.Sex,
      RefByDr: testData.RefByDr,
      ReportingOn: testData.ReportingOn,
      CenterID: testData.CenterID,
      CenterName: testData.CenterName,
      tests: test.map((_, idx) => ({
        TestName: testData.tests[0].TestName.TestName,
        normalValue: testData.tests[0].TestName.normalValue,
        findings: testData.tests[0].TestName.findings,
      })),
    };

    try {
      await storeUserData(`RD${admissionID}`, exportData, currentUser);
      setPrintData(exportData);

      if (saveAndPrint2 && !saveAndPrint) {
        setTimeout(handlePrintReceipt, 100);
        setTimeout(handleNew, 1000);
      } else if (saveAndPrint && !saveAndPrint2) {
        setTimeout(handlePrintInvoice, 100);
        setTimeout(handleNew, 1000);
      } else {
        handleNew();
      }

      enqueueSnackbar("Your Report saved", { variant: "info" });
    } catch (err) {
      enqueueSnackbar("Failed to save, try again", { variant: "error" });
      console.error(err);
    }
  };

  // Utility for current date in IST for default date input
  const getCurrentDateIST = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Kolkata" };
    console.log(now.toLocaleDateString("en-CA", options));
    return now.toLocaleDateString("en-CA", options);
  };

  // Empty handlers (implement details as needed)
  const handleBlur = () => {};
  const handleChange = () => {};

  return (
    <PageContainer>
      <AppTopNav sidebarExpanded={sidebarExpanded} />
      <Navbar destination="/" />
      {comment && (
        <CommentBox testData={comment} onClose={() => setComment(null)} />
      )}
  
      <MainContainer $sidebarExpanded={sidebarExpanded}>
        <BackButton onClick={() => navigate("/doctor_use/FindReport", { state: { date } })}>
          <BsArrowLeft /> Go back to Patient List
        </BackButton>
  
        <Title>TEST REPORT</Title>
  
        {/* Patient summary - not a form! */}
        <PatientInfoBox>
          <InfoRow>
            <LeftGroup>
              <InfoCell><b>Patient Name:</b></InfoCell>
              <InfoVal>{testData.PatientName}</InfoVal>
            </LeftGroup>
            <RightGroup>
              <InfoCell><b>Registered on:</b></InfoCell>
              <InfoVal>{testData.RegistrationOn}</InfoVal>
            </RightGroup>
          </InfoRow>
          <InfoRow>
            <LeftGroup>
              <InfoCell><b>Age / Sex:</b></InfoCell>
              <InfoVal>{testData.Age} / {testData.Sex}</InfoVal>
            </LeftGroup>
            <RightGroup>
              <InfoCell><b>Collected on:</b></InfoCell>
              <InfoVal>{testData.CollectionOn}</InfoVal>
            </RightGroup>
          </InfoRow>
          <InfoRow>
            <LeftGroup>
              <InfoCell><b>Referred By:</b></InfoCell>
              <InfoVal>{testData.RefByDr}</InfoVal>
            </LeftGroup>
            <RightGroup>
            <InfoCell><b>Reported on:</b></InfoCell>
                <InfoVal>{testData.ReportingOn
                      ? new Date(testData.ReportingOn)
                                  .toISOString()
                                  .split("T")[0]
                              : getCurrentDateIST()}</InfoVal>
            </RightGroup>
          </InfoRow>
          <InfoRow>
            <LeftGroup>
              <InfoCell><b>Reg. no.:</b></InfoCell>
              <InfoVal>{testData.PatientID}</InfoVal>
            </LeftGroup>
            <RightGroup style={{ justifyContent: "space-between", alignItems: "center" }}>
              <BarcodeBlock>
                <Barcode value={testData.PatientID} width={2} height={40}/>
              </BarcodeBlock>
            </RightGroup>
          </InfoRow>
        </PatientInfoBox>
              {/* <PendingReportSidebar>
                <PendingReport onAdmissionIDSelect={handleAdmissionIDSelect} />
              </PendingReportSidebar> */}
  
        {/* FORM - your logic and anything editable goes below */}
        <form id="formId" onSubmit={handleSubmit}>
          <TestsContainer>
            <TestColumn>
              <Label>Sr no.</Label>
              {headers}
            </TestColumn>
            <TestColumn wide>
              <Label>TEST NAME</Label>
              {test}
            </TestColumn>
            <TestColumn>
              <Label>Attach Values</Label>
              {testData.tests.map((test, idx) => (
                <ActionButton type="button" style={{marginBottom: "8px"}} key={idx} onClick={() => handleAttachTable(test)}>
                  Attach-table
                </ActionButton>
              ))}
            </TestColumn>
            <TestColumn>
            <Label>Add Comments</Label>
              {testData.tests.map((test, idx) => (
                <ActionButton type="button" style={{marginBottom: "8px"}} key={idx} onClick={() => handleAttachTable(test)}>
                  Comment-table
                </ActionButton>
              ))}
            </TestColumn>
          </TestsContainer>
  
          <ButtonRow>
            <SubmitButton type="submit" onClick={() => { setSaveAndPrint(false); setSaveAndPrint2(false); }}>SAVE</SubmitButton>
            <SubmitButton type="submit" onClick={() => { setSaveAndPrint(true); setSaveAndPrint2(false); }}>SAVE & PRINT INVOICE</SubmitButton>
            <SubmitButton type="submit" onClick={() => { setSaveAndPrint2(true); setSaveAndPrint(false); }}>SAVE & PRINT RECEIPT</SubmitButton>
          </ButtonRow>
        </form>
        {attachedCardData && (<div ref={attachedCardRef}> <InlineTestCard testData={attachedCardData} /> </div>)}
      </MainContainer>
    </PageContainer>
  );
}
  
// Styled Components
const PageContainer = styled.div`
  background: ${({ theme }) => (theme.isDark) ? theme.bg : "#f6f6f9"};
  min-height: 100vh;
  width: 100%;
`;

const MainContainer = styled.div`
  max-width: 90vw;
  margin: 0 auto;
  padding: 76px 16px 20px ${({ $sidebarExpanded }) => ($sidebarExpanded ? "210px" : "66px")};
  transition: padding-left 0.22s;
`;

const Title = styled.h1`
  font-weight: 700;
  font-size: 28px;
  margin: 24px 0;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#104170"};
  text-align: center;
`;

const BackButton = styled.button`
  background: ${({ theme }) => (theme.isDark) ? theme.brand : "#e5eefe"};
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

  &:hover { background: #c7daf5; }
`;

const PatientInfoBox = styled.div`
  border: 1px solid #ddd;
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  border-radius: 7px;
  margin-bottom: 32px;
  padding: 14px 22px 8px 22px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
`;

const LeftGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const HeaderCell = styled.h1`
  color: ${({ theme }) => (theme.isDark) ? theme.text : "black"};
  font-size: 14px;
  border: 1px solid #ddd;
  height: 30px;
  margin: 0 0 8px 0;
  padding-left: 12px;
  display: flex;
  align-items: center;
`;

const TestInput = styled.input`
  font-size: 16px;
  padding: 6px 10px;
  border-radius: 3px;
  border: 1px solid #ddd;
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#fff"};
  margin-bottom: 8px;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  padding-top: 4px;
  padding-bottom: 4px;
  justify-content: center;
`;

const ActionButton = styled.button`
  font-size: 15px;
  padding: 6px 20px;
  border-radius: 4px;
  border: 1px solid #2575f6;
  background: ${({ theme }) => (theme.isDark) ? theme.brand : "#e7f0ff"};
  color: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#2575f6"};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #ceedff;
  }
`;

const InfoCell = styled.div`
  font-weight: 500;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#333"};
  min-width: 120px;
`;

const InfoVal = styled.div`
  font-weight: 400;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#1a1a2c"};
`;

const BarcodeBlock = styled.div`
  text-align: right;
`;


const BarcodeVal = styled.div`
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const TestsContainer = styled.div`
  display: flex;
  overflow-x: auto;
  border: 1px solid #ddd;
  background: ${({ theme }) => (theme.isDark) ? theme.card : "#fff"};
  margin-bottom: 28px;
`;

const TestColumn = styled.div`
  flex: ${({ wide }) => wide ? 5 : 2};
  display: flex;
  flex-direction: column;
  border-right: 1px solid #ddd;
  padding: 12px;

  &:last-child {
    border-right: none;
  }
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 8px;
  color: ${({ theme }) => (theme.isDark) ? theme.text : "#274c98"};
`;

const ButtonRow = styled.div`
  margin-top: 22px;
  display: flex;
  gap: 14px;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => (theme.isDark) ? theme.brand : "#2575f6"};
  color: white;
  font-weight: 700;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 1.5px 8px #cbe7ff44;
  &:hover {
    background: ${({ theme }) => (theme.isDark) ? theme.brandSoft : "#1762c2"};
  }
`;

const PendingReportSidebar = styled.div`
  flex: 0 0 260px;
  color: black;
  height: 80vh;
  overflow-y: auto;
  border-left: 1px solid #ccc;
  padding-left: 16px;
`;

export default TestReport;
