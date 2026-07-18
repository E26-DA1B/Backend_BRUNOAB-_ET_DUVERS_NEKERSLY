# Participant 1: Abé Tchombé Bruno Dimitri
# Participant 2: Duvers, Nekersly

# 🎓 Mini-Moodle — Backend d'API REST

Projet académique consistant à concevoir et réaliser le backend d'une plateforme d'apprentissage en ligne sécurisée. L'application gère les utilisateurs (Étudiants, Formateurs, Administrateurs), les cours, les leçons ordonnées, les inscriptions et la génération automatique de quiz éducatifs via une API publique externe.

## 🛠️ Pile Technologique (Tech Stack)

* **Environnement de développement** : Node.js (v24+)
* **Framework Web** : Express (v5.0)
* **Base de données Serverless** : Neon PostgreSQL
* **ORM** : Prisma (v6.19)
* **Sécurité & Chiffrement** : JSON Web Tokens (JWT) & Bcryptjs
* **Client HTTP** : Axios (Intégration d'API externe)

---

## 🚀 Installation et Lancement local

Suivez ces étapes pour démarrer le projet sur votre machine :

### 1. Cloner le projet et installer les dépendances
```bash
git clone <URL_DE_VOTRE_DEPOT_GITHUB>
cd mini-moodle-backend
npm install
```

### 2. Configuration des variables d'environnement (`.env`)
Créez un fichier nommé `.env` à la racine du projet (ce fichier est ignoré par Git pour des raisons de sécurité). Ajoutez-y les variables suivantes configurées avec vos accès :

```env
PORT=3000
DATABASE_URL="postgresql://neondb_owner:VOTRE_MOT_DE_PASSE@ep-raspy-sunset-atumuihy.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="CLE_SECRETE_CEGEP_2026_SUPER_ROBUSTE"
```

### 3. Synchronisation et Initialisation de la Base de Données
Générez le client Prisma, poussez la structure des tables sur Neon, puis exécutez le script de peuplement (seed) pour injecter les comptes et cours de démonstration :
```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Démarrage du serveur de développement
Lancez l'application avec rechargement automatique (Nodemon) :
```bash
npm run dev
```
Le terminal affichera : `🚀 Le serveur "mini-Moodle" écoute activement sur le port 3000`.

---

## 🗺️ Cartographie des Points d'Accès (Endpoints API)

### 🔐 Authentification & Sécurité (`/api/auth`)
* `POST /register`: Inscription d'un utilisateur (Rôles: `ETUDIANT`, `FORMATEUR`). Mots de passe chiffrés par Bcrypt.
* `POST /login`: Authentification de l'utilisateur et génération du jeton JWT.

### 📚 Gestion des Cours (`/api/courses`)
* `GET /`: Liste publique de tous les cours disponibles (Accès libre).
* `GET /:id/lessons` : Récupère les leçons d'un cours spécifique, **triées impérativement dans l'ordre pédagogique** (`orderBy: { order: 'asc' }`).
* `POST /`: Création d'un cours (🔒 Réservé au rôle `FORMATEUR` via middleware JWT - Renvoie une erreur `403` si un étudiant tente l'action).
* `PUT /:id`: Modification d'un cours (🔒 Réservé au rôle `FORMATEUR`).
* `DELETE /:id`: Suppression d'un cours (🔒 Réservé au rôle `FORMATEUR`).

### 🌐 Génération de Quiz & Axios (`/api`)
* `POST /lessons/:lessonId/quiz`: (🔒 Réservé au rôle `FORMATEUR`). Interroge en temps réel l'API mondiale **Open Trivia Database** via **Axios** pour récupérer 5 questions éducatives aléatoires et générer instantanément un quiz complet lié à la leçon en base de données.

### 🎓 Inscriptions et Progression (`/api/enrollments`)
* `POST /subscribe`: Permet à un utilisateur connecté de s'inscrire à un cours (🔒 Réservé au rôle `ETUDIANT`). La contrainte d'unicité empêche les doublons d'inscription.
* `PATCH /:id/progress`: Permet de mettre à jour le score total, le statut de complétion (`ACTIF`, `COMPLETE`) et le pourcentage de progression d'un étudiant.

---

## 🧪 Validation & Tests

Une collection complète de requêtes prête à l'emploi est disponible à la racine du projet sous le fichier `tests_collection.json`. 
Vous pouvez l'importer directement dans **Thunder Client** (VS Code) ou **Postman** pour exécuter les scénarios de test d'authentification, de gestion CRUD, de blocage de sécurité (401/403) et d'intégration de la banque de questions externe.
