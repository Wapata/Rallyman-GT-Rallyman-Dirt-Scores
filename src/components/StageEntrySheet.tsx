import { useEffect, useState } from 'react';
import { CloudRain, Minus, Plus, RotateCcw, Sun, Trash2, Wrench, X } from 'lucide-react';
import { getGtCarSpecs, getGtSoloGearCards } from '../data/officialGt';
import {
  AUTOTOUR_POSITION_SECONDS,
  formatDiceSummary,
  getCarColorLabel,
  getChronoCards,
  getDirtCarSpecs,
} from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import {
  DamageCount,
  DirtExtensionId,
  GameId,
  GameMode,
  GtExtensionId,
  PlayerProfile,
  StageConfig,
  StageResult,
} from '../types/rally';
import {
  formatPositionLabel,
  formatSeconds,
  getChampionshipPointsForPosition,
  getSoftTireDangerLimit,
  normalizeDamages,
  parseTimeInput,
} from '../utils/time';

interface StageEntrySheetProps {
  open: boolean;
  sessionGame: GameId;
  sessionMode: GameMode;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  playerCount: number;
  stage: StageConfig | null;
  player: PlayerProfile | null;
  existingResult: StageResult | null;
  inheritedDamages: DamageCount;
  inheritedSpareTire: boolean;
  inheritedTireWear?: number;
  onSave: (result: StageResult) => void;
  onDelete?: (resultId: string) => void;
  onClose: () => void;
}

export function StageEntrySheet({
  open,
  sessionGame,
  sessionMode,
  dirtExtensions,
  gtExtensions,
  playerCount,
  stage,
  player,
  existingResult,
  inheritedDamages,
  inheritedSpareTire,
  inheritedTireWear,
  onSave,
  onDelete,
  onClose,
}: StageEntrySheetProps) {
  const { locale, t } = useLocale();
  const [rawSeconds, setRawSeconds] = useState(180);
  const [manualInput, setManualInput] = useState('3:00');
  const [cardHistory, setCardHistory] = useState<number[]>([]);
  const [secondsTokens, setSecondsTokens] = useState(0);
  const [liaisonPenalty, setLiaisonPenalty] = useState(0);
  const [didAbandon, setDidAbandon] = useState(false);

  const [directPosition, setDirectPosition] = useState<number>(1);
  const [jokerLapDone, setJokerLapDone] = useState<boolean>(true);
  const [weatherWet, setWeatherWet] = useState<boolean>(false);
  const [tireWearTurn, setTireWearTurn] = useState<number>(1);
  const [focusTokens, setFocusTokens] = useState<number>(0);
  const [gridGroup, setGridGroup] = useState<'A' | 'B' | undefined>(undefined);

  const [damages, setDamages] = useState<DamageCount>({
    speed: 0,
    coast: 0,
    brake: 0,
    boost: 0,
  });
  const [spareTireAvailable, setSpareTireAvailable] = useState(true);
  const [sisuUsed, setSisuUsed] = useState(false);
  const [serviceApplied, setServiceApplied] = useState(false);

  const isGt = sessionGame === 'gt' || sessionMode.startsWith('gt_');
  const isGtSolo = sessionMode === 'gt_solo' || stage?.stageType === 'gt_solo_lap';
  const isGtCircuit = isGt && !isGtSolo;
  const isHillclimb = !isGt && (sessionMode === 'hillclimb' || stage?.stageType === 'hillclimb_try');

  useEffect(() => {
    if (!open || !stage || !player) return;
    if (existingResult) {
      setRawSeconds(existingResult.rawSeconds);
      setManualInput(formatSeconds(existingResult.rawSeconds));
      setCardHistory([]);
      setSecondsTokens(existingResult.secondsTokens);
      setLiaisonPenalty(existingResult.liaisonPenaltySeconds);
      setDidAbandon(existingResult.didAbandon);
      setDirectPosition(existingResult.directPosition ?? 1);
      setJokerLapDone(existingResult.jokerLapDone ?? true);
      setWeatherWet(existingResult.weatherWet ?? false);
      setTireWearTurn(existingResult.tireWearTurn ?? inheritedTireWear ?? 1);
      setFocusTokens(
        existingResult.focusTokens ?? (isGtSolo ? existingResult.secondsTokens : 0)
      );
      setGridGroup(existingResult.gridGroup);
      setDamages(normalizeDamages(existingResult.damages));
      setSpareTireAvailable(existingResult.spareTireAvailable);
      setSisuUsed(existingResult.sisuUsed);
      setServiceApplied(existingResult.serviceApplied);
    } else {
      setRawSeconds(0);
      setManualInput('0:00');
      setCardHistory([]);
      setSecondsTokens(0);
      setLiaisonPenalty(0);
      setDidAbandon(false);
      setDirectPosition(1);
      setJokerLapDone(true);
      setWeatherWet(false);
      setTireWearTurn(inheritedTireWear ?? 1);
      setFocusTokens(0);
      setGridGroup(undefined);
      setDamages(normalizeDamages(inheritedDamages));
      setSpareTireAvailable(inheritedSpareTire);
      setSisuUsed(false);
      setServiceApplied(isHillclimb ? true : isGt ? false : stage.hasServiceTent);
    }
  }, [
    open,
    stage,
    player,
    existingResult,
    inheritedDamages,
    inheritedSpareTire,
    inheritedTireWear,
    sessionMode,
    isGt,
    isGtSolo,
    isHillclimb,
  ]);

  if (!open || !stage || !player) return null;

  const dirtSpecs = getDirtCarSpecs(locale);
  const gtSpecs = getGtCarSpecs(locale);
  const chronoCards = getChronoCards(locale);
  const gtSoloCards = getGtSoloGearCards(locale);

  const dirtSpec = dirtSpecs[player.carClass] || dirtSpecs.R6;
  const gtSpec = gtSpecs[player.gtCarClass || 'GT6'] || gtSpecs.GT6;
  const activeSpec = isGt ? gtSpec : dirtSpec;
  const activeCarLabel = isGt ? (player.gtCarClass || 'GT6').replace('_', ' ') : player.carClass;

  const isRxRace = !isGt && stage.stageType === 'rx_race';
  const hasBoost = activeSpec.boostDice > 0 || damages.boost > 0;
  const hasTeamChallenge = gtExtensions.includes('team_challenge');
  const hasAdrenaline = gtExtensions.includes('adrenaline');
  const maxRacePositions = isGt && (playerCount > 6 || hasTeamChallenge) ? 12 : 6;

  const usesSoftTires = isGt
    ? player.gtTireCompound === 'soft' ||
      (hasAdrenaline && existingResult?.tireWearTurn !== undefined)
    : player.tireCompound === 'soft' ||
      (dirtExtensions.includes('copilot') && existingResult?.tireWearTurn !== undefined);

  const effectiveDangerLimit = usesSoftTires
    ? getSoftTireDangerLimit(tireWearTurn, isGt ? 'gt' : 'dirt')
    : activeSpec.dangerLimit;

  const handleTapChronoCard = (secs: number) => {
    const next = rawSeconds + secs;
    setRawSeconds(next);
    setManualInput(formatSeconds(next));
    setCardHistory((prev) => [...prev, secs]);
  };

  const handleUndoCard = () => {
    if (cardHistory.length === 0) return;
    const last = cardHistory[cardHistory.length - 1];
    const next = Math.max(0, rawSeconds - last);
    setRawSeconds(next);
    setManualInput(formatSeconds(next));
    setCardHistory((prev) => prev.slice(0, -1));
  };

  const handleResetCards = () => {
    setRawSeconds(0);
    setManualInput('0:00');
    setCardHistory([]);
  };

  const handleManualInputChange = (val: string) => {
    setManualInput(val);
    const parsed = parseTimeInput(val);
    if (parsed !== null) {
      setRawSeconds(parsed);
    }
  };

  const adjustDamage = (key: keyof DamageCount, delta: number) => {
    setDamages((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(6, prev[key] + delta)),
    }));
  };

  const autoTourPreviewSeconds =
    AUTOTOUR_POSITION_SECONDS[Math.max(0, Math.min(5, directPosition - 1))] ?? 60;

  const previewNet = isGtSolo
    ? Math.max(0, rawSeconds - focusTokens)
    : isRxRace
      ? sessionMode === 'autotour'
        ? didAbandon || !jokerLapDone
          ? 60 + liaisonPenalty
          : Math.max(0, autoTourPreviewSeconds - secondsTokens + liaisonPenalty)
        : 0
      : Math.max(0, rawSeconds - secondsTokens + liaisonPenalty);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalRaw = isGtCircuit
      ? 0
      : isRxRace
        ? sessionMode === 'autotour'
          ? autoTourPreviewSeconds
          : 0
        : parseTimeInput(manualInput) ?? rawSeconds;

    const isDsq = isRxRace && sessionMode === 'rx' && !jokerLapDone;

    onSave({
      id: existingResult?.id || `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stageCode: stage.code,
      playerId: player.id,
      rawSeconds: Math.max(0, finalRaw),
      secondsTokens: isGt ? 0 : Math.max(0, secondsTokens),
      liaisonPenaltySeconds: isGt ? 0 : Math.max(0, liaisonPenalty),
      didAbandon,
      directPosition: isRxRace || isGtCircuit ? directPosition : undefined,
      jokerLapDone: isRxRace && sessionMode === 'rx' ? jokerLapDone : undefined,
      disqualified: isDsq || undefined,
      tireWearTurn: usesSoftTires ? tireWearTurn : undefined,
      weatherWet:
        isGt || isRxRace || player.carClass === 'RX' ? weatherWet : undefined,
      focusTokens: isGt ? Math.max(0, focusTokens) : undefined,
      gridGroup: isGtCircuit && hasTeamChallenge ? gridGroup : undefined,
      damages,
      spareTireAvailable: isGt || isHillclimb || sessionMode === 'rx' ? false : spareTireAvailable,
      sisuUsed,
      serviceApplied,
    });
  };

  const damageFields: { key: keyof DamageCount; label: string; max: number }[] =
    locale === 'en'
      ? [
          { key: 'speed', label: 'Gear (G)', max: activeSpec.speedDice },
          { key: 'coast', label: 'Coast (C)', max: activeSpec.coastDice },
          { key: 'brake', label: 'Brake (B)', max: activeSpec.brakeDice },
        ]
      : [
          { key: 'speed', label: 'Vitesse (V)', max: activeSpec.speedDice },
          { key: 'coast', label: 'Gaz (G)', max: activeSpec.coastDice },
          { key: 'brake', label: 'Freins (F)', max: activeSpec.brakeDice },
        ];
  if (hasBoost) {
    damageFields.push({
      key: 'boost',
      label: locale === 'en' ? 'Boost (Bo)' : 'Boost (B)',
      max: Math.max(1, activeSpec.boostDice),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 md:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="stage-entry-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full md:max-w-2xl max-h-[92vh] flex flex-col bg-white rounded-t-3xl md:rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="md:hidden pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200">
          <div>
            <h2
              id="stage-entry-title"
              className="font-display text-xl font-bold text-slate-900 tracking-tight"
            >
              {stage.code} · {player.name}
            </h2>
            <p className="text-xs text-slate-500 font-mono-tabular">
              {activeCarLabel} ({getCarColorLabel(player.color, locale)}) ·{' '}
              {t.stageEntry.maxGear(activeSpec.maxGear)} ·{' '}
              {t.stageEntry.limitLabel(effectiveDangerLimit)}
              {isGt && player.teamName ? t.stageEntry.teamPrefix(player.teamName) : ''}
              {!isGt && stage.hasServiceTent && !isHillclimb ? t.stageEntry.assistanceAtFinish : ''}
              {isHillclimb ? t.stageEntry.hillclimbResetNote : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {isGtCircuit ? (
            /* Rallyman: GT Circuit Race / Championship Position Entry */
            <section className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.stageEntry.finishPosition(
                      sessionMode === 'gt_championship'
                        ? t.stageEntry.modeChampScale
                        : t.stageEntry.modeGtRace
                    )}
                  </label>
                  <span className="text-xs text-slate-500">
                    {t.stageEntry.positionsCount(maxRacePositions)}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {Array.from({ length: maxRacePositions }, (_, i) => i + 1).map((pos) => {
                    const isSelected = directPosition === pos;
                    const pts = getChampionshipPointsForPosition(pos, false, false);
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setDirectPosition(pos)}
                        className={`min-h-[52px] px-2 py-2 rounded-lg border text-center transition-colors ${
                          isSelected
                            ? 'border-slate-900 bg-slate-900 text-white'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
                        }`}
                      >
                        <div className="font-display text-base font-bold">
                          {formatPositionLabel(pos, false, false, locale)}
                        </div>
                        {sessionMode === 'gt_championship' && (
                          <div
                            className={`font-mono-tabular text-[11px] ${
                              isSelected ? 'text-slate-200' : 'text-slate-500'
                            }`}
                          >
                            +{pts} pt{pts > 1 ? 's' : ''}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t.stageEntry.focusRemaining(hasTeamChallenge)}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFocusTokens((v) => Math.max(0, v - 1))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.focusRemoveAria}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={focusTokens}
                      onChange={(e) => setFocusTokens(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-2 text-center rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setFocusTokens((v) => v + 1)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.focusAddAria}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setWeatherWet((v) => !v)}
                    className={`min-h-[44px] px-3.5 py-2 rounded-lg border text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                      weatherWet
                        ? 'border-blue-300 bg-blue-50 text-blue-900'
                        : 'border-amber-200 bg-amber-50/60 text-amber-900'
                    }`}
                  >
                    {weatherWet ? (
                      <CloudRain className="w-4 h-4 shrink-0" />
                    ) : (
                      <Sun className="w-4 h-4 shrink-0" />
                    )}
                    <span>{t.stageEntry.trackWeather(weatherWet)}</span>
                  </button>
                </div>
              </div>

              {hasTeamChallenge && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-slate-600">
                    {t.stageEntry.pursuitGrid}
                  </span>
                  {([undefined, 'A', 'B'] as const).map((g) => (
                    <button
                      key={g || 'none'}
                      type="button"
                      onClick={() => setGridGroup(g)}
                      className={`min-h-[36px] px-3 text-xs font-semibold rounded-md border transition-colors ${
                        gridGroup === g
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {g ? t.stageEntry.gridLabel(g) : t.stageEntry.gridStandard}
                    </button>
                  ))}
                </div>
              )}
            </section>
          ) : isGtSolo ? (
            /* Rallyman: GT Solo Score Sheet */
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="manual-time-input" className="text-sm font-semibold text-slate-900">
                  {t.stageEntry.soloTimeSheetTitle}
                </label>
                <div className="flex items-center gap-1.5">
                  {cardHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoCard}
                      className="min-h-[36px] px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                    >
                      {t.stageEntry.undoLap}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetCards}
                    className="min-h-[36px] px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>0:00</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {gtSoloCards.map((card) => {
                  const aboveCarMax =
                    typeof card.gear === 'number' && card.gear > gtSpec.maxGear;
                  return (
                    <button
                      key={String(card.gear)}
                      type="button"
                      onClick={() => handleTapChronoCard(card.seconds)}
                      className={`min-h-[52px] px-2 py-1.5 rounded-lg border text-left transition-colors active:scale-[0.98] ${
                        card.gear === '00'
                          ? 'border-red-200 bg-red-50/70 hover:bg-red-100 text-red-900'
                          : aboveCarMax
                            ? 'border-slate-200 bg-slate-100/70 text-slate-400 hover:bg-slate-100'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="text-[11px] font-medium text-slate-500 truncate">
                        {card.label}
                      </div>
                      <div className="font-mono-tabular text-sm font-bold">+{card.hint}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="manual-time-input"
                    className="block text-xs font-medium text-slate-600 mb-1"
                  >
                    {t.stageEntry.totalLapTime}
                  </label>
                  <input
                    id="manual-time-input"
                    type="text"
                    value={manualInput}
                    onChange={(e) => handleManualInputChange(e.target.value)}
                    placeholder="2:30"
                    className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t.stageEntry.focusRemainingSolo}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setFocusTokens((v) => Math.max(0, v - 1))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.focusRemoveAria}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={focusTokens}
                      onChange={(e) => setFocusTokens(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-2 text-center rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setFocusTokens((v) => v + 1)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.focusAddAria}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {[1, 3, 5].map((tok) => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => setFocusTokens((v) => v + tok)}
                        className="flex-1 min-h-[34px] text-xs font-mono-tabular font-semibold rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      >
                        -{tok}s
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWeatherWet((v) => !v)}
                className={`min-h-[44px] w-full sm:w-auto px-3.5 py-2 rounded-lg border text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                  weatherWet
                    ? 'border-blue-300 bg-blue-50 text-blue-900'
                    : 'border-amber-200 bg-amber-50/60 text-amber-900'
                }`}
              >
                {weatherWet ? (
                  <CloudRain className="w-4 h-4 shrink-0" />
                ) : (
                  <Sun className="w-4 h-4 shrink-0" />
                )}
                <span>{t.stageEntry.weatherShort(weatherWet)}</span>
              </button>
            </section>
          ) : isRxRace ? (
            /* Direct Confrontation Entry (DIRT RX / Ice / Auto Tour Circuit) */
            <section className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-900">
                    {t.stageEntry.directPositionTitle}
                  </label>
                  {sessionMode === 'autotour' && (
                    <span className="text-xs text-slate-500">
                      {t.stageEntry.autoTourScaleHint}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((pos) => {
                    const isSelected = directPosition === pos;
                    const penalty = AUTOTOUR_POSITION_SECONDS[pos - 1];
                    return (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => setDirectPosition(pos)}
                        className={`min-h-[52px] px-2 py-2 rounded-lg border text-center transition-colors ${
                          isSelected
                            ? 'border-[#C83E2B] bg-red-50 text-[#C83E2B]'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
                        }`}
                      >
                        <div className="font-display text-base font-bold">
                          {formatPositionLabel(pos, false, false, locale)}
                        </div>
                        {sessionMode === 'autotour' && (
                          <div className="font-mono-tabular text-[11px] text-slate-500">
                            +{penalty}s
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {sessionMode === 'rx' && (
                  <button
                    type="button"
                    onClick={() => setJokerLapDone((v) => !v)}
                    className={`min-h-[48px] px-3.5 py-2 rounded-lg border text-sm font-semibold text-left transition-colors ${
                      jokerLapDone
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                        : 'border-red-300 bg-red-50 text-red-900'
                    }`}
                  >
                    {t.stageEntry.mandatoryJoker(jokerLapDone)}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setWeatherWet((v) => !v)}
                  className={`min-h-[48px] px-3.5 py-2 rounded-lg border text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                    weatherWet
                      ? 'border-blue-300 bg-blue-50 text-blue-900'
                      : 'border-amber-200 bg-amber-50/60 text-amber-900'
                  }`}
                >
                  {weatherWet ? (
                    <CloudRain className="w-4 h-4 shrink-0" />
                  ) : (
                    <Sun className="w-4 h-4 shrink-0" />
                  )}
                  <span>{t.stageEntry.rxWeather(weatherWet)}</span>
                </button>
              </div>
            </section>
          ) : (
            /* DIRT Chrono Card Calculator (Rally / Hillclimb / Auto Tour SS) */
            <section className="space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <label htmlFor="manual-time-input" className="text-sm font-semibold text-slate-900">
                  {t.stageEntry.chronoCardsTitle}
                </label>
                <div className="flex items-center gap-1.5">
                  {cardHistory.length > 0 && (
                    <button
                      type="button"
                      onClick={handleUndoCard}
                      className="min-h-[36px] px-2.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md"
                    >
                      {t.stageEntry.undoCard}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleResetCards}
                    className="min-h-[36px] px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>0:00</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {chronoCards.map((card) => {
                  const aboveCarMax =
                    typeof card.gear === 'number' && card.gear > dirtSpec.maxGear;
                  return (
                    <button
                      key={String(card.gear)}
                      type="button"
                      onClick={() => handleTapChronoCard(card.seconds)}
                      className={`min-h-[52px] px-2 py-1.5 rounded-lg border text-left transition-colors active:scale-[0.98] ${
                        card.gear === 'PDC'
                          ? 'border-red-200 bg-red-50/70 hover:bg-red-100 text-red-900'
                          : card.gear === 'SISU'
                            ? 'border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-900'
                            : aboveCarMax
                              ? 'border-slate-200 bg-slate-100/70 text-slate-400 hover:bg-slate-100'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="text-[11px] font-medium text-slate-500 truncate">
                        {card.label}
                      </div>
                      <div className="font-mono-tabular text-sm font-bold">+{card.hint}</div>
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div>
                  <label
                    htmlFor="manual-time-input"
                    className="block text-xs font-medium text-slate-600 mb-1"
                  >
                    {t.stageEntry.rawTimeLabel}
                  </label>
                  <input
                    id="manual-time-input"
                    type="text"
                    value={manualInput}
                    onChange={(e) => handleManualInputChange(e.target.value)}
                    placeholder="3:00"
                    className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t.stageEntry.secondTokensLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSecondsTokens((v) => Math.max(0, v - 1))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.removeSecondAria}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={secondsTokens}
                      onChange={(e) => setSecondsTokens(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-2 text-center rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setSecondsTokens((v) => v + 1)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.addSecondAria}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-1.5 mt-1.5">
                    {[1, 3, 5].map((tok) => (
                      <button
                        key={tok}
                        type="button"
                        onClick={() => setSecondsTokens((v) => v + tok)}
                        className="flex-1 min-h-[34px] text-xs font-mono-tabular font-semibold rounded border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
                      >
                        -{tok}s
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    {t.stageEntry.liaisonLabel}
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setLiaisonPenalty((v) => Math.max(0, v - 5))}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.removeLiaisonAria}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      min={0}
                      step={5}
                      value={liaisonPenalty}
                      onChange={(e) => setLiaisonPenalty(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full min-h-[44px] px-2 text-center rounded-lg border border-slate-300 font-mono-tabular text-base font-semibold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setLiaisonPenalty((v) => v + 5)}
                      className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg border border-slate-300 bg-white hover:bg-slate-50"
                      aria-label={t.stageEntry.addLiaisonAria}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Net Preview + Abandon */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <div className="text-xs font-medium text-slate-500">
                {isGtCircuit
                  ? sessionMode === 'gt_championship'
                    ? t.stageEntry.previewLabelGtChamp
                    : t.stageEntry.previewLabelGtRace
                  : isGtSolo
                    ? t.stageEntry.previewLabelGtSolo
                    : isRxRace && sessionMode === 'rx'
                      ? t.stageEntry.previewLabelRx
                      : t.stageEntry.previewLabelNet}
              </div>
              <div className="font-mono-tabular text-2xl font-bold text-slate-900">
                {isGtCircuit
                  ? didAbandon
                    ? sessionMode === 'gt_championship'
                      ? t.stageEntry.retiredChamp
                      : t.stageEntry.eliminatedZero
                    : `${formatPositionLabel(directPosition, false, false, locale)}${
                        sessionMode === 'gt_championship'
                          ? ` (+${getChampionshipPointsForPosition(directPosition, false, false)} pts)`
                          : ''
                      }`
                  : isRxRace && sessionMode === 'rx'
                    ? !jokerLapDone
                      ? t.stageEntry.dsqMissedJoker
                      : didAbandon
                        ? t.stageEntry.retiredGeneric
                        : directPosition === 1
                          ? t.stageEntry.firstQualified
                          : formatPositionLabel(directPosition, false, false, locale)
                    : didAbandon
                      ? isGtSolo
                        ? t.stageEntry.retiredSolo
                        : t.stageEntry.retiredRallyPenalty
                      : formatSeconds(previewNet)}
              </div>
            </div>
            <label className="min-h-[44px] px-3 py-2 flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer select-none">
              <input
                type="checkbox"
                checked={didAbandon}
                onChange={(e) => setDidAbandon(e.target.checked)}
                className="w-4 h-4 accent-[#C83E2B]"
              />
              <span className="text-sm font-medium text-slate-800">
                {isGt ? t.stageEntry.checkboxEliminated : t.stageEntry.checkboxRetired}
              </span>
            </label>
          </div>

          {/* Damages & Equipment */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-slate-900">
                {isGt ? t.stageEntry.damagesTitleGt : t.stageEntry.damagesTitleDirt(isHillclimb)}
              </h3>
              <span className="font-mono-tabular text-xs text-slate-500">
                {activeCarLabel} : {formatDiceSummary(activeSpec, locale, false)}
              </span>
            </div>

            <div
              className={`grid gap-2.5 ${
                damageFields.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'
              }`}
            >
              {damageFields.map(({ key, label, max }) => {
                const count = damages[key];
                const remaining = Math.max(0, max - count);
                return (
                  <div
                    key={key}
                    className="p-2.5 rounded-lg border border-slate-200 bg-white space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{label}</span>
                      <span className="font-mono-tabular text-slate-500">
                        {remaining}/{max}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1">
                      <button
                        type="button"
                        onClick={() => adjustDamage(key, -1)}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100"
                        aria-label={t.stageEntry.reduceDamageAria(label)}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-mono-tabular text-base font-bold text-slate-900">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => adjustDamage(key, 1)}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-100"
                        aria-label={t.stageEntry.addDamageAria(label)}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Soft Tire Wear Stepper (Copilot Pack DIRT or Adrenaline Pack GT) */}
            {usesSoftTires && (
              <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-slate-900">
                    {isGt ? t.stageEntry.softTireWearGt : t.stageEntry.softTireWearDirt}
                  </div>
                  <div className="text-[11px] text-slate-600">
                    {isGt ? t.stageEntry.softTireRuleGt : t.stageEntry.softTireRuleDirt}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setTireWearTurn((v) => Math.max(1, v - 1))}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-mono-tabular text-sm font-bold text-slate-900 min-w-[64px] text-center">
                    T{tireWearTurn} ({effectiveDangerLimit}⚠)
                  </span>
                  <button
                    type="button"
                    onClick={() => setTireWearTurn((v) => Math.min(7, v + 1))}
                    className="min-h-[38px] min-w-[38px] flex items-center justify-center rounded-md border border-slate-300 bg-white hover:bg-slate-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {!isGt && !isHillclimb && sessionMode !== 'rx' && (
                <button
                  type="button"
                  onClick={() => setSpareTireAvailable((v) => !v)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg border text-sm font-medium text-left transition-colors ${
                    spareTireAvailable
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                >
                  {t.stageEntry.spareTireBtn(spareTireAvailable)}
                </button>
              )}

              {(!isGt || hasAdrenaline || existingResult?.sisuUsed) && (
                <button
                  type="button"
                  onClick={() => setSisuUsed((v) => !v)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg border text-sm font-medium text-left transition-colors ${
                    sisuUsed
                      ? 'border-amber-300 bg-amber-50 text-amber-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {t.stageEntry.sisuBtn(sisuUsed)}
                </button>
              )}

              {!isGtSolo && (
                <button
                  type="button"
                  onClick={() => setServiceApplied((v) => !v)}
                  className={`min-h-[44px] px-3 py-2 rounded-lg border text-sm font-medium text-left flex items-center gap-2 transition-colors ${
                    serviceApplied
                      ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  <Wrench className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {isHillclimb
                      ? t.stageEntry.serviceHillclimb(serviceApplied)
                      : isGt
                        ? t.stageEntry.servicePitStop(serviceApplied)
                        : t.stageEntry.serviceAssistance(serviceApplied)}
                  </span>
                </button>
              )}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 px-5 py-3.5 bg-slate-50 border-t border-slate-200">
          {existingResult && onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(existingResult.id)}
              className="min-h-[44px] px-3.5 py-2 text-sm font-medium text-[#C83E2B] hover:bg-red-50 rounded-lg flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>{t.stageEntry.erase}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-[#C83E2B] hover:bg-[#B03423] rounded-lg"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
