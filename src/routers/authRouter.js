import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// INSCRIPTION
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;

  try {
    if (!email || !password || !name) {
      return res.status(400).json({
        message: 'Veuillez remplir tous les champs obligatoires.'
      });
    }

    const allowedRoles = ['ETUDIANT', 'FORMATEUR'];
    const selectedRole = role || 'ETUDIANT';

    if (!allowedRoles.includes(selectedRole)) {
      return res.status(400).json({
        message: 'Le rôle doit être ETUDIANT ou FORMATEUR.'
      });
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    });

    if (userExists) {
      return res.status(409).json({
        message: 'Cet email est déjà utilisé.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: selectedRole
      }
    });

    const token = generateToken(newUser.id);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Erreur lors de l'inscription."
    });
  }
});

// CONNEXION
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: 'Veuillez fournir un email et un mot de passe.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        message: 'Identifiants invalides.'
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: 'Identifiants invalides.'
      });
    }

    const token = generateToken(user.id);

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Erreur lors de la connexion.'
    });
  }
});

export default router;