import { io } from "socket.io-client";
import { ACTIONS } from "../socketAction";
import {
  setFriends,
  setOnlineUsers,
  setPendingFriendsInvitations,
} from "../redux/friendSlice";
import { store } from "../store/store";
import { updateDirectChatHistory } from "../utils/chat";
import { newRoomCreated, updateActiveRooms } from "./roomHandler";
import {
  handleParticipantLeftRoom,
  handleSignalingData,
  prepareNewPeerConnection,
} from "../webrtc/webRTCHandler";
import toast from "react-hot-toast";

let socket = null;

export const connectWithSocketServer = (userDetails) => {
  socket = io(process.env.NEXT_PUBLIC_API, {
    auth: { token: userDetails?.token },
  });

  //   When User Connected Fire the events
  socket.on("connect", () => {
    console.log(`Socket Connection ${socket.id}`);

    //Friend Invitations
    socket.on(ACTIONS.FRIENDS_INVITATIONS, (data) => {
      const { pendingInvitations } = data;
      store.dispatch(setPendingFriendsInvitations(pendingInvitations));
    });
    //Friends List
    socket.on(ACTIONS.FRIENDS_LIMIT, (data) => {
      const { friends } = data;
      store.dispatch(setFriends(friends));
    });
    // Online User
    socket.on(ACTIONS.ONLINE_USER, (data) => {
      const { onlineUsers } = data;
      store.dispatch(setOnlineUsers(onlineUsers));
    });
    //Chat History
    socket.on(ACTIONS.DIRECT_MESSAGE_HISTORY, (data) => {
      updateDirectChatHistory(data);
    });
    // Handle room create
    socket.on(ACTIONS.ROOM_CREATE, (data) => {
      newRoomCreated(data);
    });
    //Active rooms
    socket.on(ACTIONS.ACTIVE_ROOM, (data) => {
      updateActiveRooms(data);
    });
    // peer to peer connection
    socket.on(ACTIONS.CONN_PREPARE, (data) => {
      const { connUserSocketId } = data;
      prepareNewPeerConnection(connUserSocketId, false);
      socket.emit(ACTIONS.CONN_INIT, { connUserSocketId });
    });
    // Connection Init
    socket.on(ACTIONS.CONN_INIT, (data) => {
      const { connUserSocketId } = data;
      prepareNewPeerConnection(connUserSocketId, true);
    });
    //Connection Signal
    socket.on(ACTIONS.CONN_SIGNAL, (data) => {
      handleSignalingData(data);
    });
    //Socket connection left participant
    socket.on(ACTIONS.ROOM_PARTICIPANT_LEFT, (data) => {
      toast.success(`User left the room`);
      handleParticipantLeftRoom(data);
    });
  });
};

export const sendDirectMessage = (data) => {
  socket.emit(ACTIONS.DIRECT_MESSAGE, data);
};

export const getDirectChatHistory = (data) => {
  socket.emit(ACTIONS.DIRECT_MESSAGE_HISTORY, data);
};

export const createNewRoomClient = () => {
  socket.emit(ACTIONS.ROOM_CREATE);
};

export const joinRoomClient = (data) => {
  socket.emit(ACTIONS.JOIN_ROOM, data);
};

export const leaveRoomClient = (data) => {
  socket.emit(ACTIONS.ROOM_LEAVE, data);
};

export const signalPeerData = (data) => {
  socket.emit(ACTIONS.CONN_SIGNAL, data);
};
