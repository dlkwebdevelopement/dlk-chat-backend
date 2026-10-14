import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    admins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    department: String,
    isPrivate: { type: Boolean, default: false },
    status: { type: String, default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.models.Group || mongoose.model('Group', groupSchema);
