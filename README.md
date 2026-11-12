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
- Retiré pour l'instant : « poser une question à un frère » (bouton et étape 4 de « Découvrir »).

## Limites à lever avant une vraie mise en ligne
1. **Genre déclaratif** : rien n'empêche de déclarer l'autre genre. Le contrôle doit se faire côté serveur, avec une vérification adaptée.
2. **Vraies vidéos** : uniquement des vidéos fournies par les mosquées avec autorisation écrite, ou un lecteur officiel intégré. Pas de copie de TikTok/YouTube sans accord.
3. **Lives** : à prévoir plus tard (streaming, coût, modération).
4. **Comptes et géolocalisation** : données personnelles (RGPD, mineurs), à cadrer avant la vraie base de données.
5. **Textes** : traductions à faire relire par des locuteurs natifs ; rappels et hadiths à faire valider par un savant.
