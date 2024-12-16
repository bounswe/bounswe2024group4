import React from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex bg-darkBackground">
      {/* Sidebar */}
      <Sidebar />
      {/* Main content area */}
      <div className="ml-64 flex-1">
        {/* Topbar */}
        <Topbar />
        {/* Main content */}
        <div className="p-8 min-h-screen">{children}</div>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
