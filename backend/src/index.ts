import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from './routes/auth';
import gamesRouter from './routes/games';
import trainingsRouter from './routes/trainings';
import arenasRouter from './routes/arenas';
import profileRouter from './routes/profile';
import chatRouter from './routes/chat';

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:5174';

// --- Middleware ---
app.use(
  cors({
    origin: [ALLOWED_ORIGIN, 'http://localhost:5174'],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// --- Health check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// --- API Routes ---
app.use('/api/auth', authRouter);
app.use('/api/games', gamesRouter);
app.use('/api/trainings', trainingsRouter);
app.use('/api/arenas', arenasRouter);
app.use('/api/profile', profileRouter);
app.use('/api/chat', chatRouter);

// --- 404 fallback ---
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// --- Start ---
app.listen(PORT, () => {
  console.log(`НаХоккей API запущен на порту ${PORT} [${process.env.NODE_ENV}]`);
});

export default app;
