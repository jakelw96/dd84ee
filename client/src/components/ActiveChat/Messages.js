import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const useStyles = makeStyles(() => ({
  profilePic: {
    height: 23,
    width: 23,
    borderRadius: 50,
    float: "right",
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { messages, otherUser, userId } = props;

  // Function to filter array and return the ID for the last read message
  // from the other user
  const lastMessageRead = () => {
    let filteredArr = [];

    messages.forEach((message) => {
      if (message.senderId !== otherUser.id) {
        if (message.isRead === true) {
          filteredArr.push(message);
        }
      }
    });

    const latestMessage = filteredArr[filteredArr.length - 1];

    if (latestMessage) {
      return latestMessage.id;
    } else {
      return false;
    }
  };

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === userId ? (
          <>
            <SenderBubble key={message.id} text={message.text} time={time} />
            {/* Profile image icon indicating a message was read,
            only appears when the last messages from other user is read */}
            {lastMessageRead() === message.id && (
              <img
                key={otherUser.id}
                src={otherUser.photoUrl}
                alt="Read"
                className={classes.profilePic}
              />
            )}
          </>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser}
          />
        );
      })}
    </Box>
  );
};

export default Messages;
