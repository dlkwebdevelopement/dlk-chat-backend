import Chat from '../models/Chat.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

export const sendMessage = async (req, res) => {
  const { receiverId, groupId, text, type, attachments } = req.body;
  if (!text && !attachments?.length) {
    res.status(400);
    throw new Error('Message text or attachments are required');
  }

  const message = await Chat.create({
    sender: req.user._id,
    receiver: receiverId,
    group: groupId,
    text,
    type: type || 'text',
    attachments: attachments || [],
  });

  res.status(201).json({ message });
};

export const getConversationMessages = async (req, res) => {
  const { id } = req.params;
  const messages = await Chat.find({
    $or: [
      { receiver: id, sender: req.user._id },
      { receiver: req.user._id, sender: id },
      { group: id },
    ],
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'fullName email employeeId customerId')
    .populate('group', 'name description');

  res.status(200).json({ messages });
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const userGroups = await Group.find({ members: userId }).select('_id');
    const groupIds = userGroups.map(g => g._id);

    const latestMessages = await Chat.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { receiver: userId },
            { group: { $in: groupIds } }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$group", false] },
              "$group",
              {
                $cond: [
                  { $gt: ["$sender", "$receiver"] },
                  { user1: "$sender", user2: "$receiver" },
                  { user1: "$receiver", user2: "$sender" }
                ]
              }
            ]
          },
          message: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$isRead", false] }, { $ne: ["$sender", userId] }] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { "message.createdAt": -1 }
      }
    ]);

    await Chat.populate(latestMessages, [
      { path: 'message.sender', select: 'fullName profilePhoto currentStatus', model: 'User' },
      { path: 'message.receiver', select: 'fullName profilePhoto currentStatus', model: 'User' },
      { path: 'message.group', select: 'name', model: 'Group' }
    ]);

    const conversations = latestMessages.map(item => {
      const msg = item.message;
      let convId, otherUser, isGroup = false, name, avatar, status;

      if (msg.group) {
        convId = msg.group._id.toString();
        isGroup = true;
        name = msg.group.name;
        avatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name);
        status = 'offline';
      } else {
        otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
        if (!otherUser) return null;
        convId = otherUser._id.toString();
        name = otherUser.fullName;
        avatar = otherUser.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name);
        status = otherUser.currentStatus?.type || 'offline';
      }

      return {
        id: convId,
        name,
        avatar,
        status,
        isGroup,
        time: msg.createdAt,
        message: msg.text || (msg.attachments && msg.attachments.length > 0 ? 'Attachment' : ''),
        unread: item.unreadCount,
      };
    }).filter(Boolean);

    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserConversations = async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } })
    .select('fullName email employeeId customerId isOnline currentStatus');
  
  const groups = await Group.find({ members: req.user._id })
    .populate('members', 'fullName');

  const conversations = [
    ...users.map(u => ({
      id: u._id,
      name: u.fullName,
      message: 'Start a conversation...',
      time: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.fullName}`,
      unread: 0,
      status: u.isOnline ? 'online' : 'offline',
      isGroup: false
    })),
    ...groups.map(g => ({
      id: g._id,
      name: g.name,
      message: 'Start a group conversation...',
      time: new Date(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${g.name}`,
      unread: 0,
      status: 'online',
      isGroup: true
    }))
  ];

  res.status(200).json({ conversations });
};
