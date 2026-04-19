import { Pool } from 'pg';
import { mockPool } from './mockPool';

const useMock = process.env.DB_MOCK === 'true' || !process.env.DATABASE_URL;

let pool: any;

if (useMock) {
  console.log('⚠️ [DB] Запуск в режиме MOCK (демо-данные без PostgreSQL)');
  pool = mockPool;
} else {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  pool.on('error', (err: any) => {
    console.error('Ошибка подключения к PostgreSQL:', err);
    process.exit(-1);
  });
}

export default pool;
