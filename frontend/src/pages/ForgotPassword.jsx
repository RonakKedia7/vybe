import { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import axios from "axios";
import { MdErrorOutline } from "react-icons/md";
import { useUser } from "../context/userContext";
import { IoMdArrowBack } from "react-icons/io";

const ForgotPassword = () => {
  const [step, setStep] = useState("sendOtp");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputClicked, setInputClicked] = useState({
    email: false,
    otp: false,
    newPassword: false,
    confirmNewPassword: false,
  });

  const { navigate, backendUrl } = useUser();

  const addError = (message) => {
    if (error) return;
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/sendOtp`,
        {
          email,
        },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.data.success) {
        setStep("verifyOtp");
        setError("");
      } else {
        addError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      addError(error.message);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/auth/verifyOtp`,
        {
          email,
          otp,
        },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.data.success) {
        setStep("resetPassword");
        setError("");
      } else {
        addError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      addError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (newPassword !== confirmNewPassword) {
        addError("Passwords do not match. Enter correctly");
        setLoading(false);
        return;
      }
      const response = await axios.post(
        `${backendUrl}/api/auth/resetPassword`,
        {
          email,
          password: newPassword,
        },
        { withCredentials: true }
      );
      setLoading(false);
      if (response.data.success) {
        navigate("/signin");
        setError("");
      } else {
        addError(response.data.message);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      addError(error.message);
    }
  };

  useEffect(() => {
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmNewPassword("");
    setStep("sendOtp");
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-b from-black to-gray-950 flex flex-col justify-center items-center">
      <button
        onClick={() => navigate(-1)}
        className="absolute left-10 top-10 text-white hover:text-gray-300 transition-colors duration-200 flex items-center gap-2"
        aria-label="Go Back"
      >
        <IoMdArrowBack size={28} />
        <span className="hidden sm:inline text-sm font-medium">Back</span>
      </button>
      {step === "sendOtp" && (
        <form
          onSubmit={handleSendOtp}
          className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]"
        >
          <h2 className="text-[35px] w-[80%] font-semibold">
            Forgot Password -----
          </h2>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, email: true }))
            }
            className="relative mt-[50px] mb-[20px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="email"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.email || email) && "top-[-19px]"
              }`}
            >
              Enter email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="email"
              id="email"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 mx-3 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center shadow-sm mt-2 animate-fade-in">
              <MdErrorOutline className="text-red-500 text-lg" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Send OTP"}
          </button>
        </form>
      )}

      {step === "verifyOtp" && (
        <form
          onSubmit={handleVerifyOtp}
          className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]"
        >
          <h2 className="text-[35px] w-[80%] font-semibold">Enter OTP -----</h2>
          <div
            onClick={() => setInputClicked((prev) => ({ ...prev, otp: true }))}
            className="relative mt-[50px] mb-[20px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="otp"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.otp || otp) && "top-[-19px]"
              }`}
            >
              Enter OTP
            </label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="text"
              id="otp"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 mx-3 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center shadow-sm mt-2 animate-fade-in">
              <MdErrorOutline className="text-red-500 text-lg" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? <ClipLoader size={30} color="white" /> : "Submit"}
          </button>
        </form>
      )}

      {step === "resetPassword" && (
        <form
          onSubmit={handleResetPassword}
          className="w-[90%] max-w-[500px] h-[500px] bg-white rounded-2xl flex justify-center items-center flex-col border-[#1a1f23]"
        >
          <h2 className="text-[35px] w-[80%] font-semibold">
            Reset Password -----
          </h2>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, newPassword: true }))
            }
            className="relative mt-[50px] mb-[20px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="newPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.newPassword || newPassword) && "top-[-19px]"
              }`}
            >
              Enter new password
            </label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="password"
              id="newPassword"
            />
          </div>
          <div
            onClick={() =>
              setInputClicked((prev) => ({ ...prev, confirmNewPassword: true }))
            }
            className="relative mb-[20px] flex items-center justify-start w-[90%] h-[50px] rounded-2xl border-2 border-black"
          >
            <label
              htmlFor="confirmNewPassword"
              className={`text-gray-700 absolute left-[20px] p-[5px] bg-white text-[15px] ${
                (inputClicked.confirmNewPassword || confirmNewPassword) &&
                "top-[-19px]"
              }`}
            >
              Confirm new password
            </label>
            <input
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="w-[100%] h-[100%] rounded-2xl px-[20px] outline-none border-0"
              type="password"
              id="confirmNewPassword"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 mx-3 px-4 py-2 rounded-lg text-sm flex items-center gap-2 justify-center shadow-sm mt-2 animate-fade-in">
              <MdErrorOutline className="text-red-500 text-lg" />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            className="w-[70%] px-[20px] py-[10px] bg-black text-white font-semibold h-[50px] cursor-pointer rounded-2xl mt-[30px]"
          >
            {loading ? (
              <ClipLoader size={30} color="white" />
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPassword;
