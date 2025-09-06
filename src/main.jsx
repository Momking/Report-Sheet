import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "./Context/AuthContext";
import "./styles.css";
import { SidebarProvider } from "./Context/SidebarContext";
import { ThemeProvider } from "./Context/themeContext"

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <SnackbarProvider>
      <AuthProvider>
        <SidebarProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SidebarProvider>
      </AuthProvider>
    </SnackbarProvider>
  </BrowserRouter>
);
