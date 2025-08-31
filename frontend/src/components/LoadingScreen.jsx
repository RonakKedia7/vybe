import { ClipLoader } from "react-spinners";

const LoadingScreen = () => {
  return (
    <div className="flex bg-black justify-center items-center h-screen">
      <ClipLoader size={50} color="white" />
    </div>
  );
};

export default LoadingScreen;
