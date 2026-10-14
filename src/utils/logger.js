export const logger = {
  info: (...args) => console.log('[TeamConnect]', ...args),
  warn: (...args) => console.warn('[TeamConnect]', ...args),
  error: (...args) => console.error('[TeamConnect]', ...args),
};
