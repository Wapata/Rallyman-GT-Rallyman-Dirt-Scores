import { CheckCircle2, FileSpreadsheet, Layers, Smartphone, Trophy } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

export function ArchitectureGuideView() {
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
        <h2 className="font-display text-2xl font-bold text-slate-900">{t.guide.title}</h2>
        <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">{t.guide.intro}</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Smartphone className="w-4 h-4 text-[#C83E2B]" />
            <span>{t.guide.card1Title}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.guide.card1Desc}</p>
        </article>

        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <FileSpreadsheet className="w-4 h-4 text-[#15803D]" />
            <span>{t.guide.card2Title}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.guide.card2Desc}</p>
        </article>

        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Layers className="w-4 h-4 text-slate-800" />
            <span>{t.guide.card3Title}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.guide.card3Desc}</p>
        </article>

        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>{t.guide.card4Title}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.guide.card4Desc}</p>
        </article>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <h3 className="font-display text-xl font-bold text-slate-900">{t.guide.rulesTitle}</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-sm text-slate-600">
          <div className="space-y-2.5">
            <div className="font-semibold text-slate-900">{t.guide.dirtHeading}</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t.guide.dirtBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t.guide.dirtBullet2}</span>
              </li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <div className="font-semibold text-slate-900">{t.guide.gtHeading}</div>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t.guide.gtBullet1}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>{t.guide.gtBullet2}</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
