import { toast } from "react-toastify";
import { useUser } from "../context/userContext";
import axios from "axios";

const FollowButton = ({ targetUserId, tailwindClasses, onFollowChange }) => {
  const { followingUsers, setFollowingUsers, backendUrl } = useUser();

  const toggleFollow = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        if (response.data.following) {
          // Now following — add user
          setFollowingUsers((prev) =>
            prev.includes(targetUserId) ? prev : [targetUserId, ...prev]
          );
        } else {
          // Now not following — remove user
          setFollowingUsers((prev) => prev.filter((id) => id !== targetUserId));
        }
      } else {
        toast.error(response.data.message);
      }

      if (onFollowChange) onFollowChange();
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <button onClick={toggleFollow} className={tailwindClasses}>
      {followingUsers.includes(targetUserId) ? "Following" : "Follow"}
    </button>
  );
};

export default FollowButton;
