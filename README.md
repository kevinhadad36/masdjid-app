# Masdjid — prototype

Prototype de l'application Masdjid : covoiturage vers la mosquée, horaires de prière par mosquée, rappels vidéo, cours, famille.
**Maquette** : aucune base de données, aucun serveur, aucune donnée envoyée. Tout est stocké dans le navigateur (`localStorage`).

## Lancer en local
```
python -m http.server 8123
```
puis ouvrir http://127.0.0.1:8123 (idéalement en affichage mobile).

## Fichiers
| Fichier | Rôle |
|---|---|
| `index.html` | Application (écrans, navigation, carte, prières, stories, covoiturage, famille) |
| `features2.js` | Ajouts du 15/11/2026 : profil (emoji + position), trajets validés, demande d'ajout de mosquée, page mosquée (QR), bandeau et notification avant la prière |
| `sw.js` | Service worker minimal, seulement pour afficher la notification avant la prière (pas de cache) |
| `features.js` | Ajouts : couleurs par section, série de prières, rappels vidéo, compte, covoiturage frères/sœurs, cours |
| `i18n.js` / `extra-i18n.js` | Textes (6 langues) / textes des ajouts (fr + en, les autres retombent sur le français) |
| `mosques.js` | Mosquées de Toulouse et horaires (sources indiquées) |

## Fonctions
- **Série de prières** : icône « mains levées » (à faire redessiner). Un jour compte dès `STREAK_MIN` prière(s) cochée(s) (1 par défaut, règle provisoire, `features.js`). Déclaratif.
- **Rappels** : flux vertical à swiper (courts / plus longs / lives). Vidéos **fictives** (aucun média réel). J'aime + réactions prédéfinies uniquement, partage (Web Share, sinon WhatsApp).
- **Couleurs par section** : carte vert, prières turquoise, rappels violet, stories orange, RDV bleu, série or, live rouge.
- **Comptes** : e-mail OU téléphone (un suffit). Maquette locale, rien n'est vérifié.
- **Covoiturage séparé** : les sœurs ne voient et ne proposent des trajets qu'avec des sœurs, les frères qu'avec des frères. Messages **prédéfinis** uniquement, dont « Rendez-vous [lieu] pour aller à la mosquée ». Aucune saisie libre.
- **Cours** : horaires des cours par mosquée et covoiturage pour s'y rendre. Cours de **démonstration** sur la « mosquée démo » seulement : aucun horaire inventé pour une vraie mosquée. Une mosquée vérifiée (mode mosquée) peut ajouter ses cours.
- **Profil (Compte)** : prénom/pseudo, emoji **sans visage** (objets, nature, symboles) affiché sur la carte à la place du point bleu (comme Snap/Waze), partage de position (désactivé par défaut), mosquée choisie pour les horaires.
- **Covoiturage** : « Je propose / Je cherche » → formulaire (mosquée, prière ou cours, jour, heure, places, point de départ) → récapitulatif → **Valider le trajet**. Les trajets validés s'affichent dans « Trajets » en deux listes (ils proposent / ils cherchent), filtrables par mosquée, avec « Demander une place / Proposer de l'emmener » et « Voir sur la carte » (emoji de la personne). Trajets « DÉMO » fictifs pour remplir le tableau.
- **Ajouter ma mosquée** (Plus + bas de la carte) : formulaire de demande (mosquée, adresse, contact, rôle, confirmation). Maquette : la demande reste sur le téléphone.
- **QR code** : ouvre la **page de la mosquée** (`#mosquee=<id>`) : faire un don (lien saisi par la mosquée en mode mosquée), covoiturage de cette mosquée, horaires, itinéraire.
- **Avant la prière** : bandeau jaune en haut des rappels vidéo 15 min avant l'adhan (horaires de la mosquée choisie dans le Compte) + notification « Mets ton téléphone en mode avion » (à activer dans le Compte). Boutons de test dans le Compte.
- Retiré pour l'instant : « poser une question à un frère » (bouton et étape 4 de « Découvrir »).

## Limites à lever avant une vraie mise en ligne
1. **Genre déclaratif** : rien n'empêche de déclarer l'autre genre. Le contrôle doit se faire côté serveur, avec une vérification adaptée.
2. **Vraies vidéos** : uniquement des vidéos fournies par les mosquées avec autorisation écrite, ou un lecteur officiel intégré. Pas de copie de TikTok/YouTube sans accord.
3. **Lives** : à prévoir plus tard (streaming, coût, modération).
4. **Comptes et géolocalisation** : données personnelles (RGPD, mineurs), à cadrer avant la vraie base de données.
5. **Partage réel de la position, des trajets et des demandes de mosquée** : il faut un serveur (aujourd'hui tout reste sur le téléphone). Notification appli fermée : vraie appli (Android/iOS) ou serveur d'envoi.
6. **Textes** : traductions à faire relire par des locuteurs natifs ; rappels et hadiths à faire valider par un savant.
