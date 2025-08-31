import { useState } from "react";
import logoBlack from "../assets/logo-black.png";
import logoWhite from "../assets/logo-white.png";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { MdErrorOutline } from "react-icons/md";
import { useUser } from "../context/userContext";

const SignUp = () => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    userName: "",
    email: "",
    password: "",
  });
  const [inputClicked, setInputClicked] = useState({
    name: false,
    userName: false,
    email: false,
    password: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { navigate, setUserData, backendUrl } = useUser();

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormDetails((prev) => ({ ...prev, [id]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/signup`,
        formDetails,
        { withCredentials: true }
      );
      setLoading(false);
      if (response.data.success) {
        setError("");
        setUserData(response.data.user);
      } else {
        setError(response.data.message);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(error.message);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-950 flex flex-col justify-center items-center">
      <div className="w-[90%] md:max-w-[65%] lg:max-w-[60%] h-[600px] bg-white rounded-2xl flex justify-center items-center overflow-hidden border-2 border-[#1a1f23]">
        <form
          onSubmit={onSubmitHandler}
          className="w-full lg:w-[50%] h-full bg-white flex flex-col items-center p-[10px] gap-[22px]"
        >
          <div className="flex gap-[10px] items-center text-[20px] font-semibold mt-[40px]">
            <span>Sign Up to</span>
            <img className="w-[70px]" src={logoBlack} alt="logo" />
          </div>

          <div
            onClick={() => setInputClicked((prev) => ({ ...prev, name: true }))}
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl mt-[30px] border-2 border-black"
          >
            <label
              htmlFor="name"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.name || formDetails.name) && "top-[-19px]"
              }`}
            >
              Enter Your Name
            </label>
            <input
              value={formDetails.name}
              onChange={handleFormChange}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="text"
              id="name"
            />
          </div>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, userName: true }))
            }
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="userName"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.userName || formDetails.userName) && "top-[-19px]"
              }`}
            >
              Enter Username
            </label>
            <input
              value={formDetails.userName}
              onChange={handleFormChange}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="text"
              id="userName"
              autoComplete="off"
            />
          </div>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, email: true }))
            }
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.email || formDetails.email) && "top-[-19px]"
              }`}
            >
              Enter Email
            </label>
            <input
              value={formDetails.email}
              onChange={handleFormChange}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="email"
              id="email"
            />
          </div>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, password: true }))
            }
            className="relative flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="password"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.password || formDetails.password) && "top-[-19px]"
              }`}
            >
              Enter Password
            </label>
            <input
              value={formDetails.password}
              onChange={handleFormChange}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="off"
            />
            {showPassword ? (
              <IoIosEyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-[20px] size-[25px] lg:size-[20px]"
              />
            ) : (
              <IoIosEye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-[20px] size-[25px] lg:size-[20px]"
              />
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center shadow-sm mt-2 animate-fade-in">
              <MdErrorOutline className="text-red-500 text-lg" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Sign Up"}
          </button>
          <p
            onClick={() => navigate("/signin")}
            className="cursor-pointer text-gray-800"
          >
            Already have an account?{" "}
            <span className="hover:underline underline-offset-4 pb-[3px] text-black font-medium">
              Sign In
            </span>
          </p>
        </form>
        <div className="md:w-[50%] h-full hidden lg:flex justify-center items-center bg-[#000000] flex-col gap-[10px] text-white text-[16px] font-semibold rounded-l-[30px] shadow-2xl shadow-black">
          <img src={logoWhite} alt="logo" className="w-[40%]" />
          <p className="text-lg">Not Just a Platform, It's a Vybe</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
