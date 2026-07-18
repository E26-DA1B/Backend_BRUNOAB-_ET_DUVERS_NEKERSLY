import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, "CLE_SECRETE", { expiresIn: '1d' });
};

// INSCRIPTION
router.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Veuillez remplir tous les champs obligatoires." });
    }

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, name, password: hashedPassword, role: role || 'ETUDIANT' }
    });

    const token = generateToken(newUser.id);
    res.status(201).json({ token, user: { id: newUser.id, name: newUser.name, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CONNEXION
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides." });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
