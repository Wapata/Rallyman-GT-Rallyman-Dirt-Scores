import { Locale } from '../i18n/translations';
import {
  CarClass,
  CarColor,
  ExtensionId,
  PlayerGroup,
  RallySession,
  RallyTemplate,
} from '../types/rally';

export interface ExtensionMeta {
  id: ExtensionId;
  name: string;
  summary: string;
}

const EXTENSIONS_CATALOG_BY_LOCALE: Record<Locale, ExtensionMeta[]> = {
  fr: [
    {
      id: 'r4',
      name: 'R4',
      summary: 'Voitures R4 (Vitesse max 4, +1 dé Gaz)',
    },
    {
      id: 'r5',
      name: 'R5',
      summary: 'Voitures R5 (Vitesse max 5, dé Boost vert)',
    },
    {
      id: '110',
      name: '110%',
      summary: 'Asphalte & Neige (24 tuiles), Pneus Asphalte/Neige, jetons Météo, Rallyes 7–9',
    },
    {
      id: 'climb',
      name: 'The Climb',
      summary: 'Course de côte (3 Try, meilleur temps), catégorie Unlimited, tuiles Côte',
    },
    {
      id: 'copilot',
      name: 'Pack Copilote',
      summary: 'Pneus Tendres (usure T1–T7), Voitures Classiques 2009, Pont & jetons piste',
    },
    {
      id: 'rx',
      name: 'RX (Rallycross)',
      summary: 'Confrontation directe, Tour Joker, Auto Tour mixte, Courses sur Glace (ICE)',
    },
  ],
  en: [
    {
      id: 'r4',
      name: 'R4',
      summary: 'R4 cars (Max Gear 4, +1 Coast die)',
    },
    {
      id: 'r5',
      name: 'R5',
      summary: 'R5 cars (Max Gear 5, green Boost die)',
    },
    {
      id: '110',
      name: '110%',
      summary: 'Asphalt & Snow (24 tiles), Asphalt/Snow Tires, Weather tokens, Rallies 7–9',
    },
    {
      id: 'climb',
      name: 'The Climb',
      summary: 'Hillclimb (3 Attempts, best time), Unlimited class, Climb tiles',
    },
    {
      id: 'copilot',
      name: 'Copilot Pack',
      summary: 'Soft Tires (wear T1–T7), 2009 Classic cars, The Bridge & Track tokens',
    },
    {
      id: 'rx',
      name: 'RX (Rallycross)',
      summary: 'Head-to-Head, Joker Lap, Mixed Auto Tour, Ice Racing (ICE)',
    },
  ],
};

export const EXTENSIONS_CATALOG: ExtensionMeta[] = EXTENSIONS_CATALOG_BY_LOCALE.fr;

export function getDirtExtensionsCatalog(locale: Locale): ExtensionMeta[] {
  return EXTENSIONS_CATALOG_BY_LOCALE[locale];
}

export const CAR_COLORS: { label: CarColor; enLabel: string; hex: string; ring: string }[] = [
  { label: 'Rouge', enLabel: 'Red', hex: '#C83E2B', ring: 'ring-[#C83E2B]' },
  { label: 'Jaune', enLabel: 'Yellow', hex: '#CA8A04', ring: 'ring-[#CA8A04]' },
  { label: 'Bleu', enLabel: 'Blue', hex: '#2563EB', ring: 'ring-[#2563EB]' },
  { label: 'Vert', enLabel: 'Green', hex: '#15803D', ring: 'ring-[#15803D]' },
  { label: 'Orange', enLabel: 'Orange', hex: '#EA580C', ring: 'ring-[#EA580C]' },
  { label: 'Violet', enLabel: 'Purple', hex: '#7C3AED', ring: 'ring-[#7C3AED]' },
];

export function getCarColorLabel(color: CarColor, locale: Locale): string {
  const entry = CAR_COLORS.find((c) => c.label === color);
  if (!entry) return color;
  return locale === 'en' ? entry.enLabel : entry.label;
}

export interface CarDashboardSpec {
  code: CarClass;
  label: string;
  requiredExtension?: ExtensionId;
  maxGear: number;
  speedDice: number;
  coastDice: number;
  brakeDice: number;
  boostDice: number;
  dangerLimit: number;
  surfaceNote: string;
}

export const CAR_SPECS: Record<CarClass, CarDashboardSpec> = {
  R6: {
    code: 'R6',
    label: 'R6 (Base — 6 vitesses)',
    maxGear: 6,
    speedDice: 6,
    coastDice: 2,
    brakeDice: 1,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Terre: 6V 2G 1F (3⚠) · Asphalte/Neige: 5V 2G 0F (3⚠)',
  },
  R5: {
    code: 'R5',
    label: 'R5 (Ext. R5 — 5 vitesses + Boost)',
    requiredExtension: 'r5',
    maxGear: 5,
    speedDice: 5,
    coastDice: 2,
    brakeDice: 1,
    boostDice: 1,
    dangerLimit: 3,
    surfaceNote: 'Vitesse max 5 · 1 dé Boost vert (saute 1 vitesse en montée)',
  },
  R4: {
    code: 'R4',
    label: 'R4 (Ext. R4 — 4 vitesses + 3 Gaz)',
    requiredExtension: 'r4',
    maxGear: 4,
    speedDice: 4,
    coastDice: 3,
    brakeDice: 1,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Vitesse max 4 · +1 dé Gaz supplémentaire (3G) idéal sections techniques',
  },
  Classic: {
    code: 'Classic',
    label: 'Classique 2009 (Pack Copilote)',
    requiredExtension: 'copilot',
    maxGear: 5,
    speedDice: 5,
    coastDice: 2,
    brakeDice: 0,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Vitesse max 5 · Sans Freins (Double Rétrogradage 2x sur bonne surface)',
  },
  Unlimited: {
    code: 'Unlimited',
    label: 'Unlimited (The Climb — 17 emplacements)',
    requiredExtension: 'climb',
    maxGear: 6,
    speedDice: 6,
    coastDice: 2,
    brakeDice: 1,
    boostDice: 1,
    dangerLimit: 5,
    surfaceNote: 'Tableau personnalisable (17 emplacements · limite ⚠ variable selon vides)',
  },
  RX: {
    code: 'RX',
    label: 'RX Rallycross (Ext. RX)',
    requiredExtension: 'rx',
    maxGear: 5,
    speedDice: 5,
    coastDice: 3,
    brakeDice: 2,
    boostDice: 1,
    dangerLimit: 3,
    surfaceNote: 'Sec: 5V 3G 2F 1B (3⚠) · Pluie: 3L Leader (Asphalte) ou 1+1F (Pluie)',
  },
  ICE: {
    code: 'ICE',
    label: 'ICE Rookie (Ext. RX Glace)',
    requiredExtension: 'rx',
    maxGear: 5,
    speedDice: 5,
    coastDice: 2,
    brakeDice: 3,
    boostDice: 0,
    dangerLimit: 3,
    surfaceNote: 'Course sur Glace · Pneus Neige fixes, tolérance glisse accrue',
  },
  ICE_PRO: {
    code: 'ICE_PRO',
    label: 'ICE PRO (Ext. RX Glace)',
    requiredExtension: 'rx',
    maxGear: 5,
    speedDice: 5,
    coastDice: 3,
    brakeDice: 3,
    boostDice: 1,
    dangerLimit: 3,
    surfaceNote: 'Course sur Glace PRO · 5V 3G 3F + 1 dé Boost vert (3⚠)',
  },
};

const CAR_SPECS_EN: Record<CarClass, CarDashboardSpec> = {
  R6: {
    ...CAR_SPECS.R6,
    label: 'R6 (Core — 6 gears)',
    surfaceNote: 'Gravel: 6G 2C 1B (3⚠) · Asphalt/Snow: 5G 2C 0B + Leader (3⚠)',
  },
  R5: {
    ...CAR_SPECS.R5,
    label: 'R5 (Exp. R5 — 5 gears + Boost)',
    surfaceNote: 'Max Gear 5 · 1 green Boost die (+2 gears at once)',
  },
  R4: {
    ...CAR_SPECS.R4,
    label: 'R4 (Exp. R4 — 4 gears + 3 Coast)',
    surfaceNote: 'Max Gear 4 · +1 extra Coast die (3C), great for technical sections',
  },
  Classic: {
    ...CAR_SPECS.Classic,
    label: 'Classic 2009 (Copilot Pack)',
    surfaceNote: 'Max Gear 5 · No Brake dice (Double Downshift 2x on matching track)',
  },
  Unlimited: {
    ...CAR_SPECS.Unlimited,
    label: 'Unlimited (The Climb — 17 slots)',
    surfaceNote: 'Custom Dashboard (17 slots · variable ⚠ limit from empty slots)',
  },
  RX: {
    ...CAR_SPECS.RX,
    label: 'RX Rallycross (RX Exp.)',
    surfaceNote: 'Dry: 5G 3C 2B 1Bo (3⚠) · Wet: 3L Leader (Asphalt) or 1+1B (Rain)',
  },
  ICE: {
    ...CAR_SPECS.ICE,
    label: 'ICE Rookie (RX Ice Racing)',
    surfaceNote: 'Ice Racing · Fixed Snow tires, forgiving Loss of Control chart',
  },
  ICE_PRO: {
    ...CAR_SPECS.ICE_PRO,
    label: 'ICE PRO (RX Ice Racing)',
    surfaceNote: 'Ice Racing PRO · 5G 3C 3B + 1 green Boost die (3⚠)',
  },
};

export function getDirtCarSpecs(locale: Locale): Record<CarClass, CarDashboardSpec> {
  return locale === 'en' ? CAR_SPECS_EN : CAR_SPECS;
}

export function formatDiceSummary(
  spec: { speedDice: number; coastDice: number; brakeDice: number; boostDice: number; dangerLimit?: number },
  locale: Locale,
  includeLimit = true
): string {
  const s = locale === 'en' ? 'G' : 'V';
  const c = locale === 'en' ? 'C' : 'G';
  const b = locale === 'en' ? 'B' : 'F';
  const bo = locale === 'en' ? 'Bo' : 'B';
  const parts = [`${spec.speedDice}${s}`, `${spec.coastDice}${c}`, `${spec.brakeDice}${b}`];
  if (spec.boostDice > 0) parts.push(`${spec.boostDice}${bo}`);
  if (includeLimit && spec.dangerLimit !== undefined) parts.push(`${spec.dangerLimit}⚠`);
  return parts.join(' · ');
}

// Official Auto Tour Direct Confrontation scoring (RX rulebook p. 18 & 20)
export const AUTOTOUR_POSITION_SECONDS = [0, 20, 30, 40, 50, 60];

export interface ChronoCardMeta {
  gear: number | 'PDC' | 'SISU';
  label: string;
  seconds: number;
  hint: string;
}

export const CHRONO_CARDS: ChronoCardMeta[] = [
  { gear: 6, label: 'Vitesse 6', seconds: 10, hint: '00:10' },
  { gear: 5, label: 'Vitesse 5', seconds: 15, hint: '00:15' },
  { gear: 4, label: 'Vitesse 4', seconds: 20, hint: '00:20' },
  { gear: 3, label: 'Vitesse 3', seconds: 30, hint: '00:30' },
  { gear: 2, label: 'Vitesse 2', seconds: 40, hint: '00:40' },
  { gear: 1, label: 'Vitesse 1', seconds: 50, hint: '00:50' },
  { gear: 'PDC', label: 'Perte de contrôle', seconds: 60, hint: '01:00' },
  { gear: 'SISU', label: 'Carte SISU!', seconds: 10, hint: '00:10' },
];

const CHRONO_CARDS_EN: ChronoCardMeta[] = [
  { gear: 6, label: 'Gear 6', seconds: 10, hint: '00:10' },
  { gear: 5, label: 'Gear 5', seconds: 15, hint: '00:15' },
  { gear: 4, label: 'Gear 4', seconds: 20, hint: '00:20' },
  { gear: 3, label: 'Gear 3', seconds: 30, hint: '00:30' },
  { gear: 2, label: 'Gear 2', seconds: 40, hint: '00:40' },
  { gear: 1, label: 'Gear 1', seconds: 50, hint: '00:50' },
  { gear: 'PDC', label: 'Loss of Control', seconds: 60, hint: '01:00' },
  { gear: 'SISU', label: 'SISU! Card', seconds: 10, hint: '00:10' },
];

export function getChronoCards(locale: Locale): ChronoCardMeta[] {
  return locale === 'en' ? CHRONO_CARDS_EN : CHRONO_CARDS;
}

export const OFFICIAL_RALLIES: RallyTemplate[] = [
  {
    id: 'official-rally-1',
    name: 'Rallye 1 — Classique Terre',
    author: 'Jean-Christophe Bouvier',
    durationHint: '3 spéciales · ~75 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '205a', '208a', '210b', '213a', '216a', '217a', '219a', '227a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '205a', '208a', '210b', '213a', '216a', '217a', '219a', '227a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202b', '203a', '205a', '208a', '210a', '213a', '216a', '217a', '219a', '227a'],
      },
    ],
  },
  {
    id: 'official-rally-2',
    name: 'Rallye 2 — Technique & Gués',
    author: 'Roger BW',
    durationHint: '3 spéciales · ~90 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203b', '204a', '207a', '209a', '212b', '214b', '219b', '223b', '224a', '228a', '229a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '202a', '203b', '206a', '208a', '215b', '218a', '220a', '222b', '225a', '227b', '231a', '232b'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203b', '205a', '210a', '211b', '213b', '216a', '217b', '221b', '226b', '230b'],
      },
    ],
  },
  {
    id: 'official-rally-3',
    name: 'Rallye 3 — Endurance Longue',
    author: 'Dwayne Karenko',
    durationHint: '3 spéciales · ~110 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '208a', '209b', '211a', '214a', '216a', '217a', '218a', '221b', '223b', '224b', '225a', '227a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202b', '203b', '206a', '209a', '212b', '213b', '214a', '216b', '219a', '220a', '221b', '222a', '224b', '228a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203b', '208a', '209b', '210a', '211b', '212a', '213b', '216a', '217b', '218a', '222b', '230b', '231b'],
      },
    ],
  },
  {
    id: 'official-rally-4',
    name: 'Rallye 4 — Sprint & Cordes',
    author: 'Dwayne Karenko',
    durationHint: '3 spéciales · ~80 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203a', '204a', '208a', '209b', '214a', '224b', '227a', '231b'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202b', '203a', '206b', '209b', '210b', '213b', '218a', '220a', '224b', '226a', '227a', '231b'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203a', '206b', '208a', '213b', '214a', '218a', '220a', '226a', '229a'],
      },
    ],
  },
  {
    id: 'official-rally-5',
    name: 'Rallye 5 — Trajectoires Serrées',
    author: 'Roger BW',
    durationHint: '3 spéciales · ~75 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '204a', '205a', '207b', '208b', '210a', '217a', '218a', '219a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '204b', '205b', '207a', '208a', '210a', '217a', '218a', '219a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203a', '204a', '205a', '207a', '208a', '210a', '217b', '218b', '219a'],
      },
    ],
  },
  {
    id: 'official-rally-6',
    name: 'Rallye 6 — Spéciale Mixte',
    author: 'Aaron Steward',
    durationHint: '3 spéciales · ~90 min',
    mode: 'rally',
    requiredExtensions: [],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202b', '203a', '204a', '208b', '218a', '219a', '220a', '222a', '223a', '226a', '229a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '202a', '203a', '205b', '209b', '210a', '211b', '214b', '221b', '225a', '227a', '231b', '232b'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202a', '203b', '206b', '207b', '208a', '212b', '215a', '217b', '219b', '220b', '222a', '229b'],
      },
    ],
  },
  // 110% Expansion (p. 6-8)
  {
    id: 'official-rally-7',
    name: 'Rallye 7 — Asphalte (110%)',
    author: 'Dwayne Karenko',
    durationHint: '3 spéciales · ~85 min',
    mode: 'rally',
    requiredExtensions: ['110'],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '301a', '302a', '308a', '310a', '312a', '313a', '315a', '320a', '322a', '323a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '301a', '302a', '306a', '315a', '316a', '317a', '319a', '320a', '321a', '324a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['301a', '302a', '309a', '310a', '311a', '313a', '317a', '318a', '319a', '320a'],
      },
    ],
  },
  {
    id: 'official-rally-8',
    name: 'Rallye 8 — Hommage à Fabio (110%)',
    author: 'Dwayne Karenko, Roger BW & Aaron Steward',
    durationHint: '3 spéciales · Surfaces mixtes · ~90 min',
    mode: 'rally',
    requiredExtensions: ['110'],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '301b', '302a', '306a', '307b', '308b', '313a', '314a', '315b', '318b', '323a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '203b', '211a', '212a', '218b', '219a', '301a', '307a', '308a', '316a', '317a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202b', '208b', '209a', '212a', '214b', '229a', '302b', '306b', '315b', '318b', '321b'],
      },
    ],
  },
  {
    id: 'official-rally-9',
    name: 'Rallye 9 — Terres & Neige (110%)',
    author: 'Aaron Steward',
    durationHint: '3 spéciales · ~100 min',
    mode: 'rally',
    requiredExtensions: ['110'],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Spéciale 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201b', '204b', '215b', '219b', '225b', '226a', '301a', '302a', '315a', '316a', '318a', '319a', '320a', '323a'],
      },
      {
        code: 'SS2',
        name: 'Spéciale 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['201a', '205b', '213b', '218b', '220a', '226b', '231b', '232b', '301a', '302b', '306b', '318b', '320b', '323a'],
      },
      {
        code: 'SS3',
        name: 'Spéciale 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['301b', '302a', '306a', '308b', '309a', '314b', '317a', '318a', '319b', '320a', '324b'],
      },
    ],
  },
  // The Climb (p. 12)
  {
    id: 'official-climb-1',
    name: 'Côte 1 — Montée Terre (The Climb)',
    author: 'Roger BW',
    durationHint: '3 tentatives (meilleur temps) · ~60 min',
    mode: 'hillclimb',
    requiredExtensions: ['climb'],
    isOfficial: true,
    stages: [
      {
        code: 'TRY1',
        name: 'Essai 1',
        stageType: 'hillclimb_try',
        hasServiceTent: true,
        tiles: ['202a', '203a', '209a', '213a', '214a', '215a', '217a', '218a', '418b', '419b'],
      },
      {
        code: 'TRY2',
        name: 'Essai 2',
        stageType: 'hillclimb_try',
        hasServiceTent: true,
        tiles: ['202a', '203a', '209a', '213a', '214a', '215a', '217a', '218a', '418b', '419b'],
      },
      {
        code: 'TRY3',
        name: 'Essai 3',
        stageType: 'hillclimb_try',
        hasServiceTent: false,
        tiles: ['202a', '203a', '209a', '213a', '214a', '215a', '217a', '218a', '418b', '419b'],
      },
    ],
  },
  {
    id: 'official-climb-2',
    name: 'Côte 2 — Asphalte & Neige (The Climb)',
    author: 'Frédéric Rodriguez',
    durationHint: '3 tentatives (meilleur temps) · ~70 min',
    mode: 'hillclimb',
    requiredExtensions: ['climb'],
    isOfficial: true,
    stages: [
      {
        code: 'TRY1',
        name: 'Essai 1',
        stageType: 'hillclimb_try',
        hasServiceTent: true,
        tiles: ['301a', '302a', '305a', '310a', '312a (x2)', '313a', '318a', '319a', '320a', '325a', '326a', '419a'],
      },
      {
        code: 'TRY2',
        name: 'Essai 2',
        stageType: 'hillclimb_try',
        hasServiceTent: true,
        tiles: ['301a', '302a', '305a', '310a', '312a (x2)', '313a', '318a', '319a', '320a', '325a', '326a', '419a'],
      },
      {
        code: 'TRY3',
        name: 'Essai 3',
        stageType: 'hillclimb_try',
        hasServiceTent: false,
        tiles: ['301a', '302a', '305a', '310a', '312a (x2)', '313a', '318a', '319a', '320a', '325a', '326a', '419a'],
      },
    ],
  },
  // RX (p. 21-28)
  {
    id: 'official-rx-1',
    name: 'RX 1 — Rallycross Mixte',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Confrontation 2–3 tours · Tour Joker · ~45 min',
    mode: 'rx',
    requiredExtensions: ['rx'],
    isOfficial: true,
    stages: [
      {
        code: 'RX1',
        name: 'Finale RX 1',
        stageType: 'rx_race',
        hasServiceTent: false,
        laps: 2,
        tiles: ['204a', '205b', '208a', '209b', '210a', '218a', '401b', '404a', '408a', '410a', '411a', '415a'],
      },
    ],
  },
  {
    id: 'official-rx-2',
    name: 'RX 2 — Rallycross 110%',
    author: 'Dwayne Karenko',
    durationHint: 'Confrontation 2–3 tours · Tour Joker · ~50 min',
    mode: 'rx',
    requiredExtensions: ['rx', '110'],
    isOfficial: true,
    stages: [
      {
        code: 'RX2',
        name: 'Finale RX 2',
        stageType: 'rx_race',
        hasServiceTent: false,
        laps: 2,
        tiles: ['207a', '208b', '209a', '216b', '226b', '229b', '307a', '315a', '316a', '401a', '404b', '405a', '408a', '411a'],
      },
    ],
  },
  {
    id: 'official-autotour-1',
    name: 'Auto Tour 1 — Mixte SS & Circuits',
    author: 'Jean-Christophe Bouvier',
    durationHint: '5 épreuves (3 SS + 2 Circuits) · ~120 min',
    mode: 'autotour',
    requiredExtensions: ['rx'],
    isOfficial: true,
    stages: [
      {
        code: 'SS1',
        name: 'Auto Tour SS 1',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['115b', '201b', '301a', '302a', '309a', '313a', '315a', '324a', '412a'],
      },
      {
        code: 'C1',
        name: 'Auto Tour Circuit 1',
        stageType: 'rx_race',
        hasServiceTent: true,
        tiles: ['101a', '104b', '106a', '106b', '109a', '111a', '112a', '119a', '120b', '136a', '313a', '401b', '411a'],
      },
      {
        code: 'SS2',
        name: 'Auto Tour SS 2',
        stageType: 'special',
        hasServiceTent: true,
        tiles: ['111b', '112b', '201b', '301a', '302a', '313b', '314b', '316a', '324a'],
      },
      {
        code: 'C2',
        name: 'Auto Tour Circuit 2',
        stageType: 'rx_race',
        hasServiceTent: true,
        tiles: ['101a', '102b', '105b', '106b', '114b', '116b (x2)', '305a', '308a', '313a', '320a'],
      },
      {
        code: 'SS3',
        name: 'Auto Tour SS 3',
        stageType: 'special',
        hasServiceTent: false,
        tiles: ['202b', '203b', '212b', '215b', '410b', '414b'],
      },
    ],
  },
  {
    id: 'official-ice-1',
    name: 'Circuit de Glace 1 (ICE)',
    author: 'Jean-Christophe Bouvier',
    durationHint: 'Course sur Glace · Confrontation directe · ~40 min',
    mode: 'rx',
    requiredExtensions: ['rx', '110'],
    isOfficial: true,
    stages: [
      {
        code: 'ICE1',
        name: 'Circuit de Glace 1',
        stageType: 'rx_race',
        hasServiceTent: false,
        laps: 2,
        tiles: ['301b', '304b', '307b', '308b', '309b', '310b', '312b', '316b', '318b', '322b', '323b', '324b'],
      },
    ],
  },
];

const DIRT_TEMPLATE_EN_OVERRIDES: Record<
  string,
  { name: string; durationHint: string; stageNames: Record<string, string> }
> = {
  'official-rally-1': {
    name: 'Rally 1 — Gravel Classic',
    durationHint: '3 stages · ~75 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-2': {
    name: 'Rally 2 — Technical & Water Hazards',
    durationHint: '3 stages · ~90 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-3': {
    name: 'Rally 3 — Long Endurance',
    durationHint: '3 stages · ~110 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-4': {
    name: 'Rally 4 — Sprint & Shortcuts',
    durationHint: '3 stages · ~80 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-5': {
    name: 'Rally 5 — Tight Corners',
    durationHint: '3 stages · ~75 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-6': {
    name: 'Rally 6 — Mixed Stages',
    durationHint: '3 stages · ~90 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-7': {
    name: 'Rally 7 — Asphalt (110%)',
    durationHint: '3 stages · ~85 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-8': {
    name: 'Rally 8 — Tribute to Fabio (110%)',
    durationHint: '3 stages · Mixed surfaces · ~90 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-rally-9': {
    name: 'Rally 9 — Mixed Terrain (110%)',
    durationHint: '3 stages · ~100 min',
    stageNames: { SS1: 'Stage 1', SS2: 'Stage 2', SS3: 'Stage 3' },
  },
  'official-climb-1': {
    name: 'Climb 1 — Gravel Ascent (The Climb)',
    durationHint: '3 attempts (best time) · ~60 min',
    stageNames: { TRY1: 'Attempt 1', TRY2: 'Attempt 2', TRY3: 'Attempt 3' },
  },
  'official-climb-2': {
    name: 'Climb 2 — Asphalt & Snow (The Climb)',
    durationHint: '3 attempts (best time) · ~70 min',
    stageNames: { TRY1: 'Attempt 1', TRY2: 'Attempt 2', TRY3: 'Attempt 3' },
  },
  'official-rx-1': {
    name: 'RX 1 — Mixed Rallycross',
    durationHint: 'Head-to-Head 2–3 laps · Joker Lap · ~45 min',
    stageNames: { RX1: 'RX 1 Final' },
  },
  'official-rx-2': {
    name: 'RX 2 — Rallycross 110%',
    durationHint: 'Head-to-Head 2–3 laps · Joker Lap · ~50 min',
    stageNames: { RX2: 'RX 2 Final' },
  },
  'official-autotour-1': {
    name: 'Auto Tour 1 — Mixed SS & Tracks',
    durationHint: '5 events (3 Stages + 2 Tracks) · ~120 min',
    stageNames: {
      SS1: 'Auto Tour SS 1',
      C1: 'Auto Tour Track 1',
      SS2: 'Auto Tour SS 2',
      C2: 'Auto Tour Track 2',
      SS3: 'Auto Tour SS 3',
    },
  },
  'official-ice-1': {
    name: 'Ice Track 1 (ICE)',
    durationHint: 'Ice Racing · Head-to-Head · ~40 min',
    stageNames: { ICE1: 'Ice Track 1' },
  },
};

export function getOfficialRallies(locale: Locale): RallyTemplate[] {
  if (locale === 'fr') return OFFICIAL_RALLIES;
  return OFFICIAL_RALLIES.map((tpl) => {
    const ov = DIRT_TEMPLATE_EN_OVERRIDES[tpl.id];
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

export const INITIAL_GROUPS: PlayerGroup[] = [
  {
    id: 'group-vendredi',
    name: 'Groupe Vendredi Soir',
    description: 'Table habituelle de 4 pilotes — règles avancées avec Départ Canon & Zone Rouge',
    createdAt: '2026-11-20',
    players: [
      { id: 'p-1', name: 'Kayla', color: 'Rouge', carClass: 'R6', tireCompound: 'standard' },
      { id: 'p-2', name: 'Quentin', color: 'Bleu', carClass: 'R6', tireCompound: 'standard' },
      { id: 'p-3', name: 'Joëlle', color: 'Vert', carClass: 'R6', tireCompound: 'standard' },
      { id: 'p-4', name: 'Olivier', color: 'Jaune', carClass: 'R6', tireCompound: 'standard' },
    ],
  },
  {
    id: 'group-famille',
    name: 'Famille & Dimanche',
    description: 'Parties en 2 ou 3 spéciales courtes avec jeton SISU par spéciale',
    createdAt: '2026-11-22',
    players: [
      { id: 'p-5', name: 'Raphaël', color: 'Orange', carClass: 'R6', tireCompound: 'standard' },
      { id: 'p-6', name: 'Georgina', color: 'Violet', carClass: 'R6', tireCompound: 'standard' },
      { id: 'p-7', name: 'Andrew', color: 'Rouge', carClass: 'R6', tireCompound: 'standard' },
    ],
  },
];

export const INITIAL_SESSIONS: RallySession[] = [
  {
    id: 'session-vendredi-r1',
    groupId: 'group-vendredi',
    rallyName: 'Rallye 1 — Classique Terre',
    date: '2026-11-20',
    mode: 'rally',
    sisuRule: 'per_rally',
    status: 'active',
    stages: OFFICIAL_RALLIES[0].stages,
    results: [
      {
        id: 'res-1',
        stageCode: 'SS1',
        playerId: 'p-1',
        rawSeconds: 180,
        secondsTokens: 5,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 1, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: false,
      },
      {
        id: 'res-2',
        stageCode: 'SS1',
        playerId: 'p-2',
        rawSeconds: 195,
        secondsTokens: 3,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 1, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: false,
      },
      {
        id: 'res-3',
        stageCode: 'SS1',
        playerId: 'p-3',
        rawSeconds: 205,
        secondsTokens: 6,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 0, brake: 1, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: true,
        serviceApplied: false,
      },
      {
        id: 'res-4',
        stageCode: 'SS1',
        playerId: 'p-4',
        rawSeconds: 220,
        secondsTokens: 2,
        liaisonPenaltySeconds: 5,
        didAbandon: false,
        damages: { speed: 0, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: false,
      },
      {
        id: 'res-5',
        stageCode: 'SS2',
        playerId: 'p-1',
        rawSeconds: 278,
        secondsTokens: 6,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: true,
      },
      {
        id: 'res-6',
        stageCode: 'SS2',
        playerId: 'p-2',
        rawSeconds: 265,
        secondsTokens: 4,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: true,
      },
    ],
  },
  {
    id: 'session-famille-r5',
    groupId: 'group-famille',
    rallyName: 'Rallye 5 — Trajectoires Serrées',
    date: '2026-11-22',
    mode: 'rally',
    sisuRule: 'per_stage',
    status: 'active',
    stages: OFFICIAL_RALLIES[4].stages,
    results: [
      {
        id: 'res-7',
        stageCode: 'SS1',
        playerId: 'p-5',
        rawSeconds: 185,
        secondsTokens: 4,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 0, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: true,
      },
      {
        id: 'res-8',
        stageCode: 'SS1',
        playerId: 'p-6',
        rawSeconds: 192,
        secondsTokens: 3,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 0, coast: 1, brake: 0, boost: 0 },
        spareTireAvailable: true,
        sisuUsed: false,
        serviceApplied: false,
      },
      {
        id: 'res-9',
        stageCode: 'SS1',
        playerId: 'p-7',
        rawSeconds: 210,
        secondsTokens: 5,
        liaisonPenaltySeconds: 0,
        didAbandon: false,
        damages: { speed: 1, coast: 0, brake: 1, boost: 0 },
        spareTireAvailable: false,
        sisuUsed: true,
        serviceApplied: false,
      },
    ],
  },
];
