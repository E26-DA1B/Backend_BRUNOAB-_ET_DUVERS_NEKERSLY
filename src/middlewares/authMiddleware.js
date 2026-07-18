import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const protect = async (req, res, next) => {
  let token;

  // Extraction propre du token depuis le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Récupère uniquement la chaîne cryptée
  }

  if (!token) {
    return res.status(401).json({ message: "401 - Accès refusé. Token manquant." });
  }

  try {
    // Vérification avec la clé de secours en dur
    const decoded = jwt.verify(token, "CLE_SECRETE_CEGEP_2026_SUPER_ROBUSTE");
    
    // Récupération de l'utilisateur dans Neon
    const currentUser = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!currentUser) {
      return res.status(401).json({ message: "401 - L'utilisateur n'existe plus." });
    }

    req.user = currentUser; // Injecte l'utilisateur dans la requête pour la suite
    next();
  } catch (error) {
    return res.status(401).json({ message: "401 - Jeton invalide ou expiré." });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "403 - Interdit. Rôle insuffisant." });
    }
    next();
  };
};

export const optionalProtect = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, "CLE_SECRETE_CEGEP_2026_SUPER_ROBUSTE");
      req.user = await prisma.user.findUnique({ where: { id: decoded.id } });
    } catch (e) {}
  }
  next();
};
