// build-frontend.js — Génère le frontend complet dans dist/
// Aucune dépendance externe nécessaire : HTML, CSS, JS pur

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');

if (!fs.existsSync(DIST)) {
  fs.mkdirSync(DIST, { recursive: true });
}

const indexHtml = `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Traducteur et dictionnaire collaboratif pour la langue guidar." />
    <meta name="author" content="Projet linguistique guidar" />
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#050505" />
    <script src="https://cdn.tailwindcss.com"></script>
    <title>Traducteur Guidar</title>
    <style>
      body { font-family: system-ui, -apple-system, sans-serif; }
    </style>
  </head>
  <body class="bg-gray-900 text-white min-h-screen">
    <div id="root"></div>
    <script>
      const app = document.getElementById('root');

      app.innerHTML = \`
      <div class="max-w-4xl mx-auto p-6">
        <header class="text-center mb-8">
          <h1 class="text-4xl font-bold text-blue-500 mb-2">Traducteur Guidar</h1>
          <p class="text-gray-400">Dictionnaire collaboratif pour la langue guidar</p>
        </header>

        <div class="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 class="text-xl font-semibold mb-4">Ajouter une entrée</h2>
          <form id="add-form" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input id="id" type="text" placeholder="Mot guidar" required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
            <input id="translation" type="text" placeholder="Traduction" required
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500" />
            <textarea id="example" placeholder="Exemple" rows="2"
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 md:col-span-2"></textarea>
            <textarea id="notes" placeholder="Remarques" rows="2"
              class="bg-gray-700 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-blue-500 md:col-span-2"></textarea>
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition">
              Ajouter
            </button>
          </form>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold">Dictionnaire</h2>
            <button onclick="loadDictionary()" class="text-blue-400 hover:text-blue-300 text-sm">
              Actualiser
            </button>
          </div>
          <div id="dictionary-list" class="space-y-3"></div>
        </div>

        <footer class="text-center mt-8 text-gray-500 text-sm">
          <p>Projet Linguistique — API : /api/dictionary</p>
        </footer>
      </div>
      \`;

      async function loadDictionary() {
        try {
          const res = await fetch('/api/dictionary');
          const data = await res.json();
          const list = document.getElementById('dictionary-list');
          list.innerHTML = data.map(e => \`
            <div class="bg-gray-700 rounded p-4 flex justify-between items-start">
              <div>
                <h3 class="font-semibold text-blue-400">\${e.id}</h3>
                <p class="text-gray-300">\${e.translation || ''}</p>
                \${e.example ? \`<p class="text-gray-400 text-sm italic">"\${e.example}"</p>\` : ''}
                \${e.notes ? \`<p class="text-gray-500 text-xs">\${e.notes}</p>\` : ''}
              </div>
              <button onclick="deleteEntry('\${e.id}')" class="text-red-400 hover:text-red-300 text-sm">
                Supprimer
              </button>
            </div>
          \`).join('') || '<p class="text-gray-500">Dictionnaire vide</p>';
        } catch (err) {
          document.getElementById('dictionary-list').innerHTML = '<p class="text-red-400">Erreur de chargement</p>';
        }
      }

      async function deleteEntry(id) {
        if (!confirm('Supprimer cette entrée ?')) return;
        try {
          await fetch('/api/dictionary/' + id, { method: 'DELETE' });
          loadDictionary();
        } catch (err) {
          alert('Erreur lors de la suppression');
        }
      }

      document.getElementById('add-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const entry = {
          id: document.getElementById('id').value,
          translation: document.getElementById('translation').value,
          example: document.getElementById('example').value,
          notes: document.getElementById('notes').value
        };
        try {
          await fetch('/api/dictionary', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(entry)
          });
          e.target.reset();
          loadDictionary();
        } catch (err) {
          alert('Ajout impossible');
        }
      });

      loadDictionary();
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(DIST, 'index.html'), indexHtml, 'utf8');

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

console.log('Frontend complet généré dans dist/');