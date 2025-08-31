import { IoMdArrowBack } from "react-icons/io";
import { useUser } from "../context/userContext";
import LoopCard from "../components/LoopCard";

const Loops = () => {
  const { navigate, loopData } = useUser();

  return (
    <div className="w-screen h-screen bg-black text-white overflow-hidden flex justify-center items-center">
      {/* Header */}
      <div className="w-full h-20 fixed top-3 left-3 flex items-center gap-3 sm:gap-5 px-3 sm:px-5 z-10">
        <IoMdArrowBack
          onClick={() => navigate("/")}
          className="cursor-pointer size-6 lg:size-8 hover:text-gray-300"
        />
        <h1 className="hidden lg:block text-xl font-semibold">Loops</h1>
      </div>

      {/* Reel Container */}
      <div
        className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {loopData.map((loop, index) => (
          <div
            key={index}
            data-index={index}
            className="h-screen snap-start flex items-center justify-center transition-all duration-500 ease-out transform"
          >
            <LoopCard loop={loop} key={index} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loops;
