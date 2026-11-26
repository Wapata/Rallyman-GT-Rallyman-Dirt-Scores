import { useEffect, useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
import { getGtCarSpecs } from '../data/officialGt';
import {
  CAR_COLORS,
  formatDiceSummary,
  getCarColorLabel,
  getDirtCarSpecs,
} from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import {
  CarClass,
  CarColor,
  DirtExtensionId,
  GameId,
  GtCarClass,
  GtExtensionId,
  GtTireCompound,
  PlayerGroup,
  PlayerProfile,
  TireCompound,
} from '../types/rally';

interface GroupModalProps {
  open: boolean;
  activeGame: GameId;
  initialGroup: PlayerGroup | null;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  onSave: (group: PlayerGroup) => void;
  onClose: () => void;
}

export function GroupModal({
  open,
  activeGame,
  initialGroup,
  dirtExtensions,
  gtExtensions,
  onSave,
  onClose,
}: GroupModalProps) {
  const { locale, t } = useLocale();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [players, setPlayers] = useState<PlayerProfile[]>([]);

  useEffect(() => {
    if (!open) return;
    if (initialGroup) {
      setName(initialGroup.name);
      setDescription(initialGroup.description);
      setPlayers(
        initialGroup.players.map((p) => ({
          ...p,
          tireCompound: p.tireCompound || 'standard',
          gtCarClass: p.gtCarClass || 'GT6',
          gtTireCompound: p.gtTireCompound || 'asphalt',
        }))
      );
    } else {
      setName('');
      setDescription('');
      setPlayers([
        {
          id: `p-${Date.now()}-1`,
          name: t.groupModal.defaultDriverName(1),
          color: 'Rouge',
          carClass: 'R6',
          tireCompound: 'standard',
          gtCarClass: 'GT6',
          gtTireCompound: 'asphalt',
        },
        {
          id: `p-${Date.now()}-2`,
          name: t.groupModal.defaultDriverName(2),
          color: 'Bleu',
          carClass: 'R6',
          tireCompound: 'standard',
          gtCarClass: 'GT6',
          gtTireCompound: 'asphalt',
        },
      ]);
    }
  }, [open, initialGroup, t.groupModal]);

  if (!open) return null;

  const isGt = activeGame === 'gt';
  const hasTeamChallenge = gtExtensions.includes('team_challenge');
  const hasChampionship = gtExtensions.includes('championship');
  const hasAdrenaline = gtExtensions.includes('adrenaline');
  const has110 = dirtExtensions.includes('110');
  const hasCopilot = dirtExtensions.includes('copilot');
  const hasRx = dirtExtensions.includes('rx');

  const dirtSpecs = getDirtCarSpecs(locale);
  const gtSpecs = getGtCarSpecs(locale);

  const maxPlayers =
    isGt && (hasTeamChallenge || (initialGroup?.players.length ?? 0) > 6) ? 12 : 6;

  const handleAddPlayer = () => {
    if (players.length >= maxPlayers) return;
    const usedColors = new Set(players.map((p) => p.color));
    const nextColor =
      CAR_COLORS.find((c) => !usedColors.has(c.label))?.label ||
      CAR_COLORS[players.length % CAR_COLORS.length].label;
    setPlayers((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}-${prev.length + 1}`,
        name: t.groupModal.defaultDriverName(prev.length + 1),
        color: nextColor,
        carClass: 'R6',
        tireCompound: 'standard',
        gtCarClass: 'GT6',
        gtTireCompound: 'asphalt',
      },
    ]);
  };

  const handleUpdatePlayer = (idx: number, patch: Partial<PlayerProfile>) => {
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const handleRemovePlayer = (idx: number) => {
    if (players.length <= 1) return;
    setPlayers((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedPlayers = players
      .map((p, idx) => ({
        ...p,
        name: p.name.trim() || t.groupModal.defaultDriverName(idx + 1),
        tireCompound: p.tireCompound || 'standard',
        gtCarClass: p.gtCarClass || 'GT6',
        gtTireCompound: p.gtTireCompound || 'asphalt',
        teamName: p.teamName?.trim() || undefined,
      }))
      .slice(0, maxPlayers);

    onSave({
      id: initialGroup?.id || `group-${Date.now()}`,
      name: name.trim() || t.groupModal.defaultGroupName,
      description: description.trim(),
      players: cleanedPlayers,
      createdAt: initialGroup?.createdAt || new Date().toISOString().slice(0, 10),
    });
  };

  const activeGameName = isGt ? 'Rallyman: GT' : 'Rallyman: DIRT';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="group-modal-title"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full sm:max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-t-2xl sm:rounded-xl border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div>
            <h2 id="group-modal-title" className="font-display text-xl font-bold text-slate-900">
              {initialGroup ? t.groupModal.editTitle : t.groupModal.newTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.groupModal.activeConfig(activeGameName, isGt && hasTeamChallenge)}
            </p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.groupModal.groupNameLabel}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.groupModal.groupNamePlaceholder}
                className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.groupModal.noteLabel}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.groupModal.notePlaceholder}
                className="w-full min-h-[44px] px-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                {t.groupModal.carsDriversLabel(isGt && hasTeamChallenge, players.length, maxPlayers)}
              </span>
              {players.length < maxPlayers && (
                <button
                  type="button"
                  onClick={handleAddPlayer}
                  className="min-h-[36px] px-3 text-xs font-semibold text-[#C83E2B] hover:bg-red-50 rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {isGt && hasTeamChallenge ? t.groupModal.addCar : t.groupModal.addDriver}
                  </span>
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {players.map((p, idx) => {
                const dirtSpec = dirtSpecs[p.carClass] || dirtSpecs.R6;
                const gtSpec = gtSpecs[p.gtCarClass || 'GT6'] || gtSpecs.GT6;

                const availableDirtClasses = Object.values(dirtSpecs).filter(
                  (c) =>
                    !c.requiredExtension ||
                    dirtExtensions.includes(c.requiredExtension) ||
                    c.code === p.carClass
                );

                const hasGt4OrGt5 = gtExtensions.includes('gt4') || gtExtensions.includes('gt5');
                const availableGtClasses = Object.values(gtSpecs).filter((c) => {
                  if (c.code === p.gtCarClass) return true;
                  if (c.code === 'GT6_BOP') return hasGt4OrGt5;
                  return !c.requiredExtension || gtExtensions.includes(c.requiredExtension);
                });

                const showDirtTireSelect =
                  has110 ||
                  hasCopilot ||
                  hasRx ||
                  (p.tireCompound && p.tireCompound !== 'standard');

                return (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2"
                  >
                    <div className="grid grid-cols-12 gap-2 items-center">
                      <input
                        type="text"
                        value={p.name}
                        onChange={(e) => handleUpdatePlayer(idx, { name: e.target.value })}
                        placeholder={t.groupModal.driverPlaceholder(idx + 1)}
                        className="col-span-12 sm:col-span-4 min-h-[40px] px-2.5 rounded-md border border-slate-300 bg-white text-sm"
                      />
                      <select
                        value={p.color}
                        onChange={(e) =>
                          handleUpdatePlayer(idx, { color: e.target.value as CarColor })
                        }
                        className="col-span-4 sm:col-span-2 min-h-[40px] px-2 rounded-md border border-slate-300 bg-white text-xs font-medium"
                      >
                        {CAR_COLORS.map((c) => (
                          <option key={c.label} value={c.label}>
                            {getCarColorLabel(c.label, locale)}
                          </option>
                        ))}
                      </select>

                      {isGt ? (
                        <>
                          <select
                            value={p.gtCarClass || 'GT6'}
                            onChange={(e) =>
                              handleUpdatePlayer(idx, {
                                gtCarClass: e.target.value as GtCarClass,
                              })
                            }
                            className="col-span-7 sm:col-span-3 min-h-[40px] px-2 rounded-md border border-slate-300 bg-white text-xs font-medium"
                          >
                            {availableGtClasses.map((c) => (
                              <option key={c.code} value={c.code}>
                                {c.code.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                          <select
                            value={p.gtTireCompound || 'asphalt'}
                            onChange={(e) =>
                              handleUpdatePlayer(idx, {
                                gtTireCompound: e.target.value as GtTireCompound,
                              })
                            }
                            className="col-span-10 sm:col-span-2 min-h-[40px] px-2 rounded-md border border-slate-300 bg-white text-xs font-medium"
                          >
                            <option value="asphalt">{t.groupModal.tireAsphalt}</option>
                            <option value="rain">{t.groupModal.tireRain}</option>
                            {(hasAdrenaline || p.gtTireCompound === 'soft') && (
                              <option value="soft">{t.groupModal.tireSoft}</option>
                            )}
                          </select>
                        </>
                      ) : (
                        <>
                          <select
                            value={p.carClass}
                            onChange={(e) =>
                              handleUpdatePlayer(idx, { carClass: e.target.value as CarClass })
                            }
                            className="col-span-7 sm:col-span-3 min-h-[40px] px-2 rounded-md border border-slate-300 bg-white text-xs font-medium"
                          >
                            {availableDirtClasses.map((c) => {
                              const extLocked =
                                c.requiredExtension &&
                                !dirtExtensions.includes(c.requiredExtension);
                              return (
                                <option key={c.code} value={c.code}>
                                  {c.code}
                                  {extLocked ? t.groupModal.extOff : ''}
                                </option>
                              );
                            })}
                          </select>
                          {showDirtTireSelect ? (
                            <select
                              value={p.tireCompound || 'standard'}
                              onChange={(e) =>
                                handleUpdatePlayer(idx, {
                                  tireCompound: e.target.value as TireCompound,
                                })
                              }
                              className="col-span-10 sm:col-span-2 min-h-[40px] px-2 rounded-md border border-slate-300 bg-white text-xs font-medium"
                            >
                              <option value="standard">{t.groupModal.tireDirtStd}</option>
                              {(has110 || p.tireCompound === 'asphalt') && (
                                <option value="asphalt">{t.groupModal.tireDirtAsphalt}</option>
                              )}
                              {(has110 || p.tireCompound === 'snow') && (
                                <option value="snow">{t.groupModal.tireDirtSnow}</option>
                              )}
                              {(hasCopilot || p.tireCompound === 'soft') && (
                                <option value="soft">{t.groupModal.tireSoft}</option>
                              )}
                              {(hasRx || p.tireCompound === 'rain') && (
                                <option value="rain">{t.groupModal.tireDirtRain}</option>
                              )}
                            </select>
                          ) : (
                            <div className="hidden sm:block sm:col-span-2 text-[11px] text-slate-400 px-1 truncate">
                              {t.groupModal.tireDirtStd}
                            </div>
                          )}
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemovePlayer(idx)}
                        disabled={players.length <= 1}
                        className="col-span-2 sm:col-span-1 min-h-[40px] flex items-center justify-center text-slate-400 hover:text-[#C83E2B] disabled:opacity-30"
                        aria-label={t.groupModal.removeDriverAria}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 px-0.5">
                      {isGt ? (
                        <span className="font-mono-tabular">
                          {formatDiceSummary(gtSpec, locale, true)} ·{' '}
                          {t.groupModal.maxGearLabel(gtSpec.maxGear)}
                        </span>
                      ) : (
                        <span className="font-mono-tabular">
                          {formatDiceSummary(dirtSpec, locale, true)} · {dirtSpec.surfaceNote}
                        </span>
                      )}

                      {isGt && (hasChampionship || hasTeamChallenge || p.teamName) && (
                        <input
                          type="text"
                          value={p.teamName || ''}
                          onChange={(e) => handleUpdatePlayer(idx, { teamName: e.target.value })}
                          placeholder={t.groupModal.teamPlaceholder}
                          className="min-h-[30px] px-2 rounded border border-slate-300 bg-white text-[11px] text-slate-800 w-full sm:w-52"
                        />
                      )}

                      {!isGt && p.carClass === 'Unlimited' && (
                        <input
                          type="text"
                          value={p.unlimitedNote || ''}
                          onChange={(e) =>
                            handleUpdatePlayer(idx, { unlimitedNote: e.target.value })
                          }
                          placeholder={t.groupModal.unlimitedPlaceholder}
                          className="min-h-[30px] px-2 rounded border border-slate-300 bg-white text-[11px] text-slate-800 w-full sm:w-52"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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
            className="min-h-[44px] px-5 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
          >
            {t.groupModal.saveGroup}
          </button>
        </div>
      </form>
    </div>
  );
}
