import { useRef, useState } from 'react';
import { Check, Copy, Download, FileSpreadsheet, FolderInput, Upload } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';
import {
  buildCsvExport,
  ImportedRallyPayload,
  parseCsvToRallyData,
} from '../services/csvSync';
import { GameId, PlayerGroup, RallySession } from '../types/rally';
import { ConfirmModal } from './ConfirmModal';

interface CsvSyncStudioProps {
  activeGame: GameId;
  groups: PlayerGroup[];
  sessions: RallySession[];
  onImportData: (groups: PlayerGroup[], sessions: RallySession[]) => void;
}

export function CsvSyncStudio({
  activeGame,
  groups,
  sessions,
  onImportData,
}: CsvSyncStudioProps) {
  const { locale, t } = useLocale();
  const [pasteCsvText, setPasteCsvText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [exportScope, setExportScope] = useState<'all' | 'active'>('all');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedCsv, setCopiedCsv] = useState(false);

  const [pendingImport, setPendingImport] = useState<{
    sourceLabel: string;
    payload: ImportedRallyPayload;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const dirtSessionsCount = sessions.filter((s) => (s.game || 'dirt') === 'dirt').length;
  const gtSessionsCount = sessions.filter((s) => s.game === 'gt').length;
  const targetSessions =
    exportScope === 'all'
      ? sessions
      : sessions.filter((s) => (s.game || 'dirt') === activeGame);
  const targetEntriesCount = targetSessions.reduce((acc, s) => acc + s.results.length, 0);

  const handleCsvFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const text = await file.text();
      const payload = parseCsvToRallyData(text, groups, sessions, locale);
      setPendingImport({
        sourceLabel: t.csv.sourceFileLabel(file.name),
        payload,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.csv.invalidFileErr);
    } finally {
      e.target.value = '';
    }
  };

  const handleParsePastedCsv = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const payload = parseCsvToRallyData(pasteCsvText, groups, sessions, locale);
      setPendingImport({
        sourceLabel: t.csv.sourcePastedLabel,
        payload,
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : t.csv.invalidFormatErr);
    }
  };

  const handleConfirmImport = () => {
    if (!pendingImport) return;
    const { payload, sourceLabel } = pendingImport;
    onImportData(payload.groups, payload.sessions);
    setSuccessMsg(
      t.csv.importSuccess(sourceLabel, payload.importedRowsCount, payload.importedSessionsCount)
    );
    setPendingImport(null);
    setPasteCsvText('');
    setShowPasteBox(false);
  };

  const handleDownloadCsv = () => {
    const csv = buildCsvExport(groups, targetSessions, locale);
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const suffix = exportScope === 'all' ? (locale === 'en' ? 'all' : 'complet') : activeGame;
    a.download = `rallyman-${suffix}-${locale}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCsv = async () => {
    const csv = buildCsvExport(groups, targetSessions, locale);
    await navigator.clipboard.writeText(csv);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  const activeGameName = activeGame === 'gt' ? 'Rallyman: GT' : 'Rallyman: DIRT';
  const activeGameCount = activeGame === 'gt' ? gtSessionsCount : dirtSessionsCount;

  return (
    <div className="space-y-6">
      {errorMsg && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 text-sm text-red-900">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900">
          {successMsg}
        </div>
      )}

      <section className="bg-white border border-slate-200 rounded-xl p-5 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">{t.csv.title}</h2>
            <p className="text-sm text-slate-600 mt-0.5">{t.csv.subtitle}</p>
          </div>
          <div className="text-xs font-mono-tabular text-slate-500 whitespace-nowrap">
            {t.csv.summaryCounts(groups.length, dirtSessionsCount, gtSessionsCount)}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setExportScope('all')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                exportScope === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.csv.exportAll(sessions.length)}
            </button>
            <button
              type="button"
              onClick={() => setExportScope('active')}
              className={`min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                exportScope === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t.csv.exportGameOnly(activeGameName, activeGameCount)}
            </button>
          </div>

          <span className="text-xs font-mono-tabular text-slate-500">
            {t.csv.rowsReady(targetEntriesCount)}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={targetEntriesCount === 0}
            className="min-h-[48px] px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{t.csv.downloadCsv}</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCsv}
            disabled={targetEntriesCount === 0}
            className="min-h-[48px] px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
          >
            {copiedCsv ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
            <span>{copiedCsv ? t.csv.copiedCsv : t.csv.copyCsv}</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[48px] px-4 py-2.5 text-sm font-semibold text-[#C83E2B] bg-red-50/70 border border-red-200 hover:bg-red-100 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Upload className="w-4 h-4" />
            <span>{t.csv.importCsv}</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleCsvFileSelected}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setShowPasteBox((v) => !v)}
            className="min-h-[48px] px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <FolderInput className="w-4 h-4" />
            <span>{t.csv.pasteCsv}</span>
          </button>
        </div>

        {showPasteBox && (
          <div className="pt-3 space-y-2.5 border-t border-slate-100">
            <label htmlFor="paste-csv-area" className="block text-xs font-semibold text-slate-700">
              {t.csv.pasteLabel}
            </label>
            <textarea
              id="paste-csv-area"
              rows={5}
              value={pasteCsvText}
              onChange={(e) => setPasteCsvText(e.target.value)}
              placeholder={t.csv.pastePlaceholder}
              className="w-full p-3 rounded-lg border border-slate-300 font-mono-tabular text-xs focus:outline-none focus:ring-2 focus:ring-[#C83E2B]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowPasteBox(false)}
                className="min-h-[40px] px-3.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {t.common.close}
              </button>
              <button
                type="button"
                onClick={handleParsePastedCsv}
                disabled={!pasteCsvText.trim()}
                className="min-h-[40px] px-4 text-xs font-semibold text-white bg-[#C83E2B] hover:bg-[#B03423] rounded-lg disabled:opacity-50"
              >
                {t.csv.analyzeImport}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <FileSpreadsheet className="w-4 h-4 text-[#15803D]" />
            <span>{t.csv.driveCardTitle}</span>
          </div>
          <ol className="text-sm text-slate-600 space-y-1.5 list-decimal list-inside leading-relaxed">
            <li>{t.csv.driveStep1}</li>
            <li>{t.csv.driveStep2}</li>
            <li>{t.csv.driveStep3}</li>
          </ol>
        </article>

        <article className="bg-white border border-slate-200 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
            <Upload className="w-4 h-4 text-[#C83E2B]" />
            <span>{t.csv.compatCardTitle}</span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{t.csv.compatCardDesc}</p>
        </article>
      </section>

      <ConfirmModal
        open={Boolean(pendingImport)}
        title={t.csv.confirmTitle}
        description={t.csv.confirmDesc(pendingImport?.sourceLabel || '')}
        details={
          pendingImport
            ? [
                t.csv.confirmRowCount(pendingImport.payload.importedRowsCount),
                t.csv.confirmGroupCount(pendingImport.payload.importedGroupsCount),
                t.csv.confirmSessionCount(pendingImport.payload.importedSessionsCount),
              ]
            : []
        }
        confirmLabel={t.csv.confirmBtn}
        onConfirm={handleConfirmImport}
        onCancel={() => setPendingImport(null)}
      />
    </div>
  );
}
