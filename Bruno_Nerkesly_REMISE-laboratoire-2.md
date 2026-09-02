# Laboratoire 2 — Fiche de remise

## Équipe

| Nom complet                | Matricule | (Optionnel) rôle |
|----------------------------|-----------|------------------|
| Bruno Dimitri Abé Tchombé  | 2596005   | Backend          |
| Duvers, Nerkesly           | 2495958   | Frontend         |
| Prénom Nom                 | 0000000   | Full-stack       |

## Sujet

**E-Learning — Mini-Moodle**

## Dépôt GitHub

https://github.com/E26-DA1B/Backend_BRUNOAB-_ET_DUVERS_NEKERSLY

## Checklist des fonctionnalités

### Backend

- [✅] CRUD complet sur l’entité principale Course
- [✅] Filtres et pagination avec la query string
- [✅] Prisma avec PostgreSQL sur Neon
- [✅] Énums et relations Prisma
- [✅] Migration Prisma committée
- [✅] Code organisé en routers
- [✅] Inscription et connexion avec JWT
- [✅] Routes protégées
- [✅] Gestion des rôles et des réponses 401/403
- [✅] Mots de passe chiffrés avec bcryptjs
- [✅] Intégration de l’API Open Trivia Database avec Axios
- [✅] CORS activé
- [✅] Secrets conservés dans le fichier `.env`

### Frontend

- [✅] Application React créée avec Vite
- [✅] Instance Axios centralisée
- [✅] Affichage des cours avec `useEffect`
- [✅] Gestion des états de chargement, d’erreur et de succès
- [✅] Recherche, filtres et pagination
- [✅] Formulaire contrôlé pour créer un cours
- [✅] Composants React réutilisables
- [✅] Formulaire de connexion
- [✅] Formulaire d’inscription
- [✅] Token conservé dans `localStorage`
- [✅] Token envoyé dans le header `Authorization`
- [✅] Authentification globale avec `AuthContext`
- [✅] Déconnexion
- [✅] Action protégée visible selon le rôle connecté
- [✅] Interface avec style responsive

### Validation

- [✅] Affichage public des cours
- [✅] Connexion d’un formateur testée
- [✅] Création protégée d’un cours testée
- [✅] Mise à jour automatique du catalogue testée
- [✅] Suppression sécurisée d’un cours testée
- [✅] Build du frontend réussi
- [✅] ESLint exécuté sans erreur
- [✅] README complété
- [✅] Frontend et backend présents dans le même dépôt Git
