import rateLimit from "express-rate-limit";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

/** Login: 5 attempts / 15 min / IP. */
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again later." },
});

/** Public enquiry submissions: 10 / 15 min / IP. */
export const enquiryLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many enquiries. Please try again shortly." },
});
