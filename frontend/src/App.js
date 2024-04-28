import React, {useContext} from 'react';
import './css/index.css';
import { Context, Provider } from './globalContext/globalContext.js';
import Router from './routes/Router.js';

export default function App() {
    return (
      <Provider>
        <Router />
      </Provider>  
    );
};