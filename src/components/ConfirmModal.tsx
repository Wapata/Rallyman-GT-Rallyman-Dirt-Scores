import { AlertTriangle, X } from 'lucide-react';
import { useLocale } from '../i18n/LocaleContext';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  details?: string[];
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  open,
  title,
  description,
  details = [],
  confirmLabel,
  cancelLabel,
  tone = 'primary',
  busy = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const { t } = useLocale();
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle
              className={`w-5 h-5 shrink-0 ${
                tone === 'danger' ? 'text-[#C83E2B]' : 'text-amber-600'
              }`}
            />
            <h2 id="confirm-modal-title" className="text-base font-semibold text-slate-900">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-3 text-sm text-slate-600">
          <p className="leading-relaxed text-slate-700">{description}</p>
          {details.length > 0 && (
            <ul className="space-y-1.5 bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
              {details.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-slate-400 select-none">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="min-h-[44px] px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors whitespace-nowrap"
          >
            {cancelLabel || t.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`min-h-[44px] px-5 py-2 text-sm font-semibold text-white rounded-lg transition-colors whitespace-nowrap ${
              tone === 'danger'
                ? 'bg-[#C83E2B] hover:bg-[#B03423]'
                : 'bg-slate-900 hover:bg-slate-800'
            } disabled:opacity-60`}
          >
            {busy ? t.common.processing : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
