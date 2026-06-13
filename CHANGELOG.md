# Changelog

Toutes les modifications notables de ce projet sont documentées ici.  
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

---

## Session 13 juin 2026 — Corrections & améliorations `index.html`

### 1. Export PDF

**Caractères spéciaux et émojis**
- Ajout de `cleanForPDF(str)` appliquée à tous les `doc.text()`
- Conversion sémantique avant suppression : `⭐⭐⭐` → `***`, `✅` → `[OK]`, `🟢` → `(oui)`, `→` → `>`, etc.
- Caractères hors Latin-1 restants → `?`

**Tirets cadratins**
- `—`, `–`, `‒` → `-`

**Email pied de page**
- `bruno.fernon@edumediapole.net` → `bfernon@edumediapole.net`

**Tableaux Markdown**
- Détection et rendu des blocs `|...|` : en-tête navy/blanc, lignes alternées bleu clair/blanc, hauteur dynamique

---

### 2. Export DOCX

**Erreur de chargement**
- Suppression du `<script>` statique, remplacement par chargement dynamique de `docx@7.8.2` (jsdelivr) au moment du clic
- Guard `if (!window.docx)` avec message explicite

**Tableaux Markdown**
- Même logique de parsing que PDF, rendu via `Table` / `TableRow` / `TableCell` de docx.js v7

**Refonte mise en page (charte Édumédiapole)**

| Élément | Style |
|---|---|
| Pastille module | Fond rouge #F0322C, texte blanc |
| Titre principal | Calibri Bold, navy, filet rouge épais dessous |
| H1 | Bandeau plein navy, texte blanc |
| H2 | Texte navy, filet rouge fin dessous |
| H3 | Texte navy gras |
| Bullet | Puce rouge + texte #2B2B2B |
| Blockquote | Fond #FFE8E6, bordure gauche rouge épaisse |
| Tableaux | En-tête navy/blanc, lignes alternées #E8F0FA/blanc |
| En-tête de page | "Édumédiapole · Module — Nom" + filet navy |
| Pied de page | Email · n°page/total · date + filet navy |

- Helper `inlineRuns()` pour parser le gras inline `**...**`
- `cleanDocx()` : émojis, caractères de contrôle XML, tirets cadratins

---

### 3. Bouton copie sur les blocs `<pre>`

- Bouton `📋 Copier` sur chaque bloc, visible au survol
- Feedback `✅ Copié !` (fond vert, 2 s) après clic
- Copie le texte brut (`<code>` ou texte direct)

---

### 4. Module M2 — Prompts Pédagogiques FPA

**Description**
- *"Bibliothèque de prompts prêts à l'emploi — à utiliser dans Claude + plugin Pack EVFC-FPA"*

**Bandeau contextuel** (affiché uniquement sur M2)
- Fond #E8F0FA, bordure navy, message d'usage Claude + plugin

**Label livrable personnalisé**
- `Bibliothèque de prompts M2 · …` au lieu de "Livrable"

**Badge "✦ Prompt Claude"** sur les `<pre>` M2
- Badge violet, visible au survol uniquement

**Note de bas de livrable**
- Encadré violet avec instructions d'utilisation

---

### 5. "Claude" gras orange dans M2

- Fonction `highlightClaudeInM2(rootEl)` : parcourt les nœuds texte du `result-body` et enveloppe "Claude" / "CLAUDE" dans `.claude-highlight`
- Appliqué aussi manuellement dans le bandeau et la note de bas
- `.claude-highlight { color: #ea580c; font-weight: 700; }`

---

### 6. Lettres EVFC colorées dans les titres

Fonction `styleEVFC(str, onDark)` :

| Lettre | Fond clair | Dark mode / on-dark |
|---|---|---|
| **E** | #0284c7 | #38bdf8 / #7dd3fc |
| **V** | #16a34a | #4ade80 / #86efac |
| **F** | #ea580c | #fb923c / #fdba74 |
| **C** | #7c3aed | #c084fc / #d8b4fe |

Appliqué sur : header statique (variante `.on-dark`), écran d'accueil, panel skill (nom + desc), label livrable.

---

### 7. Badges Pack EVFC-FPA dans le label livrable

| Module | Skill technique Pack EVFC-FPA |
|---|---|
| INTRO | `INTRO-simulateur-edc-evfc` + `orchestrateur-architecte-formateur-augmente` |
| M0 | `M0-progression-pedagogique-evfc` |
| M1 | `M1-evfc-sequence-designer` |
| M2 | `M2-ai-training-designer` |
| M3 | `M3-qcm-evfc-validator` |
| M4 | `M4-evfc-faire-scenario-generator` |
| M5 | `M5-grilles-criteriees` |
| M6 | `M6-era-loop-coach` |
| M7 | `M7-n8n-automatisation` |

- Badge `🧩 nom-technique` avec couleur propre au module, bordure colorée, fond transparent

---

## [2.0.0] — 2026-06-12

### Ajouté
- Application complète **Formateur Augmenté EVFC v2.0** (SPA monofichier)
- 9 modules de génération IA : INTRO, M0 à M7
- Intégration API Anthropic (claude-sonnet-4-20250514) directement depuis le navigateur
- Export des livrables en **PDF** (jsPDF) et **DOCX** (docx.js)
- Génération de scripts **Google Apps Script** pour les grilles M5 (formateur + auto-évaluation)
- Navigation chaînée entre modules avec fil d'Ariane et rail de chaîne
- Pré-remplissage automatique des champs entre modules (M4 → M5, M1/M0/M2 → M3)
- Gestion de la clé API Anthropic via `localStorage`
- Mode clair / sombre
- Raccourcis clavier (`Échap`, `Alt+←/→`)
- README complet du projet

### Modifié
- Bannière Édumédiapole (`Bannière_Edumédiapole_v3_medium.png`) remplace le badge texte `ÉM` dans l'en-tête, sur fond blanc avec coins arrondis
- Email de contact mis à jour : `bfernon@edumediapole.net`
