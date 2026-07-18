import dotenv from 'dotenv';
dotenv.config();  

import express from 'express';
import authRouter from './routers/authRouter.js';
import courseRouter from './routers/courseRouter.js';
import enrollmentRouter from './routers/enrollmentRouter.js';
import quizRouter from './routers/quizRouter.js';

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api', quizRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable." });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Le serveur "mini-Moodle" écoute activement sur le port ${PORT}`);
});
