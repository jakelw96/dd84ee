import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
  updateCurrentConversation,
} from "./store/conversations";
import { updateConversationData } from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender, data.recipientId));
  });
  socket.on("update-conversation", (conversation) => {
    store.dispatch(updateConversationData(conversation));
  });
  socket.on("update-curr-convo", (data) => {
    store.dispatch(updateCurrentConversation(data.userId, data.currConvoId));
  });
});

export default socket;
