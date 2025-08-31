import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import StoryMain from "../components/StoryMain";
import ClipLoader from "react-spinners/ClipLoader";

const Story = () => {
  const { userName } = useParams();
  const { backendUrl, storyData, setStoryData } = useUser();
  const [loading, setLoading] = useState(false);

  const handleStory = async () => {
    setLoading(true);
    setStoryData(null);
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/story/getByUserName/${userName}`,
        { withCredentials: true }
      );

      if (data.success) {
        setStoryData(data.data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userName) {
      handleStory();
    }
  }, [userName]);

  return loading ? (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <ClipLoader color="#ffffff" size={50} />
    </div>
  ) : (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <StoryMain storyData={storyData} />
    </div>
  );
};

export default Story;
