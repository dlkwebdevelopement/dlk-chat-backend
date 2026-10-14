import Notification from '../models/Notification.js';

export const getNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json({ notifications });
};

export const markNotificationAsRead = async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification || notification.user.toString() !== req.user._id.toString()) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.isRead = true;
  await notification.save();
  res.status(200).json({ notification });
};
