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


const posts = [
    {
        "userId": 1,
        "id": 1,
        "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
        "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
    },
    {
        "userId": 2,
        "id": 17,
        "title": "fugit voluptas sed molestias voluptatem provident",
        "body": "eos voluptas et aut odit natus earum\naspernatur fuga molestiae ullam\ndeserunt ratione qui eos\nqui nihil ratione nemo velit ut aut id quo"
    },
    {
        "userId": 3,
        "id": 21,
        "title": "asperiores ea ipsam voluptatibus modi minima quia sint",
        "body": "repellat aliquid praesentium dolorem quo\nsed totam minus non itaque\nnihil labore molestiae sunt dolor eveniet hic recusandae veniam\ntempora et tenetur expedita sunt"
    },
    {
        "userId": 4,
        "id": 37,
        "title": "provident vel ut sit ratione est",
        "body": "debitis et eaque non officia sed nesciunt pariatur vel\nvoluptatem iste vero et ea\nnumquam aut expedita ipsum nulla in\nvoluptates omnis consequatur aut enim officiis in quam qui"
    }
]

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
    {
        id: 3,
        name: "Clementine Bauch",
        username: "Samantha",
        address: {
            street: "Douglas Extension",
        },
        company: {
            catchPhrase: "Face to face bifurcated interface",
        }
    },
    {
        id: 4,
        name: "Patricia Lebsack",
        username: "Karianne",
        address: {
            street: "Hoeger Mall",
        },
        company: {
            catchPhrase: "Multi-tiered zero tolerance productivity",
        }
    }
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

const mockLocalStorage = {
    getItem: jest.fn(),
};
global.localStorage = mockLocalStorage;
describe('mainPage Tests', () => {
    it('should log out a user (login state should be cleared)', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(loginSuccess(loginUser))
        store.dispatch(fetchPosts(posts))
        store.dispatch(updateFollow([1, 2, 3]))
        store.dispatch(registerUser(registeredUsers))
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        expect(store.getState().user).toEqual(loginUser)
        const logoutBtn = screen.getByText('Logout')
        fireEvent.click(logoutBtn)
        expect(store.getState().user).toEqual(null)
    })

    it('should fetch all articles for current logged in user (posts state is set)', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(loginSuccess(loginUser))
        store.dispatch(fetchPosts(posts))
        store.dispatch(updateFollow([1, 2, 3]))
        store.dispatch(registerUser(registeredUsers))
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        // expect(global.fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/posts');
        expect(store.getState().followingUsers).toEqual([1, 2, 3])
        expect(store.getState().posts.length).toEqual(posts.length)
    });

    it('should fetch subset of articles for current logged in user given search keyword (posts state is filtered)', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(loginSuccess(loginUser))
        store.dispatch(fetchPosts(posts))
        store.dispatch(updateFollow([1, 2, 3]))
        store.dispatch(registerUser(registeredUsers))
        render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );

        const filter = screen.getByPlaceholderText('Filter Articles by Author or Text')
        expect(store.getState().filteredPosts).toHaveLength(3)
        fireEvent.change(filter, { target: { value: 'sunt aut' } });
        expect(store.getState().filteredPosts).toHaveLength(1);
    });

    it('should add articles when adding a follower (posts state is larger )', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(loginSuccess(loginUser))
        // store.dispatch(fetchPosts(posts))
        store.dispatch(updateFollow([1, 2, 3, 4]))
        store.dispatch(registerUser(registeredUsers))
        render(
            <ChakraProvider>+
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );

        expect(store.getState().posts).toHaveLength(4);
    });

    it('follow card and profile card testing', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(registerUser(registeredUsers));
        store.dispatch(loginSuccess(loginUser))
        let mainPage = render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage />} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        const searchName = screen.getByPlaceholderText('Search Name')
        fireEvent.change(searchName, { target: { value: 'Patricia Lebsack' } });
        const addBtn = screen.getByText('Add')
        fireEvent.click(addBtn)
        // await screen.findByText('Ervin Howell')/
        fireEvent.change(searchName, { target: { value: '' } });
        fireEvent.click(addBtn)

        const newPostBtn = screen.getByText('New Post')
        fireEvent.click(newPostBtn)
        const postBtn = screen.getByText('Post')
        fireEvent.click(postBtn)
        expect(store.getState().error).toEqual("Title or content should not be empty")
        const titleInput = screen.getByPlaceholderText('Title')
        const contentInput = screen.getByPlaceholderText('Tell me what you feel')
        const clearBtn = screen.getByText('Clear')
        const imageBtn = screen.getByText('Select an Image')
        fireEvent.click(imageBtn)
        fireEvent.click(clearBtn)
        expect(store.getState().error).toEqual(null)
        fireEvent.change(titleInput, { target: { value: 'Title' } });
        fireEvent.change(contentInput, { target: { value: 'content' } });
        fireEvent.click(postBtn)
        expect(store.getState().error).toEqual(null)
        const getById = queryByAttribute.bind(null, 'id')
        const switchBtn1 = getById(mainPage.container, 'switch-1')
        store.dispatch(updateFollow([1, 2, 3]))
        fireEvent.click(switchBtn1)
        expect(store.getState().followingUsers.length).toEqual(2)
        const switchBtn4 = getById(mainPage.container, 'switch-4')
        fireEvent.click(switchBtn4)
        expect(store.getState().followingUsers.length).toEqual(1)
        const statusInput = screen.getByPlaceholderText('Update Status')
        const doneBtn = screen.getByText('Done')
        fireEvent.change(statusInput, { target: { value: 'test'}})
        fireEvent.click(doneBtn)
        const profileBtn = await screen.findByText('My Profile')
        fireEvent.click(profileBtn)
    })

    it('should identify source', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        store.dispatch(registerUser(registeredUsers));
        const location = { state: 'login' };
        let mainPage = render(
            <ChakraProvider>
                <Provider store={store}>
                    <MemoryRouter initialEntries={['/mainPage']}>
                        <Routes>
                            <Route path="/" element={<LoginPage />} />
                            <Route path="/mainPage" element={<MainPage location={location}/>} />
                            <Route path="/profile" element={<Profile />} />
                        </Routes>
                    </MemoryRouter>
                </Provider>
            </ChakraProvider>
        );
        store.dispatch(loginSuccess(loginUser))
        expect(store.getState().user).toEqual(loginUser)
    })

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

    it('should fetch localStorage', async () => {
        const originalFetch = global.fetch;
        global.fetch = jest.fn().mockResolvedValue({
            json: () => Promise.resolve(posts), // Mock the JSON response
        });
        const setLocalStorage = (id, data) => {
            window.localStorage.setItem(id, JSON.stringify(data));
        };
        setLocalStorage("user", loginUser);
        store.dispatch(registerUser(registeredUsers));

        let mainPage = render(
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
    })

});