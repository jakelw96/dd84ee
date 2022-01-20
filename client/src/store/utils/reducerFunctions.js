import {
  countUnreadMessages,
  getLastReadMessage,
  updateCurrentUser,
  updateOtherUser,
  updateBothUsers,
} from "./helpers";

export const addMessageToStore = (state, payload) => {
  const { message, sender, recipientId, currUserId } = payload;

  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    newConvo.usersInConvo = [
      {
        userId: recipientId ? recipientId : currUserId,
        currActiveConvo: null,
        lastReadMessage: getLastReadMessage(recipientId, newConvo.messages),
        unreadMessagesCount: countUnreadMessages(
          recipientId,
          newConvo.messages
        ),
      },
      {
        userId: message.senderId,
        currActiveConvo: newConvo.id,
        lastReadMessage: getLastReadMessage(
          message.senderId,
          newConvo.messages
        ),
        unreadMessagesCount: countUnreadMessages(
          message.senderId,
          newConvo.messages
        ),
      },
    ];
    newConvo.otherUserInConvoArrIndex = newConvo.usersInConvo.findIndex(
      (user) => user.userId !== recipientId
    );

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
        usersInConvo: convo.usersInConvo.map((user) => {
          return {
            ...user,
            lastReadMessage: getLastReadMessage(user.userId, [
              ...convo.messages,
              message,
            ]),
            unreadMessagesCount: countUnreadMessages(user.userId, [
              ...convo.messages,
              message,
            ]),
          };
        }),
        otherUserInConvoArrIndex: convo.usersInConvo.findIndex(
          (user) => user.userId === convo.otherUser.id
        ),
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

export const addNewConvoToStore = (state, recipientId, message, currUserId) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      // Returning a new object with the original state and updated with id,
      // messages, and latestMessageText

      return {
        ...convo,
        id: message.conversationId,
        messages: [...convo.messages, message],
        latestMessageText: message.text,
        usersInConvo: [
          {
            userId: recipientId,
            currActiveConvo: null,
            lastReadMessage: getLastReadMessage(recipientId, [
              ...convo.messages,
              message,
            ]),
            unreadMessagesCount: countUnreadMessages(recipientId, [
              ...convo.messages,
              message,
            ]),
          },
          {
            userId: message.senderId,
            currActiveConvo: message.conversationId,
            lastReadMessage: getLastReadMessage(message.senderId, [
              ...convo.messages,
              message,
            ]),
            unreadMessagesCount: countUnreadMessages(message.senderId, [
              ...convo.messages,
              message,
            ]),
          },
        ],
        // currUserInConvoArrIndex: convo.usersInConvo.findIndex(
        //   (user) => user.userId === currUserId
        // ),
      };
    } else {
      return convo;
    }
  });
};

export const updateConversationData = (state, payload) => {
  const { convoId, activeConvo } = payload;

  return state.map((convo) => {
    if (convo.id === convoId && convo.messages.length > 0) {
      if (activeConvo === convo.otherUser.username) {
        if (
          convo.usersInConvo.every((user) => {
            return user.currActiveConvo === convoId;
          })
        ) {
          return updateBothUsers(convo);
        } else {
          return updateCurrentUser(convo);
        }
      } else {
        return updateOtherUser(convo);
      }
    } else {
      return convo;
    }
  });
};

export const updateCurrentActiveConversation = (state, payload) => {
  const { userId, currConvoId } = payload;
  return state.map((convo) => {
    if (convo.usersInConvo) {
      return {
        ...convo,
        usersInConvo: convo.usersInConvo.map((user) => {
          if (user.userId === userId) {
            user.currActiveConvo = currConvoId;
            return user;
          } else {
            return user;
          }
        }),
      };
    } else {
      return convo;
    }
  });
};
