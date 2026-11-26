import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { getOfficialGtEvents } from '../data/officialGt';
import { getOfficialRallies } from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import {
  DirtExtensionId,
  GameId,
  GameMode,
  GtExtensionId,
  PlayerGroup,
  RallySession,
  SisuRule,
  StageConfig,
  StageType,
} from '../types/rally';

interface NewRallyModalProps {
  open: boolean;
  activeGame: GameId;
  groups: PlayerGroup[];
  activeGroupId: string;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  onEnsureDirtExtensions?: (exts: DirtExtensionId[]) => void;
  onEnsureGtExtensions?: (exts: GtExtensionId[]) => void;
  onCreate: (session: RallySession) => void;
  onClose: () => void;
}

export function NewRallyModal({
  open,
  activeGame,
  groups,
  activeGroupId,
  dirtExtensions,
  gtExtensions,
  onEnsureDirtExtensions,
  onEnsureGtExtensions,
  onCreate,
  onClose,
}: NewRallyModalProps) {
  const { locale, t } = useLocale();
  const [groupId, setGroupId] = useState(activeGroupId);
  const [sourceMode, setSourceMode] = useState<'official' | 'custom'>('official');

  const officialTemplates = useMemo(
    () => (activeGame === 'gt' ? getOfficialGtEvents(locale) : getOfficialRallies(locale)),
    [activeGame, locale]
  );

  const [selectedOfficialId, setSelectedOfficialId] = useState(officialTemplates[0].id);
  const [customName, setCustomName] = useState(
    activeGame === 'gt' ? t.newRallyModal.defaultCustomGtRace : t.newRallyModal.defaultCustomDirtRally
  );
  const [customGameMode, setCustomGameMode] = useState<GameMode>(
    activeGame === 'gt' ? 'gt_race' : 'rally'
  );
  const [stageCount, setStageCount] = useState(activeGame === 'gt' ? 1 : 3);
  const [serviceEveryStage, setServiceEveryStage] = useState(false);
  const [customStages, setCustomStages] = useState<StageConfig[]>([
    { code: 'SS1', name: t.newRallyModal.specialWord(1), stageType: 'special', hasServiceTent: true },
    { code: 'C1', name: t.newRallyModal.circuitWord(1), stageType: 'rx_race', hasServiceTent: true },
    { code: 'SS2', name: t.newRallyModal.specialWord(2), stageType: 'special', hasServiceTent: false },
  ]);
  const [sisuRule, setSisuRule] = useState<SisuRule>('per_rally');

  useEffect(() => {
    if (!open) return;
    setGroupId(activeGroupId);
    const list = activeGame === 'gt' ? getOfficialGtEvents(locale) : getOfficialRallies(locale);
    setSelectedOfficialId(list[0].id);
    if (activeGame === 'gt') {
      setCustomGameMode('gt_race');
      setCustomName(t.newRallyModal.defaultCustomGtRace);
      setStageCount(1);
    } else {
      setCustomGameMode('rally');
      setCustomName(t.newRallyModal.defaultCustomDirtRally);
      setStageCount(3);
    }
  }, [open, activeGame, activeGroupId, locale, t.newRallyModal]);

  const sortedOfficialTemplates = useMemo(() => {
    const activeExts: string[] = activeGame === 'gt' ? gtExtensions : dirtExtensions;
    return [...officialTemplates].sort((a, b) => {
      const aUnlocked = a.requiredExtensions.every((ext) => activeExts.includes(ext));
      const bUnlocked = b.requiredExtensions.every((ext) => activeExts.includes(ext));
      if (aUnlocked !== bUnlocked) return aUnlocked ? -1 : 1;
      return 0;
    });
  }, [activeGame, officialTemplates, dirtExtensions, gtExtensions]);

  if (!open) return null;

  const selectedTemplate =
    officialTemplates.find((r) => r.id === selectedOfficialId) || officialTemplates[0];

  const handleChangeCustomMode = (nextMode: GameMode) => {
    setCustomGameMode(nextMode);
    if (nextMode === 'gt_race') {
      setCustomName(t.newRallyModal.defaultCustomGtRace);
      setStageCount(1);
    } else if (nextMode === 'gt_championship') {
      setCustomName(t.newRallyModal.defaultCustomGtChamp);
      setStageCount(8);
    } else if (nextMode === 'gt_solo') {
      setCustomName(t.newRallyModal.defaultCustomGtSolo);
      setStageCount(1);
    } else if (nextMode === 'hillclimb') {
      setCustomName(t.newRallyModal.defaultCustomDirtClimb);
      setStageCount(3);
    } else if (nextMode === 'rx') {
      setCustomName(t.newRallyModal.defaultCustomDirtRx);
      setStageCount(2);
    } else if (nextMode === 'autotour') {
      setCustomName(t.newRallyModal.defaultCustomDirtAutoTour);
      setCustomStages([
        {
          code: 'SS1',
          name: t.newRallyModal.specialWord(1),
          stageType: 'special',
          hasServiceTent: true,
        },
        {
          code: 'C1',
          name: t.newRallyModal.circuitWord(1),
          stageType: 'rx_race',
          hasServiceTent: true,
        },
        {
          code: 'SS2',
          name: t.newRallyModal.specialWord(2),
          stageType: 'special',
          hasServiceTent: false,
        },
      ]);
    } else {
      setCustomName(t.newRallyModal.defaultCustomDirtRally);
      setStageCount(3);
    }
  };

  const handleToggleAutoTourStage = (idx: number, patch: Partial<StageConfig>) => {
    setCustomStages((prev) =>
      prev.map((st, i) => {
        if (i !== idx) return st;
        const nextType = patch.stageType ?? st.stageType;
        return {
          ...st,
          ...patch,
          code:
            patch.stageType && patch.stageType !== st.stageType
              ? nextType === 'rx_race'
                ? `C${idx + 1}`
                : `SS${idx + 1}`
              : st.code,
          name:
            patch.stageType && patch.stageType !== st.stageType
              ? nextType === 'rx_race'
                ? t.newRallyModal.circuitWord(idx + 1)
                : t.newRallyModal.specialWord(idx + 1)
              : st.name,
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetGroupId = groups.some((g) => g.id === groupId) ? groupId : groups[0]?.id;
    if (!targetGroupId) return;

    let rallyName = customName.trim() || t.newRallyModal.defaultCustomFallback;
    let finalMode: GameMode = customGameMode;
    let stages: StageConfig[] = [];

    if (sourceMode === 'official') {
      rallyName = selectedTemplate.name;
      finalMode = selectedTemplate.mode;
      stages = selectedTemplate.stages.map((s) => ({ ...s }));
      if (selectedTemplate.requiredExtensions.length > 0) {
        if (activeGame === 'gt' && onEnsureGtExtensions) {
          onEnsureGtExtensions(selectedTemplate.requiredExtensions as GtExtensionId[]);
        } else if (activeGame === 'dirt' && onEnsureDirtExtensions) {
          onEnsureDirtExtensions(selectedTemplate.requiredExtensions as DirtExtensionId[]);
        }
      }
    } else if (activeGame === 'gt') {
      if (customGameMode === 'gt_solo') {
        stages = [
          {
            code: 'SOLO',
            name: t.newRallyModal.soloLapName,
            stageType: 'gt_solo_lap',
            hasServiceTent: false,
            laps: 1,
          },
        ];
      } else if (customGameMode === 'gt_championship') {
        stages = Array.from({ length: stageCount }, (_, idx) => ({
          code: `C${idx + 1}`,
          name: t.newRallyModal.courseWord(idx + 1),
          stageType: 'gt_circuit' as StageType,
          hasServiceTent: true,
          laps: 2,
        }));
        if (onEnsureGtExtensions) onEnsureGtExtensions(['championship']);
      } else {
        stages = Array.from({ length: stageCount }, (_, idx) => ({
          code: `C${idx + 1}`,
          name: t.newRallyModal.courseWord(idx + 1),
          stageType: 'gt_circuit' as StageType,
          hasServiceTent: true,
          laps: 2,
        }));
      }
    } else if (customGameMode === 'autotour') {
      stages = customStages.map((s) => ({ ...s }));
      if (onEnsureDirtExtensions) onEnsureDirtExtensions(['rx']);
    } else if (customGameMode === 'hillclimb') {
      stages = Array.from({ length: 3 }, (_, idx) => ({
        code: `TRY${idx + 1}`,
        name: t.newRallyModal.attemptWord(idx + 1),
        stageType: 'hillclimb_try' as StageType,
        hasServiceTent: idx < 2,
      }));
      if (onEnsureDirtExtensions) onEnsureDirtExtensions(['climb']);
    } else if (customGameMode === 'rx') {
      stages = Array.from({ length: stageCount }, (_, idx) => ({
        code: `RX${idx + 1}`,
        name: t.newRallyModal.heatName(idx + 1),
        stageType: 'rx_race' as StageType,
        hasServiceTent: false,
        laps: 2,
      }));
      if (onEnsureDirtExtensions) onEnsureDirtExtensions(['rx']);
    } else {
      stages = Array.from({ length: stageCount }, (_, idx) => ({
        code: `SS${idx + 1}`,
        name: t.newRallyModal.specialWord(idx + 1),
        stageType: 'special' as StageType,
        hasServiceTent: idx < stageCount - 1 && (serviceEveryStage || idx === 1),
      }));
    }

    onCreate({
      id: `session-${Date.now()}`,
      game: activeGame,
      groupId: targetGroupId,
      rallyName,
      date: new Date().toISOString().slice(0, 10),
      mode: finalMode,
      sisuRule,
      stages,
      results: [],
      status: 'active',
    });
  };

  const activeExtsList: string[] = activeGame === 'gt' ? gtExtensions : dirtExtensions;
  const activeGameName = activeGame === 'gt' ? 'Rallyman: GT' : 'Rallyman: DIRT';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-rally-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-lg max-h-[90vh] flex flex-col bg-white rounded-t-2xl sm:rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 id="new-rally-title" className="font-display text-xl font-bold text-slate-900">
              {t.newRallyModal.title(activeGameName)}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.newRallyModal.groupLabel}
            </label>
            <select
              value={groupId}
              onChange={(e) => setGroupId(e.target.value)}
              className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({t.common.driversCount(g.players.length)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setSourceMode('official')}
              className={`flex-1 min-h-[38px] text-xs font-semibold rounded-md transition-colors ${
                sourceMode === 'official' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.newRallyModal.officialTemplatesTab(officialTemplates.length)}
            </button>
            <button
              type="button"
              onClick={() => setSourceMode('custom')}
              className={`flex-1 min-h-[38px] text-xs font-semibold rounded-md transition-colors ${
                sourceMode === 'custom' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.newRallyModal.customEventTab}
            </button>
          </div>

          {sourceMode === 'official' ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                {t.newRallyModal.chooseOfficialLabel(activeGame === 'gt' ? 'GT' : 'DIRT')}
              </label>
              <select
                value={selectedOfficialId}
                onChange={(e) => setSelectedOfficialId(e.target.value)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm"
              >
                {sortedOfficialTemplates.map((r) => {
                  const locked = r.requiredExtensions.some((ext) => !activeExtsList.includes(ext));
                  return (
                    <option key={r.id} value={r.id}>
                      {r.name}
                      {locked
                        ? t.newRallyModal.requiresExt(
                            r.requiredExtensions.join(', ').toUpperCase()
                          )
                        : ''}
                    </option>
                  );
                })}
              </select>
              <p className="text-xs text-slate-500">
                {selectedTemplate.durationHint} ·{' '}
                {t.common.stagesCount(selectedTemplate.stages.length)}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.newRallyModal.eventFormatLabel}
                </label>
                {activeGame === 'gt' ? (
                  <select
                    value={customGameMode}
                    onChange={(e) => handleChangeCustomMode(e.target.value as GameMode)}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium"
                  >
                    <option value="gt_race">{t.newRallyModal.gtRaceOpt}</option>
                    <option value="gt_championship">{t.newRallyModal.gtChampOpt}</option>
                    <option value="gt_solo">{t.newRallyModal.gtSoloOpt}</option>
                  </select>
                ) : (
                  <select
                    value={customGameMode}
                    onChange={(e) => handleChangeCustomMode(e.target.value as GameMode)}
                    className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm font-medium"
                  >
                    <option value="rally">{t.newRallyModal.dirtRallyOpt}</option>
                    <option value="hillclimb">{t.newRallyModal.dirtClimbOpt}</option>
                    <option value="rx">{t.newRallyModal.dirtRxOpt}</option>
                    <option value="autotour">{t.newRallyModal.dirtAutoTourOpt}</option>
                  </select>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.newRallyModal.eventNameLabel}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {activeGame === 'gt' ? (
                customGameMode === 'gt_solo' ? (
                  <p className="text-xs text-slate-600 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    {t.newRallyModal.gtSoloInfo}
                  </p>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.newRallyModal.raceCountLabel}
                    </label>
                    <select
                      value={stageCount}
                      onChange={(e) => setStageCount(Number(e.target.value))}
                      className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                        <option key={n} value={n}>
                          {t.common.racesCount(n)}
                        </option>
                      ))}
                    </select>
                  </div>
                )
              ) : customGameMode === 'autotour' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700">
                      {t.newRallyModal.autoTourStepsLabel(customStages.length)}
                    </span>
                    {customStages.length < 8 && (
                      <button
                        type="button"
                        onClick={() =>
                          setCustomStages((prev) => [
                            ...prev,
                            {
                              code: `SS${prev.length + 1}`,
                              name: t.newRallyModal.specialWord(prev.length + 1),
                              stageType: 'special',
                              hasServiceTent: false,
                            },
                          ])
                        }
                        className="text-xs font-semibold text-[#C83E2B] hover:underline"
                      >
                        {t.newRallyModal.addStep}
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    {customStages.map((st, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                        <input
                          type="text"
                          value={st.code}
                          onChange={(e) =>
                            handleToggleAutoTourStage(idx, { code: e.target.value.toUpperCase() })
                          }
                          className="col-span-3 min-h-[38px] px-2 rounded border border-slate-300 text-xs font-mono-tabular font-semibold"
                        />
                        <select
                          value={st.stageType}
                          onChange={(e) =>
                            handleToggleAutoTourStage(idx, {
                              stageType: e.target.value as StageType,
                            })
                          }
                          className="col-span-6 min-h-[38px] px-2 rounded border border-slate-300 bg-white text-xs"
                        >
                          <option value="special">{t.newRallyModal.stepSpecial}</option>
                          <option value="rx_race">{t.newRallyModal.stepCircuit}</option>
                        </select>
                        <label className="col-span-3 min-h-[38px] px-2 flex items-center gap-1 rounded border border-slate-200 bg-slate-50 text-[11px]">
                          <input
                            type="checkbox"
                            checked={st.hasServiceTent}
                            onChange={(e) =>
                              handleToggleAutoTourStage(idx, { hasServiceTent: e.target.checked })
                            }
                            className="accent-[#C83E2B]"
                          />
                          <span>{t.newRallyModal.stepAssist}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ) : customGameMode === 'hillclimb' ? (
                <p className="text-xs text-slate-600 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  {t.newRallyModal.hillclimbInfo}
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {customGameMode === 'rx'
                        ? t.newRallyModal.heatsCountLabel
                        : t.newRallyModal.stagesCountLabel}
                    </label>
                    <select
                      value={stageCount}
                      onChange={(e) => setStageCount(Number(e.target.value))}
                      className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <option key={n} value={n}>
                          {n}{' '}
                          {customGameMode === 'rx'
                            ? t.newRallyModal.heatWord(n)
                            : t.newRallyModal.stageWord(n)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {customGameMode === 'rally' && (
                    <label className="min-h-[44px] mt-5 px-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 cursor-pointer text-xs font-medium">
                      <input
                        type="checkbox"
                        checked={serviceEveryStage}
                        onChange={(e) => setServiceEveryStage(e.target.checked)}
                        className="accent-[#C83E2B]"
                      />
                      <span>{t.newRallyModal.assistanceBetweenStages}</span>
                    </label>
                  )}
                </div>
              )}
            </div>
          )}

          {(activeGame === 'dirt' || gtExtensions.includes('adrenaline')) && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.newRallyModal.sisuRuleLabel}
              </label>
              <select
                value={sisuRule}
                onChange={(e) => setSisuRule(e.target.value as SisuRule)}
                className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 bg-white text-sm"
              >
                <option value="per_rally">
                  {activeGame === 'gt'
                    ? t.newRallyModal.sisuPerEventGt
                    : t.newRallyModal.sisuPerEventDirt}
                </option>
                <option value="per_stage">
                  {activeGame === 'gt'
                    ? t.newRallyModal.sisuPerRaceGt
                    : t.newRallyModal.sisuPerStageDirt}
                </option>
                <option value="service_only">
                  {activeGame === 'gt'
                    ? t.newRallyModal.sisuPitOnlyGt
                    : t.newRallyModal.sisuAssistOnlyDirt}
                </option>
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-200">
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
            {t.newRallyModal.createEvent}
          </button>
        </div>
      </form>
    </div>
  );
}
