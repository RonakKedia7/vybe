import defaultProfile from "../assets/profile-other.png";
import VideoPlayer from "./VideoPlayer";
import { GoBookmarkFill, GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineBookmarkBorder, MdOutlineComment } from "react-icons/md";
import { IoSendSharp } from "react-icons/io5";
import { useUser } from "../context/userContext";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import FollowButton from "./FollowButton";

const Post = ({ post }) => {
  const { userData, navigate, backendUrl, setUserData, postData, setPostData } =
    useUser();
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");

  function timeAgo(createdAt) {
    const now = new Date();
    const date = new Date(createdAt);
    const seconds = Math.floor((now - date) / 1000);

    const intervals = [
      { label: "y", seconds: 31536000 }, // years
      { label: "mo", seconds: 2592000 }, // months
      { label: "w", seconds: 604800 }, // weeks
      { label: "d", seconds: 86400 }, // days
      { label: "h", seconds: 3600 }, // hours
      { label: "m", seconds: 60 }, // minutes
      { label: "s", seconds: 1 }, // seconds
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval}${intervals[i].label}`;
      }
    }
    return "now";
  }

  const handleLike = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/post/like/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedPost = response.data.data;

        const updatedPosts = postData.map((p) =>
          p._id === post._id ? updatedPost : p
        );
        setPostData(updatedPosts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleComment = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/post/comment/${post._id}`,
        { message },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage("");
        const updatedPost = response.data.data;

        const updatedPosts = postData.map((p) =>
          p._id === post._id ? updatedPost : p
        );
        setPostData(updatedPosts);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSaved = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/post/saved/${post._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setUserData(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-[95%] sm:w-[92%] sm:min-h-[300px] flex flex-col bg-[#030303] text-white rounded-3xl overflow-hidden shadow-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 hover:shadow-3xl">
      {/* Header */}
      <div className="flex items-center justify-between w-full p-3 md:p-6 pb-4">
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(`/profile/${post.author?.userName}`)}
            className="relative group cursor-pointer"
          >
            <div className="size-[45px] md:size-[56px] rounded-full p-0.5 bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 hover:from-gray-500 hover:via-gray-600 hover:to-gray-700 transition-all duration-300">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#030303] border-2 border-transparent">
                <img
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  src={post.author?.profileImage || defaultProfile}
                  alt="profile-image"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div
              className="font-semibold text-white text-sm md:text-base max-w-[200px] truncate hover:text-gray-200 transition-colors cursor-pointer"
              onClick={() => navigate(`/profile/${post.author?.userName}`)}
            >
              {post.author?.userName}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              {timeAgo(post.createdAt)}
            </div>
          </div>
        </div>
        {post?.author?._id !== userData._id && (
          <FollowButton
            targetUserId={post?.author?._id}
            tailwindClasses={
              "px-4 py-1 h-8 text-sm md:text-base cursor-pointer bg-[#0d0d0d] border border-[#2a2a2a] hover:bg-[#1a1a1a] hover:border-[#3a3a3a] text-white font-medium rounded-full"
            }
          />
        )}
      </div>

      {/* Media Section */}
      <div className="w-full px-6 mb-4">
        <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden bg-black/20 border border-gray-800/30">
          {post?.mediaType === "image" && (
            <img
              className="w-full max-h-[600px] object-contain hover:scale-[1.02] transition-transform duration-500"
              src={post.media}
              alt="post-media"
            />
          )}
          {post?.mediaType === "video" && (
            <div className="w-full">
              <VideoPlayer media={post.media} />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <div
            onClick={handleLike}
            className="flex items-center gap-2 cursor-pointer group"
          >
            {post.likes?.includes(userData?._id) ? (
              <GoHeartFill className="size-6 text-red-500 group-hover:scale-125 transition-transform duration-200" />
            ) : (
              <GoHeart className="size-6 text-gray-400 group-hover:text-red-500 group-hover:scale-125 transition-all duration-200" />
            )}
            <span className="font-semibold text-sm text-gray-300 group-hover:text-white transition-colors">
              {post.likes?.length || 0}
            </span>
          </div>

          <div
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <MdOutlineComment className="size-6 text-gray-400 group-hover:text-blue-400 group-hover:scale-125 transition-all duration-200" />
            <span className="font-semibold text-sm text-gray-300 group-hover:text-white transition-colors">
              {post.comments?.length || 0}
            </span>
          </div>
        </div>

        <div onClick={handleSaved} className="cursor-pointer group">
          {userData.saved?.includes(post._id) ? (
            <GoBookmarkFill className="size-6 text-gray-500 group-hover:scale-125 transition-transform duration-200" />
          ) : (
            <MdOutlineBookmarkBorder className="size-6 text-gray-400 group-hover:text-gray-500 group-hover:scale-125 transition-all duration-200" />
          )}
        </div>
      </div>

      {/* Post Caption */}
      {post.caption && (
        <div className="px-6 py-2 flex gap-3 items-start">
          <span
            className="font-semibold text-white cursor-pointer hover:text-gray-300 transition-colors flex-shrink-0"
            onClick={() => navigate(`/profile/${post.author?.userName}`)}
          >
            {post.author.userName}
          </span>
          <p className="text-gray-300 text-sm leading-relaxed break-words">
            {post.caption}
          </p>
        </div>
      )}

      {/* Comment Section */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          showComment ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Comment Input */}
        <div className="px-6 py-4 border-t border-gray-800/50">
          <div className="flex items-center gap-3 bg-[#0a0a0a] rounded-2xl p-3 border border-gray-800/30 focus-within:border-gray-700/50 transition-colors">
            <div
              onClick={() => navigate(`/profile/${userData?.userName}`)}
              className="cursor-pointer flex-shrink-0"
            >
              <div className="size-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-gray-600 transition-colors">
                <img
                  className="w-full h-full object-cover"
                  src={userData?.profileImage || defaultProfile}
                  alt="profile-image"
                />
              </div>
            </div>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a comment..."
              type="text"
              className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-500"
              onKeyPress={(e) =>
                e.key === "Enter" && message.trim() && handleComment()
              }
            />
            <button
              onClick={handleComment}
              disabled={!message.trim()}
              className={`p-2 rounded-full transition-all duration-200 ${
                message.trim()
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-110"
                  : "bg-gray-800 text-gray-500 cursor-not-allowed"
              }`}
            >
              <IoSendSharp className="size-4" />
            </button>
          </div>
        </div>

        {/* Comments List */}
        <div className="max-h-[300px] overflow-y-auto px-6 pb-4">
          <div>
            {post.comments?.map((comment, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 p-3 bg-[#0a0a0a] border border-gray-800/30 hover:border-gray-700/30 transition-colors
  ${index === 0 ? "rounded-t-xl" : ""}
  ${index === post.comments.length - 1 ? "rounded-b-xl" : ""}
`}
              >
                <div
                  onClick={() =>
                    navigate(`/profile/${comment.author.userName}`)
                  }
                  className="cursor-pointer flex-shrink-0"
                >
                  <div className="size-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-gray-600 transition-colors">
                    <img
                      className="w-full h-full object-cover"
                      src={comment.author.profileImage || defaultProfile}
                      alt="profile-image"
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="font-semibold text-sm text-white cursor-pointer hover:text-gray-300 transition-colors"
                      onClick={() =>
                        navigate(`/profile/${comment.author.userName}`)
                      }
                    >
                      {comment.author.userName}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed break-words">
                    {comment.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
