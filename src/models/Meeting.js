import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'ended', 'cancelled'],
      default: 'scheduled',
    },
    agenda: String,
    meetingUrl: String,
  },
  { timestamps: true }
);

export default mongoose.models.Meeting || mongoose.model('Meeting', meetingSchema);
