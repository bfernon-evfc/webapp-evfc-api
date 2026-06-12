# Formateur Augmenté EVFC

Application web pédagogique pour formateurs FPA (Formateurs Professionnels d'Adultes), développée par **Édumédiapole**. Génère des livrables de formation complets via l'API Anthropic Claude, directement depuis le navigateur — sans serveur, sans backend.

---

## Présentation

L'outil couvre l'intégralité de la chaîne de production pédagogique selon la méthode **EVFC** (Écouter · Voir · Faire · Consolider). Chaque module génère un livrable Markdown structuré, exportable en PDF ou DOCX.

### Chaîne de production recommandée

```
INTRO → M0 → M1 → M4 → M5 → M6
```

| Module | Nom | Description |
|--------|-----|-------------|
| INTRO | Simulateur EDC EVFC | Étude de cas guidée pour découvrir l'écosystème EVFC |
| M0 | Progression Pédagogique | Structure une formation complète depuis un référentiel |
| M1 | Séquence EVFC | Génère une séquence en 4 phases (15/15/50/15 %) |
| M2 | Prompts Pédagogiques FPA | Bibliothèque de prompts en 7 familles FPA |
| M3 | QCM / QRL Google Forms | QCM aligné EVFC + CSV 9 colonnes + Apps Script |
| M4 | Scénarios FAIRE | Mises en situation professionnelles ultra-réalistes |
| M5 | Grilles Critériées | Grilles d'évaluation observables + génération Google Forms |
| M6 | Boucle E.R.A. | Remédiation Empathie-Résolution-Adhésion |
| M7 | Automatisation n8n | Workflows d'automatisation pédagogique pour n8n |

---

## Fonctionnalités

- **Génération IA** via l'API Anthropic (Claude claude-sonnet-4-20250514), appelée directement depuis le navigateur
- **Enchaînement de modules** : résultats d'un module pré-remplissent automatiquement le suivant (M4 → M5, M1/M0/M2 → M3)
- **Export PDF** (jsPDF) avec entête Édumédiapole et numérotation des pages
- **Export DOCX** (docx.js) avec styles de titres et mise en forme
- **Google Forms** : génération d'un script Apps Script prêt à coller pour les grilles M5 (formateur + auto-évaluation)
- **Navigation chaînée** : fil d'Ariane, rail de chaîne, historique, raccourcis clavier
- **Mode clair / sombre**
- **Clé API** stockée dans le `localStorage` du navigateur, jamais transmise à un tiers

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
| IA | Anthropic API — `claude-claude-sonnet-4-20250514` |
| Rendu Markdown | [Marked.js 9.1.6](https://marked.js.org) |
| Export PDF | [jsPDF 2.5.1](https://github.com/parallax/jsPDF) + html2canvas 1.4.1 |
| Export DOCX | [docx.js 8.5.0](https://docx.js.org) |
| Backend | Aucun — appels API directs depuis le navigateur |

---

## Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Échap` | Retour à l'accueil |
| `Alt + ←` | Module précédent (historique) |
| `Alt + →` | Module suivant dans la chaîne |

---

## Structure du projet

```
webapp-evfc-api/
└── index.html      # Application complète (CSS + JS + HTML inline)
```

---

## Contact

**Édumédiapole** — bfernon@edumediapole.net
