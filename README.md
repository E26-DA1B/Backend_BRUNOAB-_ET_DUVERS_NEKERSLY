# 🎓 Mini-Moodle — Laboratoire 2

Projet réalisé dans le cadre du cours **Service Web 420-941-MA — Groupe 25604**.

## 👥 Participants

- Abé Tchombé Bruno Dimitri
- Duvers, Nerkesly

## 📖 Description

Mini-Moodle est une plateforme d’apprentissage en ligne composée :

- d’une API REST développée avec Node.js et Express;
- d’une base de données PostgreSQL hébergée sur Neon;
- d’un frontend React permettant d’utiliser les principales fonctionnalités de l’API.

L’application gère les utilisateurs, l’authentification JWT, les rôles, les cours, les leçons, les inscriptions, la progression et les quiz.

## 🛠️ Technologies utilisées

### Backend

- Node.js
- Express
- PostgreSQL avec Neon
- Prisma ORM
- JSON Web Tokens
- Bcryptjs
- Axios
- CORS
- Nodemon

### Frontend

- React
- Vite
- Axios
- Context API
- CSS responsive

## 📁 Structure du projet

```text
.
├── frontend/                 # Application React
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── services/
│   └── package.json
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   ├── middlewares/
│   ├── routers/
│   ├── services/
│   └── app.js
├── tests_collection.json
└── package.json
```

## 🚀 Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/E26-DA1B/Backend_BRUNOAB-_ET_DUVERS_NEKERSLY.git
cd Backend_BRUNOAB-_ET_DUVERS_NEKERSLY
```

### 2. Installer les dépendances du backend

```bash
npm install
```

### 3. Configurer les variables d’environnement

Créez un fichier `.env` à la racine du projet :

```env
PORT=3000
DATABASE_URL="VOTRE_ADRESSE_POSTGRESQL_NEON"
JWT_SECRET="VOTRE_CLE_SECRETE"
```

Le fichier `.env` est ignoré par Git et ne doit jamais être publié.

### 4. Préparer Prisma

Pour appliquer les migrations et générer le client Prisma :

```bash
npx prisma migrate deploy
npx prisma generate
```

Pour ajouter les données de démonstration :

```bash
npx prisma db seed
```

### 5. Démarrer le backend

```bash
npm run dev
```

Le backend sera accessible à l’adresse :

```text
http://localhost:3000
```

### 6. Installer et démarrer le frontend

Ouvrez un deuxième terminal :

```bash
cd frontend
npm install
npm run dev
```

Le frontend sera accessible à l’adresse :

```text
http://localhost:5173
```

## ✨ Fonctionnalités

### Authentification

- Création d’un compte étudiant ou formateur;
- connexion avec adresse courriel et mot de passe;
- chiffrement des mots de passe avec Bcryptjs;
- génération et conservation d’un jeton JWT;
- déconnexion;
- protection des actions selon le rôle.

### Cours

- affichage public des cours;
- recherche par titre;
- filtrage par niveau;
- pagination;
- affichage du formateur et du nombre de leçons;
- création d’un cours par un formateur;
- modification et suppression sécurisées;
- mise à jour automatique du catalogue après une création ou une suppression.

### Inscriptions et progression

- inscription d’un étudiant à un cours;
- prévention des inscriptions en double;
- mise à jour du score;
- mise à jour du pourcentage de progression;
- gestion des statuts `ACTIF`, `COMPLETE` et `ABANDONNE`.

### 🌐 Génération de Quiz & Axios (`/api`)
* `POST /lessons/:lessonId/quiz`: (🔒 Réservé au rôle `FORMATEUR`). Interroge en temps réel l'API mondiale **Open Trivia Database** via **Axios** pour récupérer 5 questions éducatives aléatoires et générer instantanément un quiz complet lié à la leçon en base de données.

### 🎓 Inscriptions et Progression (`/api/enrollments`)
* `POST /subscribe`: Permet à un utilisateur connecté de s'inscrire à un cours (🔒 Réservé au rôle `ETUDIANT`). La contrainte d'unicité empêche les doublons d'inscription.
* `PATCH /:id/progress`: Permet de mettre à jour le score total, le statut de complétion (`ACTIF`, `COMPLETE`) et le pourcentage de progression d'un étudiant.

---

## 🧪 Validation & Tests

Une collection complète de requêtes prête à l'emploi est disponible à la racine du projet sous le fichier `tests_collection.json`. 
Vous pouvez l'importer directement dans **Thunder Client** (VS Code) ou **Postman** pour exécuter les scénarios de test d'authentification, de gestion CRUD, de blocage de sécurité (401/403) et d'intégration de la banque de questions externe.
