const router = require("express").Router();
const e = require("express");
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({
        senderId,
        text,
        conversationId,
      });

      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/", (req, res, next) => {
  const { conversation, activeConversation } = req.body;

  try {
    const usersInConvoIDs = conversation.usersInConvo.map((user) => {
      return user.userId;
    });

    if (!req.user) {
      return res.sendStatus(401);
    } else {
      if (!usersInConvoIDs.includes(req.user.dataValues.id)) {
        return res.sendStatus(403);
      }
    }

    if (conversation.messages.length > 0) {
      if (activeConversation === conversation.otherUser.username) {
        if (
          conversation.usersInConvo.every((user) => {
            return user.currActiveConvo === conversation.id;
          })
        ) {
          Message.update({
            isRead: true,
          });
        } else {
          Message.update(
            {
              isRead: true,
            },
            {
              where: {
                senderId: conversation.otherUser.id,
              },
            }
          );
        }
      } else {
        Message.update(
          {
            isRead: true,
          },
          {
            where: {
              senderId: usersInConvoIDs.find(
                (userId) => userId !== conversation.otherUser.id
              ),
            },
          }
        );
      }
    }

    res.json(conversation.id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
