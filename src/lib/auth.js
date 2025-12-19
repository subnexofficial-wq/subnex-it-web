import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12");
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

/* ================= USER ================= */

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

// JWT verify (manual token)
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/* ================= ADMIN ================= */

// Create Admin JWT
export function signAdminToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES,
  });
}

// ✅ FIXED: Async cookie-based verify
export async function verifyAdminToken() {
  try {
    const cookieStore = await cookies(); 
    const token = cookieStore.get("adminToken")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") return null;
    if (decoded.aud !== "admin-panel") return null;

    return decoded;
  } catch (err) {
    console.error("Admin token verify failed:", err.message);
    return null;
  }
}