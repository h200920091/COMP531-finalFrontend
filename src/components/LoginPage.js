import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {loginFailure, loginSuccess, registerSuccess, registerUser, updateErrors} from "../actions/actions";
import {Box, Button, Tooltip} from "@chakra-ui/react";
import {QuestionOutlineIcon} from "@chakra-ui/icons";
import store from "../reducers";
import { FcGoogle } from 'react-icons/fc'

const API_BASE_URL = 'https://rcf-cc450a613e85.herokuapp.com';

const LoginPage = () => {
    const [registeredUsers, setUsers] = useState([]);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loginMode, setLoginMode] = useState("signin");

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setUsers(data.users);
                dispatch(registerUser(data.users))
            } catch (error) {
                console.log(error)
            }
        };
        fetchAllUsers()
    }, []);
    const handleSignIn = async (e) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.loginUsername,
                password: formData.loginPassword
            }),
            credentials: 'include', // Important for handling cookies
            })

            if (!response.ok) {
                dispatch(loginFailure("Incorrect username or password. Please try again."))
                setErrors({ ...errors, login: "Incorrect username or password. Please try again." });
            }
            else {
                const user = await response.json();
                dispatch(loginSuccess(user));
                navigate("/mainPage", { state: 'login' });

                // Clear any previous errors
                setErrors({ ...errors, login: "" });
            }
        } catch (error) {
            console.error('Login error:', error);
            dispatch(loginFailure("Incorrect username or password. Please try again."))
            setErrors({ ...errors, login: "Incorrect username or password. Please try again." });
        }

    };

    // Initialize form fields as empty or with initial values as needed
    const [formData, setFormData] = useState({
        loginUsername: "",
        loginPassword: "",
        accountName: "",
        displayName: "",
        email: "",
        phone: "",
        date: "",
        zip: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        login: "",
        accountName: "",
        email: "",
        phone: "",
        date: "",
        zip: "",
        password: "",
        confirmPassword: ""
    });

    const changeMode = () => {
        setLoginMode(loginMode === "signin" ? "signup" : "signin");
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let findUser = store.getState().registeredUsers.find((user) => user.username === formData.accountName)
        if (findUser) {
            setErrors({ ...errors, accountName: "Already Exist!" });
            dispatch(updateErrors("Invalid Account Name"))
            return;
        }

        if (!validateAccountName(formData.accountName)) {
            setErrors({ ...errors, accountName: "Invalid Account Name" });
            dispatch(updateErrors("Invalid Account Name"))
            return;
        }

        if (!validateAge(formData.date)) {
            return;
        }

        if (!validatePasswordMatch(formData.password, formData.confirmPassword)) {
            setErrors({ ...errors, confirmPassword: "Passwords do not match" });
            dispatch(updateErrors("Passwords do not match"))
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.accountName,
                    email: formData.email,
                    dob: formData.date,
                    phone: formData.phone,
                    zipcode: formData.zip,
                    headline: formData.displayName || "Gimme rice!", // Assuming displayName is used as headline
                    avatar: "http://res.cloudinary.com/hht4avzbk/image/upload/v1701055538/a27mzbgcefye6u6tkbuq.jpg", // You can add avatar handling if needed
                    password: formData.password,
                }),
                credentials: 'include', // Important for handling cookies
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            // Success logic here
            // Dispatch the successful registration action
            dispatch(registerSuccess(result));
            // Navigate to mainPage or another page as needed
            localStorage.removeItem("profile");
            localStorage.removeItem("articles");
            localStorage.removeItem("following");
            navigate("/mainPage",{ state: 'register' });

        } catch (error) {
            console.error('Registration error:', error);
            // Handle the registration error
            // You might want to dispatch an action or update state to reflect the error
        }
    };


    const validateAge = (birthDate) => {
        let diff = Date.now() - Date.parse(birthDate)
        let diffDate = new Date(diff)
        let year = diffDate.getFullYear()
        let age = year-1970
        if(0 <= age && age < 18) {
            setErrors({ ...errors, date: "Must be over 18 !!" });
            dispatch(updateErrors("Must be over 18"))
            return false
        }
        if(age < 0) {
            setErrors({ ...errors, date: "Invalid Date !!" });
            dispatch(updateErrors("Invalid Date"))
            return false
        }
        return true
    }

    const validateAccountName = (name) => {
        // Add your account name validation logic here
        if (!/^[a-zA-Z]+[a-zA-Z0-9_.]*$/.test(name)) {
            setErrors({ ...errors, accountName: "Invalid Account Name" });
            return false;
        }
        return true;
    };

    const validatePasswordMatch = (password, confirmPassword) => {
        if (password !== confirmPassword) {
            setErrors({ ...errors, confirmPassword: "Passwords do not match" });
            return false;
        }
        return true;
    };

    const handleGoogleConnect = () => {
        // Redirect to Google Auth endpoint
        window.location.href = `${API_BASE_URL}/auth/googleLogin`;
    };
    const loginWithGoogle = async (googleId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login-with-google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ googleId }),
                credentials: 'include', // to handle cookies
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log(data.message);

            // Handle successful login
            if (data.success) {
                localStorage.removeItem("profile");
                localStorage.removeItem("articles");
                localStorage.removeItem("following");
                navigate("/mainPage");
            }
        } catch (error) {
            navigate("/");
            dispatch(loginFailure("User not found."))
            setErrors({ ...errors, login: "User not found." });
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const googleId = urlParams.get('googleId');
        const name = urlParams.get('name');

        if (googleId && name) {
            loginWithGoogle(googleId)

        }
    }, []);


    if (loginMode === "signin") {
        return (
            <div className="background">
                <div className="Login-Container" >
                    <form className="Login-Form">
                        <div className="Login-Form-Content">
                            <h3 className="Login-Form-Title">Sign In</h3>
                            <div className="form-group mt-3">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control mt-1"
                                    placeholder="Enter username"
                                    name="loginUsername"
                                    required={true}
                                    value={formData.loginUsername}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Password</label>
                                <div className="relative-container">
                                    <input
                                        type="password"
                                        className="form-control mt-1"
                                        placeholder="Enter password"
                                        name="loginPassword"
                                        required={true}
                                        value={formData.loginPassword}
                                        onChange={handleInputChange}
                                    />
                                    <span className="error">{errors.login}</span>
                                </div>
                            </div>
                            <Box h="3"></Box>
                            <div className="d-grid gap-2 mt-3">
                                <button type="button" className="btn btn-primary" onClick={handleSignIn}>
                                    Login
                                </button>
                            {/*</div>*/}
                            {/*<div className="d-grid gap-2 mt-3">*/}
                                <Button flex="1" variant="outline" leftIcon={<FcGoogle />} onClick={handleGoogleConnect}>
                                    Login with Google
                                </Button>

                            </div>
                            <div className="text-center" style={{marginTop: '10px'}}>
                                New here?{" "}
                                <span className="link-primary" onClick={changeMode}>
                                Sign Up
                            </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="background">
                <div className="Login-Container">
                    <form className="Login-Form" onSubmit={handleSubmit}>
                        <div className="Login-Form-Content">
                            <h3 className="Login-Form-Title">Sign Up</h3>
                            <div className="form-group mt-3">
                                <div className="d-flex">
                                    <div style={{ flex: 1 }}>
                                        <label>Username</label>
                                        <Tooltip  label="Start with letter, allow _ ." aria-label='A tooltip' placement="right">
                                            <QuestionOutlineIcon ml="4px" />
                                        </Tooltip>
                                        <div className="relative-container">
                                            <input
                                                type="text"
                                                className="form-control mt-1"
                                                placeholder="Howard_Lin"
                                                name="accountName"
                                                value={formData.accountName}
                                                onChange={handleInputChange}
                                                required={true}
                                            />
                                            <span className="error">{errors.accountName}</span>
                                        </div>
                                    </div>
                                    <div style={{ flex: 1, marginLeft: "10px" }}>
                                        <label>Display Name</label>
                                        <input
                                            type="text"
                                            className="form-control mt-1"
                                            placeholder="(Optional)"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <label>Email address</label>
                                <input
                                    type="email"
                                    className="form-control mt-1"
                                    placeholder="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required={true}
                                />
                                <span className="error">{errors.email}</span>
                            </div>
                            <div className="form-group mt-3">
                                <div className="d-flex">
                                    <div style={{ flex: 1 }}>
                                        <label>Phone Number</label>
                                        <input
                                            type="tel"
                                            className="form-control mt-1"
                                            placeholder="123-123-1234"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            required={true}
                                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                                        />
                                        <span className="error">{errors.phone}</span>
                                    </div>
                                    <div style={{ flex: 1, marginLeft: "10px" }}>
                                        <label>Zip Code</label>
                                        <input
                                            type="text"
                                            className="form-control mt-1"
                                            placeholder="12345"
                                            name="zip"
                                            value={formData.zip}
                                            onChange={handleInputChange}
                                            required={true}
                                            pattern="[0-9]{5}"
                                        />
                                        <span className="error">{errors.zip}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="form-group mt-3">
                                <label>Date of birth</label>
                                <div className="relative-container">
                                    <input
                                        type="date"
                                        className="form-control mt-1"
                                        name="date"
                                        placeholder="Your Birthday"
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    <span className="error">{errors.date}</span>
                                </div>
                            </div>

                            <div className="form-group mt-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    className="form-control mt-1"
                                    placeholder="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required={true}
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label>Confirm Password</label>
                                <div className="relative-container">
                                    <input
                                        type="password"
                                        className="form-control mt-1"
                                        placeholder="confirm"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required={true}
                                    />
                                    <span className="error">{errors.confirmPassword}</span>
                                </div>
                            </div>
                            <div className="d-grid gap-2 mt-3">
                                <button type="submit" className="btn btn-primary">
                                    Register
                                </button>
                            </div>
                            <div className="text-center" style={{marginTop: '10px'}}>
                                Already registered?{" "}
                                <span className="link-primary" onClick={changeMode}>
                                Sign In
                            </span>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}
export default LoginPage;
