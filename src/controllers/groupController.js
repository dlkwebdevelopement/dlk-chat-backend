import Group from '../models/Group.js';
import User from '../models/User.js';

export const createGroup = async (req, res) => {
  const { name, description, memberIds = [], department, isPrivate } = req.body;
  if (!name) {
    res.status(400);
    throw new Error('Group name is required');
  }

  const members = await User.find({ _id: { $in: memberIds } });
  const group = await Group.create({
    name,
    description,
    members: members.map((user) => user._id),
    admins: [req.user._id],
    department,
    isPrivate: Boolean(isPrivate),
  });

  res.status(201).json({ group });
};

export const getGroups = async (req, res) => {
  const groups = await Group.find().populate('members', 'fullName currentStatus isOnline');
  res.status(200).json({ groups });
};

export const updateGroup = async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  Object.assign(group, req.body);
  await group.save();
  res.status(200).json({ group });
};

export const deleteGroup = async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }
  await group.remove();
  res.status(200).json({ message: 'Group removed' });
};

export const addGroupMember = async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  const user = await User.findById(req.body.userId);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!group.members.includes(user._id)) {
    group.members.push(user._id);
  }
  await group.save();
  res.status(200).json({ group });
};

export const removeGroupMember = async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error('Group not found');
  }

  group.members = group.members.filter((memberId) => memberId.toString() !== req.body.userId);
  await group.save();
  res.status(200).json({ group });
};
