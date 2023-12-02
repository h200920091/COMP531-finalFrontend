import {connect, useDispatch} from "react-redux";
import { Field, Form, Formik } from 'formik';
import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText, Button, Input, HStack, Box, Card, CardHeader, Flex, Avatar, Heading, Text, Divider,
} from '@chakra-ui/react'
import React, {useEffect, useRef, useState} from "react";
import {EditIcon} from "@chakra-ui/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {loginSuccess, registerSuccess, registerUser} from "../actions/actions";
import {FcGoogle} from "react-icons/fc";
import store from "../reducers";

const Profile = (props) => {
    const { user, registrationData } = props;
    const API_BASE_URL = 'https://rcf-cc450a613e85.herokuapp.com';
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [registeredUsers, setUsers] = useState([]);
    const inputRef = useRef();
    const [selectedFile, setSelectedFile] = useState(null);
    const [profiles, setProfiles] = useState([]);
    const location = useLocation()
    const source = location.state

    const loginUser = {
        name: "Guest",
        id: 11,
        status: ""
    };

    useEffect(() => {
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                loginUser.name = storedUser.name
                dispatch(loginSuccess(parsedUser))
            }
        }
        if (registrationData && Object.keys(registrationData).length !== 0) {
            localStorage.setItem("register", JSON.stringify(registrationData));
        } else {
            const storedRegistrationData = localStorage.getItem("register");
            if (storedRegistrationData) {
                const parsedRegistrationData = JSON.parse(storedRegistrationData);
                dispatch(registerSuccess(parsedRegistrationData))
            }
        }
    }, [user, registrationData, props.dispatch]);

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
                dispatch(registerUser(data.users));
                localStorage.setItem('users', JSON.stringify(data.users));
            } catch (error) {
                console.log(error);
            }
        };

        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            const usersFromStorage = JSON.parse(savedUsers);
            setUsers(usersFromStorage);
            dispatch(registerUser(usersFromStorage));
        } else {
            fetchAllUsers();
        }
    }, []);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    method: 'GET',
                    credentials: 'include', // Important for handling cookies
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setProfiles(data.profiles[0]);
                localStorage.setItem('profiles', JSON.stringify(data.profiles[0]));
            } catch (error) {
                console.log(error);
            }
        };

        const savedProfiles = localStorage.getItem('profiles');
        if (savedProfiles) {
            const profilesFromStorage = JSON.parse(savedProfiles);
            setProfiles(profilesFromStorage);
        } else {
            fetchProfiles();
        }
    }, []);

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        zipCode: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        phone: "",
        zipCode: "",
        password: "",
        confirmPassword: "",
        google: ""
    });

    const [curData, setCurData] = useState({
        username: "Guest",
        email: "ricecooker@rice.edu",
        phone: "123-123-1234",
        zipCode: "77005",
        password: "****",
        confirmPassword: "****",
    });

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user !== null || registrationData !== null) {
            setLoading(false);
        }
    }, [user, registrationData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (source === 'login') {
        loginUser.name = user.name
        loginUser.id = user.id
        loginUser.status = profiles.headline
    } else if (source === 'register') {
        loginUser.name = registrationData.accountName;
        loginUser.id = 11;
        loginUser.status = "Tell us what u feel";
    } else {
        loginUser.name = "Undefined User";
        loginUser.id = 11;
        loginUser.status = "How did U do that!?!";
    }
    if(curData.username === "Guest") curData.username = loginUser.name



    function validateName(name) {
        const re = /^[a-zA-Z]+[a-zA-Z0-9_.]*$/;
        return re.test(name);
    }

    const validate = () => {
        let valid = true;

        if (formData.username && !validateName(formData.username)) {
            setErrors((prevErrors) => ({ ...prevErrors, username: "Start with letter, no space" }));
            valid = false;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "Passwords do not match" }));
            valid = false;
        }

        return valid;
    };

    const handleFileSelect = () => {
        inputRef.current.click();
    };
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            console.log(formData)

            try {
                // Upload the image
                const uploadResponse = await fetch(`${API_BASE_URL}/image`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!uploadResponse.ok) {
                    throw new Error(`HTTP error! Status: ${uploadResponse.status}`);
                }

                const uploadResult = await uploadResponse.json();
                console.log('Upload successful:', uploadResult);

                // Update the user's avatar
                const avatarUpdateResponse = await fetch(`${API_BASE_URL}/avatar`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ avatar: uploadResult.url }),
                    credentials: 'include',
                });

                if (!avatarUpdateResponse.ok) {
                    throw new Error(`HTTP error! Status: ${avatarUpdateResponse.status}`);
                }

                const avatarUpdateResult = await avatarUpdateResponse.json();
                console.log('Avatar update successful:', avatarUpdateResult);

                setProfiles(prevProfiles => {
                    const updatedProfiles = { ...prevProfiles, avatar: uploadResult.url };

                    // Update localStorage
                    localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                    updateUserProfileInUsers(updatedProfiles);
                    return updatedProfiles;
                });

            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const updateUserProfileInUsers = (updatedUserProfile) => {
        const updatedUsers = store.getState().registeredUsers.map(user => {
            if (user._id === updatedUserProfile.userId) {
                // Replace the old user data with the updated user data
                // Create a new object with updated user profile while maintaining the original _id
                const updatedUser = {
                    ...user,
                    ...updatedUserProfile,
                    _id: user._id // Ensure the original _id is preserved
                };

                return updatedUser;
            }
            return user;
        });

        // Update localStorage
        localStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    const updateUserInfo = async (field, value) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${field}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ [field]: value }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const updatedData = await response.json();
            // console.log(`${field} update successful:`, updatedData);

            // Update profiles state and localStorage
            setProfiles(prev => ({ ...prev, [field]: value }));
            localStorage.setItem('profiles', JSON.stringify({ ...profiles, [field]: value }));

            // Update registered users list
            updateUserProfileInUsers({ ...profiles, [field]: value });

        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            if (field === "email")
                setErrors((prevErrors) => ({ ...prevErrors, email: "Already exist" }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validate()) {
            // Call the update API for each field that has been changed
            if (formData.username) await updateUserInfo('username', formData.username);
            if (formData.email) await updateUserInfo('email', formData.email);
            if (formData.phone) await updateUserInfo('phone', formData.phone);
            if (formData.zipCode) await updateUserInfo('zipcode', formData.zipCode);
            if (formData.password) await updateUserInfo('password', formData.password); // Ensure password meets requirements before updating



            // Clear formData
            setFormData({
                username: "",
                email: "",
                phone: "",
                zipCode: "",
                password: "",
                confirmPassword: "",
            });
        }
    };



    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "", // Clear the error when input changes
        }));
    };

    const handleGoogleConnect = () => {
        // Redirect to Google Auth endpoint
        window.location.href = `${API_BASE_URL}/auth/google`;
    };


    function CurrentInfo() {
        useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const googleId = urlParams.get('googleId');
            const name = urlParams.get('name');

            if (googleId && name) {
                // Call backend API to link Google account
                linkGoogleAccount(googleId);
                navigate("/profile");
            }
        }, []);

        const disconnectGoogleAccount = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/disconnect-google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: profiles.userId }),
                    credentials: 'include',
                });

                const result = await response.json();
                if (response.ok) {
                    console.log(result.success);
                    setProfiles(prevProfiles => {
                        const updatedProfiles = { ...prevProfiles, googleId: "" };
                        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                        return updatedProfiles;
                    });
                } else {
                    console.error(result.error);
                }
            } catch (error) {
                console.error('Error disconnecting Google account:', error);
            }
        };

        const linkGoogleAccount = async (googleId) => {
            try {
                const response = await fetch(`${API_BASE_URL}/link-google`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ googleId, userId: profiles.userId }),
                    credentials: 'include',
                });

                if (response.ok) {
                    const result = await response.json();
                    // Update profile state and localStorage only if linking is successful
                    setProfiles(prevProfiles => {
                        const updatedProfiles = { ...prevProfiles, googleId: googleId };
                        localStorage.setItem('profiles', JSON.stringify(updatedProfiles));
                        return updatedProfiles;
                    });
                    console.log(result);
                } else {
                    const errorResult = await response.json();
                    console.error('Error linking Google account:', errorResult.error);
                    setErrors((prevErrors) => ({ ...prevErrors, google: "This account is already linked." }));

                    // Handle the error, such as showing a notification to the user
                }
            } catch (error) {
                console.error('Error linking Google account:', error);
            }
        };

        const handleGoogleAction = () => {
            if (profiles.googleId) {
                // If Google ID exists, call disconnect function
                disconnectGoogleAccount();
            } else {
                // If Google ID does not exist, call connect function
                handleGoogleConnect();
            }
        };

        return (
            <Card width="30vw" maxWidth={500}>
                <CardHeader>
                    <Flex spacing="4">
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <Box>
                                <Heading size="lg" mb="-1">
                                    {"Current Info"}
                                </Heading>
                            </Box>
                        </Flex>
                    </Flex>
                </CardHeader>
                <Box ml={6} mr={4} mb={4} mt={1}>
                    <Heading size="sm">Username</Heading>
                    <Text>{profiles.username}</Text>
                </Box>
                <Box ml={6} mr={4} mb={4} mt={1}>
                    <Heading size="sm">Email</Heading>
                    <Text>{profiles.email}</Text>
                </Box>
                <Box ml={6} mr={4} mb={4} mt={1}>
                    <Heading size="sm">Phone</Heading>
                    <Text>{profiles.phone}</Text>
                </Box>
                <Box ml={6} mr={4} mb={4} mt={1}>
                    <Heading size="sm">Zip Code</Heading>
                    <Text>{profiles.zipcode}</Text>
                </Box>
                <Box ml={6} mr={4} mb={4} mt={1}>
                    <Heading size="sm">Password</Heading>
                    <Text>{"*****"}</Text>
                </Box>
                <Box ml={6} mr={4} mb={0} mt={1}>
                    <Text color="red" mb={0} ml="auto">{errors.google}</Text>
                    <Button
                        flex="1"
                        variant="ghost"
                        leftIcon={<FcGoogle />}
                        onClick={handleGoogleAction}
                        backgroundColor={profiles.googleId ? "red.200" : "initial"}
                    >
                        {profiles.googleId ? "Disconnect" : "Connect with Google"}
                    </Button>
                </Box>
                <Box ml={6} mr={4} mb={4} mt={0}>
                    <Button
                        mt={4}
                        colorScheme='red'
                        onClick={backToMain}
                    >
                        Back
                    </Button>
                </Box>
            </Card>
        )
    }

    function backToMain() {
        navigate("/mainPage", {state: source});
    }

    return (
        <div className="background">
            <HStack justifyContent="center" alignItems="center" height="100vh">
                <Box ml="auto">
                    <CurrentInfo/>
                </Box>
                <Box mr="auto">
                    <Card width="30vw" maxWidth={500}>
                        <CardHeader mb="-5">
                            <Flex spacing="4">
                                <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                                    <Box>
                                        <Heading size="lg"  mb="-1">
                                            {"Update Info"}
                                        </Heading>
                                    </Box>
                                </Flex>
                            </Flex>
                            <Box h="4"></Box>
                            <HStack>
                                <Avatar name={"name"} src={profiles.avatar} size="xl" background="yellow" />
                                <Button size="sm" mt={8} rightIcon={<EditIcon />} onClick={handleFileSelect}> Upload </Button>
                                <input
                                    type="file"
                                    accept="image/*" // Define accepted file types
                                    style={{ display: 'none' }} // Ensure the input is hidden
                                    ref={inputRef}
                                    onChange={handleFileChange}
                                />
                            </HStack>
                        </CardHeader>
                        <Box ml={4} mr={4} mb={4} mt={1}>
                            <form onSubmit={handleSubmit}>
                                <HStack>
                                    <Heading size="sm">Username</Heading>
                                    <Text color="red" mb={-0.5} ml="auto">{errors.username}</Text>
                                </HStack>
                                {/*<Input placeholder='name' name="username" size="sm" mt={-2} value={formData.username} onChange={handleInputChange}/>*/}
                                <Text size="sm" mt={-1.5}>{profiles.username}</Text>
                                {/*<Box h={2}></Box>*/}
                                <HStack>
                                    <Heading size="sm">Email</Heading>
                                    <Text color="red" mb={-0.5} ml="auto">{errors.email}</Text>
                                </HStack>
                                <Input placeholder='email' name="email" type="email" size="sm" mt={-2} value={formData.email} onChange={handleInputChange}/>
                                <Box h={2}></Box>
                                <Heading size="sm">Phone</Heading>
                                <Box>
                                    <Input
                                        type="tel"
                                        placeholder="123-123-1234"
                                        size="sm"
                                        mt={-2}
                                        name="phone" // Make sure to add a unique name for the input
                                        value={formData.phone} // Connect the value to the corresponding state
                                        onChange={handleInputChange} // Handle changes
                                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" // Add pattern for validation
                                    />
                                </Box>
                                <Box h={2}></Box>
                                <HStack>
                                    <Heading size="sm">
                                        Zip Code
                                    </Heading>
                                </HStack>
                                <Input
                                    type="text"
                                    placeholder="00000"
                                    size="sm"
                                    mt={-2}
                                    name="zipCode" // Add a unique name for the input
                                    value={formData.zipCode} // Connect the value to the corresponding state
                                    onChange={handleInputChange} // Handle changes
                                    pattern="[0-9]{5}" // Add pattern for validation
                                />
                                <Box h={2}></Box>
                                <Heading size="sm">New Password</Heading>
                                <Input
                                    type="password"
                                    placeholder="password"
                                    size="sm"
                                    mt={-2}
                                    name="password" // Add a unique name for the input
                                    value={formData.password} // Connect the value to the corresponding state
                                    onChange={handleInputChange} // Handle changes
                                />

                                <Box h={2}></Box>
                                <HStack>
                                    <Heading size="sm">Confirm</Heading>
                                    <Text color="red" mb={-0.5} ml="auto">{errors.confirmPassword}</Text>
                                </HStack>
                                <Input
                                    type="password"
                                    placeholder="confirm"
                                    size="sm"
                                    mt={-2}
                                    name="confirmPassword" // Add a unique name for the input
                                    value={formData.confirmPassword} // Connect the value to the corresponding state
                                    onChange={handleInputChange} // Handle changes
                                />
                                <Button
                                    mt={4}
                                    colorScheme='teal'
                                    type='submit'
                                >
                                    Submit
                                </Button>
                            </form>
                        </Box>
                    </Card>
                </Box>
            </HStack>
        </div>
    )
}

const mapStateToProps = (state) => ({
    user: state.user,
    registrationData: state.registrationData,
});

export default connect(mapStateToProps)(Profile); // Connect the component to the Redux store