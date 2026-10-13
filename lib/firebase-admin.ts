import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

export function getAdminAuth(): Auth | null {
  if (!isFirebaseAdminConfigured) return null;

  try {
    const app = getApps().length
      ? getApp()
      : initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
    return getAuth(app);
  } catch {
    return null;
  }
}

export function isAdminEmail(email: string | undefined) {
  return Boolean(email && process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase());
}
