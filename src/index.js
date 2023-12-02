import React from 'react';
import ReactDOM from 'react-dom/client';
import { connect, Provider } from 'react-redux'
import './index.css';
import App from './App';
import LoginPage from "./components/LoginPage";
import reportWebVitals from './reportWebVitals';
import store from "./reducers";
import MainPage from "./components/mainPage";
import {ChakraProvider} from "@chakra-ui/react";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ChakraProvider>
        <Provider store={store}>
            <App />
        </Provider>
    </ChakraProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
