import { useRef, useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";

const VideoPlayer = ({ media, type }) => {
  const videoTag = useRef();
  const [mute, setMute] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState(16 / 9);

  const handleVideoClick = () => {
    const video = videoTag.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };

  const handleMuteClick = (e) => {
    e.stopPropagation();
    const newMuteState = !mute;
    setMute(newMuteState);
    if (videoTag.current) {
      videoTag.current.muted = newMuteState;
    }
  };

  const handleVideoLoad = () => {
    const video = videoTag.current;
    if (video) {
      const aspectRatio = video.videoWidth / video.videoHeight;
      setVideoAspectRatio(aspectRatio);

      // Keep mute state
      video.muted = mute;

      // Play automatically when loaded
      video.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    if (videoTag.current) {
      videoTag.current.muted = mute;
    }
  }, [mute]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoTag.current;
        if (!video) return;

        if (entry.isIntersecting) {
          video.muted = mute;
          video.play().catch(() => {});
          setIsPlaying(true);
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    const videoEl = videoTag.current;
    if (videoEl) {
      observer.observe(videoEl);
    }

    return () => {
      if (videoEl) observer.unobserve(videoEl);
    };
  }, [mute]);

  return (
    <div
      className="relative w-full h-full max-h-[700px] cursor-pointer group overflow-hidden rounded-lg"
      onClick={handleVideoClick}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        className={`w-full h-full max-h-[700px] flex items-center justify-center ${
          type === "Story" ? "bg-black" : "bg-[#020202]"
        }`}
        style={{ aspectRatio: videoAspectRatio }}
      >
        <video
          ref={videoTag}
          className="max-w-full max-h-full object-contain"
          src={media}
          autoPlay
          loop
          muted={mute}
          onLoadedMetadata={handleVideoLoad}
          playsInline
        />
      </div>

      {/* Play/Pause Overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0"
        } pointer-events-none`}
      >
        <div className="bg-black/60 backdrop-blur-sm rounded-full p-3">
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white ml-1" />
          )}
        </div>
      </div>

      {/* Mute/Unmute Button */}
      <div className="absolute bottom-4 right-4 z-10">
        <button
          onClick={handleMuteClick}
          className="p-2 bg-black/60 backdrop-blur-sm rounded-full border border-gray-600 hover:bg-black/80 hover:border-gray-500 transition-all duration-200 pointer-events-auto"
        >
          {mute ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
