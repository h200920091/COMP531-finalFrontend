import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import { Provider } from 'react-redux';
import {BrowserRouter, MemoryRouter, Route, Routes} from 'react-router-dom';
import configureStore from 'redux-mock-store'; // You may need to install this package

import LoginPage from '../LoginPage';
import MainPage from '../mainPage';
import {ChakraProvider} from "@chakra-ui/react";
import Profile from "../Profile";
import '@testing-library/jest-dom';

import store from "../../reducers";
import {loginFailure, loginSuccess, registerUser} from "../../actions/actions";


describe('LoginPage Tests', () => {
    it('should log in a previously registered user (not new users, login state should be set)', async () => {

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

        const loginUser = {
            id: 2,
            name: "Ervin Howell",
            username: "Antonette",
            address: {
                street: "Victor Plains",
            },
            company: {
                catchPhrase: "Proactive didactic contingency",
            }
        }

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

        const usernameInput = screen.getByPlaceholderText('Enter username');
        const passwordInput = screen.getByPlaceholderText('Enter password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'Antonette' } });
        fireEvent.change(passwordInput, { target: { value: 'Victor Plains' } });
        fireEvent.click(loginButton);

        // store.dispatch(loginSuccess(loginUser))
        expect(store.getState().user).toEqual(loginUser)
        expect(store.getState().error).toEqual(null)

    });
    it('should not log in an invalid user (error state should be set)', async () => {

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

        const usernameInput = screen.getByPlaceholderText('Enter username');
        const passwordInput = screen.getByPlaceholderText('Enter password');
        const loginButton = screen.getByText('Login');

        fireEvent.change(usernameInput, { target: { value: 'Wrong name' } });
        fireEvent.change(passwordInput, { target: { value: 'Wrong Password' } });
        fireEvent.click(loginButton);
        await screen.findByText('Incorrect username or password. Please try again.');

        expect(store.getState().error).toEqual("Incorrect username or password. Please try again.")

    });

    it('should set error for invalid register form', async () => {

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

        const signupBtn = screen.getByText('Sign Up');
        fireEvent.click(signupBtn);

        const registerBtn = screen.getByText('Register');
        const username = screen.getByPlaceholderText('Howard_Lin');
        const email = screen.getByPlaceholderText('Email Address');
        const phone = screen.getByPlaceholderText('123-123-1234');
        const zip = screen.getByPlaceholderText('12345');
        const date = screen.getByPlaceholderText('Your Birthday');
        const password = screen.getByPlaceholderText('password');
        const confirm = screen.getByPlaceholderText('confirm');

        fireEvent.change(username, { target: { value: '123' } });
        fireEvent.change(email, { target: { value: 'rice@cooker' } });
        fireEvent.change(phone, { target: { value: '123-123-1234' } });
        fireEvent.change(zip, { target: { value: '00000' } });
        fireEvent.change(date, { target: { value: '2030-12-22' } });
        fireEvent.change(password, { target: { value: 'password' } });
        fireEvent.change(confirm, { target: { value: 'confirm' } });
        fireEvent.click(registerBtn)
        expect(store.getState().error).toEqual("Invalid Account Name")
        fireEvent.change(username, { target: { value: 'a123' } });
        fireEvent.click(registerBtn)
        expect(store.getState().error).toEqual("Invalid Date")
        fireEvent.change(date, { target: { value: '2012-12-22' } });
        fireEvent.click(registerBtn)
        expect(store.getState().error).toEqual("Must be over 18")
        fireEvent.change(date, { target: { value: '2000-12-22' } });
        fireEvent.click(registerBtn)
        expect(store.getState().error).toEqual("Passwords do not match")
        fireEvent.change(password, { target: { value: '123' } });
        fireEvent.change(confirm, { target: { value: '123' } });
        fireEvent.click(registerBtn)
        expect(store.getState().error).toEqual(null)

    });

});


