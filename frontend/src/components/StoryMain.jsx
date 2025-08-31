import { ArrowLeft } from "lucide-react";
import defaultProfile from "../assets/profile-other.png";
import { useUser } from "../context/userContext";
import VideoPlayer from "./VideoPlayer";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa6";

const StoryMain = ({ storyData }) => {
  const { navigate, userData } = useUser();
  const [progress, setProgress] = useState(0);
  const [showViewersModal, setShowViewersModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 0.67; // 15 seconds total
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleViewersClick = () => {
    setShowViewersModal(true);
  };

  const closeViewersModal = () => {
    setShowViewersModal(false);
  };

  return (
    <div className="w-full max-w-[600px] h-screen bg-black relative flex flex-col justify-center overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-2 left-0 right-0 h-1 bg-gray-800 z-50">
        <div
          style={{ width: `${progress}%` }}
          className="h-full bg-white transition-all duration-100 ease-linear"
        />
      </div>

      {/* Top Navigation */}
      <div className="flex items-center gap-4 absolute top-6 left-4 right-4 z-40">
        <button
          onClick={() => navigate("/")}
          className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-gray-600 hover:bg-black/70 hover:border-gray-500 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div
          onClick={() => navigate(`/profile/${storyData.author?.userName}`)}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-br from-gray-400 to-gray-600">
            <div className="w-full h-full rounded-full overflow-hidden bg-black">
              <img
                className="w-full h-full object-cover"
                src={storyData.author?.profileImage || defaultProfile}
                alt="profile"
              />
            </div>
          </div>
          <div className="font-medium text-white text-sm">
            {storyData.author?.userName}
          </div>
        </div>
      </div>

      {/* Media Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-full max-h-[100vh] rounded-lg overflow-hidden">
          {storyData?.mediaType === "image" && (
            <img
              className="w-full h-full object-contain"
              src={storyData.media}
              alt="story"
            />
          )}
          {storyData?.mediaType === "video" && (
            <VideoPlayer media={storyData.media} type="Story" />
          )}
        </div>
      </div>

      {storyData?.author?.userName === userData?.userName && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 pb-8">
          {/* Viewer Count */}
          <div className="flex items-center gap-2 mb-1 cursor-pointer rounded-lg p-2 transition-all duration-200">
            <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
              <FaEye className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-medium text-sm">
              {storyData?.viewers?.length} view
              {storyData?.viewers?.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Viewer Avatars */}
          {storyData?.viewers && storyData.viewers.length > 0 && (
            <div
              className="flex items-center cursor-pointer rounded-lg p-2 transition-all duration-200"
              onClick={handleViewersClick}
            >
              <div className="flex -space-x-2">
                {storyData.viewers.slice(0, 3).map((user, index) => (
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

              {storyData.viewers.length > 3 && (
                <div className="ml-3 text-white/70 text-sm font-medium">
                  +{storyData.viewers.length - 3} more
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Viewers Modal */}
      {showViewersModal && (
        <div className="z-50 inset-0">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={closeViewersModal}
          />

          {/* Modal */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#020202] rounded-t-xl animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-900">
              <h2 className="text-white text-lg font-semibold">
                Viewers ({storyData?.viewers?.length || 0})
              </h2>
              <button
                onClick={closeViewersModal}
                className="p-2 rounded-full bg-[#040404] hover:bg-[#080808] transition-colors duration-200"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Viewers List */}
            <div className="max-h-96 overflow-y-auto">
              {storyData?.viewers && storyData.viewers.length > 0 ? (
                <div className="p-4">
                  {storyData.viewers.map((viewer, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 cursor-pointer 
              border-x border-[#0a0a0a] 
              bg-[#030303] text-gray-300
              hover:bg-[#0a0a0a] hover:text-white
              transition-all duration-200
              ${index === 0 ? "rounded-t-xl border-t" : ""} 
              ${
                index === storyData.viewers.length - 1
                  ? "rounded-b-xl border-b"
                  : ""
              }`}
                      onClick={() => {
                        navigate(`/profile/${viewer.userName}`);
                        closeViewersModal();
                      }}
                    >
                      <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-blue-400 to-purple-500">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800">
                          <img
                            className="w-full h-full object-cover"
                            src={viewer?.profileImage || defaultProfile}
                            alt={viewer?.userName}
                          />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm">
                          {viewer?.userName}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {viewer?.name || "User"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <div className="text-gray-400 text-sm">No viewers yet</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StoryMain;
