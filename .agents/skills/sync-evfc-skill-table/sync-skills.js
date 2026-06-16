#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const DEFAULT_SOURCE_DIR = 'D:\\CLAUDE\\CODE\\pack-evfc-fpa\\skills';
const sourceDir = process.argv[2] || process.env.EVFC_SKILLS_SOURCE_DIR || DEFAULT_SOURCE_DIR;
const indexPath = process.argv[3] || path.resolve(process.cwd(), 'index.html');

const MODULES = [
  { key: 'intro', folder: 'INTRO-simulateur-edc-evfc' },
  { key: 'm0', folder: 'M0-progression-pedagogique-evfc' },
  { key: 'm1', folder: 'M1-evfc-sequence-designer' },
  { key: 'm2', folder: 'M2-ai-training-designer' },
  { key: 'm3', folder: 'M3-qcm-evfc-validator' },
  { key: 'm4', folder: 'M4-evfc-faire-scenario-generator' },
  { key: 'm5', folder: 'M5-grilles-criteriees' },
  { key: 'm6', folder: 'M6-era-loop-coach' },
  { key: 'm7', folder: 'M7-n8n-automatisation' },
];

function parseSkillFile(raw, folder) {
  const lines = raw.split('\n');
  if ((lines[0] || '').trim() !== '---') {
    throw new Error(`${folder}: le fichier SKILL.md doit commencer par "---"`);
  }
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') { end = i; break; }
  }
  if (end === -1) {
    throw new Error(`${folder}: frontmatter non fermé ("---" de fin manquant)`);
  }
  const nameLine = lines.slice(1, end).find((l) => /^name:\s*/.test(l));
  if (!nameLine) {
    throw new Error(`${folder}: champ "name:" manquant dans le frontmatter`);
  }
  const name = nameLine.replace(/^name:\s*/, '').trim();

  const h1Line = lines.slice(end + 1).find((l) => /^#\s+/.test(l.trim()));
  if (!h1Line) {
    throw new Error(`${folder}: titre H1 ("# ...") introuvable dans le corps du skill`);
  }
  const title = h1Line.trim().replace(/^#\s+/, '').trim();

  return { name, title };
}

function escapeForInlineScript(jsonString) {
  // Échappement défensif pour une insertion sûre dans un <script> inline :
  // évite toute fermeture accidentelle de balise et neutralise '<', '>', '&', '\''.
  return jsonString
    .replace(/&/g, '\\u0026')
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/'/g, '\\u0027');
}

function main() {
  const table = {};
  const report = [];

  for (const { key, folder } of MODULES) {
    const skillPath = path.join(sourceDir, folder, 'SKILL.md');
    if (!fs.existsSync(skillPath)) {
      throw new Error(`Fichier introuvable : ${skillPath}`);
    }
    const raw = fs.readFileSync(skillPath, 'utf8').replace(/\r\n/g, '\n');
    const { name, title } = parseSkillFile(raw, folder);
    table[key] = { name, title, folder, content: raw };
    report.push({ key, folder, name, title, bytes: Buffer.byteLength(raw, 'utf8') });
  }

  const safeJson = escapeForInlineScript(JSON.stringify(table));
  const newLine = `const EVFC_MODULE_SKILLS = ${safeJson};`;

  // Vérifie que la ligne générée est du JS valide avant de toucher index.html.
  try {
    // eslint-disable-next-line no-new-func
    new Function(newLine);
  } catch (e) {
    throw new Error(`Ligne générée invalide en JavaScript : ${e.message}`);
  }

  if (!fs.existsSync(indexPath)) {
    throw new Error(`index.html introuvable : ${indexPath}`);
  }

  let htmlRaw = fs.readFileSync(indexPath, 'utf8');
  const hasBOM = htmlRaw.charCodeAt(0) === 0xfeff;
  if (hasBOM) htmlRaw = htmlRaw.slice(1);

  const eol = htmlRaw.includes('\r\n') ? '\r\n' : '\n';
  const htmlLines = htmlRaw.split(/\r\n|\n/);

  const targetIndex = htmlLines.findIndex((l) => l.startsWith('const EVFC_MODULE_SKILLS = '));
  if (targetIndex === -1) {
    throw new Error('Ligne "const EVFC_MODULE_SKILLS = " introuvable dans index.html');
  }

  const oldLine = htmlLines[targetIndex];
  const changed = oldLine !== newLine;
  htmlLines[targetIndex] = newLine;

  const output = (hasBOM ? '﻿' : '') + htmlLines.join(eol);
  fs.writeFileSync(indexPath, output, 'utf8');

  console.log(`Source : ${sourceDir}`);
  console.log(`Cible  : ${indexPath}`);
  console.log('');
  for (const r of report) {
    console.log(`  ${r.key.padEnd(6)} ${r.name} (${r.folder}) — ${r.bytes} octets`);
  }
  console.log('');
  console.log(changed
    ? 'OK : table EVFC_MODULE_SKILLS mise à jour dans index.html.'
    : 'OK : aucun changement détecté, table déjà à jour.');
}

main();
