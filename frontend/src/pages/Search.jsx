import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search as SearchIcon, User } from "lucide-react";
import { useUser } from "../context/userContext";
import axios from "axios";

const Search = () => {
  const [searchData, setSearchData] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { navigate, backendUrl } = useUser();

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchData([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${backendUrl}/api/user/search?keyword=${input}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        if (response.data.users) {
          setSearchData(response.data.users);
        } else {
          setSearchData([]);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(input);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [input]);

  const handleUserClick = (userName) => {
    console.log(`Navigating to ${userName}'s profile`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black border-b border-neutral-800">
        <div className="flex items-center gap-4 p-4 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">Search People</h1>
        </div>
      </header>

      {/* Search Section */}
      <section className="px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search for people..."
                className="w-full pl-12 pr-4 py-4 text-base bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder-neutral-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-neutral-800 bg-neutral-900"
                >
                  <div className="p-6 flex items-center gap-4 animate-pulse">
                    <div className="w-14 h-14 bg-neutral-800 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-neutral-800 rounded w-32"></div>
                      <div className="h-3 bg-neutral-800 rounded w-48"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : input && searchData.length === 0 ? (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900">
              <div className="p-12 text-center">
                <User className="w-14 h-14 mx-auto mb-4 text-neutral-500" />
                <h3 className="text-lg font-semibold mb-2">No users found</h3>
                <p className="text-neutral-500">
                  Try searching with a different keyword
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {searchData.map((user) => (
                <div
                  key={user.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleUserClick(user.userName)}
                >
                  <div className="p-5 flex items-center gap-5">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full border border-neutral-700 overflow-hidden bg-neutral-800">
                        {user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-neutral-400">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base truncate">
                        {user.name}
                      </h3>
                      <p className="text-neutral-500 text-sm">
                        @{user.userName}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-neutral-600 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => navigate(`/profile/${user.userName}`)}
                      className="px-3 py-1 rounded-md border border-neutral-700 hover:border-neutral-600 bg-neutral-900 hover:bg-neutral-800 text-xs font-medium text-white"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!input && (
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 mt-8">
              <div className="p-12 text-center">
                <SearchIcon className="w-14 h-14 mx-auto mb-4 text-neutral-500" />
                <h3 className="text-lg font-semibold mb-2">Start searching</h3>
                <p className="text-neutral-500">
                  Enter a name or username to find people
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Search;
