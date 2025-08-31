import { IoMdArrowBack } from "react-icons/io";
import { useUser } from "../context/userContext";
import defaultProfile from "../assets/profile-other.png";
import { ClipLoader } from "react-spinners";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { navigate, userData, setUserData, backendUrl, setProfileData } =
    useUser();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(userData?.profileImage || defaultProfile);
  const [backendImage, setBackendImage] = useState(null);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    userName: userData?.userName || "",
    bio: userData?.bio || "",
    profession: userData?.profession || "",
    gender: userData?.gender || "",
  });
  const imageInput = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Optional: Validate image type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setBackendImage(file); // Store file for backend
    setImage(URL.createObjectURL(file)); // Show preview
  };

  const handleEditProfile = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("userName", formData.userName.trim());
      data.append("bio", formData.bio.trim());
      data.append("profession", formData.profession.trim());
      data.append("gender", formData.gender.trim());

      // Only append profileImage if the user selected a new file
      if (backendImage instanceof File) {
        data.append("profileImage", backendImage);
      }

      const response = await axios.post(
        `${backendUrl}/api/user/editProfile`,
        data,
        { withCredentials: true }
      );

      if (response.data.success) {
        setProfileData(response.data.user);
        setUserData(response.data.user);
        navigate(`/profile/${response.data.user.userName}`);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(response.error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || "",
        userName: userData.userName || "",
        bio: userData.bio || "",
        profession: userData.profession || "",
        gender: userData.gender || "",
      });
      setImage(userData.profileImage || defaultProfile);
      setBackendImage(null); // Reset backendImage to null to avoid overwriting
    }
  }, [userData]);

  return (
    <div className="w-full min-h-screen bg-black text-white flex items-center flex-col gap-5 pb-10">
      {/* Header */}
      <div className="w-full h-20 fixed left-2 sm:left-5 flex items-center gap-3 sm:gap-5 px-3 sm:px-5 bg-black z-10">
        <IoMdArrowBack
          onClick={() => navigate(`/profile/${userData.userName}`)}
          className="cursor-pointer size-6 lg:size-8 hover:text-gray-300"
        />
        <h1 className="text-xl font-semibold">Edit Profile</h1>
      </div>

      {/* Profile Image */}
      <div
        onClick={() => imageInput.current.click()}
        className="size-25 mt-20 sm:mt-24 lg:size-35 border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden hover:opacity-90 transition"
      >
        <input
          type="file"
          onChange={handleImage}
          accept="image/*"
          ref={imageInput}
          hidden
        />
        <img className="w-full h-full object-cover" src={image} alt="profile" />
      </div>

      <div
        onClick={() => imageInput.current.click()}
        className="text-blue-500 hover:text-blue-400 text-center text-[18px] cursor-pointer"
      >
        Change Your Profile Picture
      </div>

      {/* Inputs */}
      {["name", "userName", "bio", "profession", "gender"].map((field) => (
        <input
          key={field}
          value={formData[field]}
          onChange={handleInputChange}
          name={field}
          type="text"
          className="w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border border-gray-700 rounded-2xl text-xl outline-none px-5"
          placeholder={`Enter your ${field}`}
          autoComplete="off"
        />
      ))}

      {/* Save Button */}
      <button
        onClick={handleEditProfile}
        disabled={loading}
        className={`px-4 flex items-center justify-center mt-5 h-10 min-w-[150px] py-2 bg-gray-300 hover:bg-gray-400 transition rounded-xl text-black font-semibold ${
          loading && "opacity-75 cursor-not-allowed"
        }`}
      >
        {loading ? <ClipLoader size={30} color="black" /> : "Save Profile"}
      </button>
    </div>
  );
};

export default EditProfile;
