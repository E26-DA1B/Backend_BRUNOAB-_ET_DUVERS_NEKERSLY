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

### Quiz

- génération de quiz à partir de l’API publique Open Trivia Database;
- appels externes réalisés avec Axios;
- association des questions à une leçon.

### Sécurité

- réponses `401` lorsqu’un jeton est absent ou invalide;
- réponses `403` lorsqu’un rôle n’est pas autorisé;
- vérification de l’identité du formateur avant la modification ou la suppression de ses cours;
- variables sensibles conservées dans `.env`.

## 🗺️ Principaux endpoints

### Authentification — `/api/auth`

| Méthode | Route       | Description                     |
| ------- | ----------- | ------------------------------- |
| POST    | `/register` | Créer un compte                 |
| POST    | `/login`    | Se connecter et recevoir un JWT |

### Cours — `/api/courses`

| Méthode | Route          | Description                                   |
| ------- | -------------- | --------------------------------------------- |
| GET     | `/`            | Afficher les cours avec filtres et pagination |
| GET     | `/:id/lessons` | Afficher les leçons d’un cours dans l’ordre   |
| POST    | `/`            | Créer un cours comme formateur                |
| PUT     | `/:id`         | Modifier un cours autorisé                    |
| DELETE  | `/:id`         | Supprimer un cours autorisé                   |

Exemple de recherche paginée :

```text
GET /api/courses?page=1&limit=10&search=react&level=DEBUTANT
```

### Inscriptions — `/api/enrollments`

| Méthode | Route           | Description                     |
| ------- | --------------- | ------------------------------- |
| POST    | `/subscribe`    | Inscrire un étudiant à un cours |
| PATCH   | `/:id/progress` | Mettre à jour sa progression    |

### Quiz — `/api`

| Méthode | Route                     | Description                    |
| ------- | ------------------------- | ------------------------------ |
| POST    | `/lessons/:lessonId/quiz` | Générer un quiz pour une leçon |

### Utilisateurs — `/api/users`

Les routes de gestion des utilisateurs sont protégées et réservées aux administrateurs.

## 🧪 Tests et validation

Une collection de requêtes est disponible dans :

```text
tests_collection.json
```

Elle peut être importée dans Thunder Client ou Postman afin de tester :

- l’inscription et la connexion;
- les jetons JWT;
- les rôles;
- les réponses `401` et `403`;
- les opérations CRUD;
- les filtres et la pagination;
- les inscriptions et la progression;
- la génération de quiz.

Le frontend a également été vérifié avec :

```bash
cd frontend
npm run lint
npm run build
```

## 🔗 Dépôt GitHub

[Backend_BRUNOAB-\_ET_DUVERS_NEKERSLY](https://github.com/E26-DA1B/Backend_BRUNOAB-_ET_DUVERS_NEKERSLY)
