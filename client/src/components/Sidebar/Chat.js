import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { updateCurrentConversation } from "../../store/conversations";
import { updateConversationData } from "../../store/utils/thunkCreators";
import { updateConvo, updateCurrConvo } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation, user } = props;
  const { otherUser } = conversation;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    await props.updateCurrentConversation(user.id, conversation.id);
    updateCurrConvo(user.id, conversation.id);

    if (conversation.messages.length > 0) {
      await props.updateConversationData(conversation);

      updateConvo(conversation);
    }
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} user={user} />
    </Box>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    updateConversationData: (conversation) => {
      dispatch(updateConversationData(conversation));
    },
    updateCurrentConversation: (userId, currConvoId) => {
      dispatch(updateCurrentConversation(userId, currConvoId));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
