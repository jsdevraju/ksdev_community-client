import { useState } from "react";
import { Button } from "../Button/Button";
import styles from "./styles.module.css";
import { BiFullscreen } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import { FiMic, FiShare2, FiMicOff } from "react-icons/fi";
import { FcEndCall, FcVideoCall, FcNoVideo } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { leaveRoom } from "../../socket/roomHandler";
import Video from "../video/Video";
import { setScreenShareStream } from "../../redux/roomSlice";
import { switchOutgoingTracks } from "../../webrtc/webRTCHandler";

const constraints = {
  audio: false,
  video: true,
};

const Room = () => {
  const dispatch = useDispatch();
  const [isRoomMinimized, setIsRoomMinimized] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [muteEnabled, setMuteEnabled] = useState(true);
  const isScreenSharingActive = useSelector(
    (state) => state.room?.isScreenSharingActive
  );
  const screenSharingStream = useSelector(
    (state) => state.room?.screenSharingStream
  );
  const localStreams = useSelector((state) => state.room?.localStreams);
  const remoteStreams = useSelector((state) => state.room?.remoteStreams);
  const isUserJoinWithAudioOnly = useSelector(
    (state) => state.room?.isUserJoinWithAudioOnly
  );

  //When User Resize Mode Fire this function
  const roomResizeHandler = () => {
    setIsRoomMinimized(!isRoomMinimized);
  };

  // When User click camera button fire this and toggle function
  const handleToggleCamera = () => {
    localStreams.getVideoTracks()[0].enabled = !cameraEnabled;
    setCameraEnabled(!cameraEnabled);
  };

  // When User click camera button fire this and toggle  function
  const handleToggleMic = () => {
    localStreams.getAudioTracks()[0].enabled = !muteEnabled;
    setMuteEnabled(!muteEnabled);
  };

  const handleScreenShareToggle = async () => {
    if (!isScreenSharingActive) {
      let stream = null;
      try {
        stream = await navigator.mediaDevices.getDisplayMedia(constraints);
      } catch (error) {
        console.log(error);
      }

      if (stream) {
        dispatch(setScreenShareStream(stream));
        // switchOutgoing video tracks
        switchOutgoingTracks(stream);
      }
    } else {
      // switchOutgoing Tracks
      switchOutgoingTracks(localStreams);
      screenSharingStream.getTracks()?.forEach((t) => t.stop());
      dispatch(setScreenShareStream(null));
    }
  };

  // When User click end call fire this function
  const handleLeaveRoom = () => {
    leaveRoom();
  };

  return (
    <>
      <div
        className={
          isRoomMinimized
            ? `${styles.mainContainer} ${styles.minimizedRoom}`
            : styles.fullScreenRoom
        }
      >
        {/* Video Elements */}
        <div className={styles.videoContainer}>
          <Video
            stream={screenSharingStream ? screenSharingStream : localStreams}
            isLocalStream
          />
          {remoteStreams &&
            remoteStreams?.map((stream, index) => (
              <Video key={index} stream={stream} />
            ))}
        </div>

        {/* Room Control Button */}
        <div className={styles.buttonContainer}>
          {!isUserJoinWithAudioOnly && (
            <Button
              type="button"
              className={styles.btn}
              onClick={handleScreenShareToggle}
            >
              {isScreenSharingActive ? (
                <AiOutlineClose size={20} />
              ) : (
                <FiShare2 size={20} />
              )}
            </Button>
          )}

          <Button
            type="button"
            className={styles.btn}
            onClick={handleToggleMic}
          >
            {muteEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
          </Button>
          <Button
            type="button"
            className={styles.btn}
            onClick={handleLeaveRoom}
          >
            <FcEndCall size={20} />
          </Button>
          {!isUserJoinWithAudioOnly && (
            <Button
              type="button"
              className={styles.btn}
              onClick={handleToggleCamera}
            >
              {cameraEnabled ? (
                <FcVideoCall size={20} />
              ) : (
                <FcNoVideo size={20} />
              )}
            </Button>
          )}
        </div>

        {/* FullScreen Button */}
        <Button
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
          }}
          type="button"
          className="app_btn"
          onClick={roomResizeHandler}
        >
          {isRoomMinimized ? (
            <BiFullscreen size={20} />
          ) : (
            <AiOutlineClose size={20} />
          )}
        </Button>
      </div>
    </>
  );
};

export default Room;
