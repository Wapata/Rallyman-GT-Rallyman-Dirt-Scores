import { Locale } from '../i18n/translations';
import { GtCarClass, GtExtensionId, RallySession, RallyTemplate } from '../types/rally';

export interface GtExtensionMeta {
  id: GtExtensionId;
  name: string;
  summary: string;
}

const GT_EXTENSIONS_BY_LOCALE: Record<Locale, GtExtensionMeta[]> = {
  fr: [
    {
      id: 'gt4',
      name: 'GT4',
      summary: 'Voitures GT4 (Vitesse max 4, +1 dé Gaz) + cartes B.O.P.',
    },
    {
      id: 'gt5',
      name: 'GT5',
      summary: 'Voitures GT5 (Vitesse max 5, dé Boost vert) + cartes B.O.P.',
    },
    {
      id: 'adrenaline',
      name: 'Adrenaline Pack',
      summary: 'Pneus Tendres (T1–T3: 4⚠, T4–T6: 3⚠, T7+: 2⚠), Pont, Huile/Débris, Pousser, SISU',
    },
    {
      id: 'championship',
      name: 'Championship',
      summary: 'Mode Championnat en 8 courses (25–1 pts), Meilleur Pilote & Équipe, Circuits 11–18',
    },
    {
      id: 'team_challenge',
      name: 'Team Challenge',
      summary: 'Jusqu’à 12 voitures, circuits en « 8 » (intersection), Course-Poursuite, Circuits 31–37',
    },
    {
      id: 'world_tour',
      name: 'World Tour',
      summary: '10 circuits internationaux (Suède, Macao, Monaco, Italie, France, etc.)',
    },
  ],
  en: [
    {
      id: 'gt4',
      name: 'GT4',
      summary: 'GT4 cars (Max Gear 4, +1 Coast die) + B.O.P. Dashboards',
    },
    {
      id: 'gt5',
      name: 'GT5',
      summary: 'GT5 cars (Max Gear 5, green Boost die) + B.O.P. Dashboards',
    },
    {
      id: 'adrenaline',
      name: 'Adrenaline Pack',
      summary: 'Soft Tires (T1–T3: 4⚠, T4–T6: 3⚠, T7+: 2⚠), Bridge, Oil/Debris, Shunting, Sisu',
    },
    {
      id: 'championship',
      name: 'Championship',
      summary: '8-race Championship (25–1 pts), Best Driver & Best Team, Tracks 11–18',
    },
    {
      id: 'team_challenge',
      name: 'Team Challenge',
      summary: 'Up to 12 cars, Figure "8" tracks (Intersection), Pursuit Mode, Tracks 31–37',
    },
    {
      id: 'world_tour',
      name: 'World Tour',
      summary: '10 international tracks (Sweden, Macau, Monaco, Italy, France, etc.)',
    },
  ],
};

export const GT_EXTENSIONS_CATALOG: GtExtensionMeta[] = GT_EXTENSIONS_BY_LOCALE.fr;

export function getGtExtensionsCatalog(locale: Locale): GtExtensionMeta[] {
  return GT_EXTENSIONS_BY_LOCALE[locale];
}

export interface GtCarDashboardSpec {
  code: GtCarClass;
  label: string;
  requiredExtension?: GtExtensionId;
  maxGear: number;
  speedDice: number;
  coastDice: number;
  brakeDice: number;
  boostDice: number;
  dangerLimit: number;
  surfaceNote: string;
}

export const GT_CAR_SPECS: Record<GtCarClass, GtCarDashboardSpec> = {
  GT6: {
    code: 'GT6',
    label: 'GT6 (Base — 6 vitesses)',
    maxGear: 6,
    speedDice: 6,
    coastDice: 2,
    brakeDice: 3,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Asphalte Soleil: 6V 2G 3F (3⚠) · Zone Rouge: Freins utilisables en Gaz à V6',
  },
  GT6_BOP: {
    code: 'GT6_BOP',
    label: 'GT6 B.O.P. (Équilibre GT4/GT5/GT6)',
    requiredExtension: 'gt4',
    maxGear: 6,
    speedDice: 6,
    coastDice: 2,
    brakeDice: 2,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Carte B.O.P. pour courses mixtes GT4/GT5/GT6 (FAQ: 1G en Pneus Tendres)',
  },
  GT5: {
    code: 'GT5',
    label: 'GT5 (Ext. GT5 — 5 vitesses + Boost)',
    requiredExtension: 'gt5',
    maxGear: 5,
    speedDice: 5,
    coastDice: 2,
    brakeDice: 3,
    boostDice: 1,
    dangerLimit: 3,
    surfaceNote: 'Vitesse max 5 · 1 dé Boost vert (+2 vitesses d’un coup, hors Départ Canon)',
  },
  GT5_BOP: {
    code: 'GT5_BOP',
    label: 'GT5 B.O.P. (Équilibre GT4/GT5/GT6)',
    requiredExtension: 'gt5',
    maxGear: 5,
    speedDice: 5,
    coastDice: 2,
    brakeDice: 2,
    boostDice: 1,
    dangerLimit: 3,
    surfaceNote: 'Carte B.O.P. GT5 pour courses mixtes GT4/GT5/GT6 · V5 max + Boost vert',
  },
  GT4: {
    code: 'GT4',
    label: 'GT4 (Ext. GT4 — 4 vitesses + 3 Gaz)',
    requiredExtension: 'gt4',
    maxGear: 4,
    speedDice: 4,
    coastDice: 3,
    brakeDice: 3,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Vitesse max 4 · +1 dé Gaz supplémentaire (3G) · Pas de B.O.P. nécessaire',
  },
};

const GT_CAR_SPECS_EN: Record<GtCarClass, GtCarDashboardSpec> = {
  GT6: {
    ...GT_CAR_SPECS.GT6,
    label: 'GT6 (Core — 6 gears)',
    surfaceNote: 'Dry Asphalt: 6G 2C 3B (3⚠) · Redline: use Brake dice as Coast in Gear 6',
  },
  GT6_BOP: {
    ...GT_CAR_SPECS.GT6_BOP,
    label: 'GT6 B.O.P. (GT4/GT5/GT6 Balance)',
    surfaceNote: 'B.O.P. Dashboard for mixed GT4/GT5/GT6 races (FAQ: 1 Coast die on Soft Tires)',
  },
  GT5: {
    ...GT_CAR_SPECS.GT5,
    label: 'GT5 (Exp. GT5 — 5 gears + Boost)',
    surfaceNote: 'Max Gear 5 · 1 green Boost die (+2 Gears at once, no Flying Start)',
  },
  GT5_BOP: {
    ...GT_CAR_SPECS.GT5_BOP,
    label: 'GT5 B.O.P. (GT4/GT5/GT6 Balance)',
    surfaceNote: 'GT5 B.O.P. Dashboard for mixed GT4/GT5/GT6 races · Max Gear 5 + Boost',
  },
  GT4: {
    ...GT_CAR_SPECS.GT4,
    label: 'GT4 (Exp. GT4 — 4 gears + 3 Coast)',
    surfaceNote: 'Max Gear 4 · +1 extra Coast die (3C) · No B.O.P. Dashboard needed',
  },
};

export function getGtCarSpecs(locale: Locale): Record<GtCarClass, GtCarDashboardSpec> {
  return locale === 'en' ? GT_CAR_SPECS_EN : GT_CAR_SPECS;
}

// Official Championship points table (Championship rulebook p. 3-4)
export const GT_CHAMPIONSHIP_POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0, 0];

// Official Mode Solo Feuille de Temps (Core rulebook p. 22-23 + FAQ p. 3 Errata: 00 = 30s)
export interface GtSoloCardMeta {
  gear: number | '0' | '00';
  label: string;
  seconds: number;
  hint: string;
}

export const GT_SOLO_GEAR_CARDS: GtSoloCardMeta[] = [
  { gear: 6, label: 'Vitesse 6', seconds: 10, hint: '0:10' },
  { gear: 5, label: 'Vitesse 5', seconds: 15, hint: '0:15' },
  { gear: 4, label: 'Vitesse 4', seconds: 20, hint: '0:20' },
  { gear: 3, label: 'Vitesse 3', seconds: 30, hint: '0:30' },
  { gear: 2, label: 'Vitesse 2', seconds: 40, hint: '0:40' },
  { gear: 1, label: 'Vitesse 1', seconds: 50, hint: '0:50' },
  { gear: '0', label: 'Vitesse 0', seconds: 60, hint: '1:00' },
  { gear: '00', label: 'Vitesse 00', seconds: 30, hint: '0:30' },
];

const GT_SOLO_GEAR_CARDS_EN: GtSoloCardMeta[] = [
  { gear: 6, label: 'Gear 6', seconds: 10, hint: '0:10' },
  { gear: 5, label: 'Gear 5', seconds: 15, hint: '0:15' },
  { gear: 4, label: 'Gear 4', seconds: 20, hint: '0:20' },
  { gear: 3, label: 'Gear 3', seconds: 30, hint: '0:30' },
  { gear: 2, label: 'Gear 2', seconds: 40, hint: '0:40' },
  { gear: 1, label: 'Gear 1', seconds: 50, hint: '0:50' },
  { gear: '0', label: 'Gear 0', seconds: 60, hint: '1:00' },
  { gear: '00', label: 'Gear 00', seconds: 30, hint: '0:30' },
];

export function getGtSoloGearCards(locale: Locale): GtSoloCardMeta[] {
  return locale === 'en' ? GT_SOLO_GEAR_CARDS_EN : GT_SOLO_GEAR_CARDS;
}

export const OFFICIAL_GT_EVENTS: RallyTemplate[] = [
  // Preset 8-race Championship
  {
    id: 'gt-championship-official',
    game: 'gt',
    name: 'Championnat Officiel GT (8 Courses)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '8 courses · 2 tours / circuit · Barème 25–1 pts',
    mode: 'gt_championship',
    requiredExtensions: ['championship'],
    isOfficial: true,
    category: 'championship',
    stages: [
      { code: 'C1', name: 'Course 1 · Circuit 11', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C2', name: 'Course 2 · Circuit 12', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C3', name: 'Course 3 · Circuit 13', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C4', name: 'Course 4 · Circuit 14', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C5', name: 'Course 5 · Circuit 15', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C6', name: 'Course 6 · Circuit 16', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C7', name: 'Course 7 · Circuit 17', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'C8', name: 'Course 8 · Circuit 18', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
    ],
  },
  // Preset World Tour 10 races
  {
    id: 'gt-world-tour-official',
    game: 'gt',
    name: 'World Tour Complet (10 Circuits)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '10 manches internationales · Barème Championnat',
    mode: 'gt_championship',
    requiredExtensions: ['world_tour', 'championship'],
    isOfficial: true,
    category: 'world_tour',
    stages: [
      { code: 'SUE', name: 'Suède', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'MAC', name: 'Macao', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'MON', name: 'Monaco', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'ITA', name: 'Italie', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'ALL', name: 'Allemagne', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'FRA', name: 'France', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'USA', name: 'États-Unis', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'GBR', name: 'Royaume-Uni', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'BEL', name: 'Belgique', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
      { code: 'AUS', name: 'Australie', stageType: 'gt_circuit', hasServiceTent: true, laps: 2 },
    ],
  },
  // Core Rulebook Circuits 1–8 (p. 24-27)
  {
    id: 'gt-circuit-1',
    game: 'gt',
    name: 'Circuit 1 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '12 tuiles · Stands inclus · ~35 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C1',
        name: 'Circuit 1',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102b', '103b', '104b', '105b (x2)', '106b (x2)', '109b', '110b', '111b (x2)', '112b', '114b', '115b'],
      },
    ],
  },
  {
    id: 'gt-circuit-2',
    game: 'gt',
    name: 'Circuit 2 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '15 tuiles · Courbes rapides · ~40 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C2',
        name: 'Circuit 2',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102a', '103a', '104a (x2)', '105a (x2)', '106a', '111a (x2)', '112a (x2)', '115a (x2)', '116a', '117a'],
      },
    ],
  },
  {
    id: 'gt-circuit-3',
    game: 'gt',
    name: 'Circuit 3 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '16 tuiles · Enchaînements serrés · ~45 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C3',
        name: 'Circuit 3',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102b', '103b', '104b', '105b', '106b (x2)', '109b', '111b (x2)', '112b', '114b', '115b (x2)', '116b (x2)'],
      },
    ],
  },
  {
    id: 'gt-circuit-4',
    game: 'gt',
    name: 'Circuit 4 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '16 tuiles · Grandes courbes · ~45 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C4',
        name: 'Circuit 4',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102a', '103a (x2)', '105a', '106a (x2)', '110a', '111a', '112a', '113a', '115a (x2)', '117a (x2)', '118a'],
      },
    ],
  },
  {
    id: 'gt-circuit-5',
    game: 'gt',
    name: 'Circuit 5 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '17 tuiles · Technique & relances · ~50 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C5',
        name: 'Circuit 5',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102a', '103a', '104b', '105a', '106a', '106b', '107b', '108b', '109b', '111a', '112a', '113b', '117b', '118a', '119a', '120b'],
      },
    ],
  },
  {
    id: 'gt-circuit-6',
    game: 'gt',
    name: 'Circuit 6 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '16 tuiles · Ovale & chicane · ~45 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C6',
        name: 'Circuit 6',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102a', '103a (x2)', '104a (x2)', '105a', '106a', '107a', '109a', '111a', '112a', '113a', '116a', '117a', '118a'],
      },
    ],
  },
  {
    id: 'gt-circuit-7',
    game: 'gt',
    name: 'Circuit 7 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '18 tuiles · Technique urbain · ~55 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C7',
        name: 'Circuit 7',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102b', '103b (x2)', '104b', '105b', '106b (x2)', '107b', '108b', '109b', '111b (x2)', '112b', '113b', '114b', '116b', '117b'],
      },
    ],
  },
  {
    id: 'gt-circuit-8',
    game: 'gt',
    name: 'Circuit 8 (Boîte de base)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '18 tuiles · Haute vitesse · ~55 min',
    mode: 'gt_race',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'C8',
        name: 'Circuit 8',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102a', '103a (x3)', '104a (x3)', '105a (x2)', '106a', '107a', '110a', '111a', '113a', '114a', '117a', '118a'],
      },
    ],
  },
  // Championship Individual Circuits 11–18
  {
    id: 'gt-circuit-11',
    game: 'gt',
    name: 'Circuit 11 (Championship)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '15 tuiles · 2 tours · Ext. Championship',
    mode: 'gt_race',
    requiredExtensions: ['championship'],
    isOfficial: true,
    category: 'championship',
    stages: [
      {
        code: 'C11',
        name: 'Circuit 11',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101a', '102b', '104b', '105b', '106b (x2)', '107b', '109b', '110b', '111b', '121b', '123b', '124b', '125b', '130b'],
      },
    ],
  },
  {
    id: 'gt-circuit-15',
    game: 'gt',
    name: 'Circuit 15 (Championship)',
    author: 'Jean-Christophe Bouvier',
    durationHint: '17 tuiles · 2 tours · Ext. Championship',
    mode: 'gt_race',
    requiredExtensions: ['championship'],
    isOfficial: true,
    category: 'championship',
    stages: [
      {
        code: 'C15',
        name: 'Circuit 15',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101', '102a', '104a', '111b (x2)', '112a', '114b', '119a', '121a', '121b', '122b', '124b', '125b', '126b', '128b', '129b', '130b'],
      },
    ],
  },
  // Team Challenge Circuits (Circuits en 8 & Course-Poursuite)
  {
    id: 'gt-circuit-31',
    game: 'gt',
    name: 'Circuit 31 — Boucle en « 8 » (Team Challenge)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Jusqu’à 12 voitures · Intersection centrale · ~60 min',
    mode: 'gt_race',
    requiredExtensions: ['team_challenge', 'world_tour', 'championship'],
    isOfficial: true,
    category: 'team_challenge',
    stages: [
      {
        code: 'C31',
        name: 'Circuit 31 (En 8)',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['103a', '104a', '106a (x2)', '107a', '110a', '112a', '117a', '121a (x2)', '122a', '124a (x2)', '125a', '127a (x2)', '128a', '132a', '139b', '141b'],
      },
    ],
  },
  {
    id: 'gt-circuit-34',
    game: 'gt',
    name: 'Circuit 34 — Course-Poursuite (Team Challenge)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Double grille A/B · Tie-break Focus · ~55 min',
    mode: 'gt_race',
    requiredExtensions: ['team_challenge'],
    isOfficial: true,
    category: 'team_challenge',
    stages: [
      {
        code: 'C34',
        name: 'Circuit 34 (Poursuite)',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 1,
        tiles: ['101', '103a (x2)', '104a (x2)', '105a (x2)', '106a (x2)', '107a (x2)', '112a (x2)', '117a (x2)', '125a (x2)', '138a (x2)', '140b'],
      },
    ],
  },
  // World Tour Showcase Circuits
  {
    id: 'gt-wt-monaco',
    game: 'gt',
    name: 'Monaco (World Tour)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Circuit urbain serré · 1 tour Solo ou 2 tours Course',
    mode: 'gt_race',
    requiredExtensions: ['world_tour', 'championship'],
    isOfficial: true,
    category: 'world_tour',
    stages: [
      {
        code: 'MON',
        name: 'Circuit de Monaco',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101', '102b', '103b (x2)', '104b (x3)', '107b', '109b', '110b', '111b', '112b (x2)', '115b', '116b', '118b', '124b', '125b', '126b', '127b'],
      },
    ],
  },
  {
    id: 'gt-wt-france',
    game: 'gt',
    name: 'France (World Tour)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Asphalte rapide · Courbes larges',
    mode: 'gt_race',
    requiredExtensions: ['world_tour', 'championship'],
    isOfficial: true,
    category: 'world_tour',
    stages: [
      {
        code: 'FRA',
        name: 'Circuit de France',
        stageType: 'gt_circuit',
        hasServiceTent: true,
        laps: 2,
        tiles: ['101', '103a (x3)', '104a (x2)', '105a', '106a', '111a (x2)', '113a', '116a', '117a', '118a', '121a', '123a', '124a', '127a', '128a', '129a', '131a', '136a'],
      },
    ],
  },
  // Mode Solo Official Session Template
  {
    id: 'gt-solo-chrono',
    game: 'gt',
    name: 'Mode Solo — Contre-la-montre (1 tour)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Feuille de temps (V6..V00) · -1s par jeton Focus',
    mode: 'gt_solo',
    requiredExtensions: [],
    isOfficial: true,
    category: 'base',
    stages: [
      {
        code: 'SOLO',
        name: 'Tour Chrono Solo',
        stageType: 'gt_solo_lap',
        hasServiceTent: false,
        laps: 1,
      },
    ],
  },
];

const GT_TEMPLATE_EN_OVERRIDES: Record<
  string,
  { name: string; durationHint: string; stageNames: Record<string, string> }
> = {
  'gt-championship-official': {
    name: 'Official GT Championship (8 Races)',
    durationHint: '8 races · 2 laps / track · 25–1 pts scale',
    stageNames: {
      C1: 'Race 1 · Track 11',
      C2: 'Race 2 · Track 12',
      C3: 'Race 3 · Track 13',
      C4: 'Race 4 · Track 14',
      C5: 'Race 5 · Track 15',
      C6: 'Race 6 · Track 16',
      C7: 'Race 7 · Track 17',
      C8: 'Race 8 · Track 18',
    },
  },
  'gt-world-tour-official': {
    name: 'Full World Tour (10 Tracks)',
    durationHint: '10 international races · Championship scale',
    stageNames: {
      SUE: 'Sweden',
      MAC: 'Macau',
      MON: 'Monaco',
      ITA: 'Italy',
      ALL: 'Germany',
      FRA: 'France',
      USA: 'U.S.A.',
      GBR: 'U.K.',
      BEL: 'Belgium',
      AUS: 'Australia',
    },
  },
  'gt-circuit-1': {
    name: 'Track 1 (Core Box)',
    durationHint: '12 tiles · Pit Stops included · ~35 min',
    stageNames: { C1: 'Track 1' },
  },
  'gt-circuit-2': {
    name: 'Track 2 (Core Box)',
    durationHint: '15 tiles · Fast sweeping corners · ~40 min',
    stageNames: { C2: 'Track 2' },
  },
  'gt-circuit-3': {
    name: 'Track 3 (Core Box)',
    durationHint: '16 tiles · Tight sequences · ~45 min',
    stageNames: { C3: 'Track 3' },
  },
  'gt-circuit-4': {
    name: 'Track 4 (Core Box)',
    durationHint: '16 tiles · Long wide curves · ~45 min',
    stageNames: { C4: 'Track 4' },
  },
  'gt-circuit-5': {
    name: 'Track 5 (Core Box)',
    durationHint: '17 tiles · Technical & exits · ~50 min',
    stageNames: { C5: 'Track 5' },
  },
  'gt-circuit-6': {
    name: 'Track 6 (Core Box)',
    durationHint: '16 tiles · Oval & chicane · ~45 min',
    stageNames: { C6: 'Track 6' },
  },
  'gt-circuit-7': {
    name: 'Track 7 (Core Box)',
    durationHint: '18 tiles · Technical street layout · ~55 min',
    stageNames: { C7: 'Track 7' },
  },
  'gt-circuit-8': {
    name: 'Track 8 (Core Box)',
    durationHint: '18 tiles · High speed · ~55 min',
    stageNames: { C8: 'Track 8' },
  },
  'gt-circuit-11': {
    name: 'Track 11 (Championship)',
    durationHint: '15 tiles · 2 laps · Championship Exp.',
    stageNames: { C11: 'Track 11' },
  },
  'gt-circuit-15': {
    name: 'Track 15 (Championship)',
    durationHint: '17 tiles · 2 laps · Championship Exp.',
    stageNames: { C15: 'Track 15' },
  },
  'gt-circuit-31': {
    name: 'Track 31 — Figure "8" (Team Challenge)',
    durationHint: 'Up to 12 cars · Central Intersection · ~60 min',
    stageNames: { C31: 'Track 31 (Figure "8")' },
  },
  'gt-circuit-34': {
    name: 'Track 34 — Pursuit Mode (Team Challenge)',
    durationHint: 'Split Grid A/B · Focus tie-break · ~55 min',
    stageNames: { C34: 'Track 34 (Pursuit)' },
  },
  'gt-wt-monaco': {
    name: 'Monaco (World Tour)',
    durationHint: 'Tight street circuit · 1 lap Solo or 2 laps Race',
    stageNames: { MON: 'Monaco Track' },
  },
  'gt-wt-france': {
    name: 'France (World Tour)',
    durationHint: 'Fast asphalt · Wide sweeping corners',
    stageNames: { FRA: 'France Track' },
  },
  'gt-solo-chrono': {
    name: 'Solo Mode — Time Trial (1 lap)',
    durationHint: 'Score Sheet (Gear 6..00) · -1s per Focus token',
    stageNames: { SOLO: 'Solo Time Trial Lap' },
  },
};

export function getOfficialGtEvents(locale: Locale): RallyTemplate[] {
  if (locale === 'fr') return OFFICIAL_GT_EVENTS;
  return OFFICIAL_GT_EVENTS.map((tpl) => {
    const ov = GT_TEMPLATE_EN_OVERRIDES[tpl.id];
    if (!ov) return tpl;
    return {
      ...tpl,
      name: ov.name,
      durationHint: ov.durationHint,
      stages: tpl.stages.map((st) => ({
        ...st,
        name: ov.stageNames[st.code] || st.name,
      })),
    };
  });
}

export const INITIAL_GT_SESSIONS: RallySession[] = [
  {
    id: 'session-gt-vendredi-c1',
    game: 'gt',
    groupId: 'group-vendredi',
    rallyName: 'Circuit 1 (Boîte de base)',
    date: '2026-11-23',
    mode: 'gt_race',
    sisuRule: 'per_rally',
    status: 'active',
    stages: OFFICIAL_GT_EVENTS[2].stages,
    results: [
      {
        id: 'res-gt-1',
        stageCode: 'C1',
        playerId: 'p-1',
        rawSeconds: 0,
        secondsTokens: 0,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        directPosition: 1,
        focusTokens: 3,
        damages: { speed: 0, coast: 0, brake: 1, boost: 0 },
        spareTireAvailable: false,
        sisuUsed: false,
        serviceApplied: false,
      },
      {
        id: 'res-gt-2',
        stageCode: 'C1',
        playerId: 'p-2',
        rawSeconds: 0,
        secondsTokens: 0,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        directPosition: 2,
        focusTokens: 5,
        damages: { speed: 1, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: false,
        sisuUsed: false,
        serviceApplied: false,
      },
    ],
  },
];
