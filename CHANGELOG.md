# Changelog

Toutes les modifications notables de ce projet sont documentées ici.  
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

---

## Session 13 juin 2026 — Sélecteur de modèle Claude & guide pédagogique

### 1. Pied de page application

- Fond `var(--bg-header)` (bleu navy) pour aligner visuellement avec l'en-tête
- Texte `rgba(255,255,255,0.7)`, séparateur `·` à opacité réduite
- "Bruno Fernon" mis en emphase : blanc, `font-weight: 800`, `font-size: 13px`

---

### 2. Sélecteur de modèle Claude dans l'en-tête

- `<select class="model-select">` inséré entre le badge version et le bouton Clé API
- Trois options disponibles : Haiku 4.5 / Sonnet 4.6 (défaut) / Opus 4.8
- Choix persisté en `localStorage` (clé `evfc_model`), restauré au rechargement via `initModelSelect()`
- Remplacement du modèle déprécié `claude-sonnet-4-20250514` (retraite 15 juin 2026) par la variable `selectedModel`
- Styled pour s'intégrer dans l'en-tête (fond semi-transparent, bordure blanche, flèche SVG custom)

---

### 3. Guide de sélection du modèle à l'écran d'accueil

Section **"Quel modèle Claude choisir ?"** ajoutée après la chaîne de production :

- 3 cartes descriptives (Haiku / Sonnet ✦ Défaut / Opus) avec description d'usage
- Tableau récapitulatif module par module : module EVFC → modèle recommandé → justification courte
- Avertissement ambre : **Opus 4.8 disponible mais non recommandé** — coût élevé sans gain significatif sur les tâches pédagogiques EVFC

---

### 4. Bandeau de recommandation de modèle dans chaque module

- Affiché sous le bloc de navigation de chaîne, avant les champs de saisie
- Couleur du bandeau alignée sur le modèle recommandé (pas le module)
- Indique le modèle recommandé + la justification pédagogique
- ✅ si le modèle courant est déjà le bon, 💡 + bouton one-click sinon
- Le bouton "Utiliser Sonnet 4.6" (ou Haiku) appelle `setModelAndUI()` : met à jour `selectedModel`, `localStorage` et le sélecteur d'en-tête sans rechargement de page

**Répartition des recommandations :**

| Modèle | Modules |
|---|---|
| Haiku 4.5 | M2 (prompts structurés), M5 (grille critériée), M6 (fiche ERA) |
| Sonnet 4.6 | INTRO, M0, M1, M3 (code Apps Script), M4 (scénarios), M7 (JSON n8n) |
| Opus 4.8 | — non recommandé |

---

### 5. Cohérence des couleurs de badges de modèle

- Ajout de `MODEL_COLORS` et `MODEL_LABELS` comme **source unique de vérité** pour les couleurs et libellés de modèles
- Suppression de la prop `color` dans `MODEL_RECO` (était la couleur du module, non du modèle)
- Couleurs canoniques : violet `#7c3aed` (Haiku), bleu `#0284c7` (Sonnet), ambre `#b45309` (Opus)
- Utilisées partout : cartes d'accueil, badges du tableau récapitulatif, bandeaux dans chaque module

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
