import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import connectDB from './utils/db';
import authRoutes from './routes/auth';
import vaultRoutes from './routes/vault';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();

app.use(helmet());

// CORS handling:
// - In production, respect ALLOWED_ORIGINS (comma-separated) and only allow those origins.
// - In non-production, allow the request origin (development-friendly) so local frontend can talk to backend.
if (process.env.NODE_ENV === 'production') {
	const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
	if (allowed.length > 0) {
		app.use(cors({ origin: (origin, cb) => {
			if (!origin) return cb(null, true);
			if (allowed.includes(origin)) return cb(null, true);
			return cb(new Error('Not allowed by CORS'));
		}, credentials: true }));
	} else {
		// No allowed origins configured: default to strict (no CORS).
		app.use(cors());
	}
} else {
	// Development-friendly: echo request origin and allow Authorization header
	app.use((req, res, next) => {
		const origin = req.headers.origin || '*';
		res.header('Access-Control-Allow-Origin', origin);
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
		if (req.method === 'OPTIONS') {
			return res.sendStatus(200);
		}
		next();
	});
	app.use(cors());
}
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/vault', vaultRoutes);

app.use(errorHandler);

export default app;
