// reducers.js
import * as actionTypes from './actions/actionTypes';
import { configureStore } from "@reduxjs/toolkit";
import { connect } from "react-redux";

const initialState = {
    user: null,
    loading: false,
    error: null,
    registeredUsers: [], // You can maintain a list of registered users here
    registrationData: {},
    posts: [],
    filteredPosts: [],
    followingUsers: [],
    newPost: null,
    status: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_REQUEST:
            return { ...state, loading: true, error: null };
        case actionTypes.LOGIN_SUCCESS:
            return { ...state, loading: false, user: action.payload, error: null };
        case actionTypes.LOGIN_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case actionTypes.REGISTER_USER:
            // Update the list of registered users
            return { ...state, registeredUsers: action.payload };
        case actionTypes.UPDATE_ERRORS:
            // Update error messages
            return { ...state, error: action.payload };
        case actionTypes.REGISTER_SUCCESS:
            // Update error messages
            return { ...state, registrationData: action.payload, error: null, loading: false };
        case actionTypes.FETCH_POSTS:
            return { ...state, posts: action.payload}
        case actionTypes.FILTERED_POSTS:
            return { ...state, filteredPosts: action.payload}
        case actionTypes.UPDATE_FOLLOW:
            return { ...state, followingUsers: action.payload}
        case actionTypes.NEW_POST:
            return { ...state, error: null, newPost: action.payload}
        case actionTypes.LOGOUT_SUCCESS:
            return { ...state, error: null, user: null}
        case actionTypes.UPDATE_STATUS:
            return { ...state, status: action.payload}
        case actionTypes.UPDATE_ARTICLE:
            return {
                ...state,
                posts: state.posts.map(post =>
                    post._id === action.payload._id ? action.payload : post
                )
            };
        default:
            return state;
    }
};

// Create the Redux store with the authReducer
const store = configureStore({
    reducer: authReducer, // Pass your reducer here
});

export default store;
