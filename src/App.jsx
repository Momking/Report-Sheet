import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import DoctorsSheet from "./pages/DoctorsSheet";
import RetailorsSheet from "./pages/RetailorsSheet";
import Start from "./pages/Start";
import DoctorFeatures from "./pages/DoctorFeatures";
import RetailFeatures from "./pages/RetailFeatures";
import About from "./pages/About";
import ConfigureSettings from "./pages/ConfigureSettings";
import Login from "./Components/auth/login";
import { useAuth } from "./Context/AuthContext";
import Register from "./Components/auth/register";
import InitialSheet from "./pages/InitialSheet";
import DoctorsSheetTest from "./pages/DoctorsSheetTest";
import ExcelReader from "./Components/Data/ExcelReader";
import FindReport from "./pages/FindReport";
import FindReport2 from "./pages/FindReport2";
import ViewReport from "./pages/ViewReport";

const App = () => {
  const { currentUser } = useAuth();
  
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Login />;
  };
  return (
    <Routes>
      <Route path="/" element={<RequireAuth><Start /></RequireAuth>} />
      <Route path="/InitialSettings" element={<RequireAuth><InitialSheet/></RequireAuth>}/>
      <Route path="/DoctorsSheet" element={<RequireAuth><DoctorsSheet /></RequireAuth>} />
      <Route path="/DoctorsSheetTest" element={<RequireAuth><DoctorsSheetTest /></RequireAuth>} />
      <Route path="/About" element={<RequireAuth><About /></RequireAuth>} />
      <Route path="/DoctorsSheet/Configure" element={<RequireAuth><ConfigureSettings /></RequireAuth>} />
      <Route path="/DoctorsSheet/Features" element={<RequireAuth><DoctorFeatures /></RequireAuth>} />
      <Route path="/RetailorsSheet" element={<RequireAuth><RetailorsSheet /></RequireAuth>} />
      <Route path="/RetailorsSheet/Features" element={<RequireAuth><RetailFeatures /></RequireAuth>} />
      <Route path="/Login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route path="/excelFile" element={<ExcelReader/>}/>
      <Route path="/FindReport" element={<RequireAuth><FindReport/></RequireAuth>}/>
      <Route path="/FindReport2" element={<RequireAuth><FindReport2/></RequireAuth>}/>
      <Route path="/ViewReport" element={<RequireAuth><ViewReport/></RequireAuth>}/>
    </Routes>
  );
}

export default App;
