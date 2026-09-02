import express from 'express';
import { randomUUID } from 'crypto';

import prisma from '../config/prisma.js';
import { fetchQuizQuestions } from '../services/triviaService.js';
import {
  protect,
  restrictTo
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// GÉNÉRER UN QUIZ DE 5 QUESTIONS
router.post(
  '/lessons/:lessonId/quiz',
  protect,
  restrictTo('FORMATEUR'),
  async (req, res) => {
    const { lessonId } = req.params;
    const { title } = req.body;

    try {
      const lesson = await prisma.lesson.findUnique({
        where: {
          id: lessonId
        },
        include: {
          course: {
            select: {
              teacherId: true
            }
          }
        }
      });

      if (!lesson) {
        return res.status(404).json({
          message: 'Leçon introuvable.'
        });
      }

      if (lesson.course.teacherId !== req.user.id) {
        return res.status(403).json({
          message:
            'Vous ne pouvez générer un quiz que pour vos propres cours.'
        });
      }

      const apiQuestions = await fetchQuizQuestions();

      const quiz = await prisma.quiz.create({
        data: {
          title: title?.trim() || "Quiz d'évaluation",
          scoreMax: apiQuestions.length,
          lessonId,
          questions: {
            create: apiQuestions.map((question) => ({
              externalId: randomUUID(),
              text: question.text,
              correctAnswer: question.correctAnswer,
              incorrectAnswers: question.incorrectAnswers
            }))
          }
        },
        include: {
          questions: true,
          lesson: {
            select: {
              id: true,
              title: true,
              courseId: true
            }
          }
        }
      });

      return res.status(201).json(quiz);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erreur lors de la génération du quiz.'
      });
    }
  }
);

export default router;