// build-noop.js — Script de compilation no-op pour le déploiement Railway
// Crée un dist/ minimal avec un index.html de base pour éviter les erreurs de build Vite

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

// Créer le dossier dist
if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

// Créer un index.html minimal
const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Traducteur Guidar</title>
    <style>
      body { font-family: sans-serif; text-align: center; padding: 50px; background: #050505; color: #fff; }
      h1 { color: #3b82f6; }
    </style>
  </head>
  <body>
    <h1>Traducteur Guidar</h1>
    <p>Le frontend React n'est pas inclus dans ce dépôt. Utilisez le serveur API directement.</p>
    <p>API endpoints : <code>/api/dictionary</code></p>
  </body>
</html>
`;

fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml, 'utf8');

// Créer un manifest.json minimal
const manifest = {
  name: "Traducteur Guidar",
  short_name: "Guidar",
  description: "Traducteur et dictionnaire collaboratif pour la langue guidar.",
  start_url: "/",
  display: "standalone",
  background_color: "#050505",
  theme_color: "#050505"
};

fs.writeFileSync(path.join(DIST, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

console.log('Build no-op terminé — dossier dist/ créé avec un index.html minimal.');