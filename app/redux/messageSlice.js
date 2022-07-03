import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chosenChatDetails: null,
  chatType: null,
  message: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChosenChatDetails:(state, {payload}) =>{
     return { ...state, chatType: payload?.chatType, chosenChatDetails:payload?.chatDetails}
    },
    setMessage:(state, {payload}) =>{
     state.message = payload;
    },
  },
});

export const { setChosenChatDetails, setMessage } = chatSlice.actions;
export default chatSlice.reducer;
