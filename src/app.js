import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import authRouter from './routers/authRouter.js';
import courseRouter from './routers/courseRouter.js';
import enrollmentRouter from './routers/enrollmentRouter.js';
import quizRouter from './routers/quizRouter.js';
import userRouter from './routers/userRouter.js';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API Mini-Moodle fonctionnelle.'
  });
});

app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/users', userRouter);
app.use('/api', quizRouter);

app.use((req, res) => {
  res.status(404).json({
    message: 'Route introuvable.'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `🚀 Le serveur "mini-Moodle" écoute activement sur le port ${PORT}`
  );
});