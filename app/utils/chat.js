import { setMessage } from "../redux/messageSlice";
import { store } from "../store/store";

export const updateDirectChatHistory = (data) => {

  const { participants, message: messages } = data;

  // find id of user from token and od form active conversations
  const receiverId = store.getState().chat.chosenChatDetails?.id;
  const userId = store.getState().auth.user?._id;

  if (receiverId && userId) {
    const userInConversation = [receiverId, userId];
    updateChatHistoryIfSameConversationActive({
      participants,
      userInConversation,
      messages,
    });
  }
};

const updateChatHistoryIfSameConversationActive = ({
  participants,
  userInConversation,
  messages,
}) => {
  const result = participants.every(function (participantId) {
    return userInConversation.includes(participantId);
  });


  if (result) {
    store.dispatch(setMessage(messages));
  } 
};
