import express from 'express';
import prisma from '../config/prisma.js';
import { protect, restrictTo, optionalProtect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// LISTER TOUS LES COURS (Public)
router.get('/', optionalProtect, async (req, res) => {
  const courses = await prisma.course.findMany({
    include: { teacher: { select: { name: true } } }
  });
  res.json(courses);
});

// CONSULTER LES LEÇONS D'UN COURS DANS L'ORDRE
router.get('/:id/lessons', optionalProtect, async (req, res) => {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { courseId: req.params.id },
      orderBy: { order: 'asc' }
    });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur." });
  }
});

// CRÉER UN COURS
router.post('/', protect, restrictTo('FORMATEUR'), async (req, res) => {
  const { title, description, level } = req.body;
  try {
    const newCourse = await prisma.course.create({
      data: { title, description, level, teacherId: req.user.id } // Remettre req.user.id
    });

    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: "Données invalides." });
  }
});

// MODIFIER UN COURS (🔒 FORMATEUR)
router.put('/:id', protect, restrictTo('FORMATEUR'), async (req, res) => {
  try {
    const updated = await prisma.course.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(updated);
  } catch (error) {
    res.status(404).json({ message: "Cours introuvable." });
  }
});

// SUPPRIMER UN COURS (🔒 FORMATEUR)
router.delete('/:id', protect, restrictTo('FORMATEUR'), async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "Cours introuvable." });
  }
});

export default router;
