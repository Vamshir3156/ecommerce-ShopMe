import jwt from "jsonwebtoken";
export const signAccessToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });
export const signRefreshToken = (payload, secret, expiresIn) =>
  jwt.sign(payload, secret, { expiresIn });
export const verifyToken = (token, secret) => jwt.verify(token, secret);
