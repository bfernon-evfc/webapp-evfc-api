---
name: sync-evfc-skill-table
description: >
  Resynchronise la table EVFC_MODULE_SKILLS embarquée dans index.html avec le contenu
  réel des fichiers SKILL.md sources du dépôt pack-evfc-fpa. À utiliser après toute
  modification d'un SKILL.md (INTRO, M0 à M7), avant un commit, ou dès qu'on suspecte
  que l'application affiche une version périmée d'un skill. Déclencher pour :
  "synchronise les skills", "régénère EVFC_MODULE_SKILLS", "mets à jour les skills dans
  index.html", "le skill M3 a changé, répercute-le dans l'appli", "vérifie que les skills
  embarqués sont à jour".
---

# Sync EVFC Skill Table

## Pourquoi ce skill existe

`index.html` est une SPA monofichier sans build. Le contenu de chaque `SKILL.md`
(INTRO, M0 à M7) est embarqué en dur dans la constante JS `EVFC_MODULE_SKILLS`
(une seule ligne, JSON échappé pour insertion sûre dans un `<script>` inline).

Les fichiers `SKILL.md` sources vivent dans un **autre dépôt** :
`D:\Codex\CODE\pack-evfc-fpa\skills\<dossier-module>\SKILL.md`.

Rien ne synchronise automatiquement les deux : si quelqu'un édite un `SKILL.md` côté
`pack-evfc-fpa` sans relancer ce skill, `index.html` continue à servir l'ancienne
version au modèle Codex — silencieusement.

## Processus

1. Vérifier que le dépôt source existe : `D:\Codex\CODE\pack-evfc-fpa\skills`
   (ou le chemin fourni en argument / variable d'environnement `EVFC_SKILLS_SOURCE_DIR`
   si le dépôt a été déplacé).
2. Depuis la racine du projet `webapp-evfc-api` (là où se trouve `index.html`),
   exécuter :
   ```bash
   node .Codex/skills/sync-evfc-skill-table/sync-skills.js
   ```
   Le script :
   - lit les 9 `SKILL.md` (INTRO, M0–M7) ;
   - extrait `name:` du frontmatter et le titre `# ...` du corps ;
   - reconstruit `EVFC_MODULE_SKILLS` en JSON échappé (même convention que l'existant :
     `<`, `>`, `&`, `'` échappés en `\uXXXX` pour une insertion `<script>` sûre) ;
   - valide la ligne générée comme JS valide avant d'écrire ;
   - remplace uniquement la ligne `const EVFC_MODULE_SKILLS = ...;` dans `index.html`,
     en préservant BOM et fin de ligne (CRLF) du fichier ;
   - affiche un rapport par module (nom, dossier, taille en octets).
3. Si le script échoue (fichier manquant, `name:` absent, titre H1 introuvable) :
   corriger le `SKILL.md` source fautif, puis relancer — ne jamais éditer
   `EVFC_MODULE_SKILLS` à la main dans `index.html`.
4. Vérifier le diff : `git diff -- index.html` ne doit toucher **que** la ligne
   `EVFC_MODULE_SKILLS`. Si d'autres lignes bougent, c'est un signe que le script
   a mal géré l'encodage ou les fins de ligne — investiguer avant de committer.
5. Ajouter une entrée dans `CHANGELOG.md` listant les modules effectivement modifiés
   (le rapport du script donne la liste exacte).
6. Recommander un contrôle visuel : ouvrir `index.html`, sélectionner le(s) module(s)
   modifié(s), vérifier que le bouton "Copier le prompt" reflète bien le nouveau
   contenu du skill.

## Limites connues

- Seul le `SKILL.md` racine de chaque module est embarqué — pas les fichiers
  `rules/`, `ref/`, `examples/`, `docs/` qu'il référence. Si un skill source dépend
  fortement de ces fichiers annexes, son comportement réel dans Codex (hors de cette
  webapp) peut différer de ce qui est embarqué ici.
- Le chemin source par défaut (`D:\Codex\CODE\pack-evfc-fpa\skills`) est local à ce
  poste. Sur une autre machine, passer le chemin en premier argument du script ou
  via `EVFC_SKILLS_SOURCE_DIR`.
