# Projet Linguistique — Traducteur Guidar

## Présentation

Le **Projet Linguistique** est une plateforme collaborative de traduction et de dictionnaire pour la langue **guidar**. Elle comprend :

- Une application web frontale (React + Vite + Tailwind CSS) déployable en Progressive Web App (PWA).
- Un serveur Node.js/Express hébergeant un dictionnaire JSON modifiable à la volée.
- Une synchronisation automatique entre le dictionnaire local et le dépôt Git distant.

---

## Architecture

```
projet_linguistique/
├── dist/                  # Build statique de l'application frontale (Vite)
│   ├── index.html
│   ├── manifest.json      # Manifeste PWA
│   ├── sw.js              # Service Worker
│   ├── assets/
│   │   ├── index-*.js
│   │   └── index-*.css
│   └── *.ico|*.jpg|*.webp
├── server/
│   └── dictionary.json    # Dictionnaire guidar (vide par défaut)
├── node_modules/          # Dépendances installées (npm)
├── package.json
├── vite.config.js
├── git-hooks/             # Scripts de synchronisation automatique
└── README.md
```

**Stack technique :**

- **Frontend** : React 18, Vite, Tailwind CSS, framer-motion, lucide-react, react-router-dom, react-hook-form, sonner (toasts).
- **Backend** : Node.js, Express, CORS, body-parser.
- **Outils** : npm, concurrently (dev + server en parallèle), Vite.
- **PWA** : manifest.json + service worker (désactivée pour éviter l'écran blanc).

---

## Installation

### Prérequis

- Node.js >= 18
- npm
- Git

### Étape 1 : Cloner le dépôt

```bash
git clone https://github.com/yakubaannanleng-design/projet_linguistique
cd projet_linguistique
```

### Étape 2 : Installer les dépendances

```bash
npm install
```

### Étape 3 : Démarrer l'application

**Mode développement (front + serveur en parallèle) :**

```bash
npm run dev
```

**Serveur uniquement :**

```bash
npm run server
```

**Front uniquement :**

```bash
npm run build && npm run preview
```

---

## Utilisation

### Dictionnaire (`server/dictionary.json`)

Le dictionnaire est un tableau d'objets au format JSON :

```json
[
  {
    "id": "guidar_word",
    "translation": "Translation",
    "example": "Exemple d'utilisation",
    "notes": "Remarques éventuelles"
  }
]
```

L'API Express expose :

| Méthode | Chemin | Description |
|---------|--------|-------------|
| GET | `/api/dictionary` | Récupérer le dictionnaire complet |
| GET | `/api/dictionary/:id` | Récupérer une entrée par son ID |
| POST | `/api/dictionary` | Ajouter une entrée |
| PUT | `/api/dictionary/:id` | Modifier une entrée |
| DELETE | `/api/dictionary/:id` | Supprimer une entrée |

### Synchronisation automatique

Un script `sync-dictionary.js` surveille les modifications de `server/dictionary.json` et pousse automatiquement les changements vers le dépôt Git distant (`origin/main`).

```bash
node sync-dictionary.js
```

---

## Maintenance

### Mise à jour du dictionnaire

1. Modifier `server/dictionary.json` directement ou via l'API.
2. La synchronisation automatique s'en chargera.

### Nettoyage

```bash
npm run clean     # Supprime node_modules, dist, logs
npm install       # Réinstalle les dépendances
npm run build     # Reconstruit le front
```

### Résolution d'écran blanc (service worker)

Si l'affichage est bloqué :
1. Désactiver le service worker via `dist/sw.js` (déjà désactivé).
2. Vider le cache du navigateur.
3. Redémarrer le serveur de développement.

---

## Structure des dossiers pour se retrouver rapidement

- **`dist/`** : contient la version compilée de l'application (ne pas modifier manuellement).
- **`server/`** : code côté serveur et données (dictionnaire).
- **`node_modules/`** : dépendances installées (ignorées par Git).
- **`src/`** : code source de l'application React (à créer si absent).
- **`git-hooks/`** : scripts automatisés (sync, nettoyage).

---

## Bonnes pratiques

- Ne jamais commit les fichiers `node_modules/`, `.log`, `dist/` (ajouter au `.gitignore`).
- Utiliser des messages de commit clairs et concis.
- Tester les modifications du dictionnaire via l'API avant de pousser.

---

## Licence

[GNU GENERAL PUBLIC LICENSE v3](LICENSE)