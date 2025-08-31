import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { io } from "socket.io-client";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [postData, setPostData] = useState([]);
  const [loopData, setLoopData] = useState([]);
  const [storyData, setStoryData] = useState([]); // actual story objects
  const [followingUsers, setFollowingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storyList, setStoryList] = useState([]); // for fetched story list
  const [prevChatUsers, setPrevChatUsers] = useState(null);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  // 🔹 Error handler
  const handleError = (error) => {
    console.error(error);
    toast.error(
      error.response?.data?.message || error.message || "Something went wrong"
    );
  };

  // API calls
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/current`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getAllPosts = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/post/getAll`, {
        withCredentials: true,
      });
      if (data.success) {
        setPostData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getAllLoops = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/loop/getAll`, {
        withCredentials: true,
      });
      if (data.success) {
        setLoopData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const getAllStories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/story/getAll`, {
        withCredentials: true,
      });
      if (data.success) {
        setStoryList(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const fetchFollowingUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/getFollowing`, {
        withCredentials: true,
      });
      if (data.success) {
        setFollowingUsers(data.following);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setUserData(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchPrevChatUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/message/prevChats`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPrevChatUsers(response.data.previousUsers);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  /* ---------------------- USE EFFECTS ---------------------- */

  // ✅ Initial load: fetch everything once
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUser(),
        getAllPosts(),
        getAllLoops(),
        getAllStories(),
        fetchFollowingUsers(),
        fetchPrevChatUsers(),
      ]);
      setLoading(false);
    };
    fetchInitialData();
  }, []); // only runs on mount

  // ✅ Whenever user logs in/out → refresh posts & following list
  useEffect(() => {
    if (userData) {
      getAllPosts();
      fetchFollowingUsers();
    }
  }, [userData]);

  // ✅ Whenever stories change locally → refresh story list from backend
  useEffect(() => {
    getAllStories();
  }, [storyData, followingUsers]);

  const value = {
    userData,
    setUserData,
    navigate,
    backendUrl,
    loading,
    setLoading,
    handleLogOut,
    profileData,
    setProfileData,
    postData,
    setPostData,
    loopData,
    setLoopData,
    storyData,
    setStoryData,
    followingUsers,
    setFollowingUsers,
    storyList,
    prevChatUsers,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);
