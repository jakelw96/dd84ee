const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const userConversation = require("./userConversation");

// associations

User.belongsToMany(Conversation, {
  through: userConversation,
});
Conversation.belongsToMany(User, {
  through: userConversation,
});
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  userConversation,
};
