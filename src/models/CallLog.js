import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
  {
    caller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    type: {
      type: String,
      enum: ['audio', 'video', 'group_audio', 'group_video'],
      required: true,
    },
    status: {
      type: String,
      enum: ['initiated', 'missed', 'answered', 'ended', 'cancelled'],
      default: 'initiated',
    },
    channelId: String,
    durationSeconds: { type: Number, default: 0 },
    notes: String,
  },
  { timestamps: true }
);

export default mongoose.models.CallLog || mongoose.model('CallLog', callLogSchema);
