import { useEffect, useState } from "react";
import { useUser } from "../context/userContext";
import axios from "axios";
import defaultProfile from "../assets/profile-other.png";
import { useParams } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";
import Navbar from "./../components/Navbar";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";

const Profile = () => {
  const {
    backendUrl,
    navigate,
    handleLogOut,
    userData,
    profileData,
    setProfileData,
    postData,
  } = useUser();
  const { userName } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [postsType, setPostsType] = useState("All");

  const getProfileData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${backendUrl}/api/user/getProfile/${userName}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setProfileData(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [userName]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <ClipLoader size={30} color="black" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black text-white">
      <div className="w-full h-20 flex items-center justify-between px-7 border-b border-gray-900">
        <div onClick={() => navigate("/")}>
          <IoMdArrowBack className="cursor-pointer size-6 hover:text-gray-300" />
        </div>
        <div className="font-semibold text-xl">{profileData?.userName}</div>
        {userData?._id === profileData?._id ? (
          <div
            onClick={handleLogOut}
            className="font-semibold cursor-pointer text-xl text-blue-500 hover:text-blue-600"
          >
            Logout
          </div>
        ) : (
          <div></div>
        )}
      </div>

      <div className="w-full h-37 flex items-center justify-center gap-5 lg:gap-12 pt-5">
        <div className="size-25 lg:size-35 border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden">
          <img
            className="w-full object-cover"
            src={profileData?.profileImage || defaultProfile}
            alt="profile-image"
          />
        </div>
        <div>
          <div className="font-semibold text-xl">{profileData?.name}</div>
          <div className="text-sm text-gray-300">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-base text-gray-300">
            {profileData?.bio || ""}
          </div>
        </div>
      </div>

      <div className="w-full text-white h-25 flex items-center justify-center gap-10 md:gap-15 px-[20%] pt-7">
        <div className="flex items-center justify-center flex-col">
          <div className="text-[22px] md:text-[30px] font-semibold">
            {profileData?.posts?.length}
          </div>
          <div className="text-[12px] md:text-[16px] text-gray-300">posts</div>
        </div>
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center gap-1">
            <div className="flex -space-x-5">
              {profileData?.followers.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ zIndex: 10 - index }}
                >
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                      <img
                        className="w-full h-full object-cover"
                        src={user?.profileImage || defaultProfile}
                        alt={`Viewer ${index + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[22px] md:text-[30px] ml-1 font-semibold">
              {profileData?.followers?.length}
            </div>
          </div>
          <div className="text-[12px] md:text-[16px] text-gray-300">
            followers
          </div>
        </div>

        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center gap-1">
            <div className="flex -space-x-5">
              {profileData?.following.slice(0, 3).map((user, index) => (
                <div
                  key={index}
                  className="relative"
                  style={{ zIndex: 10 - index }}
                >
                  <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-sm">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                      <img
                        className="w-full h-full object-cover"
                        src={user?.profileImage || defaultProfile}
                        alt={`Viewer ${index + 1}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[22px] md:text-[30px] ml-1 font-semibold">
              {profileData?.following?.length}
            </div>
          </div>
          <div className="text-[12px] md:text-[16px] text-gray-300">
            following
          </div>
        </div>
      </div>

      <div className="w-full mt-2 h-20 flex justify-center items-center gap-5">
        {userData?._id === profileData?._id ? (
          <button
            onClick={() => navigate("/editprofile")}
            className="px-4 min-w-[150px] py-2 bg-gray-300 hover:bg-gray-400 transition rounded-xl text-black font-semibold"
          >
            Edit Profile
          </button>
        ) : (
          <>
            <FollowButton
              onFollowChange={getProfileData}
              tailwindClasses={
                "px-4 min-w-[150px] py-2 bg-blue-500 hover:bg-blue-600 transition rounded-xl text-white font-semibold"
              }
              targetUserId={profileData?._id}
            />
            <button
              onClick={() => {
                navigate(`/message/${profileData._id}`);
              }}
              className="px-4 min-w-[150px] py-2 bg-gray-300 hover:bg-gray-400 transition rounded-xl text-black font-semibold"
            >
              Message
            </button>
          </>
        )}
      </div>

      {/* User Posts */}
      <div className="w-full min-h-screen flex justify-center">
        <div className="w-full max-w-[900px] flex flex-col items-center rounded-t-[30px] bg-[#020202] relative gap-5 pt-7 pb-[100px]">
          <Navbar />

          {/* Upload Type Tabs */}
          {userData._id === profileData?._id && (
            <div className="w-[60%] max-w-[400px] bg-[#020202] border border-gray-700 rounded-full flex justify-between items-center gap-[10px] h-14 px-5 sm:px-10">
              {["All", "Saved"].map((item, index) => (
                <div
                  key={index}
                  onClick={() => setPostsType(item)}
                  className={`flex justify-center items-center text-[19px] px-3 py-1 rounded-full cursor-pointer ${
                    postsType === item
                      ? "bg-black border border-gray-600"
                      : "hover:bg-[#030303] hover:border hover:border-gray-950"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          )}

          {postsType === "All" &&
            (() => {
              const filteredPosts = postData.filter(
                (post) => post?.author?._id === profileData?._id
              );
              return filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <Post key={post._id} post={post} />)
              ) : (
                <div className="text-gray-400 text-center mt-5">No posts</div>
              );
            })()}

          {postsType === "Saved" &&
            (() => {
              const filteredPosts = postData.filter((post) =>
                userData.saved.includes(post._id)
              );
              return filteredPosts.length > 0 ? (
                filteredPosts.map((post) => <Post key={post._id} post={post} />)
              ) : (
                <div className="text-gray-400 text-center mt-5">
                  No saved posts
                </div>
              );
            })()}
        </div>
      </div>
    </div>
  );
};

export default Profile;
