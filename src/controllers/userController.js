import User from '../models/User.js';

export const getDirectory = async (req, res) => {
  try {
    // Only return users who are employees or customers and are not blocked.
    // Explicitly select only non-sensitive fields.
    const users = await User.find({
      role: { $in: ['employee', 'customer'] },
      isBlocked: false,
    }).select('_id fullName role email profilePhoto department');

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching user directory:', error);
    res.status(500).json({ message: 'Failed to fetch user directory' });
  }
};
