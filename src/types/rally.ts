export type GameId = 'dirt' | 'gt';

export type DirtExtensionId = 'r4' | 'r5' | '110' | 'climb' | 'copilot' | 'rx';
export type GtExtensionId =
  | 'gt4'
  | 'gt5'
  | 'adrenaline'
  | 'championship'
  | 'team_challenge'
  | 'world_tour';
export type ExtensionId = DirtExtensionId;

export type GameMode =
  | 'rally'
  | 'hillclimb'
  | 'rx'
  | 'autotour'
  | 'gt_race'
  | 'gt_championship'
  | 'gt_solo';

export type StageType = 'special' | 'hillclimb_try' | 'rx_race' | 'gt_circuit' | 'gt_solo_lap';

export type DirtCarClass =
  | 'R6'
  | 'R5'
  | 'R4'
  | 'Classic'
  | 'Unlimited'
  | 'RX'
  | 'ICE'
  | 'ICE_PRO';

export type GtCarClass = 'GT6' | 'GT6_BOP' | 'GT5' | 'GT5_BOP' | 'GT4';

export type CarClass = DirtCarClass;

export type DirtTireCompound = 'standard' | 'asphalt' | 'snow' | 'soft' | 'rain';
export type GtTireCompound = 'asphalt' | 'rain' | 'soft';
export type TireCompound = DirtTireCompound;

export type CarColor = 'Rouge' | 'Jaune' | 'Bleu' | 'Vert' | 'Orange' | 'Violet';

export type SisuRule = 'per_stage' | 'per_rally' | 'service_only';

export interface DamageCount {
  speed: number; // Vitesse
  coast: number; // Gaz / Leader
  brake: number; // Freins
  boost: number; // Boost (R5, Unlimited, RX, ICE PRO, GT5, GT5 BOP)
}

export interface PlayerProfile {
  id: string;
  name: string;
  color: CarColor;
  carClass: DirtCarClass;
  tireCompound?: DirtTireCompound;
  unlimitedNote?: string;
  // Rallyman: GT profile fields
  gtCarClass?: GtCarClass;
  gtTireCompound?: GtTireCompound;
  teamName?: string;
  carNumber?: 1 | 2;
}

export interface PlayerGroup {
  id: string;
  name: string;
  description: string;
  players: PlayerProfile[];
  createdAt: string;
}

export interface StageConfig {
  code: string; // e.g. 'SS1', 'TRY1', 'RX', 'C1', 'SOLO'
  name: string;
  stageType: StageType;
  hasServiceTent: boolean;
  tiles?: string[];
  laps?: number;
}

export interface RallyTemplate {
  id: string;
  game?: GameId;
  name: string;
  author: string;
  durationHint: string;
  mode: GameMode;
  requiredExtensions: (DirtExtensionId | GtExtensionId)[];
  stages: StageConfig[];
  isOfficial: boolean;
  category?: 'base' | 'championship' | 'team_challenge' | 'world_tour' | 'climb' | 'rx';
}

export interface StageResult {
  id: string;
  stageCode: string;
  playerId: string;
  rawSeconds: number; // Chrono cards sum (or Solo gear time, or Auto Tour position seconds)
  secondsTokens: number; // DIRT Secondes (-) or GT Focus tokens (-) in Solo
  liaisonPenaltySeconds: number; // DIRT Liaison (+s)
  didAbandon: boolean; // DIRT Abandon or GT 0V Eliminated
  directPosition?: number; // 1..12 for RX / Auto Tour Circuit / GT Race / GT Championship
  jokerLapDone?: boolean; // RX mandatory Joker Lap
  disqualified?: boolean;
  tireWearTurn?: number; // 1..7 for Pneus Tendres (Pack Copilote & GT Adrenaline)
  weatherWet?: boolean; // Pluie / Humide
  focusTokens?: number; // GT remaining Focus tokens (Team Challenge tie-break & Solo)
  gridGroup?: 'A' | 'B'; // GT Team Challenge Course-Poursuite grid
  damages: DamageCount;
  spareTireAvailable: boolean;
  sisuUsed: boolean;
  serviceApplied: boolean; // DIRT Assistance or GT Arrêt aux Stands
  notes?: string;
}

export interface RallySession {
  id: string;
  game?: GameId; // defaults to 'dirt' for backwards compatibility
  groupId: string;
  rallyName: string;
  date: string; // YYYY-MM-DD
  mode: GameMode;
  sisuRule: SisuRule;
  stages: StageConfig[];
  results: StageResult[];
  status: 'active' | 'completed';
}

export type AppTab = 'tracker' | 'sheets' | 'rallies' | 'guide';
