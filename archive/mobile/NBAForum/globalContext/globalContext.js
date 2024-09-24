import React, { useState, createContext, useEffect } from "react";
import axios from 'axios';

const Context = createContext()

const Provider = ( { children } ) => {

  const [ baseURL, setBaseURL ] = useState("http://64.226.89.39:8000")
  const [ isLoggedIn, setIsLoggedIn ] = useState()
  const [ userObj, setUserObj ] = useState()
  const [ hasSession, setHasSession] = useState()
  

  useEffect(() => {
    const fetchHasSession = async () => {
        try {
            const response = (await axios.get(baseURL + '/session/')).data.session;
            setHasSession(response);
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