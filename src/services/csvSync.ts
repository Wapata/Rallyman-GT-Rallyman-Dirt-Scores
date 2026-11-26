import { getOfficialGtEvents, OFFICIAL_GT_EVENTS } from '../data/officialGt';
import {
  AUTOTOUR_POSITION_SECONDS,
  CAR_COLORS,
  getCarColorLabel,
  getOfficialRallies,
  OFFICIAL_RALLIES,
} from '../data/officialRallies';
import { Locale } from '../i18n/translations';
import {
  CarColor,
  DamageCount,
  DirtCarClass,
  GameId,
  GameMode,
  GtCarClass,
  GtTireCompound,
  PlayerGroup,
  PlayerProfile,
  RallySession,
  StageConfig,
  StageResult,
  TireCompound,
} from '../types/rally';
import {
  formatDamagesCompact,
  formatDurationForSheet,
  formatModeLabel,
  formatPositionLabel,
  getChampionshipPointsForPosition,
  normalizeDamages,
  parseTimeInput,
} from '../utils/time';

function formatTireCell(
  session: RallySession,
  player: PlayerProfile,
  res: StageResult,
  locale: Locale
): string {
  const game = session.game || 'dirt';
  if (game === 'gt') {
    const compound = player.gtTireCompound || 'asphalt';
    if (compound === 'soft') {
      if (locale === 'en') {
        return `Soft T${res.tireWearTurn ?? 1}${res.weatherWet ? ' (Wet)' : ''}`;
      }
      return `Tendres T${res.tireWearTurn ?? 1}${res.weatherWet ? ' (Pluie)' : ''}`;
    }
    if (compound === 'rain') {
      if (locale === 'en') {
        return res.weatherWet ? 'Rain (Wet)' : 'Rain (Dry)';
      }
      return res.weatherWet ? 'Pluie (Humide)' : 'Pluie (Sec)';
    }
    if (locale === 'en') {
      return res.weatherWet ? 'Asphalt (Wet)' : 'Asphalt (Dry)';
    }
    return res.weatherWet ? 'Asphalte (Pluie)' : 'Asphalte (Soleil)';
  }

  const compound = player.tireCompound || 'standard';
  if (compound === 'soft') {
    return locale === 'en'
      ? `Soft T${res.tireWearTurn ?? 1}`
      : `Tendres T${res.tireWearTurn ?? 1}`;
  }
  if (compound === 'asphalt') {
    return locale === 'en' ? 'Asphalt Tires' : 'Pneus Asphalte';
  }
  if (compound === 'snow') {
    return locale === 'en' ? 'Snow Tires' : 'Pneus Neige';
  }
  if (compound === 'rain') {
    if (locale === 'en') {
      return res.weatherWet ? 'Rain (Wet)' : 'Rain (Dry)';
    }
    return res.weatherWet ? 'Pluie (Humide)' : 'Pluie (Sec)';
  }
  if (locale === 'en') {
    return res.weatherWet ? 'Gravel (Wet)' : 'Gravel';
  }
  return res.weatherWet ? 'Terre (Humide)' : 'Standard';
}

function formatCarCell(session: RallySession, player: PlayerProfile, locale: Locale): string {
  const game = session.game || 'dirt';
  const carClass = game === 'gt' ? player.gtCarClass || 'GT6' : player.carClass;
  const colorText = getCarColorLabel(player.color, locale);
  const teamSuffix = game === 'gt' && player.teamName ? ` [${player.teamName}]` : '';
  return `${carClass} · ${colorText}${teamSuffix}`;
}

function formatPosResultCell(session: RallySession, res: StageResult, locale: Locale): string {
  const stage = session.stages.find((s) => s.code === res.stageCode);
  const mode = session.mode || 'rally';

  if (mode === 'gt_championship') {
    const posText = formatPositionLabel(res.directPosition, res.disqualified, res.didAbandon, locale);
    const pts = getChampionshipPointsForPosition(
      res.directPosition,
      res.didAbandon,
      res.disqualified
    );
    return `${posText} (${pts} pts)`;
  }

  if (mode === 'gt_race') {
    const posText = formatPositionLabel(res.directPosition, res.disqualified, res.didAbandon, locale);
    const focus = res.focusTokens !== undefined ? ` · ${res.focusTokens} Focus` : '';
    const grid = res.gridGroup ? ` · Gr.${res.gridGroup}` : '';
    return `${posText}${focus}${grid}`;
  }

  const isRxStage = stage?.stageType === 'rx_race' || mode === 'rx';
  if (!isRxStage && !res.directPosition && !res.disqualified) {
    return '-';
  }
  const posText = formatPositionLabel(res.directPosition, res.disqualified, res.didAbandon, locale);
  if (mode === 'rx') {
    const joker =
      res.jokerLapDone === false
        ? locale === 'en'
          ? 'Joker Missed'
          : 'Joker Manqué'
        : 'Joker OK';
    return `${posText} (${joker})`;
  }
  if (mode === 'autotour' && stage?.stageType === 'rx_race') {
    const sec = res.directPosition
      ? AUTOTOUR_POSITION_SECONDS[Math.max(0, Math.min(5, res.directPosition - 1))] ?? 60
      : 60;
    return `${posText} (+${sec}s)`;
  }
  return posText;
}

function getEffectiveRawDurationForExport(session: RallySession, res: StageResult): string {
  const stage = session.stages.find((s) => s.code === res.stageCode);
  if (session.mode === 'autotour' && stage?.stageType === 'rx_race') {
    const posIdx = Math.max(0, Math.min(5, (res.directPosition ?? 6) - 1));
    const autoSec =
      res.didAbandon || res.disqualified ? 60 : AUTOTOUR_POSITION_SECONDS[posIdx] ?? 60;
    return formatDurationForSheet(autoSec);
  }
  return formatDurationForSheet(res.rawSeconds);
}

export function buildCsvExport(
  groups: PlayerGroup[],
  sessions: RallySession[],
  locale: Locale = 'fr'
): string {
  const playerMap = new Map<string, PlayerProfile>();
  const groupMap = new Map<string, PlayerGroup>();
  for (const g of groups) {
    groupMap.set(g.id, g);
    for (const p of g.players) {
      playerMap.set(p.id, p);
    }
  }

  const headers =
    locale === 'en'
      ? [
          'Date',
          'Game',
          'Group',
          'Event',
          'Mode',
          'Stage / Race',
          'Driver',
          'Car',
          'Tires / Weather',
          'Raw Time',
          'Sec. / Focus (-)',
          'Liaison (+s)',
          'Pos. / Points / Joker',
          'Retired',
          'Damage (G/C/B/Bo)',
          'Spare Tire',
          'SISU',
          'Pit Stop / Assist.',
        ]
      : [
          'Date',
          'Jeu',
          'Groupe',
          'Événement',
          'Mode',
          'Épreuve',
          'Pilote',
          'Voiture',
          'Pneus / Météo',
          'Chrono Brut',
          'Sec. / Focus (-)',
          'Liaison (+s)',
          'Pos. / Points / Joker',
          'Abandon',
          'Dégâts (V/G/F/B)',
          'Roue Sec.',
          'SISU',
          'Stands / Assist.',
        ];

  const lines = [headers.join(';')];

  for (const session of sessions) {
    const group = groupMap.get(session.groupId);
    if (!group) continue;
    const gameLabel = (session.game || 'dirt') === 'gt' ? 'Rallyman: GT' : 'Rallyman: DIRT';

    for (const res of session.results) {
      const player = playerMap.get(res.playerId);
      if (!player) continue;
      const focusOrSec =
        session.mode === 'gt_solo'
          ? res.focusTokens ?? res.secondsTokens
          : res.secondsTokens;

      const row = [
        session.date,
        gameLabel,
        group.name,
        session.rallyName,
        formatModeLabel(session.mode || 'rally', locale),
        res.stageCode,
        player.name,
        formatCarCell(session, player, locale),
        formatTireCell(session, player, res, locale),
        getEffectiveRawDurationForExport(session, res),
        String(focusOrSec),
        String(res.liaisonPenaltySeconds),
        formatPosResultCell(session, res, locale),
        res.didAbandon ? (locale === 'en' ? 'Yes' : 'Oui') : locale === 'en' ? 'No' : 'Non',
        formatDamagesCompact(res.damages, true, locale),
        res.spareTireAvailable ? (locale === 'en' ? 'Y' : 'O') : 'N',
        res.sisuUsed
          ? locale === 'en'
            ? 'Used'
            : 'Utilisé'
          : locale === 'en'
            ? 'Available'
            : 'Dispo',
        res.serviceApplied ? (locale === 'en' ? 'Yes' : 'Oui') : locale === 'en' ? 'No' : 'Non',
      ].map((cell) => `"${cell.replace(/"/g, '""')}"`);
      lines.push(row.join(';'));
    }
  }

  return lines.join('\n');
}

function splitCsvLines(rawText: string): string[][] {
  const clean = rawText.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  const firstLine = clean.split(/\r?\n/)[0] || '';
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const delimiter =
    tabCount > semiCount && tabCount > commaCount ? '\t' : semiCount >= commaCount ? ';' : ',';

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    const next = clean[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        currentCell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        currentCell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && next === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += ch;
    }
  }

  currentRow.push(currentCell.trim());
  if (currentRow.some((c) => c !== '')) {
    rows.push(currentRow);
  }

  return rows;
}

function parseCarCell(
  val: string,
  fallbackIndex: number,
  game: GameId
): {
  carClass: DirtCarClass;
  gtCarClass: GtCarClass;
  color: CarColor;
  teamName?: string;
} {
  const upper = val.toUpperCase();
  const teamMatch = val.match(/\[([^\]]+)\]/);
  const teamName = teamMatch ? teamMatch[1].trim() : undefined;

  let carClass: DirtCarClass = 'R6';
  if (upper.includes('ICE_PRO') || upper.includes('ICE PRO')) carClass = 'ICE_PRO';
  else if (upper.includes('ICE')) carClass = 'ICE';
  else if (upper.includes('UNLIMITED')) carClass = 'Unlimited';
  else if (upper.includes('CLASSIC') || upper.includes('CLASSIQUE')) carClass = 'Classic';
  else if (upper.includes('RX')) carClass = 'RX';
  else if (upper.includes('R4')) carClass = 'R4';
  else if (upper.includes('R5')) carClass = 'R5';

  let gtCarClass: GtCarClass = 'GT6';
  if (upper.includes('GT6_BOP') || upper.includes('GT6 B.O.P')) gtCarClass = 'GT6_BOP';
  else if (upper.includes('GT5_BOP') || upper.includes('GT5 B.O.P')) gtCarClass = 'GT5_BOP';
  else if (upper.includes('GT4')) gtCarClass = 'GT4';
  else if (upper.includes('GT5')) gtCarClass = 'GT5';
  else if (game === 'gt') gtCarClass = 'GT6';

  const lower = val.toLowerCase();
  const matchedColor = CAR_COLORS.find(
    (c) => lower.includes(c.label.toLowerCase()) || lower.includes(c.enLabel.toLowerCase())
  )?.label;
  const color: CarColor = matchedColor || CAR_COLORS[fallbackIndex % CAR_COLORS.length].label;
  return { carClass, gtCarClass, color, teamName };
}

function parseTireCell(val: string | undefined): {
  tireCompound: TireCompound;
  gtTireCompound: GtTireCompound;
  tireWearTurn?: number;
  weatherWet?: boolean;
} {
  if (!val) return { tireCompound: 'standard', gtTireCompound: 'asphalt' };
  const lower = val.toLowerCase();
  const weatherWet =
    lower.includes('humide') || lower.includes('pluie') || lower.includes('wet') || lower.includes('rain');
  if (lower.includes('tendre') || lower.includes('soft')) {
    const match = lower.match(/t(\d+)/);
    return {
      tireCompound: 'soft',
      gtTireCompound: 'soft',
      tireWearTurn: match ? Math.max(1, Math.min(7, Number(match[1]))) : 1,
      weatherWet,
    };
  }
  if (lower.includes('neige') || lower.includes('snow')) {
    return { tireCompound: 'snow', gtTireCompound: 'rain', weatherWet };
  }
  if (lower.includes('pluie') || lower.includes('rain')) {
    return { tireCompound: 'rain', gtTireCompound: 'rain', weatherWet };
  }
  if (lower.includes('asphalt') || lower.includes('asphalte')) {
    return { tireCompound: 'asphalt', gtTireCompound: 'asphalt', weatherWet };
  }
  return { tireCompound: 'standard', gtTireCompound: 'asphalt', weatherWet };
}

function parseGameCell(
  gameVal: string | undefined,
  modeVal: string | undefined,
  carVal: string | undefined
): GameId {
  const combined = `${gameVal || ''} ${modeVal || ''} ${carVal || ''}`.toLowerCase();
  if (
    combined.includes('gt') ||
    combined.includes('championnat') ||
    combined.includes('championship') ||
    combined.includes('solo') ||
    combined.includes('world tour')
  ) {
    return 'gt';
  }
  return 'dirt';
}

function parseModeCell(val: string | undefined, rallyName: string, game: GameId): GameMode {
  const combined = `${val || ''} ${rallyName}`.toLowerCase();
  if (game === 'gt') {
    if (combined.includes('solo')) return 'gt_solo';
    if (combined.includes('championnat') || combined.includes('championship')) return 'gt_championship';
    return 'gt_race';
  }
  if (combined.includes('côte') || combined.includes('cote') || combined.includes('climb')) {
    return 'hillclimb';
  }
  if (combined.includes('auto tour') || combined.includes('autotour')) {
    return 'autotour';
  }
  if (
    combined.includes('rallycross') ||
    combined.includes('glace') ||
    combined.includes('ice') ||
    /\brx\b/.test(combined)
  ) {
    return 'rx';
  }
  return 'rally';
}

function parsePosResultCell(val: string | undefined): {
  directPosition?: number;
  jokerLapDone?: boolean;
  disqualified?: boolean;
  focusTokens?: number;
  gridGroup?: 'A' | 'B';
} {
  if (!val || val.trim() === '-' || val.trim() === '') return {};
  const lower = val.toLowerCase();
  const posMatch = lower.match(/^(\d+)/);
  const directPosition = posMatch ? Math.max(1, Math.min(12, Number(posMatch[1]))) : undefined;
  const disqualified =
    lower.includes('dsq') ||
    lower.includes('manqué') ||
    lower.includes('manque') ||
    lower.includes('missed');
  const jokerLapDone = lower.includes('joker ok')
    ? true
    : lower.includes('manqué') || lower.includes('manque') || lower.includes('missed')
      ? false
      : undefined;
  const focusMatch = lower.match(/(\d+)\s*focus/);
  const focusTokens = focusMatch ? Number(focusMatch[1]) : undefined;
  const gridGroup = lower.includes('gr.a') ? 'A' : lower.includes('gr.b') ? 'B' : undefined;
  return { directPosition, jokerLapDone, disqualified, focusTokens, gridGroup };
}

function parseDamagesCell(val: string): DamageCount {
  const nums = val.match(/\d+/g);
  if (!nums || nums.length === 0) return { speed: 0, coast: 0, brake: 0, boost: 0 };
  return normalizeDamages({
    speed: Math.min(6, Number(nums[0]) || 0),
    coast: Math.min(3, Number(nums[1]) || 0),
    brake: Math.min(3, Number(nums[2]) || 0),
    boost: Math.min(2, Number(nums[3]) || 0),
  });
}

function parseBooleanYes(val: string | undefined): boolean {
  if (!val) return false;
  const v = val.trim().toLowerCase();
  return (
    v === 'oui' ||
    v === 'yes' ||
    v === 'true' ||
    v === '1' ||
    v === 'utilisé' ||
    v === 'utilise' ||
    v === 'used'
  );
}

function parseRawDurationCell(val: string): number {
  const parsed = parseTimeInput(val);
  if (parsed !== null) return parsed;
  return 0;
}

export interface ImportedRallyPayload {
  groups: PlayerGroup[];
  sessions: RallySession[];
  importedRowsCount: number;
  importedSessionsCount: number;
  importedGroupsCount: number;
}

export function importRowsIntoRallyState(
  rawRows: string[][],
  existingGroups: PlayerGroup[],
  existingSessions: RallySession[],
  locale: Locale = 'fr'
): ImportedRallyPayload {
  if (rawRows.length === 0) {
    throw new Error(
      locale === 'en' ? 'No data found to import.' : 'Aucune donnée trouvée à importer.'
    );
  }

  let headerIdx = rawRows.findIndex(
    (row) =>
      row.some((cell) => /pilote|driver/i.test(cell)) &&
      row.some((cell) =>
        /groupe|group|rallye|rally|événement|evenement|event|spéciale|speciale|épreuve|epreuve|stage/i.test(
          cell
        )
      )
  );
  if (headerIdx === -1) headerIdx = 0;

  const headers = rawRows[headerIdx].map((h) => h.trim().toLowerCase());
  const findCol = (patterns: RegExp[], fallbackIdx: number) => {
    const found = headers.findIndex((h) => patterns.some((re) => re.test(h)));
    return found >= 0 ? found : fallbackIdx;
  };
  const findOptionalCol = (patterns: RegExp[]): number =>
    headers.findIndex((h) => patterns.some((re) => re.test(h)));

  const colDate = findCol([/^date$/i], 0);
  const colGame = findOptionalCol([/^jeu$|^game$/i]);
  const colGroup = findCol([/groupe|group/i], 1);
  const colRally = findCol([/événement|evenement|rallye|event|rally/i], 2);
  const colMode = findOptionalCol([/^mode$/i]);
  const colStage = findCol([/épreuve|epreuve|spéciale|speciale|stage/i], 3);
  const colPlayer = findCol([/pilote|driver/i], 4);
  const colCar = findCol([/voiture|car/i], 5);
  const colTires = findOptionalCol([/pneus|météo|meteo|usure|tires|tyres|weather/i]);
  const colRawTime = findCol([/chrono\s*brut|temps\s*brut|raw\s*time/i], 6);
  const colTokens = findCol([/jetons|sec\.|focus|tokens/i], 7);
  const colLiaison = findCol([/liaison/i], 8);
  const colPosJoker = findOptionalCol([/pos\.|points|joker/i]);
  const colAbandon = findCol([/abandon|retired|elim/i], 9);
  const colDamages = findCol([/dégâts|degats|damage/i], headers.length >= 16 ? 13 : 10);
  const colSpare = findCol([/roue|spare/i], headers.length >= 16 ? 14 : 11);
  const colSisu = findCol([/sisu/i], headers.length >= 16 ? 15 : 12);
  const colService = findCol([/stands|assist|pit/i], headers.length >= 16 ? 16 : 13);

  const nextGroups: PlayerGroup[] = existingGroups.map((g) => ({
    ...g,
    players: g.players.map((p) => ({ ...p })),
  }));
  const nextSessions: RallySession[] = existingSessions.map((s) => ({
    ...s,
    stages: s.stages.map((st) => ({ ...st })),
    results: s.results.map((r) => ({ ...r, damages: normalizeDamages(r.damages) })),
  }));

  const touchedGroupIds = new Set<string>();
  const touchedSessionIds = new Set<string>();
  let importedRowsCount = 0;

  const allTemplates = [
    ...OFFICIAL_RALLIES,
    ...getOfficialRallies('en'),
    ...OFFICIAL_GT_EVENTS,
    ...getOfficialGtEvents('en'),
  ];

  for (let i = headerIdx + 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    const playerName = (row[colPlayer] || '').trim();
    const groupName = (row[colGroup] || '').trim();
    const rallyName = (row[colRally] || '').trim();
    const stageCode = (row[colStage] || '').trim().toUpperCase();

    if (!playerName || !groupName || !rallyName || !stageCode) continue;

    const dateStr = (row[colDate] || '').trim() || new Date().toISOString().slice(0, 10);
    const detectedGame = parseGameCell(
      colGame >= 0 ? row[colGame] : undefined,
      colMode >= 0 ? row[colMode] : undefined,
      row[colCar]
    );
    const detectedMode = parseModeCell(
      colMode >= 0 ? row[colMode] : undefined,
      rallyName,
      detectedGame
    );
    const tireInfo = parseTireCell(colTires >= 0 ? row[colTires] : undefined);
    const posInfo = parsePosResultCell(colPosJoker >= 0 ? row[colPosJoker] : undefined);

    let group = nextGroups.find((g) => g.name.toLowerCase() === groupName.toLowerCase());
    if (!group) {
      group = {
        id: `group-imp-${Date.now()}-${nextGroups.length}`,
        name: groupName,
        description: locale === 'en' ? 'Imported from CSV' : 'Importé depuis CSV',
        players: [],
        createdAt: dateStr,
      };
      nextGroups.push(group);
    }
    touchedGroupIds.add(group.id);

    let player = group.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase());
    if (!player && group.players.length < 12) {
      const carInfo = parseCarCell(row[colCar] || '', group.players.length, detectedGame);
      player = {
        id: `p-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: playerName,
        carClass: carInfo.carClass,
        tireCompound: tireInfo.tireCompound,
        gtCarClass: carInfo.gtCarClass,
        gtTireCompound: tireInfo.gtTireCompound,
        color: carInfo.color,
        teamName: carInfo.teamName,
      };
      group.players.push(player);
    }
    if (!player) continue;

    let session = nextSessions.find(
      (s) =>
        s.groupId === group!.id &&
        s.rallyName.toLowerCase() === rallyName.toLowerCase() &&
        s.date === dateStr
    );
    if (!session) {
      const matchedTemplate = allTemplates.find(
        (t) => t.name.toLowerCase() === rallyName.toLowerCase()
      );
      const inferredStageType =
        detectedGame === 'gt'
          ? detectedMode === 'gt_solo'
            ? 'gt_solo_lap'
            : 'gt_circuit'
          : detectedMode === 'hillclimb'
            ? 'hillclimb_try'
            : detectedMode === 'rx' || posInfo.directPosition !== undefined
              ? 'rx_race'
              : 'special';

      const stages: StageConfig[] = matchedTemplate
        ? matchedTemplate.stages.map((st) => ({ ...st }))
        : [
            {
              code: stageCode,
              name: stageCode,
              stageType: inferredStageType,
              hasServiceTent: false,
            },
          ];

      session = {
        id: `session-imp-${Date.now()}-${nextSessions.length}`,
        game: matchedTemplate?.game || detectedGame,
        groupId: group.id,
        rallyName,
        date: dateStr,
        mode: matchedTemplate?.mode || detectedMode,
        sisuRule: 'per_rally',
        stages,
        results: [],
        status: 'active',
      };
      nextSessions.unshift(session);
    }
    touchedSessionIds.add(session.id);

    if (!session.stages.some((st) => st.code === stageCode)) {
      const sGame = session.game || detectedGame;
      const inferredType =
        sGame === 'gt'
          ? session.mode === 'gt_solo'
            ? 'gt_solo_lap'
            : 'gt_circuit'
          : session.mode === 'hillclimb'
            ? 'hillclimb_try'
            : session.mode === 'rx' || posInfo.directPosition !== undefined || stageCode.startsWith('C')
              ? 'rx_race'
              : 'special';

      session.stages.push({
        code: stageCode,
        name: stageCode,
        stageType: inferredType,
        hasServiceTent: parseBooleanYes(row[colService]),
      });
      session.stages.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
    }

    const spareRaw = (row[colSpare] || 'O').trim().toUpperCase();
    const spareTireAvailable =
      spareRaw !== 'N' && spareRaw !== 'NON' && spareRaw !== 'NO' && spareRaw !== 'FALSE';
    const tokenNum = Math.max(0, parseInt(row[colTokens] || '0', 10) || 0);

    const newResult: StageResult = {
      id: `res-imp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stageCode,
      playerId: player.id,
      rawSeconds: parseRawDurationCell(row[colRawTime] || '0:00'),
      secondsTokens: session.mode === 'gt_solo' ? 0 : tokenNum,
      focusTokens: session.mode === 'gt_solo' ? tokenNum : posInfo.focusTokens,
      gridGroup: posInfo.gridGroup,
      liaisonPenaltySeconds: Math.max(0, parseInt(row[colLiaison] || '0', 10) || 0),
      didAbandon: parseBooleanYes(row[colAbandon]),
      directPosition: posInfo.directPosition,
      jokerLapDone: posInfo.jokerLapDone,
      disqualified: posInfo.disqualified,
      tireWearTurn: tireInfo.tireWearTurn,
      weatherWet: tireInfo.weatherWet,
      damages: parseDamagesCell(row[colDamages] || '0V / 0G / 0F / 0B'),
      spareTireAvailable,
      sisuUsed: parseBooleanYes(row[colSisu]),
      serviceApplied: parseBooleanYes(row[colService]),
    };

    session.results = session.results.filter(
      (r) => !(r.stageCode === stageCode && r.playerId === player!.id)
    );
    session.results.push(newResult);
    importedRowsCount += 1;
  }

  if (importedRowsCount === 0) {
    throw new Error(
      locale === 'en'
        ? 'No valid rows detected (check Date, Group, Event/Rally, Stage/Race, and Driver columns).'
        : 'Aucune ligne valide détectée (vérifiez les colonnes Date, Groupe, Événement/Rallye, Épreuve/Spéciale, Pilote).'
    );
  }

  return {
    groups: nextGroups,
    sessions: nextSessions,
    importedRowsCount,
    importedSessionsCount: touchedSessionIds.size,
    importedGroupsCount: touchedGroupIds.size,
  };
}

export function parseCsvToRallyData(
  csvText: string,
  existingGroups: PlayerGroup[],
  existingSessions: RallySession[],
  locale: Locale = 'fr'
): ImportedRallyPayload {
  const rows = splitCsvLines(csvText);
  return importRowsIntoRallyState(rows, existingGroups, existingSessions, locale);
}
