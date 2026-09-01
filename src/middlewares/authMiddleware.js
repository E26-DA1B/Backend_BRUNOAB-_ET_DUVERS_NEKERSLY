import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Vérifie que l'utilisateur est connecté
export const protect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Accès refusé. Token manquant.'
    });
  }

  const token = authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Accès refusé. Token manquant.'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (!currentUser) {
      return res.status(401).json({
        message: "L'utilisateur associé au token n'existe plus."
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token invalide ou expiré.'
    });
  }
};

// Vérifie que l'utilisateur possède un rôle autorisé
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: 'Vous devez être connecté.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Accès interdit. Rôle insuffisant.'
      });
    }

    next();
  };
};

// Autorise une route publique tout en identifiant
// l'utilisateur lorsqu'un token valide est fourni
export const optionalProtect = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next();
  }

  const token = authorization.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    });

    if (currentUser) {
      req.user = currentUser;
    }
  } catch (error) {
    // La route reste publique si le token facultatif est invalide.
  }

  next();
};