const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const UserConversation = require("./userConversation");
const UserMessage = require("./userMessage");

// associations

User.belongsToMany(Conversation, {
  through: UserConversation,
});
Conversation.belongsToMany(User, {
  through: UserConversation,
});
User.belongsToMany(Message, {
  through: UserMessage,
  as: "read_by",
});
Message.belongsToMany(User, {
  through: UserMessage,
  as: "read_by",
});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  UserConversation,
  UserMessage,
};
