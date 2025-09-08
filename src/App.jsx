import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import TestAdmission from "./pages/doctor_use/TestAdmission";
import RetailorsSheet from "./pages/retail_use/RetailorsSheet";
import Start from "./pages/Start";
import DoctorFeatures from "./pages/doctor_use/DoctorFeatures";
import RetailFeatures from "./pages/retail_use/RetailFeatures";
import About from "./pages/About";
import ConfigureSettings from "./pages/doctor_use/ConfigureSettings";
import Login from "./Components/auth/login";
import { useAuth } from "./Context/AuthContext";
import Register from "./Components/auth/register";
import InitialSheet from "./pages/doctor_use/InitialSheet";
import TestReport from "./pages/doctor_use/TestReport";
import ExcelReader from "./Components/Data/ExcelReader";
import FindReport from "./pages/doctor_use/FindReport";
import FindAdmission from "./pages/doctor_use/FindAdmission";
import ViewReport from "./pages/doctor_use/ViewReport";
import MonthlyCashReport from "./pages/doctor_use/AccountMaster/MonthlyCashReport";
import DailyCashReport from "./pages/doctor_use/AccountMaster/DailyCashReport";
import TestMaster from "./pages/doctor_use/TestMaster/TestData";
import TestCategories from "./pages/doctor_use/TestMaster/TestCategories";
import SubtestsCategories from "./pages/doctor_use/TestMaster/SubTestCategories";
import EditTestPanel from "./pages/doctor_use/TestMaster/EditTestPanel";
import DateRangeCashReport from "./pages/doctor_use/AccountMaster/DateRangeCashReport";
import AddSubTestPanel from "./pages/doctor_use/TestMaster/AddSubTestPanel";
import CaseReport from "./pages/doctor_use/CaseReport/CaseReport";
import TotalCasesReported from "./pages/doctor_use/CaseReport/TotalCasesReported";

const App = () => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Enter") {
        const active = document.activeElement;
        if (
          active &&
          (active.tagName === "INPUT" ||
           active.tagName === "SELECT" ||
           active.tagName === "TEXTAREA" ||
           active.isContentEditable)
        ) {
          event.preventDefault();
          const focusable = Array.from(
            document.querySelectorAll(
              'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
            )
          ).filter(el => !el.disabled && !el.hasAttribute("readonly") && el.offsetParent !== null && el.tagName !== "BUTTON");
          
          const index = focusable.indexOf(active);
          if (index > -1) {
            const next = focusable[index + 1] || focusable[0];
            next.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const RequireAuth = ({ children }) => {
    const { currentUser, initialSettingsSet } = useAuth();
    const location = useLocation();
  
    if (!currentUser) {
      return <Navigate to="/Login" replace />;
    }
    if (!initialSettingsSet && location.pathname !== "/doctor_use/InitialSheet") {
      return <Navigate to="/doctor_use/InitialSheet" replace />;
    }
  
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<RequireAuth><Start /></RequireAuth>} />
      <Route path="/doctor_use/InitialSheet" element={<RequireAuth><InitialSheet/></RequireAuth>}/>
      <Route path="/doctor_use/TestAdmission" element={<RequireAuth><TestAdmission /></RequireAuth>} />
      <Route path="/doctor_use/TestReport" element={<RequireAuth><TestReport /></RequireAuth>} />
      <Route path="/About" element={<RequireAuth><About /></RequireAuth>} />
      <Route path="/doctor_use/Configure" element={<RequireAuth><ConfigureSettings /></RequireAuth>} />
      <Route path="/doctor_use/Features" element={<RequireAuth><DoctorFeatures /></RequireAuth>} />
      <Route path="/retail_use/RetailorsSheet" element={<RequireAuth><RetailorsSheet /></RequireAuth>} />
      <Route path="/retail_use/RetailorsSheet/Features" element={<RequireAuth><RetailFeatures /></RequireAuth>} />
      <Route path="/Login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/excelFile" element={<ExcelReader/>}/>
      <Route path="/doctor_use/FindReport" element={<RequireAuth><FindReport/></RequireAuth>}/>
      <Route path="/doctor_use/FindAdmission" element={<RequireAuth><FindAdmission/></RequireAuth>}/>
      <Route path="/doctor_use/ViewReport" element={<RequireAuth><ViewReport/></RequireAuth>}/>
      <Route path="/doctor_use/DailyCashReport" element={<RequireAuth><DailyCashReport/></RequireAuth>}/>
      <Route path="/doctor_use/MonthlyCashReport" element={<RequireAuth><MonthlyCashReport/></RequireAuth>}/>
      <Route path="/doctor_use/TestMaster" element={<RequireAuth><TestMaster/></RequireAuth>}/>
      <Route path="/doctor_use/TestCategories" element={<RequireAuth><TestCategories/></RequireAuth>}/>
      <Route path="/doctor_use/SubTestCategories" element={<RequireAuth> <SubtestsCategories /></RequireAuth>}/>
      <Route path="/doctor_use/SubTestCategories/AddSubTestPanel" element={<RequireAuth><AddSubTestPanel/></RequireAuth>}/>
      <Route path="/doctor_use/EditTestPanel" element={<RequireAuth><EditTestPanel/></RequireAuth>}/>
      <Route path="/doctor_use/CashReport" element={<RequireAuth><DateRangeCashReport/></RequireAuth>}/>
      <Route path="/doctor_use/CaseReport" element={<RequireAuth><CaseReport/></RequireAuth>}/>
      <Route path="/doctor_use/TotalCasesReported" element={<RequireAuth><TotalCasesReported/></RequireAuth>}/>
    </Routes>
  );
}

export default App;
