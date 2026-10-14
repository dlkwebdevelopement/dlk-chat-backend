import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    text: { type: String, trim: true },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file', 'voice_note', 'system'],
      default: 'text',
    },
    attachments: [{ url: String, mimeType: String, fileName: String, size: Number }],
    reactions: [
      {
        emoji: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Chat || mongoose.model('Chat', messageSchema);
