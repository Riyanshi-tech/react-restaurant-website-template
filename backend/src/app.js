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
import dashboardRoutes from './routes/dashboardRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import { getMenuItems } from './controllers/menuController.js';
import { getPublicBill } from './controllers/publicTableController.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

const app = express();

// 1. GLOBAL MIDDLEWARES
app.use(cors({
  origin: true,
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
app.get('/api/public/menu', getMenuItems);
app.get('/api/public/bills/:slug', getPublicBill);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// 3. UNHANDLED ROUTES HANDLER
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// 4. GLOBAL ERROR HANDLING MIDDLEWARE
app.use(errorHandler);

export default app;
