import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isUserInRoom: false,
  isUserRoomCreator: false,
  roomDetails: null,
  activeRooms: [],
  localStreams: null,
  remoteStreams: [],
  audioOnly: false,
  screenSharingStream: null,
  isScreenSharingActive: false,
  isUserJoinWithAudioOnly:false
};

export const roomSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    setOpenRoom: (state, { payload }) => {
      return {
        ...state,
        isUserInRoom: payload?.isUserInRoom,
        isUserRoomCreator: payload?.isUserRoomCreator,
      };
    },
    setRoomDetails: (state, { payload }) => {
      state.roomDetails = payload;
    },
    setActiveRooms: (state, { payload }) => {
      state.activeRooms = payload;
    },
    setLocalStream: (state, { payload }) => {
      state.localStreams = payload;
    },
    setAudioOnly: (state, { payload }) => {
      state.audioOnly = payload;
    },
    setRemoteStream:(state, {payload}) =>{
      state.remoteStreams = payload;
    },
    setScreenShareStream:(state, {payload}) =>{
      state.isScreenSharingActive = payload ? true : false;
      state.screenSharingStream = payload  || null;
    },
    setIsUserJoinWithAudioOnly:(state, {payload}) =>{
      state.isUserJoinWithAudioOnly = payload;
    }
  },
});

export const {
  setOpenRoom,
  setRoomDetails,
  setActiveRooms,
  setLocalStream,
  setAudioOnly,
  setRemoteStream,
  setScreenShareStream,
  setIsUserJoinWithAudioOnly
} = roomSlice.actions;
export default roomSlice.reducer;
