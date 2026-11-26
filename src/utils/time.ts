import { GT_CHAMPIONSHIP_POINTS } from '../data/officialGt';
import { AUTOTOUR_POSITION_SECONDS } from '../data/officialRallies';
import { Locale } from '../i18n/translations';
import {
  DamageCount,
  GameId,
  GameMode,
  PlayerProfile,
  RallySession,
  StageResult,
  StageType,
} from '../types/rally';

export function normalizeDamages(d?: Partial<DamageCount> | null): DamageCount {
  return {
    speed: d?.speed ?? 0,
    coast: d?.coast ?? 0,
    brake: d?.brake ?? 0,
    boost: d?.boost ?? 0,
  };
}

export function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatDurationForSheet(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(safe / 3600);
  const mins = Math.floor((safe % 3600) / 60);
  const secs = safe % 60;
  return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDelta(deltaSeconds: number, locale: Locale = 'fr'): string {
  if (deltaSeconds <= 0) return 'Leader';
  return `+${formatSeconds(deltaSeconds)}`;
}

export function formatModeLabel(mode: GameMode, locale: Locale = 'fr'): string {
  if (locale === 'en') {
    switch (mode) {
      case 'hillclimb':
        return 'Hillclimb';
      case 'rx':
        return 'Rallycross / Ice';
      case 'autotour':
        return 'Mixed Auto Tour';
      case 'gt_race':
        return 'GT Race';
      case 'gt_championship':
        return 'GT Championship';
      case 'gt_solo':
        return 'GT Solo Mode';
      default:
        return 'Rally';
    }
  }
  switch (mode) {
    case 'hillclimb':
      return 'Course de côte';
    case 'rx':
      return 'Rallycross / Glace';
    case 'autotour':
      return 'Auto Tour Mixte';
    case 'gt_race':
      return 'Course GT';
    case 'gt_championship':
      return 'Championnat GT';
    case 'gt_solo':
      return 'Mode Solo GT';
    default:
      return 'Rallye';
  }
}

export function formatPositionLabel(
  pos?: number,
  disqualified?: boolean,
  didAbandon?: boolean,
  locale: Locale = 'fr'
): string {
  if (disqualified) return 'DSQ';
  if (didAbandon) return locale === 'en' ? 'Ret.' : 'Ab.';
  if (!pos || pos < 1) return '—';
  if (locale === 'en') {
    const mod100 = pos % 100;
    if (mod100 >= 11 && mod100 <= 13) return `${pos}th`;
    switch (pos % 10) {
      case 1:
        return `${pos}st`;
      case 2:
        return `${pos}nd`;
      case 3:
        return `${pos}rd`;
      default:
        return `${pos}th`;
    }
  }
  return pos === 1 ? '1er' : `${pos}e`;
}

// Rallyman: DIRT Pack Copilote: T1-T4 = 4⚠, T5-T6 = 3⚠, T7+ = 2⚠
export function getDirtSoftTireDangerLimit(turn?: number): number {
  const t = turn ?? 1;
  if (t <= 4) return 4;
  if (t <= 6) return 3;
  return 2;
}

// Rallyman: GT Adrenaline Pack + FAQ Errata: T1-T3 = 4⚠, T4-T6 = 3⚠, T7+ = 2⚠
export function getGtSoftTireDangerLimit(turn?: number): number {
  const t = turn ?? 1;
  if (t <= 3) return 4;
  if (t <= 6) return 3;
  return 2;
}

export function getSoftTireDangerLimit(turn?: number, game: GameId = 'dirt'): number {
  return game === 'gt' ? getGtSoftTireDangerLimit(turn) : getDirtSoftTireDangerLimit(turn);
}

export function getChampionshipPointsForPosition(
  pos?: number,
  didAbandon?: boolean,
  disqualified?: boolean
): number {
  if (didAbandon || disqualified || !pos || pos < 1) return 0;
  return GT_CHAMPIONSHIP_POINTS[pos - 1] ?? 0;
}

export function parseTimeInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  if (/^\d+$/.test(trimmed)) {
    return parseInt(trimmed, 10);
  }
  const parts = trimmed.split(':').map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n) || n < 0)) return null;

  if (parts.length === 2) {
    const [mins, secs] = parts;
    return mins * 60 + secs;
  }
  if (parts.length === 3) {
    const [hours, mins, secs] = parts;
    return hours * 3600 + mins * 60 + secs;
  }
  return null;
}

export function computeNetStageSeconds(
  result: StageResult,
  stageResults: StageResult[],
  sessionMode: GameMode = 'rally',
  stageType: StageType = 'special'
): number {
  if (stageType === 'gt_solo_lap' || sessionMode === 'gt_solo') {
    const focusDiscount = result.focusTokens ?? result.secondsTokens ?? 0;
    return Math.max(0, result.rawSeconds - focusDiscount);
  }

  if (stageType === 'gt_circuit' || sessionMode === 'gt_race' || sessionMode === 'gt_championship') {
    return 0;
  }

  if (stageType === 'rx_race') {
    if (sessionMode === 'autotour') {
      if (result.didAbandon || result.disqualified) {
        return 60 + result.liaisonPenaltySeconds;
      }
      const posIdx = Math.max(0, Math.min(5, (result.directPosition ?? 6) - 1));
      const posSeconds = AUTOTOUR_POSITION_SECONDS[posIdx] ?? 60;
      return Math.max(0, posSeconds - result.secondsTokens + result.liaisonPenaltySeconds);
    }
    return 0;
  }

  if (result.didAbandon) {
    const finishers = stageResults.filter((r) => r.stageCode === result.stageCode && !r.didAbandon);
    if (finishers.length === 0) {
      return Math.max(60, result.rawSeconds - result.secondsTokens + result.liaisonPenaltySeconds + 60);
    }
    const slowestFinisher = Math.max(
      ...finishers.map((r) => Math.max(0, r.rawSeconds - r.secondsTokens + r.liaisonPenaltySeconds))
    );
    return slowestFinisher + 60;
  }

  return Math.max(0, result.rawSeconds - result.secondsTokens + result.liaisonPenaltySeconds);
}

export interface StageStandingEntry {
  netSeconds: number;
  points: number;
  didAbandon: boolean;
  disqualified: boolean;
  directPosition?: number;
  jokerLapDone?: boolean;
  result: StageResult;
}

export interface PlayerStanding {
  player: PlayerProfile;
  stagesCompleted: number;
  totalSeconds: number;
  totalPoints: number;
  bestAttemptCode?: string;
  bestPosition?: number;
  latestFocusTokens: number;
  isDisqualified: boolean;
  stageTimes: Record<string, StageStandingEntry>;
  latestDamages: DamageCount;
  spareTireAvailable: boolean;
  latestTireWear?: number;
  sisuUsedInRally: boolean;
  rank: number;
  deltaToLeader: number;
}

export interface TeamStanding {
  teamName: string;
  totalPoints: number;
  memberCount: number;
  rank: number;
}

export function computeTeamStandings(standings: PlayerStanding[]): TeamStanding[] {
  const map = new Map<string, { totalPoints: number; memberCount: number }>();
  for (const s of standings) {
    const team = s.player.teamName?.trim();
    if (!team) continue;
    const prev = map.get(team) || { totalPoints: 0, memberCount: 0 };
    map.set(team, {
      totalPoints: prev.totalPoints + s.totalPoints,
      memberCount: prev.memberCount + 1,
    });
  }
  const list: TeamStanding[] = Array.from(map.entries()).map(([teamName, data]) => ({
    teamName,
    totalPoints: data.totalPoints,
    memberCount: data.memberCount,
    rank: 1,
  }));
  list.sort((a, b) => b.totalPoints - a.totalPoints || a.teamName.localeCompare(b.teamName));
  return list.map((t, idx) => ({ ...t, rank: idx + 1 }));
}

export function computeRallyStandings(
  session: RallySession,
  players: PlayerProfile[]
): PlayerStanding[] {
  const mode: GameMode = session.mode || 'rally';
  const game: GameId = session.game || 'dirt';

  const standings: PlayerStanding[] = players.map((player) => {
    const playerResults = session.results.filter((r) => r.playerId === player.id);
    const stageTimes: Record<string, StageStandingEntry> = {};
    let totalSeconds = 0;
    let totalPoints = 0;
    let bestAttemptSeconds = Number.POSITIVE_INFINITY;
    let bestAttemptCode: string | undefined;
    let bestPosition: number | undefined;
    let latestFocusTokens = 0;
    let isDisqualified = false;
    let stagesCompleted = 0;

    for (const stage of session.stages) {
      const stageType: StageType = stage.stageType || 'special';
      const res = playerResults.find((r) => r.stageCode === stage.code);
      if (res) {
        const netSeconds = computeNetStageSeconds(res, session.results, mode, stageType);
        const dsq = Boolean(res.disqualified || (mode === 'rx' && res.jokerLapDone === false));
        const pts =
          mode === 'gt_championship'
            ? getChampionshipPointsForPosition(res.directPosition, res.didAbandon, dsq)
            : 0;

        stageTimes[stage.code] = {
          netSeconds,
          points: pts,
          didAbandon: res.didAbandon,
          disqualified: dsq,
          directPosition: res.directPosition,
          jokerLapDone: res.jokerLapDone,
          result: res,
        };
        stagesCompleted += 1;
        totalPoints += pts;

        if (res.focusTokens !== undefined) {
          latestFocusTokens = res.focusTokens;
        }

        if (mode === 'hillclimb' || mode === 'gt_solo') {
          if (netSeconds < bestAttemptSeconds) {
            bestAttemptSeconds = netSeconds;
            bestAttemptCode = stage.code;
          }
        } else if (mode === 'rx' || mode === 'gt_race') {
          if (dsq) isDisqualified = true;
          if (!res.didAbandon && res.directPosition && (!bestPosition || res.directPosition < bestPosition)) {
            bestPosition = res.directPosition;
          }
        } else {
          totalSeconds += netSeconds;
        }
      }
    }

    if (mode === 'hillclimb' || mode === 'gt_solo') {
      totalSeconds = Number.isFinite(bestAttemptSeconds) ? bestAttemptSeconds : 0;
    }

    // Latest car state follows stage order in session.stages
    let latestDamages: DamageCount = { speed: 0, coast: 0, brake: 0, boost: 0 };
    const usesSpare = game === 'dirt' && mode !== 'hillclimb' && mode !== 'rx';
    let spareTireAvailable = usesSpare;
    const isSoftTire =
      game === 'gt' ? player.gtTireCompound === 'soft' : player.tireCompound === 'soft';
    let latestTireWear = isSoftTire ? 1 : undefined;
    let sisuUsedInRally = false;

    for (const stage of session.stages) {
      const res = playerResults.find((r) => r.stageCode === stage.code);
      if (res) {
        if (mode === 'hillclimb' || res.serviceApplied || res.didAbandon) {
          latestDamages = { speed: 0, coast: 0, brake: 0, boost: 0 };
          spareTireAvailable = usesSpare;
          if (isSoftTire) {
            latestTireWear = 1;
          }
        } else {
          latestDamages = normalizeDamages(res.damages);
          spareTireAvailable = res.spareTireAvailable;
          if (res.tireWearTurn !== undefined) {
            latestTireWear = res.tireWearTurn;
          }
        }
        if (res.sisuUsed) {
          sisuUsedInRally = true;
        }
      }
    }

    return {
      player,
      stagesCompleted,
      totalSeconds,
      totalPoints,
      bestAttemptCode,
      bestPosition,
      latestFocusTokens,
      isDisqualified,
      stageTimes,
      latestDamages,
      spareTireAvailable,
      latestTireWear,
      sisuUsedInRally,
      rank: 1,
      deltaToLeader: 0,
    };
  });

  standings.sort((a, b) => {
    if (mode === 'gt_championship') {
      if ((b.stagesCompleted > 0 ? 1 : 0) !== (a.stagesCompleted > 0 ? 1 : 0)) {
        return (b.stagesCompleted > 0 ? 1 : 0) - (a.stagesCompleted > 0 ? 1 : 0);
      }
      if (b.totalPoints !== a.totalPoints) {
        return b.totalPoints - a.totalPoints;
      }
      return a.player.name.localeCompare(b.player.name);
    }

    if (mode === 'rx' || mode === 'gt_race') {
      if ((b.stagesCompleted > 0 ? 1 : 0) !== (a.stagesCompleted > 0 ? 1 : 0)) {
        return (b.stagesCompleted > 0 ? 1 : 0) - (a.stagesCompleted > 0 ? 1 : 0);
      }
      if (a.isDisqualified !== b.isDisqualified) {
        return a.isDisqualified ? 1 : -1;
      }
      const posA = a.bestPosition ?? 99;
      const posB = b.bestPosition ?? 99;
      if (posA !== posB) return posA - posB;
      // Team Challenge Course-Poursuite tie-break: more Focus tokens wins
      if (b.latestFocusTokens !== a.latestFocusTokens) {
        return b.latestFocusTokens - a.latestFocusTokens;
      }
      return a.player.name.localeCompare(b.player.name);
    }

    if (mode === 'hillclimb' || mode === 'gt_solo') {
      if ((b.stagesCompleted > 0 ? 1 : 0) !== (a.stagesCompleted > 0 ? 1 : 0)) {
        return (b.stagesCompleted > 0 ? 1 : 0) - (a.stagesCompleted > 0 ? 1 : 0);
      }
      if (a.totalSeconds !== b.totalSeconds) {
        return a.totalSeconds - b.totalSeconds;
      }
      return a.player.name.localeCompare(b.player.name);
    }

    if (b.stagesCompleted !== a.stagesCompleted) {
      return b.stagesCompleted - a.stagesCompleted;
    }
    if (a.totalSeconds !== b.totalSeconds) {
      return a.totalSeconds - b.totalSeconds;
    }
    return a.player.name.localeCompare(b.player.name);
  });

  const leader = standings.find((s) => s.stagesCompleted > 0 && !s.isDisqualified);
  const leaderTime = leader ? leader.totalSeconds : 0;

  return standings.map((s, idx) => ({
    ...s,
    rank: idx + 1,
    deltaToLeader:
      mode === 'rx' || mode === 'gt_race' || mode === 'gt_championship'
        ? 0
        : s.stagesCompleted > 0
          ? Math.max(0, s.totalSeconds - leaderTime)
          : 0,
  }));
}

export function formatDamagesCompact(
  d?: Partial<DamageCount> | null,
  includeBoost = false,
  locale: Locale = 'fr'
): string {
  const norm = normalizeDamages(d);
  if (locale === 'en') {
    const base = `${norm.speed}G / ${norm.coast}C / ${norm.brake}B`;
    if (includeBoost || norm.boost > 0) {
      return `${base} / ${norm.boost}Bo`;
    }
    return base;
  }
  const base = `${norm.speed}V / ${norm.coast}G / ${norm.brake}F`;
  if (includeBoost || norm.boost > 0) {
    return `${base} / ${norm.boost}B`;
  }
  return base;
}
