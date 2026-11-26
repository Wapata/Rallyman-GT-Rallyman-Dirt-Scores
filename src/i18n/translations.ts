export type Locale = 'fr' | 'en';

export interface Translations {
  common: {
    cancel: string;
    close: string;
    save: string;
    delete: string;
    edit: string;
    enter: string;
    processing: string;
    yes: string;
    no: string;
    driversCount: (n: number) => string;
    stagesCount: (n: number) => string;
    racesCount: (n: number) => string;
    carsCount: (n: number) => string;
    tilesCount: (n: number) => string;
    lapsCount: (n: number) => string;
  };
  nav: {
    tracker: string;
    trackerMobile: string;
    csv: string;
    csvMobile: string;
    events: string;
    eventsMobile: string;
    guide: string;
    guideMobile: string;
    topCsvCta: string;
    mainNavAria: string;
    languageLabel: string;
    standaloneHint: string;
  };
  extensions: {
    gameSelectAria: string;
    dirtBase: string;
    gtBase: string;
    activeDashboards: (count: number) => string;
    adrenalineNote: string;
    expansion110Note: string;
  };
  tracker: {
    groupLabel: string;
    editGroupTitle: string;
    eventLabel: (gameShort: string) => string;
    noEventOption: (gameShort: string) => string;
    deleteEventTitle: string;
    newGroup: string;
    newEvent: string;
    exportImportCsv: string;
    unitAttempts: string;
    unitHeats: string;
    unitRaces: string;
    unitSoloLap: string;
    unitStages: string;
    sisuPrefix: string;
    sisuPerEvent: string;
    sisuPerStage: string;
    sisuPitStop: string;
    sisuAssistance: string;
    emptyTitle: (gameName: string) => string;
    emptyDescGt: string;
    emptyDescDirt: string;
    startEvent: string;
    circuitSuffix: string;
    hintChampionship: string;
    hintSolo: string;
    hintGtCircuit: string;
    hintHillclimb: string;
    hintRx: string;
    hintServiceTent: string;
    hintNoService: string;
    applyAssistance: string;
    standingsGtChampionship: string;
    standingsGtRace: string;
    standingsGtSolo: string;
    standingsHillclimb: string;
    standingsRx: string;
    standingsRally: string;
    standingsSub: string;
    ruleChampionship: string;
    ruleGtRace: string;
    ruleGtSolo: string;
    ruleHillclimb: string;
    ruleRx: string;
    ruleRally: string;
    colPos: string;
    colDriverCar: string;
    colCircShort: string;
    colAssistShort: string;
    colTotalPts: string;
    colResult: string;
    colBestTime: string;
    colTotalTime: string;
    colDelta: string;
    colDamageDice: string;
    colSpare: string;
    colAction: (code: string) => string;
    cellEnter: string;
    cellRetired: string;
    cellNoJoker: string;
    diceLabel: string;
    softBadge: (turn: number, limit: number) => string;
    rainBadge: string;
    asphaltBadge: string;
    snowBadge: string;
    mobileSpare: (val: string) => string;
    mobileToEnter: string;
    mobileRanked: string;
    mobileUnranked: string;
    constructorsTitle: string;
    constructorsSub: string;
    deleteModalTitle: string;
    deleteModalDesc: (name: string) => string;
  };
  stageEntry: {
    maxGear: (max: number) => string;
    limitLabel: (limit: number) => string;
    teamPrefix: (team: string) => string;
    assistanceAtFinish: string;
    hillclimbResetNote: string;
    finishPosition: (modeLabel: string) => string;
    modeChampScale: string;
    modeGtRace: string;
    positionsCount: (n: number) => string;
    focusRemaining: (hasTeamChallenge: boolean) => string;
    focusRemoveAria: string;
    focusAddAria: string;
    trackWeather: (wet: boolean) => string;
    weatherShort: (wet: boolean) => string;
    pursuitGrid: string;
    gridStandard: string;
    gridLabel: (g: 'A' | 'B') => string;
    soloTimeSheetTitle: string;
    undoLap: string;
    totalLapTime: string;
    focusRemainingSolo: string;
    directPositionTitle: string;
    autoTourScaleHint: string;
    mandatoryJoker: (done: boolean) => string;
    rxWeather: (wet: boolean) => string;
    chronoCardsTitle: string;
    undoCard: string;
    rawTimeLabel: string;
    secondTokensLabel: string;
    removeSecondAria: string;
    addSecondAria: string;
    liaisonLabel: string;
    removeLiaisonAria: string;
    addLiaisonAria: string;
    previewLabelGtChamp: string;
    previewLabelGtRace: string;
    previewLabelGtSolo: string;
    previewLabelRx: string;
    previewLabelNet: string;
    retiredChamp: string;
    eliminatedZero: string;
    dsqMissedJoker: string;
    retiredGeneric: string;
    firstQualified: string;
    retiredSolo: string;
    retiredRallyPenalty: string;
    checkboxEliminated: string;
    checkboxRetired: string;
    damagesTitleGt: string;
    damagesTitleDirt: (isHillclimb: boolean) => string;
    reduceDamageAria: (label: string) => string;
    addDamageAria: (label: string) => string;
    softTireWearGt: string;
    softTireWearDirt: string;
    softTireRuleGt: string;
    softTireRuleDirt: string;
    spareTireBtn: (available: boolean) => string;
    sisuBtn: (used: boolean) => string;
    serviceHillclimb: (applied: boolean) => string;
    servicePitStop: (applied: boolean) => string;
    serviceAssistance: (applied: boolean) => string;
    erase: string;
  };
  groupModal: {
    editTitle: string;
    newTitle: string;
    activeConfig: (gameName: string, hasTeamChallenge: boolean) => string;
    groupNameLabel: string;
    groupNamePlaceholder: string;
    noteLabel: string;
    notePlaceholder: string;
    carsDriversLabel: (isTeamChallenge: boolean, count: number, max: number) => string;
    addCar: string;
    addDriver: string;
    driverPlaceholder: (idx: number) => string;
    extOff: string;
    tireAsphalt: string;
    tireRain: string;
    tireSoft: string;
    tireDirtStd: string;
    tireDirtAsphalt: string;
    tireDirtSnow: string;
    tireDirtRain: string;
    removeDriverAria: string;
    maxGearLabel: (max: number) => string;
    teamPlaceholder: string;
    unlimitedPlaceholder: string;
    saveGroup: string;
    defaultGroupName: string;
    defaultDriverName: (n: number) => string;
  };
  newRallyModal: {
    title: (gameName: string) => string;
    groupLabel: string;
    officialTemplatesTab: (count: number) => string;
    customEventTab: string;
    chooseOfficialLabel: (gameShort: string) => string;
    requiresExt: (exts: string) => string;
    eventFormatLabel: string;
    gtRaceOpt: string;
    gtChampOpt: string;
    gtSoloOpt: string;
    dirtRallyOpt: string;
    dirtClimbOpt: string;
    dirtRxOpt: string;
    dirtAutoTourOpt: string;
    eventNameLabel: string;
    gtSoloInfo: string;
    raceCountLabel: string;
    autoTourStepsLabel: (count: number) => string;
    addStep: string;
    stepSpecial: string;
    stepCircuit: string;
    stepAssist: string;
    hillclimbInfo: string;
    heatsCountLabel: string;
    stagesCountLabel: string;
    heatWord: (n: number) => string;
    stageWord: (n: number) => string;
    assistanceBetweenStages: string;
    sisuRuleLabel: string;
    sisuPerEventGt: string;
    sisuPerEventDirt: string;
    sisuPerRaceGt: string;
    sisuPerStageDirt: string;
    sisuPitOnlyGt: string;
    sisuAssistOnlyDirt: string;
    createEvent: string;
    defaultCustomGtRace: string;
    defaultCustomGtChamp: string;
    defaultCustomGtSolo: string;
    defaultCustomDirtRally: string;
    defaultCustomDirtClimb: string;
    defaultCustomDirtRx: string;
    defaultCustomDirtAutoTour: string;
    defaultCustomFallback: string;
    courseWord: (n: number) => string;
    specialWord: (n: number) => string;
    circuitWord: (n: number) => string;
    attemptWord: (n: number) => string;
    heatName: (n: number) => string;
    soloLapName: string;
  };
  library: {
    title: (gameName: string) => string;
    subtitleGt: string;
    subtitleDirt: string;
    targetGroup: string;
    allCount: (n: number) => string;
    gtBaseFilter: string;
    dirtRallyFilter: string;
    dirtClimbFilter: string;
    dirtRxFilter: string;
    byAuthor: (author: string) => string;
    missingExtNotice: (exts: string) => string;
    confrontationTag: string;
    circuitWord: string;
    assistanceWord: string;
    noAssistanceWord: string;
    hillclimbReset: string;
    launchFor: (groupName: string) => string;
  };
  csv: {
    title: string;
    subtitle: string;
    summaryCounts: (groups: number, dirt: number, gt: number) => string;
    exportAll: (count: number) => string;
    exportGameOnly: (gameName: string, count: number) => string;
    rowsReady: (count: number) => string;
    downloadCsv: string;
    copyCsv: string;
    copiedCsv: string;
    importCsv: string;
    pasteCsv: string;
    pasteLabel: string;
    pastePlaceholder: string;
    analyzeImport: string;
    driveCardTitle: string;
    driveStep1: string;
    driveStep2: string;
    driveStep3: string;
    compatCardTitle: string;
    compatCardDesc: string;
    confirmTitle: string;
    confirmDesc: (sourceLabel: string) => string;
    confirmRowCount: (n: number) => string;
    confirmGroupCount: (n: number) => string;
    confirmSessionCount: (n: number) => string;
    confirmBtn: string;
    sourceFileLabel: (name: string) => string;
    sourcePastedLabel: string;
    importSuccess: (source: string, rows: number, sessions: number) => string;
    invalidFileErr: string;
    invalidFormatErr: string;
  };
  guide: {
    title: string;
    intro: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
    card4Title: string;
    card4Desc: string;
    rulesTitle: string;
    dirtHeading: string;
    dirtBullet1: string;
    dirtBullet2: string;
    gtHeading: string;
    gtBullet1: string;
    gtBullet2: string;
  };
}

export const TRANSLATIONS: Record<Locale, Translations> = {
  fr: {
    common: {
      cancel: 'Annuler',
      close: 'Fermer',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      enter: 'Saisir',
      processing: 'Traitement...',
      yes: 'Oui',
      no: 'Non',
      driversCount: (n) => `${n} pilote${n > 1 ? 's' : ''}`,
      stagesCount: (n) => `${n} épreuve${n > 1 ? 's' : ''}`,
      racesCount: (n) => `${n} course${n > 1 ? 's' : ''}`,
      carsCount: (n) => `${n} voiture${n > 1 ? 's' : ''}`,
      tilesCount: (n) => `${n} tuile${n > 1 ? 's' : ''}`,
      lapsCount: (n) => `${n} tour${n > 1 ? 's' : ''}`,
    },
    nav: {
      tracker: 'Course',
      trackerMobile: 'Course',
      csv: 'Export / CSV',
      csvMobile: 'CSV',
      events: 'Épreuves',
      eventsMobile: 'Épreuves',
      guide: 'Guide',
      guideMobile: 'Guide',
      topCsvCta: 'Export / Import CSV',
      mainNavAria: 'Navigation principale',
      languageLabel: 'Langue',
      standaloneHint: 'Suivi hors-ligne · Export CSV FR/EN compatible Drive & Excel',
    },
    extensions: {
      gameSelectAria: 'Sélection du jeu Rallyman',
      dirtBase: 'Base (R6)',
      gtBase: 'Base (GT6)',
      activeDashboards: (count) => `Tableaux actifs (${count})`,
      adrenalineNote:
        'Adrenaline Pack actif : Pneus Tendres (T1–T3 = 4⚠ · T4–T6 = 3⚠ · T7+ = 2⚠), gelés sous la pluie et réinitialisés aux Stands (00 → 0).',
      expansion110Note:
        'Extension 110% active : Surfaces Terre, Asphalte & Neige, Pneus Asphalte/Neige, jetons Météo et Virage au frein à main.',
    },
    tracker: {
      groupLabel: 'Groupe de joueurs',
      editGroupTitle: 'Modifier le groupe',
      eventLabel: (g) => `Événement suivi (${g})`,
      noEventOption: (g) => `Aucun événement ${g} pour ce groupe`,
      deleteEventTitle: 'Supprimer cet événement',
      newGroup: 'Nouveau groupe',
      newEvent: 'Nouvel événement',
      exportImportCsv: 'Exporter / Importer CSV',
      unitAttempts: 'essais (meilleur temps)',
      unitHeats: 'manche(s)',
      unitRaces: 'courses',
      unitSoloLap: 'tour chrono',
      unitStages: 'épreuves',
      sisuPrefix: 'SISU :',
      sisuPerEvent: '1 par événement',
      sisuPerStage: '1 par épreuve',
      sisuPitStop: 'aux Stands',
      sisuAssistance: 'à l’Assistance',
      emptyTitle: (gameName) => `Aucun événement ${gameName} actif`,
      emptyDescGt:
        'Lancez un Circuit GT (1–8), un Championnat en 8 courses, un World Tour ou un Mode Solo.',
      emptyDescDirt:
        'Lancez un Rallye (Base ou 110%), une Course de côte (The Climb), un Rallycross / Glace ou un Auto Tour mixte.',
      startEvent: 'Démarrer un événement',
      circuitSuffix: ' · Circuit',
      hintChampionship: 'Barème Championnat : 25 · 18 · 15 · 12 · 10 · 8 · 6 · 4 · 2 · 1 pts',
      hintSolo: 'Feuille de temps Solo (V6..V00) - 1s par Focus restant',
      hintGtCircuit: 'Course sur circuit · Stands disponibles pendant la course',
      hintHillclimb: 'Course de côte : dégâts remis à zéro entre essais',
      hintRx: 'Confrontation directe · Tour Joker obligatoire',
      hintServiceTent: 'Tente d’assistance en fin d’épreuve',
      hintNoService: 'Pas d’assistance — dégâts conservés',
      applyAssistance: 'Appliquer Assistance',
      standingsGtChampionship: 'Classement Pilotes — Championnat GT',
      standingsGtRace: 'Classement Course GT',
      standingsGtSolo: 'Classement Mode Solo GT (Meilleur chrono)',
      standingsHillclimb: 'Classement Course de côte (Meilleur essai)',
      standingsRx: 'Classement Rallycross / Glace',
      standingsRally: 'Classement général & Ordre de départ',
      standingsSub: 'Cliquez sur une cellule pour saisir les résultats, chronos ou dégâts.',
      ruleChampionship: 'Somme des points sur les manches',
      ruleGtRace: 'Départage Poursuite : plus de Focus',
      ruleGtSolo: 'Temps le plus bas gagne',
      ruleHillclimb: 'Le meilleur des 3 essais compte',
      ruleRx: 'Tour Joker manqué = DSQ',
      ruleRally: 'Meilleur temps cumulé part en premier',
      colPos: 'Pos.',
      colDriverCar: 'Pilote & Voiture',
      colCircShort: ' (Circ.)',
      colAssistShort: ' · Assist.',
      colTotalPts: 'Total Pts',
      colResult: 'Résultat',
      colBestTime: 'Meilleur Temps',
      colTotalTime: 'Temps Total',
      colDelta: 'Écart',
      colDamageDice: 'Dégâts & Dés',
      colSpare: 'Roue',
      colAction: (code) => `Action (${code})`,
      cellEnter: '+ Saisir',
      cellRetired: 'Ab. (0 pt)',
      cellNoJoker: ' · Sans Joker',
      diceLabel: 'Dés :',
      softBadge: (turn, limit) => ` · Tendres T${turn} (${limit}⚠)`,
      rainBadge: ' · Pluie',
      asphaltBadge: ' · Pneus Asphalte',
      snowBadge: ' · Pneus Neige',
      mobileSpare: (val) => ` · Roue ${val}`,
      mobileToEnter: 'à saisir',
      mobileRanked: 'Classé',
      mobileUnranked: 'Non classé',
      constructorsTitle: 'Classement Constructeurs / Équipes (Championship)',
      constructorsSub: 'Somme des points des pilotes par équipe',
      deleteModalTitle: 'Supprimer cet événement ?',
      deleteModalDesc: (name) =>
        `L’événement « ${name} » et ses résultats enregistrés seront retirés de votre suivi local.`,
    },
    stageEntry: {
      maxGear: (max) => `Max V${max}`,
      limitLabel: (limit) => `Limite ${limit}⚠`,
      teamPrefix: (team) => ` · Équipe ${team}`,
      assistanceAtFinish: ' · Assistance à l’arrivée',
      hillclimbResetNote: ' · Course de côte (reset entre essais)',
      finishPosition: (modeLabel) => `Position d’arrivée (${modeLabel})`,
      modeChampScale: 'Barème Championnat',
      modeGtRace: 'Course GT',
      positionsCount: (n) => `${n} positions`,
      focusRemaining: (hasTeamChallenge) =>
        `Jetons Focus restants ${hasTeamChallenge ? '(Départage Poursuite)' : '(Optionnel)'}`,
      focusRemoveAria: 'Retirer 1 jeton Focus',
      focusAddAria: 'Ajouter 1 jeton Focus',
      trackWeather: (wet) => `Météo piste : ${wet ? 'Pluie / Humide' : 'Soleil (Asphalte sec)'}`,
      weatherShort: (wet) => `Météo : ${wet ? 'Pluie / Humide' : 'Soleil (Asphalte sec)'}`,
      pursuitGrid: 'Course-Poursuite (Grille) :',
      gridStandard: 'Standard',
      gridLabel: (g) => `Grille ${g}`,
      soloTimeSheetTitle: 'Feuille de temps Solo (Vitesse en fin de tour)',
      undoLap: 'Annuler tour',
      totalLapTime: 'Total Temps de tour (m:ss)',
      focusRemainingSolo: 'Jetons Focus restants (-1s chacun)',
      directPositionTitle: 'Position d’arrivée (Confrontation directe)',
      autoTourScaleHint: 'Barème Auto Tour (1er = 0s … 6e = +1:00)',
      mandatoryJoker: (done) =>
        `Tour Joker obligatoire : ${done ? 'Effectué (Valide)' : 'Manqué (DSQ)'}`,
      rxWeather: (wet) => `Météo RX : ${wet ? 'Humide (3L / 1+1F)' : 'Temps sec'}`,
      chronoCardsTitle: 'Cartes Chrono accumulées',
      undoCard: 'Annuler carte',
      rawTimeLabel: 'Temps brut (m:ss)',
      secondTokensLabel: 'Jetons Secondes retirés (-)',
      removeSecondAria: 'Retirer 1 seconde',
      addSecondAria: 'Ajouter 1 seconde',
      liaisonLabel: 'Étape de liaison (+s)',
      removeLiaisonAria: 'Retirer 5 secondes de liaison',
      addLiaisonAria: 'Ajouter 5 secondes de liaison',
      previewLabelGtChamp: 'Résultat & Points Championnat',
      previewLabelGtRace: 'Classement Course GT',
      previewLabelGtSolo: 'Temps Définitif Solo',
      previewLabelRx: 'Classement manche',
      previewLabelNet: 'Temps net calculé',
      retiredChamp: 'Abandon (0 pt)',
      eliminatedZero: 'Éliminé (0V)',
      dsqMissedJoker: 'DSQ (Joker manqué)',
      retiredGeneric: 'Abandon',
      firstQualified: '1er (Qualifié)',
      retiredSolo: 'Abandon (0V)',
      retiredRallyPenalty: 'Abandon (+1:00 sur dernier)',
      checkboxEliminated: 'Éliminé (0 dé Vitesse)',
      checkboxRetired: 'Abandon (0 dé Vitesse)',
      damagesTitleGt: 'Dégâts en fin de course',
      damagesTitleDirt: (isHillclimb) =>
        `Dégâts en fin d’épreuve ${isHillclimb ? '(remis à 0 avant essai suivant)' : ''}`,
      reduceDamageAria: (label) => `Réduire dégât ${label}`,
      addDamageAria: (label) => `Ajouter dégât ${label}`,
      softTireWearGt: 'Usure Pneus Tendres (Adrenaline Pack)',
      softTireWearDirt: 'Usure Pneus Tendres (Pack Copilote)',
      softTireRuleGt:
        'T1–T3 = 4⚠ · T4–T6 = 3⚠ · T7+ = 2⚠ (gelé sous la pluie, reset aux Stands)',
      softTireRuleDirt:
        'T1–T4 = 4⚠ · T5–T6 = 3⚠ · T7+ = 2⚠ (remis à T1 uniquement à l’Assistance)',
      spareTireBtn: (available) => `Roue de secours : ${available ? 'Disponible (O)' : 'Utilisée (N)'}`,
      sisuBtn: (used) => `Jeton SISU : ${used ? 'Utilisé' : 'Disponible'}`,
      serviceHillclimb: (applied) =>
        applied ? 'Fin d’essai : Reset complet' : 'Fin d’essai : Pas de reset',
      servicePitStop: (applied) =>
        `Arrêt aux Stands : ${applied ? 'Oui (répare / pneus)' : 'Non'}`,
      serviceAssistance: (applied) =>
        `Assistance : ${applied ? 'Oui (répare tout)' : 'Non'}`,
      erase: 'Effacer',
    },
    groupModal: {
      editTitle: 'Modifier le groupe',
      newTitle: 'Nouveau groupe de joueurs',
      activeConfig: (gameName, hasTeamChallenge) =>
        `Configuration active : ${gameName}${
          hasTeamChallenge ? ' (Team Challenge · jusqu’à 12 voitures)' : ''
        }`,
      groupNameLabel: 'Nom du groupe',
      groupNamePlaceholder: 'Ex : Club Mardi, Famille...',
      noteLabel: 'Note (optionnel)',
      notePlaceholder: 'Règles maison, lieu...',
      carsDriversLabel: (isTeamChallenge, count, max) =>
        `${isTeamChallenge ? 'Voitures / Pilotes' : 'Pilotes'} (${count}/${max})`,
      addCar: 'Ajouter une voiture',
      addDriver: 'Ajouter un pilote',
      driverPlaceholder: (idx) => `Pilote ${idx}`,
      extOff: ' (ext. off)',
      tireAsphalt: 'Asphalte',
      tireRain: 'Pluie',
      tireSoft: 'Tendres (T1–T7)',
      tireDirtStd: 'Pneus Terre (Base)',
      tireDirtAsphalt: 'Pneus Asphalte (110%)',
      tireDirtSnow: 'Pneus Neige (110%)',
      tireDirtRain: 'Pluie / Neige (RX)',
      removeDriverAria: 'Supprimer le pilote',
      maxGearLabel: (max) => `Max V${max}`,
      teamPlaceholder: 'Équipe (optionnel, ex: Écurie A)',
      unlimitedPlaceholder: 'Config Unlimited (ex: 5⚠ + Boost)',
      saveGroup: 'Enregistrer le groupe',
      defaultGroupName: 'Nouveau groupe',
      defaultDriverName: (n) => `Pilote ${n}`,
    },
    newRallyModal: {
      title: (gameName) => `Nouvel événement · ${gameName}`,
      groupLabel: 'Groupe',
      officialTemplatesTab: (count) => `Modèles officiels (${count})`,
      customEventTab: 'Événement personnalisé',
      chooseOfficialLabel: (gameShort) => `Choisir un circuit / événement officiel (${gameShort})`,
      requiresExt: (exts) => ` [Active ext. ${exts}]`,
      eventFormatLabel: 'Format de jeu',
      gtRaceOpt: 'Course simple GT (Classement direct + Stands)',
      gtChampOpt: 'Championnat GT (Multi-courses, barème 25–1 pts + Équipes)',
      gtSoloOpt: 'Mode Solo GT (Feuille de temps V6..V00 - Focus)',
      dirtRallyOpt: 'Rallye classique (Chrono cumulé)',
      dirtClimbOpt: 'Course de côte — The Climb (3 essais, meilleur temps)',
      dirtRxOpt: 'Rallycross / Glace — RX (Confrontation directe + Joker)',
      dirtAutoTourOpt: 'Auto Tour Mixte — RX (Spéciales + Circuits)',
      eventNameLabel: 'Nom de l’événement',
      gtSoloInfo:
        'Mode Solo GT (1 tour) : additionnez vos vitesses en fin de tour (V6 = 0:10 … V0 = 1:00, V00 = 0:30) puis déduisez 1s par jeton Focus restant.',
      raceCountLabel: 'Nombre de courses',
      autoTourStepsLabel: (count) => `Étapes de l’Auto Tour (${count})`,
      addStep: '+ Ajouter étape',
      stepSpecial: 'Spéciale (Chrono)',
      stepCircuit: 'Circuit (0s..60s)',
      stepAssist: 'Assist.',
      hillclimbInfo:
        'Course de côte officielle : 3 essais (TRY1, TRY2, TRY3) sur la même montée. Le meilleur temps des 3 essais détermine le classement.',
      heatsCountLabel: 'Nombre de manches',
      stagesCountLabel: 'Nombre de spéciales',
      heatWord: (n) => `manche${n > 1 ? 's' : ''}`,
      stageWord: (n) => `spéciale${n > 1 ? 's' : ''}`,
      assistanceBetweenStages: 'Assistance entre spéciales',
      sisuRuleLabel: 'Règle du jeton SISU',
      sisuPerEventGt: '1 jeton SISU pour tout l’événement',
      sisuPerEventDirt: '1 jeton SISU pour tout le rallye',
      sisuPerRaceGt: '1 jeton SISU par course',
      sisuPerStageDirt: '1 jeton SISU par spéciale / essai',
      sisuPitOnlyGt: 'Récupération uniquement aux Stands',
      sisuAssistOnlyDirt: 'Récupération uniquement à l’Assistance',
      createEvent: 'Créer l’événement',
      defaultCustomGtRace: 'Course GT Perso',
      defaultCustomGtChamp: 'Championnat GT Perso',
      defaultCustomGtSolo: 'Mode Solo GT — Chrono',
      defaultCustomDirtRally: 'Rallye Perso — Soirée',
      defaultCustomDirtClimb: 'Course de côte Perso',
      defaultCustomDirtRx: 'Rallycross Perso',
      defaultCustomDirtAutoTour: 'Auto Tour Perso',
      defaultCustomFallback: 'Événement Personnalisé',
      courseWord: (n) => `Course ${n}`,
      specialWord: (n) => `Spéciale ${n}`,
      circuitWord: (n) => `Circuit ${n}`,
      attemptWord: (n) => `Essai ${n}`,
      heatName: (n) => `Manche RX ${n}`,
      soloLapName: 'Tour Chrono Solo',
    },
    library: {
      title: (gameName) => `Épreuves officielles (${gameName})`,
      subtitleGt:
        'Circuits 1–8 de la boîte de base, Championnats 11–18, Team Challenge (en 8 & Poursuite), World Tour et Mode Solo.',
      subtitleDirt:
        'Tracés et listes de tuiles extraits des livrets officiels (Rallyes 1–6, Extension 110% 7–9, The Climb, RX, Auto Tour & Glace).',
      targetGroup: 'Groupe cible :',
      allCount: (n) => `Tous (${n})`,
      gtBaseFilter: 'Circuits 1–8 & Solo',
      dirtRallyFilter: 'Rallyes (1–9)',
      dirtClimbFilter: 'The Climb (Côtes)',
      dirtRxFilter: 'RX · Auto Tour · Glace',
      byAuthor: (author) => `Par ${author}`,
      missingExtNotice: (exts) =>
        `Extension requise : ${exts} (activée automatiquement au lancement)`,
      confrontationTag: ' (Confrontation)',
      circuitWord: 'Circuit',
      assistanceWord: 'Assistance',
      noAssistanceWord: 'Sans assistance',
      hillclimbReset: 'Reset complet après essai',
      launchFor: (groupName) => `Lancer pour ${groupName}`,
    },
    csv: {
      title: 'Export & Import CSV (Autonome, sans compte Google)',
      subtitle:
        'Sauvegardez ou partagez vos groupes, chronos, classements GT et championnats en fichier .csv ouvrable directement dans Google Drive / Google Sheets ou Excel.',
      summaryCounts: (groups, dirt, gt) => `${groups} groupes · ${dirt} DIRT · ${gt} GT`,
      exportAll: (count) => `Tout exporter (${count})`,
      exportGameOnly: (gameName, count) => `${gameName} seul (${count})`,
      rowsReady: (count) => `${count} ligne(s) prête(s) à exporter`,
      downloadCsv: 'Télécharger .csv',
      copyCsv: 'Copier le CSV',
      copiedCsv: 'CSV copié',
      importCsv: 'Importer un CSV',
      pasteCsv: 'Coller un CSV',
      pasteLabel:
        'Collez ici les lignes CSV (FR ou EN, avec en-têtes Date, Jeu/Game, Groupe/Group, Événement/Event, Pilote/Driver...)',
      pastePlaceholder: 'Date;Jeu;Groupe;Événement;Mode;Épreuve;Pilote;Voiture;...',
      analyzeImport: 'Analyser & Importer',
      driveCardTitle: 'Ouvrir dans Google Sheets (sans autorisation OAuth)',
      driveStep1: 'Cliquez sur Télécharger .csv depuis votre téléphone ou PC.',
      driveStep2:
        'Déposez le fichier sur votre Google Drive ou ouvrez Google Sheets → Fichier → Importer.',
      driveStep3:
        'Partagez la feuille en lecture seule avec vos joueurs, ou réimportez le CSV ici pour reprendre une partie plus tard.',
      compatCardTitle: 'Compatibilité DIRT, GT & Bilingue FR/EN',
      compatCardDesc:
        'Le fichier CSV détecte automatiquement Rallyman: DIRT et Rallyman: GT, ainsi que les exports précédents en français ou en anglais (y compris les anciens exports DIRT).',
      confirmTitle: 'Importer ces données dans l’application ?',
      confirmDesc: (sourceLabel) =>
        `Source détectée : ${sourceLabel}. Les groupes, pilotes et résultats (DIRT & GT) seront ajoutés ou mis à jour dans votre suivi local.`,
      confirmRowCount: (n) => `${n} ligne(s) d’épreuve lues`,
      confirmGroupCount: (n) => `${n} groupe(s) concerné(s)`,
      confirmSessionCount: (n) => `${n} événement(s) importé(s) ou mis à jour`,
      confirmBtn: 'Importer et reprendre',
      sourceFileLabel: (name) => `Fichier CSV « ${name} »`,
      sourcePastedLabel: 'Texte CSV collé',
      importSuccess: (source, rows, sessions) =>
        `Import réussi depuis ${source} : ${rows} résultats sur ${sessions} événement(s).`,
      invalidFileErr: 'Fichier CSV invalide.',
      invalidFormatErr: 'Format CSV non reconnu.',
    },
    guide: {
      title: 'Application autonome DIRT & GT · Partage CSV sans compte Google',
      intro:
        'Passez d’un clic entre Rallyman: DIRT et Rallyman: GT avec toutes leurs extensions officielles, et exportez ou reprenez vos parties à tout moment via un simple fichier CSV compatible Google Drive et Excel.',
      card1Title: '1. Sauvegarde locale directe',
      card1Desc:
        'Aucune connexion requise : vos groupes et résultats sont enregistrés automatiquement sur votre téléphone, tablette ou ordinateur.',
      card2Title: '2. Partage CSV vers Drive',
      card2Desc:
        'Exportez un fichier .csv (point-virgule UTF-8) pour l’ouvrir dans Google Sheets ou Excel et le partager avec vos joueurs.',
      card3Title: '3. Reprise multi-appareils',
      card3Desc:
        'Réimportez un fichier CSV (FR ou EN) depuis l’onglet Export / CSV pour reprendre la partie sur un autre appareil.',
      card4Title: '4. Deux jeux, mêmes groupes',
      card4Desc:
        'Vos groupes de joueurs conservent leurs profils DIRT (R4–R6, RX, ICE) et GT (GT4, GT5, GT6, B.O.P., Équipe).',
      rulesTitle: 'Règles officielles intégrées par jeu et extension',
      dirtHeading: 'Rallyman: DIRT (Base + R4, R5, 110%, The Climb, Pack Copilote, RX)',
      dirtBullet1:
        'Rallye, 110% & Auto Tour : cartes chrono (V1–V6, PDC, SISU), jetons Secondes (-1s), liaisons (+5s), Pneus Terre/Asphalte/Neige, roue de secours et Assistance.',
      dirtBullet2:
        'The Climb & RX / Glace : meilleur des 3 essais en Côte, confrontation directe avec Tour Joker obligatoire en RX et usure Tendres T1–T4 (4⚠), T5–T6 (3⚠), T7+ (2⚠).',
      gtHeading:
        'Rallyman: GT (Base + GT4, GT5, Adrenaline, Championship, Team Challenge, World Tour)',
      gtBullet1:
        'GT4, GT5, GT6 & B.O.P. : dés exacts dont le dé Boost vert (GT5), Pneus Tendres Adrenaline (T1–T3 : 4⚠, T4–T6 : 3⚠, T7+ : 2⚠, gelés sous la pluie).',
      gtBullet2:
        'Championship, Team Challenge & Solo : barème 25–1 pts + classement Équipes, jusqu’à 12 voitures et départage Focus, et Feuille de temps Solo (V6 = 0:10 … V00 = 0:30 errata FAQ, -1s/Focus).',
    },
  },
  en: {
    common: {
      cancel: 'Cancel',
      close: 'Close',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      enter: 'Enter',
      processing: 'Processing...',
      yes: 'Yes',
      no: 'No',
      driversCount: (n) => `${n} driver${n > 1 ? 's' : ''}`,
      stagesCount: (n) => `${n} stage${n > 1 ? 's' : ''}`,
      racesCount: (n) => `${n} race${n > 1 ? 's' : ''}`,
      carsCount: (n) => `${n} car${n > 1 ? 's' : ''}`,
      tilesCount: (n) => `${n} tile${n > 1 ? 's' : ''}`,
      lapsCount: (n) => `${n} lap${n > 1 ? 's' : ''}`,
    },
    nav: {
      tracker: 'Race',
      trackerMobile: 'Race',
      csv: 'Export / CSV',
      csvMobile: 'CSV',
      events: 'Events',
      eventsMobile: 'Events',
      guide: 'Guide',
      guideMobile: 'Guide',
      topCsvCta: 'Export / Import CSV',
      mainNavAria: 'Main navigation',
      languageLabel: 'Language',
      standaloneHint: 'Offline tracker · FR/EN CSV export compatible with Drive & Excel',
    },
    extensions: {
      gameSelectAria: 'Select Rallyman game',
      dirtBase: 'Core (R6)',
      gtBase: 'Core (GT6)',
      activeDashboards: (count) => `Active Dashboards (${count})`,
      adrenalineNote:
        'Adrenaline Pack active: Soft Tires (T1–T3 = 4⚠ · T4–T6 = 3⚠ · T7+ = 2⚠), frozen in rain and reset on Pit Stop (00 → 0).',
      expansion110Note:
        '110% Expansion active: Gravel, Asphalt & Snow track types, Asphalt/Snow Tires, Weather tokens & Handbrake turn.',
    },
    tracker: {
      groupLabel: 'Driver Group',
      editGroupTitle: 'Edit group',
      eventLabel: (g) => `Tracked Event (${g})`,
      noEventOption: (g) => `No ${g} event for this group`,
      deleteEventTitle: 'Delete this event',
      newGroup: 'New Group',
      newEvent: 'New Event',
      exportImportCsv: 'Export / Import CSV',
      unitAttempts: 'attempts (best time)',
      unitHeats: 'race(s)',
      unitRaces: 'races',
      unitSoloLap: 'time trial lap',
      unitStages: 'stages',
      sisuPrefix: 'SISU:',
      sisuPerEvent: '1 per event',
      sisuPerStage: '1 per stage',
      sisuPitStop: 'at Pit Stop',
      sisuAssistance: 'at Assistance',
      emptyTitle: (gameName) => `No active ${gameName} event`,
      emptyDescGt:
        'Start a GT Track (1–8), an 8-race Championship, a World Tour or a Solo Mode session.',
      emptyDescDirt:
        'Start a Rally (Core or 110%), a Hillclimb (The Climb), an RX / Ice Race or a Mixed Auto Tour.',
      startEvent: 'Start an Event',
      circuitSuffix: ' · Track',
      hintChampionship: 'Championship points: 25 · 18 · 15 · 12 · 10 · 8 · 6 · 4 · 2 · 1 pts',
      hintSolo: 'Solo Score Sheet (Gear 6..00) - 1s per remaining Focus token',
      hintGtCircuit: 'Track race · Pit Stops available during the race',
      hintHillclimb: 'Hillclimb: damage resets between attempts',
      hintRx: 'Head-to-Head · Mandatory Joker Lap',
      hintServiceTent: 'Assistance Tent at stage finish',
      hintNoService: 'No Assistance — damage carries over',
      applyAssistance: 'Apply Assistance',
      standingsGtChampionship: 'Driver Standings — GT Championship',
      standingsGtRace: 'GT Race Standings',
      standingsGtSolo: 'GT Solo Mode Standings (Best Time)',
      standingsHillclimb: 'Hillclimb Standings (Best Attempt)',
      standingsRx: 'Rallycross / Ice Standings',
      standingsRally: 'Overall Standings & Starting Order',
      standingsSub: 'Click any cell to enter results, times or damage.',
      ruleChampionship: 'Total points across all races',
      ruleGtRace: 'Pursuit tie-break: most Focus tokens',
      ruleGtSolo: 'Lowest time wins',
      ruleHillclimb: 'Best of 3 attempts counts',
      ruleRx: 'Missed Joker Lap = DSQ',
      ruleRally: 'Lowest overall time starts first',
      colPos: 'Pos.',
      colDriverCar: 'Driver & Car',
      colCircShort: ' (Track)',
      colAssistShort: ' · Assist.',
      colTotalPts: 'Total Pts',
      colResult: 'Result',
      colBestTime: 'Best Time',
      colTotalTime: 'Overall Time',
      colDelta: 'Gap',
      colDamageDice: 'Damage & Dice',
      colSpare: 'Spare',
      colAction: (code) => `Action (${code})`,
      cellEnter: '+ Enter',
      cellRetired: 'Ret. (0 pt)',
      cellNoJoker: ' · No Joker',
      diceLabel: 'Dice:',
      softBadge: (turn, limit) => ` · Soft T${turn} (${limit}⚠)`,
      rainBadge: ' · Rain',
      asphaltBadge: ' · Asphalt Tires',
      snowBadge: ' · Snow Tires',
      mobileSpare: (val) => ` · Spare ${val}`,
      mobileToEnter: 'pending',
      mobileRanked: 'Ranked',
      mobileUnranked: 'Unranked',
      constructorsTitle: 'Team / Constructors Standings (Championship)',
      constructorsSub: 'Combined driver points per team',
      deleteModalTitle: 'Delete this event?',
      deleteModalDesc: (name) =>
        `The event "${name}" and its recorded results will be removed from your local tracker.`,
    },
    stageEntry: {
      maxGear: (max) => `Max Gear ${max}`,
      limitLabel: (limit) => `Limit ${limit}⚠`,
      teamPrefix: (team) => ` · Team ${team}`,
      assistanceAtFinish: ' · Assistance at finish',
      hillclimbResetNote: ' · Hillclimb (reset between attempts)',
      finishPosition: (modeLabel) => `Finishing Position (${modeLabel})`,
      modeChampScale: 'Championship Points',
      modeGtRace: 'GT Race',
      positionsCount: (n) => `${n} positions`,
      focusRemaining: (hasTeamChallenge) =>
        `Remaining Focus tokens ${hasTeamChallenge ? '(Pursuit tie-break)' : '(Optional)'}`,
      focusRemoveAria: 'Remove 1 Focus token',
      focusAddAria: 'Add 1 Focus token',
      trackWeather: (wet) => `Track Weather: ${wet ? 'Wet / Rain' : 'Dry (Asphalt)'}`,
      weatherShort: (wet) => `Weather: ${wet ? 'Wet / Rain' : 'Dry (Asphalt)'}`,
      pursuitGrid: 'Pursuit Mode (Grid):',
      gridStandard: 'Standard',
      gridLabel: (g) => `Grid ${g}`,
      soloTimeSheetTitle: 'Solo Score Sheet (Gear at end of turn)',
      undoLap: 'Undo turn',
      totalLapTime: 'Total Lap Time (m:ss)',
      focusRemainingSolo: 'Remaining Focus tokens (-1s each)',
      directPositionTitle: 'Finishing Position (Head-to-Head)',
      autoTourScaleHint: 'Auto Tour scale (1st = 0s … 6th = +1:00)',
      mandatoryJoker: (done) =>
        `Mandatory Joker Lap: ${done ? 'Completed (OK!)' : 'Missed (DSQ)'}`,
      rxWeather: (wet) => `RX Weather: ${wet ? 'Wet (3L / 1+1B)' : 'Dry'}`,
      chronoCardsTitle: 'Accumulated Time Cards',
      undoCard: 'Undo card',
      rawTimeLabel: 'Raw Time (m:ss)',
      secondTokensLabel: 'Second tokens spent (-)',
      removeSecondAria: 'Remove 1 second',
      addSecondAria: 'Add 1 second',
      liaisonLabel: 'Checkpoints / Liaison (+s)',
      removeLiaisonAria: 'Remove 5s penalty',
      addLiaisonAria: 'Add 5s penalty',
      previewLabelGtChamp: 'Result & Championship Points',
      previewLabelGtRace: 'GT Race Result',
      previewLabelGtSolo: 'Final Solo Time',
      previewLabelRx: 'Race Result',
      previewLabelNet: 'Net Stage Time',
      retiredChamp: 'Retired (0 pt)',
      eliminatedZero: 'Eliminated (0G)',
      dsqMissedJoker: 'DSQ (Missed Joker)',
      retiredGeneric: 'Retired',
      firstQualified: '1st (Finished)',
      retiredSolo: 'Retired (0G)',
      retiredRallyPenalty: 'Retired (+1:00 on slowest)',
      checkboxEliminated: 'Eliminated (0 Gear die)',
      checkboxRetired: 'Retired from Stage (0 Gear die)',
      damagesTitleGt: 'Damage at race finish',
      damagesTitleDirt: (isHillclimb) =>
        `Damage at stage finish ${isHillclimb ? '(reset before next attempt)' : ''}`,
      reduceDamageAria: (label) => `Reduce ${label} damage`,
      addDamageAria: (label) => `Add ${label} damage`,
      softTireWearGt: 'Soft Tire Wear (Adrenaline Pack)',
      softTireWearDirt: 'Soft Tire Wear (Copilot Pack)',
      softTireRuleGt:
        'T1–T3 = 4⚠ · T4–T6 = 3⚠ · T7+ = 2⚠ (frozen in rain, reset on Pit Stop)',
      softTireRuleDirt:
        'T1–T4 = 4⚠ · T5–T6 = 3⚠ · T7+ = 2⚠ (reset to T1 at Assistance only)',
      spareTireBtn: (available) => `Spare Tire: ${available ? 'Available (Y)' : 'Used (N)'}`,
      sisuBtn: (used) => `SISU token: ${used ? 'Used' : 'Available'}`,
      serviceHillclimb: (applied) =>
        applied ? 'End of attempt: Full reset' : 'End of attempt: No reset',
      servicePitStop: (applied) =>
        `Pit Stop: ${applied ? 'Yes (repairs / tires)' : 'No'}`,
      serviceAssistance: (applied) =>
        `Assistance: ${applied ? 'Yes (full repair)' : 'No'}`,
      erase: 'Delete',
    },
    groupModal: {
      editTitle: 'Edit Group',
      newTitle: 'New Driver Group',
      activeConfig: (gameName, hasTeamChallenge) =>
        `Active setup: ${gameName}${
          hasTeamChallenge ? ' (Team Challenge · up to 12 cars)' : ''
        }`,
      groupNameLabel: 'Group Name',
      groupNamePlaceholder: 'e.g. Friday Club, Family...',
      noteLabel: 'Note (optional)',
      notePlaceholder: 'House rules, location...',
      carsDriversLabel: (isTeamChallenge, count, max) =>
        `${isTeamChallenge ? 'Cars / Drivers' : 'Drivers'} (${count}/${max})`,
      addCar: 'Add a car',
      addDriver: 'Add a driver',
      driverPlaceholder: (idx) => `Driver ${idx}`,
      extOff: ' (exp. off)',
      tireAsphalt: 'Asphalt',
      tireRain: 'Rain',
      tireSoft: 'Soft (T1–T7)',
      tireDirtStd: 'Gravel Tires (Core)',
      tireDirtAsphalt: 'Asphalt Tires (110%)',
      tireDirtSnow: 'Snow Tires (110%)',
      tireDirtRain: 'Rain / Snow (RX)',
      removeDriverAria: 'Remove driver',
      maxGearLabel: (max) => `Max Gear ${max}`,
      teamPlaceholder: 'Team (optional, e.g. Team A)',
      unlimitedPlaceholder: 'Unlimited setup (e.g. 5⚠ + Boost)',
      saveGroup: 'Save Group',
      defaultGroupName: 'New Group',
      defaultDriverName: (n) => `Driver ${n}`,
    },
    newRallyModal: {
      title: (gameName) => `New Event · ${gameName}`,
      groupLabel: 'Group',
      officialTemplatesTab: (count) => `Official Templates (${count})`,
      customEventTab: 'Custom Event',
      chooseOfficialLabel: (gameShort) => `Choose an official track / rally (${gameShort})`,
      requiresExt: (exts) => ` [Enables exp. ${exts}]`,
      eventFormatLabel: 'Game Format',
      gtRaceOpt: 'Single GT Race (Direct standings + Pit Stops)',
      gtChampOpt: 'GT Championship (Multi-race, 25–1 pts + Teams)',
      gtSoloOpt: 'GT Solo Mode (Score Sheet Gear 6..00 - Focus)',
      dirtRallyOpt: 'Classic Rally (Cumulative Time)',
      dirtClimbOpt: 'Hillclimb — The Climb (3 attempts, best time)',
      dirtRxOpt: 'Rallycross / Ice — RX (Head-to-Head + Joker)',
      dirtAutoTourOpt: 'Mixed Auto Tour — RX (Stages + Tracks)',
      eventNameLabel: 'Event Name',
      gtSoloInfo:
        'GT Solo Mode (1 lap): add your Gear times at the end of each turn (Gear 6 = 0:10 … Gear 0 = 1:00, Gear 00 = 0:30) then subtract 1s per remaining Focus token.',
      raceCountLabel: 'Number of Races',
      autoTourStepsLabel: (count) => `Auto Tour Steps (${count})`,
      addStep: '+ Add step',
      stepSpecial: 'Stage (Time Trial)',
      stepCircuit: 'Track (0s..60s)',
      stepAssist: 'Assist.',
      hillclimbInfo:
        'Official Hillclimb: 3 attempts (TRY1, TRY2, TRY3) on the same climb. The fastest single attempt determines the winner.',
      heatsCountLabel: 'Number of Races',
      stagesCountLabel: 'Number of Stages',
      heatWord: (n) => `race${n > 1 ? 's' : ''}`,
      stageWord: (n) => `stage${n > 1 ? 's' : ''}`,
      assistanceBetweenStages: 'Assistance between stages',
      sisuRuleLabel: 'SISU Token Rule',
      sisuPerEventGt: '1 SISU token for the entire event',
      sisuPerEventDirt: '1 SISU token for the entire rally',
      sisuPerRaceGt: '1 SISU token per race',
      sisuPerStageDirt: '1 SISU token per stage / attempt',
      sisuPitOnlyGt: 'Recovered at Pit Stops only',
      sisuAssistOnlyDirt: 'Recovered at Assistance only',
      createEvent: 'Create Event',
      defaultCustomGtRace: 'Custom GT Race',
      defaultCustomGtChamp: 'Custom GT Championship',
      defaultCustomGtSolo: 'GT Solo Mode — Time Trial',
      defaultCustomDirtRally: 'Custom Rally — Game Night',
      defaultCustomDirtClimb: 'Custom Hillclimb',
      defaultCustomDirtRx: 'Custom Rallycross',
      defaultCustomDirtAutoTour: 'Custom Auto Tour',
      defaultCustomFallback: 'Custom Event',
      courseWord: (n) => `Race ${n}`,
      specialWord: (n) => `Stage ${n}`,
      circuitWord: (n) => `Track ${n}`,
      attemptWord: (n) => `Attempt ${n}`,
      heatName: (n) => `RX Race ${n}`,
      soloLapName: 'Solo Time Trial Lap',
    },
    library: {
      title: (gameName) => `Official Events (${gameName})`,
      subtitleGt:
        'Core Box Tracks 1–8, Championship Tracks 11–18, Team Challenge (Figure "8" & Pursuit), World Tour and Solo Mode.',
      subtitleDirt:
        'Official track layouts and tile lists from the rulebooks (Rallies 1–6, 110% Expansion 7–9, The Climb, RX, Auto Tour & Ice).',
      targetGroup: 'Target group:',
      allCount: (n) => `All (${n})`,
      gtBaseFilter: 'Tracks 1–8 & Solo',
      dirtRallyFilter: 'Rallies (1–9)',
      dirtClimbFilter: 'The Climb (Hillclimb)',
      dirtRxFilter: 'RX · Auto Tour · Ice',
      byAuthor: (author) => `By ${author}`,
      missingExtNotice: (exts) => `Requires expansion: ${exts} (auto-enabled on launch)`,
      confrontationTag: ' (Head-to-Head)',
      circuitWord: 'Track',
      assistanceWord: 'Assistance',
      noAssistanceWord: 'No Assistance',
      hillclimbReset: 'Full reset after attempt',
      launchFor: (groupName) => `Launch for ${groupName}`,
    },
    csv: {
      title: 'CSV Export & Import (Standalone, no Google account)',
      subtitle:
        'Save or share your groups, stage times, GT standings and championships as a .csv file ready for Google Drive / Google Sheets or Excel.',
      summaryCounts: (groups, dirt, gt) => `${groups} groups · ${dirt} DIRT · ${gt} GT`,
      exportAll: (count) => `Export All (${count})`,
      exportGameOnly: (gameName, count) => `${gameName} only (${count})`,
      rowsReady: (count) => `${count} row(s) ready to export`,
      downloadCsv: 'Download .csv',
      copyCsv: 'Copy CSV',
      copiedCsv: 'CSV Copied',
      importCsv: 'Import CSV',
      pasteCsv: 'Paste CSV',
      pasteLabel:
        'Paste CSV rows here (FR or EN headers: Date, Game/Jeu, Group/Groupe, Event/Événement, Driver/Pilote...)',
      pastePlaceholder: 'Date;Game;Group;Event;Mode;Stage;Driver;Car;...',
      analyzeImport: 'Parse & Import',
      driveCardTitle: 'Open in Google Sheets (no OAuth sign-in needed)',
      driveStep1: 'Click Download .csv on your phone or computer.',
      driveStep2:
        'Upload the file to Google Drive or open Google Sheets → File → Import.',
      driveStep3:
        'Share the sheet read-only with your group, or re-import the CSV here anytime to resume.',
      compatCardTitle: 'DIRT, GT & Bilingual FR/EN Compatibility',
      compatCardDesc:
        'The CSV importer automatically detects Rallyman: DIRT and Rallyman: GT, and supports both French and English exports (including earlier DIRT exports).',
      confirmTitle: 'Import this data into the tracker?',
      confirmDesc: (sourceLabel) =>
        `Detected source: ${sourceLabel}. Groups, drivers and results (DIRT & GT) will be added or updated in your local storage.`,
      confirmRowCount: (n) => `${n} event row(s) parsed`,
      confirmGroupCount: (n) => `${n} group(s) affected`,
      confirmSessionCount: (n) => `${n} event(s) imported or updated`,
      confirmBtn: 'Import & Resume',
      sourceFileLabel: (name) => `CSV file "${name}"`,
      sourcePastedLabel: 'Pasted CSV text',
      importSuccess: (source, rows, sessions) =>
        `Imported from ${source}: ${rows} results across ${sessions} event(s).`,
      invalidFileErr: 'Invalid CSV file.',
      invalidFormatErr: 'Unrecognized CSV format.',
    },
    guide: {
      title: 'Standalone DIRT & GT Companion · CSV Sharing without Google Login',
      intro:
        'Switch in one tap between Rallyman: DIRT and Rallyman: GT with all official expansions, and export or resume sessions anytime via a standard CSV file compatible with Google Drive and Excel.',
      card1Title: '1. Direct Local Storage',
      card1Desc:
        'No sign-in required: your groups and results are saved automatically on your phone, tablet or computer.',
      card2Title: '2. CSV Sharing to Drive',
      card2Desc:
        'Export a UTF-8 semicolon .csv file to open directly in Google Sheets or Excel and share with your table.',
      card3Title: '3. Multi-Device Resume',
      card3Desc:
        'Re-import any CSV file (FR or EN) from the Export / CSV tab to continue an event on another device.',
      card4Title: '4. Two Games, Shared Groups',
      card4Desc:
        'Your driver groups keep both their DIRT profiles (R4–R6, RX, ICE) and GT profiles (GT4, GT5, GT6, B.O.P., Team).',
      rulesTitle: 'Official Rules Built In by Game & Expansion',
      dirtHeading: 'Rallyman: DIRT (Core + R4, R5, 110%, The Climb, Copilot Pack, RX)',
      dirtBullet1:
        'Rally, 110% & Auto Tour: Time cards (Gear 1–6, LoC, SISU!), Second tokens (-1s), Liaison penalties (+5s), Gravel/Asphalt/Snow tires, Spare Tire and Assistance.',
      dirtBullet2:
        'The Climb & RX / Ice: best of 3 Hillclimb attempts, Head-to-Head with mandatory Joker Lap in RX, and Soft Tire wear T1–T4 (4⚠), T5–T6 (3⚠), T7+ (2⚠).',
      gtHeading:
        'Rallyman: GT (Core + GT4, GT5, Adrenaline, Championship, Team Challenge, World Tour)',
      gtBullet1:
        'GT4, GT5, GT6 & B.O.P.: exact dice pools including green Boost die (GT5), Adrenaline Soft Tires (T1–T3: 4⚠, T4–T6: 3⚠, T7+: 2⚠, frozen in rain).',
      gtBullet2:
        'Championship, Team Challenge & Solo: 25–1 pts scale + Team standings, up to 12 cars with Focus tie-break, and Solo Score Sheet (Gear 6 = 0:10 … Gear 00 = 0:30 FAQ errata, -1s/Focus).',
    },
  },
};
