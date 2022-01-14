import React from "react";
import { Box, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: 20,
    flexGrow: 1,
  },
  username: {
    fontWeight: "bold",
    letterSpacing: -0.2,
  },
  previewText: {
    fontSize: 12,
    color: "#9CADC8",
    letterSpacing: -0.17,
  },
  messageNotification: {
    backgroundColor: "#6CC1FF",
    borderRadius: 85,
    color: "white",
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 3,
    paddingTop: 3,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 12,
  },
}));

const ChatContent = (props) => {
  const classes = useStyles();

  const { conversation } = props;
  const { latestMessageText, otherUser } = conversation;

  let unreadMessageCounter = 0;

  conversation.messages.forEach((message) => {
    if (message.senderId === conversation.otherUser.id) {
      if (message.isRead === false) {
        unreadMessageCounter += 1;
      }
    }
  });

  return (
    <Box className={classes.root}>
      <Box>
        <Typography className={classes.username}>
          {otherUser.username}
        </Typography>
        <Typography className={classes.previewText}>
          {latestMessageText}
        </Typography>
      </Box>
      {/* If there are unread messages, display notification counter */}
      {unreadMessageCounter > 0 && (
        <Box className={classes.messageNotification}>
          <Typography>{unreadMessageCounter}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default ChatContent;
