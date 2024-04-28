import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';

const Context = createContext()

const Provider = ( { children } ) => {

const [ baseURL, setBaseURL ] = useState("http://127.0.0.1:8000");
const [ isLoggedIn, setIsLoggedIn ] = useState(false);
const [ userObj, setUserObj ] = useState();
const [ hasSession, setHasSession] = useState(false);
axios.defaults.withCredentials = true;

useEffect(() => {
  const fetchHasSession = async () => {
  try {
    const response = (await axios.get(baseURL + '/session/')).data.session;
    setHasSession(response);
    console.log(response);
  } catch (error) {
    setHasSession(false);
  }
  };
    fetchHasSession();
})

  const globalContext = {
    baseURL,
    setBaseURL,
    isLoggedIn,
    setIsLoggedIn,
    userObj,
    setUserObj,
    hasSession,
    setHasSession
  }

  return <Context.Provider value={globalContext}>{children}</Context.Provider>
 };

 export { Context, Provider };