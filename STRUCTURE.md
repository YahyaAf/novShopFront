# Structure du projet - SmartShop Frontend

## Architecture des dossiers

```
src/
├── config/
│   └── api.config.js              # Configuration axios avec credentials
│
├── services/
│   └── auth.service.js            # Service API d'authentification
│
├── context/
│   └── AuthContext.jsx            # Context global pour l'authentification
│
├── hooks/
│   └── useAuth.js                 # Hook personnalisé pour l'auth
│
├── layouts/
│   ├── AuthLayout.jsx             # Layout pour pages d'authentification
│   ├── DashboardLayout.jsx        # Layout pour pages dashboard (admin)
│   └── ClientLayout.jsx           # Layout pour pages client
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx          # Page de connexion
│   ├── dashboard/
│   │   └── DashboardHomePage.jsx  # Page d'accueil dashboard
│   └── client/
│       └── ClientHomePage.jsx     # Page d'accueil client
│
├── components/
│   └── common/
│       └── LoadingSpinner.jsx     # Spinner de chargement
│
└── App.jsx                        # Point d'entrée principal

```

## Organisation

### 📁 pages/auth/
Pages d'authentification
- ✅ LoginPage.jsx
- ⏳ RegisterPage.jsx
- ⏳ ForgotPasswordPage.jsx

### 📁 pages/dashboard/
Pages pour l'interface d'administration
- ✅ DashboardHomePage.jsx - Vue d'ensemble avec stats
- ⏳ UsersPage.jsx
- ⏳ ProductsPage.jsx
- ⏳ OrdersPage.jsx

### 📁 pages/client/
Pages pour l'interface client
- ✅ ClientHomePage.jsx - Page d'accueil publique
- ⏳ ProductsPage.jsx
- ⏳ CartPage.jsx

### 📁 layouts/
- **AuthLayout** - Pages d'authentification
- **DashboardLayout** - Interface admin avec protection
- **ClientLayout** - Interface client publique

## Utilisation du hook useAuth

```javascript
import { useAuth } from './hooks/useAuth';

const MonComposant = () => {
  const { user, isAuthenticated, login, logout, loading } = useAuth();
  
  return <div>{user?.username}</div>;
};
```

## Configuration

Fichier `.env`:
```
VITE_API_BASE_URL=http://localhost:8080
```

## Prochaines étapes

1. ✅ Structure séparée auth/dashboard/client
2. ⏳ Ajouter React Router
3. ⏳ Créer plus de pages
4. ⏳ Implémenter autres services API
