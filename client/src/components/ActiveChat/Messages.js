import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { connect } from "react-redux";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import { updateConversationData } from "../../store/utils/thunkCreators";
import moment from "moment";

const useStyles = makeStyles(() => ({
  readIcon: {
    height: 23,
    width: 23,
    borderRadius: 50,
    float: "right",
  },
}));

const Messages = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;

  return (
    <Box>
      {conversation.messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");

        return message.senderId === user.id ? (
          <Box key={message.id}>
            <SenderBubble text={message.text} time={time} />
            {/* Profile image icon indicating a message was read,
            only appears when the last messages from other user is read */}
            {conversation.usersInConvo[conversation.currUserInConvoArrIndex]
              .lastReadMessage.id === message.id && (
              <img
                src={conversation.otherUser.photoUrl}
                alt="Read"
                className={classes.readIcon}
              />
            )}
          </Box>
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={conversation.otherUser}
          />
        );
      })}
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateConversationData: (conversation) => {
      dispatch(updateConversationData(conversation));
    },
  };
};

export default connect(null, mapDispatchToProps)(Messages);
