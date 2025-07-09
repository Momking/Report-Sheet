import React from "react";
import { Routes, Route } from "react-router-dom";
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

const App = () => {
  const { currentUser } = useAuth();
  
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Login />;
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
    </Routes>
  );
}

export default App;
