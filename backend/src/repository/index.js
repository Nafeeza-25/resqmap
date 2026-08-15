import { createDemoRepository } from './demoRepository.js';
import { createFirebaseAdminRepository } from './firebaseAdminRepository.js';

export function wantsFirebase(env = process.env) {
  if (env.RESQMAP_BACKEND_MODE === 'firebase') return true;
  if (env.RESQMAP_BACKEND_MODE === 'demo') return false;
  return Boolean(env.FIREBASE_PROJECT_ID && env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY);
}

export async function createRepositoryFromEnv(env = process.env) {
  if (!wantsFirebase(env)) return createDemoRepository();
  return createFirebaseAdminRepository(env);
}
