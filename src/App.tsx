import { useEffect, useMemo, useState } from 'react';
import { BookOpen, FileSpreadsheet, Flag, Globe, Timer } from 'lucide-react';
import { ArchitectureGuideView } from './components/ArchitectureGuideView';
import { CsvSyncStudio } from './components/CsvSyncStudio';
import { GroupModal } from './components/GroupModal';
import { NewRallyModal } from './components/NewRallyModal';
import { RalliesLibraryView } from './components/RalliesLibraryView';
import { TrackerView } from './components/TrackerView';
import { INITIAL_GT_SESSIONS } from './data/officialGt';
import { INITIAL_GROUPS, INITIAL_SESSIONS } from './data/officialRallies';
import { useLocale } from './i18n/LocaleContext';
import {
  AppTab,
  DirtExtensionId,
  GameId,
  GtExtensionId,
  PlayerGroup,
  RallySession,
  RallyTemplate,
  StageResult,
} from './types/rally';
import { normalizeDamages } from './utils/time';

const STORAGE_GROUPS_KEY = 'rallyman_dirt_groups_v1';
const STORAGE_SESSIONS_KEY = 'rallyman_dirt_sessions_v1';
const STORAGE_ACTIVE_GAME_KEY = 'rallyman_active_game_v1';
const STORAGE_DIRT_EXTENSIONS_KEY = 'rallyman_dirt_extensions_v1';
const STORAGE_GT_EXTENSIONS_KEY = 'rallyman_gt_extensions_v1';
const STORAGE_GT_SEEDED_KEY = 'rallyman_gt_seeded_v1';
const STORAGE_110_SEEDED_KEY = 'rallyman_110_seeded_v1';

function loadStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function loadDirtExtensions(): DirtExtensionId[] {
  const defaultExts: DirtExtensionId[] = ['r4', 'r5', '110', 'climb', 'copilot', 'rx'];
  const stored = loadStored<DirtExtensionId[]>(STORAGE_DIRT_EXTENSIONS_KEY, defaultExts);
  try {
    if (!localStorage.getItem(STORAGE_110_SEEDED_KEY)) {
      localStorage.setItem(STORAGE_110_SEEDED_KEY, '1');
      if (!stored.includes('110')) {
        return [...stored, '110'];
      }
    }
  } catch {
    // ignore storage quota errors
  }
  return stored;
}

function migrateStoredGroups(rawGroups: PlayerGroup[]): PlayerGroup[] {
  return rawGroups.map((g) => ({
    ...g,
    players: (g.players || []).map((p) => ({
      ...p,
      tireCompound: p.tireCompound || 'standard',
      gtCarClass: p.gtCarClass || 'GT6',
      gtTireCompound: p.gtTireCompound || 'asphalt',
    })),
  }));
}

function migrateStoredSessions(rawSessions: RallySession[], seedGtIfNeeded = false): RallySession[] {
  const migrated = rawSessions.map((s) => ({
    ...s,
    game: s.game || (s.mode?.startsWith('gt_') ? 'gt' : 'dirt'),
    mode: s.mode || 'rally',
    stages: (s.stages || []).map((st) => ({
      ...st,
      stageType: st.stageType || 'special',
    })),
    results: (s.results || []).map((r) => ({
      ...r,
      damages: normalizeDamages(r.damages),
    })),
  }));

  if (seedGtIfNeeded && !migrated.some((s) => s.game === 'gt')) {
    try {
      const alreadySeeded = localStorage.getItem(STORAGE_GT_SEEDED_KEY);
      if (!alreadySeeded) {
        localStorage.setItem(STORAGE_GT_SEEDED_KEY, '1');
        return [...migrated, ...INITIAL_GT_SESSIONS];
      }
    } catch {
      return [...migrated, ...INITIAL_GT_SESSIONS];
    }
  }
  return migrated;
}

export default function App() {
  const { locale, setLocale, t } = useLocale();
  const [activeTab, setActiveTab] = useState<AppTab>('tracker');
  const [activeGame, setActiveGame] = useState<GameId>(() =>
    loadStored<GameId>(STORAGE_ACTIVE_GAME_KEY, 'dirt')
  );
  const [dirtExtensions, setDirtExtensions] = useState<DirtExtensionId[]>(loadDirtExtensions);
  const [gtExtensions, setGtExtensions] = useState<GtExtensionId[]>(() =>
    loadStored<GtExtensionId[]>(STORAGE_GT_EXTENSIONS_KEY, [
      'gt4',
      'gt5',
      'adrenaline',
      'championship',
      'team_challenge',
      'world_tour',
    ])
  );
  const [groups, setGroups] = useState<PlayerGroup[]>(() =>
    migrateStoredGroups(loadStored(STORAGE_GROUPS_KEY, INITIAL_GROUPS))
  );
  const [sessions, setSessions] = useState<RallySession[]>(() =>
    migrateStoredSessions(
      loadStored(STORAGE_SESSIONS_KEY, [...INITIAL_SESSIONS, ...INITIAL_GT_SESSIONS]),
      true
    )
  );

  const [activeGroupId, setActiveGroupId] = useState<string>(
    () => groups[0]?.id || INITIAL_GROUPS[0].id
  );
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const match = sessions.find(
      (s) => s.groupId === (groups[0]?.id || INITIAL_GROUPS[0].id) && (s.game || 'dirt') === activeGame
    );
    return match?.id || sessions[0]?.id || '';
  });

  // Modals
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<PlayerGroup | null>(null);
  const [newRallyModalOpen, setNewRallyModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_GAME_KEY, JSON.stringify(activeGame));
    } catch {
      // ignore storage quota errors
    }
  }, [activeGame]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_DIRT_EXTENSIONS_KEY, JSON.stringify(dirtExtensions));
    } catch {
      // ignore storage quota errors
    }
  }, [dirtExtensions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GT_EXTENSIONS_KEY, JSON.stringify(gtExtensions));
    } catch {
      // ignore storage quota errors
    }
  }, [gtExtensions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(groups));
    } catch {
      // ignore storage quota errors
    }
  }, [groups]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SESSIONS_KEY, JSON.stringify(sessions));
    } catch {
      // ignore storage quota errors
    }
  }, [sessions]);

  const handleSelectGame = (nextGame: GameId) => {
    setActiveGame(nextGame);
    const matching =
      sessions.find((s) => s.groupId === activeGroupId && (s.game || 'dirt') === nextGame) ||
      sessions.find((s) => (s.game || 'dirt') === nextGame);
    if (matching) {
      setActiveSessionId(matching.id);
    }
  };

  const handleToggleDirtExtension = (id: DirtExtensionId) => {
    setDirtExtensions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleGtExtension = (id: GtExtensionId) => {
    setGtExtensions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleEnsureDirtExtensions = (exts: DirtExtensionId[]) => {
    if (exts.length === 0) return;
    setDirtExtensions((prev) => Array.from(new Set([...prev, ...exts])));
  };

  const handleEnsureGtExtensions = (exts: GtExtensionId[]) => {
    if (exts.length === 0) return;
    setGtExtensions((prev) => Array.from(new Set([...prev, ...exts])));
  };

  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    const firstForGroup =
      sessions.find((s) => s.groupId === groupId && (s.game || 'dirt') === activeGame) ||
      sessions.find((s) => s.groupId === groupId);
    if (firstForGroup) {
      setActiveSessionId(firstForGroup.id);
    }
  };

  const handleSaveGroup = (group: PlayerGroup) => {
    setGroups((prev) => {
      const exists = prev.some((g) => g.id === group.id);
      return exists ? prev.map((g) => (g.id === group.id ? group : g)) : [...prev, group];
    });
    setActiveGroupId(group.id);
    setGroupModalOpen(false);
    setEditingGroup(null);
  };

  const handleCreateSession = (session: RallySession) => {
    const nextGame: GameId = session.game || (session.mode.startsWith('gt_') ? 'gt' : 'dirt');
    setSessions((prev) => [{ ...session, game: nextGame }, ...prev]);
    setActiveGame(nextGame);
    setActiveGroupId(session.groupId);
    setActiveSessionId(session.id);
    setNewRallyModalOpen(false);
    setActiveTab('tracker');
  };

  const handleStartOfficialEvent = (template: RallyTemplate) => {
    const targetGroupId = groups.some((g) => g.id === activeGroupId)
      ? activeGroupId
      : groups[0]?.id;
    if (!targetGroupId) return;
    const templateGame: GameId = template.game || (template.mode.startsWith('gt_') ? 'gt' : 'dirt');

    if (template.requiredExtensions.length > 0) {
      if (templateGame === 'gt') {
        handleEnsureGtExtensions(template.requiredExtensions as GtExtensionId[]);
      } else {
        handleEnsureDirtExtensions(template.requiredExtensions as DirtExtensionId[]);
      }
    }

    const created: RallySession = {
      id: `session-${Date.now()}`,
      game: templateGame,
      groupId: targetGroupId,
      rallyName: template.name,
      date: new Date().toISOString().slice(0, 10),
      mode: template.mode,
      sisuRule: 'per_rally',
      stages: template.stages.map((s) => ({ ...s })),
      results: [],
      status: 'active',
    };
    handleCreateSession(created);
  };

  const handleSaveStageResult = (sessionId: string, result: StageResult) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        const filtered = session.results.filter(
          (r) => !(r.stageCode === result.stageCode && r.playerId === result.playerId)
        );
        return { ...session, results: [...filtered, result] };
      })
    );
  };

  const handleDeleteStageResult = (sessionId: string, resultId: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        return { ...session, results: session.results.filter((r) => r.id !== resultId) };
      })
    );
  };

  const handleApplyServiceTent = (sessionId: string, stageCode: string) => {
    setSessions((prev) =>
      prev.map((session) => {
        if (session.id !== sessionId) return session;
        return {
          ...session,
          results: session.results.map((r) =>
            r.stageCode === stageCode
              ? {
                  ...r,
                  serviceApplied: true,
                  spareTireAvailable: true,
                  tireWearTurn: r.tireWearTurn !== undefined ? 1 : undefined,
                }
              : r
          ),
        };
      })
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (activeSessionId === sessionId) {
        const next =
          remaining.find((s) => s.groupId === activeGroupId && (s.game || 'dirt') === activeGame) ||
          remaining.find((s) => (s.game || 'dirt') === activeGame) ||
          remaining[0];
        setActiveSessionId(next?.id || '');
      }
      return remaining;
    });
  };

  const activeGroupName = useMemo(
    () => groups.find((g) => g.id === activeGroupId)?.name || groups[0]?.name || t.tracker.groupLabel,
    [groups, activeGroupId, t.tracker.groupLabel]
  );

  const handleImportData = (nextGroups: PlayerGroup[], nextSessions: RallySession[]) => {
    const migratedGroups = migrateStoredGroups(nextGroups);
    const migratedSessions = migrateStoredSessions(nextSessions);
    setGroups(migratedGroups);
    setSessions(migratedSessions);
    if (migratedSessions[0]) {
      setActiveGame(migratedSessions[0].game || 'dirt');
      setActiveGroupId(migratedSessions[0].groupId);
      setActiveSessionId(migratedSessions[0].id);
    } else if (migratedGroups[0]) {
      setActiveGroupId(migratedGroups[0].id);
    }
  };

  const navItems: { id: AppTab; label: string; mobileLabel: string; icon: typeof Timer }[] = [
    { id: 'tracker', label: t.nav.tracker, mobileLabel: t.nav.trackerMobile, icon: Timer },
    { id: 'sheets', label: t.nav.csv, mobileLabel: t.nav.csvMobile, icon: FileSpreadsheet },
    { id: 'rallies', label: t.nav.events, mobileLabel: t.nav.eventsMobile, icon: Flag },
    { id: 'guide', label: t.nav.guide, mobileLabel: t.nav.guideMobile, icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-20 md:pb-8">
      {/* Three-Zone Top Bar */}
      <header className="sticky top-0 z-30 h-14 md:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className="font-display text-xl sm:text-2xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 text-left"
          >
            Rallyman Chrono
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 whitespace-nowrap shrink-0 border-b-2 transition-colors ${
                    isActive
                      ? 'border-[#C83E2B] text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('sheets')}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{t.nav.topCsvCta}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4">
        {/* Non-sticky Utility Strip with Bilingual FR / EN Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <span>{t.nav.standaloneHint}</span>
          <div
            className="inline-flex items-center gap-1 p-0.5 bg-white border border-slate-200 rounded-lg shrink-0"
            role="group"
            aria-label={t.nav.languageLabel}
          >
            <Globe className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setLocale('fr')}
              aria-pressed={locale === 'fr'}
              className={`min-h-[32px] px-2.5 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                locale === 'fr'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              aria-pressed={locale === 'en'}
              className={`min-h-[32px] px-2.5 py-1 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                locale === 'en'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              EN
            </button>
          </div>
        </div>

        {activeTab === 'tracker' && (
          <TrackerView
            activeGame={activeGame}
            groups={groups}
            sessions={sessions}
            activeGroupId={activeGroupId}
            activeSessionId={activeSessionId}
            dirtExtensions={dirtExtensions}
            gtExtensions={gtExtensions}
            onSelectGame={handleSelectGame}
            onToggleDirtExtension={handleToggleDirtExtension}
            onToggleGtExtension={handleToggleGtExtension}
            onSelectGroup={handleSelectGroup}
            onSelectSession={setActiveSessionId}
            onOpenNewGroup={() => {
              setEditingGroup(null);
              setGroupModalOpen(true);
            }}
            onEditGroup={(group) => {
              setEditingGroup(group);
              setGroupModalOpen(true);
            }}
            onOpenNewRally={() => setNewRallyModalOpen(true)}
            onSaveStageResult={handleSaveStageResult}
            onDeleteStageResult={handleDeleteStageResult}
            onApplyServiceTent={handleApplyServiceTent}
            onDeleteSession={handleDeleteSession}
            onGoToCsv={() => setActiveTab('sheets')}
          />
        )}

        {activeTab === 'sheets' && (
          <CsvSyncStudio
            activeGame={activeGame}
            groups={groups}
            sessions={sessions}
            onImportData={handleImportData}
          />
        )}

        {activeTab === 'rallies' && (
          <RalliesLibraryView
            activeGame={activeGame}
            activeGroupName={activeGroupName}
            dirtExtensions={dirtExtensions}
            gtExtensions={gtExtensions}
            onSelectGame={handleSelectGame}
            onStartOfficialEvent={handleStartOfficialEvent}
          />
        )}

        {activeTab === 'guide' && <ArchitectureGuideView />}
      </main>

      {/* Mobile Fixed Bottom Thumb Navigation (< md) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-4 items-center"
        aria-label={t.nav.mainNavAria}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`h-full flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isActive ? 'text-[#C83E2B]' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                {item.mobileLabel}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Modals */}
      <GroupModal
        open={groupModalOpen}
        activeGame={activeGame}
        initialGroup={editingGroup}
        dirtExtensions={dirtExtensions}
        gtExtensions={gtExtensions}
        onSave={handleSaveGroup}
        onClose={() => {
          setGroupModalOpen(false);
          setEditingGroup(null);
        }}
      />

      <NewRallyModal
        open={newRallyModalOpen}
        activeGame={activeGame}
        groups={groups}
        activeGroupId={activeGroupId}
        dirtExtensions={dirtExtensions}
        gtExtensions={gtExtensions}
        onEnsureDirtExtensions={handleEnsureDirtExtensions}
        onEnsureGtExtensions={handleEnsureGtExtensions}
        onCreate={handleCreateSession}
        onClose={() => setNewRallyModalOpen(false)}
      />
    </div>
  );
}
