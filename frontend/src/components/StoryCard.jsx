import defaultProfile from "../assets/profile-other.png";
import { FiPlusCircle } from "react-icons/fi";
import { useUser } from "../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const StoryCard = ({ profileImage, userName, story }) => {
  const { navigate, userData, backendUrl } = useUser();

  const handleViewers = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/story/view/${story._id}`,
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleClick = () => {
    if (userName === "Your Story") {
      if (story) {
        handleViewers();
        navigate(`/story/${userData.userName}`);
      } else {
        navigate("/upload");
      }
    } else {
      handleViewers();
      navigate(`/story/${userName}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex w-20 sm:w-28 flex-col shrink-0 items-center justify-center cursor-pointer"
    >
      <div
        className={`p-[2px] rounded-full relative ${
          userName === "Your Story"
            ? story
              ? "bg-gradient-to-tr from-[#f9d423] via-[#ff4e50] to-[#f12711]" // special colorful gradient
              : "bg-gradient-to-tr from-gray-400 via-gray-300 to-gray-400" // special gray gradient for no story
            : story
            ? "bg-gradient-to-tr from-blue-400 via-purple-400 to-blue-600" // others with story
            : "bg-gray-600" // others without story
        }`}
      >
        <div className="p-[2px] rounded-full bg-gray-950">
          <img
            className="size-16 sm:size-23 rounded-full object-cover transition-transform duration-200 ease-in-out group-hover:scale-105"
            src={profileImage || defaultProfile}
            alt="profile-image"
          />
        </div>
        {!story && userName === "Your Story" && (
          <div>
            <FiPlusCircle className="text-white absolute bottom-1 right-2 bg-black/60 rounded-full size-7" />
          </div>
        )}
      </div>
      <div className="text-sm mt-1 text-center truncate w-full text-gray-400">
        {userName}
      </div>
    </div>
  );
};

export default StoryCard;
