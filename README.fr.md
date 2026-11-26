**🇫🇷 Français** · [🇬🇧 English version](README.md)

# Rallyman Chrono — Suivi de scores & chronos (DIRT & GT)

Application web compagnon autonome, conçue en priorité pour **téléphone, tablette et ordinateur**, dédiée au suivi des temps, positions, dégâts, usure de pneus et classements multi-groupes pour **Rallyman: DIRT** et **Rallyman: GT** (avec l’ensemble de leurs extensions officielles).

Fonctionne **sans aucun compte ni connexion** : toutes les données sont enregistrées localement dans votre navigateur (`localStorage`) et peuvent être exportées, partagées ou reprises à tout moment via un simple fichier **CSV** (directement ouvrable dans Google Sheets, Google Drive ou Excel).

---

## Fonctionnalités

### 1. Double jeu & Gestion multi-groupes
- **Bascule DIRT / GT en un clic** : passez de **Rallyman: DIRT** à **Rallyman: GT** depuis l’onglet **Course** ou la bibliothèque **Épreuves**.
- **Suivi multi-groupes** : créez plusieurs groupes de joueurs (club, famille, solo...) pour une même boîte de jeu. Chaque groupe conserve simultanément ses voitures DIRT et GT.
- **Tableaux actifs** : activez ou désactivez les extensions pour afficher le nombre exact de dés (`V` Vitesse / `G` Gaz / `F` Freins / `B` Boost) et la limite d’avertissements (`⚠`) de chaque catégorie.

### 2. Prise en charge complète de Rallyman: DIRT
- **Boîte de base (`R6`) & Extensions** :
  - **R4 & R5** : tableaux exacts (`V4` max + `3G` en R4, `V5` max + dé **Boost** vert en R5).
  - **The Climb** : format **Course de côte** en 3 essais (`TRY1–TRY3`) classé sur le meilleur temps, remise à zéro entre les montées et catégorie `Unlimited` personnalisable.
  - **Pack Copilote** : voitures `Classique` (sans freins) et suivi d’usure des **Pneus Tendres** (`T1–T4 : 4⚠`, `T5–T6 : 3⚠`, `T7+ : 2⚠`), réinitialisée uniquement à l’Assistance.
  - **RX / Auto Tour / Glace** : confrontation directe (`1er–6e`) avec validation du **Tour Joker** obligatoire (ou DSQ), météo humide/sec, barème officiel **Auto Tour** (`+0s / +20s / +30s / +40s / +50s / +60s`) et voitures `RX`, `ICE`, `ICE_PRO`.
- **Saisie tactile des spéciales** : addition rapide des cartes Chrono (`V1–V6`, `PDC`, `SISU`), jetons `Secondes` (`-1s`), pénalités de `Liaison` (`+5s`), calcul automatique de l’`Abandon` (`+1:00` sur le dernier classé), suivi de la roue de secours et bouton **Appliquer Assistance**.

### 3. Prise en charge complète de Rallyman: GT
- **Boîte de base (`GT6`) & Extensions** :
  - **GT4 & GT5** : voitures `GT4` (`V4` max, `3G`), `GT5` (`V5` max, dé **Boost** vert) et cartes **B.O.P.** (`GT6 B.O.P.`, `GT5 B.O.P.`) pour les courses mixtes.
  - **Adrenaline Pack** : suivi d’usure des **Pneus Tendres** GT (`T1–T3 : 4⚠`, `T4–T6 : 3⚠`, `T7+ : 2⚠`, gelée sous la pluie et réinitialisée aux Stands) et jeton `SISU`.
  - **Championship** : format officiel en 8 courses (`C1–C8`), barème officiel (`25, 18, 15, 12, 10, 8, 6, 4, 2, 1` pts), classement **Meilleur Pilote** et classement **Constructeurs / Équipes**.
  - **Team Challenge** : jusqu’à **12 voitures** par groupe, circuits en « 8 », **Course-Poursuite** (`Grille A / B`) et départage automatique au plus grand nombre de jetons **Focus**.
  - **World Tour** : circuits internationaux et championnat complet en 10 manches.
  - **Mode Solo (avec errata FAQ officiel)** : feuille de temps tactile des vitesses en fin de tour (`V6 = 0:10`, `V5 = 0:15`, `V4 = 0:20`, `V3 = 0:30`, `V2 = 0:40`, `V1 = 0:50`, `V0 = 1:00`, `V00 = 0:30`) avec déduction des jetons **Focus** restants (`-1s` par jeton).

### 4. Export & Import CSV autonome
- **Zéro connexion Google requise** : téléchargez ou copiez un fichier `.csv` (UTF-8 avec séparateur `;`, complet ou filtré par jeu).
- **Partage facile via Google Drive / Excel** : importez le `.csv` dans Google Sheets (`Fichier → Importer`) pour partager les résultats avec vos joueurs, ou réimportez un fichier CSV (upload ou copier-coller) sur un autre appareil pour reprendre la partie là où vous l’aviez laissée.

---

## Technologies utilisées

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React**

---

## Installation et développement local

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement (http://localhost:3000)
npm run dev

# Vérifier le typage TypeScript et compiler pour la production
npm run lint
npm run build
```

---

## Hébergement gratuit sur GitHub Pages

L’application étant 100 % autonome côté navigateur (sans serveur ni clé API), elle peut être hébergée gratuitement sur **GitHub Pages** :

1. Si vous publiez vers une adresse de type `https://<pseudo>.github.io/<nom-du-depot>/`, ajoutez `base: './'` dans `vite.config.ts` afin que les chemins des fichiers soient relatifs au dépôt.
2. Compilez avec `npm run build` (ou via un workflow GitHub Actions publiant le dossier `dist/`).
3. Activez **Settings → Pages** dans les paramètres de votre dépôt GitHub.

---

## Licence & Avertissement

- **Licence du code** : ce projet est distribué sous [licence MIT](LICENSE).
- **Avertissement** : *Rallyman Chrono* est un outil compagnon non officiel, gratuit et créé par des passionnés. Il n’est ni affilié, ni sponsorisé, ni validé par **Jean-Christophe Bouvier**, **Bouvier International** ou les éditeurs des gammes *Rallyman: DIRT* et *Rallyman: GT*. Les règles, noms de véhicules et tracés de circuits restent la propriété de leurs détenteurs respectifs.
