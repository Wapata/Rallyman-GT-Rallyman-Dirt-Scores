import { useEffect, useState } from 'react';
import { Flag, Play, Wrench } from 'lucide-react';
import { getOfficialGtEvents } from '../data/officialGt';
import { getOfficialRallies } from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import {
  DirtExtensionId,
  GameId,
  GtExtensionId,
  RallyTemplate,
} from '../types/rally';
import { formatModeLabel } from '../utils/time';

interface RalliesLibraryViewProps {
  activeGame: GameId;
  activeGroupName: string;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  onSelectGame: (game: GameId) => void;
  onStartOfficialEvent: (template: RallyTemplate) => void;
}

type DirtCategoryFilter = 'all' | 'rally' | 'hillclimb' | 'rx_all';
type GtCategoryFilter = 'all' | 'base' | 'championship' | 'team_challenge' | 'world_tour';

export function RalliesLibraryView({
  activeGame,
  activeGroupName,
  dirtExtensions,
  gtExtensions,
  onSelectGame,
  onStartOfficialEvent,
}: RalliesLibraryViewProps) {
  const { locale, t } = useLocale();
  const [dirtFilter, setDirtFilter] = useState<DirtCategoryFilter>('all');
  const [gtFilter, setGtFilter] = useState<GtCategoryFilter>('all');

  useEffect(() => {
    setDirtFilter('all');
    setGtFilter('all');
  }, [activeGame]);

  const officialGt = getOfficialGtEvents(locale);
  const officialDirt = getOfficialRallies(locale);

  const templates =
    activeGame === 'gt'
      ? officialGt.filter((r) => {
          if (gtFilter === 'all') return true;
          return r.category === gtFilter;
        })
      : officialDirt.filter((r) => {
          if (dirtFilter === 'all') return true;
          if (dirtFilter === 'rally') return r.mode === 'rally';
          if (dirtFilter === 'hillclimb') return r.mode === 'hillclimb';
          return r.mode === 'rx' || r.mode === 'autotour';
        });

  const activeExtsList: string[] = activeGame === 'gt' ? gtExtensions : dirtExtensions;
  const activeGameName = activeGame === 'gt' ? 'Rallyman: GT' : 'Rallyman: DIRT';

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">
              {t.library.title(activeGameName)}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {activeGame === 'gt' ? t.library.subtitleGt : t.library.subtitleDirt}
            </p>
          </div>
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap">
            {t.library.targetGroup}{' '}
            <strong className="text-slate-900">{activeGroupName}</strong>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Game Switcher */}
          <div className="inline-flex items-center p-1 bg-slate-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => onSelectGame('dirt')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                activeGame === 'dirt' ? 'bg-[#C83E2B] text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Rallyman: DIRT
            </button>
            <button
              type="button"
              onClick={() => onSelectGame('gt')}
              className={`min-h-[36px] px-3.5 py-1.5 text-xs font-bold rounded-md transition-colors whitespace-nowrap ${
                activeGame === 'gt' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Rallyman: GT
            </button>
          </div>

          {/* Category Filters */}
          {activeGame === 'gt' ? (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
              {(
                [
                  { id: 'all', label: t.library.allCount(officialGt.length) },
                  { id: 'base', label: t.library.gtBaseFilter },
                  { id: 'championship', label: 'Championship' },
                  { id: 'team_challenge', label: 'Team Challenge' },
                  { id: 'world_tour', label: 'World Tour' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setGtFilter(tab.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    gtFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg w-fit">
              {(
                [
                  { id: 'all', label: t.library.allCount(officialDirt.length) },
                  { id: 'rally', label: t.library.dirtRallyFilter },
                  { id: 'hillclimb', label: t.library.dirtClimbFilter },
                  { id: 'rx_all', label: t.library.dirtRxFilter },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDirtFilter(tab.id)}
                  className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    dirtFilter === tab.id
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((event) => {
          const missingExts = event.requiredExtensions.filter(
            (ext) => !activeExtsList.includes(ext)
          );

          return (
            <article
              key={event.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-xl font-bold text-slate-900">{event.name}</h3>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {formatModeLabel(event.mode, locale)} · {t.library.byAuthor(event.author)} ·{' '}
                      {event.durationHint}
                    </div>
                  </div>
                  <Flag className="w-5 h-5 text-slate-400 shrink-0" />
                </div>

                {missingExts.length > 0 && (
                  <div className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5">
                    {t.library.missingExtNotice(missingExts.map((e) => e.toUpperCase()).join(', '))}
                  </div>
                )}

                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {event.stages.map((st) => (
                    <div key={st.code} className="py-2.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-900">
                          {st.code} · {st.name}
                          {st.stageType === 'rx_race' ? t.library.confrontationTag : ''}
                          {st.tiles ? ` · ${t.common.tilesCount(st.tiles.length)}` : ''}
                        </span>
                        {activeGame === 'gt' ? (
                          <span className="text-slate-500">
                            {st.laps ? t.common.lapsCount(st.laps) : t.library.circuitWord}
                          </span>
                        ) : st.hasServiceTent && event.mode !== 'hillclimb' ? (
                          <span className="text-emerald-700 font-medium flex items-center gap-1">
                            <Wrench className="w-3.5 h-3.5" />
                            <span>{t.library.assistanceWord}</span>
                          </span>
                        ) : event.mode === 'hillclimb' ? (
                          <span className="text-slate-500">{t.library.hillclimbReset}</span>
                        ) : (
                          <span className="text-slate-400">{t.library.noAssistanceWord}</span>
                        )}
                      </div>
                      {st.tiles && (
                        <p className="font-mono-tabular text-[11px] text-slate-500 leading-relaxed">
                          {st.tiles.join(' · ')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onStartOfficialEvent(event)}
                className="min-h-[44px] w-full px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>{t.library.launchFor(activeGroupName)}</span>
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
