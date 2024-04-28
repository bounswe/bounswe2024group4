import React from 'react';
import './css/index.css';
import { Provider } from './globalContext/globalContext.js';
import Router from './routes/Router.js';

export default function App() {
    return (
      <Provider>
        <Router />
      </Provider>  
    );
};