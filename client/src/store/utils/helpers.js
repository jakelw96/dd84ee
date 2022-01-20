export const countUnreadMessages = (userId, messages) => {
  let unreadMessageCounter = 0;

  messages.forEach((message) => {
    if (userId !== message.senderId) {
      if (message.isRead === false) {
        unreadMessageCounter += 1;
      }
    }
  });

  return unreadMessageCounter;
};

export const getLastReadMessage = (userId, messages) => {
  let readMessages = [];

  messages.forEach((message) => {
    if (userId !== message.senderId) {
      if (message.isRead === true) {
        readMessages.push(message);
      }
    }
  });

  if (readMessages.length > 0) {
    return readMessages[readMessages.length - 1];
  } else {
    return null;
  }
};

export const updateCurrentUser = (convo) => {
  // This array is only used to assist in setting the unread messages count
  let updatedMessageArr = [];

  return {
    ...convo,
    messages: convo.messages.map((message) => {
      if (message.senderId === convo.otherUser.id) {
        message.isRead = true;
        updatedMessageArr.push(message);
        return message;
      } else {
        updatedMessageArr.push(message);
        return message;
      }
    }),
    usersInConvo: convo.usersInConvo.map((user) => {
      return {
        ...user,
        lastReadMessage: getLastReadMessage(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
        unreadMessagesCount: countUnreadMessages(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
      };
    }),
    currUserInConvoArrIndex: convo.usersInConvo.findIndex(
      (user) => user.userId !== convo.otherUser.id
    ),
  };
};

export const updateOtherUser = (convo) => {
  let updatedMessageArr = [];

  return {
    ...convo,
    messages: convo.messages.map((message) => {
      if (message.senderId !== convo.otherUser.id) {
        message.isRead = true;
        updatedMessageArr.push(message);
        return message;
      } else {
        updatedMessageArr.push(message);
        return message;
      }
    }),
    usersInConvo: convo.usersInConvo.map((user) => {
      return {
        ...user,
        lastReadMessage: getLastReadMessage(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
        unreadMessagesCount: countUnreadMessages(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
      };
    }),
    currUserInConvoArrIndex: convo.usersInConvo.findIndex(
      (user) => user.userId !== convo.otherUser.id
    ),
  };
};

export const updateBothUsers = (convo) => {
  let updatedMessageArr = [];

  return {
    ...convo,
    messages: convo.messages.map((message) => {
      message.isRead = true;
      updatedMessageArr.push(message);
      return message;
    }),
    usersInConvo: convo.usersInConvo.map((user) => {
      return {
        ...user,
        currActiveConvo: convo.id,
        lastReadMessage: getLastReadMessage(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
        unreadMessagesCount: countUnreadMessages(user.userId, [
          ...convo.messages,
          updatedMessageArr,
        ]),
      };
    }),
    currUserInConvoArrIndex: convo.usersInConvo.findIndex(
      (user) => user.userId !== convo.otherUser.id
    ),
  };
};
