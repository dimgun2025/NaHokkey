import axios from 'axios';

const SMSC_LOGIN = process.env.SMSC_LOGIN || '';
const SMSC_PASSWORD = process.env.SMSC_PASSWORD || '';
const TEST_MODE = process.env.NODE_ENV !== 'production' || process.env.SMS_TEST === '1';

/**
 * Отправить SMS с OTP-кодом.
 * В режиме разработки только логирует — реальное SMS не отправляется.
 */
export async function sendOtp(phone: string, code: string): Promise<void> {
  if (TEST_MODE) {
    console.log(`[SMS TEST] Номер: ${phone} | Код: ${code}`);
    return;
  }

  const phoneClean = phone.replace(/\D/g, '');
  const text = encodeURIComponent(`НаХоккей: ваш код ${code}`);

  try {
    const url = `https://smsc.ru/sys/send.php?login=${SMSC_LOGIN}&psw=${SMSC_PASSWORD}&phones=${phoneClean}&mes=${text}&fmt=3`;
    const { data } = await axios.get(url, { timeout: 5000 });
    if (data.error_code) {
      throw new Error(`SMSC error: ${data.error}`);
    }
  } catch (err) {
    console.error('[SMS] Ошибка отправки:', err);
    throw new Error('Не удалось отправить SMS. Попробуйте позже.');
  }
}

/**
 * Сгенерировать 4-значный числовой код.
 */
export function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}
