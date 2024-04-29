import React from "react";
import SignUp from '../pages/SignUp.js';
import SignIn from '../pages/SignIn.js';
import ErrorPage from '../pages/GeneralError.js';
import SignUpPrompt from '../pages/SignUpPrompt.js';
import Feed from '../pages/Feed.js';
import { BrowserRouter, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import { Provider } from '../globalContext/globalContext.js';
import { isAuthorized } from "../components/Auth.js";

function Router() {
  const PrivateRoutes = () => {
    console.log(isAuthorized())
    return (
      isAuthorized() ? <Outlet /> : <Navigate to='/sign-in' />
    );
    };

    return (
        <Provider>
        <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes/>}>
              <Route path='/' element={<Feed/>} />
          </Route>
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up-prompt" element={<SignUpPrompt />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
      </Provider>
    )
};

export default Router;