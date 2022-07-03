import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  friends: [],
  pendingFriendsInvitation: [],
  onlineUsers: [],
};

export const friendSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setPendingFriendsInvitations:(state, {payload}) =>{
     state.pendingFriendsInvitation = payload;
    },
    setFriends:(state, {payload}) =>{
     state.friends = payload;
    },
    setOnlineUsers:(state, {payload}) =>{
     state.onlineUsers = payload;
    },
  },
});

export const { setFriends, setPendingFriendsInvitations, setOnlineUsers } = friendSlice.actions;
export default friendSlice.reducer;
