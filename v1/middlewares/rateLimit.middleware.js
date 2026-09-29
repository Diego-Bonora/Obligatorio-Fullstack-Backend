import rateLimit, { ipKeyGenerator } from "express-rate-limit";

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  // Only failed attempts count, so normal logins (Postman runs, a class on one IP) never get blocked.
  skipSuccessfulRequests: true,
  // Per IP + username: failed attempts on one account don't lock other accounts on the same IP.
  keyGenerator: (req) => `${ipKeyGenerator(req.ip)}:${String(req.body?.username ?? "")}`,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    message: "Demasiados intentos de inicio de sesión, intentá de nuevo en 15 minutos",
    details: null,
  },
});
