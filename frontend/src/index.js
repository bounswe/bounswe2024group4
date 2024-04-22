import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/index.css';
import SignUp from './pages/SignUp.js';
import SignIn from './pages/SignIn.js';
import ErrorPage from './pages/GeneralError.js';
import SignUpPrompt from './pages/SignUpPrompt.js';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: < SignUp />,
    errorElement: < ErrorPage />,
  },
  {
    path: "/sign-up-prompt",
    element: < SignUpPrompt />,
    errorElement: < ErrorPage />,
  },
  {
    path: "/sign-in",
    element: < SignIn />,
    errorElement: < ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}> </RouterProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();