import logoWhite from "../assets/logo-white.png";
import { FaRegHeart } from "react-icons/fa";
import StoryCard from "./StoryCard";
import Navbar from "./Navbar";
import { useUser } from "../context/userContext";
import Post from "./Post";
import { BiMessageAltDetail } from "react-icons/bi";

const Feed = () => {
  const { postData, userData, storyList, navigate } = useUser();

  return (
    <div className="w-full lg:w-[50%] bg-black min-h-[100vh] lg:h-[100vh] relative lg:overflow-y-auto">
      <div className="w-full h-[100px] flex lg:hidden items-center justify-between px-3 sm:px-5">
        <img className="w-[80px]" src={logoWhite} alt="logo" />
        <div className="flex items-center gap-2">
          <FaRegHeart className="text-white size-[20px]" />
          <BiMessageAltDetail
            onClick={() => navigate("/messages")}
            className="text-white size-[25px]"
          />
        </div>
      </div>

      <div className="flex w-full overflow-x-auto no-scrollbar gap-4 items-center p-5 lg:p-7">
        <StoryCard
          userName={"Your Story"}
          profileImage={userData?.profileImage}
          story={userData?.story}
        />

        {storyList?.map((story, index) => (
          <StoryCard
            key={index}
            userName={story.author.userName}
            profileImage={story.author?.profileImage}
            story={story}
          />
        ))}
      </div>

      <div className="w-full border-t border-gray-900 min-h-screen flex flex-col items-center gap-5 p-2 pt-10 bg-[#020202] rounded-t-[60px] relative pb-[120px]">
        <Navbar />
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
