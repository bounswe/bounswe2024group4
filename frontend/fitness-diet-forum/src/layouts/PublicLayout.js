import React from "react";

const PublicLayout = ({ children }) => {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-900">
      {children}
    </div>
  );
};

export default PublicLayout;
