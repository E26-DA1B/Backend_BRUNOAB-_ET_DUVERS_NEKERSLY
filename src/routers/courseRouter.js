import express from 'express';
import prisma from '../config/prisma.js';
import {
  protect,
  restrictTo,
  optionalProtect
} from '../middlewares/authMiddleware.js';

const router = express.Router();

const allowedLevels = [
  'DEBUTANT',
  'INTERMEDIAIRE',
  'AVANCE'
];

// LISTER LES COURS AVEC FILTRES ET PAGINATION
router.get('/', optionalProtect, async (req, res) => {
  try {
    const page = Math.max(
      parseInt(req.query.page, 10) || 1,
      1
    );

    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      50
    );

    const search = req.query.search?.trim() || '';
    const level = req.query.level?.toUpperCase();

    if (level && !allowedLevels.includes(level)) {
      return res.status(400).json({
        message:
          'Niveau invalide. Utilisez DEBUTANT, INTERMEDIAIRE ou AVANCE.'
      });
    }

    const where = {
      ...(level && { level }),
      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            description: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      })
    };

    const [courses, total] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        include: {
          teacher: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              lessons: true,
              enrollments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),

      prisma.course.count({ where })
    ]);

    return res.status(200).json({
      data: courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des cours.'
    });
  }
});

// CONSULTER LES LEÇONS D'UN COURS DANS L'ORDRE
router.get('/:id/lessons', optionalProtect, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: req.params.id
      },
      select: {
        id: true
      }
    });

    if (!course) {
      return res.status(404).json({
        message: 'Cours introuvable.'
      });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        courseId: req.params.id
      },
      orderBy: {
        order: 'asc'
      }
    });

    return res.status(200).json(lessons);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération des leçons.'
    });
  }
});

// CONSULTER UN COURS
router.get('/:id', optionalProtect, async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        id: req.params.id
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true
          }
        },
        lessons: {
          orderBy: {
            order: 'asc'
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    });

    if (!course) {
      return res.status(404).json({
        message: 'Cours introuvable.'
      });
    }

    return res.status(200).json(course);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erreur lors de la récupération du cours.'
    });
  }
});

// CRÉER UN COURS
router.post(
  '/',
  protect,
  restrictTo('FORMATEUR'),
  async (req, res) => {
    const { title, description, level } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: 'Le titre et la description sont obligatoires.'
      });
    }

    const selectedLevel = level?.toUpperCase() || 'DEBUTANT';

    if (!allowedLevels.includes(selectedLevel)) {
      return res.status(400).json({
        message:
          'Niveau invalide. Utilisez DEBUTANT, INTERMEDIAIRE ou AVANCE.'
      });
    }

    try {
      const newCourse = await prisma.course.create({
        data: {
          title: title.trim(),
          description: description.trim(),
          level: selectedLevel,
          teacherId: req.user.id
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return res.status(201).json(newCourse);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erreur lors de la création du cours.'
      });
    }
  }
);

// MODIFIER UN COURS
router.put(
  '/:id',
  protect,
  restrictTo('FORMATEUR'),
  async (req, res) => {
    const { title, description, level } = req.body;

    try {
      const course = await prisma.course.findUnique({
        where: {
          id: req.params.id
        }
      });

      if (!course) {
        return res.status(404).json({
          message: 'Cours introuvable.'
        });
      }

      if (course.teacherId !== req.user.id) {
        return res.status(403).json({
          message: 'Vous ne pouvez modifier que vos propres cours.'
        });
      }

      const selectedLevel = level?.toUpperCase();

      if (
        selectedLevel &&
        !allowedLevels.includes(selectedLevel)
      ) {
        return res.status(400).json({
          message:
            'Niveau invalide. Utilisez DEBUTANT, INTERMEDIAIRE ou AVANCE.'
        });
      }

      const updatedCourse = await prisma.course.update({
        where: {
          id: req.params.id
        },
        data: {
          ...(title !== undefined && {
            title: title.trim()
          }),
          ...(description !== undefined && {
            description: description.trim()
          }),
          ...(selectedLevel && {
            level: selectedLevel
          })
        },
        include: {
          teacher: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      return res.status(200).json(updatedCourse);
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erreur lors de la modification du cours.'
      });
    }
  }
);

// SUPPRIMER UN COURS
router.delete(
  '/:id',
  protect,
  restrictTo('FORMATEUR'),
  async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: {
          id: req.params.id
        }
      });

      if (!course) {
        return res.status(404).json({
          message: 'Cours introuvable.'
        });
      }

      if (course.teacherId !== req.user.id) {
        return res.status(403).json({
          message: 'Vous ne pouvez supprimer que vos propres cours.'
        });
      }

      await prisma.course.delete({
        where: {
          id: req.params.id
        }
      });

      return res.status(204).send();
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: 'Erreur lors de la suppression du cours.'
      });
    }
  }
);

export default router;