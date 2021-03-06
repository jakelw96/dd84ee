import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setSearchedUsers,
  updateConversation,
} from "../conversations";
import { gotUser, setFetchingStatus } from "../user";

axios.interceptors.request.use(async function (config) {
  const token = await localStorage.getItem("messenger-token");
  config.headers["x-access-token"] = token;

  return config;
});

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    await localStorage.setItem("messenger-token", data.token);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");
    await localStorage.removeItem("messenger-token");
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");

    // Loops through each object returned from the API and arranges messages array from
    // oldest to newest
    data.forEach((convo) => {
      convo.messages.sort((x, y) => {
        return x.createdAt.localeCompare(y.createdAt);
      });
    });

    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);

  return data;
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    sender: data.sender,
  });
};

export const updateConvo = (conversation) => {
  socket.emit("update-conversation", conversation);
};

export const updateCurrConvo = (userId, currConvoId) => {
  socket.emit("update-curr-convo", { userId, currConvoId });
};

// message format to send: {recipientId, text, conversationId}
// conversationId will be set to null if its a brand new conversation
export const postMessage = (body) => async (dispatch, getState) => {
  try {
    const data = await saveMessage(body);
    const state = getState();

    if (!body.conversationId) {
      dispatch(addConversation(body.recipientId, data.message, state.user.id));
    } else {
      dispatch(setNewMessage(data.message, data.sender, body.recipientId));
    }

    sendMessage(data, body);
    if (body.conversation.usersInConvo) {
      updateConvo(body.conversation);
      dispatch(updateConversationData(body.conversation));
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};

const updateMessages = async (conversation, activeConversation) => {
  const { data } = await axios.put("/api/messages/", {
    conversation,
    activeConversation,
  });

  return data;
};

export const updateConversationData =
  (conversation) => async (dispatch, getState) => {
    try {
      const state = getState();

      const convoId = await updateMessages(
        conversation,
        state.activeConversation
      );

      dispatch(updateConversation(convoId, state.activeConversation));
    } catch (error) {
      console.error(error);
    }
  };
