export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      // Returning a new object with original data and updating the latestMessageText
      // and messages array with the new message
      return {
        ...convo,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
      };
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: true };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser = { ...convoCopy.otherUser, online: false };
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      // Returning a new object with the original state and updated with id,
      // messages, and latestMessageText
      return {
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
      };
    } else {
      return convo;
    }
  });
};

// Reducer function that updates the conversations messages isRead boolean
export const updateConversationMessages = (state, convoId) => {
  return state.map((convo) => {
    if (convo.id === convoId) { // If a convo in state's ID === convo currently selected
      return {
        ...convo,
        messages: convo.messages.map((message) => {
          if (message.senderId === convo.otherUser.id) {
            message.isRead = true;
            return message;
          } else {
            return message;
          }
        }),
      };
    } else {
      return convo;
    }
  });
};
