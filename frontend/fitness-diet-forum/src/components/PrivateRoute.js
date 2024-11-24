import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthorized } from "./Auth"; 

const PrivateRoute = ({ children }) => {
  return isAuthorized() ? children : <Navigate to="/" />;
};

export default PrivateRoute;
