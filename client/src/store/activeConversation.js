import { updateConversationMessages } from "./utils/reducerFunctions";

const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";

export const setActiveChat = (conversation) => {
  return {
    type: SET_ACTIVE_CHAT,
    conversation,
  };
};

const reducer = (state = "", action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      // return action.conversation.otherUser.username;
      return updateConversationMessages(state, action.conversation);
    }
    default:
      return state;
  }
};

export default reducer;
