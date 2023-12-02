import {connect, useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";
import { FcGoogle } from 'react-icons/fc'
import {
    Avatar,
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Flex,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalOverlay,
    Stack,
    Switch,
    Text,
    Textarea,
    useDisclosure,
    VStack
} from '@chakra-ui/react'
import {
    AddIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    ChatIcon,
    EditIcon,
    SearchIcon,
    SettingsIcon,
    WarningTwoIcon
} from '@chakra-ui/icons'
import React, {useEffect, useReducer, useRef, useState} from "react";
import {
    fetchPosts,
    filteringPosts,
    loginSuccess,
    logoutSuccess,
    newPost,
    registerSuccess,
    registerUser,
    updateErrors,
    updateFollow,
    updateStatus,
    updateArticle
} from "../actions/actions";
import * as PropTypes from "prop-types";
import store from "../reducers";

const API_BASE_URL = 'https://rcf-cc450a613e85.herokuapp.com';
function InputLeftAddonElement(props) {
    return null;
}

InputLeftAddonElement.propTypes = {children: PropTypes.node};

function ArrowRightIconIcon() {
    return null;
}

const MainPage = (props) => {
    const { user, registrationData } = props;
    const [registeredUsers, setUsers] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const [followedUsers, setFollowedUsers] = useState([]);
    const [articles, setArticles] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const articlesPerPage = 10; // You can adjust this number as needed

    const location = useLocation()
    const source = location.state
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [followingUsers, setFollowingUsers] = useState([]);
    const [filterText, setFilterText] = useState("");
    const loginUser = {
        name: "Guest",
        id: 11,
        status: ""
    };

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
                // console.log(data.profiles[0])

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
        const fetchAllFollowing = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/following`, {
                    method: 'GET',
                    credentials: 'include',
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setFollowingUsers(data.following);
                dispatch(updateFollow(data.following));
                localStorage.setItem('following', JSON.stringify(data.following));
            } catch (error) {
                console.log(error);
            }
        };

        const savedFollowing = localStorage.getItem('following');
        if (savedFollowing) {
            const followingFromStorage = JSON.parse(savedFollowing);
            setFollowingUsers(followingFromStorage);
            dispatch(updateFollow(followingFromStorage));
        } else {
            fetchAllFollowing();
        }
    }, []);



    useEffect(() => {
        if (source === "login") {
            let userData;
            let status;
            if (user) {
                userData = profiles;
                status = profiles.headline;
                localStorage.setItem("user", JSON.stringify(user));
                const statusStore = localStorage.getItem("status")
                if (!statusStore) {
                    localStorage.setItem("status", JSON.stringify(profiles.headline))
                }
                else
                    status = statusStore
            } else {
                const storedUser = localStorage.getItem("user");
                const storedStatus = localStorage.getItem("status");
                if (storedUser) {
                    userData = JSON.parse(storedUser);
                }
                if (storedStatus) {
                    status = storedStatus
                }
            }
            if (userData) {
                dispatch(loginSuccess(userData));
            }
            if (status) {
                dispatch(updateStatus(status))
            }
        }

        if (source === "register") {
            let status;
            const storedRegistrationData = localStorage.getItem("register");
            if (!storedRegistrationData) {
                status = "Tell us what you feel"
                localStorage.setItem("status", status);
            }
            else {
                status = localStorage.getItem("status")
            }
            dispatch(updateStatus(status))

            if (registrationData && Object.keys(registrationData).length !== 0) {
                localStorage.setItem("register", JSON.stringify(registrationData));
            } else {
                const storedRegistrationData = localStorage.getItem("register");
                if (storedRegistrationData) {
                    const parsedRegistrationData = JSON.parse(storedRegistrationData);
                    dispatch(registerSuccess(parsedRegistrationData));
                }
            }
        }
    }, [user, registrationData, props.dispatch]);


    const addUser = () => {
        const newUser = {
            id: loginUser.id, // Choose a unique ID
            name: loginUser.name,
            company: {
                catchPhrase: loginUser.status,
            },
        };

        // Update the registeredUsers state with the new user
        // setUsers((prevUsers) => [...prevUsers, newUser]);
        dispatch(registerUser([...store.getState().registeredUsers, newUser]))
        dispatch(updateFollow([store.getState().followingUsers ,newUser.id]))
        console.log(store.getState().followingUsers)
        // setFollowingUsers([newUser.id]);
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/allArticles`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setArticles(data.articles);
                setPosts(data.articles);
                dispatch(fetchPosts(data.articles));
                localStorage.setItem('articles', JSON.stringify(data.articles));
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
        };

        const savedArticles = localStorage.getItem('articles');
        if (savedArticles) {
            const articlesFromStorage = JSON.parse(savedArticles);
            setArticles(articlesFromStorage);
            setPosts(articlesFromStorage);
            dispatch(fetchPosts(articlesFromStorage));
        } else {
            fetchArticles();
        }
    }, []);// The empty dependency array ensures this runs once on component mount


    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // console.log(store.getState().registeredUsers.length > 0, profiles, user)
        if ((store.getState().registeredUsers.length > 0 && profiles)) {
            setLoading(false);
        }
    }, [followingUsers, profiles, registeredUsers, user]);

    if (loading) {
        return <div>Loading...</div>;
    }


    if (source === 'login') {
        loginUser.name = user.name
        loginUser.id = user.id
        loginUser.status = store.getState().status
    } else if (source === 'register') {
        loginUser.name = registrationData.accountName;
        loginUser.id = 11;
        loginUser.status = store.getState().status;
        // if (!store.getState().registeredUsers.some(user => user.id === loginUser.id))
        //     addUser()
    }

    function ResponsiveCard({ userName, postTitle, postText, users, imgUrl, timestamp, postId, comments}) {
        const poster = users.find((user) => user._id === userName._id)
        if(comments === undefined)
            comments = []
        const posterName = poster.username ? poster.username : "Undefined User";
        return (
            <Box display="flex" justifyContent="center">
                <PostCard userName={posterName} postTitle={postTitle} postText={postText} imgUrl={imgUrl} timestamp={formatDate(timestamp)} id={postId} comments={comments} avatar={poster.avatar}/>
            </Box>
        );
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    function CommentCard({ text, authorId, datePosted, commentId, articleId }) {
        const [isEditMode, setIsEditMode] = useState(false);
        const [editableText, setEditableText] = useState(text);

        const registeredUsers = useSelector(state => state.registeredUsers);
        const author = registeredUsers.find(user => user._id === authorId);
        const authorName = author ? author.username : "Unknown";
        const avatarUrl = author ? author.avatar : "";
        const formattedDate = new Date(datePosted).toLocaleString();

        const toggleEditMode = () => {
            setIsEditMode(!isEditMode);
            setEditableText(text); // Reset text if edit is cancelled
        };

        const handleSave = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: editableText,
                        commentId: commentId,
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Call a function passed through props to refresh the comments
                const updatedArticle = await response.json();

                const updatedPost = {
                    author: {
                        _id: updatedArticle.articles[0].author,
                        username: profiles.username
                    },
                    _id: updatedArticle.articles[0]._id, // Assign a unique ID
                    title: updatedArticle.articles[0].title,
                    content: updatedArticle.articles[0].content,
                    image: updatedArticle.articles[0].image, // You can update this if necessary
                    datePosted: updatedArticle.articles[0].datePosted, // Add a timestamp
                    comments: updatedArticle.articles[0].comments
                };

                // Update article in Redux store
                dispatch(updateArticle(updatedPost));
                setPosts(store.getState().posts)
                localStorage.setItem('articles', JSON.stringify(store.getState().posts));

                setIsEditMode(false); // Exit edit mode
            } catch (error) {
                console.error('Error updating comment:', error);
            }
        };

        return (
            <HStack mt={1.5}>
                <Avatar name={authorName} size="sm" src={avatarUrl} background="gray" mt={1}/>
                <Text as={'b'} mb="-1">
                    {authorName}
                </Text>
                {isEditMode ? (
                    <Input
                        value={editableText}
                        onChange={(e) => setEditableText(e.target.value)}
                        size="sm"
                    />
                ) : (
                    <Text mb="-1" ml="1">
                        {text}
                    </Text>
                )}
                <Text ml="auto" color={"gray.400"} mb="-1">
                    {formattedDate}
                </Text>
                <IconButton
                    variant="ghost"
                    colorScheme="gray"
                    aria-label="Edit"
                    icon={<EditIcon />}
                    onClick={toggleEditMode}
                    isDisabled={authorName !== profiles.username}
                />
                {isEditMode && (
                    <Button size="sm" colorScheme="blue" onClick={handleSave}>
                        Save
                    </Button>
                )}
            </HStack>

        );
    }

    function PostCard({ userName, postTitle, postText, imgUrl, timestamp, id, comments, avatar}) {
        let img = imgUrl !== "" || undefined ? imgUrl : undefined;
        timestamp = timestamp === "" ? "2023/10/10" : timestamp
        const [title, setTitle] = useState(postTitle);
        const [text, setText] = useState(postText);
        const [commentText, setCommentText] = useState("");
        const [showPostError, setShowPostError] = useState(false);
        const { isOpen, onOpen, onClose } = useDisclosure()
        const {
            isOpen: isEditOpen,
            onOpen: onEditOpen,
            onClose: onEditClose
        } = useDisclosure();

        const handleUpdate = async () => {
            if (text.trim() === '') {
                setShowPostError(true);
                dispatch(updateErrors("Update content should not be empty"));
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedArticle = await response.json();

                const updatedPost = {
                    author: {
                        _id: updatedArticle.articles[0].author,
                        username: profiles.username
                    },
                    _id: updatedArticle.articles[0]._id, // Assign a unique ID
                    title: updatedArticle.articles[0].title,
                    content: updatedArticle.articles[0].content,
                    image: updatedArticle.articles[0].image, // You can update this if necessary
                    datePosted: updatedArticle.articles[0].datePosted, // Add a timestamp
                    comments: updatedArticle.articles[0].comments
                };

                // Update article in Redux store
                dispatch(updateArticle(updatedPost));
                setPosts(store.getState().posts)
                localStorage.setItem('articles', JSON.stringify(store.getState().posts));
                // Close the modal
                onEditClose();

            } catch (error) {
                console.error('Error updating article:', error);
            }
        };

        const handleCommentSubmit = async () => {
            if (commentText.trim() === '') {
                // Show some error or alert to the user
                console.log("Comment cannot be empty");
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: commentText,
                        commentId: -1, // -1 indicates a new comment
                    }),
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const updatedArticle = await response.json();
                const updatedPost = {
                    author: {
                        _id: updatedArticle.articles[0].author,
                        username: store.getState().registeredUsers.find(
                            (user) => user._id === updatedArticle.articles[0].author
                        )?.username || "Unknown User"
                    },
                    _id: updatedArticle.articles[0]._id, // Assign a unique ID
                    title: updatedArticle.articles[0].title,
                    content: updatedArticle.articles[0].content,
                    image: updatedArticle.articles[0].image, // You can update this if necessary
                    datePosted: updatedArticle.articles[0].datePosted, // Add a timestamp
                    comments: updatedArticle.articles[0].comments
                };

                // Update article in Redux store
                dispatch(updateArticle(updatedPost));
                setPosts(store.getState().posts)
                localStorage.setItem('articles', JSON.stringify(store.getState().posts));

                setCommentText(""); // Clear the input field
            } catch (error) {
                console.error('Error submitting comment:', error);
            }
        };

        return (
            <Card width="40vw">
                <CardHeader>
                    <Flex spacing="4">
                        <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                            <Avatar name={userName} src={avatar} background="blue" />
                            <Box>
                                <Heading className="postPosterName" size="sm">{userName}</Heading>
                                <Text className="postTimestamp" height="9px" color="gray">{timestamp}</Text>
                            </Box>
                        </Flex>
                        <IconButton
                            variant="ghost"
                            colorScheme="gray"
                            aria-label="See menu"
                            icon={<EditIcon />}
                            isDisabled={userName !== profiles.username}
                            onClick={onEditOpen}
                        />
                        <Modal isOpen={isEditOpen} onClose={onEditClose} size="3xl">
                            <ModalOverlay />
                            <ModalContent>
                                <ModalBody>
                                    <HStack>
                                        <Input variant='outline' placeholder='Title' size="md" isRequired={true} value={title}
                                               onChange={
                                                   (e) => {
                                                       setTitle(e.target.value);
                                                       setShowPostError(false);
                                                   }
                                               } isDisabled={true}/>
                                        <Box w="40"></Box>
                                        <ModalCloseButton />
                                    </HStack>
                                    <Box h="3"></Box>
                                    <Textarea
                                        placeholder="Tell me what you feel"
                                        resize="none"
                                        value={text}
                                        isRequired={true}
                                        onChange={(e) => {
                                            setText(e.target.value);
                                            setShowPostError(false);
                                        }}
                                    />
                                    {showPostError && (
                                        <Text className="post-error">Title or content should not be empty</Text>
                                    )}
                                </ModalBody>

                                <ModalFooter>
                                    <Box w="3"></Box>
                                    <Button colorScheme='green' onClick={handleUpdate}>Update Content</Button>

                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </Flex>
                </CardHeader>
                <CardBody className="cardBody">
                    <Heading size="md">{postTitle}</Heading>
                    <Text py="2">{postText}</Text>
                </CardBody>
                {img && (
                    <Image className="postImage"
                           objectFit="cover"
                           src={img}
                           alt="Post image"
                    />
                )}

                <CardFooter
                    justify="space-between"
                    flexWrap="wrap"
                    sx={{
                        '& > button': {
                            minW: '136px',
                        },
                    }}
                >
                    <Button flex="1" variant="ghost" onClick={onOpen} leftIcon={<ChatIcon />}>
                        Comment
                    </Button>
                    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                        <ModalOverlay />
                        <ModalContent>
                            <ModalBody>
                                <HStack>
                                    <Input
                                        variant='outline'
                                        placeholder='Comment...'
                                        size="md"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        isRequired={true}
                                    />
                                    <Button colorScheme="blue" onClick={handleCommentSubmit}>
                                        Enter
                                    </Button>
                                    <Box w="5"></Box>
                                    <ModalCloseButton/>
                                </HStack>
                                <Box h="3"></Box>
                                {comments.map(comment => (
                                    <CommentCard
                                        key={comment._id}
                                        text={comment.text}
                                        authorId={comment.author}
                                        datePosted={comment.datePosted}
                                        commentId={comment._id}
                                        articleId={id}
                                    />
                                ))}
                            </ModalBody>
                            <ModalFooter>
                                {/* Other footer content */}
                            </ModalFooter>
                        </ModalContent>
                    </Modal>

                </CardFooter>
            </Card>
        );
    }

    function ProfileCard() {
        // let profile = user
        // let name = profile ? profile.name : "Undefined User"
        let name = loginUser.name
        let catchPhrase = profiles.headline
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [selectedFile, setSelectedFile] = useState(null);
        const [statusText, setStatusText] = useState(catchPhrase);
        const [imageUrl, setImgUrl] = useState();
        const [inputStatusText, setInputStatusText] = useState();
        const [title, setTitle] = useState('');
        const [text, setText] = useState('');
        const inputRef = useRef();
        const [showPostError, setShowPostError] = useState(false);

        const addNewPost = async (title, text) => {

            if (title.trim() !== '' && text.trim() !== '') {
                try {
                    const response = await fetch(`${API_BASE_URL}/article`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include other headers as needed, such as for authentication
                        },
                        body: JSON.stringify({
                            title: title,
                            text: text,
                            image: imageUrl, // Will be an empty string if no image was uploaded
                        }),
                        credentials: 'include', // for session-based authentication
                    });


                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();

                    const newPost = {
                        author: {
                            _id: result.articles[0].author,
                            username: profiles.username
                        },
                        _id: result.articles[0].id, // Assign a unique ID
                        title: title,
                        content: text,
                        image: imageUrl, // You can update this if necessary
                        datePosted: result.articles[0].datePosted, // Add a timestamp
                    };


                    // console.log('Article posted successfully:', result);
                    setImgUrl("");
                    dispatch(fetchPosts([newPost, ...store.getState().posts]))
                    setPosts((prevPosts) => [newPost, ...prevPosts]);
                    localStorage.setItem('articles', JSON.stringify(store.getState().posts));
                    // handleClear();
                } catch (error) {
                    console.error('Error posting article:', error);
                }
            } else {
                console.log('Post creation failed. Ensure title and text are provided.');
            }
        }

        const handlePost = () => {
            if (title.trim() !== '' && text.trim() !== '') {
                // Both title and text are not empty, you can proceed with the post logic
                addNewPost(title, text)
                setShowPostError(false);
                dispatch(newPost({title: title, content: text}))
            } else {
                // Show an error message to the user or handle the empty fields as needed
                setShowPostError(true);
                dispatch(updateErrors("Title or content should not be empty"))
            }
        };

        const handleFileSelect = () => {
            inputRef.current.click();
        };

        const [isImageUploaded, setIsImageUploaded] = useState(false);
        const [isUploading, setIsUploading] = useState(false);

        const handleFileChange = async (e) => {
            const file = e.target.files[0];
            setSelectedFile(file);

            if (file) {
                // If a file is selected, upload it immediately
                setIsUploading(true);
                const formData = new FormData();
                formData.append('image', file);

                try {
                    const response = await fetch(`${API_BASE_URL}/image`, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json();
                    // console.log('Upload successful:', result);
                    setIsImageUploaded(true);
                    setImgUrl(result.url); // Assuming you have a state [imgUrl, setImgUrl] to store the URL of the uploaded image
                } catch (error) {
                    console.error('Upload error:', error);
                    setIsImageUploaded(false);
                } finally {
                    setIsUploading(false); // End loading whether upload is successful or fails
                }
            }

        };

        const handleUpload = async () => {
            if (!selectedFile) {
                console.log('No file selected for upload.');
                return null; // Return null if no file is selected
            }

            const formData = new FormData();
            formData.append('image', selectedFile);

            try {
                const response = await fetch(`${API_BASE_URL}/image`, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Upload successful:', result);

                return result.fileurl; // Assuming the URL is returned in the response
            } catch (error) {
                console.error('Upload error:', error);
                return null;
            }
        };


        const handleClear = () => {
            setSelectedFile(null);
            setTitle('');
            setText('');
            setShowPostError(false)
            dispatch(updateErrors(null))
            setIsImageUploaded(false);
        }

        const handleStatusTextDone = async () => {
            if (inputStatusText !== "") {
                setStatusText(inputStatusText);
                dispatch(updateStatus(inputStatusText))
                localStorage.setItem("status", inputStatusText);

                try {
                    const response = await fetch(`${API_BASE_URL}/headline`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            // Include any necessary authentication headers
                        },
                        body: JSON.stringify({ headline: inputStatusText }),
                        credentials: 'include', // if your API requires cookies for authentication
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const data = await response.json();
                    const newProfiles = {
                        ...profiles,
                        headline: data.headline
                    };
                    setProfiles(newProfiles);
                    localStorage.setItem('profiles', JSON.stringify(newProfiles));

                    // Handle success response
                } catch (error) {
                    console.error('Error updating headline:', error);
                    // Handle error
                }
            }
        };


        function toProfile() {
            navigate("/profile", {state: source});
        }


        return (
            <Box>
                <Card width="25vw">
                    <CardHeader mb="-5">
                        <Flex spacing="4">
                            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                                <Stack>
                                    <Avatar name={name} src={profiles.avatar} size="2xl" background="yellow" />
                                    <Box>
                                        <Heading fontSize="1.4vw" mb="-1">
                                            {profiles.username}
                                            <Text className="postTimestamp" fontSize="0.9vw" color="gray" maxW="14vw">{profiles.headline}</Text>
                                        </Heading>
                                        <Divider />
                                    </Box>
                                </Stack>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardFooter
                        justify="space-between"
                        flexWrap="wrap"
                        sx={{
                            '& > button': {
                                minW: '136px',
                            },
                        }}
                    >
                        <VStack align="flex-start">
                            <Box mt="-25px">
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        placeholder='Update Status'
                                        onChange={
                                            (e) => {
                                                setInputStatusText(e.target.value);
                                            }
                                        }
                                    />
                                    <InputRightElement width='4.5rem'>
                                        <Button
                                            h='1.75rem'
                                            size='sm'
                                            onClick={handleStatusTextDone}
                                        >
                                            Done
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                            </Box>
                            <Box>
                                <Button flex="1" variant="ghost" leftIcon={<AddIcon />} onClick={onOpen}>
                                    New Post
                                </Button>
                            </Box>
                            <Box>
                                <Button flex="1" variant="ghost" leftIcon={<SettingsIcon />} onClick={toProfile}>
                                    My Profile
                                </Button>
                                <Modal isOpen={isOpen} onClose={onClose} size="3xl">
                                    <ModalOverlay />
                                    <ModalContent>
                                        <ModalBody>
                                            <HStack>
                                                <Input variant='outline' placeholder='Title' size="md" isRequired={true} value={title}
                                                       onChange={
                                                           (e) => {
                                                               setTitle(e.target.value);
                                                               setShowPostError(false);
                                                           }
                                                       }/>
                                                <Box w="40"></Box>
                                                <ModalCloseButton onClick={handleClear}/>
                                            </HStack>
                                            <Box h="3"></Box>
                                            <Textarea
                                                placeholder="Tell me what you feel"
                                                resize="none"
                                                value={text}
                                                isRequired={true}
                                                onChange={(e) => {
                                                    setText(e.target.value);
                                                    setShowPostError(false);
                                                }}
                                            />
                                            <input
                                                type="file"
                                                accept="image/*" // Define accepted file types
                                                style={{ display: 'none' }} // Ensure the input is hidden
                                                ref={inputRef}
                                                onChange={handleFileChange}
                                            />
                                            {showPostError && (
                                                <Text className="post-error">Title or content should not be empty</Text>
                                            )}
                                        </ModalBody>

                                        <ModalFooter>
                                            <label htmlFor="fileInput">
                                                <Button
                                                    colorScheme={isImageUploaded ? 'orange' : 'blue'}
                                                    mr={3}
                                                    onClick={handleFileSelect}
                                                    isLoading={isUploading}
                                                    loadingText="Uploading"
                                                >
                                                    {isImageUploaded ? 'Reselect Image' : 'Select an Image'}
                                                </Button>
                                            </label>
                                            <Button colorScheme='red' onClick={handleClear}>Clear</Button>
                                            <Box w="3"></Box>
                                            <Button colorScheme='green' onClick={handlePost}>Post</Button>

                                        </ModalFooter>
                                    </ModalContent>
                                </Modal>
                                <Box h="3"></Box>
                                <Button flex="1" variant="ghost" leftIcon={<WarningTwoIcon />}
                                        onClick={()=> {
                                            localStorage.removeItem("user");
                                            localStorage.removeItem("posts");
                                            localStorage.removeItem("register");
                                            localStorage.removeItem("status");
                                            localStorage.removeItem("profiles");
                                            localStorage.removeItem("following");
                                            localStorage.removeItem("users");
                                            localStorage.removeItem("articles");
                                            dispatch(logoutSuccess())
                                            navigate("/");
                                        }}>
                                    Logout
                                </Button>
                            </Box>
                            {/*<Box>*/}
                            {/*    <Button flex="1" variant="ghost" leftIcon={<FcGoogle />}>*/}
                            {/*        Connect with Google*/}
                            {/*    </Button>*/}
                            {/*</Box>*/}
                        </VStack>
                    </CardFooter>
                </Card>
            </Box>
        );
    }

    function FollowCard({ registeredUsers }) {

        const [searchText, setSearchText] = useState('');
        const [filteredUsers, setFilteredUsers] = useState(registeredUsers);

        const toggleFollow = (username) => {
            if (followingUsers.includes(username)) {
                const deletFollower = async () => {
                    setFollowingUsers(followingUsers.filter(id => id !== username));
                    dispatch(updateFollow(followingUsers.filter(id => id !== username)))
                    try {
                        const response = await fetch(`${API_BASE_URL}/following/${username}`, {
                            method: 'DELETE',
                            credentials: 'include',
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        // setFollowingUsers(data.following);
                        // dispatch(updateFollow(data.following))

                        localStorage.setItem('following', JSON.stringify(data.following));
                    } catch (error) {
                        console.log(error)
                    }
                };
                deletFollower()

                // If the user is already being followed, unfollow them
                // setFollowingUsers(followingUsers.filter(name => name !== username));
                // dispatch(updateFollow(followingUsers.filter(name => name !== username)))

            } else {
                const addFollower = async () => {
                    setFollowingUsers([...followingUsers, username]);
                    dispatch(updateFollow([...followingUsers, username]))
                    try {
                        const response = await fetch(`${API_BASE_URL}/following/${username}`, {
                            method: 'PUT',
                            credentials: 'include',
                        });
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        const data = await response.json();
                        // setFollowingUsers(data.following);
                        // dispatch(updateFollow(data.following))

                        localStorage.setItem('following', JSON.stringify(data.following));
                    } catch (error) {
                        console.log(error)
                    }
                };
                addFollower()
                // If the user is not being followed, follow them
                // setFollowingUsers([...followingUsers, username]);
                // dispatch(updateFollow([...followingUsers, username]))
            }
            filterUsers(searchText);
        };

        const filterUsers = (text) => {
            const filtered = registeredUsers.filter((user) => {
                const name = user.username.toLowerCase();
                return name.includes(text.toLowerCase());
            });
            const resultsToShow = filtered.length > 0 ? [filtered[0]] : [];

            setFilteredUsers(resultsToShow);
        };

        const handleSearchTextChange = (e) => {
            const text = e.target.value;
            setSearchText(text);
            filterUsers(text);
            if (text === "")
                setFilteredUsers(registeredUsers);
        };

        const addAllUsers = () => {
            // Check if searchText is not empty before proceeding
            if (searchText.trim() !== '') {
                for (const user of filteredUsers) {
                    if (!followingUsers.includes(user.username)) {
                        const addFollower = async () => {
                            try {
                                const response = await fetch(`${API_BASE_URL}/following/${user.username}`, {
                                    method: 'PUT',
                                    credentials: 'include',
                                });
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                const data = await response.json();
                                setFollowingUsers(data.following);
                            } catch (error) {
                                console.log(error)
                            }
                        };
                        addFollower()
                        setFollowingUsers([...followingUsers, user.username]);
                        dispatch(updateFollow([...followingUsers, user.username]))
                    }
                }
            }
        };

        const handleDisableSwitch = (registerName) => {
            return profiles.username === registerName
        }

        return (
            <Box>
                <Card width="27vw">
                    <CardHeader mb="-5">
                        <Flex spacing="4">
                            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                                <Heading fontSize="1.6vw" mb="-1">
                                    Who to follow?
                                </Heading>
                                <InputGroup size='md'>
                                    <Input
                                        pr='4.5rem'
                                        placeholder='Search Name'
                                        value={searchText}
                                        onChange={handleSearchTextChange}
                                    />
                                    <InputRightElement width='4.5rem'>
                                        <Button
                                            h='1.75rem'
                                            size='sm'
                                            onClick={addAllUsers}
                                            disabled={searchText.trim() === ''}
                                        >
                                            Add
                                        </Button>
                                    </InputRightElement>
                                </InputGroup>
                                <Divider mt="-5px"/>
                                <Box height="70vh" overflowY="auto" mt="-30px">
                                    <Box h="4"></Box>
                                    <VStack align="flex-start">
                                        {filteredUsers.map((registerUser) => (
                                            <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap" key={registerUser._id}>
                                                <Switch
                                                    id={`switch-${registerUser._id}`}
                                                    size='md'
                                                    isChecked={followingUsers.includes(registerUser.username)}
                                                    isDisabled={handleDisableSwitch(registerUser.username)}
                                                    onChange={() => toggleFollow(registerUser.username)}
                                                />
                                                <HStack>
                                                <Avatar name={registerUser.username} src={registerUser.avatar} background="gray" />
                                                    <Box>
                                                        <Heading fontSize="1.2vw" mb="-1">
                                                            {registerUser.username}
                                                            <Text className="postTimestamp" fontSize="0.7vw" color="gray" maxW="14vw">
                                                                {registerUser._id === profiles.userId ? profiles.headline : registerUser.headline}
                                                            </Text>

                                                        </Heading>
                                                    </Box>
                                                </HStack>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>
                            </Flex>
                        </Flex>
                    </CardHeader>
                    <CardFooter
                        justify="space-between"
                        flexWrap="wrap"
                        sx={{
                            '& > button': {
                                minW: '136px',
                            },
                        }}
                    >
                        <VStack align="flex-start">
                        </VStack>
                    </CardFooter>
                </Card>
            </Box>
        );
    }

    const filteredPosts = store.getState().posts.filter((post) => store.getState().followingUsers.includes(post.author.username));
    const doubleFilteredPosts = filteredPosts.map((filteredPost) => {
        const poster = store.getState().registeredUsers.find((user) => user.id === filteredPost.userId);
        return {
            ...filteredPost,
            authorName: poster ? poster.name : "Undefined User",
        };
    }).filter((filteredPost) => {
        if (filterText !== "") {
            const titleMatches = filteredPost.title.toLowerCase().includes(filterText.toLowerCase());
            const bodyMatches = filteredPost.content.toLowerCase().includes(filterText.toLowerCase());
            const authorNameMatches = filteredPost.author.username.toLowerCase().includes(filterText.toLowerCase());
            return titleMatches || bodyMatches || authorNameMatches;
        }
        return true;
    }).sort((a, b) => {
        const dateA = new Date(a.datePosted);
        const dateB = new Date(b.datePosted);
        return dateB - dateA; // For descending order
    });

    dispatch(filteringPosts(doubleFilteredPosts))

    const indexOfLastArticle = currentPage * articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
    const currentArticles = store.getState().filteredPosts.slice(indexOfFirstArticle, indexOfLastArticle);

    const nextPage = () => {
        setCurrentPage(prev => prev + 1);
    };

    const prevPage = () => {
        setCurrentPage(prev => (prev === 1 ? prev : prev - 1));
    };


    return (
        <div className="background">
            <Box>
                <Flex
                    bg={"gray.200"}
                    color={"white"}
                    minH={'40px'}
                    h={50}
                    py={{ base: 2 }}
                    px={{ base: 4 }}
                    borderBottom={1}
                    borderStyle={'solid'}
                    borderColor={"gray.300"}
                    alignItems={"center"}
                    justifyItems={"center"}>
                    <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }} mb={-4} ml={3}>
                        <Text
                            ml={2}
                            fontSize="xl"
                            className="logo"
                            color={"gray.600"}>
                            RiceCooker
                        </Text>
                        <Box ml={"auto"} mr={"auto"} w='60vw'>
                        <InputGroup mt={-1}>
                            <InputLeftElement pointerEvents='none'>
                                <SearchIcon color='gray.600'/>
                            </InputLeftElement>
                            <Input
                                // mt={-1}
                                maxW="60vw"
                                pr='4.5rem'
                                background={"white"}
                                color={"black"}
                                placeholder='Filter Articles by Author or Text'
                                onChange={(e) => {
                                    setFilterText(e.target.value);
                                }}
                            />
                        </InputGroup>
                        </Box>
                        <Text
                            fontSize="xl"
                            className="logo"
                            color={"gray.600"}>
                            {"         "}
                        </Text>
                    </Flex>
                </Flex>
            </Box>
            <HStack mt={4}>
                <Stack direction={['column', 'row']} spacing="1">
                    <Box>
                        <ProfileCard/>
                    </Box>
                    <VStack>
                        <Box height="85vh" overflowY="auto" width="45vw">
                            <VStack spacing="20px">
                                {/*<PostInputArea />*/}
                                {currentArticles.map((post) => (
                                    <ResponsiveCard
                                        userName={post.author}
                                        postTitle={post.title}
                                        postText={post.content}
                                        users={store.getState().registeredUsers}
                                        imgUrl={post.image}
                                        timestamp={post.datePosted}
                                        key={post._id}
                                        postId={post._id}
                                        comments={post.comments}
                                    />
                                ))}
                            </VStack>
                        </Box>
                        <HStack>
                            <IconButton
                                variant="ghost"
                                colorScheme="gray"
                                aria-label="Previous Page"
                                icon={<ArrowLeftIcon />}
                                onClick={prevPage}
                                isDisabled={currentPage === 1}
                            />
                            <Text mt={2.5}>{currentPage}</Text>
                            <IconButton
                                variant="ghost"
                                colorScheme="gray"
                                aria-label="Next Page"
                                icon={<ArrowRightIcon />}
                                onClick={nextPage}
                                isDisabled={currentPage * articlesPerPage >= store.getState().filteredPosts.length}
                            />
                        </HStack>

                    </VStack>
                    <Box>
                        <FollowCard
                            registeredUsers={registeredUsers}
                        />
                    </Box>
                </Stack>
            </HStack>
        </div>
    );
};

const mapStateToProps = (state) => ({
    user: state.user,
    registrationData: state.registrationData,
});

export default connect(mapStateToProps)(MainPage); // Connect the component to the Redux store
