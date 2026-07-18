import express from 'express';
import prisma from '../config/prisma.js';
import { fetchQuizQuestions } from '../services/triviaService.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GÉNÉRATION D'UN QUIZ DE 5 QUESTIONS DEPUIS L'API EXTERNE (🔒 FORMATEUR)
router.post('/lessons/:lessonId/quiz', protect, restrictTo('FORMATEUR'), async (req, res) => {
  const { lessonId } = req.params;
  const { title } = req.body;

  try {
    const apiQuestions = await fetchQuizQuestions();

    const quiz = await prisma.quiz.create({
      data: {
        title: title || "Quiz d'Évaluation",
        scoreMax: 5,
        lessonId: lessonId,
        questions: {
          create: apiQuestions.map((q) => ({
            text: q.text,
            correctAnswer: q.correctAnswer,
            externalId: Math.random().toString(36).substring(7),
          })),
        },
      },
      include: { questions: true },
    });

    res.status(201).json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
