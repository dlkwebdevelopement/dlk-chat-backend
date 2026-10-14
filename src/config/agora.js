import { RtcRole, RtcTokenBuilder, RtmTokenBuilder } from 'agora-access-token';

export const generateAgoraToken = ({ channelName, uid = 0, role = 'publisher', expireSeconds = 3600 }) => {
  const appId = process.env.AGORA_APP_ID;
  const appCertificate = process.env.AGORA_APP_CERTIFICATE;

  if (!appId || !appCertificate) {
    throw new Error('Agora App ID and App Certificate are required');
  }

  const roleValue = role === 'audience' ? RtcRole.AUDIENCE : RtcRole.PUBLISHER;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpireTime = currentTimestamp + expireSeconds;

  return RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, roleValue, privilegeExpireTime);
};
