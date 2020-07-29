import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  BrowserRouter as Router, Redirect,
} from "react-router-dom";
import App from './App';
import Cookies from 'js-cookie'
import * as serviceWorker from './serviceWorker';
import theme from './theme'
import { ThemeProvider } from '@material-ui/core';

ReactDOM.render(
  <Router >
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </React.StrictMode>
  </Router>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
