# Formateur Augmenté EVFC

Application web pédagogique pour formateurs FPA (Formateurs Professionnels d'Adultes), développée par **Bruno FERNON**. Elle génère des livrables de formation complets via l'API Anthropic Claude, directement depuis le navigateur, sans serveur ni backend.

---

## Présentation

L'outil couvre l'intégralité de la chaîne de production pédagogique selon la méthode **EVFC** (Écouter · Voir · Faire · Consolider). Chaque module génère un livrable Markdown structuré, exportable en PDF ou DOCX.

Depuis la v2.0 enrichie, chaque génération injecte aussi dans le prompt système le `SKILL.md` correspondant au module utilisé. Le modèle Claude reçoit donc non seulement le cadrage court du module, mais aussi les règles métier, contraintes, interdictions, gabarits et validations propres au skill EVFC.

### Chaîne de production recommandée

```text
INTRO → M0 → M1 → M3
              ↓
              M4 → M5 → M6
              ↓
              M2

M7 intervient en aval pour automatiser l'exploitation ou la distribution des livrables.
```

| Module | Nom | Skill injecté | Description |
|--------|-----|---------------|-------------|
| INTRO | Simulateur EDC EVFC | `simulateur-edc-evfc` | Étude de cas guidée pour découvrir l'écosystème EVFC |
| M0 | Progression Pédagogique | `progression-pedagogique-evfc` | Structure une formation complète depuis un référentiel |
| M1 | Séquence EVFC | `evfc-sequence-designer` | Génère une séquence en 4 phases EVFC |
| M2 | Prompts Pédagogiques FPA | `ai-training-designer` | Bibliothèque de prompts en 7 familles FPA |
| M3 | QCM / QRL Google Forms | `qcm-evfc-validator` | QCM aligné EVFC + CSV + Apps Script |
| M4 | Scénarios FAIRE | `evfc-faire-scenario-generator` | Mises en situation professionnelles réalistes |
| M5 | Grilles Critériées | `grilles-criteriees` | Grilles d'évaluation observables + génération Google Forms |
| M6 | Boucle E.R.A. | `era-loop-coach` | Remédiation Empathie-Résolution-Adhésion |
| M7 | Automatisation n8n | `n8n-automatisation-pedagogique` | Workflows d'automatisation pédagogique pour n8n |

---

## Fonctionnalités

- **Génération IA** via l'API Anthropic, appelée directement depuis le navigateur.
- **Injection des skills EVFC** : le `SKILL.md` du module actif est intégré au prompt système envoyé au modèle.
- **Sélecteur de modèle Claude** dans l'en-tête : Haiku 4.5, Sonnet 4.6 par défaut, Opus 4.8.
- **Catalogue centralisé des modèles** via `MODEL_IDS` / `MODEL_CATALOG`, utilisé par le sélecteur, l'accueil et les recommandations.
- **Longueur configurable par module** : choix `max_tokens` parmi 6 000, 8 000, 12 000, 18 000, 24 000 ou 36 000 tokens, ou option « Pas de limite » (résolue vers le maximum du modèle sélectionné), persisté dans `localStorage`.
- **Créativité configurable par module** : choix `temperature` parmi 0.2, 0.5, 0.7 ou 1.0, persisté dans `localStorage`.
- **Bouton "Copier le prompt"** avant génération : copie le prompt complet, incluant modèle, limite de tokens, temperature, system prompt enrichi et message utilisateur.
- **Feedback visible en cas d'échec localStorage** : cache plein, stockage indisponible ou données locales illisibles ne restent plus silencieux.
- **Enchaînement de modules** : résultats d'un module pré-remplissent automatiquement le suivant (M4 → M5, M1/M0/M2 → M3).
- **Persistance des livrables** : les résultats générés sont conservés en `localStorage` et restent accessibles lors de la navigation entre modules.
- **Bouton « 🗑️ Vider les livrables »** dans l'en-tête : efface, après confirmation, uniquement les livrables générés mis en cache (`evfc_result_cache`, `evfc_result_model_by_module`). La clé API et les préférences (modèle, longueur, créativité) sont conservées.
- **Export PDF** avec en-tête Édumédiapole, tableaux Markdown et pagination.
- **Export DOCX** via chargement dynamique de `docx.js`, avec styles de titres, tableaux et mise en page Édumédiapole.
- **Export DOCX combiné multi-modules** : assemble plusieurs livrables mémorisés en un seul fichier Word.
- **Google Forms** : génération de scripts Apps Script prêts à coller pour les grilles M5.
- **Navigation chaînée** : fil d'Ariane, rail de chaîne, historique, raccourcis clavier.
- **Mode clair / sombre**.
- **Clé API** stockée dans le `localStorage` du navigateur, jamais transmise à un serveur tiers.

---

## Démarrage rapide

L'application est un fichier HTML unique, sans dépendance locale ni étape de build.

```bash
# Cloner le dépôt
git clone <url-du-repo>

# Ouvrir directement dans le navigateur
open index.html
# ou double-cliquer sur index.html
```

Au premier lancement, une modale demande la clé API Anthropic. Obtenir une clé sur [console.anthropic.com](https://console.anthropic.com) → **API Keys**.

> Les tokens sont facturés sur le compte Anthropic de l'utilisateur.  
> La clé est stockée uniquement dans le navigateur (`localStorage`).

---

## Stack technique

| Composant | Technologie |
|-----------|-------------|
| Interface | HTML5 / CSS3 / JavaScript vanilla |
| IA | Anthropic API `/v1/messages` |
| Modèles | Haiku 4.5 / Sonnet 4.6 / Opus 4.8 |
| Rendu Markdown | [Marked.js 9.1.6](https://marked.js.org) |
| Export PDF | [jsPDF 2.5.1](https://github.com/parallax/jsPDF) + html2canvas 1.4.1 |
| Export DOCX | [docx.js 7.8.2](https://docx.js.org), chargé dynamiquement |
| Stockage local | `localStorage` |
| Backend | Aucun : appels API directs depuis le navigateur |

---

## Structure du projet

```text
Pack_formateur_augmente-evfc/
├── index.html
├── README.md
├── CHANGELOG.md
├── PRD — Formateur Augmenté EVFC.md
├── guide-reconstruction-evfc.md
├── images/
└── skills/
    ├── INTRO-simulateur-edc-evfc/
    ├── M0-progression-pedagogique-evfc/
    ├── M1-evfc-sequence-designer/
    ├── M2-ai-training-designer/
    ├── M3-qcm-evfc-validator/
    ├── M4-evfc-faire-scenario-generator/
    ├── M5-grilles-criteriees/
    ├── M6-era-loop-coach/
    ├── M7-n8n-automatisation/
    ├── orchestrateur-architecte-formateur-augmente/
    └── _transverses/
```

Le contenu des `SKILL.md` module est embarqué dans `index.html` sous forme de table `EVFC_MODULE_SKILLS` afin de conserver le mode monofichier et l'ouverture directe dans le navigateur.

---

## Données persistées

| Clé localStorage | Usage |
|---|---|
| `evfc_anthropic_api_key` | Clé API Anthropic |
| `evfc_model` | Modèle Claude sélectionné |
| `evfc_result_cache` | Dernier livrable généré par module |
| `evfc_max_tokens_by_module` | Préférences de longueur par module |
| `evfc_temperature_by_module` | Préférences de créativité par module |
| `sidebarCollapsed` | État du panneau latéral |

---

## Utilisation des tokens

Repères de consommation de tokens mesurés par le développeur lors de tests de génération réels, module par module :

| Module | Tokens d'entrée | Tokens de sortie | Température testée | Modèle utilisé |
|--------|------------------|-------------------|---------------------|-----------------|
| INTRO | 2 656 | 10 079 | 0.7 | Sonnet 4.6 |
| M0 | 2 194 | 4 904 | 0.5 | Sonnet 4.6 |
| M1 | 1 610 | 8 046 | 0.5 | Sonnet 4.6 |
| M2 | 1 829 | 32 900 | 0.5 | Haiku 4.5 |
| M3 | 2 085 | 12 727 | 0.2 | Sonnet 4.6 |
| M4 | 1 644 | 5 799 | 0.5 | Sonnet 4.6 |
| M5 | 2 155 | 5 401 | 0.2 | Haiku 4.5 |
| M6 | 2 155 | 5 224 | 0.5 | Haiku 4.5 |

> ⚠️ Ces valeurs sont **indicatives** : elles dépendent fortement du contenu fourni en entrée (taille du référentiel, du scénario, de la consigne...) et peuvent varier sensiblement d'une génération à l'autre. Elles servent uniquement de point de repère pour choisir une valeur de **« Longueur maximale du livrable »** cohérente avec le module utilisé, en gardant une marge au-dessus des tokens de sortie observés.

---

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Échap` | Retour à l'accueil |
| `Alt + ←` | Module précédent / historique |
| `Alt + →` | Module suivant dans la chaîne |

---

## Points de vigilance

- L'application appelle Anthropic directement depuis le navigateur avec `anthropic-dangerous-direct-browser-access: true`.
- La clé API est stockée en clair dans `localStorage`. C'est adapté à un usage personnel ou intranet, pas à un déploiement public multi-utilisateurs.
- Les dépendances front sont chargées depuis CDN : l'application requiert une connexion internet.
- Le contenu des skills est embarqué dans `index.html` : après modification d'un `SKILL.md`, il faut régénérer la table `EVFC_MODULE_SKILLS` pour que l'application reflète le changement.

---

## Contact

**Édumédiapole** — bfernon@edumediapole.net
