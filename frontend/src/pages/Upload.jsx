import { useState, useRef } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { FiPlusSquare, FiX } from "react-icons/fi"; // FiX for close icon
import { useUser } from "../context/userContext";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import VideoPlayer from "../components/VideoPlayer";
import axios from "axios";

const Upload = () => {
  const {
    navigate,
    backendUrl,
    postData,
    setPostData,
    loopData,
    setLoopData,
    setUserData,
  } = useUser();
  const [uploadType, setUploadType] = useState("Post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const mediaInput = useRef();

  const handleMedia = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setBackendMedia(file);

    if (file.type.includes("video")) {
      setMediaType("video");
    } else if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      return toast.error("Add video or image");
    }

    setFrontendMedia(URL.createObjectURL(file));
  };

  const handleRemoveMedia = () => {
    setFrontendMedia(null);
    setBackendMedia(null);
    setMediaType("");
    setCaption("");
  };

  const uploadPost = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const response = await axios.post(
        `${backendUrl}/api/post/upload`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success("Post Created");
        handleRemoveMedia();
        setPostData([response.data.data, ...postData]);
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadStory = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("mediaType", mediaType);
      formData.append("media", backendMedia);

      const response = await axios.post(
        `${backendUrl}/api/story/upload`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setUserData((prev) => ({ ...prev, story: response.data.data }));
        toast.success("Story Created");
        handleRemoveMedia();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const uploadLoop = async () => {
    setLoading(true);
    try {
      if (mediaType !== "video") {
        handleRemoveMedia();
        return toast.error("Upload a video in the loop");
      }

      const formData = new FormData();

      formData.append("caption", caption);
      formData.append("media", backendMedia);

      const response = await axios.post(
        `${backendUrl}/api/loop/upload`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setLoopData([response.data.data, ...loopData]);
        toast.success("Loop Created");
        handleRemoveMedia();
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (uploadType === "Post") {
      uploadPost();
    } else if (uploadType === "Story") {
      uploadStory();
    } else {
      uploadLoop();
    }
  };

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col items-center">
      {/* Header */}
      <div className="w-full h-20 fixed left-2 sm:left-5 flex items-center gap-3 sm:gap-5 px-3 sm:px-5 bg-black z-10">
        <IoMdArrowBack
          onClick={() => navigate("/")}
          className="cursor-pointer size-6 lg:size-8 hover:text-gray-300"
        />
        <h1 className="text-xl font-semibold">Upload Media</h1>
      </div>

      {/* Upload Type Tabs */}
      <div className="w-[90%] max-w-[600px] bg-[#020202] border border-gray-700 rounded-full flex justify-between items-center gap-[10px] h-14 mt-24 px-5 sm:px-10">
        {["Post", "Story", "Loop"].map((item, index) => (
          <div
            key={index}
            onClick={() => setUploadType(item)}
            className={`flex justify-center items-center text-[19px] px-3 py-1 rounded-full cursor-pointer ${
              uploadType === item
                ? "bg-black border border-gray-600"
                : "hover:bg-[#030303] hover:border hover:border-gray-950"
            }`}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Media Upload */}
      {!frontendMedia ? (
        <div
          onClick={() => mediaInput.current.click()}
          className="w-[80%] max-w-[500px] h-[250px] bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-2 mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]"
        >
          <input
            onChange={handleMedia}
            accept={uploadType === "Loop" ? "video/*" : ""}
            type="file"
            hidden
            ref={mediaInput}
          />
          <FiPlusSquare className="size-8" />
          <div className="text-xl font-semibold">Upload {uploadType}</div>
          <p className="text-sm text-gray-500">Click to select your file</p>
        </div>
      ) : (
        <div className="relative w-[80%] max-w-[500px] h-[250px] flex flex-col items-center justify-center mt-[15vh]">
          {/* Remove Button */}
          <button
            onClick={handleRemoveMedia}
            className="absolute cursor-pointer -top-20 -right-20 z-[100] bg-black/70 border border-white/30 rounded-full p-1 hover:bg-black transition"
          >
            <FiX className="text-white size-5" />
          </button>

          {/* Image Preview */}
          {mediaType === "image" && (
            <>
              <img
                className="h-[60%] rounded-2xl"
                src={frontendMedia}
                alt="frontend-media"
              />
              {uploadType !== "Story" && (
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border-b-2 border-b-gray-500 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  type="text"
                  placeholder="write caption"
                  autoComplete="off"
                />
              )}
            </>
          )}

          {/* Video Preview */}
          {mediaType === "video" && (
            <>
              <VideoPlayer media={frontendMedia} />
              {uploadType !== "Story" && (
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border-b-2 border-b-gray-500 outline-none px-[10px] py-[5px] text-white mt-[20px]"
                  type="text"
                  placeholder="write caption"
                  autoComplete="off"
                />
              )}
            </>
          )}
        </div>
      )}

      {/* Upload Button */}
      {frontendMedia && (
        <button
          onClick={handleUpload}
          className="px-2 w-[60%] max-w-[400px] py-1 h-12 bg-[#020202] mt-12 cursor-pointer rounded-2xl hover:bg-[#030303] flex items-center justify-center"
        >
          {loading ? (
            <ClipLoader size={30} color="white" />
          ) : (
            `Upload ${uploadType}`
          )}
        </button>
      )}
    </div>
  );
};

export default Upload;
