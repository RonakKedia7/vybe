import { useUser } from "../context/userContext";
import { IoMdArrowBack, IoMdSend } from "react-icons/io";
import defaultProfile from "../assets/profile-other.png";
import { LuImage } from "react-icons/lu";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import SenderMessage from "../components/SenderMessage";
import ReceiverMessage from "../components/ReceiverMessage";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

const MessageArea = () => {
  const { navigate, backendUrl, userData } = useUser();
  const { receiverId } = useParams();
  const [input, setInput] = useState("");
  const imageInput = useRef();
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const getChatUser = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/user/get/${receiverId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setChatUser(response.data.user);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getAllMessages = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/message/getAll/${receiverId}`,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages(response.data.messages);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      formData.append("message", input);
      if (backendImage) {
        formData.append("image", backendImage);
      }
      const response = await axios.post(
        `${backendUrl}/api/message/send/${receiverId}`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setMessages((prev) => [...prev, response.data.newMessage]);
        setInput("");
        setBackendImage(null);
        setFrontendImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getChatUser(), getAllMessages()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <ClipLoader color="#ffffff" size={50} />
      </div>
    );
  }

  return (
    chatUser &&
    messages && (
      <div className="w-full h-screen bg-black text-white relative">
        {/* User Profile */}
        <div className="flex items-center gap-6 px-6 py-6 fixed top-0 z-50 bg-black w-full">
          <IoMdArrowBack
            onClick={() => navigate(`/`)}
            className="cursor-pointer size-6 lg:size-8 hover:text-gray-300"
          />
          <div
            onClick={() => navigate(`/profile/${chatUser.userName}`)}
            className="size-[40px] border-2 border-gray-700 rounded-full cursor-pointer overflow-hidden"
          >
            <img
              className="w-full object-cover"
              src={chatUser.profileImage || defaultProfile}
              alt="profile-image"
            />
          </div>

          <div className="font-semibold">
            <div className="text-[18px] ">{chatUser.userName}</div>
            <div className="text-[14px] text-gray-400">{chatUser.name}</div>
          </div>
        </div>

        {/* All Messages Window */}
        <div className="w-full h-[90%] pt-24 px-6 sm:px-8 md:px-12 lg:px-20 xl:px-32 flex flex-col gap-7 overflow-auto bg-black">
          {messages &&
            messages.map((message, index) => {
              if (message.sender == userData._id) {
                return <SenderMessage key={index} message={message} />;
              } else {
                return (
                  <ReceiverMessage
                    key={index}
                    message={message}
                    chatUser={chatUser}
                  />
                );
              }
            })}
        </div>

        {/* Message Input */}
        <div className="w-full h-20 fixed bottom-0 flex justify-center items-center bg-black z-50">
          <form
            onSubmit={handleSendMessage}
            className="w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#030303] flex items-center gap-3 px-5 relative"
          >
            {frontendImage && (
              <div className="w-[100px] rounded-2xl h-[100px] absolute top-[-120px] right-[10px] overflow-hidden">
                <img
                  className="h-full object-cover"
                  src={frontendImage}
                  alt="image-display"
                />
              </div>
            )}

            <input
              onChange={handleImage}
              hidden
              type="file"
              accept="image/*"
              ref={imageInput}
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              placeholder="Message"
              className="w-full h-full px-5 text-[18px] text-white outline-0"
            />
            <div onClick={() => imageInput.current.click()}>
              <LuImage className="size-7" />
            </div>
            <button
              disabled={input === "" && !frontendImage}
              className={`w-[45px] h-[35px] cursor-pointer rounded-full flex items-center justify-center ${
                input === "" && !frontendImage
                  ? "bg-gray-900"
                  : "bg-gradient-to-r from-[#9500ff] to-[#ff0095]"
              }`}
            >
              <IoMdSend className="size-6" />
            </button>
          </form>
        </div>
      </div>
    )
  );
};

export default MessageArea;
