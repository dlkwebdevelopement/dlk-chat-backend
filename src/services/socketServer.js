import User from '../models/User.js';
import Chat from '../models/Chat.js';

export const socketServer = (io) => {
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('join_group', (groupId) => {
      socket.join(groupId);
    });

    socket.on('user_online', async (payload) => {
      const { userId } = payload;
      if (!userId) return;
      onlineUsers.set(userId, socket.id);
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date(), 'currentStatus.type': 'online' });
      io.emit('user_online', { userId });
    });

    socket.on('user_offline', async (payload) => {
      const { userId } = payload;
      onlineUsers.delete(userId);
      await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date(), 'currentStatus.type': 'offline' });
      io.emit('user_offline', { userId });
    });

    socket.on('typing', (payload) => {
      io.to(payload.roomId || 'global').emit('typing', payload);
    });

    socket.on('stop_typing', (payload) => {
      io.to(payload.roomId || 'global').emit('stop_typing', payload);
    });

    socket.on('voice_recording', (payload) => {
      io.emit('voice_recording', payload);
    });

    socket.on('stop_voice_recording', (payload) => {
      io.emit('stop_voice_recording', payload);
    });

    socket.on('audio_call_started', (payload) => {
      io.emit('audio_call_started', payload);
    });

    socket.on('audio_call_ended', (payload) => {
      io.emit('audio_call_ended', payload);
    });

    socket.on('video_call_started', (payload) => {
      io.emit('video_call_started', payload);
    });

    socket.on('video_call_ended', (payload) => {
      io.emit('video_call_ended', payload);
    });

    socket.on('meeting_joined', (payload) => {
      io.emit('meeting_joined', payload);
    });

    socket.on('meeting_left', (payload) => {
      io.emit('meeting_left', payload);
    });

    socket.on('screen_share_started', (payload) => {
      io.emit('screen_share_started', payload);
    });

    socket.on('screen_share_ended', (payload) => {
      io.emit('screen_share_ended', payload);
    });

    socket.on('send_message', async (message) => {
      // The message is already saved via the HTTP POST /chat/send endpoint.
      // We just need to broadcast it to the receiver or group.
      if (message.group) {
        io.to(message.group).emit('new_message', message);
      } else if (message.receiver) {
        io.to(message.receiver).emit('new_message', message);
      } else {
        io.emit('new_message', message); // Fallback
      }
    });

    socket.on('disconnect', () => {
      io.emit('user_disconnected', { socketId: socket.id });
    });
  });
};
