// server/index.js — Serveur Express pour le dictionnaire guidar
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DICT_PATH = path.join(__dirname, '..', 'server', 'dictionary.json');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'dist')));

// Lire le dictionnaire
function readDict() {
  try {
    return JSON.parse(fs.readFileSync(DICT_PATH, 'utf8'));
  } catch {
    return [];
  }
}

// Écrire le dictionnaire
function writeDict(data) {
  fs.writeFileSync(DICT_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Routes
app.get('/api/dictionary', (req, res) => {
  res.json(readDict());
});

app.get('/api/dictionary/:id', (req, res) => {
  const dict = readDict();
  const entry = dict.find(e => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Entrée non trouvée' });
  res.json(entry);
});

app.post('/api/dictionary', (req, res) => {
  const dict = readDict();
  const newEntry = { id: Date.now().toString(), ...req.body };
  dict.push(newEntry);
  writeDict(dict);
  res.status(201).json(newEntry);
});

app.put('/api/dictionary/:id', (req, res) => {
  const dict = readDict();
  const idx = dict.findIndex(e => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Entrée non trouvée' });
  dict[idx] = { ...dict[idx], ...req.body };
  writeDict(dict);
  res.json(dict[idx]);
});

app.delete('/api/dictionary/:id', (req, res) => {
  const dict = readDict();
  const filtered = dict.filter(e => e.id !== req.params.id);
  if (filtered.length === dict.length) {
    return res.status(404).json({ error: 'Entrée non trouvée' });
  }
  writeDict(filtered);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur http://localhost:${PORT}`);
});