import { useRef, useEffect, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { useUser } from "../context/userContext";
import defaultProfile from "../assets/profile-other.png";
import FollowButton from "./FollowButton";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import { IoSendSharp } from "react-icons/io5";

const LoopCard = ({ loop }) => {
  const videoRef = useRef();
  const commentRef = useRef();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMute, setIsMute] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const { navigate, userData, backendUrl, loopData, setLoopData } = useUser();

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);
    setTimeout(() => {
      setShowHeart(false);
    }, 1200);

    if (!loop.likes?.includes(userData?._id)) {
      handleLike();
    }
  };

  const handleVideoClick = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying((prev) => !prev);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const percentage = (video.currentTime / video.duration) * 100;
      setProgress(percentage);
    }
  };

  const handleLike = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/loop/like/${loop._id}`,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        const updatedLoop = response.data.data;

        const updatedLoops = loopData.map((item) =>
          item._id === loop._id ? updatedLoop : item
        );
        setLoopData(updatedLoops);
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
        `${backendUrl}/api/loop/comment/${loop._id}`,
        { message },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setMessage("");
        const updatedLoop = response.data.data;

        const updatedLoops = loopData.map((item) =>
          item._id === loop._id ? updatedLoop : item
        );
        setLoopData(updatedLoops);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (commentRef.current && !commentRef.current.contains(e.target)) {
        setShowComment(false);
      }
    };

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showComment]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (video) {
          if (entry.isIntersecting) {
            video.currentTime = 0;
            setIsMute(false);
            setShowComment(false);
            video
              .play()
              .catch((error) => console.log("Video play failed:", error));
            setIsPlaying(true);
          } else {
            video.pause();
            setIsPlaying(false);
          }
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full lg:w-[600px] xl:w-[700px] h-screen flex items-center justify-center border-l border-r border-gray-900/50 relative overflow-hidden bg-black">
      {/* Enhanced Heart Animation */}
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="relative">
            {/* Main heart */}
            <GoHeartFill
              className="size-[120px] text-red-500 drop-shadow-2xl animate-ping"
              style={{
                animation:
                  "heartPulse 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
              }}
            />
            {/* Secondary hearts for extra effect */}
            <div className="absolute top-0 left-0 w-full h-full">
              <GoHeartFill
                className="size-[120px] text-red-400 opacity-70"
                style={{
                  animation:
                    "heartScale 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards",
                }}
              />
            </div>
            {/* Floating hearts */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {[...Array(6)].map((_, i) => (
                <GoHeartFill
                  key={i}
                  className={`absolute size-4 text-red-300 opacity-80`}
                  style={{
                    animation: `floatingHeart 1.5s ease-out forwards ${
                      i * 0.1
                    }s`,
                    left: `${Math.cos((i * 60 * Math.PI) / 180) * 60}px`,
                    top: `${Math.sin((i * 60 * Math.PI) / 180) * 60}px`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video with enhanced interactions */}
      <div className="relative w-full h-full group">
        <video
          onClick={handleVideoClick}
          autoPlay
          muted={isMute}
          loop
          className="w-full h-full object-cover cursor-pointer"
          ref={videoRef}
          src={loop.media}
          onTimeUpdate={handleTimeUpdate}
          onDoubleClick={handleLikeOnDoubleClick}
        />

        {/* Play/Pause overlay indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/70 backdrop-blur-sm rounded-full p-6 animate-pulse">
              <div className="w-0 h-0 border-l-[24px] border-l-white border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-2" />
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Volume Control */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsMute((prev) => !prev);
        }}
        className="absolute top-6 right-6 z-50 cursor-pointer group"
      >
        <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-full p-2 md:p-3 transition-all duration-300 hover:bg-black/90 hover:border-white/30 hover:scale-110 active:scale-95">
          {isMute ? (
            <FiVolumeX className="size-5 text-white transition-colors duration-200" />
          ) : (
            <FiVolume2 className="size-5 text-white transition-colors duration-200" />
          )}
        </div>
      </div>

      {/* Enhanced Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-500/50">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-gradient-to-r from-white via-gray-100 to-white transition-all duration-200 ease-linear shadow-md"
        />
      </div>

      {/* Enhanced Bottom Section */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-6">
        <div className="flex items-center justify-between w-full px-3 md:px-6">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Enhanced Profile Image */}
            <div
              onClick={() => navigate(`/profile/${loop.author?.userName}`)}
              className="relative group cursor-pointer"
            >
              <div className="size-[40px] md:size-[46px] rounded-full p-[2px] bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 transition-all duration-300 hover:scale-110 active:scale-95">
                <div className="w-full h-full rounded-full overflow-hidden bg-black border-2 border-transparent">
                  <img
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    src={loop.author?.profileImage || defaultProfile}
                    alt="profile-image"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced User Info */}
            <div className="flex flex-col gap-1">
              <div
                className="font-bold text-white text-base max-w-[220px] truncate hover:text-gray-200 transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => navigate(`/profile/${loop.author?.userName}`)}
              >
                {loop.author?.userName}
              </div>
              <div className="text-sm text-gray-200 leading-relaxed max-w-[220px] line-clamp-2">
                {loop.caption}
              </div>
            </div>
          </div>

          {/* Enhanced Follow Button */}
          {loop?.author?._id !== userData._id && (
            <div className="transform hover:scale-105 transition-transform duration-200">
              <FollowButton
                targetUserId={loop?.author?._id}
                tailwindClasses={
                  "px-6 py-2 h-9 text-sm md:text-base flex items-center justify-center cursor-pointer bg-black/40 border border-gray-700 hover:from-gray-700 hover:to-gray-800 hover:border-gray-600 text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Action Buttons */}
      <div className="absolute right-4 flex flex-col gap-6 text-white bottom-[30%] justify-center">
        {/* Enhanced Like Button */}
        <div
          onClick={handleLike}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="relative p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:scale-110 active:scale-95">
            {loop.likes?.includes(userData?._id) ? (
              <GoHeartFill className="size-7 text-red-500 group-hover:scale-110 transition-transform duration-200" />
            ) : (
              <GoHeart className="size-7 text-white group-hover:text-red-400 group-hover:scale-110 transition-all duration-200" />
            )}
          </div>
          <span className="font-bold text-sm text-white group-hover:text-red-400 transition-colors duration-200 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
            {loop.likes?.length || 0}
          </span>
        </div>

        {/* Enhanced Comment Button */}
        <div
          onClick={() => setShowComment((prev) => !prev)}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <div className="relative p-2 md:p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 transition-all duration-300 hover:bg-black/60 hover:border-white/20 hover:scale-110 active:scale-95">
            <MdOutlineComment className="size-7 text-white group-hover:text-blue-400 group-hover:scale-110 transition-all duration-200" />
          </div>
          <span className="font-bold text-sm text-white group-hover:text-blue-400 transition-colors duration-200 bg-black/50 px-2 py-1 rounded-full backdrop-blur-sm">
            {loop.comments?.length || 0}
          </span>
        </div>
      </div>

      {/* Enhanced Comments Section */}
      <div
        ref={commentRef}
        className={`absolute z-[200] bottom-0 w-full h-[75%] rounded-t-3xl bg-[#030303] left-0 transition-all duration-300 ease-out shadow-2xl shadow-black/80 border-t border-gray-800/50 backdrop-blur-xl ${
          showComment
            ? "translate-y-0 opacity-100"
            : "translate-y-[100%] opacity-0"
        }`}
      >
        {/* Enhanced Header */}
        <div className="relative">
          <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mt-3 mb-4" />
          <h1 className="text-white text-xl font-bold text-center mb-6 tracking-wide">
            Comments
          </h1>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)]">
          {/* Enhanced Comments List */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {loop.comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MdOutlineComment className="size-16 mb-4 opacity-50" />
                <div className="text-lg font-semibold">No Comments Yet</div>
                <div className="text-sm mt-2 opacity-80">
                  Be the first to comment!
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {loop.comments?.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-[#080808] backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 rounded-2xl hover:shadow-lg group"
                  >
                    <div
                      onClick={() =>
                        navigate(`/profile/${comment.author.userName}`)
                      }
                      className="cursor-pointer flex-shrink-0"
                    >
                      <div className="size-10 rounded-full overflow-hidden border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-110">
                        <img
                          className="w-full h-full object-cover"
                          src={comment.author.profileImage || defaultProfile}
                          alt="profile-image"
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="font-bold text-white cursor-pointer hover:text-gray-300 transition-colors duration-200 text-sm"
                          onClick={() =>
                            navigate(`/profile/${comment.author.userName}`)
                          }
                        >
                          {comment.author.userName}
                        </span>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed break-words group-hover:text-white transition-colors duration-200">
                        {comment.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced Comment Input */}
          <div className="p-4 border-t border-[#080808] mb-5">
            <div className="flex items-center gap-3 bg-[#0e0e0e] rounded-2xl p-3 border border-gray-700/50 focus-within:border-gray-600/70 focus-within:shadow-lg transition-all duration-300">
              <div
                onClick={() => navigate(`/profile/${userData?.userName}`)}
                className="cursor-pointer flex-shrink-0"
              >
                <div className="size-9 rounded-full overflow-hidden border-2 border-gray-600 hover:border-gray-500 transition-all duration-300 hover:scale-110">
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
                className="flex-1 bg-transparent outline-none text-white text-sm placeholder-gray-400 font-medium"
                onKeyPress={(e) =>
                  e.key === "Enter" && message.trim() && handleComment()
                }
              />
              <button
                onClick={handleComment}
                disabled={!message.trim()}
                className={`p-2.5 rounded-full transition-all duration-300 ${
                  message.trim()
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white hover:scale-110 active:scale-95 shadow-lg hover:shadow-blue-500/25"
                    : "bg-gray-700 text-gray-400 cursor-not-allowed"
                }`}
              >
                <IoSendSharp className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoopCard;
