import {
  setOpenRoom,
  setRoomDetails,
  setActiveRooms,
  setLocalStream,
  setRemoteStream,
  setScreenShareStream,
  setIsUserJoinWithAudioOnly,
} from "../redux/roomSlice";
import { store } from "../store/store";
import {
  closeAllConnection,
  getLocalStreamPreview,
} from "../webrtc/webRTCHandler";
import {
  createNewRoomClient,
  joinRoomClient,
  leaveRoomClient,
} from "./socketConnection";

export const createNewRoom = () => {
  const successCallBackFunc = () => {
    store.dispatch(
      setOpenRoom({ isUserInRoom: true, isUserRoomCreator: true })
    );
    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinWithAudioOnly(audioOnly));
    createNewRoomClient();
  };
  getLocalStreamPreview(store.getState().room.audioOnly, successCallBackFunc);
};

export const newRoomCreated = (data) => {
  const { roomDetails } = data;
  store.dispatch(setRoomDetails(roomDetails));
};

export const updateActiveRooms = (data) => {
  const { activeRooms } = data;

  const friends = store.getState().friends.friends;
  const rooms = [];

  const userId = store.getState().auth?.user?._id;

  activeRooms.forEach((room) => {
    const isRoomCreateByMe = room.roomCreator.userId === userId;
    if (isRoomCreateByMe) {
      rooms.push({ ...room, creatorUsername: "Me" });
    } else {
      friends.forEach((f) => {
        if (f.id == room.roomCreator?.userId) {
          rooms.push({ ...room, creatorUsername: f.username });
        }
      });
    }
  });

  store.dispatch(setActiveRooms(rooms));
};

export const joinRoom = (roomId) => {
  const successCallBackFunc = () => {
    store.dispatch(setRoomDetails({ roomId }));
    store.dispatch(
      setOpenRoom({ isUserRoomCreator: false, isUserInRoom: true })
    );
    const audioOnly = store.getState().room.audioOnly;
    store.dispatch(setIsUserJoinWithAudioOnly(audioOnly));
    joinRoomClient({ roomId });
  };
  getLocalStreamPreview(store.getState().room.audioOnly, successCallBackFunc);
};

export const leaveRoom = () => {
  const roomId = store.getState().room.roomDetails.roomId;
  const localStream = store.getState().room.localStreams;
  if (localStream) {
    localStream.getTracks()?.forEach((track) => track.stop());
    store.dispatch(setLocalStream(null));
  }

  const screenSharingStream = store.getState().room.screenSharingStream;
  if (screenSharingStream) {
    screenSharingStream.getTracks()?.forEach((track) => track.stop());
    store.dispatch(setScreenShareStream(null));
  }

  store.dispatch(setRemoteStream([]));
  closeAllConnection();

  leaveRoomClient({ roomId });
  store.dispatch(setRoomDetails(null));
  store.dispatch(
    setOpenRoom({ isUserRoomCreator: false, isUserInRoom: false })
  );
};
