import express from 'express';

import prisma from '../config/prisma.js';
import {
  protect,
  restrictTo
} from '../middlewares/authMiddleware.js';

const router = express.Router();

const allowedStatuses = [
  'ACTIF',
  'COMPLETE',
  'ABANDONNE'
];

// CONSULTER MES INSCRIPTIONS
router.get(
  '/me',
  protect,
  restrictTo('ETUDIANT'),
  async (req, res) => {
    try {
      const enrollments = await prisma.enrollment.findMany({
        where: {
          studentId: req.user.id
        },
        include: {
          course: {
            include: {
              teacher: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          enrolledAt: 'desc'
        }
      });

      return res.status(200).json(enrollments);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          'Erreur lors de la récupération des inscriptions.'
      });
    }
  }
);

// INSCRIRE UN ÉTUDIANT À UN COURS
router.post(
  '/subscribe',
  protect,
  restrictTo('ETUDIANT'),
  async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
      return res.status(400).json({
        message: "L'identifiant du cours est obligatoire."
      });
    }

    try {
      const course = await prisma.course.findUnique({
        where: {
          id: courseId
        }
      });

      if (!course) {
        return res.status(404).json({
          message: 'Cours introuvable.'
        });
      }

      const existingEnrollment =
        await prisma.enrollment.findUnique({
          where: {
            studentId_courseId: {
              studentId: req.user.id,
              courseId
            }
          }
        });

      if (existingEnrollment) {
        return res.status(409).json({
          message: 'Vous êtes déjà inscrit à ce cours.'
        });
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          studentId: req.user.id,
          courseId,
          status: 'ACTIF'
        },
        include: {
          course: true
        }
      });

      return res.status(201).json(enrollment);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erreur lors de l'inscription au cours."
      });
    }
  }
);

// METTRE À JOUR MA PROGRESSION
router.patch(
  '/:id/progress',
  protect,
  restrictTo('ETUDIANT'),
  async (req, res) => {
    const {
      progression,
      scoreTotal,
      status
    } = req.body;

    try {
      const enrollment =
        await prisma.enrollment.findUnique({
          where: {
            id: req.params.id
          }
        });

      if (!enrollment) {
        return res.status(404).json({
          message: 'Inscription introuvable.'
        });
      }

      if (enrollment.studentId !== req.user.id) {
        return res.status(403).json({
          message:
            'Vous ne pouvez modifier que votre propre progression.'
        });
      }

      if (
        progression !== undefined &&
        (
          typeof progression !== 'number' ||
          progression < 0 ||
          progression > 100
        )
      ) {
        return res.status(400).json({
          message:
            'La progression doit être comprise entre 0 et 100.'
        });
      }

      if (
        scoreTotal !== undefined &&
        (
          !Number.isInteger(scoreTotal) ||
          scoreTotal < 0
        )
      ) {
        return res.status(400).json({
          message:
            'Le score doit être un nombre entier positif.'
        });
      }

      const selectedStatus = status?.toUpperCase();

      if (
        selectedStatus &&
        !allowedStatuses.includes(selectedStatus)
      ) {
        return res.status(400).json({
          message:
            'Statut invalide. Utilisez ACTIF, COMPLETE ou ABANDONNE.'
        });
      }

      const updatedEnrollment =
        await prisma.enrollment.update({
          where: {
            id: req.params.id
          },
          data: {
            ...(progression !== undefined && {
              progression
            }),
            ...(scoreTotal !== undefined && {
              scoreTotal
            }),
            ...(selectedStatus && {
              status: selectedStatus
            })
          },
          include: {
            course: true
          }
        });

      return res.status(200).json(updatedEnrollment);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message:
          'Erreur lors de la mise à jour de la progression.'
      });
    }
  }
);

export default router;