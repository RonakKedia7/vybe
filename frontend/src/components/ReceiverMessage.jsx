import defaultProfile from "../assets/profile-other.png";
import { useRef, useEffect } from "react";

const ReceiverMessage = ({ message, chatUser }) => {
  const scroll = useRef();

  useEffect(() => {
    if (scroll.current) {
      scroll.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return (
    <div className="w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 px-3 py-3 relative left-0 flex flex-col gap-3">
      {message.image && (
        <img
          className="h-[200px] object-cover rounded-2xl"
          src={message.image}
          alt="message-image"
        />
      )}

      {message.message && (
        <div className="text-[18px] text-white wrap-break-word">
          {message.message}
        </div>
      )}

      <div className="size-7 rounded-full cursor-pointer overflow-hidden absolute left-[-20px] bottom-[-15px]">
        <img
          className="w-full object-cover"
          src={chatUser.profileImage || defaultProfile}
          alt="profileImage"
        />
      </div>
    </div>
  );
};

export default ReceiverMessage;
