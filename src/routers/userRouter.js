import express from 'express';

import prisma from '../config/prisma.js';
import {
  protect,
  restrictTo
} from '../middlewares/authMiddleware.js';

const router = express.Router();

const allowedRoles = [
  'ETUDIANT',
  'FORMATEUR',
  'ADMIN'
];

// Toutes les routes de ce fichier sont réservées à ADMIN
router.use(protect);
router.use(restrictTo('ADMIN'));

// LISTER LES UTILISATEURS
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            enrollments: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        'Erreur lors de la récupération des utilisateurs.'
    });
  }
});

// CONSULTER UN UTILISATEUR
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        courses: {
          select: {
            id: true,
            title: true,
            level: true
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erreur lors de la récupération de l'utilisateur."
    });
  }
});

// MODIFIER LE RÔLE D'UN UTILISATEUR
router.patch('/:id/role', async (req, res) => {
  const selectedRole = req.body.role?.toUpperCase();

  if (
    !selectedRole ||
    !allowedRoles.includes(selectedRole)
  ) {
    return res.status(400).json({
      message:
        'Rôle invalide. Utilisez ETUDIANT, FORMATEUR ou ADMIN.'
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: req.params.id
      },
      data: {
        role: selectedRole
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message:
        "Erreur lors de la modification de l'utilisateur."
    });
  }
});

// SUPPRIMER UN UTILISATEUR
router.delete('/:id', async (req, res) => {
  if (req.params.id === req.user.id) {
    return res.status(400).json({
      message:
        'Vous ne pouvez pas supprimer votre propre compte administrateur.'
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.params.id
      }
    });

    if (!user) {
      return res.status(404).json({
        message: 'Utilisateur introuvable.'
      });
    }

    await prisma.user.delete({
      where: {
        id: req.params.id
      }
    });

    return res.status(204).send();
  } catch (error) {
    console.error(error);

    return res.status(409).json({
      message:
        "Impossible de supprimer cet utilisateur tant qu'il possède des cours associés."
    });
  }
});

export default router;