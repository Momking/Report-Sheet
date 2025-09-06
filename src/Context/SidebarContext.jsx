import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();
export const useSidebar = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  return (
    <SidebarContext.Provider value={{ sidebarExpanded, setSidebarExpanded }}>
      {children}
    </SidebarContext.Provider>
  );
};
