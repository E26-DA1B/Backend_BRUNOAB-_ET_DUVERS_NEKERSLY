import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage de la base de données...');
  await prisma.question.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.enrollment.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🔐 Création des utilisateurs de test (Mots de passe: Securise123!)...');
  const hashedPass = await bcrypt.hash('Securise123!', 10);

  const admin = await prisma.user.create({
    data: { name: 'Alice Admin', email: 'admin@cegep.ca', password: hashedPass, role: 'ADMIN' }
  });

  const formateur = await prisma.user.create({
    data: { name: 'Prof Martin', email: 'formateur@cegep.ca', password: hashedPass, role: 'FORMATEUR' }
  });

  const etudiant = await prisma.user.create({
    data: { name: 'Jean Tremblay', email: 'etudiant@cegep.ca', password: hashedPass, role: 'ETUDIANT' }
  });

  console.log('📚 Création d\'un cours avec leçons ordonnées...');
  const cours = await prisma.course.create({
    data: {
      title: 'Introduction au développement API REST',
      description: 'Découvrez la puissance de Node, Express, Prisma et Neon.',
      level: 'DEBUTANT',
      teacherId: formateur.id
    }
  });

  await prisma.lesson.createMany({
    data: [
      { title: 'Introduction à Express', content: 'Les bases du routage HTTP.', order: 1, courseId: cours.id },
      { title: 'Modélisation avec Prisma', content: 'Établir des relations complexes.', order: 2, courseId: cours.id },
      { title: 'Sécurisation par JWT', content: 'Mettre en place l\'authentification.', order: 3, courseId: cours.id }
    ]
  });

  console.log('✅ Base de données initialisée avec succès !');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
