import express from 'express';
import prisma from '../config/prisma.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = express.Router();

// INSCRIPTION D'UN ÉTUDIANT À UN COURS
router.post('/subscribe', protect, restrictTo('ETUDIANT'), async (req, res) => {
  const { courseId } = req.body;
  try {
    const enrollment = await prisma.enrollment.create({
      data: { studentId: req.user.id, courseId, status: 'ACTIF' }
    });
    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: "Vous êtes déjà inscrit à ce cours." });
  }
});

// SUIVI / MISE À JOUR DE LA PROGRESSION
router.patch('/:id/progress', protect, async (req, res) => {
  const { progression, scoreTotal, status } = req.body;
  try {
    const updated = await prisma.enrollment.update({
      where: { id: req.params.id },
      data: { progression, scoreTotal, status }
    });
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: "Fiche de suivi introuvable." });
  }
});

export default router;
