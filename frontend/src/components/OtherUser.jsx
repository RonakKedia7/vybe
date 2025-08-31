import defaultProfile from "../assets/profile-other.png";
import { useUser } from "../context/userContext";
import FollowButton from "./FollowButton";

const OtherUser = ({ user }) => {
  const { navigate } = useUser();

  return (
    <div className="w-full h-20 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-[10px]">
        <div
          onClick={() => navigate(`/profile/${user.userName}`)}
          className="size-[50px] border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden"
        >
          <img
            className="w-full object-cover"
            src={user.profileImage || defaultProfile}
            alt="profile-image"
          />
        </div>
        <div>
          <div className="text-[18px] text-white font-semibold">
            {user.userName}
          </div>
          <div className="text-[15px] text-gray-400 font-semibold">
            {user.name}
          </div>
        </div>
      </div>
      <FollowButton
        targetUserId={user._id}
        tailwindClasses={
          "px-4 py-1 h-8 cursor-pointer bg-[#0d0d0d] border border-[#2a2a2a] hover:bg-[#1a1a1a] hover:border-[#3a3a3a] text-white font-medium rounded-full"
        }
      />
    </div>
  );
};

export default OtherUser;
