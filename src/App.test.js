import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { Provider } from 'react-redux';
import {BrowserRouter, MemoryRouter, Route, Routes} from 'react-router-dom';
import configureStore from 'redux-mock-store'; // You may need to install this package

import LoginPage from './components/LoginPage';
import MainPage from './components/mainPage';
import App from './App';
import {ChakraProvider} from "@chakra-ui/react";
import Profile from "./components/Profile";
import '@testing-library/jest-dom';

import store from "./reducers";
import {loginFailure, loginSuccess, registerUser} from "./actions/actions";


describe('App Tests', () => {
  it('should be able to load the loginPage', async () => {

    const registeredUsers = [
      {
        id: 1,
        name: "Leanne Graham",
        username: "Bret",
        address: {
          street: "Kulas Light",
        },
        company: {
          catchPhrase: "Multi-layered client-server neural-net",
        }
      },
      {
        id: 2,
        name: "Ervin Howell",
        username: "Antonette",
        address: {
          street: "Victor Plains",
        },
        company: {
          catchPhrase: "Proactive didactic contingency",
        }
      },
    ]

    store.dispatch(registerUser(registeredUsers));

    render(
        <ChakraProvider>
          <Provider store={store}>
            <MemoryRouter initialEntries={['/']}>
              <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/mainPage" element={<MainPage />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </MemoryRouter>
          </Provider>
        </ChakraProvider>
    );

    expect(store.getState().error).toEqual(null)

  });

  it('test App', async () => {
    render(
        <ChakraProvider>
          <Provider store={store}>
            <App />
          </Provider>
        </ChakraProvider>
    );

  })
});


