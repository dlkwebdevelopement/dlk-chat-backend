import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      'online',
      'offline',
      'typing',
      'voice_recording',
      'audio_call',
      'video_call',
      'meeting',
      'screen_sharing',
      'busy',
      'away',
    ],
    default: 'offline',
  },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['super_admin', 'company_admin', 'employee', 'customer'],
      default: 'employee',
    },
    employeeId: { type: String, unique: true, sparse: true },
    customerId: { type: String, unique: true, sparse: true },
    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    profilePhoto: String,
    company: String,
    department: String,
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    currentStatus: { type: statusSchema, default: () => ({}) },
    activeCallId: String,
    activeMeetingId: String,
    pushToken: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', userSchema);
