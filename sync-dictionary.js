// sync-dictionary.js — Synchronisation automatique du dictionnaire avec le dépôt Git
// Surveille server/dictionary.json et pousse les modifications vers origin/main

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const DICT_PATH = path.join(ROOT, 'server', 'dictionary.json');
const REMOTE = 'origin';
const BRANCH = 'main';

let lastMtime = 0;

function getMtime(filePath) {
  try {
    return fs.statSync(filePath).mtimeMs;
  } catch {
    return 0;
  }
}

function pushChanges() {
  console.log(`[${new Date().toISOString()}] Détection de modification — push vers ${REMOTE}/${BRANCH}`);
  try {
    execSync(`git add server/dictionary.json`, { cwd: ROOT, stdio: 'inherit' });
    execSync(`git commit -m "sync: mise à jour automatique du dictionnaire"`, { cwd: ROOT, stdio: 'inherit' });
    execSync(`git push ${REMOTE} ${BRANCH}`, { cwd: ROOT, stdio: 'inherit' });
    console.log('Synchronisation réussie.');
  } catch (err) {
    console.error('Échec de la synchronisation :', err.message);
  }
}

function watch() {
  setInterval(() => {
    const mtime = getMtime(DICT_PATH);
    if (mtime !== lastMtime) {
      lastMtime = mtime;
      pushChanges();
    }
  }, 3000); // Vérification toutes les 3 secondes
}

// Initialisation
lastMtime = getMtime(DICT_PATH);
console.log('Surveillance de server/dictionary.json démarrée (Ctrl+C pour arrêter).');
watch();