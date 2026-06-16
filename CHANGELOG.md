# Changelog

Toutes les modifications notables de ce projet sont documentées ici.  
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

Convention projet : lorsqu'une session de modifications est réalisée depuis ce projet Codex, ajouter la mention **« Mis à jour avec Codex »** dans le titre de la session.  
Convention projet : lorsqu'une session de modifications est réalisée depuis ce projet Claude Code, ajouter la mention **« Mis à jour avec Claude »** dans le titre de la session.

---

## Session 16 juin 2026 — Bouton "Vider les livrables" — Mis à jour avec Claude

### 1. Nouveau bouton dans l'en-tête : 🗑️ Vider les livrables

- Affiche une confirmation (`window.confirm`) rappelant que seuls les livrables générés en cache sont effacés
- Vide `resultCache` / `resultModelByModule` (en mémoire et `localStorage` : `evfc_result_cache`, `evfc_result_model_by_module`)
- La clé API (`evfc_anthropic_api_key`) et les préférences par module (modèle, `max_tokens`, `temperature`) ne sont pas touchées
- Réaffiche le panneau du module en cours après le vidage et affiche un toast de confirmation

---

## Session 16 juin 2026 — Rectificatif mesure M0 — Mis à jour avec Claude

### 1. Correction des valeurs mesurées M0 (distinctes d'INTRO)

- M0 avait été aligné par erreur sur les valeurs d'INTRO (2656 + 10079, temp 0.7) ; mesure réelle : 2194 + 4904 tokens, temp 0.5
- `DEFAULT_TEMPERATURE_BY_MODULE.m0` : `0.7` → `0.5`
- `DEFAULT_MAX_TOKENS_BY_MODULE.m0` : `12000` → `8000` (marge suffisante au-dessus des 4904 tokens de sortie mesurés)
- Mise à jour du tableau "Utilisation des tokens" du README

---

## Session 16 juin 2026 — Nouvelle mesure M2 et alerte sur "Pas de limite" — Mis à jour avec Claude

### 1. Recalibrage M2 d'après une nouvelle mesure (1829 + 32900 tokens, temp=0.5, Haiku 4.5)

- Ajout du palier `36000` dans `TOKEN_PRESETS`
- Défaut `DEFAULT_MAX_TOKENS_BY_MODULE.m2` : `NO_MAX_TOKENS` → `36000` (marge suffisante au-dessus des 32900 tokens de sortie mesurés)

### 2. Alerte lors du choix "Pas de limite (max du modèle)"

- Un toast d'avertissement s'affiche désormais quand l'utilisateur sélectionne cette option, rappelant le plafond réel du modèle actif et le coût/temps de génération plus élevés

---

## Session 16 juin 2026 — Correctif placeholder M6, options M3 et calibrage tokens/temperature — Mis à jour avec Claude

### 1. Correctif affichage tronqué dans la modale M6

- Le placeholder du champ "Description du blocage ou comportement observé" contenait des guillemets droits `"..."` qui fermaient prématurément l'attribut HTML `placeholder="..."`, tronquant l'affichage de l'exemple
- Remplacement par des guillemets ne cassant pas le HTML

### 2. Module M3 — options du nombre de questions

- Liste déroulante "Nombre de questions" : `5 / 8 / 10 / 12 / 15` → `5 / 10 / 15 / 20`

### 3. Calibrage température/longueur par module d'après des tests de génération réels

- Températures ajustées : M0 0.4→0.7, M2 0.7→0.5, M3 0.3→0.2, M4 0.8→0.5, M5 0.3→0.2
- Paliers `TOKEN_PRESETS` étendus : 6 000 / 8 000 / 12 000 / 18 000 / 24 000
- Défauts `DEFAULT_MAX_TOKENS_BY_MODULE` relevés avec marge sur les tokens de sortie mesurés : INTRO/M0/M1 → 12 000, M3 → 18 000, M4/M5/M6 → 8 000
- Nouvelle option **"Pas de limite (max du modèle)"** dans le sélecteur de longueur, résolue dynamiquement au moment de la génération vers le plafond réel du modèle sélectionné (64 000 tokens pour Sonnet 4.6/Haiku 4.5, 128 000 pour Opus 4.8)
- M2, dont une génération avait été tronquée même à 24 000 tokens, utilise désormais cette option par défaut

---

## Session 16 juin 2026 — Modèle affiché sur le livrable et révision des paliers de longueur — Mis à jour avec Claude

### 1. Mention du modèle Claude utilisé sous le titre du livrable

- Ajout d'une ligne discrète `Généré avec {Modèle}` sous le titre de chaque livrable généré
- Le modèle utilisé est mémorisé par module via `evfc_result_model_by_module` (localStorage)
- Affiché aussi bien après une génération fraîche qu'après restauration d'un livrable mémorisé (`Revoir le livrable`)

### 2. Révision des paliers de "Longueur maximale du livrable"

- Nouveaux paliers `TOKEN_PRESETS` : 6 000 / 12 000 / 18 000 / 24 000 (remplacent 3 000 / 6 000 / 8 000 / 12 000)
- Raison : l'injection du skill complet dans le prompt système (ajouté en session 15-16 juin) entraîne des réponses plus longues et plus riches, nécessitant des plafonds de tokens plus élevés
- Nouveaux défauts par module (`DEFAULT_MAX_TOKENS_BY_MODULE`) :
  - INTRO, M0, M1, M3, M5, M6 → 6 000
  - M2, M4, M7 → 18 000

---

## Session 16 juin 2026 — Temperature par module et export DOCX combiné — Mis à jour avec Codex

### 1. `temperature` configurable par module

- Ajout d'un sélecteur "Créativité du modèle" dans chaque panneau module
- Valeurs disponibles : 0.2 cadré, 0.5 équilibré, 0.7 créatif, 1.0 exploratoire
- Persistance par module via `evfc_temperature_by_module`
- L'appel API Anthropic transmet désormais `temperature` avec `model` et `max_tokens`
- Le bouton "Copier le prompt" indique la temperature active

### 2. Export DOCX combiné multi-modules

- Ajout d'un bouton `DOCX combiné` dans la barre d'outils du livrable
- Une modale liste les livrables déjà mémorisés par module et permet de choisir ceux à assembler
- Le DOCX combiné contient une page de synthèse puis une section par module, avec titres, listes, citations et tableaux Markdown
- Cas d'usage : regrouper une séquence M1 et une grille M5 dans un seul fichier Word

---

## Session 15-16 juin 2026 — Qualité des générations, configuration et injection des skills — Mis à jour avec Codex

### 1. Feedback visible en cas d'échec `localStorage`

- Ajout des helpers `safeGetLocalStorage()`, `safeSetLocalStorage()`, `safeRemoveLocalStorage()` et `parseStoredJson()`
- Les erreurs de stockage ne sont plus silencieuses : un toast explicite prévient l'utilisateur si le cache est plein, indisponible ou illisible
- Application aux préférences de modèle, clé API, cache des livrables, état du panneau latéral et préférences `max_tokens`
- Message spécifique si le livrable reste visible mais ne peut pas être restauré au prochain lancement

---

### 2. `max_tokens` configurable par module

- Ajout de `TOKEN_PRESETS = [3000, 6000, 8000, 12000]`
- Ajout de `DEFAULT_MAX_TOKENS_BY_MODULE` avec valeurs adaptées aux modules courts ou longs
- Nouveau sélecteur "Longueur maximale du livrable" dans chaque panneau module
- Persistance par module via `evfc_max_tokens_by_module`
- L'appel API Anthropic utilise désormais `max_tokens: maxTokens` au lieu de la valeur fixe `6000`

---

### 3. Bouton "Copier le prompt" avant génération

- Ajout d'un bouton `📋 Copier le prompt` avant le bouton de génération IA
- Le prompt copié contient :
  - module et nom du livrable ;
  - modèle Claude sélectionné ;
  - limite `max_tokens` active ;
  - prompt système complet ;
  - message utilisateur construit depuis les champs du formulaire
- Validation des champs obligatoires avant copie, avec feedback utilisateur si un champ requis manque

---

### 4. Centralisation des modèles Claude

- Ajout de `MODEL_IDS` comme source unique des IDs API
- Ajout de `MODEL_CATALOG` pour les libellés, descriptions courtes, couleurs et modèle par défaut
- Génération dynamique du `<select id="model-select">` depuis `MODEL_CATALOG`
- Les cartes de l'écran d'accueil et les bandeaux de recommandation utilisent les mêmes constantes
- Conservation de `MODEL_COLORS` et `MODEL_LABELS` sous forme dérivée pour compatibilité avec le reste du code

---

### 5. Premier découpage logique sans build

- Ajout d'une zone `APP CONFIG — premier découpage logique sans build`
- Regroupement des constantes structurantes :
  - `STORAGE_KEYS`
  - `API_CONFIG`
  - `MODEL_IDS`
  - `MODEL_CATALOG`
  - `TOKEN_PRESETS`
  - `DEFAULT_MAX_TOKENS_BY_MODULE`
- L'application reste un fichier `index.html` autonome, ouvrable directement dans le navigateur

---

### 6. Analyse et alignement des relations Module EVFC ↔ skill

Relations confirmées dans le dossier `skills` :

| Module | Skill réel déclaré dans `SKILL.md` |
|---|---|
| INTRO | `simulateur-edc-evfc` |
| M0 | `progression-pedagogique-evfc` |
| M1 | `evfc-sequence-designer` |
| M2 | `ai-training-designer` |
| M3 | `qcm-evfc-validator` |
| M4 | `evfc-faire-scenario-generator` |
| M5 | `grilles-criteriees` |
| M6 | `era-loop-coach` |
| M7 | `n8n-automatisation-pedagogique` |

- Correction de l'affichage des badges de livrable : ils utilisent maintenant le vrai `name:` du `SKILL.md` au lieu du nom de dossier préfixé module
- Exemple : M1 affiche `evfc-sequence-designer`, M7 affiche `n8n-automatisation-pedagogique`

---

### 7. Injection du skill dans le prompt système Anthropic

- Ajout de la table embarquée `EVFC_MODULE_SKILLS`
- Chaque entrée contient :
  - nom réel du skill ;
  - titre ;
  - dossier source ;
  - contenu complet du `SKILL.md`
- Ajout de `getSkillContextForModule(skillId)`
- Ajout de `buildSystemPrompt(skill)`
- Le `system` envoyé à Anthropic combine désormais :
  - le `systemPrompt` court du module ;
  - le nom du skill EVFC appliqué ;
  - le dossier source ;
  - les instructions complètes du `SKILL.md`
- Le bouton "Copier le prompt" utilise aussi `buildSystemPrompt()` afin que l'utilisateur voie exactement le cadrage enrichi envoyé au modèle

---

### 8. Vérifications

- Vérification syntaxique des scripts inline de `index.html` avec Node : `OK: 4 inline script(s) parsed`
- Vérification de présence des 9 skills embarqués dans `EVFC_MODULE_SKILLS`
- Contrôle visuel via navigateur intégré non réalisé : blocage de permission système hors dossier projet (`AppData`)

---

## Session 13 juin 2026 — Sélecteur de modèle Claude & guide pédagogique — Mis à jour avec Claude

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

## Session 13 juin 2026 — Corrections & améliorations `index.html` — Mis à jour avec Claude

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

## [2.0.0] — 2026-06-12 — Mis à jour avec Claude

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
