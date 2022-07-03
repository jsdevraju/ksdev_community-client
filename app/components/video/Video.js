import { useEffect } from "react";
import { useRef } from "react";

const Video = ({ stream, isLocalStream }) => {
  const videoRef = useRef();

  useEffect(() => {
    const video = videoRef.current;
    video.srcObject = stream;

    video.onloadedmetadata = () => {
      video.play();
    };
  }, [stream]);

  return (
    <>
      <div
        style={{
          height: "50%",
          width: "50%",
          backgroundColor: "black",
          borderRadius: "8px",
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted={isLocalStream ? true : false}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </>
  );
};

export default Video;
