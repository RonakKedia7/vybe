import logoWhite from "../assets/logo-white.png";
import { FaRegHeart } from "react-icons/fa";
import defaultProfile from "../assets/profile-other.png";
import { useUser } from "./../context/userContext";
import axios from "axios";
import OtherUser from "./OtherUser";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const LeftHome = () => {
  const { userData, navigate, handleLogOut, backendUrl } = useUser();
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const getSuggestedUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/suggested`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setSuggestedUsers(response.data.users);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      getSuggestedUsers();
    }
  }, [userData]);

  return (
    <div className="w-[25%] hidden lg:block min-h-[100vh] bg-black border-r border-gray-900 p-[20px]">
      <div className="w-full h-[100px] flex items-center justify-between">
        <img className="w-[80px]" src={logoWhite} alt="logo" />
        <div>
          <FaRegHeart className="text-white size-[25px]" />
        </div>
      </div>

      <div className="flex items-center justify-between w-full border-b py-2 border-b-gray-900">
        <div className="flex items-center gap-[10px]">
          <div
            onClick={() => navigate(`/profile/${userData.userName}`)}
            className="size-[60px] border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden"
          >
            <img
              className="w-full object-cover"
              src={userData.profileImage || defaultProfile}
              alt="profile-image"
            />
          </div>
          <div>
            <div className="text-[18px] text-white font-semibold">
              {userData.userName}
            </div>
            <div className="text-[15px] text-gray-400 font-semibold">
              {userData.name}
            </div>
          </div>
        </div>
        <div
          onClick={handleLogOut}
          className="text-blue-500 hover:text-blue-600 font-semibold cursor-pointer"
        >
          Logout
        </div>
      </div>

      <div className="w-full flex flex-col mt-5 gap-1">
        <h1 className="text-white text-xl">Suggested Users</h1>
        {suggestedUsers &&
          suggestedUsers.map((user) => (
            <OtherUser user={user} key={user._id} />
          ))}
      </div>
    </div>
  );
};

export default LeftHome;
