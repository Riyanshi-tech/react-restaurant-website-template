/**
 * Resolve public frontend base URL for QR codes.
 * Prefer browser Origin/Referer so QR matches the domain the admin is on.
 */
export const getAppBaseUrl = (req) => {
  const origin = req?.headers?.origin;
  if (origin) return String(origin).replace(/\/$/, '');

  const referer = req?.headers?.referer;
  if (referer) {
    try {
      const u = new URL(referer);
      return `${u.protocol}//${u.host}`;
    } catch {
      // fall through
    }
  }

  return (process.env.FRONTEND_URL || 'http://localhost:8080').replace(/\/$/, '');
};
