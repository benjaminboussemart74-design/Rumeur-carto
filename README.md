# Rumeur-carto
Arborescence du prochain gouvernement

## Description

Site web interactif permettant de visualiser la composition du gouvernement français. Les utilisateurs peuvent explorer chaque ministère, cliquer sur un membre pour voir ses collaborateurs et ses fonctions.

## Fonctionnalités

### Pour tous les utilisateurs
- **Visualisation interactive** : Explorez la composition du gouvernement par ministère
- **Navigation intuitive** : Cliquez sur un ministère pour voir ses membres
- **Détails des membres** : Consultez les informations détaillées de chaque membre (rôle, biographie, collaborateurs)
- **Interface responsive** : Fonctionne sur desktop et mobile

### Mode Édition (utilisateurs autorisés)
- **Authentification sécurisée** : Connexion requise pour accéder au mode édition
- **Ajout de membres** : Ajouter de nouveaux ministres ou collaborateurs
- **Modification** : Modifier les informations existantes
- **Gestion des rôles** : Définir les relations hiérarchiques

### Administration
- **Validation des modifications** : Les administrateurs approuvent ou rejettent les changements proposés
- **Gestion des droits** : Différents niveaux d'accès (éditeur, administrateur)
- **Brouillons** : Les éditeurs peuvent sauvegarder des brouillons
- **Publication** : Publication validée par un administrateur

## Installation et Utilisation

### Utilisation simple (sans serveur)
1. Ouvrez le fichier `index.html` dans votre navigateur web
2. L'application fonctionne entièrement côté client avec stockage local

### Utilisation avec serveur web local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (http-server)
npx http-server

# Avec PHP
php -S localhost:8000
```

Puis accédez à `http://localhost:8000` dans votre navigateur.

## Comptes de test

### Administrateur
- **Nom d'utilisateur** : `admin`
- **Mot de passe** : `admin123`
- **Privilèges** : Peut modifier directement et valider les modifications des éditeurs

### Éditeur
- **Nom d'utilisateur** : `editor`
- **Mot de passe** : `editor123`
- **Privilèges** : Peut proposer des modifications qui doivent être validées

## Structure du projet

```
Rumeur-carto/
├── index.html      # Page principale de l'application
├── styles.css      # Styles et design responsive
├── app.js          # Logique JavaScript et gestion des données
└── README.md       # Documentation
```

## Technologies utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Design moderne avec animations et gradients
- **JavaScript (ES6+)** : Logique applicative
- **LocalStorage** : Persistance des données côté client

## Personnalisation

### Ajouter des ministères
Modifiez le tableau `sampleData.ministries` dans `app.js`

### Ajouter des membres
Modifiez le tableau `sampleData.members` dans `app.js`

### Modifier les couleurs
Ajustez les variables de couleur dans `styles.css`

## Sécurité

⚠️ **Note importante** : Cette version utilise une authentification simplifiée pour la démonstration. Pour un environnement de production, il est nécessaire d'implémenter :
- Une authentification backend sécurisée
- Un système de base de données
- HTTPS obligatoire
- Validation côté serveur
- Protection CSRF/XSS

## Contribution

Pour contribuer au projet :
1. Créez une branche pour votre fonctionnalité
2. Implémentez vos modifications
3. Testez votre code
4. Soumettez une pull request

## Licence

Ce projet est open source et disponible sous licence MIT.
