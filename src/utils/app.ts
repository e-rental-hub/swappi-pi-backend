import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { connectDB } from '../config/db';
import mainRouter from '../routes'; // Your main router from routes/index.ts
import userRoutes from '../routes/user.routes';
import cookieParser from 'cookie-parser';
import requestLogger from "../middlewares/logger";
import { env } from './env';
import paymentsRouter from '../routes/payment.routes';
import paymentMethodRoutes from '../routes/paymentAccount.routes';

const app: Application = express();

// Connect Database
connectDB();

// Middlewares
app.use(cookieParser());
app.use(express.json()); // Parses incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: env.CORS_ORIGIN_URL,
    credentials: true
}));
app.use(requestLogger);

// API Routes
app.use("/api/v1", mainRouter);
app.use("/api/v1/users", userRoutes); 
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/payment-accounts', paymentMethodRoutes);

// Basic Error Handler (can be expanded)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Something broke!', error: err.message });
});

export default app;