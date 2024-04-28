import React, {useContext} from "react";
import SignUp from '../pages/SignUp.js';
import SignIn from '../pages/SignIn.js';
import ErrorPage from '../pages/GeneralError.js';
import SignUpPrompt from '../pages/SignUpPrompt.js';
import Feed from '../pages/Feed.js';
import { BrowserRouter, Routes, Route, Outlet, Navigate} from 'react-router-dom';
import { Context, Provider } from '../globalContext/globalContext.js';

function Router() {
  const globalContext = useContext(Context)
  const { isLoggedIn, setIsLoggedIn, hasSession, baseURL } = globalContext;
  const PrivateRoutes = (session) => {
    console.log(session);
    return (
      session ? <Outlet/> : <Navigate to='/sign-in'/>
    )
  }
    return (
        <Provider>
        <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes session = {hasSession}/>}>
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