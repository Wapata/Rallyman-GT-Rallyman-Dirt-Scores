import { useMemo, useState } from 'react';
import {
  ChevronRight,
  Download,
  Flag,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  Users,
  Wrench,
} from 'lucide-react';
import { getGtCarSpecs } from '../data/officialGt';
import {
  CAR_COLORS,
  formatDiceSummary,
  getCarColorLabel,
  getDirtCarSpecs,
} from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import {
  DamageCount,
  DirtExtensionId,
  GameId,
  GameMode,
  GtExtensionId,
  PlayerGroup,
  PlayerProfile,
  RallySession,
  StageConfig,
  StageResult,
} from '../types/rally';
import {
  computeRallyStandings,
  computeTeamStandings,
  formatDamagesCompact,
  formatDelta,
  formatModeLabel,
  formatPositionLabel,
  formatSeconds,
  getSoftTireDangerLimit,
  normalizeDamages,
} from '../utils/time';
import { ConfirmModal } from './ConfirmModal';
import { GameExtensionsBar } from './GameExtensionsBar';
import { StageEntrySheet } from './StageEntrySheet';

interface TrackerViewProps {
  activeGame: GameId;
  groups: PlayerGroup[];
  sessions: RallySession[];
  activeGroupId: string;
  activeSessionId: string;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  onSelectGame: (game: GameId) => void;
  onToggleDirtExtension: (id: DirtExtensionId) => void;
  onToggleGtExtension: (id: GtExtensionId) => void;
  onSelectGroup: (groupId: string) => void;
  onSelectSession: (sessionId: string) => void;
  onOpenNewGroup: () => void;
  onEditGroup: (group: PlayerGroup) => void;
  onOpenNewRally: () => void;
  onSaveStageResult: (sessionId: string, result: StageResult) => void;
  onDeleteStageResult: (sessionId: string, resultId: string) => void;
  onApplyServiceTent: (sessionId: string, stageCode: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onGoToCsv: () => void;
}

export function TrackerView({
  activeGame,
  groups,
  sessions,
  activeGroupId,
  activeSessionId,
  dirtExtensions,
  gtExtensions,
  onSelectGame,
  onToggleDirtExtension,
  onToggleGtExtension,
  onSelectGroup,
  onSelectSession,
  onOpenNewGroup,
  onEditGroup,
  onOpenNewRally,
  onSaveStageResult,
  onDeleteStageResult,
  onApplyServiceTent,
  onDeleteSession,
  onGoToCsv,
}: TrackerViewProps) {
  const { locale, t } = useLocale();
  const activeGroup = useMemo(
    () => groups.find((g) => g.id === activeGroupId) || groups[0] || null,
    [groups, activeGroupId]
  );

  const groupSessions = useMemo(
    () =>
      sessions.filter(
        (s) => s.groupId === activeGroup?.id && (s.game || 'dirt') === activeGame
      ),
    [sessions, activeGroup, activeGame]
  );

  const activeSession = useMemo(
    () => groupSessions.find((s) => s.id === activeSessionId) || groupSessions[0] || null,
    [groupSessions, activeSessionId]
  );

  const [selectedStageCode, setSelectedStageCode] = useState<string>('SS1');
  const [editingTarget, setEditingTarget] = useState<{
    player: PlayerProfile;
    stage: StageConfig;
  } | null>(null);
  const [confirmDeleteSession, setConfirmDeleteSession] = useState(false);

  const sessionMode: GameMode =
    activeSession?.mode || (activeGame === 'gt' ? 'gt_race' : 'rally');
  const isGtSession = activeGame === 'gt' || sessionMode.startsWith('gt_');

  const dirtSpecs = getDirtCarSpecs(locale);
  const gtSpecs = getGtCarSpecs(locale);

  const currentStage = useMemo(() => {
    if (!activeSession) return null;
    return (
      activeSession.stages.find((s) => s.code === selectedStageCode) ||
      activeSession.stages[0] ||
      null
    );
  }, [activeSession, selectedStageCode]);

  const standings = useMemo(() => {
    if (!activeSession || !activeGroup) return [];
    return computeRallyStandings(activeSession, activeGroup.players);
  }, [activeSession, activeGroup]);

  const teamStandings = useMemo(() => {
    if (sessionMode !== 'gt_championship') return [];
    return computeTeamStandings(standings);
  }, [sessionMode, standings]);

  const getInheritedStateForStage = (
    playerId: string,
    stageCode: string
  ): {
    damages: DamageCount;
    spareTire: boolean;
    tireWear?: number;
  } => {
    const emptyDamages: DamageCount = { speed: 0, coast: 0, brake: 0, boost: 0 };
    if (!activeSession) return { damages: emptyDamages, spareTire: true };

    const playerObj = activeGroup?.players.find((p) => p.id === playerId);
    const isSoftTire = isGtSession
      ? playerObj?.gtTireCompound === 'soft'
      : playerObj?.tireCompound === 'soft';

    if (isGtSession || sessionMode === 'hillclimb') {
      return {
        damages: emptyDamages,
        spareTire: false,
        tireWear: isSoftTire ? 1 : undefined,
      };
    }

    const idx = activeSession.stages.findIndex((s) => s.code === stageCode);
    let damages: DamageCount = emptyDamages;
    let spareTire = sessionMode !== 'rx';
    let tireWear = isSoftTire ? 1 : undefined;

    for (let i = 0; i < idx; i++) {
      const prevStage = activeSession.stages[i];
      const res = activeSession.results.find(
        (r) => r.stageCode === prevStage.code && r.playerId === playerId
      );
      if (res) {
        if (res.serviceApplied || res.didAbandon) {
          damages = emptyDamages;
          spareTire = sessionMode !== 'rx';
          if (isSoftTire) tireWear = 1;
        } else {
          damages = normalizeDamages(res.damages);
          spareTire = res.spareTireAvailable;
          if (res.tireWearTurn !== undefined) {
            tireWear = res.tireWearTurn;
          }
        }
      }
    }
    return { damages, spareTire, tireWear };
  };

  const getColorHex = (colorLabel: string) =>
    CAR_COLORS.find((c) => c.label === colorLabel)?.hex || '#64748B';

  const stageEntryCount = useMemo(() => {
    if (!activeSession || !currentStage) return 0;
    return activeSession.results.filter((r) => r.stageCode === currentStage.code).length;
  }, [activeSession, currentStage]);

  const showSpareColumn = !isGtSession && sessionMode !== 'hillclimb' && sessionMode !== 'rx';
  const showDeltaColumn =
    sessionMode !== 'rx' && sessionMode !== 'gt_race' && sessionMode !== 'gt_championship';

  const retShort = locale === 'en' ? 'Ret.' : 'Ab.';
  const yesChar = locale === 'en' ? 'Y' : 'O';

  const formatStageCellText = (
    stage: StageConfig,
    stageData: (typeof standings)[number]['stageTimes'][string] | undefined
  ) => {
    if (!stageData) return t.tracker.cellEnter;
    if (sessionMode === 'gt_championship') {
      if (stageData.didAbandon) return t.tracker.cellRetired;
      const posLabel = formatPositionLabel(
        stageData.directPosition,
        stageData.disqualified,
        false,
        locale
      );
      return `${posLabel} (+${stageData.points})`;
    }
    if (sessionMode === 'gt_race') {
      const posLabel = formatPositionLabel(
        stageData.directPosition,
        stageData.disqualified,
        stageData.didAbandon,
        locale
      );
      const focusPart =
        stageData.result.focusTokens !== undefined && stageData.result.focusTokens > 0
          ? ` · ${stageData.result.focusTokens}F`
          : '';
      return `${posLabel}${focusPart}`;
    }
    if (sessionMode === 'gt_solo') {
      const base = formatSeconds(stageData.netSeconds);
      return `${base}${stageData.didAbandon ? ` (${retShort})` : ''}`;
    }
    if (stage.stageType === 'rx_race') {
      if (sessionMode === 'autotour') {
        return `${formatPositionLabel(
          stageData.directPosition,
          stageData.disqualified,
          stageData.didAbandon,
          locale
        )} (+${formatSeconds(stageData.netSeconds)})`;
      }
      return `${formatPositionLabel(
        stageData.directPosition,
        stageData.disqualified,
        stageData.didAbandon,
        locale
      )}${stageData.jokerLapDone === false ? t.tracker.cellNoJoker : ''}`;
    }
    return `${formatSeconds(stageData.netSeconds)}${stageData.didAbandon ? ` (${retShort})` : ''}`;
  };

  const activeGameShort = activeGame === 'gt' ? 'GT' : 'DIRT';
  const activeGameName = activeGame === 'gt' ? 'Rallyman: GT' : 'Rallyman: DIRT';

  return (
    <div className="space-y-5">
      {/* Game Switcher (Rallyman: DIRT / Rallyman: GT) & Extensions Selector */}
      <GameExtensionsBar
        activeGame={activeGame}
        dirtExtensions={dirtExtensions}
        gtExtensions={gtExtensions}
        onSelectGame={onSelectGame}
        onToggleDirtExtension={onToggleDirtExtension}
        onToggleGtExtension={onToggleGtExtension}
      />

      {/* Group & Event Workspace Bar */}
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
            <div>
              <label
                htmlFor="group-select"
                className="block text-xs font-semibold text-slate-500 mb-1"
              >
                {t.tracker.groupLabel}
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  id="group-select"
                  value={activeGroup?.id || ''}
                  onChange={(e) => onSelectGroup(e.target.value)}
                  className="flex-1 min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({t.common.driversCount(g.players.length)})
                    </option>
                  ))}
                </select>
                {activeGroup && (
                  <button
                    type="button"
                    onClick={() => onEditGroup(activeGroup)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    title={t.tracker.editGroupTitle}
                    aria-label={t.tracker.editGroupTitle}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="session-select"
                className="block text-xs font-semibold text-slate-500 mb-1"
              >
                {t.tracker.eventLabel(activeGameShort)}
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  id="session-select"
                  value={activeSession?.id || ''}
                  onChange={(e) => {
                    const nextId = e.target.value;
                    onSelectSession(nextId);
                    const nextSession = groupSessions.find((s) => s.id === nextId);
                    if (nextSession?.stages[0]) {
                      setSelectedStageCode(nextSession.stages[0].code);
                    }
                  }}
                  disabled={groupSessions.length === 0}
                  className="flex-1 min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C83E2B] disabled:bg-slate-100"
                >
                  {groupSessions.length === 0 ? (
                    <option value="">{t.tracker.noEventOption(activeGameShort)}</option>
                  ) : (
                    groupSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.rallyName} · {s.date}
                      </option>
                    ))
                  )}
                </select>
                {activeSession && (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteSession(true)}
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 text-slate-500 hover:bg-red-50 hover:text-[#C83E2B]"
                    title={t.tracker.deleteEventTitle}
                    aria-label={t.tracker.deleteEventTitle}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onOpenNewGroup}
              className="min-h-[44px] px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Users className="w-4 h-4" />
              <span>{t.tracker.newGroup}</span>
            </button>
            <button
              type="button"
              onClick={onOpenNewRally}
              className="min-h-[44px] px-4 py-2 text-sm font-semibold text-white bg-[#C83E2B] hover:bg-[#B03423] rounded-lg flex items-center gap-1.5 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>{t.tracker.newEvent}</span>
            </button>
          </div>
        </div>

        {/* Clean Unboxed Metadata Strip */}
        {activeGroup && activeSession && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-slate-800">
                {formatModeLabel(sessionMode, locale)}
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{activeGroup.name}</span>
              <span aria-hidden="true">·</span>
              <span>
                {activeSession.stages.length}{' '}
                {sessionMode === 'hillclimb'
                  ? t.tracker.unitAttempts
                  : sessionMode === 'rx'
                    ? t.tracker.unitHeats
                    : sessionMode === 'gt_championship'
                      ? t.tracker.unitRaces
                      : sessionMode === 'gt_solo'
                        ? t.tracker.unitSoloLap
                        : isGtSession
                          ? t.tracker.unitRaces
                          : t.tracker.unitStages}
              </span>
              {(!isGtSession || gtExtensions.includes('adrenaline')) && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {t.tracker.sisuPrefix}{' '}
                    {activeSession.sisuRule === 'per_rally'
                      ? t.tracker.sisuPerEvent
                      : activeSession.sisuRule === 'per_stage'
                        ? t.tracker.sisuPerStage
                        : isGtSession
                          ? t.tracker.sisuPitStop
                          : t.tracker.sisuAssistance}
                  </span>
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onGoToCsv}
              className="text-xs font-semibold text-slate-700 hover:text-[#C83E2B] flex items-center gap-1.5 whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.tracker.exportImportCsv}</span>
            </button>
          </div>
        )}
      </section>

      {/* Empty State if no Session */}
      {!activeSession || !activeGroup ? (
        <section className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
          <Flag className="w-8 h-8 text-slate-400 mx-auto" />
          <h2 className="font-display text-2xl font-bold text-slate-900">
            {t.tracker.emptyTitle(activeGameName)}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {activeGame === 'gt' ? t.tracker.emptyDescGt : t.tracker.emptyDescDirt}
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={onOpenNewRally}
              className="min-h-[44px] px-5 py-2.5 text-sm font-semibold text-white bg-[#C83E2B] hover:bg-[#B03423] rounded-lg"
            >
              {t.tracker.startEvent}
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Stage Selector + Service Tent Bar */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-lg overflow-x-auto">
              {activeSession.stages.map((st) => {
                const isActive = currentStage?.code === st.code;
                const count = activeSession.results.filter((r) => r.stageCode === st.code).length;
                return (
                  <button
                    key={st.code}
                    type="button"
                    onClick={() => setSelectedStageCode(st.code)}
                    className={`min-h-[40px] px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {st.code}
                    {st.stageType === 'rx_race' && sessionMode === 'autotour'
                      ? t.tracker.circuitSuffix
                      : ''}{' '}
                    ({count}/{activeGroup.players.length})
                  </button>
                );
              })}
            </div>

            {currentStage && (
              <div className="flex items-center justify-between sm:justify-end gap-3 text-xs">
                <span className="text-slate-600">
                  {sessionMode === 'gt_championship'
                    ? t.tracker.hintChampionship
                    : sessionMode === 'gt_solo'
                      ? t.tracker.hintSolo
                      : isGtSession
                        ? t.tracker.hintGtCircuit
                        : sessionMode === 'hillclimb'
                          ? t.tracker.hintHillclimb
                          : currentStage.stageType === 'rx_race' && sessionMode === 'rx'
                            ? t.tracker.hintRx
                            : currentStage.hasServiceTent
                              ? t.tracker.hintServiceTent
                              : t.tracker.hintNoService}
                </span>
                {!isGtSession &&
                  stageEntryCount > 0 &&
                  sessionMode !== 'hillclimb' &&
                  sessionMode !== 'rx' && (
                    <button
                      type="button"
                      onClick={() => onApplyServiceTent(activeSession.id, currentStage.code)}
                      className="min-h-[40px] px-3 py-1.5 font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-lg flex items-center gap-1.5 whitespace-nowrap"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{t.tracker.applyAssistance}</span>
                    </button>
                  )}
              </div>
            )}
          </section>

          {/* Desktop & Tablet Standings Table (md+) */}
          <section className="hidden md:block bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-slate-900">
                  {sessionMode === 'gt_championship'
                    ? t.tracker.standingsGtChampionship
                    : sessionMode === 'gt_race'
                      ? t.tracker.standingsGtRace
                      : sessionMode === 'gt_solo'
                        ? t.tracker.standingsGtSolo
                        : sessionMode === 'hillclimb'
                          ? t.tracker.standingsHillclimb
                          : sessionMode === 'rx'
                            ? t.tracker.standingsRx
                            : t.tracker.standingsRally}
                </h2>
                <p className="text-xs text-slate-500">{t.tracker.standingsSub}</p>
              </div>
              <div className="text-xs text-slate-500 whitespace-nowrap">
                {sessionMode === 'gt_championship'
                  ? t.tracker.ruleChampionship
                  : sessionMode === 'gt_race'
                    ? t.tracker.ruleGtRace
                    : sessionMode === 'gt_solo'
                      ? t.tracker.ruleGtSolo
                      : sessionMode === 'hillclimb'
                        ? t.tracker.ruleHillclimb
                        : sessionMode === 'rx'
                          ? t.tracker.ruleRx
                          : t.tracker.ruleRally}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                    <th className="py-3 px-4 w-16">{t.tracker.colPos}</th>
                    <th className="py-3 px-4">{t.tracker.colDriverCar}</th>
                    {activeSession.stages.map((st) => (
                      <th key={st.code} className="py-3 px-3 text-right">
                        {st.code}
                        {st.stageType === 'rx_race' && sessionMode === 'autotour'
                          ? t.tracker.colCircShort
                          : ''}
                        {!isGtSession && st.hasServiceTent && sessionMode !== 'hillclimb'
                          ? t.tracker.colAssistShort
                          : ''}
                      </th>
                    ))}
                    <th className="py-3 px-4 text-right">
                      {sessionMode === 'gt_championship'
                        ? t.tracker.colTotalPts
                        : sessionMode === 'gt_race' || sessionMode === 'rx'
                          ? t.tracker.colResult
                          : sessionMode === 'hillclimb' || sessionMode === 'gt_solo'
                            ? t.tracker.colBestTime
                            : t.tracker.colTotalTime}
                    </th>
                    {showDeltaColumn && (
                      <th className="py-3 px-4 text-right">{t.tracker.colDelta}</th>
                    )}
                    <th className="py-3 px-4">{t.tracker.colDamageDice}</th>
                    {showSpareColumn && <th className="py-3 px-4">{t.tracker.colSpare}</th>}
                    <th className="py-3 px-4 text-right">
                      {t.tracker.colAction(currentStage?.code || '')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {standings.map((row) => {
                    const spec = isGtSession
                      ? gtSpecs[row.player.gtCarClass || 'GT6'] || gtSpecs.GT6
                      : dirtSpecs[row.player.carClass] || dirtSpecs.R6;
                    const activeStageObj = currentStage || activeSession.stages[0];
                    const hasCurrentEntry = Boolean(row.stageTimes[activeStageObj.code]);
                    const hasBoost = spec.boostDice > 0 || row.latestDamages.boost > 0;
                    const isSoft = isGtSession
                      ? row.player.gtTireCompound === 'soft'
                      : row.player.tireCompound === 'soft';
                    const isRain = isGtSession
                      ? row.player.gtTireCompound === 'rain'
                      : row.player.tireCompound === 'rain';
                    const isAsphaltDirt = !isGtSession && row.player.tireCompound === 'asphalt';
                    const isSnowDirt = !isGtSession && row.player.tireCompound === 'snow';
                    const dangerLimit = isSoft
                      ? getSoftTireDangerLimit(row.latestTireWear, isGtSession ? 'gt' : 'dirt')
                      : spec.dangerLimit;

                    const carLabel = isGtSession
                      ? (row.player.gtCarClass || 'GT6').replace('_', ' ')
                      : row.player.carClass;

                    const remainingDiceSummary = formatDiceSummary(
                      {
                        speedDice: Math.max(0, spec.speedDice - row.latestDamages.speed),
                        coastDice: Math.max(0, spec.coastDice - row.latestDamages.coast),
                        brakeDice: Math.max(0, spec.brakeDice - row.latestDamages.brake),
                        boostDice: hasBoost
                          ? Math.max(0, spec.boostDice - row.latestDamages.boost)
                          : 0,
                      },
                      locale,
                      false
                    );

                    return (
                      <tr key={row.player.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono-tabular font-bold text-slate-900">
                          {row.isDisqualified ? 'DSQ' : `#${row.rank}`}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-2.5 h-2.5 rounded-xs shrink-0"
                              style={{ backgroundColor: getColorHex(row.player.color) }}
                              aria-hidden="true"
                            />
                            <div>
                              <div className="font-semibold text-slate-900">
                                {row.player.name}
                                {isGtSession && row.player.teamName ? (
                                  <span className="ml-1.5 text-xs font-normal text-slate-500">
                                    · {row.player.teamName}
                                  </span>
                                ) : null}
                              </div>
                              <div className="text-xs text-slate-500">
                                {carLabel} · {getCarColorLabel(row.player.color, locale)}
                                {isSoft
                                  ? t.tracker.softBadge(row.latestTireWear ?? 1, dangerLimit)
                                  : isRain
                                    ? t.tracker.rainBadge
                                    : isAsphaltDirt
                                      ? t.tracker.asphaltBadge
                                      : isSnowDirt
                                        ? t.tracker.snowBadge
                                        : ''}
                                {!isGtSession && row.player.unlimitedNote
                                  ? ` · ${row.player.unlimitedNote}`
                                  : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        {activeSession.stages.map((st) => {
                          const stageData = row.stageTimes[st.code];
                          const isBestAttempt =
                            (sessionMode === 'hillclimb' || sessionMode === 'gt_solo') &&
                            row.bestAttemptCode === st.code &&
                            Boolean(stageData);

                          return (
                            <td key={st.code} className="py-3 px-3 text-right">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingTarget({ player: row.player, stage: st })
                                }
                                className={`min-h-[36px] px-2.5 py-1 rounded-md font-mono-tabular text-xs font-semibold transition-colors ${
                                  stageData
                                    ? stageData.didAbandon || stageData.disqualified
                                      ? 'text-[#C83E2B] bg-red-50 hover:bg-red-100'
                                      : isBestAttempt
                                        ? 'text-emerald-900 bg-emerald-100 hover:bg-emerald-200'
                                        : 'text-slate-900 bg-slate-100 hover:bg-slate-200'
                                    : 'text-slate-400 hover:text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                {formatStageCellText(st, stageData)}
                              </button>
                            </td>
                          );
                        })}
                        <td className="py-3 px-4 text-right font-mono-tabular font-bold text-slate-900">
                          {row.stagesCompleted > 0
                            ? sessionMode === 'gt_championship'
                              ? `${row.totalPoints} pts`
                              : sessionMode === 'rx' || sessionMode === 'gt_race'
                                ? `${formatPositionLabel(
                                    row.bestPosition,
                                    row.isDisqualified,
                                    false,
                                    locale
                                  )}${
                                    sessionMode === 'gt_race' && row.latestFocusTokens > 0
                                      ? ` (${row.latestFocusTokens}F)`
                                      : ''
                                  }`
                                : formatSeconds(row.totalSeconds)
                            : '—'}
                        </td>
                        {showDeltaColumn && (
                          <td className="py-3 px-4 text-right font-mono-tabular text-xs font-medium text-slate-600">
                            {row.stagesCompleted > 0 ? formatDelta(row.deltaToLeader, locale) : '—'}
                          </td>
                        )}
                        <td className="py-3 px-4 font-mono-tabular text-xs text-slate-700">
                          <div>{formatDamagesCompact(row.latestDamages, hasBoost, locale)}</div>
                          <div className="text-[11px] text-slate-400">
                            {t.tracker.diceLabel} {remainingDiceSummary}
                          </div>
                        </td>
                        {showSpareColumn && (
                          <td className="py-3 px-4 text-xs font-semibold">
                            <span
                              className={
                                row.spareTireAvailable ? 'text-emerald-700' : 'text-amber-700'
                              }
                            >
                              {row.spareTireAvailable ? yesChar : 'N'}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingTarget({ player: row.player, stage: activeStageObj })
                            }
                            className="min-h-[38px] px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 whitespace-nowrap"
                          >
                            {hasCurrentEntry ? t.common.edit : t.common.enter}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Mobile Thumb-Optimized Cards (< md) */}
          <section className="md:hidden space-y-2.5">
            {standings.map((row) => {
              const activeStageObj = currentStage || activeSession.stages[0];
              const stageData = row.stageTimes[activeStageObj.code];
              const spec = isGtSession
                ? gtSpecs[row.player.gtCarClass || 'GT6'] || gtSpecs.GT6
                : dirtSpecs[row.player.carClass] || dirtSpecs.R6;
              const hasBoost = spec.boostDice > 0 || row.latestDamages.boost > 0;
              const isSoft = isGtSession
                ? row.player.gtTireCompound === 'soft'
                : row.player.tireCompound === 'soft';
              const carLabel = isGtSession
                ? (row.player.gtCarClass || 'GT6').replace('_', ' ')
                : row.player.carClass;

              return (
                <button
                  key={row.player.id}
                  type="button"
                  onClick={() =>
                    setEditingTarget({ player: row.player, stage: activeStageObj })
                  }
                  className="w-full text-left bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="font-mono-tabular text-base font-bold text-slate-500 w-9 shrink-0">
                      {row.isDisqualified ? 'DSQ' : `#${row.rank}`}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-xs shrink-0"
                          style={{ backgroundColor: getColorHex(row.player.color) }}
                        />
                        <span className="font-semibold text-slate-900 truncate">
                          {row.player.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono-tabular">
                          {carLabel}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 truncate">
                        {formatDamagesCompact(row.latestDamages, hasBoost, locale)}
                        {showSpareColumn
                          ? t.tracker.mobileSpare(row.spareTireAvailable ? yesChar : 'N')
                          : ''}
                        {isSoft ? ` · T${row.latestTireWear ?? 1}` : ''} · {activeStageObj.code}:{' '}
                        {stageData
                          ? formatStageCellText(activeStageObj, stageData)
                          : t.tracker.mobileToEnter}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="text-right">
                      <div className="font-mono-tabular text-base font-bold text-slate-900">
                        {row.stagesCompleted > 0
                          ? sessionMode === 'gt_championship'
                            ? `${row.totalPoints} pts`
                            : sessionMode === 'rx' || sessionMode === 'gt_race'
                              ? formatPositionLabel(
                                  row.bestPosition,
                                  row.isDisqualified,
                                  false,
                                  locale
                                )
                              : formatSeconds(row.totalSeconds)
                          : '—'}
                      </div>
                      <div className="font-mono-tabular text-[11px] text-slate-500">
                        {row.stagesCompleted > 0
                          ? sessionMode === 'gt_championship'
                            ? t.common.racesCount(row.stagesCompleted)
                            : sessionMode === 'rx' || sessionMode === 'gt_race'
                              ? row.isDisqualified
                                ? 'DSQ'
                                : row.latestFocusTokens > 0
                                  ? `${row.latestFocusTokens} Focus`
                                  : t.tracker.mobileRanked
                              : formatDelta(row.deltaToLeader, locale)
                          : t.tracker.mobileUnranked}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </section>

          {/* Championship Teams Standings (when teamName is filled in GT Championship) */}
          {teamStandings.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <h3 className="font-display text-lg font-bold text-slate-900">
                    {t.tracker.constructorsTitle}
                  </h3>
                </div>
                <span className="text-xs text-slate-500">{t.tracker.constructorsSub}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {teamStandings.map((team) => (
                  <div
                    key={team.teamName}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs font-mono-tabular font-bold text-slate-500">
                        #{team.rank}
                      </div>
                      <div className="text-sm font-semibold text-slate-900">{team.teamName}</div>
                      <div className="text-[11px] text-slate-500">
                        {t.common.carsCount(team.memberCount)}
                      </div>
                    </div>
                    <div className="font-mono-tabular text-lg font-bold text-slate-900">
                      {team.totalPoints} pts
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* Stage Entry Bottom Sheet / Modal */}
      {activeSession && editingTarget && activeGroup && (
        <StageEntrySheet
          open={Boolean(editingTarget)}
          sessionGame={activeSession.game || activeGame}
          sessionMode={sessionMode}
          dirtExtensions={dirtExtensions}
          gtExtensions={gtExtensions}
          playerCount={activeGroup.players.length}
          stage={editingTarget.stage}
          player={editingTarget.player}
          existingResult={
            activeSession.results.find(
              (r) =>
                r.stageCode === editingTarget.stage.code &&
                r.playerId === editingTarget.player.id
            ) || null
          }
          inheritedDamages={
            getInheritedStateForStage(editingTarget.player.id, editingTarget.stage.code).damages
          }
          inheritedSpareTire={
            getInheritedStateForStage(editingTarget.player.id, editingTarget.stage.code).spareTire
          }
          inheritedTireWear={
            getInheritedStateForStage(editingTarget.player.id, editingTarget.stage.code).tireWear
          }
          onSave={(res) => {
            onSaveStageResult(activeSession.id, res);
            setEditingTarget(null);
          }}
          onDelete={(resultId) => {
            onDeleteStageResult(activeSession.id, resultId);
            setEditingTarget(null);
          }}
          onClose={() => setEditingTarget(null)}
        />
      )}

      <ConfirmModal
        open={confirmDeleteSession}
        title={t.tracker.deleteModalTitle}
        description={t.tracker.deleteModalDesc(activeSession?.rallyName || '')}
        confirmLabel={t.common.delete}
        tone="danger"
        onConfirm={() => {
          if (activeSession) onDeleteSession(activeSession.id);
          setConfirmDeleteSession(false);
        }}
        onCancel={() => setConfirmDeleteSession(false)}
      />
    </div>
  );
}
