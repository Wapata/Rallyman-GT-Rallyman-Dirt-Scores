[🇫🇷 Version française](README.fr.md) · **🇬🇧 English**

# Rallyman Chrono — Score & Race Tracker (DIRT & GT)

A mobile-first, standalone web companion app for tracking scores, race times, car damage, tire wear, and multi-group standings across **Rallyman: DIRT** and **Rallyman: GT** (including all official expansions).

Designed for phones, tablets, and desktops with **zero account or login required**: everything runs locally in your browser (`localStorage`), and you can export or resume sessions anytime via **CSV** (directly compatible with Google Sheets, Google Drive, and Excel).

---

## Features

### 1. Dual-Game & Multi-Group Workspace
- **Instant Game Switch**: Toggle between **Rallyman: DIRT** and **Rallyman: GT** from the main race bar or event library.
- **Multi-Group Management**: Keep separate player groups (family, Tuesday club, solo...) with one game copy. Groups retain separate profiles for DIRT and GT.
- **Active Dashboards Reference**: Toggle expansions to unlock exact dice counts (`V` Speed / `G` Coast / `F` Brake / `B` Boost) and warning limits (`⚠`) for every car class.

### 2. Rallyman: DIRT Support
- **Base Game (`R6`) & Expansions**:
  - **R4 & R5**: Exact dice pools, max gears (`V4` / `V5`), and green **Boost** die (`R5`).
  - **The Climb**: 3-attempt Hillclimb format (`TRY1–TRY3`) ranked on best single time, full reset between runs, and `Unlimited` custom dashboard notes.
  - **Copilot Pack (Pack Copilote)**: `Classic` cars (no brakes) and **Soft Tires** wear tracking (`T1–T4: 4⚠`, `T5–T6: 3⚠`, `T7+: 2⚠`), reset only at the Service Tent.
  - **RX / Auto Tour / Ice**: Direct head-to-head ranking (`1st–6th`) with mandatory **Joker Lap** check (or DSQ), wet/dry weather tracking, official **Auto Tour** circuit time penalties (`+0s / +20s / +30s / +40s / +50s / +60s`), and `RX` / `ICE` / `ICE_PRO` cars.
- **Stage Entry Calculator**: One-tap Chrono cards (`V1–V6`, `Loss of Control / PDC`, `SISU`), `Seconds` tokens (`-1s`), `Liaison` penalties (`+5s`), automatic `Abandon` calculation (`+1:00` over slowest finisher), Spare Tire tracking, and one-click **Service Tent** reset.

### 3. Rallyman: GT Support
- **Base Game (`GT6`) & Expansions**:
  - **GT4 & GT5**: `GT4` (`V4` max, `3G`), `GT5` (`V5` max, green **Boost** die), and **B.O.P.** cards (`GT6 B.O.P.`, `GT5 B.O.P.`) for mixed-class races.
  - **Adrenaline Pack**: GT **Soft Tires** wear tracking (`T1–T3: 4⚠`, `T4–T6: 3⚠`, `T7+: 2⚠`, frozen in rain, reset at Pit Stops) and `SISU` token tracking.
  - **Championship**: Official 8-race structure (`C1–C8`), official points table (`25, 18, 15, 12, 10, 8, 6, 4, 2, 1`), **Driver Standings** and **Team / Constructor Standings**.
  - **Team Challenge**: Up to **12 cars** per group, Figure-8 circuits, Pursuit mode (`Grid A / Grid B`), and automatic tie-breaking on remaining **Focus tokens**.
  - **World Tour**: Showcase international circuits and full 10-race World Tour championship preset.
  - **Solo Mode (updated with Official FAQ Errata)**: Tap-to-sum end-of-turn Gear Time Sheet (`V6 = 0:10`, `V5 = 0:15`, `V4 = 0:20`, `V3 = 0:30`, `V2 = 0:40`, `V1 = 0:50`, `V0 = 1:00`, `V00 = 0:30`) minus remaining **Focus tokens** (`-1s` each).

### 4. Standalone CSV Export & Import
- **No OAuth / No Login**: Download or copy a UTF-8 semicolon-delimited `.csv` file (complete or filtered to DIRT/GT).
- **Share with Google Sheets or Excel**: Upload the `.csv` directly to Google Drive / Google Sheets (`File → Import`) to share standings with players, or re-import any exported `.csv` (file upload or paste) on another phone or computer to resume a tournament.

---

## Tech Stack

- **React 19** + **TypeScript**
- **Vite**
- **Tailwind CSS v4**
- **Lucide React** icons

---

## Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Type-check and build for production
npm run lint
npm run build
```

---

## Hosting on GitHub Pages (Free)

Because this app runs 100% client-side with no backend or secret keys, you can host it for free on **GitHub Pages**:

1. If publishing to a project URL like `https://<username>.github.io/<repo-name>/`, set `base: './'` inside `vite.config.ts` so asset paths resolve relative to the repository folder.
2. Run `npm run build` (or configure a GitHub Actions workflow using `actions/upload-pages-artifact` on `./dist`).
3. Enable **Settings → Pages** in your GitHub repository.

---

## License & Disclaimer

- **Code License**: This software is released under the [MIT License](LICENSE).
- **Disclaimer**: *Rallyman Chrono* is an unofficial, free fan-made companion tool. It is not affiliated with, endorsed by, or connected to **Jean-Christophe Bouvier**, **Bouvier International**, or the publishers of *Rallyman: DIRT* and *Rallyman: GT*. All game rules, car names, and track references remain the property of their respective owners.
