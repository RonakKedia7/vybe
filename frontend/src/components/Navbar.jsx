import { GoHomeFill } from "react-icons/go";
import { FiPlusSquare, FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import defaultProfile from "../assets/profile-other.png";
import { useUser } from "../context/userContext";

const Navbar = () => {
  const { navigate, userData } = useUser();

  return (
    <div className="w-[90%] sm:w-[80%] lg:w-[40%] h-15 bg-black text-white flex justify-around items-center fixed bottom-5 rounded-full z-100">
      <div onClick={() => navigate("/")}>
        <GoHomeFill className="size-8 hover:text-gray-300 cursor-pointer" />
      </div>
      <div onClick={() => navigate("/search")}>
        <FiSearch className="size-8 hover:text-gray-300 cursor-pointer" />
      </div>
      <div onClick={() => navigate("/upload")}>
        <FiPlusSquare className="size-8 hover:text-gray-300 cursor-pointer" />
      </div>
      <div onClick={() => navigate("/loops")}>
        <RxVideo className="size-8 hover:text-gray-300 cursor-pointer" />
      </div>
      <div
        onClick={() => navigate(`/profile/${userData.userName}`)}
        className="size-10 border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden"
      >
        <img
          className="w-full object-cover"
          src={userData.profileImage || defaultProfile}
          alt="profile-image"
        />
      </div>
    </div>
  );
};

export default Navbar;
