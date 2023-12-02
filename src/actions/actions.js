// actions.js
import * as actionTypes from './actionTypes';
import {REGISTER_SUCCESS} from "./actionTypes";

export const loginRequest = () => ({
    type: actionTypes.LOGIN_REQUEST,
});

export const loginSuccess = (user) => ({
    type: actionTypes.LOGIN_SUCCESS,
    payload: user,
});

export const loginFailure = (error) => ({
    type: actionTypes.LOGIN_FAILURE,
    payload: error,
});

export const registerUser = (userData) => ({
    type: actionTypes.REGISTER_USER,
    payload: userData,
});

export const registerSuccess = (registrationData) => ({
    type: actionTypes.REGISTER_SUCCESS,
    payload: registrationData,
});

export const updateErrors = (errors) => ({
    type: actionTypes.UPDATE_ERRORS,
    payload: errors,
});

export const fetchPosts = (posts) => ({
    type: actionTypes.FETCH_POSTS,
    payload: posts,
})

export const filteringPosts = (posts) => ({
    type: actionTypes.FILTERED_POSTS,
    payload: posts,
})

export const updateFollow = (followingUsers) => ({
    type: actionTypes.UPDATE_FOLLOW,
    payload: followingUsers
})

export const newPost = (post) => ({
    type: actionTypes.NEW_POST,
    payload: post
})

export const logoutSuccess = () => ({
    type: actionTypes.LOGOUT_SUCCESS
})

export const updateStatus = (status) => ({
    type: actionTypes.UPDATE_STATUS,
    payload: status
})

export const updateArticle = (post) => ({
    type: actionTypes.UPDATE_ARTICLE,
    payload: post
})