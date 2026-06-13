**ÉDUMÉDIAPOLE**

Pack Formation Professionnelle d'Adultes

**Guide de Reconstruction**

**EVFC Formateur Augmenté**

Version 2.0  ·  12 juin 2026

Bruno Fernon  ·  bruno.fernon@edumediapole.net

# **Table des matières**

1\. Vue d'ensemble

2\. Architecture de l'application

3\. Données centrales — SKILLS

4\. Fonctionnalités détaillées

5\. Palette et design

6\. Processus de mise à jour

7\. Checklist de reconstruction

8\. Informations de référence

# **1\. Vue d'ensemble**

## **1.1 Contexte**

L'application EVFC Formateur Augmenté est une interface web standalone qui expose l'intégralité du Pack FPA Édumédiapole sous forme d'application interactive. Elle permet à un formateur professionnel d'adultes (FPA) d'accéder, depuis une seule interface, aux 9 skills du plugin pack-evfc-fpa, de les enchaîner logiquement, et d'exporter les livrables générés.

Le plugin de référence est stocké dans :

/mnt/skills/plugins/pack-evfc-fpa/

## **1.2 Deux versions produites**

| Fichier | Usage | Mécanisme IA | Clé API |
| :---- | :---- | :---- | :---- |
| evfc-formateur-augmente.html | Utilisateurs externes | API Anthropic directe (browser) | localStorage |
| evfc-formateur-augmente-claude.jsx | Bruno dans Claude.ai | fetch Anthropic via abonnement | Aucune |

## **1.3 Stack technique**

**• HTML** : fichier standalone, zéro framework, JavaScript vanilla ES6+

**• JSX** : React fonctionnel (hooks), export default, styles inline

**• Librairies CDN** (HTML uniquement) :

**•** marked@9.1.6 — rendu Markdown

**•** jspdf@2.5.1 — export PDF

**•** html2canvas@1.4.1 — capture DOM

**•** docx@8.5.0 — export Word

**• API** : https://api.anthropic.com/v1/messages, modèle claude-sonnet-4-6

# **2\. Architecture de l'application**

## **2.1 Structure globale (HTML)**

evfc-formateur-augmente.html

├── \<head\>

│   ├── CDN scripts (marked, jspdf, html2canvas, docx)

│   └── \<style\> — CSS complet (variables, composants, dark mode)

├── \<body\>

│   ├── \<header\> — Logo \+ indicateur clé API \+ toggle thème

│   ├── \<div class="app-layout"\> — Grid 2 colonnes

│   │   ├── \<aside class="sidebar"\> — Cartes skills

│   │   └── \<main class="main-content"\>

│   │       ├── \<div class="nav-bar"\> — Breadcrumb \+ rail

│   │       └── \<div class="skill-panel"\> — Contenu dynamique

│   └── \<div class="toast"\>

└── \<script\>

    ├── const SKILLS \= \[...\]

    ├── const CANONICAL\_CHAINS \= \[...\]

    ├── STATE, THEME, SIDEBAR, WELCOME

    ├── NAVIGATION, SKILL PANEL RENDER

    ├── CACHE HELPERS, API KEY MANAGEMENT

    ├── GENERATE, RENDER RESULT

    ├── COPY / EXPORT PDF / EXPORT DOCX

    ├── M5 — GOOGLE FORMS (parse \+ generate \+ modal)

    ├── TOAST, KEYBOARD SHORTCUTS

    └── INIT

## **2.2 Structure JSX (Claude.ai)**

evfc-formateur-augmente-claude.jsx

├── Imports React (useState, useCallback, useRef, useEffect)

├── Constantes palette (NAVY, RED)

├── const SKILLS \= \[...\]          — Identique au HTML

├── const CANONICAL\_CHAINS \= \[...\] — Identique au HTML

├── function cleanText()

├── function MarkdownView()        — Renderer Markdown JSX

└── export default function App()

    ├── useState hooks

    ├── useCallback (showToast, selectSkill, goBack, goHome)

    ├── useEffect — pré-remplissage M5 depuis cache M4

    ├── useEffect — raccourcis clavier

    ├── async generate()

    ├── prefillM3()

    └── JSX render (Header \+ Nav \+ Sidebar \+ Main)

# **3\. Données centrales — SKILLS**

## **3.1 Structure d'un skill**

{ id, module, name, shortName, desc, color, chain, fields, systemPrompt }

## **3.2 Structure d'un champ (fields)**

{ id, label, type: 'text'|'textarea'|'select', placeholder, options, required }

## **3.3 Les 9 skills du Pack FPA**

| ID | Module | Nom | Couleur | Plugin source |
| :---- | :---- | :---- | :---- | :---- |
| intro | INTRO | Simulateur EDC EVFC | \#7c3aed | simulateur-edc-evfc |
| m0 | M0 | Progression Pédagogique | \#0891b2 | progression-pedagogique-evfc |
| m1 | M1 | Séquence EVFC | \#0284c7 | evfc-sequence-designer |
| m2 | M2 | Prompts Pédagogiques FPA | \#7c3aed | prompt-pedagogique-optimizer |
| m3 | M3 | QCM / QRL Google Forms | \#059669 | qcm-evfc-validator |
| m4 | M4 | Scénarios FAIRE | \#d97706 | evfc-faire-scenario-generator |
| m5 | M5 | Grilles Critériées | \#dc2626 | grilles-criteriees |
| m6 | M6 | Boucle E.R.A. | \#db2777 | era-loop-coach |
| m7 | M7 | Automatisation n8n | \#374151 | n8n-automatisation-pedagogique |

# **4\. Fonctionnalités détaillées**

## **4.1 Navigation**

| Touche | Action |
| :---- | :---- |
| Échap | Accueil (reset complet) |
| Alt \+ ← | Retour arrière (navHistory) |
| Alt \+ → | Skill suivant dans la chaîne |

**CANONICAL\_CHAINS :** La chaîne principale est \[intro, m0, m1, m4, m5, m6\]. 3 chaînes secondaires couvrent les variantes QCM, FAIRE→Grille, et Prompts→Séquence.

## **4.2 Génération IA**

**• Modèle :** claude-sonnet-4-6

**• max\_tokens :** 4000

**• Header obligatoire (HTML) :** anthropic-dangerous-direct-browser-access: true

**• Header JSX :** Content-Type uniquement (abonnement Claude.ai géré par la plateforme)

## **4.3 Cache inter-modules**

| Source | Destination | Champ pré-rempli | Déclencheur |
| :---- | :---- | :---- | :---- |
| M4 (Scénarios FAIRE) | M5 (Grilles) | field\_competence | Automatique à l'ouverture de M5 |
| M1 (Séquence EVFC) | M3 (QCM) | field\_competence \+ field\_phase | Bouton "✦ Utiliser M1" |
| M0 (Progression) | M3 (QCM) | field\_competence | Bouton "✦ Utiliser M0" |
| M2 (Prompts) | M3 (QCM) | field\_competence (domaine) | Bouton "✦ Utiliser M2" |

## **4.4 Export PDF**

**• Technologie :** jsPDF 2.5.1

**• Format :** A4 portrait, marges 15mm

**• Header :** fond navy \#002455, titre \+ sous-titre \+ ligne rouge

**• Footer :** contact Édumédiapole \+ pagination \+ nom skill

**• Nom fichier :** EVFC\_\[MODULE\]\_\[NomSkill\]\_\[YYYY-MM-DD\].pdf

## **4.5 Export DOCX**

**• Technologie :** docx 8.5.0

**• Éléments :** H1/H2/H3, bullets, blockquotes avec bordure rouge, tableaux

**• Métadonnées :** creator, title, description automatiques

**• Nom fichier :** EVFC\_\[MODULE\]\_\[NomSkill\]\_\[YYYY-MM-DD\].docx

## **4.6 Google Forms (M5 uniquement)**

**•** Boutons "🟦 Forms Formateur" et "🟩 Forms Auto-éval" dans la barre résultat M5

**•** parseGrilleFromMarkdown() extrait critères et niveaux depuis le tableau Markdown

**•** generateAppsScriptForms(mdText, type) produit le script .gs complet buildForm()

**•** Modale avec 2 onglets, 3 étapes d'utilisation, bouton copier

**Utilisation du script :** 1\. Google Drive → Nouveau → Apps Script  2\. Coller le script  3\. ▶ Exécuter → buildForm → Autoriser

## **4.7 Gestion clé API (HTML uniquement)**

**•** Stockage : localStorage, clé "evfc\_anthropic\_api\_key"

**•** Validation : la clé doit commencer par "sk-"

**•** Modale automatique au premier chargement si clé absente

**•** Indicateur header : 🔴 manquante / 🟢 configurée (4 derniers caractères visibles)

**•** Erreur 401 → effacement automatique \+ réouverture modale

# **5\. Palette et design**

## **5.1 Couleurs principales**

| Rôle | Valeur HEX | Usage |
| :---- | :---- | :---- |
| Navy principal | \#002455 | Header, titres H1/H2, bouton générer, sidebar active |
| Navy light | \#003580 | Hover navy |
| Rouge | \#F0322C | Accents, H3, bullets, bordures, badge version |
| Rouge soft | \#ff5a56 | Hover rouge |

## **5.2 Couleurs par module**

| Module | ID | Couleur |
| :---- | :---- | :---- |
| INTRO | intro | \#7c3aed |
| M0 | m0 | \#0891b2 |
| M1 | m1 | \#0284c7 |
| M2 | m2 | \#7c3aed |
| M3 | m3 | \#059669 |
| M4 | m4 | \#d97706 |
| M5 | m5 | \#dc2626 |
| M6 | m6 | \#db2777 |
| M7 | m7 | \#374151 |

# **6\. Processus de mise à jour**

## **6.1 Quand un skill du plugin est modifié**

**Étape 1 — Lire le SKILL.md mis à jour**

/mnt/skills/plugins/pack-evfc-fpa:\[nom-du-skill\]/SKILL.md

**Étape 2 — Identifier les changements**

**•** Nouveaux champs d'input ?

**•** System prompt modifié ?

**•** Nouveau chaînage recommandé ?

**•** Nouvelle logique de pré-remplissage ?

**Étape 3 — Mettre à jour le tableau SKILLS**

const SKILLS \= \[ { id: 'mx', fields: \[...\], systemPrompt: \`...\` } \]

**Étape 4 — Répliquer dans LES DEUX fichiers**

**⚠️ Toute modification du tableau SKILLS doit être répliquée dans le HTML ET dans le JSX.**

**Étape 5 — Vérifier les logiques spéciales M3/M4/M5/M6**

**•** M3 : upstreamSources et prefillM3From()

**•** M5 : bloc pré-remplissage M4 et parseGrilleFromMarkdown()

**•** M5 : generateAppsScriptForms() (niveaux, structure formulaire)

**Étape 6 — Valider la syntaxe JS (HTML)**

node \--input-type=module \<\< 'EOF'

import { readFileSync } from 'fs';

const html \= readFileSync('evfc-formateur-augmente.html', 'utf8');

const scriptMatch \= html.match(/\<script\>(\[sS\]\*?)\<\\/script\>/);

try { new Function(scriptMatch\[1\]); console.log('JS OK'); }

catch(e) { console.error('Erreur:', e.message); }

EOF

## **6.2 Ajout d'un nouveau skill**

**•** Ajouter un objet dans const SKILLS avec tous les champs requis

**•** Ajouter l'id dans la section appropriée de SECTIONS (sidebar)

**•** Si logique de pré-remplissage amont, ajouter le bloc contextuel dans renderSkillPanel()

**•** Si pertinent, ajouter une nouvelle chaîne dans CANONICAL\_CHAINS

**•** Mettre à jour les chain: \[...\] des skills qui pointent vers ce nouveau skill

## **6.3 Reconstruction complète from scratch**

Si les deux fichiers sont perdus, reconstruire dans cet ordre :

**1\. Lire tous les SKILL.md du plugin pack-evfc-fpa**

Extraire fields \+ systemPrompt pour chaque skill (9 fichiers).

**2\. Construire le tableau SKILLS (9 entrées)**

Respecter strictement la structure : id, module, name, shortName, desc, color, chain, fields\[\], systemPrompt.

**3\. Construire le HTML dans cet ordre**

**•** a. Structure HTML (header \+ sidebar \+ nav-bar \+ main)

**•** b. CSS complet (variables CSS \+ composants \+ dark mode \+ modales)

**•** c. Fonctions de rendu (renderSidebar, renderWelcome, renderSkillPanel)

**•** d. Système de navigation (selectSkill, goBack, goHome, updateNav)

**•** e. Système de cache et pré-remplissage (resultCache, prefillM3From)

**•** f. Gestion clé API (getApiKey, saveApiKey, showApiKeyModal)

**•** g. Génération IA (generate, renderResult)

**•** h. Exports (exportPDF, exportDOCX)

**•** i. Google Forms M5 (parseGrilleFromMarkdown, generateAppsScriptForms, showFormsModal)

**•** j. Toast \+ Keyboard shortcuts \+ INIT

**4\. Construire le JSX dans cet ordre**

**•** a. Imports \+ constantes palette (NAVY, RED)

**•** b. SKILLS \+ CANONICAL\_CHAINS (identiques au HTML)

**•** c. Helpers (cleanText, MarkdownView)

**•** d. Component App() avec tous les hooks

**•** e. Mêmes logiques métier (generate, prefillM3, navigation)

**•** f. JSX render (header \+ nav \+ sidebar \+ main panel)

**•** g. Styles inline \+ \<style\> global (animations)

**5\. Valider les deux fichiers**

Validation syntaxe JS (commande node), puis test visuel dans navigateur/Claude.ai.

# **7\. Checklist de reconstruction**

## **7.1 Vérifications après modification**

**•** ☐ Tableau SKILLS mis à jour dans les deux fichiers

**•** ☐ CANONICAL\_CHAINS cohérent avec les nouveaux chain: \[...\]

**•** ☐ Sections sidebar (SECTIONS) incluent le skill modifié/ajouté

**•** ☐ systemPrompt copié fidèlement depuis le SKILL.md (zéro troncature)

**•** ☐ Champs required: true correctement définis

**•** ☐ Syntaxe JS validée (commande node)

**•** ☐ Clé API header fonctionnel (HTML)

**•** ☐ Dark mode testé sur les nouveaux composants

**•** ☐ Export PDF testé avec un vrai résultat généré

**•** ☐ Export DOCX testé

**•** ☐ Modale Google Forms testée (M5)

**•** ☐ Pré-remplissage M4→M5 testé

**•** ☐ Pré-remplissage M0/M1/M2→M3 testé

**•** ☐ Navigation clavier (Échap, Alt+flèches) fonctionnelle

## **7.2 Points de vigilance technique**

**systemPrompt : utiliser des backticks \` \`, pas des guillemets. Échapper les apostrophes internes.**

**Header "anthropic-dangerous-direct-browser-access: true" : obligatoire pour les appels API directs depuis un navigateur. Sans ce header, l'API retourne une erreur CORS.**

**resultCache :** Objet JS en mémoire, réinitialisé à chaque rechargement de page. Volontairement non persisté en localStorage pour des raisons de confidentialité.

**jsPDF et UTF-8 :** Le rendu des caractères accentués est limité. Utiliser .substring(0, n) pour tronquer les lignes longues dans l'export PDF.

# **8\. Informations de référence**

| Champ | Valeur |
| :---- | :---- |
| Auteur | Bruno Fernon |
| Organisation | Édumédiapole |
| Contact | bruno.fernon@edumediapole.net |
| Plugin source | pack-evfc-fpa (Claude.ai Cowork) |
| Version application | 2.0 |
| Modèle IA | claude-sonnet-4-6 |
| max\_tokens | 4000 |
| Date de référence | 12 juin 2026 |
| HTML lines | \~2 800 |
| JSX lines | \~700 |

Édumédiapole · bruno.fernon@edumediapole.net · Pack FPA v2.0