import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { getGtCarSpecs, getGtExtensionsCatalog } from '../data/officialGt';
import {
  formatDiceSummary,
  getDirtCarSpecs,
  getDirtExtensionsCatalog,
} from '../data/officialRallies';
import { useLocale } from '../i18n/LocaleContext';
import { DirtExtensionId, GameId, GtExtensionId } from '../types/rally';

interface GameExtensionsBarProps {
  activeGame: GameId;
  dirtExtensions: DirtExtensionId[];
  gtExtensions: GtExtensionId[];
  onSelectGame: (game: GameId) => void;
  onToggleDirtExtension: (id: DirtExtensionId) => void;
  onToggleGtExtension: (id: GtExtensionId) => void;
}

export function GameExtensionsBar({
  activeGame,
  dirtExtensions,
  gtExtensions,
  onSelectGame,
  onToggleDirtExtension,
  onToggleGtExtension,
}: GameExtensionsBarProps) {
  const { locale, t } = useLocale();
  const [showDashboards, setShowDashboards] = useState(false);

  const dirtCatalog = getDirtExtensionsCatalog(locale);
  const gtCatalog = getGtExtensionsCatalog(locale);
  const dirtSpecs = getDirtCarSpecs(locale);
  const gtSpecs = getGtCarSpecs(locale);

  const unlockedDirtSpecs = Object.values(dirtSpecs).filter(
    (spec) => !spec.requiredExtension || dirtExtensions.includes(spec.requiredExtension)
  );
  const unlockedGtSpecs = Object.values(gtSpecs).filter(
    (spec) => !spec.requiredExtension || gtExtensions.includes(spec.requiredExtension)
  );

  const specsCount = activeGame === 'dirt' ? unlockedDirtSpecs.length : unlockedGtSpecs.length;

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Game Switcher: Rallyman: DIRT vs Rallyman: GT */}
        <div
          className="inline-flex items-center p-1 bg-slate-100 rounded-lg shrink-0 self-start lg:self-auto"
          role="tablist"
          aria-label={t.extensions.gameSelectAria}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeGame === 'dirt'}
            onClick={() => onSelectGame('dirt')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors whitespace-nowrap ${
              activeGame === 'dirt'
                ? 'bg-[#C83E2B] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rallyman: DIRT
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeGame === 'gt'}
            onClick={() => onSelectGame('gt')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-md text-xs font-bold tracking-wide transition-colors whitespace-nowrap ${
              activeGame === 'gt'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rallyman: GT
          </button>
        </div>

        {/* Extensions for Selected Game */}
        <div className="flex flex-wrap items-center gap-1.5 flex-1">
          <span className="min-h-[36px] px-3 py-1.5 rounded-md border border-slate-300 bg-slate-100 text-xs font-semibold text-slate-800 inline-flex items-center whitespace-nowrap">
            {activeGame === 'dirt' ? t.extensions.dirtBase : t.extensions.gtBase}
          </span>

          {activeGame === 'dirt'
            ? dirtCatalog.map((ext) => {
                const isActive = dirtExtensions.includes(ext.id);
                return (
                  <button
                    key={ext.id}
                    type="button"
                    onClick={() => onToggleDirtExtension(ext.id)}
                    aria-pressed={isActive}
                    title={ext.summary}
                    className={`min-h-[36px] px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-[#C83E2B] bg-red-50 text-[#C83E2B]'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive ? '✓ ' : '+ '}
                    {ext.name}
                  </button>
                );
              })
            : gtCatalog.map((ext) => {
                const isActive = gtExtensions.includes(ext.id);
                return (
                  <button
                    key={ext.id}
                    type="button"
                    onClick={() => onToggleGtExtension(ext.id)}
                    aria-pressed={isActive}
                    title={ext.summary}
                    className={`min-h-[36px] px-3 py-1.5 rounded-md border text-xs font-semibold transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-slate-900 bg-slate-900/5 text-slate-900'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {isActive ? '✓ ' : '+ '}
                    {ext.name}
                  </button>
                );
              })}
        </div>

        <button
          type="button"
          onClick={() => setShowDashboards((v) => !v)}
          className="min-h-[36px] px-3 py-1.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-1.5 self-start lg:self-auto whitespace-nowrap"
        >
          <span>{t.extensions.activeDashboards(specsCount)}</span>
          {showDashboards ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {showDashboards && (
        <div className="pt-3 border-t border-slate-100 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {activeGame === 'dirt'
              ? unlockedDirtSpecs.map((spec) => (
                  <div
                    key={spec.code}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">{spec.code}</span>
                      <span className="font-mono-tabular text-[11px] font-semibold text-slate-700">
                        {formatDiceSummary(spec, locale, true)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{spec.surfaceNote}</p>
                  </div>
                ))
              : unlockedGtSpecs.map((spec) => (
                  <div
                    key={spec.code}
                    className="p-3 rounded-lg border border-slate-200 bg-slate-50/70 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {spec.code.replace('_', ' ')}
                      </span>
                      <span className="font-mono-tabular text-[11px] font-semibold text-slate-700">
                        {formatDiceSummary(spec, locale, true)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-snug">{spec.surfaceNote}</p>
                  </div>
                ))}
          </div>
          {activeGame === 'dirt' && dirtExtensions.includes('110') && (
            <p className="text-[11px] text-slate-600">{t.extensions.expansion110Note}</p>
          )}
          {activeGame === 'gt' && gtExtensions.includes('adrenaline') && (
            <p className="text-[11px] text-slate-600">{t.extensions.adrenalineNote}</p>
          )}
        </div>
      )}
    </section>
  );
}
