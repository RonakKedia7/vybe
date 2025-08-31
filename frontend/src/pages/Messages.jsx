import { IoMdArrowBack } from "react-icons/io";
import { useUser } from "../context/userContext";
import defaultProfile from "../assets/profile-other.png";
import { BsChatDots } from "react-icons/bs";

const Messages = () => {
  const { navigate, userData, prevChatUsers } = useUser();

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-black border-b border-gray-700 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4">
          <button
            onClick={() => navigate("/")}
            className="lg:hidden p-2 hover:bg-[#050505] rounded-md transition-colors duration-200"
          >
            <IoMdArrowBack className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BsChatDots className="w-5 h-5 text-gray-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Messages</h1>
              <p className="text-sm text-gray-400">
                Stay connected with your friends
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {/* Following Users Section */}
            {userData.following && userData.following.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-medium text-white">Following</h2>
                  <div className="flex-1 h-px bg-gray-700" />
                  <span className="text-sm text-gray-400 bg-[#040404] px-2 py-1 rounded-full">
                    {userData.following.length}
                  </span>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {userData.following.map((user) => (
                    <div
                      key={user._id}
                      onClick={() => navigate(`/message/${user._id}`)}
                      className="group flex-shrink-0 cursor-pointer"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-400 transition-colors duration-200 shadow-lg">
                          <img
                            className="w-full h-full object-cover"
                            src={user.profileImage || defaultProfile}
                            alt={`${user.name || user.userName}'s profile`}
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-center">
                        <p className="text-sm font-medium text-white truncate max-w-[80px]">
                          {user.name || user.userName}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recent Chats Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-medium text-white">Recent Chats</h2>
                <div className="flex-1 h-px bg-gray-700" />
                <span className="text-sm text-gray-400 bg-[#040404] px-2 py-1 rounded-full">
                  {
                    prevChatUsers.filter((user) => user._id !== userData._id)
                      .length
                  }
                </span>
              </div>

              <div className="space-y-2">
                {prevChatUsers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-[#040404]/20 rounded-full mb-4">
                      <BsChatDots className="w-8 h-8 text-gray-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-300 mb-2">
                      No recent chats
                    </h3>
                    <p className="text-sm text-gray-400 max-w-sm">
                      Start a conversation with your friends to see your chat
                      history here.
                    </p>
                  </div>
                ) : (
                  prevChatUsers.map(
                    (user) =>
                      user._id !== userData._id && (
                        <div
                          key={user._id}
                          onClick={() => navigate(`/message/${user._id}`)}
                          className="flex items-center gap-4 p-4 rounded-xl cursor-pointer bg-[#040404] hover:bg-[#050505] transition-all duration-200 border border-transparent hover:border-gray-600 group"
                        >
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-600 group-hover:border-blue-400 transition-colors duration-200">
                              <img
                                className="w-full h-full object-cover"
                                src={user.profileImage || defaultProfile}
                                alt={`${user.name || user.userName}'s profile`}
                              />
                            </div>
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-blue-400 border-2 border-[#030303] rounded-full" />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-white truncate">
                                {user.name || user.userName}
                              </h3>
                              {user.name && (
                                <span className="text-sm text-gray-400">
                                  @{user.userName}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-300 truncate">
                              Tap to start chatting
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </div>
                      )
                  )
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
