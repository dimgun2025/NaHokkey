import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const SHOP_ID = process.env.YOOKASSA_SHOP_ID || '';
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY || '';
const BASE_URL = 'https://api.yookassa.ru/v3';

const TEST_MODE = !SHOP_ID || !SECRET_KEY;

function auth() {
  return { username: SHOP_ID, password: SECRET_KEY };
}

export interface CreatePaymentParams {
  amount: number;           // в рублях
  description: string;
  returnUrl: string;
  metadata?: Record<string, string>;
}

export interface YooPayment {
  id: string;
  status: string;           // pending | waiting_for_capture | succeeded | canceled
  confirmation?: { confirmation_url: string };
  amount: { value: string; currency: string };
}

/**
 * Создать платёж с холдированием (capture: false).
 * Деньги резервируются, но НЕ списываются.
 */
export async function createPayment(params: CreatePaymentParams): Promise<YooPayment> {
  if (TEST_MODE) {
    const fakeId = uuidv4();
    console.log(`[YOO TEST] Создан тестовый платёж ${fakeId} на ${params.amount} ₽`);
    return {
      id: fakeId,
      status: 'waiting_for_capture',
      confirmation: { confirmation_url: `/payment-success?test=1&amount=${params.amount}` },
      amount: { value: params.amount.toFixed(2), currency: 'RUB' },
    };
  }

  const idempotenceKey = uuidv4();
  const { data } = await axios.post(
    `${BASE_URL}/payments`,
    {
      amount: { value: params.amount.toFixed(2), currency: 'RUB' },
      capture: false,          // ХОЛД — не списывать сразу
      confirmation: { type: 'redirect', return_url: params.returnUrl },
      description: params.description,
      metadata: params.metadata,
    },
    {
      auth: auth(),
      headers: { 'Idempotence-Key': idempotenceKey, 'Content-Type': 'application/json' },
    }
  );
  return data;
}

/**
 * Списать зарезервированные средства (capture).
 * Вызывается после окончания игры/тренировки.
 */
export async function capturePayment(yookassaId: string, amount: number): Promise<YooPayment> {
  if (TEST_MODE) {
    console.log(`[YOO TEST] Capture платежа ${yookassaId} на ${amount} ₽`);
    return { id: yookassaId, status: 'succeeded', amount: { value: amount.toFixed(2), currency: 'RUB' } };
  }

  const { data } = await axios.post(
    `${BASE_URL}/payments/${yookassaId}/capture`,
    { amount: { value: amount.toFixed(2), currency: 'RUB' } },
    { auth: auth(), headers: { 'Idempotence-Key': uuidv4(), 'Content-Type': 'application/json' } }
  );
  return data;
}

/**
 * Отмена / возврат платежа.
 * До capture → cancel (деньги не списаны).
 * После capture → создаём refund.
 */
export async function refundPayment(yookassaId: string, amount: number, reason?: string): Promise<{ id: string; status: string }> {
  if (TEST_MODE) {
    console.log(`[YOO TEST] Возврат платежа ${yookassaId} на ${amount} ₽, причина: ${reason}`);
    return { id: uuidv4(), status: 'succeeded' };
  }

  const idempotenceKey = uuidv4();
  const { data } = await axios.post(
    `${BASE_URL}/refunds`,
    {
      payment_id: yookassaId,
      amount: { value: amount.toFixed(2), currency: 'RUB' },
      description: reason || 'Возврат по запросу пользователя',
    },
    { auth: auth(), headers: { 'Idempotence-Key': idempotenceKey, 'Content-Type': 'application/json' } }
  );
  return data;
}

/**
 * Получить статус платежа.
 */
export async function getPayment(yookassaId: string): Promise<YooPayment> {
  if (TEST_MODE) {
    return { id: yookassaId, status: 'waiting_for_capture', amount: { value: '0', currency: 'RUB' } };
  }

  const { data } = await axios.get(`${BASE_URL}/payments/${yookassaId}`, { auth: auth() });
  return data;
}
