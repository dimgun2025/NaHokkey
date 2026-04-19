import * as admin from 'firebase-admin';

let initialized = false;

function init() {
  if (initialized) return;
  const serviceAccountPath = process.env.FIREBASE_CREDENTIALS;
  if (!serviceAccountPath) {
    console.warn('[FCM] FIREBASE_CREDENTIALS не задан — push-уведомления отключены');
    return;
  }
  try {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    initialized = true;
    console.log('[FCM] Firebase инициализирован');
  } catch (err) {
    console.warn('[FCM] Не удалось инициализировать Firebase:', err);
  }
}

init();

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
}

/**
 * Отправить push-уведомление одному пользователю по FCM token.
 */
export async function sendPush(fcmToken: string, payload: PushPayload): Promise<void> {
  if (!initialized) {
    console.log(`[PUSH TEST] → ${fcmToken.slice(0, 20)}... | ${payload.title}: ${payload.body}`);
    return;
  }

  try {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title: payload.title, body: payload.body },
      data: payload.data,
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/icons/icon-192.png',
          badge: '/icons/badge-72.png',
        },
      },
    });
  } catch (err) {
    console.error(`[FCM] Ошибка отправки push для ${fcmToken.slice(0, 20)}:`, err);
  }
}

/**
 * Отправить push нескольким пользователям.
 */
export async function sendPushMulti(fcmTokens: string[], payload: PushPayload): Promise<void> {
  if (!fcmTokens.length) return;
  await Promise.allSettled(fcmTokens.map((t) => sendPush(t, payload)));
}
