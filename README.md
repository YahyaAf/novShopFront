# SmartShop - Application de Gestion Commerciale

Application React moderne pour la gestion complète d'un système de commerce avec gestion des utilisateurs, clients, produits, commandes et paiements.

## 🚀 Technologies

- **React 19.2.0** - Bibliothèque UI
- **Vite 7.2.4** - Build tool et dev server
- **React Router DOM 6** - Navigation et routing
- **Axios** - Client HTTP pour les API
- **Tailwind CSS v3** - Framework CSS utility-first
- **Spring Boot Backend** - API REST avec PostgreSQL

## 📋 Fonctionnalités

### 🔐 Authentification
- Connexion avec sessions HTTP (pas de JWT)
- Gestion des rôles (ADMIN / CLIENT)
- Routes protégées par rôle

### 👥 Gestion des Utilisateurs (ADMIN)
- CRUD complet
- Soft delete et hard delete
- Activation/Désactivation de comptes

### 🛍️ Gestion des Clients (ADMIN)
- CRUD avec informations utilisateur
- Système de fidélité à 4 niveaux:
  - **BASIC** - Niveau de départ
  - **SILVER** - 5% de remise (après 500 DH d'achats)
  - **GOLD** - 10% de remise (après 800 DH d'achats)
  - **PLATINUM** - 15% de remise (après 1200 DH d'achats)
- Statistiques de progression pour les clients

### 📦 Gestion des Produits (ADMIN)
- CRUD complet
- Gestion du stock en temps réel
- Filtrage par nom, prix et disponibilité
- Pagination côté client

### 🎟️ Gestion des Codes Promo (ADMIN)
- CRUD complet
- Validation du format (majuscules + chiffres)
- Suivi de l'utilisation (maxUsage / usageCount)
- Vérification de validité

### 📝 Gestion des Commandes (ADMIN)
- Création avec panier multi-produits
- Validation du stock en temps réel
- Application automatique des remises:
  - Remise fidélité selon le niveau
  - Code promo (5%)
  - Calcul TVA (20%)
- Workflow de statut:
  - **PENDING** - En attente de paiement
  - **CONFIRMED** - Commande validée
  - **CANCELED** - Annulée (stock restitué)
  - **REJECTED** - Rejetée
- Numérotation automatique (CMD-YYYY-XXXX)

### 💰 Gestion des Paiements (ADMIN)
- Types de paiement:
  - **ESPECES** - Limité à 20,000 DH (Art. 193 CGI)
  - **CHEQUE** - Avec référence, banque et échéance
  - **VIREMENT** - Avec référence et banque
- Statuts de paiement:
  - **EN_ATTENTE** - En attente
  - **ENCAISSE** - Encaissé (par défaut)
  - **REJETE** - Rejeté
- Mise à jour automatique du montantRestant
- Résumé détaillé des paiements par commande
- Historique complet

### 📊 Tableau de Bord Client
- Visualisation des statistiques personnelles
- Progression vers le prochain niveau de fidélité
- Historique des commandes

## 🏗️ Architecture du Projet

```
src/
├── assets/              # Images et ressources
├── components/          # Composants réutilisables
│   ├── clients/        # Table et formulaire clients
│   ├── commandes/      # Gestion des commandes
│   ├── common/         # Composants partagés
│   │   ├── DeleteModal.jsx
│   │   ├── ErrorDisplay.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── SuccessMessage.jsx
│   ├── payments/       # Gestion des paiements
│   ├── products/       # Table et formulaire produits
│   ├── promos/         # Gestion des promos
│   ├── routes/         # Guards de routes
│   └── users/          # Table et formulaire utilisateurs
├── config/             # Configuration
│   └── api.config.js   # Configuration Axios
├── hooks/              # Custom hooks React
│   ├── useAuth.js
│   ├── useClients.js
│   ├── useCommandes.js
│   ├── usePayments.js
│   ├── useProducts.js
│   ├── usePromos.js
│   └── useUsers.js
├── layouts/            # Layouts (Dashboard, Client, Auth)
├── pages/              # Pages de l'application
│   ├── auth/          # Page de connexion
│   ├── client/        # Pages client
│   └── dashboard/     # Pages admin
├── services/           # Services API
│   ├── auth.service.js
│   ├── client.service.js
│   ├── commande.service.js
│   ├── payment.service.js
│   ├── product.service.js
│   ├── promo.service.js
│   └── user.service.js
├── App.jsx            # Configuration des routes
└── main.jsx           # Point d'entrée

```

## 🔧 Installation

### Prérequis
- Node.js 18+
- npm ou yarn
- Backend Spring Boot en cours d'exécution sur `http://localhost:8080`

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd smartShopFront

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 🌐 Configuration API

L'application consomme un backend Spring Boot. La configuration se trouve dans `src/config/api.config.js`:

```javascript
baseURL: 'http://localhost:8080'
withCredentials: true  // Pour les sessions HTTP
```

## 📡 Endpoints API

### Authentication
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `GET /auth/current-user` - Utilisateur connecté

### Users
- `GET /api/users` - Liste des utilisateurs
- `POST /api/users` - Créer un utilisateur
- `PUT /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Soft delete
- `DELETE /api/users/{id}/hard` - Hard delete
- `PUT /api/users/{id}/activate` - Activer un compte

### Clients
- `GET /api/clients` - Liste des clients
- `POST /api/clients` - Créer un client
- `PUT /api/clients/{id}` - Modifier un client
- `DELETE /api/clients/{id}` - Supprimer un client
- `GET /api/clients/me/stats` - Statistiques du client connecté

### Products
- `GET /api/products/all` - Tous les produits (filtrage client-side)
- `POST /api/products` - Créer un produit
- `PUT /api/products/{id}` - Modifier un produit
- `DELETE /api/products/{id}` - Supprimer un produit

### Promos
- `GET /api/promos` - Liste des codes promo
- `POST /api/promos` - Créer un code promo
- `PUT /api/promos/{id}` - Modifier un code promo
- `DELETE /api/promos/{id}` - Supprimer un code promo
- `POST /api/promos/validate` - Valider et appliquer un code
- `GET /api/promos/check/{code}` - Vérifier la validité

### Commandes
- `GET /api/commandes` - Liste des commandes (params: min, size, status)
- `POST /api/commandes` - Créer une commande
- `GET /api/commandes/{id}` - Détails d'une commande
- `GET /api/commandes/client/{id}` - Commandes d'un client
- `PUT /api/commandes/{id}/confirm` - Confirmer une commande
- `PUT /api/commandes/{id}/cancel` - Annuler une commande

### Payments
- `POST /api/payments` - Créer un paiement
- `GET /api/payments/{id}` - Détails d'un paiement
- `GET /api/payments/commande/{id}` - Paiements d'une commande
- `GET /api/payments/commande/{id}/summary` - Résumé des paiements

## 🎨 Patterns et Conventions

### Architecture en couches
1. **Service Layer** - Appels API avec Axios
2. **Custom Hooks** - Gestion d'état et logique métier
3. **Components** - UI et présentation
4. **Pages** - Composition de composants

### Gestion des erreurs
- Intercepteur Axios global
- Extraction des messages depuis `response.data.message`
- Affichage avec composants `ErrorDisplay` et `SuccessMessage`
- Fallback messages pour erreurs réseau

### Style de code
- Pas de commentaires dans le code
- Noms de variables explicites
- Composants fonctionnels avec hooks
- Props déstructurées
- Gestion async/await avec try/catch

## 🔒 Règles Métier

### Fidélité Client
- Calcul basé sur `totalDepense` et `commandeValideeCount`
- Mise à jour automatique du niveau après confirmation de commande
- Remise appliquée automatiquement sur nouvelles commandes

### Paiements
- Limite légale de 20,000 DH pour espèces (Maroc)
- Validation: `montant <= montantRestant`
- Statut ENCAISSE par défaut avec `dateEncaissement = now()`
- Mise à jour automatique de `montantRestant` après chaque paiement

### Commandes
- Vérification de stock avant création
- Déduction automatique du stock à la création
- Restitution du stock en cas d'annulation
- Confirmation uniquement si `montantRestant = 0`

### Codes Promo
- Format: lettres majuscules + chiffres uniquement
- Limite d'utilisation avec `maxUsage`
- Incrémentation automatique de `usageCount` à l'application
- Remise fixe de 5%

## 🐛 Problèmes Connus

### PostgreSQL bytea Issue
- Le backend utilise un type `bytea` pour `product.nom`
- Filter endpoint génère une erreur SQL `lower(bytea)`
- **Solution**: Endpoint `/api/products/all` avec filtrage client-side

### Pagination Commandes
- Backend utilise paramètre `min` au lieu de `page`
- `min=0, size=1000` pour récupérer toutes les commandes

### Méthodes HTTP
- Confirm/Cancel commandes utilisent `PUT` (pas `POST`)

## 📝 Scripts NPM

```bash
npm run dev          # Démarrer le serveur de développement
npm run build        # Build de production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

## 🤝 Contribution

Ce projet suit les meilleures pratiques React modernes:
- Composants fonctionnels exclusivement
- Hooks pour la gestion d'état
- Context API pour l'authentification
- Service layer séparé
- Validation côté client et serveur

## 📄 License

Projet privé - SmartShop 2024
 
