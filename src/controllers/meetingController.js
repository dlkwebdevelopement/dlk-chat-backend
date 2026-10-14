import Meeting from '../models/Meeting.js';

export const createMeeting = async (req, res) => {
  const { title, description, startTime, endTime, participants = [], agenda, meetingUrl } = req.body;
  if (!title || !startTime || !endTime) {
    res.status(400);
    throw new Error('Title, start time and end time are required');
  }

  const meeting = await Meeting.create({
    title,
    description,
    host: req.user._id,
    participants,
    startTime,
    endTime,
    agenda,
    meetingUrl,
  });

  res.status(201).json({ meeting });
};

export const getMeetings = async (req, res) => {
  const meetings = await Meeting.find().populate('host', 'fullName role');
  res.status(200).json({ meetings });
};

export const updateMeeting = async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  Object.assign(meeting, req.body);
  await meeting.save();
  res.status(200).json({ meeting });
};

export const deleteMeeting = async (req, res) => {
  const meeting = await Meeting.findById(req.params.id);
  if (!meeting) {
    res.status(404);
    throw new Error('Meeting not found');
  }

  await meeting.remove();
  res.status(200).json({ message: 'Meeting deleted' });
};
