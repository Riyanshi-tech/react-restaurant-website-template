import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { ApiError } from './utils/apiError.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import publicTableRoutes from './routes/publicTableRoutes.js';

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(cors({
  origin: true, // We will refine this based on the frontend origin later
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 2. ROUTES
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy and running'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/public/tables', publicTableRoutes);

// 3. UNHANDLED ROUTES HANDLER
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 4. GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export default app;
