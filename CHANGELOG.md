# Changelog

Toutes les modifications notables de ce projet sont documentées ici.  
Format : [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)

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
