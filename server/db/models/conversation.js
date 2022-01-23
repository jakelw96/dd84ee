const { Sequelize } = require("sequelize");
const db = require("../db");

const Conversation = db.define("conversation", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
  },
});

// find conversation given two user Ids

Conversation.findConversation = async function (convoId) {
  const conversation = await Conversation.findOne({
    where: {
      id: convoId,
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;
