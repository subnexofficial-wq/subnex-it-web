import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

// Hash password
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// JWT create
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// JWT verify
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}


// Hash password
export async function hashAdminPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Compare password
export async function compareAdminPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Create Admin JWT
export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

// Verify Admin JWT
export function verifyAdminToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}
