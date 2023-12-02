import React from 'react';
import {render, screen, fireEvent, waitFor, act, queryByAttribute} from '@testing-library/react';
import { Provider } from 'react-redux';
import {BrowserRouter, MemoryRouter, Route, Routes} from 'react-router-dom';

import LoginPage from '../LoginPage';
import MainPage from '../mainPage';
import {ChakraProvider} from "@chakra-ui/react";
import Profile from "../Profile";
import '@testing-library/jest-dom';

import store from "../../reducers";
import {fetchPosts, loginFailure, loginSuccess, registerUser, updateFollow} from "../../actions/actions";

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

const localStorageMock = (function () {
    let store = {};

    return {
        getItem(key) {
            return store[key];
        },

        setItem(key, value) {
            store[key] = value;
        },

        clear() {
            store = {};
        },

        removeItem(key) {
            delete store[key];
        },

        getAll() {
            return store;
        },
    };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe('Profile Tests', () => {

    it('should identify user', async () => {
        // store.dispatch(loginSuccess(loginUser))
        store.dispatch(updateFollow([1, 2, 3, 4]))
        const setLocalStorage = (id, data) => {
            window.localStorage.setItem(id, JSON.stringify(data));
        };
        setLocalStorage("user", loginUser);

        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/profile']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        const profileLink = await screen.findByText('Current Info');
        expect(profileLink).toBeInTheDocument();
        expect(localStorage.getItem("user")).toEqual(JSON.stringify(loginUser));
        window.localStorage.clear()

    });

    it('should identify register', async () => {
        // store.dispatch(loginSuccess(loginUser))
        store.dispatch(updateFollow([1, 2, 3, 4]))
        const setLocalStorage = (id, data) => {
            window.localStorage.setItem(id, JSON.stringify(data));
        };
        setLocalStorage("register", loginUser);

        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/profile']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        const profileLink = await screen.findByText('Current Info');
        expect(profileLink).toBeInTheDocument();
        expect(localStorage.getItem("register")).toEqual(JSON.stringify(loginUser));
        window.localStorage.clear()

    });

    it('should fetch the logged in user\'s profile username', async () => {

        store.dispatch(registerUser(registeredUsers));
        store.dispatch(loginSuccess(loginUser))
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage/>} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'Antonette' } })
        fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: 'Victor Plains'}})
        fireEvent.click(screen.getByText('Login'))
        const profileBtn = screen.getByText('My Profile')
        fireEvent.click(profileBtn)
        const curr = await screen.findByText('Ervin Howell')
    })

    it('should navigate from loginPage to Profile', async () => {

        store.dispatch(registerUser(registeredUsers));
        store.dispatch(loginSuccess(loginUser))
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage/>} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        fireEvent.click(screen.getByText('Sign Up'))
        fireEvent.change(screen.getByPlaceholderText('Howard_Lin'), { target: { value: 'a123' } });
        fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'rice@cooker' } });
        fireEvent.change(screen.getByPlaceholderText('123-123-1234'), { target: { value: '123-123-1234' } });
        fireEvent.change(screen.getByPlaceholderText('12345'), { target: { value: '00000' } });
        fireEvent.change(screen.getByPlaceholderText('Your Birthday'), { target: { value: '2000-12-22' } });
        fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: '123' } });
        fireEvent.change(screen.getByPlaceholderText('confirm'), { target: { value: '123' } });
        fireEvent.click(screen.getByText('Register'))
        const profileBtn = screen.getByText('My Profile')
        fireEvent.click(profileBtn)
        const curr = await screen.findByText('a123')

    })

    it('should show invalid message', async () => {
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/profile']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage/>} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: '123'}})
        // fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: '123'}})
        // fireEvent.change(screen.getByPlaceholderText('123-123-1234'), { target: { value: '123'}})
        // fireEvent.change(screen.getByPlaceholderText('00000'), { target: { value: '123'}})
        fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: '123'}})
        fireEvent.change(screen.getByPlaceholderText('confirm'), { target: { value: '321'}})
        fireEvent.click(screen.getByText('Submit'))
        fireEvent.change(screen.getByPlaceholderText('confirm'), { target: { value: '123'}})
        fireEvent.change(screen.getByPlaceholderText('name'), { target: { value: 'a123'}})
        fireEvent.click(screen.getByText('Submit'))
        fireEvent.click(screen.getByText('Upload'))
        fireEvent.click(screen.getByText('Back'))
    })
});