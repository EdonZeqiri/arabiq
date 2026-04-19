// Curriculum data for Al-Arabiya Bayna Yadayk — Book 1.
// Chapters 1–5 carry the richest datasets; 6–16 are stocked with real titles,
// at least 3 dialogues and ~10 vocabulary words each.

/**
 * A single rephrasing of the same underlying "scene". The student sees
 * one variant at a time; clicking 🔀 rotates through them. Keeping the
 * shape identical to the canonical fields lets the UI render either the
 * original `Dialogue`/`Story` or any variant without a special path.
 */
export interface TextVariant {
  albanian: string;
  arabic: string;
  transliteration: string;
}

export interface Dialogue {
  id: string;
  albanian: string;
  arabic: string;
  transliteration: string;
  /**
   * Optional alternative phrasings that reuse the same core vocabulary.
   * The student can cycle through them to avoid memorising one fixed
   * surface form. Rendered via the 🔀 "Variant tjetër" control.
   */
  variants?: TextVariant[];
}

export interface VocabWord {
  id: string;
  arabic: string; // past tense (الماضي) for verbs; base form otherwise
  albanian: string;
  root: string;
  type: 'noun' | 'verb' | 'particle' | 'adjective';
  gender?: 'M' | 'F';
  plural?: string;
  // Verb-only fields — the 3 canonical forms used in Bayna Yadayk:
  present?: string; // المضارع (هو) — e.g. يَذْهَبُ
  imperative?: string; // الأمر (أنتَ) — e.g. اِذْهَبْ
}

export interface Story {
  id: string;
  titleAl: string;
  albanian: string;
  arabic: string;
  transliteration: string;
  /** Alternative re-tellings using the same vocabulary. See `Dialogue.variants`. */
  variants?: TextVariant[];
}

/**
 * A "Tahwiil" (تَحْوِيل) transformation exercise — the workhorse drill
 * in Al-Arabiya Bayna Yadayk. Student is shown a source sentence and
 * must produce a transformed version (change gender, number, tense…).
 *
 * Only a single `type` for now to keep v1 focused; new shapes (cloze,
 * Q&A) can be added later without migrating existing data.
 */
export interface Exercise {
  id: string;
  type: 'transform';
  prompt: string; // what the student is asked to do (Albanian)
  source: { arabic: string; albanian?: string };
  answer: string; // arabic, with harakat
  hint?: string; // short nudge shown on wrong / reveal
  grammarPoint: string; // short label e.g. "Gjinia (ة)"
}

/**
 * A Qur'anic verse paired with a chapter. Purpose is motivational:
 * after a student has learned the chapter's vocabulary, we surface
 * real scripture they can already decode — "shih, e kupton këtë ajet".
 *
 * `knownWords` carries the exact substrings (with full vocalization,
 * matching the verse text character-for-character) to highlight plus
 * a short gloss. We match literally on the surface form rather than
 * on a root, so the highlighter is a simple string replace — no
 * morphological analysis required, and the student sees exactly the
 * shape that appears in the Mus·haf.
 */
export interface ChapterAyah {
  /** Canonical reference in "surah:ayah" form, e.g. "112:1". */
  reference: string;
  /** Name of the surah in Arabic (e.g. "الإخلاص"). */
  surahNameAr: string;
  /** Name of the surah transliterated for Albanian readers. */
  surahNameAl: string;
  /** Full verse text with harakat, exactly as it appears in the Mus·haf. */
  arabic: string;
  /** Albanian translation. Prefer authoritative sources (S. Ahmeti, H. Nahi). */
  albanian: string;
  /**
   * Substrings from `arabic` that the student already knows from this
   * or earlier chapters. Highlighted in the rendered ayah. Each entry
   * must match literally — whitespace-, harakat-, and all — so the
   * renderer can do a straight substring replace.
   */
  knownWords: Array<{ surface: string; gloss: string }>;
}

export interface Chapter {
  id: number;
  titleAr: string;
  titleAl: string;
  titleEn: string;
  dialogues: Dialogue[];
  vocabulary: VocabWord[];
  grammarFocus: string[];
  stories?: Story[];
  exercises?: Exercise[];
  ayat?: ChapterAyah[];
}

export const CHAPTERS: Chapter[] = [
  // ────────────────────────────────────────────────────────────
  {
    id: 1,
    titleAr: 'التحية والتعارف',
    titleAl: 'Përshëndetjet dhe Prezantimi',
    titleEn: 'Greetings & Introductions',
    dialogues: [
      {
        id: 'd1-1',
        albanian: 'Përshëndetje! Si je?',
        arabic: 'السَّلامُ عَلَيْكُم! كَيْفَ حَالُكَ؟',
        transliteration: 'Es-selamu alejkum! Kejfe haluk?',
        variants: [
          {
            albanian: 'Paqja qoftë mbi ju! Si jeni sot?',
            arabic: 'السَّلامُ عَلَيْكُم! كَيْفَ حَالُكُم الْيَوْم؟',
            transliteration: 'Es-selamu alejkum! Kejfe halukum el-jeum?',
          },
          {
            albanian: 'Mirëmëngjes! A jeni mirë?',
            arabic: 'صَبَاحَ الْخَيْر! هَلْ أَنْتَ بِخَيْر؟',
            transliteration: 'Sabahal-khajr! Hel ente bikhajr?',
          },
        ],
      },
      {
        id: 'd1-2',
        albanian: 'Emri im është Ahmed. Nga vjen ti?',
        arabic: 'اِسْمِي أَحْمَد. مِنْ أَيْنَ أَنْتَ؟',
        transliteration: 'Ismi Ahmed. Min eyne ente?',
        variants: [
          {
            albanian: 'Unë jam Ahmedi. Nga cili vend je?',
            arabic: 'أَنَا أَحْمَد. مِنْ أَيِّ بَلَدٍ أَنْتَ؟',
            transliteration: 'Ene Ahmed. Min ejji beledin ente?',
          },
          {
            albanian: 'Mua më quajnë Ahmed. Po ti nga je?',
            arabic: 'اِسْمِي أَحْمَد. وَأَنْتَ، مِنْ أَيْنَ أَنْتَ؟',
            transliteration: 'Ismi Ahmed. We ente, min eyne ente?',
          },
        ],
      },
      {
        id: 'd1-3',
        albanian: 'Unë jam nga Kosova. Jam student.',
        arabic: 'أَنَا مِنْ كوسوفو. أَنَا طَالِب.',
        transliteration: 'Ene min Kosofo. Ene thalib.',
      },
      {
        id: 'd1-4',
        albanian: 'Ky është libri im. Ai është i ri.',
        arabic: 'هَذَا كِتَابِي. هُوَ جَدِيد.',
        transliteration: 'Hadha kitabi. Huwe xhedid.',
      },
      {
        id: 'd1-5',
        albanian: 'Mirë se të gjeta. Mirupafshim!',
        arabic: 'أَهْلاً وَسَهْلاً. مَعَ السَّلامَةِ!',
        transliteration: "Ehlen we sehlen. Ma'a es-selame!",
      },
      {
        id: 'd1-6',
        albanian: 'Nga cila kombësi je? Unë jam shqiptar.',
        arabic: 'مَا جِنْسِيَّتُكَ؟ أَنَا أَلْبَانِيٌّ.',
        transliteration: 'Ma xhinsijjetuke? Ene albanijj.',
      },
      {
        id: 'd1-7',
        albanian: 'Ai është inxhinier dhe ajo është mjeke.',
        arabic: 'هُوَ مُهَنْدِسٌ وَهِيَ طَبِيبَةٌ.',
        transliteration: 'Huwe muhendis ve hije tabibe.',
      },
    ],
    vocabulary: [
      { id: 'v1-1', arabic: 'اِسْم', albanian: 'Emër', root: 'س-م-و', type: 'noun', gender: 'M' },
      { id: 'v1-2', arabic: 'طَالِب', albanian: 'Student', root: 'ط-ل-ب', type: 'noun', gender: 'M', plural: 'طُلاب' },
      { id: 'v1-3', arabic: 'طَالِبَة', albanian: 'Studente', root: 'ط-ل-ب', type: 'noun', gender: 'F', plural: 'طَالِبَات' },
      { id: 'v1-4', arabic: 'صَدِيق', albanian: 'Shok', root: 'ص-د-ق', type: 'noun', gender: 'M', plural: 'أَصْدِقَاء' },
      { id: 'v1-5', arabic: 'صَدِيقَة', albanian: 'Shoqe', root: 'ص-د-ق', type: 'noun', gender: 'F', plural: 'صَدِيقَات' },
      { id: 'v1-6', arabic: 'مُدَرِّس', albanian: 'Mësues', root: 'د-ر-س', type: 'noun', gender: 'M', plural: 'مُدَرِّسُون' },
      { id: 'v1-7', arabic: 'مُهَنْدِس', albanian: 'Inxhinier', root: 'ه-ن-د-س', type: 'noun', gender: 'M', plural: 'مُهَنْدِسُون' },
      { id: 'v1-8', arabic: 'مُهَنْدِسَة', albanian: 'Inxhiniere', root: 'ه-ن-د-س', type: 'noun', gender: 'F', plural: 'مُهَنْدِسَات' },
      { id: 'v1-9', arabic: 'طَبِيبَة', albanian: 'Mjeke', root: 'ط-ب-ب', type: 'noun', gender: 'F', plural: 'طَبِيبَات' },
      { id: 'v1-10', arabic: 'جِنْسِيَّة', albanian: 'Kombësi', root: 'ج-ن-س', type: 'noun', gender: 'F', plural: 'جِنْسِيَّات' },
      { id: 'v1-11', arabic: 'تَحِيَّة', albanian: 'Përshëndetje', root: 'ح-ي-ي', type: 'noun', gender: 'F', plural: 'تَحِيَّات' },
      { id: 'v1-12', arabic: 'حِوَار', albanian: 'Dialog', root: 'ح-و-ر', type: 'noun', gender: 'M', plural: 'حِوَارَات' },
      { id: 'v1-13', arabic: 'حَال', albanian: 'Gjendje', root: 'ح-و-ل', type: 'noun', gender: 'M' },
      { id: 'v1-14', arabic: 'مِنْ', albanian: 'Nga', root: '-', type: 'particle' },
      { id: 'v1-15', arabic: 'كَيْفَ', albanian: 'Si', root: '-', type: 'particle' },
      { id: 'v1-16', arabic: 'هَلْ', albanian: 'A (pyetje)', root: '-', type: 'particle' },
      { id: 'v1-17', arabic: 'نَظَرَ', albanian: 'Shikoi', root: 'ن-ظ-ر', type: 'verb', present: 'يَنْظُرُ', imperative: 'اُنْظُرْ' },
      { id: 'v1-18', arabic: 'اِسْتَمَعَ', albanian: 'Dëgjoi', root: 'س-م-ع', type: 'verb', present: 'يَسْتَمِعُ', imperative: 'اِسْتَمِعْ' },
      { id: 'v1-19', arabic: 'أَعَادَ', albanian: 'Përsëriti', root: 'ع-و-د', type: 'verb', present: 'يُعِيدُ', imperative: 'أَعِدْ' },
      { id: 'v1-20', arabic: 'أَشَارَ', albanian: 'Tregoi (me gisht)', root: 'ش-و-ر', type: 'verb', present: 'يُشِيرُ', imperative: 'أَشِرْ' },
      { id: 'v1-21', arabic: 'وَضَعَ', albanian: 'Vendosi', root: 'و-ض-ع', type: 'verb', present: 'يَضَعُ', imperative: 'ضَعْ' },
      { id: 'v1-22', arabic: 'سَمِعَ', albanian: 'Dëgjoi', root: 'س-م-ع', type: 'verb', present: 'يَسْمَعُ', imperative: 'اِسْمَعْ' },
      { id: 'v1-23', arabic: 'قَالَ', albanian: 'Tha', root: 'ق-و-ل', type: 'verb', present: 'يَقُولُ', imperative: 'قُلْ' },
      { id: 'v1-24', arabic: 'رَتَّبَ', albanian: 'Rregulloi', root: 'ر-ت-ب', type: 'verb', present: 'يُرَتِّبُ', imperative: 'رَتِّبْ' },
      { id: 'v1-25', arabic: 'تَبَادَلَ', albanian: 'Shkëmbeu', root: 'ب-د-ل', type: 'verb', present: 'يَتَبَادَلُ', imperative: 'تَبَادَلْ' },
      { id: 'v1-26', arabic: 'سَأَلَ', albanian: 'Pyeti', root: 'س-أ-ل', type: 'verb', present: 'يَسْأَلُ', imperative: 'اِسْأَلْ' },
      { id: 'v1-27', arabic: 'أَجَابَ', albanian: 'U përgjigj', root: 'ج-و-ب', type: 'verb', present: 'يُجِيبُ', imperative: 'أَجِبْ' },
      { id: 'v1-28', arabic: 'قَرَأَ', albanian: 'Lexoi', root: 'ق-ر-أ', type: 'verb', present: 'يَقْرَأُ', imperative: 'اِقْرَأْ' },
      { id: 'v1-29', arabic: 'مَرَّ', albanian: 'Kaloi', root: 'م-ر-ر', type: 'verb', present: 'يَمُرُّ', imperative: 'مُرَّ' },
      { id: 'v1-30', arabic: 'نَسَخَ', albanian: 'Kopjoi', root: 'ن-س-خ', type: 'verb', present: 'يَنْسَخُ', imperative: 'اِنْسَخْ' },
      { id: 'v1-31', arabic: 'كِتَاب', albanian: 'Libër', root: 'ك-ت-ب', type: 'noun', gender: 'M', plural: 'كُتُب' },
      { id: 'v1-32', arabic: 'لُغَة', albanian: 'Gjuhë', root: 'ل-غ-و', type: 'noun', gender: 'F', plural: 'لُغَات' },
      { id: 'v1-33', arabic: 'أَخ', albanian: 'Vëlla', root: 'أ-خ-و', type: 'noun', gender: 'M', plural: 'إِخْوَة' },
      { id: 'v1-34', arabic: 'أُخْت', albanian: 'Motër', root: 'أ-خ-و', type: 'noun', gender: 'F', plural: 'أَخَوَات' },
      { id: 'v1-35', arabic: 'دَرْس', albanian: 'Mësim', root: 'د-ر-س', type: 'noun', gender: 'M', plural: 'دُرُوس' },
      { id: 'v1-36', arabic: 'صُورَة', albanian: 'Fotografi', root: 'ص-و-ر', type: 'noun', gender: 'F', plural: 'صُوَر' },
      { id: 'v1-37', arabic: 'سُؤَال', albanian: 'Pyetje', root: 'س-أ-ل', type: 'noun', gender: 'M', plural: 'أَسْئِلَة' },
      { id: 'v1-38', arabic: 'زَمِيل', albanian: 'Koleg', root: 'ز-م-ل', type: 'noun', gender: 'M', plural: 'زُمَلاء' },
      { id: 'v1-39', arabic: 'جُمْلَة', albanian: 'Fjali', root: 'ج-م-ل', type: 'noun', gender: 'F', plural: 'جُمَل' },
      { id: 'v1-40', arabic: 'كَلِمَة', albanian: 'Fjalë', root: 'ك-ل-م', type: 'noun', gender: 'F', plural: 'كَلِمَات' },
      { id: 'v1-41', arabic: 'وَحْدَة', albanian: 'Njësi', root: 'و-ح-د', type: 'noun', gender: 'F', plural: 'وَحَدَات' },
      { id: 'v1-42', arabic: 'طَبِيب', albanian: 'Mjek', root: 'ط-ب-ب', type: 'noun', gender: 'M', plural: 'أَطِبَّاء' },
      { id: 'v1-43', arabic: 'تَدْرِيب', albanian: 'Ushtrim', root: 'د-ر-ب', type: 'noun', gender: 'M', plural: 'تَدْرِيبَات' },
      { id: 'v1-44', arabic: 'عَدَد', albanian: 'Numër (sasi)', root: 'ع-د-د', type: 'noun', gender: 'M', plural: 'أَعْدَاد' },
      { id: 'v1-45', arabic: 'جَوَاب', albanian: 'Përgjigje', root: 'ج-و-ب', type: 'noun', gender: 'M', plural: 'أَجْوِبَة' },
      { id: 'v1-46', arabic: 'مِثَال', albanian: 'Shembull', root: 'م-ث-ل', type: 'noun', gender: 'M', plural: 'أَمْثِلَة' },
      { id: 'v1-47', arabic: 'رَقْم', albanian: 'Numër (shifër)', root: 'ر-ق-م', type: 'noun', gender: 'M', plural: 'أَرْقَام' },
      { id: 'v1-48', arabic: 'عَلَامَة', albanian: 'Shenjë', root: 'ع-ل-م', type: 'noun', gender: 'F', plural: 'عَلَامَات' },
    ],
    grammarFocus: [
      'Përemrat vetorë: أَنَا (Ene), أَنْتَ (Ente), أَنْتِ (Enti), هُوَ (Huwe), هِيَ (Hije)',
      'Emrat tregues: هَذَا (Hadha) / هَذِهِ (Hadhihi)',
      'Nisba (ـيّ / ـيَّة) për kombësinë: أَلْبَانِيّ / أَلْبَانِيَّة',
      'Fjalia emërore: mubteda (kryefjalë) + khabar (kallëzues)',
    ],
    exercises: [
      {
        id: 'ex1-1',
        type: 'transform',
        prompt: 'Zëvendëso përemrin أَنْتَ me أَنْتِ dhe rregullo mbiemrin',
        source: { arabic: 'أَنْتَ طَالِبٌ.', albanian: 'Ti (m.) je student.' },
        answer: 'أَنْتِ طَالِبَةٌ.',
        hint: 'Ente → Enti dhe emri merr ة në femërore.',
        grammarPoint: 'Përemrat vetorë',
      },
      {
        id: 'ex1-2',
        type: 'transform',
        prompt: 'Ndërro fjalinë në femërore (përdor هَذِهِ)',
        source: { arabic: 'هَذَا مُهَنْدِسٌ.', albanian: 'Ky është inxhinier.' },
        answer: 'هَذِهِ مُهَنْدِسَةٌ.',
        hint: 'Hadha → Hadhihi; مُهَنْدِس → مُهَنْدِسَة.',
        grammarPoint: 'Emrat tregues',
      },
      {
        id: 'ex1-3',
        type: 'transform',
        prompt: 'Forma nisba femërore e kombësisë "shqiptare"',
        source: { arabic: 'أَلْبَانِيّ', albanian: 'shqiptar' },
        answer: 'أَلْبَانِيَّةٌ',
        hint: 'Shto ـَة te forma mashkullore e nisbës (ـيّ → ـيَّة).',
        grammarPoint: 'Nisba',
      },
      {
        id: 'ex1-4',
        type: 'transform',
        prompt: 'Ndërto një fjali emërore: "Ahmedi është shqiptar"',
        source: { arabic: 'أَحْمَد + أَلْبَانِيّ', albanian: 'Ahmedi + shqiptar' },
        answer: 'أَحْمَدُ أَلْبَانِيٌّ.',
        hint: 'Mubteda + khabar, pa folje ndihmëse në të tashmen.',
        grammarPoint: 'Fjalia emërore',
      },
      {
        id: 'ex1-5',
        type: 'transform',
        prompt: 'Zëvendëso هُوَ me هِيَ dhe rregullo',
        source: { arabic: 'هُوَ طَبِيبٌ.', albanian: 'Ai është mjek.' },
        answer: 'هِيَ طَبِيبَةٌ.',
        hint: 'Huwe → Hije; mbaresa ة në femërore.',
        grammarPoint: 'Përputhja M/F',
      },
      {
        id: 'ex1-6',
        type: 'transform',
        prompt: 'Forma femërore e nisbës për "kosovar"',
        source: { arabic: 'كُوسُوفِيّ', albanian: 'kosovar' },
        answer: 'كُوسُوفِيَّةٌ',
        hint: 'ـيّ → ـيَّة për femëroren.',
        grammarPoint: 'Nisba',
      },
    ],
    stories: [
      {
        id: 's1-1',
        titleAl: 'Musa prezantohet',
        albanian:
          'Es-selamu alejkum! Emri im është Musa. Unë jam nga Kosova, jam student. Ky është libri im i ri dhe ai është shoku im Ahmedi. Ahmedi është nga Egjipti, ai gjithashtu është student. Mirë se të gjeta! Mirupafshim!',
        arabic:
          'السَّلامُ عَلَيْكُم! اِسْمِي مُوسَى. أَنَا مِنْ كُوسُوفُو، أَنَا طَالِب. هَذَا كِتَابِي الْجَدِيد وَذَلِكَ صَدِيقِي أَحْمَد. أَحْمَد مِنْ مِصْر، هُوَ أَيْضاً طَالِب. أَهْلاً وَسَهْلاً! مَعَ السَّلامَة!',
        transliteration:
          "Es-selamu alejkum! Ismi Musa. Ene min Kosofo, ene talib. Hadha kitabil xhedid ve dhalike sadiki Ahmed. Ahmed min Misr, huwe ejden talib. Ehlen we sehlen! Ma'a es-selame!",
        variants: [
          {
            // Same "Musa prezanton veten dhe një shok nga Egjipti" — core
            // vocab (ism, talib, kitab, sadik, min, hadha/dhalike) retained,
            // but sentence structure flipped and ordering reshuffled so
            // the student hears the same meaning with different scaffolding.
            albanian:
              'Përshëndetje! Unë quhem Musa, jam student nga Kosova. Shoku im Ahmedi është gjithashtu student; ai vjen nga Egjipti. Ky është libri i tij, ndërsa ai atje është libri im. Mirë se erdhët!',
            arabic:
              'السَّلامُ عَلَيْكُم! اِسْمِي مُوسَى، أَنَا طَالِب مِنْ كُوسُوفُو. صَدِيقِي أَحْمَد طَالِب أَيْضاً؛ هُوَ مِنْ مِصْر. هَذَا كِتَابُهُ، وَذَلِكَ كِتَابِي. أَهْلاً وَسَهْلاً!',
            transliteration:
              'Es-selamu alejkum! Ismi Musa, ene talib min Kosofo. Sadiki Ahmed talib ejden; huwe min Misr. Hadha kitabuhu, we dhalike kitabi. Ehlen we sehlen!',
          },
          {
            // Third retelling, dialogue-leaning: Musa addresses the reader
            // directly with questions. Reuses the same vocab set but
            // introduces the learner to a conversational rhythm.
            albanian:
              'Përshëndetje shoku im! Emri im është Musa dhe unë jam student. Ky është libri im. Ky është Ahmedi, ai është shoku im nga Egjipti; edhe ai është student. Unë jam nga Kosova. Mirupafshim!',
            arabic:
              'السَّلامُ عَلَيْكُم يَا صَدِيقِي! اِسْمِي مُوسَى وَأَنَا طَالِب. هَذَا كِتَابِي. هَذَا أَحْمَد، هُوَ صَدِيقِي مِنْ مِصْر؛ هُوَ أَيْضاً طَالِب. أَنَا مِنْ كُوسُوفُو. مَعَ السَّلامَة!',
            transliteration:
              "Es-selamu alejkum ja sadiki! Ismi Musa we ene talib. Hadha kitabi. Hadha Ahmed, huwe sadiki min Misr; huwe ejden talib. Ene min Kosofo. Ma'a es-selame!",
          },
        ],
      },
    ],
    ayat: [
      {
        // The shortest, most famous verse in the Mus·haf — and it opens
        // with هُوَ, a chapter-1 pronoun. A beginner reading "Ai, Allahu
        // është Një" and recognizing هُوَ from their very first lesson
        // feels the whole project click into place.
        reference: '112:1',
        surahNameAr: 'الإِخْلاص',
        surahNameAl: 'El-Ihlas',
        arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
        albanian: 'Thuaj: Ai, Allahu është Një!',
        knownWords: [{ surface: 'هُوَ', gloss: 'Ai' }],
      },
      {
        // Allah speaking in the first person — أَنَا appears twice in
        // this short passage, exactly the pronoun the student met in
        // dialogue d1-2 ("Emri im është Ahmed… أَنَا مِنْ …").
        reference: '20:14',
        surahNameAr: 'طه',
        surahNameAl: 'Taha',
        arabic: 'إِنَّنِي أَنَا اللَّهُ لَا إِلَٰهَ إِلَّا أَنَا',
        albanian: 'Vërtet, Unë jam Allahu, s\'ka zot tjetër përveç Meje.',
        knownWords: [{ surface: 'أَنَا', gloss: 'Unë' }],
      },
      {
        // Plural of اِسْم — the very first vocabulary entry of the
        // curriculum. The student learned "emër" in the singular on
        // page one; here the Qur'an shows Allah teaching Adam ALL the
        // names. The vocabulary-to-scripture bridge is direct.
        reference: '2:31',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic: 'وَعَلَّمَ آدَمَ الْأَسْمَاءَ كُلَّهَا',
        albanian: 'Dhe Ai ia mësoi Ademit të gjithë emrat.',
        knownWords: [
          { surface: 'الْأَسْمَاءَ', gloss: 'emrat (shumësi i اِسْم)' },
        ],
      },
      {
        // Opening of Sūrat al-A'lā — a verse most learners have heard
        // recited countless times, built around the word اسْم. Lands
        // after v1-1 clicks into place: "wait, I already know this
        // first word of that surah."
        reference: '87:1',
        surahNameAr: 'الأَعْلَى',
        surahNameAl: 'El-A\'la',
        arabic: 'سَبِّحِ اسْمَ رَبِّكَ الْأَعْلَى',
        albanian: 'Madhëro emrin e Zotit tënd, Më të Lartit!',
        knownWords: [{ surface: 'اسْمَ', gloss: 'emrin' }],
      },
      {
        // Surat al-Hadid 57:3 — هُوَ appears TWICE, bookending the
        // verse. Short, rhythmic, and famous. Perfect reinforcement
        // for the هُوَ the student already met in d1-1.
        reference: '57:3',
        surahNameAr: 'الحَدِيد',
        surahNameAl: 'El-Hadid',
        arabic:
          'هُوَ الْأَوَّلُ وَالْآخِرُ وَالظَّاهِرُ وَالْبَاطِنُ ۖ وَهُوَ بِكُلِّ شَيْءٍ عَلِيمٌ',
        albanian:
          'Ai është i Pari dhe i Fundit, i Dukshmi dhe i Padukshmi; dhe Ai di çdo gjë.',
        knownWords: [{ surface: 'هُوَ', gloss: 'Ai' }],
      },
      {
        // Sad 38:49 opens with هَٰذَا — the Mus·haf spelling uses the
        // alif khanjariyya (superscript alif) instead of the textbook
        // هَذَا. Functionally the same pronoun; we call that out in
        // the gloss so the learner isn't confused by the visual diff.
        reference: '38:49',
        surahNameAr: 'ص',
        surahNameAl: 'Sad',
        arabic: 'هَٰذَا ذِكْرٌ ۚ وَإِنَّ لِلْمُتَّقِينَ لَحُسْنَ مَآبٍ',
        albanian:
          'Ky është një përkujtim; e vërtet, të devotshmit kanë kthim të mrekullueshëm.',
        knownWords: [
          {
            surface: 'هَٰذَا',
            gloss: 'ky (drejtshkrimi kuranor i هَذَا)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 2,
    titleAr: 'الأُسْرَة',
    titleAl: 'Familja',
    titleEn: 'The Family',
    dialogues: [
      {
        id: 'd2-1',
        albanian: 'Ky është babai im. Ai është mjek.',
        arabic: 'هَذَا وَالِدِي. هُوَ طَبِيبٌ.',
        transliteration: 'Hadha walidi. Huwe tabib.',
      },
      {
        id: 'd2-2',
        albanian: 'Kjo është nëna ime. Ajo është mësuese.',
        arabic: 'هَذِهِ وَالِدَتِي. هِيَ مُعَلِّمَةٌ.',
        transliteration: "Hadhihi walideti. Hije mu'allime.",
      },
      {
        id: 'd2-3',
        albanian: 'Kush është ky djalë? Ai është vëllai im.',
        arabic: 'مَنْ هَذَا الوَلَدُ؟ هُوَ أَخِي.',
        transliteration: 'Men hadhel veled? Huwe ekhi.',
      },
      {
        id: 'd2-4',
        albanian: 'Kam dy vëllezër dhe një motër.',
        arabic: 'لِي أَخَوَانِ وَأُخْتٌ وَاحِدَةٌ.',
        transliteration: 'Li ekhevani ve ukhtun wahide.',
      },
      {
        id: 'd2-5',
        albanian: 'Gjyshi dhe gjyshja janë në shtëpi.',
        arabic: 'الجَدُّ وَالجَدَّةُ فِي البَيْتِ.',
        transliteration: 'El-xhedd vel xhedde fil bejt.',
      },
      {
        id: 'd2-6',
        albanian: 'Hajde, le ta falim namazin bashkë.',
        arabic: 'هَيَّا بِنَا نُصَلِّي جَمَاعَةً.',
        transliteration: 'Hejja bina nusal-li xhema‘aten.',
      },
    ],
    vocabulary: [
      { id: 'v2-1', arabic: 'أُسْرَة', albanian: 'Familje', root: 'أ-س-ر', type: 'noun', gender: 'F', plural: 'أُسَر' },
      { id: 'v2-2', arabic: 'وَالِد', albanian: 'Baba', root: 'و-ل-د', type: 'noun', gender: 'M', plural: 'آبَاء' },
      { id: 'v2-3', arabic: 'وَالِدَة', albanian: 'Nënë', root: 'و-ل-د', type: 'noun', gender: 'F', plural: 'أُمَّهَات' },
      { id: 'v2-4', arabic: 'أَب', albanian: 'Baba', root: 'أ-ب-و', type: 'noun', gender: 'M', plural: 'آبَاء' },
      { id: 'v2-5', arabic: 'أُمّ', albanian: 'Nënë', root: 'أ-م-م', type: 'noun', gender: 'F', plural: 'أُمَّهَات' },
      { id: 'v2-6', arabic: 'أَخ', albanian: 'Vëlla', root: 'أ-خ-و', type: 'noun', gender: 'M', plural: 'إِخْوَة' },
      { id: 'v2-7', arabic: 'أُخْت', albanian: 'Motër', root: 'أ-خ-ت', type: 'noun', gender: 'F', plural: 'أَخَوَات' },
      { id: 'v2-8', arabic: 'اِبْن', albanian: 'Bir', root: 'ب-ن-و', type: 'noun', gender: 'M', plural: 'أَبْنَاء' },
      { id: 'v2-9', arabic: 'اِبْنَة', albanian: 'Bijë', root: 'ب-ن-و', type: 'noun', gender: 'F', plural: 'بَنَات' },
      { id: 'v2-10', arabic: 'وَلَد', albanian: 'Djalë', root: 'و-ل-د', type: 'noun', gender: 'M', plural: 'أَوْلَاد' },
      { id: 'v2-11', arabic: 'جَدّ', albanian: 'Gjysh', root: 'ج-د-د', type: 'noun', gender: 'M', plural: 'أَجْدَاد' },
      { id: 'v2-12', arabic: 'جَدَّة', albanian: 'Gjyshe', root: 'ج-د-د', type: 'noun', gender: 'F', plural: 'جَدَّات' },
      { id: 'v2-13', arabic: 'عَمّ', albanian: 'Xhaxha', root: 'ع-م-م', type: 'noun', gender: 'M', plural: 'أَعْمَام' },
      { id: 'v2-14', arabic: 'عَمَّة', albanian: 'Hallë', root: 'ع-م-م', type: 'noun', gender: 'F', plural: 'عَمَّات' },
      { id: 'v2-15', arabic: 'مُعَلِّمَة', albanian: 'Mësuese', root: 'ع-ل-م', type: 'noun', gender: 'F', plural: 'مُعَلِّمَات' },
      { id: 'v2-16', arabic: 'صُورَة', albanian: 'Fotografi', root: 'ص-و-ر', type: 'noun', gender: 'F', plural: 'صُوَر' },
      { id: 'v2-17', arabic: 'رَسُول', albanian: 'I dërguar', root: 'ر-س-ل', type: 'noun', gender: 'M', plural: 'رُسُل' },
      { id: 'v2-18', arabic: 'صَلَّى', present: 'يُصَلِّي', imperative: 'صَلِّ', albanian: 'U fal', root: 'ص-ل-و', type: 'verb' },
      { id: 'v2-19', arabic: 'قَرَأَ', present: 'يَقْرَأُ', imperative: 'اِقْرَأْ', albanian: 'Lexoi', root: 'ق-ر-أ', type: 'verb' },
      { id: 'v2-20', arabic: 'مَنْ', albanian: 'Kush', root: '-', type: 'particle' },
      { id: 'v2-21', arabic: 'تَوَضَّأَ', albanian: 'Mori abdes', root: 'و-ض-أ', type: 'verb', present: 'يَتَوَضَّأُ', imperative: 'تَوَضَّأْ' },
      { id: 'v2-22', arabic: 'فَعَلَ', albanian: 'Bëri', root: 'ف-ع-ل', type: 'verb', present: 'يَفْعَلُ', imperative: 'اِفْعَلْ' },
      { id: 'v2-23', arabic: 'حَمَّام', albanian: 'Banjë', root: 'ح-م-م', type: 'noun', gender: 'M', plural: 'حَمَّامَات' },
      { id: 'v2-24', arabic: 'غُرْفَة', albanian: 'Dhomë', root: 'غ-ر-ف', type: 'noun', gender: 'F', plural: 'غُرَف' },
      { id: 'v2-25', arabic: 'نَظَّارَة', albanian: 'Syze', root: 'ن-ظ-ر', type: 'noun', gender: 'F', plural: 'نَظَّارَات' },
      { id: 'v2-26', arabic: 'مُعَلِّم', albanian: 'Mësues', root: 'ع-ل-م', type: 'noun', gender: 'M', plural: 'مُعَلِّمُون' },
      { id: 'v2-27', arabic: 'شَجَرَة', albanian: 'Pemë', root: 'ش-ج-ر', type: 'noun', gender: 'F', plural: 'أَشْجَار' },
      { id: 'v2-28', arabic: 'مِعْطَف', albanian: 'Pallto', root: 'ع-ط-ف', type: 'noun', gender: 'M', plural: 'مَعَاطِف' },
      { id: 'v2-29', arabic: 'مَسْجِد', albanian: 'Xhami', root: 'س-ج-د', type: 'noun', gender: 'M', plural: 'مَسَاجِد' },
    ],
    grammarFocus: [
      'Mbaresat pronëzuese: ـي (-i, im), ـكَ (-ke, yt), ـهُ (-hu, i tij), ـهَا (-ha, i saj)',
      'Idafa (lidhja pronësore): وَالِدُ مُوسَى (babai i Musait)',
      'Dualë (muthenna): أَخَوَانِ (dy vëllezër), بِنْتَانِ (dy bija)',
      'هَيَّا بِنَا + folje: Hajde të…',
    ],
    // Proof-of-concept: transformation drills pulled from Bayna Yadayk
    // ch.2 "At-Tarakib an-Nahwiyya". Each exercise asks the student to
    // rewrite one structure into another (gender, pronoun, pronouncement)
    // so the rule becomes muscle memory rather than a flashcard fact.
    exercises: [
      {
        id: 'ex2-1',
        type: 'transform',
        prompt: 'Ndërro në femërore (përdor هَذِهِ dhe ـَة)',
        source: { arabic: 'هَذَا طَالِبٌ.', albanian: 'Ky është student.' },
        answer: 'هَذِهِ طَالِبَةٌ.',
        hint: 'Hadha → Hadhihi, dhe shto tā marbūṭa (ة) në fund të طَالِب.',
        grammarPoint: 'Gjinia (ة)',
      },
      {
        id: 'ex2-2',
        type: 'transform',
        prompt: 'Ndërro në femërore',
        source: { arabic: 'هَذَا مُدَرِّسٌ.', albanian: 'Ky është mësues.' },
        answer: 'هَذِهِ مُدَرِّسَةٌ.',
        hint: 'مُدَرِّس → مُدَرِّسَة',
        grammarPoint: 'Gjinia (ة)',
      },
      {
        id: 'ex2-3',
        type: 'transform',
        prompt: 'Zëvendëso هُوَ me هِيَ dhe rregullo mbiemrin',
        source: { arabic: 'هُوَ طَبِيبٌ جَدِيدٌ.', albanian: 'Ai është mjek i ri.' },
        answer: 'هِيَ طَبِيبَةٌ جَدِيدَةٌ.',
        hint: 'Si emri edhe mbiemri marrin ة në femërore.',
        grammarPoint: 'Përputhja M/F',
      },
      {
        id: 'ex2-4',
        type: 'transform',
        prompt: 'Shto përemrin pronor "im" (ـِي) te fjala',
        source: { arabic: 'كِتَاب', albanian: 'libër' },
        answer: 'كِتَابِي',
        hint: 'ـي ngjitet drejtpërdrejt; pa "AL" përpara.',
        grammarPoint: 'Mbaresa ـِي',
      },
      {
        id: 'ex2-5',
        type: 'transform',
        prompt: 'Shto mbaresën "i tij" (ـهُ)',
        source: { arabic: 'بَيْت', albanian: 'shtëpi' },
        answer: 'بَيْتُهُ',
        hint: 'Mbaresa pronore bën emrin të caktuar — s\'duhet "AL".',
        grammarPoint: 'Mbaresa ـهُ',
      },
      {
        id: 'ex2-6',
        type: 'transform',
        prompt: 'Ndërro në dyjës (dy sende — mbaresa ـَانِ)',
        source: { arabic: 'أَخٌ', albanian: 'vëlla' },
        answer: 'أَخَوَانِ',
        hint: 'Dyjësi i أَخ ka bashkëtingëlloren wāw të brendshme: أَخَوَانِ.',
        grammarPoint: 'Dyjësi (المثنى)',
      },
      {
        id: 'ex2-7',
        type: 'transform',
        prompt: 'Ndërto idafën: "babai i Musait"',
        source: { arabic: 'وَالِد + مُوسَى', albanian: 'babai + Musa' },
        answer: 'وَالِدُ مُوسَى',
        hint: 'Emri i parë humbet "AL" dhe merr damme (ـُ) pa tenvin.',
        grammarPoint: 'Idafa',
      },
    ],
    stories: [
      {
        id: 's2-1',
        titleAl: 'Familja e Musait',
        albanian:
          'Familja ime është e madhe dhe e dashur. Babai im është mjek dhe punon në spital, kurse nëna ime është mësuese në shkollë. Kam dy vëllezër të mëdhenj dhe një motër të vogël. Gjyshi dhe gjyshja banojnë me ne në shtëpi. Çdo mbrëmje hamë së bashku, pastaj falim namazin si xhemat. Elhamdulilah, Allahu na ka dhuruar familje të bekuar.',
        arabic:
          'أُسْرَتِي كَبِيرَةٌ وَحَبِيبَةٌ. وَالِدِي طَبِيبٌ وَيَعْمَلُ فِي المُسْتَشْفَى، وَوَالِدَتِي مُعَلِّمَةٌ فِي المَدْرَسَةِ. لِي أَخَوَانِ كَبِيرَانِ وَأُخْتٌ صَغِيرَةٌ. جَدِّي وَجَدَّتِي يَسْكُنَانِ مَعَنَا فِي البَيْتِ. كُلَّ مَسَاءٍ نَأْكُلُ جَمِيعاً، ثُمَّ نُصَلِّي جَمَاعَةً. الحَمْدُ لِلَّهِ، أَعْطَانَا اللَّهُ أُسْرَةً مُبَارَكَةً.',
        transliteration:
          "Usreti kebire ve habibe. Walidi tabib ve ja'melu fil mustashfa, ve walideti mu'al-lime fil medrese. Li ekhevani kebirani ve ukhtun sagire. Xheddi ve xheddeti jeskunani ma'ana fil bejt. Kul-le mesa'in ne'kulu xhemi'an, thumme nusal-li xhema'aten. Elhamdulilah, e'tanallahu usreten mubareke.",
      },
    ],
    ayat: [
      {
        // ʿĪsā (peace be upon him) describing himself as a son devoted
        // to his mother. بِوَالِدَتِي carries the chapter-2 vocab word
        // وَالِدَة with the kasra-pronoun chain the student has just
        // started learning. One of the most iconic "family" verses.
        reference: '19:32',
        surahNameAr: 'مَرْيَم',
        surahNameAl: 'Merjem',
        arabic: 'وَبَرًّا بِوَالِدَتِي وَلَمْ يَجْعَلْنِي جَبَّارًا شَقِيًّا',
        albanian:
          'Dhe (më bëri) të mirëseshëm ndaj nënës sime, e nuk më bëri kryelartë e të pabindur.',
        knownWords: [
          { surface: 'وَالِدَتِي', gloss: 'nëna ime' },
        ],
      },
      {
        // Luqmān advising his son — a whole family scene (ابْن + هُوَ)
        // compressed into one verse. هُوَ is also a bonus carry-over
        // from chapter 1, letting the student tick off two different
        // chapters' words in a single ayah.
        reference: '31:13',
        surahNameAr: 'لُقْمَان',
        surahNameAl: 'Lukman',
        arabic:
          'وَإِذْ قَالَ لُقْمَانُ لِابْنِهِ وَهُوَ يَعِظُهُ يَا بُنَيَّ لَا تُشْرِكْ بِاللَّهِ ۖ إِنَّ الشِّرْكَ لَظُلْمٌ عَظِيمٌ',
        albanian:
          'Dhe kur Llukmani, duke e këshilluar, i tha të birit: O djali im, mos i shoqëro Allahut asgjë; vërtet shirku është padrejtësi e madhe.',
        knownWords: [
          { surface: 'ابْنِهِ', gloss: 'birin e tij (nga اِبْن)' },
          { surface: 'هُوَ', gloss: 'ai' },
        ],
      },
      {
        // Maryam 19:28 — three family words in a single short verse:
        // أُخْت (motër), أَب (baba), أُمّ (nënë). For a chapter-2 reader
        // this is almost a complete family album in one line of
        // scripture.
        reference: '19:28',
        surahNameAr: 'مَرْيَم',
        surahNameAl: 'Merjem',
        arabic:
          'يَا أُخْتَ هَارُونَ مَا كَانَ أَبُوكِ امْرَأَ سَوْءٍ وَمَا كَانَتْ أُمُّكِ بَغِيًّا',
        albanian:
          'O motra e Harunit, babai yt nuk ishte njeri i keq e as nëna jote nuk ishte e shfrenuar.',
        knownWords: [
          { surface: 'أُخْتَ', gloss: 'motra' },
          { surface: 'أَبُوكِ', gloss: 'babai yt (nga أَب)' },
          { surface: 'أُمُّكِ', gloss: 'nëna jote (nga أُمّ)' },
        ],
      },
      {
        // 33:40 — links two chapter-2 nouns (أَب, رَسُول) in a verse
        // central to the Prophet's (ﷺ) identity. Great for showing
        // that "rasul" — learned as a vocab word — is literally the
        // title of the Prophet in scripture.
        reference: '33:40',
        surahNameAr: 'الأَحْزَاب',
        surahNameAl: 'El-Ahzab',
        arabic:
          'مَّا كَانَ مُحَمَّدٌ أَبَا أَحَدٍ مِّن رِّجَالِكُمْ وَلَٰكِن رَّسُولَ اللَّهِ وَخَاتَمَ النَّبِيِّينَ ۗ وَكَانَ اللَّهُ بِكُلِّ شَيْءٍ عَلِيمًا',
        albanian:
          'Muhamedi nuk është babai i asnjërit prej burrave tuaj, por është i dërguari i Allahut dhe vula e pejgamberëve; e Allahu di çdo gjë.',
        knownWords: [
          { surface: 'أَبَا', gloss: 'baba (nga أَب)' },
          { surface: 'رَسُولَ', gloss: 'i dërguar' },
        ],
      },
      {
        // Bridges the chapter-2 verb صَلَّى (u fal) to its noun form
        // الصَّلَاة (namaz). Same ص-ل-و root, and one of the most
        // frequently recited commands in the Qur'an.
        reference: '2:43',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
        albanian:
          'Faleni namazin, jepeni zekatin, dhe përkuluni bashkë me ata që përkulen.',
        knownWords: [
          {
            surface: 'الصَّلَاةَ',
            gloss: 'namazin (emër nga rrënja ص-ل-و, si صَلَّى)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 3,
    titleAr: 'السَّكَن',
    titleAl: 'Banesa',
    titleEn: 'Housing',
    dialogues: [
      {
        id: 'd3-1',
        albanian: 'Mirësevini! Urdhëroni brenda.',
        arabic: 'أَهْلاً وَسَهْلاً! تَفَضَّلْ، اُدْخُلْ.',
        transliteration: 'Ehlen we sehlen! Tefaddal, udkhul.',
      },
      {
        id: 'd3-2',
        albanian: 'A ke banesë të re në këtë lagje?',
        arabic: 'هَلْ لَدَيْكَ شَقَّةٌ جَدِيدَةٌ فِي هَذَا الحَيِّ؟',
        transliteration: 'Hel ledejke shakketun xhedide fi hadhel hajj?',
      },
      {
        id: 'd3-3',
        albanian: 'Po, në katin e tretë, numër pesë.',
        arabic: 'نَعَمْ، فِي الدَّوْرِ الثَّالِثِ، رَقْمُ خَمْسَةَ.',
        transliteration: 'Ne‘am, fid-devrith-thalith, rakmu khamse.',
      },
      {
        id: 'd3-4',
        albanian: 'Sa dhoma ka shtëpia juaj?',
        arabic: 'كَمْ غُرْفَةً فِي بَيْتِكُمْ؟',
        transliteration: 'Kem gurfeten fi bejtikum?',
      },
      {
        id: 'd3-5',
        albanian: 'Ne duam të marrim me qira një shtëpi.',
        arabic: 'نُرِيدُ أَنْ نَسْتَأْجِرَ بَيْتاً.',
        transliteration: "Nuridu en neste'xhire bejten.",
      },
      {
        id: 'd3-6',
        albanian: 'Në lagjen e universitetit, ju lutem.',
        arabic: 'فِي حَيِّ الجَامِعَةِ، مِنْ فَضْلِكَ.',
        transliteration: 'Fi hajjil xhami‘a, min fadlik.',
      },
    ],
    vocabulary: [
      { id: 'v3-1', arabic: 'بَيْت', albanian: 'Shtëpi', root: 'ب-ي-ت', type: 'noun', gender: 'M', plural: 'بُيُوت' },
      { id: 'v3-2', arabic: 'شَقَّة', albanian: 'Banesë', root: 'ش-ق-ق', type: 'noun', gender: 'F', plural: 'شُقَق' },
      { id: 'v3-3', arabic: 'غُرْفَة', albanian: 'Dhomë', root: 'غ-ر-ف', type: 'noun', gender: 'F', plural: 'غُرَف' },
      { id: 'v3-4', arabic: 'غُرْفَةُ النَّوْمِ', albanian: 'Dhoma e gjumit', root: 'ن-و-م', type: 'noun', gender: 'F' },
      { id: 'v3-5', arabic: 'غُرْفَةُ الجُلُوسِ', albanian: 'Dhoma e ndenjës', root: 'ج-ل-س', type: 'noun', gender: 'F' },
      { id: 'v3-6', arabic: 'مَطْبَخ', albanian: 'Kuzhinë', root: 'ط-ب-خ', type: 'noun', gender: 'M', plural: 'مَطَابِخ' },
      { id: 'v3-7', arabic: 'حَمَّام', albanian: 'Banjë', root: 'ح-م-م', type: 'noun', gender: 'M', plural: 'حَمَّامَات' },
      { id: 'v3-8', arabic: 'بَاب', albanian: 'Derë', root: 'ب-و-ب', type: 'noun', gender: 'M', plural: 'أَبْوَاب' },
      { id: 'v3-9', arabic: 'دَوْر', albanian: 'Kat', root: 'د-و-ر', type: 'noun', gender: 'M', plural: 'أَدْوَار' },
      { id: 'v3-10', arabic: 'حَيّ', albanian: 'Lagje', root: 'ح-ي-ي', type: 'noun', gender: 'M', plural: 'أَحْيَاء' },
      { id: 'v3-11', arabic: 'سَرِير', albanian: 'Shtrat', root: 'س-ر-ر', type: 'noun', gender: 'M', plural: 'أَسِرَّة' },
      { id: 'v3-12', arabic: 'أَرِيكَة', albanian: 'Divan', root: 'أ-ر-ك', type: 'noun', gender: 'F', plural: 'أَرَائِك' },
      { id: 'v3-13', arabic: 'سِتَارَة', albanian: 'Perde', root: 'س-ت-ر', type: 'noun', gender: 'F', plural: 'سَتَائِر' },
      { id: 'v3-14', arabic: 'سَجَّادَة', albanian: 'Qilim', root: 'س-ج-د', type: 'noun', gender: 'F', plural: 'سَجَّاد' },
      { id: 'v3-15', arabic: 'ثَلَّاجَة', albanian: 'Frigorifer', root: 'ث-ل-ج', type: 'noun', gender: 'F', plural: 'ثَلَّاجَات' },
      { id: 'v3-16', arabic: 'فُرْن', albanian: 'Furrë', root: 'ف-ر-ن', type: 'noun', gender: 'M', plural: 'أَفْرَان' },
      { id: 'v3-17', arabic: 'مِرْآة', albanian: 'Pasqyrë', root: 'ر-أ-ي', type: 'noun', gender: 'F', plural: 'مَرَايَا' },
      { id: 'v3-18', arabic: 'سَكَنَ', present: 'يَسْكُنُ', imperative: 'اُسْكُنْ', albanian: 'Banoi', root: 'س-ك-ن', type: 'verb' },
      { id: 'v3-19', arabic: 'اسْتَأْجَرَ', present: 'يَسْتَأْجِرُ', imperative: 'اِسْتَأْجِرْ', albanian: 'Mori me qira', root: 'أ-ج-ر', type: 'verb' },
      { id: 'v3-20', arabic: 'دَخَلَ', present: 'يَدْخُلُ', imperative: 'اُدْخُلْ', albanian: 'Hyri', root: 'د-خ-ل', type: 'verb' },
      { id: 'v3-21', arabic: 'جَمِيل', albanian: 'I bukur', root: 'ج-م-ل', type: 'adjective', gender: 'M' },
      { id: 'v3-22', arabic: 'قَبِيح', albanian: 'I shëmtuar', root: 'ق-ب-ح', type: 'adjective', gender: 'M' },
      { id: 'v3-23', arabic: 'كَمْ', albanian: 'Sa', root: '-', type: 'particle' },
      { id: 'v3-24', arabic: 'أَيّ', albanian: 'Cili', root: '-', type: 'particle' },
      { id: 'v3-25', arabic: 'أَرَادَ', albanian: 'Dëshiroi', root: 'ر-و-د', type: 'verb', present: 'يُرِيدُ', imperative: 'أَرِدْ' },
      { id: 'v3-26', arabic: 'جَامِعَة', albanian: 'Universitet', root: 'ج-م-ع', type: 'noun', gender: 'F', plural: 'جَامِعَات' },
      { id: 'v3-27', arabic: 'سَخَّان', albanian: 'Bojler', root: 'س-خ-ن', type: 'noun', gender: 'M', plural: 'سَخَّانَات' },
      { id: 'v3-28', arabic: 'مَطَار', albanian: 'Aeroport', root: 'ط-ي-ر', type: 'noun', gender: 'M', plural: 'مَطَارَات' },
    ],
    grammarFocus: [
      'لَدَى + përemër: لَدَيَّ / لَدَيْنَا / لَدَيْكَ / لَدَيْهِ (kam, kemi, ke, ka)',
      'Parafjala في (fi — në): fi hadhel bejt',
      'Pyetje me كَمْ (sa) + emri në tenvin kallëzor: kem gurfeten',
      'Urdhërore e kortezisë: تَفَضَّلْ / اُدْخُلْ',
    ],
    exercises: [
      {
        id: 'ex3-1',
        type: 'transform',
        prompt: 'Shndërro لَدَيَّ në formën "ne kemi"',
        source: { arabic: 'لَدَيَّ شَقَّةٌ جَدِيدَةٌ.', albanian: 'Unë kam një banesë të re.' },
        answer: 'لَدَيْنَا شَقَّةٌ جَدِيدَةٌ.',
        hint: 'Përemri "unë" (ـَيَّ) → "ne" (ـَيْنَا).',
        grammarPoint: 'لَدَى + përemër',
      },
      {
        id: 'ex3-2',
        type: 'transform',
        prompt: 'Ndërto pyetje me كَمْ (emri në tenvin fetha)',
        source: { arabic: 'غُرْفَة', albanian: 'dhomë' },
        answer: 'كَمْ غُرْفَةً؟',
        hint: 'Pas كَمْ emri është i pashquar dhe merr tenvin kallëzor (fetha).',
        grammarPoint: 'كَمْ + tenvin',
      },
      {
        id: 'ex3-3',
        type: 'transform',
        prompt: 'Shto parafjalën في te "shtëpi" (e shquar)',
        source: { arabic: 'البَيْت', albanian: 'shtëpia' },
        answer: 'فِي البَيْتِ',
        hint: 'Pas parafjalës emri merr kesrën (gjenitivin).',
        grammarPoint: 'Parafjalë في',
      },
      {
        id: 'ex3-4',
        type: 'transform',
        prompt: 'Kthe foljen "hyri" në urdhëroren e kortezisë',
        source: { arabic: 'دَخَلَ', albanian: 'hyri' },
        answer: 'اُدْخُلْ',
        hint: 'Urdhërorja i مضارع يَدْخُلُ → اُدْخُلْ (sukun në fund).',
        grammarPoint: 'Urdhërore',
      },
      {
        id: 'ex3-5',
        type: 'transform',
        prompt: 'Zëvendëso "unë kam" me "ai ka"',
        source: { arabic: 'لَدَيَّ بَيْتٌ.', albanian: 'Unë kam shtëpi.' },
        answer: 'لَدَيْهِ بَيْتٌ.',
        hint: 'ـَيَّ (im) → ـَيْهِ (i tij).',
        grammarPoint: 'لَدَى + përemër',
      },
      {
        id: 'ex3-6',
        type: 'transform',
        prompt: 'Ndërto pyetje: "Sa banja ka në shtëpi?"',
        source: { arabic: 'حَمَّام + فِي البَيْت', albanian: 'banjë + në shtëpi' },
        answer: 'كَمْ حَمَّاماً فِي البَيْتِ؟',
        hint: 'كَمْ + emër në tenvin fetha + fjalia e mbetur.',
        grammarPoint: 'كَمْ + tenvin',
      },
    ],
    stories: [
      {
        id: 's3-1',
        titleAl: 'Banesa e re e Musait',
        albanian:
          'Sot Musa dhe familja e tij hynë në banesën e re në lagjen e universitetit. Banesa është në katin e tretë dhe ka pesë dhoma. Në dhomën e ndenjës janë divani, perdet e bukura dhe qilimi i gjelbër. Në kuzhinë është frigoriferi i ri dhe furra. Babai i Musait tha: “Elhamdulilah, shtëpia jonë është e bukur dhe e qetë”. Musa hyri në dhomën e tij, pa pasqyrën dhe shtratin, dhe tha: “Faleminderit, o Allah, për këtë begati”.',
        arabic:
          'اليَوْمَ دَخَلَ مُوسَى وَأُسْرَتُهُ الشَّقَّةَ الجَدِيدَةَ فِي حَيِّ الجَامِعَةِ. الشَّقَّةُ فِي الدَّوْرِ الثَّالِثِ وَفِيهَا خَمْسُ غُرَفٍ. فِي غُرْفَةِ الجُلُوسِ أَرِيكَةٌ وَسَتَائِرُ جَمِيلَةٌ وَسَجَّادَةٌ خَضْرَاءُ. فِي المَطْبَخِ ثَلَّاجَةٌ جَدِيدَةٌ وَفُرْنٌ. قَالَ وَالِدُ مُوسَى: «الحَمْدُ لِلَّهِ، بَيْتُنَا جَمِيلٌ وَهَادِئٌ». دَخَلَ مُوسَى غُرْفَتَهُ وَنَظَرَ إِلَى المِرْآةِ وَالسَّرِيرِ وَقَالَ: «شُكْراً يَا رَبِّ عَلَى هَذِهِ النِّعْمَةِ».',
        transliteration:
          "El-jewme dekhale Musa ve usretuhu esh-shakketel xhedide fi hajjil xhami‘a. Esh-shakketu fid-devrith-thalith ve fiha khamsu gurefin. Fi gurfetil xhulus erike ve setairun xhemile ve sexhxhadetun khadra. Fil matbakh thelxhetun xhedide ve furn. Kale walidu Musa: «Elhamdulilah, bejtuna xhemil ve hadi». Dekhale Musa gurfetehu ve nezare ilel mir'a ves-serir ve kale: «Shukren ja Rabbi ala hadhihi ni'meh».",
      },
    ],
    ayat: [
      {
        // Quraysh 106:3 — the shortest, most direct "البَيْت" verse in
        // the whole Mus·haf: "Le ta adhurojnë Zotin e kësaj shtëpie"
        // (Qaben). Three chapter-1+3 words lined up in a row — هَٰذَا,
        // البَيْت, plus رَبّ which has appeared repeatedly in Ch 1-2
        // stories.
        reference: '106:3',
        surahNameAr: 'قُرَيْش',
        surahNameAl: 'Kurejsh',
        arabic: 'فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ',
        albanian:
          'Pra, le ta adhurojnë Zotin e kësaj shtëpie (Qabesë).',
        knownWords: [
          { surface: 'رَبَّ', gloss: 'Zotin' },
          { surface: 'هَٰذَا', gloss: 'kjo / kësaj' },
          { surface: 'الْبَيْتِ', gloss: 'shtëpisë (nga بَيْت)' },
        ],
      },
      {
        // Nuh 71:28 — dua-ja e Nuhut a.s. që lidh tre fjalë të Kapitullit
        // 2-3: وَالِدَيَّ (prindërit e mi, dual i وَالِد), دَخَلَ (hyri) dhe
        // بَيْتِيَ (shtëpia ime). Një ajet familjar + banese në të
        // njëjtën kohë — ilustrim perfekt i "fjalët e mia bashkohen".
        reference: '71:28',
        surahNameAr: 'نُوح',
        surahNameAl: 'Nuh',
        arabic:
          'رَّبِّ اغْفِرْ لِي وَلِوَالِدَيَّ وَلِمَن دَخَلَ بَيْتِيَ مُؤْمِنًا وَلِلْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ وَلَا تَزِدِ الظَّالِمِينَ إِلَّا تَبَارًا',
        albanian:
          'O Zoti im, më fal mua dhe prindërit e mi, dhe këdo që hyn në shtëpinë time si besimtar, si dhe besimtarët e besimtaret; e të padrejtët mos ua shto gjë tjetër veç humbjes.',
        knownWords: [
          { surface: 'رَّبِّ', gloss: 'o Zoti im' },
          { surface: 'وَالِدَيَّ', gloss: 'prindërit e mi (dual i وَالِد)' },
          { surface: 'دَخَلَ', gloss: 'hyri' },
          { surface: 'بَيْتِيَ', gloss: 'shtëpinë time (nga بَيْت)' },
        ],
      },
      {
        // Al-Imran 3:96 — "Shtëpia e parë e vendosur për njerëzimin" —
        // përmban dy fjalë që nxënësi tashmë i njeh: أَوَّلَ (i pari,
        // nga kapitulli 1 — اللّٰهُ الأَوَّل) dhe بَيْت. Lidh historiçisht
        // konceptin e banesës me Qaben.
        reference: '3:96',
        surahNameAr: 'آلِ عِمْرَان',
        surahNameAl: 'Ali Imran',
        arabic:
          'إِنَّ أَوَّلَ بَيْتٍ وُضِعَ لِلنَّاسِ لَلَّذِي بِبَكَّةَ مُبَارَكًا وَهُدًى لِّلْعَالَمِينَ',
        albanian:
          'Vërtet, shtëpia e parë e ngritur për njerëzit është ajo në Mekë (Qabja), e bekuar dhe udhëzim për botët.',
        knownWords: [
          { surface: 'أَوَّلَ', gloss: 'të parin / e parë' },
          { surface: 'بَيْتٍ', gloss: 'shtëpi (nga بَيْت)' },
        ],
      },
      {
        // El-Bekare 2:189 — urdhri i butë moral: "hyni në shtëpi nga
        // dyert e tyre". Fjala kryesore e re është أَبْوَابِهَا (dyert e
        // tyre), shumësi i بَاب (v3-12) — fjalori i kapitullit 3 e lidh
        // banesën me të vërtetën shpirtërore: rruga e drejtë është edhe
        // fizikisht porta, jo xhami pas.
        reference: '2:189',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'وَلَيْسَ الْبِرُّ بِأَن تَأْتُوا الْبُيُوتَ مِنْ ظُهُورِهَا وَلَٰكِنَّ الْبِرَّ مَنِ اتَّقَىٰ ۗ وَأْتُوا الْبُيُوتَ مِنْ أَبْوَابِهَا',
        albanian:
          'Mirësia nuk është që të hyni në shtëpi nga pas, por mirësia është të kesh frikë Allahun; hyni pra në shtëpi nga dyert e tyre.',
        knownWords: [
          { surface: 'أَبْوَابِهَا', gloss: 'dyert e tyre (shumësi i بَاب)' },
        ],
      },
      {
        // En-Nahl 16:80 — ajeti që bart vetë titullin e Kapitullit 3:
        // السَّكَن. Allahu jua ka bërë "nga shtëpitë tuaja një vend
        // qetësie (سَكَناً)". Fjala-temë e kapitullit del drejt nga
        // Kurani — nuk është term teknik, por dhuratë hyjnore.
        reference: '16:80',
        surahNameAr: 'النَّحْل',
        surahNameAl: 'En-Nahl',
        arabic: 'وَاللَّهُ جَعَلَ لَكُم مِّن بُيُوتِكُمْ سَكَنًا',
        albanian:
          'Dhe Allahu jua bëri nga shtëpitë tuaja një vend qetësie.',
        knownWords: [
          {
            surface: 'سَكَنًا',
            gloss: 'vend qetësie / banesë (titulli i kapitullit: السَّكَن)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 4,
    titleAr: 'الحَيَاةُ اليَوْمِيَّة',
    titleAl: 'Jeta e përditshme',
    titleEn: 'Daily Life',
    dialogues: [
      {
        id: 'd4-1',
        albanian: 'Kur zgjohesh në mëngjes?',
        arabic: 'مَتَى تَسْتَيْقِظُ فِي الصَّبَاحِ؟',
        transliteration: 'Meta testejkizu fis-sabah?',
      },
      {
        id: 'd4-2',
        albanian: 'Zgjohem herët, para namazit të sabahut.',
        arabic: 'أَسْتَيْقِظُ مُبَكِّراً قَبْلَ صَلَاةِ الفَجْرِ.',
        transliteration: 'Estejkizu mubekkiren kable salatil fexhr.',
      },
      {
        id: 'd4-3',
        albanian: 'Pas namazit shkoj në shkollë me autobus.',
        arabic: 'بَعْدَ الصَّلَاةِ أَذْهَبُ إِلَى المَدْرَسَةِ بِالحَافِلَةِ.',
        transliteration: 'Ba‘des-salati edhhebu ilel medrese bil hafile.',
      },
      {
        id: 'd4-4',
        albanian: 'Ajo pastron shtëpinë dhe lan rrobat.',
        arabic: 'هِيَ تَكْنُسُ البَيْتَ وَتَغْسِلُ المَلَابِسَ.',
        transliteration: 'Hije teknusul bejt ve tegsilul melabis.',
      },
      {
        id: 'd4-5',
        albanian: 'Në ditën e pushimit shikoj televizorin dhe lexoj gazetën.',
        arabic: 'فِي يَوْمِ العُطْلَةِ أُشَاهِدُ التِّلْفَازَ وَأَقْرَأُ الصَّحِيفَةَ.',
        transliteration: "Fi jewmil 'utle ushahidut-tilfaz ve akrausa-sahife.",
      },
      {
        id: 'd4-6',
        albanian: 'Nuk vonohem, flej herët mbrëmjeve.',
        arabic: 'لَا أَتَأَخَّرُ، أَنَامُ مُبَكِّراً فِي المَسَاءِ.',
        transliteration: 'La ete’ekhkheru, enamu mubekkiren fil mesa.',
      },
    ],
    vocabulary: [
      { id: 'v4-1', arabic: 'يَوْم', albanian: 'Ditë', root: 'ي-و-م', type: 'noun', gender: 'M', plural: 'أَيَّام' },
      { id: 'v4-2', arabic: 'صَبَاح', albanian: 'Mëngjes', root: 'ص-ب-ح', type: 'noun', gender: 'M' },
      { id: 'v4-3', arabic: 'مَسَاء', albanian: 'Mbrëmje', root: 'م-س-و', type: 'noun', gender: 'M' },
      { id: 'v4-4', arabic: 'فَجْر', albanian: 'Agim (namazi i sabahut)', root: 'ف-ج-ر', type: 'noun', gender: 'M' },
      { id: 'v4-5', arabic: 'صَلَاة', albanian: 'Namaz', root: 'ص-ل-و', type: 'noun', gender: 'F', plural: 'صَلَوَات' },
      { id: 'v4-6', arabic: 'مَدْرَسَة', albanian: 'Shkollë', root: 'د-ر-س', type: 'noun', gender: 'F', plural: 'مَدَارِس' },
      { id: 'v4-7', arabic: 'سَيَّارَة', albanian: 'Makinë', root: 'س-ي-ر', type: 'noun', gender: 'F', plural: 'سَيَّارَات' },
      { id: 'v4-8', arabic: 'حَافِلَة', albanian: 'Autobus', root: 'ح-ف-ل', type: 'noun', gender: 'F', plural: 'حَافِلَات' },
      { id: 'v4-9', arabic: 'عُطْلَة', albanian: 'Pushim', root: 'ع-ط-ل', type: 'noun', gender: 'F', plural: 'عُطَل' },
      { id: 'v4-10', arabic: 'عَمَل', albanian: 'Punë', root: 'ع-م-ل', type: 'noun', gender: 'M', plural: 'أَعْمَال' },
      { id: 'v4-11', arabic: 'مَلَابِس', albanian: 'Rroba', root: 'ل-ب-س', type: 'noun', gender: 'M' },
      { id: 'v4-12', arabic: 'تِلْفَاز', albanian: 'Televizor', root: '-', type: 'noun', gender: 'M' },
      { id: 'v4-13', arabic: 'صَحِيفَة', albanian: 'Gazetë', root: 'ص-ح-ف', type: 'noun', gender: 'F', plural: 'صُحُف' },
      { id: 'v4-14', arabic: 'اِسْتَيْقَظَ', present: 'يَسْتَيْقِظُ', imperative: 'اِسْتَيْقِظْ', albanian: 'U zgjua', root: 'ي-ق-ظ', type: 'verb' },
      { id: 'v4-15', arabic: 'نَامَ', present: 'يَنَامُ', imperative: 'نَمْ', albanian: 'Fjeti', root: 'ن-و-م', type: 'verb' },
      { id: 'v4-16', arabic: 'ذَهَبَ', present: 'يَذْهَبُ', imperative: 'اِذْهَبْ', albanian: 'Shkoi', root: 'ذ-ه-ب', type: 'verb' },
      { id: 'v4-17', arabic: 'كَنَسَ', present: 'يَكْنُسُ', imperative: 'اُكْنُسْ', albanian: 'Fshiu', root: 'ك-ن-س', type: 'verb' },
      { id: 'v4-18', arabic: 'غَسَلَ', present: 'يَغْسِلُ', imperative: 'اِغْسِلْ', albanian: 'Lau', root: 'غ-س-ل', type: 'verb' },
      { id: 'v4-19', arabic: 'كَوَى', present: 'يَكْوِي', imperative: 'اِكْوِ', albanian: 'Hekurosi', root: 'ك-و-ي', type: 'verb' },
      { id: 'v4-20', arabic: 'شَاهَدَ', present: 'يُشَاهِدُ', imperative: 'شَاهِدْ', albanian: 'Shikoi', root: 'ش-ه-د', type: 'verb' },
      { id: 'v4-21', arabic: 'مُبَكِّراً', albanian: 'Herët', root: 'ب-ك-ر', type: 'particle' },
      { id: 'v4-22', arabic: 'مُتَأَخِّراً', albanian: 'Vonë', root: 'أ-خ-ر', type: 'particle' },
      { id: 'v4-23', arabic: 'قَبْلَ', albanian: 'Para', root: 'ق-ب-ل', type: 'particle' },
      { id: 'v4-24', arabic: 'بَعْدَ', albanian: 'Pas', root: 'ب-ع-د', type: 'particle' },
      { id: 'v4-25', arabic: 'مَتَى', albanian: 'Kur', root: '-', type: 'particle' },
      { id: 'v4-26', arabic: 'عِنْدَ', albanian: 'Tek / kur', root: 'ع-ن-د', type: 'particle' },
      { id: 'v4-27', arabic: 'طَبَق', albanian: 'Pjatë', root: 'ط-ب-ق', type: 'noun', gender: 'M', plural: 'أَطْبَاق' },
      { id: 'v4-28', arabic: 'سَاعَة', albanian: 'Orë', root: 'س-و-ع', type: 'noun', gender: 'F', plural: 'سَاعَات' },
    ],
    grammarFocus: [
      'Folja mudari‘ e rregullt: يَسْتَيْقِظُ / تَسْتَيْقِظُ / أَسْتَيْقِظُ',
      'Mohimi me لَا + mudari‘: لَا أَتَأَخَّرُ (nuk vonohem)',
      'Parafjala بِـ për mjet: بِالحَافِلَةِ (me autobus)',
      'قَبْلَ / بَعْدَ + emër gjenitiv: قَبْلَ الصَّلَاةِ',
      'Numrat rendorë (M): الأَوَّل، الثَّانِي، الثَّالِث، الرَّابِع، الخَامِس',
    ],
    exercises: [
      {
        id: 'ex4-1',
        type: 'transform',
        prompt: 'Ktheje foljen për vetën I (unë zgjohem)',
        source: { arabic: 'يَسْتَيْقِظُ مُبَكِّراً.', albanian: 'Ai zgjohet herët.' },
        answer: 'أَسْتَيْقِظُ مُبَكِّراً.',
        hint: 'Prefiksi ي → أ për vetën I njëjës.',
        grammarPoint: 'Mudari e rregullt',
      },
      {
        id: 'ex4-2',
        type: 'transform',
        prompt: 'Shto mohimin لَا te folja mudari',
        source: { arabic: 'أَتَأَخَّرُ.', albanian: 'Vonohem.' },
        answer: 'لَا أَتَأَخَّرُ.',
        hint: 'لَا para foljes, mudari mbetet me dammen në fund.',
        grammarPoint: 'Mohim لَا',
      },
      {
        id: 'ex4-3',
        type: 'transform',
        prompt: 'Shto parafjalën e mjetit بِـ te "autobus"',
        source: { arabic: 'الحَافِلَة', albanian: 'autobusi' },
        answer: 'بِالحَافِلَةِ',
        hint: 'بِـ ngjitet; "AL" mbetet; emri merr kesrën.',
        grammarPoint: 'بِـ mjeti',
      },
      {
        id: 'ex4-4',
        type: 'transform',
        prompt: 'Ndërto: "para namazit"',
        source: { arabic: 'قَبْلَ + الصَّلَاة', albanian: 'para + namazi' },
        answer: 'قَبْلَ الصَّلَاةِ',
        hint: 'قَبْلَ është ظرف — emri pas tij merr gjenitivin (kesrën).',
        grammarPoint: 'قَبْلَ / بَعْدَ',
      },
      {
        id: 'ex4-5',
        type: 'transform',
        prompt: 'Kthe numrin në rendor (femëror): "ora e pestë"',
        source: { arabic: 'السَّاعَة + خَمْسَة', albanian: 'ora + pesë' },
        answer: 'السَّاعَةُ الخَامِسَةُ',
        hint: 'Numri rendor merr ة në femërore dhe "AL" për t\'u pajtuar.',
        grammarPoint: 'Numër rendor',
      },
      {
        id: 'ex4-6',
        type: 'transform',
        prompt: 'Zëvendëso "ai shkon" me "ti (m.) shkon"',
        source: { arabic: 'يَذْهَبُ إِلَى المَدْرَسَةِ.', albanian: 'Ai shkon në shkollë.' },
        answer: 'تَذْهَبُ إِلَى المَدْرَسَةِ.',
        hint: 'Prefiksi ي → ت për "ti" (m.) ose "ajo".',
        grammarPoint: 'Mudari e rregullt',
      },
    ],
    stories: [
      {
        id: 's4-1',
        titleAl: 'Dita e Musait',
        albanian:
          'Musa zgjohet shumë herët çdo ditë, para namazit të sabahut. Pas namazit ha mëngjesin me familjen dhe pi qumësht me çaj. Në orën shtatë shkon në shkollë me autobus, sepse shkolla nuk është afër. Pas mësimit kthehet në shtëpi, e ndihmon nënën të pastrojë dhomat dhe të lajë rrobat. Në mbrëmje shikon televizorin me babanë dhe lexon gazetën. Ditën e pushimit nuk ngrihet herët, por pushon me familjen në shtëpi. Ai nuk vonohet kurrë dhe flen herët për të qenë aktiv të nesërmen.',
        arabic:
          'يَسْتَيْقِظُ مُوسَى مُبَكِّراً كُلَّ يَوْمٍ، قَبْلَ صَلَاةِ الفَجْرِ. بَعْدَ الصَّلَاةِ يَأْكُلُ الفَطُورَ مَعَ الأُسْرَةِ وَيَشْرَبُ الحَلِيبَ مَعَ الشَّايِ. فِي السَّاعَةِ السَّابِعَةِ يَذْهَبُ إِلَى المَدْرَسَةِ بِالحَافِلَةِ، لِأَنَّ المَدْرَسَةَ بَعِيدَةٌ. بَعْدَ الدَّرْسِ يَرْجِعُ إِلَى البَيْتِ، وَيُسَاعِدُ وَالِدَتَهُ فِي كَنْسِ الغُرَفِ وَغَسْلِ المَلَابِسِ. فِي المَسَاءِ يُشَاهِدُ التِّلْفَازَ مَعَ وَالِدِهِ وَيَقْرَأُ الصَّحِيفَةَ. فِي يَوْمِ العُطْلَةِ لَا يَسْتَيْقِظُ مُبَكِّراً، وَلَكِنْ يَسْتَرِيحُ مَعَ أُسْرَتِهِ فِي البَيْتِ. هُوَ لَا يَتَأَخَّرُ أَبَداً وَيَنَامُ مُبَكِّراً لِيَكُونَ نَشِيطاً فِي الغَدِ.',
        transliteration:
          "Jestejkizu Musa mubekkiren kul-le jewm, kable salatil fexhr. Ba'des-salati je'kulul fatur ma'al usre ve jeshrebul halibe ma'ash-shaj. Fis-sa'atis-sabi'a jedhhebu ilel medrese bil hafile, li ennel medrese be‘ide. Ba'ded-dersi jerxhi‘u ilel bejt, ve jusa‘idu walidetehu fi kensil gurefi ve gaslil melabis. Fil mesa jushahidut-tilfaze ma‘a walidihi ve jakrau es-sahife. Fi jewmil ‘utle la jestejkizu mubekkiren, ve lakin jesterihu ma‘a usretihi fil bejt. Huwe la jete’ekhkheru ebeden ve jenamu mubekkiren li jekune neshitan fil gad.",
      },
    ],
    ayat: [
      {
        // Al-Fajr 89:1 — betimi më i shkurtër i Kuranit me فَجْر, fjala
        // qendrore e kapitullit. Dy fjalë: waw betimi + الْفَجْر. Edhe
        // një nxënës fillestar e lexon në sekonda, dhe kupton fjalën
        // kryesore.
        reference: '89:1',
        surahNameAr: 'الفَجْر',
        surahNameAl: 'El-Fexhr',
        arabic: 'وَالْفَجْرِ',
        albanian: 'Pasha agimin!',
        knownWords: [
          { surface: 'وَالْفَجْرِ', gloss: 'pasha agimin (nga فَجْر)' },
        ],
      },
      {
        // An-Naba 78:9 — ن-و-م si emër dhe si dhuratë hyjnore: "Dhe
        // gjumin jua bëmë për pushim." نَوْم dhe نَامَ e kapitullit 4
        // janë nga e njëjta rrënjë; ky ajet e konsolidon lidhjen
        // folje→emër dhe shton një shtresë shpirtërore — gjumi si
        // mëshirë.
        reference: '78:9',
        surahNameAr: 'النَّبَأ',
        surahNameAl: 'En-Nebe',
        arabic: 'وَجَعَلْنَا نَوْمَكُمْ سُبَاتًا',
        albanian: 'Dhe gjumin tuaj e bëmë për pushim.',
        knownWords: [
          {
            surface: 'نَوْمَكُمْ',
            gloss: 'gjumi juaj (emër nga rrënja ن-و-م, si نَامَ)',
          },
        ],
      },
      {
        // Al-Isra 17:78 — një ajet me tre fjalë të kapitullit 4 në një
        // varg: الصَّلَاةَ + الْفَجْرِ + قَبْلَ- n'ritem (tek وَقُرْآنَ الْفَجْرِ).
        // Thirrja për namazin e sabahut shfaqet fjalë për fjalë me
        // fjalorin që nxënësi sapo ka mësuar.
        reference: '17:78',
        surahNameAr: 'الإِسْرَاء',
        surahNameAl: 'El-Isra',
        arabic:
          'أَقِمِ الصَّلَاةَ لِدُلُوكِ الشَّمْسِ إِلَىٰ غَسَقِ اللَّيْلِ وَقُرْآنَ الْفَجْرِ إِنَّ قُرْآنَ الْفَجْرِ كَانَ مَشْهُودًا',
        albanian:
          'Fale namazin prej kur të kthehet dielli (nga mesi i qiellit) deri në errësirën e natës, si dhe leximin e agimit (namazin e sabahut); vërtet leximi i agimit është i dëshmuar (nga melaiket).',
        knownWords: [
          { surface: 'الصَّلَاةَ', gloss: 'namazin (nga صَلَاة)' },
          { surface: 'الْفَجْرِ', gloss: 'agimit (nga فَجْر)' },
        ],
      },
      {
        // Err-Rum 30:17 — ajeti që mbështjell dy fjalë të ditës së
        // përditshme në një shprehje të madhërueshme: "kur gdhiheni
        // (تُصْبِحُونَ) dhe kur ngrysni (تُمْسُونَ)". Rrënjët ص-ب-ح dhe
        // م-س-و janë po ato të صَبَاح (mëngjes) dhe مَسَاء (mbrëmje) —
        // dy çastet-kornizë të jetës së kapitullit 4.
        reference: '30:17',
        surahNameAr: 'الرُّوم',
        surahNameAl: 'Err-Rum',
        arabic:
          'فَسُبْحَانَ اللَّهِ حِينَ تُمْسُونَ وَحِينَ تُصْبِحُونَ',
        albanian:
          'Pra, i lartësuar qoftë Allahu kur ngrysni dhe kur gdhiheni!',
        knownWords: [
          {
            surface: 'تُمْسُونَ',
            gloss: 'ngrysni (nga rrënja م-س-و, si مَسَاء)',
          },
          {
            surface: 'تُصْبِحُونَ',
            gloss: 'gdhiheni (nga rrënja ص-ب-ح, si صَبَاح)',
          },
        ],
      },
      {
        // El-Fatiha 1:4 — ajeti që recitohet në çdo namaz: "Sunduesi i
        // Ditës së Gjykimit". يَوْم është fjala e parë e Kapitullit 4
        // (v4-1), dhe këtu shfaqet në trajtën më solemne — dita që nuk
        // mbaron kurrë.
        reference: '1:4',
        surahNameAr: 'الفَاتِحَة',
        surahNameAl: 'El-Fatiha',
        arabic: 'مَالِكِ يَوْمِ الدِّينِ',
        albanian: 'Sunduesit të Ditës së Gjykimit.',
        knownWords: [
          { surface: 'يَوْمِ', gloss: 'Ditës (nga يَوْم)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 5,
    titleAr: 'الطَّعَامُ وَالشَّرَاب',
    titleAl: 'Ushqimi dhe Pijet',
    titleEn: 'Food & Drink',
    dialogues: [
      {
        id: 'd5-1',
        albanian: 'Çfarë hëngre në mëngjes?',
        arabic: 'مَاذَا أَكَلْتَ فِي الفَطُورِ؟',
        transliteration: 'Madha ekelte fil fetur?',
      },
      {
        id: 'd5-2',
        albanian: 'Hëngra bukë me hurma dhe piva qumësht.',
        arabic: 'أَكَلْتُ خُبْزاً وَتَمْراً وَشَرِبْتُ حَلِيباً.',
        transliteration: 'Ekeltu khubzen ve temren ve sharibtu haliben.',
      },
      {
        id: 'd5-3',
        albanian: 'Për drekë dua oriz me mish dhe sallatë.',
        arabic: 'أُرِيدُ فِي الغَدَاءِ أَرُزّاً مَعَ اللَّحْمِ وَسَلَطَةً.',
        transliteration: 'Uridu fil geda erruzzen ma‘al lahm ve selete.',
      },
      {
        id: 'd5-4',
        albanian: 'A do çaj apo kafe?',
        arabic: 'هَلْ تُرِيدُ شَاياً أَمْ قَهْوَةً؟',
        transliteration: 'Hel turidu shajen em kahwe?',
      },
      {
        id: 'd5-5',
        albanian: 'Çaj me qumësht, ju lutem. Falemnderit.',
        arabic: 'شَاياً بِالحَلِيبِ مِنْ فَضْلِكَ. شُكْراً.',
        transliteration: 'Shajen bil halib, min fadlik. Shukren.',
      },
      {
        id: 'd5-6',
        albanian: 'Jam i ngopur, uji mjafton. Mos shto më.',
        arabic: 'أَنَا شَبْعَانُ، المَاءُ يَكْفِي. لَا تَزِدْ.',
        transliteration: 'Ene shebane, el-mau jekfi. La tezid.',
      },
    ],
    vocabulary: [
      { id: 'v5-1', arabic: 'طَعَام', albanian: 'Ushqim', root: 'ط-ع-م', type: 'noun', gender: 'M', plural: 'أَطْعِمَة' },
      { id: 'v5-2', arabic: 'شَرَاب', albanian: 'Pije', root: 'ش-ر-ب', type: 'noun', gender: 'M' },
      { id: 'v5-3', arabic: 'فَطُور', albanian: 'Mëngjes (vakt)', root: 'ف-ط-ر', type: 'noun', gender: 'M' },
      { id: 'v5-4', arabic: 'غَدَاء', albanian: 'Drekë', root: 'غ-د-و', type: 'noun', gender: 'M' },
      { id: 'v5-5', arabic: 'عَشَاء', albanian: 'Darkë', root: 'ع-ش-و', type: 'noun', gender: 'M' },
      { id: 'v5-6', arabic: 'خُبْز', albanian: 'Bukë', root: 'خ-ب-ز', type: 'noun', gender: 'M' },
      { id: 'v5-7', arabic: 'أَرُزّ', albanian: 'Oriz', root: 'أ-ر-ز', type: 'noun', gender: 'M' },
      { id: 'v5-8', arabic: 'لَحْم', albanian: 'Mish', root: 'ل-ح-م', type: 'noun', gender: 'M', plural: 'لُحُوم' },
      { id: 'v5-9', arabic: 'دَجَاج', albanian: 'Pulë', root: 'د-ج-ج', type: 'noun', gender: 'M' },
      { id: 'v5-10', arabic: 'سَمَك', albanian: 'Peshk', root: 'س-م-ك', type: 'noun', gender: 'M' },
      { id: 'v5-11', arabic: 'سَلَطَة', albanian: 'Sallatë', root: 'س-ل-ط', type: 'noun', gender: 'F' },
      { id: 'v5-12', arabic: 'فَاكِهَة', albanian: 'Pemë / frutë', root: 'ف-ك-ه', type: 'noun', gender: 'F' },
      { id: 'v5-13', arabic: 'تَمْر', albanian: 'Hurmë', root: 'ت-م-ر', type: 'noun', gender: 'M', plural: 'تُمُور' },
      { id: 'v5-14', arabic: 'عِنَب', albanian: 'Rrush', root: 'ع-ن-ب', type: 'noun', gender: 'M' },
      { id: 'v5-15', arabic: 'حَلِيب', albanian: 'Qumësht', root: 'ح-ل-ب', type: 'noun', gender: 'M' },
      { id: 'v5-16', arabic: 'مَاء', albanian: 'Ujë', root: 'م-و-ه', type: 'noun', gender: 'M' },
      { id: 'v5-17', arabic: 'شَاي', albanian: 'Çaj', root: '-', type: 'noun', gender: 'M' },
      { id: 'v5-18', arabic: 'قَهْوَة', albanian: 'Kafe', root: 'ق-ه-و', type: 'noun', gender: 'F' },
      { id: 'v5-19', arabic: 'مَائِدَة', albanian: 'Tryezë e ushqimit', root: 'م-و-د', type: 'noun', gender: 'F' },
      { id: 'v5-20', arabic: 'ضَيْف', albanian: 'Mysafir', root: 'ض-ي-ف', type: 'noun', gender: 'M', plural: 'ضُيُوف' },
      { id: 'v5-21', arabic: 'أَكَلَ', present: 'يَأْكُلُ', imperative: 'كُلْ', albanian: 'Hëngri', root: 'أ-ك-ل', type: 'verb' },
      { id: 'v5-22', arabic: 'شَرِبَ', present: 'يَشْرَبُ', imperative: 'اِشْرَبْ', albanian: 'Piu', root: 'ش-ر-ب', type: 'verb' },
      { id: 'v5-23', arabic: 'طَلَبَ', present: 'يَطْلُبُ', imperative: 'اُطْلُبْ', albanian: 'Kërkoi', root: 'ط-ل-ب', type: 'verb' },
      { id: 'v5-24', arabic: 'فَضَّلَ', present: 'يُفَضِّلُ', imperative: 'فَضِّلْ', albanian: 'Preferoi', root: 'ف-ض-ل', type: 'verb' },
      { id: 'v5-25', arabic: 'جَائِع', albanian: 'I uritur', root: 'ج-و-ع', type: 'adjective', gender: 'M' },
      { id: 'v5-26', arabic: 'شَبْعَان', albanian: 'I ngopur', root: 'ش-ب-ع', type: 'adjective', gender: 'M' },
      { id: 'v5-27', arabic: 'كَثِير', albanian: 'Shumë', root: 'ك-ث-ر', type: 'adjective', gender: 'M' },
      { id: 'v5-28', arabic: 'قَلِيل', albanian: 'Pak', root: 'ق-ل-ل', type: 'adjective', gender: 'M' },
      { id: 'v5-29', arabic: 'جِدّاً', albanian: 'Shumë (adv.)', root: '-', type: 'particle' },
      { id: 'v5-30', arabic: 'حَوَّلَ', albanian: 'Ndryshoi/Konvertoi', root: 'ح-و-ل', type: 'verb', present: 'يُحَوِّلُ', imperative: 'حَوِّلْ' },
      { id: 'v5-31', arabic: 'وَجْبَة', albanian: 'Vakt', root: 'و-ج-ب', type: 'noun', gender: 'F', plural: 'وَجَبَات' },
      { id: 'v5-32', arabic: 'دَجَاجَة', albanian: 'Pulë', root: 'د-ج-ج', type: 'noun', gender: 'F', plural: 'دَجَاج' },
      { id: 'v5-33', arabic: 'سَمَكَة', albanian: 'Peshk (njësi)', root: 'س-م-ك', type: 'noun', gender: 'F', plural: 'سَمَك' },
      { id: 'v5-34', arabic: 'وَزْن', albanian: 'Peshë', root: 'و-ز-ن', type: 'noun', gender: 'M', plural: 'أَوْزَان' },
      { id: 'v5-35', arabic: 'كَيْل', albanian: 'Matje (me shinik)', root: 'ك-ي-ل', type: 'noun', gender: 'M', plural: 'أَكْيَال' },
      { id: 'v5-36', arabic: 'يَوْم', albanian: 'Ditë', root: 'ي-و-م', type: 'noun', gender: 'M', plural: 'أَيَّام' },
      { id: 'v5-37', arabic: 'سَمِين', albanian: 'I shëndoshë', root: 'س-م-ن', type: 'adjective', gender: 'M' },
      { id: 'v5-38', arabic: 'تَمْرَة', albanian: 'Hurmë', root: 'ت-م-ر', type: 'noun', gender: 'F', plural: 'تَمْر' },
      { id: 'v5-39', arabic: 'جَوْعَان', albanian: 'I uritur', root: 'ج-و-ع', type: 'adjective', gender: 'M' },
      { id: 'v5-40', arabic: 'نَحِيف', albanian: 'I dobët', root: 'ن-ح-ف', type: 'adjective', gender: 'M' },
    ],
    grammarFocus: [
      'Emri i shkuar (madi) në veten I: أَكَلْتُ، شَرِبْتُ، طَلَبْتُ',
      'Ndalesa (لَا ناهِيَة) me mudari‘ mexhzum: لَا تَزِدْ (mos shto)',
      'Lidhëza أَمْ për pyetje zgjedhëse: شَاياً أَمْ قَهْوَةً؟',
      'بِـ me pije: شَاياً بِالحَلِيبِ، قَهْوَةً بِدُونِ سُكَّرٍ',
      'Numrat rendorë (F): الأُولَى، الثَّانِيَة، الثَّالِثَة، الرَّابِعَة، الخَامِسَة',
    ],
    exercises: [
      {
        id: 'ex5-1',
        type: 'transform',
        prompt: 'Kthe foljen në Madi veta I: "unë hëngra"',
        source: { arabic: 'يَأْكُلُ الخُبْزَ.', albanian: 'Ai ha bukë.' },
        answer: 'أَكَلْتُ الخُبْزَ.',
        hint: 'Madi veta I mbaron me ـْتُ.',
        grammarPoint: 'Madi veta I',
      },
      {
        id: 'ex5-2',
        type: 'transform',
        prompt: 'Kthe "ai piu" në "unë piva"',
        source: { arabic: 'شَرِبَ الحَلِيبَ.', albanian: 'Ai piu qumësht.' },
        answer: 'شَرِبْتُ الحَلِيبَ.',
        hint: 'Shto ـْتُ në fund të rrënjës së Madit.',
        grammarPoint: 'Madi veta I',
      },
      {
        id: 'ex5-3',
        type: 'transform',
        prompt: 'Ndërto një ndalesë: "mos shto"',
        source: { arabic: 'يَزِيدُ', albanian: 'ai shton' },
        answer: 'لَا تَزِدْ',
        hint: 'لَا e ndalesës + mudari mexhzum (sukun në fund, shkurtohet rrënja).',
        grammarPoint: 'Mexhzum me لَا',
      },
      {
        id: 'ex5-4',
        type: 'transform',
        prompt: 'Ndërto pyetje zgjedhëse me أَمْ',
        source: { arabic: 'شَاي / قَهْوَة', albanian: 'çaj / kafe' },
        answer: 'شَاياً أَمْ قَهْوَةً؟',
        hint: 'Të dyja emrat e pashquar në tenvin fetha, të lidhur me أَمْ.',
        grammarPoint: 'Lidhëza أَمْ',
      },
      {
        id: 'ex5-5',
        type: 'transform',
        prompt: 'Shto بِـ: "çaj me qumësht"',
        source: { arabic: 'شَاي + الحَلِيب', albanian: 'çaj + qumështi' },
        answer: 'شَاياً بِالحَلِيبِ',
        hint: 'بِـ + emër i shquar → kesra; çaji si mefûl mbetet në tenvin fetha.',
        grammarPoint: 'بِـ mjeti',
      },
      {
        id: 'ex5-6',
        type: 'transform',
        prompt: 'Kthe numrin rendor në femërore: "ora e tretë"',
        source: { arabic: 'الثَّالِث', albanian: 'i treti' },
        answer: 'الثَّالِثَةُ',
        hint: 'Shto ة për femëroren e numrit rendor.',
        grammarPoint: 'Numër rendor',
      },
    ],
    stories: [
      {
        id: 's5-1',
        titleAl: 'Vakti i familjes',
        albanian:
          'Çdo mëngjes Musa ha bukë me hurma dhe pi qumësht me çaj. Për drekë nëna gatuan oriz me mish dhe sallatë të freskët. Babai preferon kafen pa sheqer, ndërsa motra e vogël kërkon frutat pas ushqimit. Mbrëmjeve hamë darkë të lehtë — peshk ose pulë me perime. Mysafirët vijnë shpesh në shtëpinë tonë, ndaj nëna përgatit një tryezë të bukur për ta. Uji është pija më e dobishme, dhe ne nuk hamë shumë që të mos jemi të rëndë.',
        arabic:
          'كُلَّ صَبَاحٍ يَأْكُلُ مُوسَى الخُبْزَ بِالتَّمْرِ وَيَشْرَبُ الحَلِيبَ مَعَ الشَّايِ. فِي الغَدَاءِ تَطْبُخُ الوَالِدَةُ الأَرُزَّ مَعَ اللَّحْمِ وَسَلَطَةً طَازَجَةً. الوَالِدُ يُفَضِّلُ القَهْوَةَ بِدُونِ سُكَّرٍ، وَالأُخْتُ الصَّغِيرَةُ تَطْلُبُ الفَاكِهَةَ بَعْدَ الطَّعَامِ. فِي المَسَاءِ نَتَنَاوَلُ عَشَاءً خَفِيفاً — سَمَكاً أَوْ دَجَاجاً مَعَ الخُضَارِ. الضُّيُوفُ يَأْتُونَ كَثِيراً إِلَى بَيْتِنَا، فَتُعِدُّ الوَالِدَةُ مَائِدَةً جَمِيلَةً لَهُمْ. المَاءُ أَنْفَعُ شَرَابٍ، وَلَا نَأْكُلُ كَثِيراً حَتَّى لَا نَكُونَ ثِقَالاً.',
        transliteration:
          "Kul-le sabahin je'kulu Musa el-khubze bit-temri ve jeshrebul halibe ma'ash-shaj. Fil gada tetbukhul walide el-erruzze ma‘al-lahm ve selete tazexhe. El-walid jufeddilul kahwe bi dunis-sukker, vel ukht es-sagire tetlubul fakihe ba'det-ta'am. Fil mesa netenewelu ‘asha’en khafifen — semeken ev dexhaxhen ma‘al khudar. Ed-dujuf je’tune kethiren ila bejtina, fe tu‘iddul walide maideten xhemile lehum. El-mau enfe‘u sharabin, ve la ne’kulu kethiren hatta la nekune thikalen.",
      },
    ],
    ayat: [
      {
        // Meryem 19:26 — një nga ajetet më prekëse të Kuranit: Merjemja
        // pas lindjes së Isait a.s. nën palmë. Dy foljet kryesore të
        // Kapitullit 5 — أَكَلَ dhe شَرِبَ — shfaqen si urdhëresa femërore
        // "ha dhe pi". Emocionalisht i fortë, gjuhësisht perfekt.
        reference: '19:26',
        surahNameAr: 'مَرْيَم',
        surahNameAl: 'Merjem',
        arabic:
          'فَكُلِي وَاشْرَبِي وَقَرِّي عَيْنًا ۖ فَإِمَّا تَرَيِنَّ مِنَ الْبَشَرِ أَحَدًا فَقُولِي إِنِّي نَذَرْتُ لِلرَّحْمَٰنِ صَوْمًا فَلَنْ أُكَلِّمَ الْيَوْمَ إِنسِيًّا',
        albanian:
          'Andaj ha, pi dhe qetësoje shikimin. E nëse e sheh ndonjë njeri, thuaj: unë i jam zotuar të Gjithëmëshirshmit me agjërim, kështu që sot nuk do të flas me askënd.',
        knownWords: [
          { surface: 'فَكُلِي', gloss: 'pra ha (urdhër fem., nga أَكَلَ)' },
          { surface: 'وَاشْرَبِي', gloss: 'dhe pi (urdhër fem., nga شَرِبَ)' },
          { surface: 'أَحَدًا', gloss: 'dikë / askënd (nga أَحَد)' },
        ],
      },
      {
        // El-Enbija 21:30 — ajeti i famshëm i ujit: "nga uji çdo gjë të
        // gjallë". مَاء është fjala kryesore, e shquar me الـ. Një nga
        // ajetet më të cituara kur flitet për krijimin.
        reference: '21:30',
        surahNameAr: 'الأَنْبِيَاء',
        surahNameAl: 'El-Enbija',
        arabic:
          'أَوَلَمْ يَرَ الَّذِينَ كَفَرُوا أَنَّ السَّمَاوَاتِ وَالْأَرْضَ كَانَتَا رَتْقًا فَفَتَقْنَاهُمَا ۖ وَجَعَلْنَا مِنَ الْمَاءِ كُلَّ شَيْءٍ حَيٍّ ۖ أَفَلَا يُؤْمِنُونَ',
        albanian:
          'A nuk e panë ata që mohuan se qiejt dhe toka ishin një trup i vetëm e Ne i ndamë? Dhe nga uji Ne bëmë çdo gjë të gjallë. A nuk do të besojnë?',
        knownWords: [
          { surface: 'الْمَاءِ', gloss: 'ujit (nga مَاء)' },
        ],
      },
      {
        // El-Bekare 2:168 — urdhri i përgjithshëm për ushqimin hallall.
        // كُلُوا është shumës urdhëror (ha-ni) nga e njëjta rrënjë ا-ك-ل.
        // Lidh fjalorin e përditshëm (çfarë hamë) me normën fetare
        // (si të hamë). "Mos ndiqni gjurmët e shejtanit" i jep peshë.
        reference: '2:168',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'يَا أَيُّهَا النَّاسُ كُلُوا مِمَّا فِي الْأَرْضِ حَلَالًا طَيِّبًا وَلَا تَتَّبِعُوا خُطُوَاتِ الشَّيْطَانِ ۚ إِنَّهُ لَكُمْ عَدُوٌّ مُّبِينٌ',
        albanian:
          'O ju njerëz! Hani nga ajo që është në tokë, hallall dhe e mirë, dhe mos ndiqni gjurmët e shejtanit — vërtet ai është për ju armik i hapur.',
        knownWords: [
          { surface: 'كُلُوا', gloss: 'hani (urdhër shumës, nga أَكَلَ)' },
        ],
      },
      {
        // Abese 80:28 — pasazh i shkurtër ku Allahu numëron bekimet që
        // rriten nga toka: "dhe rrush (عِنَباً) dhe bimë". عِنَب (v5-14)
        // shfaqet drejtpërdrejt si fjalë e vetme — tregon se Kurani
        // përmend ekzaktësisht të njëjtin frut që nxënësi ka mësuar.
        reference: '80:28',
        surahNameAr: 'عَبَس',
        surahNameAl: 'Abese',
        arabic: 'وَعِنَبًا وَقَضْبًا',
        albanian: 'Dhe rrush dhe bimë të blerta.',
        knownWords: [
          { surface: 'وَعِنَبًا', gloss: 'dhe rrush (nga عِنَب)' },
        ],
      },
      {
        // Err-Rrahman 55:52 — përshkrim i Xhenetit: "në të dyja (kopshtet)
        // ka nga çdo frutë dy lloje". فَاكِهَة (v5-12) del drejt në trajtën
        // e pashquar — fruta si dhuratë e amshueshme. Pamja juaj e
        // tryezës së frutave në këtë botë është parathënie e Xhenetit.
        reference: '55:52',
        surahNameAr: 'الرَّحْمَٰن',
        surahNameAl: 'Err-Rrahman',
        arabic: 'فِيهِمَا مِن كُلِّ فَاكِهَةٍ زَوْجَانِ',
        albanian:
          'Në të dy (Xhenetet) ka nga çdo frutë dy lloje.',
        knownWords: [
          { surface: 'فَاكِهَةٍ', gloss: 'frutë (nga فَاكِهَة)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 6,
    titleAr: 'الصَّلَاة',
    titleAl: 'Namazi',
    titleEn: 'The Prayer',
    dialogues: [
      {
        id: 'd6-1',
        albanian: 'A mund të shkoj në xhami me ty?',
        arabic: 'هَلْ أَسْتَطِيعُ أَنْ أَذْهَبَ مَعَكَ إِلَى المَسْجِدِ؟',
        transliteration: 'Hel estetiu en edhhebe ma‘ake ilel mesxhid?',
      },
      {
        id: 'd6-2',
        albanian: 'Patjetër, po hipim në makinë. Jemi afër.',
        arabic: 'بِالتَّأْكِيدِ، سَنَرْكَبُ السَّيَّارَةَ. نَحْنُ قَرِيبُونَ.',
        transliteration: 'Bit-te’kid, senerkebus-sejjare. Nahnu karibun.',
      },
      {
        id: 'd6-3',
        albanian: 'A e dëgjove ezanin? Ja erdhi koha e namazit.',
        arabic: 'هَلْ سَمِعْتَ الأَذَانَ؟ حَانَ وَقْتُ الصَّلَاةِ.',
        transliteration: 'Hel semi‘tel edhan? Hane waktus-salati.',
      },
      {
        id: 'd6-4',
        albanian: 'Të presim ty te xhamia e Profetit insh’Allah.',
        arabic: 'نَنْتَظِرُكَ عِنْدَ المَسْجِدِ النَّبَوِيِّ إِنْ شَاءَ اللَّهُ.',
        transliteration: 'Nentazirukee ‘indel mesxhidin-nebevijj, inshallah.',
      },
      {
        id: 'd6-5',
        albanian: 'Allahu të shpërbleftë me të mirë, o vëlla.',
        arabic: 'جَزَاكَ اللَّهُ خَيْراً يَا أَخِي.',
        transliteration: 'Xhezakellahu khajren, ja ekhi.',
      },
      {
        id: 'd6-6',
        albanian: 'Ai që flen pas Jacisë është i plogët; unë s’jam dembel.',
        arabic: 'الذَّاهِبُ لِلنَّوْمِ بَعْدَ العِشَاءِ كَسْلَانُ؛ أَنَا لَسْتُ كَسْلَاناً.',
        transliteration: 'Edh-dhahibu lin-nevmi ba‘del ‘isha keslan; ene lestu keslanen.',
      },
    ],
    vocabulary: [
      { id: 'v6-1', arabic: 'صَلَاة', albanian: 'Namaz', root: 'ص-ل-و', type: 'noun', gender: 'F', plural: 'صَلَوَات' },
      { id: 'v6-2', arabic: 'مَسْجِد', albanian: 'Xhami', root: 'س-ج-د', type: 'noun', gender: 'M', plural: 'مَسَاجِد' },
      { id: 'v6-3', arabic: 'أَذَان', albanian: 'Ezan', root: 'أ-ذ-ن', type: 'noun', gender: 'M' },
      { id: 'v6-4', arabic: 'فَجْر', albanian: 'Sabah', root: 'ف-ج-ر', type: 'noun', gender: 'M' },
      { id: 'v6-5', arabic: 'ظُهْر', albanian: 'Dreka', root: 'ظ-ه-ر', type: 'noun', gender: 'M' },
      { id: 'v6-6', arabic: 'عَصْر', albanian: 'Ikindia', root: 'ع-ص-ر', type: 'noun', gender: 'M' },
      { id: 'v6-7', arabic: 'مَغْرِب', albanian: 'Akshami', root: 'غ-ر-ب', type: 'noun', gender: 'M' },
      { id: 'v6-8', arabic: 'عِشَاء', albanian: 'Jacia', root: 'ع-ش-و', type: 'noun', gender: 'M' },
      { id: 'v6-9', arabic: 'المَسْجِدُ الحَرَام', albanian: 'Qabeja (Mekë)', root: 'ح-ر-م', type: 'noun', gender: 'M' },
      { id: 'v6-10', arabic: 'المَسْجِدُ النَّبَوِيّ', albanian: 'Xhamia e Profetit', root: 'ن-ب-ء', type: 'noun', gender: 'M' },
      { id: 'v6-11', arabic: 'مَكَّة', albanian: 'Meka', root: '-', type: 'noun', gender: 'F' },
      { id: 'v6-12', arabic: 'المَدِينَة', albanian: 'Medina', root: 'م-د-ن', type: 'noun', gender: 'F' },
      { id: 'v6-13', arabic: 'مُنَبِّه', albanian: 'Orë alarmi', root: 'ن-ب-ه', type: 'noun', gender: 'M', plural: 'مُنَبِّهَات' },
      { id: 'v6-14', arabic: 'طَائِرَة', albanian: 'Aeroplan', root: 'ط-ي-ر', type: 'noun', gender: 'F', plural: 'طَائِرَات' },
      { id: 'v6-15', arabic: 'مُسَافِر', albanian: 'Udhëtar', root: 'س-ف-ر', type: 'noun', gender: 'M', plural: 'مُسَافِرُون' },
      { id: 'v6-16', arabic: 'مَرِيض', albanian: 'I sëmurë', root: 'م-ر-ض', type: 'adjective', gender: 'M', plural: 'مَرْضَى' },
      { id: 'v6-17', arabic: 'كَسْلَان', albanian: 'Dembel', root: 'ك-س-ل', type: 'adjective', gender: 'M', plural: 'كُسَالَى' },
      { id: 'v6-18', arabic: 'نَشِيط', albanian: 'Aktiv', root: 'ن-ش-ط', type: 'adjective', gender: 'M' },
      { id: 'v6-19', arabic: 'سَمِعَ', present: 'يَسْمَعُ', imperative: 'اِسْمَعْ', albanian: 'Dëgjoi', root: 'س-م-ع', type: 'verb' },
      { id: 'v6-20', arabic: 'اسْتَطَاعَ', present: 'يَسْتَطِيعُ', imperative: 'اِسْتَطِعْ', albanian: 'Mundi', root: 'ط-و-ع', type: 'verb' },
      { id: 'v6-21', arabic: 'رَكِبَ', present: 'يَرْكَبُ', imperative: 'اِرْكَبْ', albanian: 'Hipi', root: 'ر-ك-ب', type: 'verb' },
      { id: 'v6-22', arabic: 'انْتَظَرَ', present: 'يَنْتَظِرُ', imperative: 'اِنْتَظِرْ', albanian: 'Priti', root: 'ن-ظ-ر', type: 'verb' },
      { id: 'v6-23', arabic: 'وَضَعَ', present: 'يَضَعُ', imperative: 'ضَعْ', albanian: 'Vendosi', root: 'و-ض-ع', type: 'verb' },
      { id: 'v6-24', arabic: 'قَرِيب', albanian: 'I afërt', root: 'ق-ر-ب', type: 'adjective', gender: 'M' },
      { id: 'v6-25', arabic: 'بَعِيد', albanian: 'I largët', root: 'ب-ع-د', type: 'adjective', gender: 'M' },
      { id: 'v6-26', arabic: 'بِجَانِبِ', albanian: 'Pranë', root: 'ج-ن-ب', type: 'particle' },
      { id: 'v6-27', arabic: 'صَحِيح', albanian: 'I saktë / i shëndetshëm', root: 'ص-ح-ح', type: 'adjective', gender: 'M' },
      { id: 'v6-28', arabic: 'عَمِلَ', albanian: 'Punoi', root: 'ع-م-ل', type: 'verb', present: 'يَعْمَلُ', imperative: 'اِعْمَلْ' },
      { id: 'v6-29', arabic: 'سَافَرَ', albanian: 'Udhëtoi', root: 'س-ف-ر', type: 'verb', present: 'يُسَافِرُ', imperative: 'سَافِرْ' },
      { id: 'v6-30', arabic: 'فِكْرَة', albanian: 'Ide', root: 'ف-ك-ر', type: 'noun', gender: 'F', plural: 'أَفْكَار' },
      { id: 'v6-31', arabic: 'لَيْل', albanian: 'Natë', root: 'ل-ي-ل', type: 'noun', gender: 'M', plural: 'لَيَالٍ' },
    ],
    grammarFocus: [
      'أَسْتَطِيعُ + أَنْ + mudari‘ mansub: أَسْتَطِيعُ أَنْ أَذْهَبَ (mund të shkoj)',
      'E ardhmja me سَـ / سَوْفَ + mudari‘: سَنَرْكَبُ (do të hipim)',
      'لِـ (lam) + emër/folje: لِلنَّوْمِ، لِيَكُونَ',
      'Numrat rendorë 6–10 (M): السَّادِس، السَّابِع، الثَّامِن، التَّاسِع، العَاشِر',
      'Shprehje lutjesh: إِنْ شَاءَ اللَّهُ، جَزَاكَ اللَّهُ خَيْراً',
    ],
    exercises: [
      {
        id: 'ex6-1',
        type: 'transform',
        prompt: 'Ndërto: "mund të shkoj" (أَنْ + mudari mansub)',
        source: { arabic: 'أَذْهَبُ', albanian: 'shkoj' },
        answer: 'أَسْتَطِيعُ أَنْ أَذْهَبَ',
        hint: 'Pas أَنْ mudari merr fetha në fund (أَذْهَبَ), jo damme.',
        grammarPoint: 'Mansub me أَنْ',
      },
      {
        id: 'ex6-2',
        type: 'transform',
        prompt: 'Shto سَـ për të ardhmen: "do të hipim"',
        source: { arabic: 'نَرْكَبُ السَّيَّارَةَ.', albanian: 'Hipim në makinë.' },
        answer: 'سَنَرْكَبُ السَّيَّارَةَ.',
        hint: 'سَـ ngjitet pa hapësirë përpara foljes mudari.',
        grammarPoint: 'E ardhme سَـ',
      },
      {
        id: 'ex6-3',
        type: 'transform',
        prompt: 'Shto parafjalën لِـ te "gjumi"',
        source: { arabic: 'النَّوْم', albanian: 'gjumi' },
        answer: 'لِلنَّوْمِ',
        hint: 'لِـ + الـ bashkohen në "لل"; emri merr kesrën.',
        grammarPoint: 'Parafjalë لِـ',
      },
      {
        id: 'ex6-4',
        type: 'transform',
        prompt: 'Kthe numrin në rendor mashkullor: "i nënti"',
        source: { arabic: 'تِسْعَة', albanian: 'nëntë' },
        answer: 'التَّاسِعُ',
        hint: 'Numri rendor mashkullor në modelin فَاعِل me الـ.',
        grammarPoint: 'Numër rendor',
      },
      {
        id: 'ex6-5',
        type: 'transform',
        prompt: 'Ndërto: "të pres te xhamia insh\'Allah"',
        source: { arabic: 'أَنْتَظِرُ + المَسْجِد', albanian: 'pres + xhami' },
        answer: 'أَنْتَظِرُكَ عِنْدَ المَسْجِدِ إِنْ شَاءَ اللَّهُ.',
        hint: 'Shto ـكَ në fund të foljes; عِنْدَ + emri në gjenitiv.',
        grammarPoint: 'Shprehje lutjesh',
      },
      {
        id: 'ex6-6',
        type: 'transform',
        prompt: 'Ndërto folje të ardhme mansube: "që të jem aktiv"',
        source: { arabic: 'يَكُونُ نَشِيطاً', albanian: 'është aktiv' },
        answer: 'لِيَكُونَ نَشِيطاً',
        hint: 'لِـ (për të) + mudari mansub: يَكُونُ → يَكُونَ.',
        grammarPoint: 'Mansub me لِـ',
      },
    ],
    stories: [
      {
        id: 's6-1',
        titleAl: 'Musa në xhaminë e lagjes',
        albanian:
          'Musa e vendos orën e alarmit para se të flejë, që të mos vonohet për namazin e sabahut. Kur dëgjon ezanin, ngrihet shpejt dhe merr avdes. Xhamia është afër shtëpisë së tij, pranë parkut, por ndonjëherë hipën në makinë kur bie shi i shumtë. Në xhami takon shokët e tij dhe mëson nga imami ajetet e Kuranit. Insh’Allah një ditë do të falet edhe në Xhaminë e Profetit në Medinë dhe në Qabe në Mekë. Namazi nuk është pjesë për të dembelët, por për besimtarët aktivë që e duan Allahun.',
        arabic:
          'يَضَعُ مُوسَى المُنَبِّهَ قَبْلَ النَّوْمِ، لِئَلَّا يَتَأَخَّرَ عَنْ صَلَاةِ الفَجْرِ. عِنْدَمَا يَسْمَعُ الأَذَانَ يَقُومُ سَرِيعاً وَيَتَوَضَّأُ. المَسْجِدُ قَرِيبٌ مِنْ بَيْتِهِ، بِجَانِبِ الحَدِيقَةِ، وَلَكِنَّهُ يَرْكَبُ السَّيَّارَةَ أَحْيَاناً حِينَ يَنْزِلُ مَطَرٌ كَثِيرٌ. فِي المَسْجِدِ يَلْتَقِي بِأَصْدِقَائِهِ وَيَتَعَلَّمُ الآيَاتِ مِنَ الإِمَامِ. إِنْ شَاءَ اللَّهُ يَوْماً مَا سَيُصَلِّي فِي المَسْجِدِ النَّبَوِيِّ بِالمَدِينَةِ وَفِي المَسْجِدِ الحَرَامِ بِمَكَّةَ. الصَّلَاةُ لَيْسَتْ لِلْكُسَالَى، بَلْ لِلْمُؤْمِنِينَ النَّشِيطِينَ الَّذِينَ يُحِبُّونَ اللَّهَ.',
        transliteration:
          "Jeda‘u Musa el-munebbihe kabled-nevm, li’ella jete’ekhkhare ‘an salatil fexhr. ‘Indema jesme‘ul edhan jekumu seri‘an ve jetevedda. El-mesxhidu karibun min bejtihi, bi xhanibil hadika, ve lakinnehu jerkebus-sejjare ehjanen hine jenzilu meterun kethir. Fil mesxhid jeltaki bi asdikaihi ve jete‘al-lemul ajati minel imam. Inshallah jewmen ma sejusal-li fil mesxhidin-nebevijj bil medine ve fil mesxhidil harami bi Mekke. Es-salatu lejset lil kusala, bel lil mu’minin en-neshitin el-ledhine juhibbunAllah.",
      },
    ],
    ayat: [
      {
        // El-Isra 17:1 — ajeti i Israsë: Muhammedi (s.a.v.s) udhëtoi nga
        // el-Mesxhidul-Haram në el-Mesxhidul-Aksa. Përmban dy xhami dhe
        // lidh fjalorin "xhami + Meka" në një skenë madhështore. Fjalët
        // المَسْجِد dhe الحَرَام janë drejt nga fjalori i kapitullit.
        reference: '17:1',
        surahNameAr: 'الإِسْرَاء',
        surahNameAl: 'El-Isra',
        arabic:
          'سُبْحَانَ الَّذِي أَسْرَىٰ بِعَبْدِهِ لَيْلًا مِّنَ الْمَسْجِدِ الْحَرَامِ إِلَى الْمَسْجِدِ الْأَقْصَى الَّذِي بَارَكْنَا حَوْلَهُ لِنُرِيَهُ مِنْ آيَاتِنَا ۚ إِنَّهُ هُوَ السَّمِيعُ الْبَصِيرُ',
        albanian:
          'I lartësuar është Ai që e bëri robin e Vet të udhëtonte natën prej Mesxhidit të Shenjtë (në Mekë) në Mesxhidin e Largët (Kudsi), rreth të cilit kemi bekuar, për t\'ia treguar disa nga shenjat Tona. Vërtet Ai është Dëgjuesi, Shikuesi.',
        knownWords: [
          {
            surface: 'الْمَسْجِدِ الْحَرَامِ',
            gloss: 'Mesxhidit të Shenjtë (Qabes)',
          },
          { surface: 'الْمَسْجِدِ', gloss: 'xhamisë (nga مَسْجِد)' },
          { surface: 'هُوَ', gloss: 'Ai' },
        ],
      },
      {
        // El-Xhumu‘a 62:9 — thirrja për namazin e xhumasë. Tri fjalë të
        // njohura: لِلصَّلَاةِ (namaz), يَوْمِ (ditë, Kap. 4), dhe vetë
        // emri i xhumasë. Nxit nxënësin të kuptojë se si fjalori i
        // kohës + namazit puqet në një urdhër tipik.
        reference: '62:9',
        surahNameAr: 'الجُمُعَة',
        surahNameAl: 'El-Xhumu‘a',
        arabic:
          'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ فَاسْعَوْا إِلَىٰ ذِكْرِ اللَّهِ وَذَرُوا الْبَيْعَ ۚ ذَٰلِكُمْ خَيْرٌ لَّكُمْ إِن كُنتُمْ تَعْلَمُونَ',
        albanian:
          'O ju që besuat! Kur thirret për namaz ditën e xhumasë, nxitoni te përmendja e Allahut dhe lëreni shitblerjen — kjo është më e mirë për ju, nëse e dini.',
        knownWords: [
          { surface: 'لِلصَّلَاةِ', gloss: 'për namazin (nga صَلَاة)' },
          { surface: 'يَوْمِ', gloss: 'ditës (nga يَوْم)' },
        ],
      },
      {
        // El-Ankebut 29:45 — vargu që thotë se "namazi pengon nga e
        // shëmtuara". الصَّلَاة shfaqet dy herë në të njëjtin ajet —
        // theksim i plotë i fjalës qendrore të kapitullit, me kuptim
        // moralo-shpirtëror.
        reference: '29:45',
        surahNameAr: 'العَنْكَبُوت',
        surahNameAl: 'El-Ankebut',
        arabic:
          'اتْلُ مَا أُوحِيَ إِلَيْكَ مِنَ الْكِتَابِ وَأَقِمِ الصَّلَاةَ إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ وَلَذِكْرُ اللَّهِ أَكْبَرُ وَاللَّهُ يَعْلَمُ مَا تَصْنَعُونَ',
        albanian:
          'Lexo atë që të është shpallur nga Libri dhe fale namazin; vërtet namazi pengon nga e shëmtuara dhe e keqja, kurse përmendja e Allahut është më e madhja. Allahu di çdo gjë që bëni.',
        knownWords: [
          { surface: 'الصَّلَاةَ', gloss: 'namazin (nga صَلَاة)' },
        ],
      },
      {
        // Et-Teube 9:18 — kush i mban xhamitë e Allahut: besimtarët.
        // Shumësi مَسَاجِد (xhamitë) i shton dimensionin plural fjalës
        // njëjës مَسْجِد që nxënësi ka mësuar. Ajet-ftesë për lidhjen
        // personale me shtëpinë e Allahut në çdo lagje e çdo qytet.
        reference: '9:18',
        surahNameAr: 'التَّوْبَة',
        surahNameAl: 'Et-Teube',
        arabic:
          'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ',
        albanian:
          'Xhamitë e Allahut i mban vetëm ai që beson në Allahun dhe në Ditën e Fundit.',
        knownWords: [
          { surface: 'مَسَاجِدَ', gloss: 'xhamitë (shumësi i مَسْجِد)' },
        ],
      },
      {
        // El-Bekare 2:238 — urdhri për të "ruajtur" namazet. الصَّلَوَات
        // është shumësi i صَلَاة — një fjalë që nxënësi e njeh në njëjës,
        // këtu e sheh në shumës. Një ajet i shkurtër që përmbledh gjithë
        // disiplinën e pesë namazeve ditore.
        reference: '2:238',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'حَافِظُوا عَلَى الصَّلَوَاتِ وَالصَّلَاةِ الْوُسْطَىٰ وَقُومُوا لِلَّهِ قَانِتِينَ',
        albanian:
          'Ruani namazet, sidomos namazin e mesëm, dhe qëndroni para Allahut me përkushtim.',
        knownWords: [
          {
            surface: 'الصَّلَوَاتِ',
            gloss: 'namazet (shumësi i صَلَاة)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 7,
    titleAr: 'الدِّرَاسَة',
    titleAl: 'Studimi',
    titleEn: 'Study',
    dialogues: [
      {
        id: 'd7-1',
        albanian: 'Sa është ora? Ka filluar mësimi?',
        arabic: 'كَمِ السَّاعَةُ؟ هَلْ بَدَأَ الدَّرْسُ؟',
        transliteration: 'Kemis-sa‘a? Hel bede’ed-ders?',
      },
      {
        id: 'd7-2',
        albanian: 'Ora është tetë, klasa fillon tani.',
        arabic: 'السَّاعَةُ الثَّامِنَةُ، الحِصَّةُ تَبْدَأُ الآنَ.',
        transliteration: 'Es-sa‘atuth-thamine, el-hissa tebdeul an.',
      },
      {
        id: 'd7-3',
        albanian: 'Cila është lënda jote e preferuar?',
        arabic: 'مَا مَادَّتُكَ المُفَضَّلَةُ؟',
        transliteration: 'Ma maddetukel mufaddale?',
      },
      {
        id: 'd7-4',
        albanian: 'Matematika, gjuha arabe dhe shkencat.',
        arabic: 'الرِّيَاضِيَّاتُ وَاللُّغَةُ العَرَبِيَّةُ وَالعُلُومُ.',
        transliteration: 'Er-rijadijat vel lugatul arabijje vel ‘ulum.',
      },
      {
        id: 'd7-5',
        albanian: 'A ke provim të shtunën?',
        arabic: 'هَلْ لَدَيْكَ اخْتِبَارٌ يَوْمَ السَّبْتِ؟',
        transliteration: 'Hel ledejke ikhtibarun jewmes-sebt?',
      },
      {
        id: 'd7-6',
        albanian: 'Po, dhe pushimi është vetëm gjysmë ore.',
        arabic: 'نَعَمْ، وَالاسْتِرَاحَةُ نِصْفُ سَاعَةٍ فَقَطْ.',
        transliteration: 'Ne‘am, vel istiraha nisfu sa‘atin fekat.',
      },
    ],
    vocabulary: [
      { id: 'v7-1', arabic: 'دِرَاسَة', albanian: 'Studim', root: 'د-ر-س', type: 'noun', gender: 'F', plural: 'دِرَاسَات' },
      { id: 'v7-2', arabic: 'مَدْرَسَة', albanian: 'Shkollë', root: 'د-ر-س', type: 'noun', gender: 'F', plural: 'مَدَارِس' },
      { id: 'v7-3', arabic: 'جَامِعَة', albanian: 'Universitet', root: 'ج-م-ع', type: 'noun', gender: 'F', plural: 'جَامِعَات' },
      { id: 'v7-4', arabic: 'صَفّ', albanian: 'Klasë', root: 'ص-ف-ف', type: 'noun', gender: 'M', plural: 'صُفُوف' },
      { id: 'v7-5', arabic: 'حِصَّة', albanian: 'Orë mësimi', root: 'ح-ص-ص', type: 'noun', gender: 'F', plural: 'حِصَص' },
      { id: 'v7-6', arabic: 'مَادَّة', albanian: 'Lëndë', root: 'م-د-د', type: 'noun', gender: 'F', plural: 'مَوَادّ' },
      { id: 'v7-7', arabic: 'جَدْوَل', albanian: 'Orari', root: 'ج-د-ل', type: 'noun', gender: 'M', plural: 'جَدَاوِل' },
      { id: 'v7-8', arabic: 'اسْتِرَاحَة', albanian: 'Pushim', root: 'ر-و-ح', type: 'noun', gender: 'F', plural: 'اسْتِرَاحَات' },
      { id: 'v7-9', arabic: 'مَكْتَبَة', albanian: 'Bibliotekë', root: 'ك-ت-ب', type: 'noun', gender: 'F', plural: 'مَكْتَبَات' },
      { id: 'v7-10', arabic: 'مُخْتَبَر', albanian: 'Laborator', root: 'خ-ب-ر', type: 'noun', gender: 'M', plural: 'مُخْتَبَرَات' },
      { id: 'v7-11', arabic: 'حَاسُوب', albanian: 'Kompjuter', root: '-', type: 'noun', gender: 'M', plural: 'حَوَاسِيب' },
      { id: 'v7-12', arabic: 'اخْتِبَار', albanian: 'Provim', root: 'خ-ب-ر', type: 'noun', gender: 'M', plural: 'اخْتِبَارَات' },
      { id: 'v7-13', arabic: 'لَوْحَة', albanian: 'Tabelë', root: 'ل-و-ح', type: 'noun', gender: 'F', plural: 'لَوْحَات' },
      { id: 'v7-14', arabic: 'وَقْت', albanian: 'Kohë', root: 'و-ق-ت', type: 'noun', gender: 'M', plural: 'أَوْقَات' },
      { id: 'v7-15', arabic: 'شَهْر', albanian: 'Muaj', root: 'ش-ه-ر', type: 'noun', gender: 'M', plural: 'أَشْهُر' },
      { id: 'v7-16', arabic: 'عَام', albanian: 'Vit', root: 'ع-و-م', type: 'noun', gender: 'M', plural: 'أَعْوَام' },
      { id: 'v7-17', arabic: 'ثَقَافَة', albanian: 'Kulturë', root: 'ث-ق-ف', type: 'noun', gender: 'F', plural: 'ثَقَافَات' },
      { id: 'v7-18', arabic: 'لُغَة', albanian: 'Gjuhë', root: 'ل-غ-و', type: 'noun', gender: 'F', plural: 'لُغَات' },
      { id: 'v7-19', arabic: 'عِلْم', albanian: 'Shkencë / dije', root: 'ع-ل-م', type: 'noun', gender: 'M', plural: 'عُلُوم' },
      { id: 'v7-20', arabic: 'رِيَاضِيَّات', albanian: 'Matematikë', root: 'ر-و-ض', type: 'noun', gender: 'F' },
      { id: 'v7-21', arabic: 'بَدَأَ', present: 'يَبْدَأُ', imperative: 'اِبْدَأْ', albanian: 'Filloi', root: 'ب-د-ء', type: 'verb' },
      { id: 'v7-22', arabic: 'انْتَهَى', present: 'يَنْتَهِي', imperative: 'اِنْتَهِ', albanian: 'Mbaroi', root: 'ن-ه-ي', type: 'verb' },
      { id: 'v7-23', arabic: 'كَتَبَ', present: 'يَكْتُبُ', imperative: 'اُكْتُبْ', albanian: 'Shkroi', root: 'ك-ت-ب', type: 'verb' },
      { id: 'v7-24', arabic: 'دَرَسَ', present: 'يَدْرُسُ', imperative: 'اُدْرُسْ', albanian: 'Studioi', root: 'د-ر-س', type: 'verb' },
      { id: 'v7-25', arabic: 'كَانَ', present: 'يَكُونُ', imperative: 'كُنْ', albanian: 'Ishte', root: 'ك-و-ن', type: 'verb' },
      { id: 'v7-26', arabic: 'نَظَرَ', present: 'يَنْظُرُ', imperative: 'اُنْظُرْ', albanian: 'Shikoi', root: 'ن-ظ-ر', type: 'verb' },
      { id: 'v7-27', arabic: 'طَوِيل', albanian: 'I gjatë', root: 'ط-و-ل', type: 'adjective', gender: 'M' },
      { id: 'v7-28', arabic: 'قَصِير', albanian: 'I shkurtër', root: 'ق-ص-ر', type: 'adjective', gender: 'M' },
      { id: 'v7-29', arabic: 'أَكْمَلَ', albanian: 'Përfundoi/Kompletoi', root: 'ك-م-ل', type: 'verb', present: 'يُكْمِلُ', imperative: 'أَكْمِلْ' },
      { id: 'v7-30', arabic: 'صَحَّحَ', albanian: 'Korrigjoi', root: 'ص-ح-ح', type: 'verb', present: 'يُصَحِّحُ', imperative: 'صَحِّحْ' },
      { id: 'v7-31', arabic: 'أُسْبُوع', albanian: 'Javë', root: 'س-ب-ع', type: 'noun', gender: 'M', plural: 'أَسَابِيع' },
      { id: 'v7-32', arabic: 'كُلِّيَّة', albanian: 'Fakultet', root: 'ك-ل-ل', type: 'noun', gender: 'F', plural: 'كُلِّيَّات' },
    ],
    grammarFocus: [
      'Ora në formë femërore: السَّاعَةُ الثَّامِنَةُ، السَّاعَةُ الخَامِسَةُ',
      'Idafa e trefishtë: مَادَّةُ اللُّغَةِ العَرَبِيَّةِ',
      'كَانَ + khaber (kallëzues) në kallëzore: كَانَ الدَّرْسُ طَوِيلاً',
      'Pyetje me كَمْ për orën: كَمِ السَّاعَةُ؟',
      'Ditët e javës: السَّبْت، الأَحَد، الاثْنَيْن، الثُّلَاثَاء، الأَرْبَعَاء، الخَمِيس، الجُمُعَة',
    ],
    exercises: [
      {
        id: 'ex7-1',
        type: 'transform',
        prompt: 'Shpreh orën në femërore: "ora tetë"',
        source: { arabic: 'السَّاعَة + ثَمَانِيَة', albanian: 'ora + tetë' },
        answer: 'السَّاعَةُ الثَّامِنَةُ',
        hint: 'Rendori në femërore (ة) me "AL", pajtohet me السَّاعَة.',
        grammarPoint: 'Ora (F)',
      },
      {
        id: 'ex7-2',
        type: 'transform',
        prompt: 'Ndërto idafën e trefishtë: "lënda e gjuhës arabe"',
        source: { arabic: 'مَادَّة + اللُّغَة + العَرَبِيَّة', albanian: 'lëndë + gjuhë + arabe' },
        answer: 'مَادَّةُ اللُّغَةِ العَرَبِيَّةِ',
        hint: 'Emri i parë me damme pa tenvin, pastaj zinxhir në kesra.',
        grammarPoint: 'Idafa e trefishtë',
      },
      {
        id: 'ex7-3',
        type: 'transform',
        prompt: 'Shto كَانَ dhe kthe khabarin në kallëzore',
        source: { arabic: 'الدَّرْسُ طَوِيلٌ.', albanian: 'Mësimi është i gjatë.' },
        answer: 'كَانَ الدَّرْسُ طَوِيلاً.',
        hint: 'كَانَ e bën khabarin mansub — tenvin fetha + alif.',
        grammarPoint: 'كَانَ + khabar',
      },
      {
        id: 'ex7-4',
        type: 'transform',
        prompt: 'Ndërto pyetjen për orën',
        source: { arabic: 'السَّاعَة', albanian: 'ora' },
        answer: 'كَمِ السَّاعَةُ؟',
        hint: 'كَمْ merr kesrën për lehtësim (كَمِ) para një fjale të shquar.',
        grammarPoint: 'كَمِ السَّاعَةُ؟',
      },
      {
        id: 'ex7-5',
        type: 'transform',
        prompt: 'Ndërto: "ditën e shtunë"',
        source: { arabic: 'يَوْم + السَّبْت', albanian: 'ditë + shtuna' },
        answer: 'يَوْمَ السَّبْتِ',
        hint: 'Idafa: يَوْم në kallëzore (ظرف زمان), السَّبْت në kesra.',
        grammarPoint: 'Ditët e javës',
      },
      {
        id: 'ex7-6',
        type: 'transform',
        prompt: 'Ndërto: "ishte ora e dhjetë"',
        source: { arabic: 'السَّاعَة + عَشْرَة', albanian: 'ora + dhjetë' },
        answer: 'كَانَتِ السَّاعَةُ العَاشِرَةَ.',
        hint: 'كَانَ në femërore (كَانَتْ) — khabari merr fetha.',
        grammarPoint: 'كَانَ + khabar',
      },
    ],
    stories: [
      {
        id: 's7-1',
        titleAl: 'Musa në universitet',
        albanian:
          'Musa studion në Universitetin Islamik prej dy vitesh. Mësimi fillon në orën tetë të mëngjesit dhe mbaron në orën dy pasdite. Pas orës së parë ka pushim gjysmë ore, ku nxënësit pinë çaj dhe flasin për orarin. Lënda e tij e preferuar është gjuha arabe, pastaj matematika dhe shkencat. Në bibliotekë shkruan detyrat dhe lexon libra të rinj çdo ditë. Në laborator përdor kompjuterin për të mësuar drejtshkrimin. Provimet janë të shtunën, prandaj Musa studion shumë në mbrëmje. Allahu e bekoftë dijen që ai merr.',
        arabic:
          'يَدْرُسُ مُوسَى فِي الجَامِعَةِ الإِسْلَامِيَّةِ مُنْذُ عَامَيْنِ. يَبْدَأُ الدَّرْسُ فِي السَّاعَةِ الثَّامِنَةِ صَبَاحاً وَيَنْتَهِي فِي السَّاعَةِ الثَّانِيَةِ ظُهْراً. بَعْدَ الحِصَّةِ الأُولَى اسْتِرَاحَةٌ نِصْفُ سَاعَةٍ، يَشْرَبُ فِيهَا الطُّلَّابُ الشَّايَ وَيَتَكَلَّمُونَ عَنِ الجَدْوَلِ. مَادَّتُهُ المُفَضَّلَةُ هِيَ اللُّغَةُ العَرَبِيَّةُ، ثُمَّ الرِّيَاضِيَّاتُ وَالعُلُومُ. فِي المَكْتَبَةِ يَكْتُبُ الوَاجِبَاتِ وَيَقْرَأُ الكُتُبَ الجَدِيدَةَ كُلَّ يَوْمٍ. فِي المُخْتَبَرِ يَسْتَخْدِمُ الحَاسُوبَ لِتَعَلُّمِ الإِمْلَاءِ. الاخْتِبَارَاتُ يَوْمَ السَّبْتِ، فَيَدْرُسُ مُوسَى كَثِيراً فِي المَسَاءِ. بَارَكَ اللَّهُ لَهُ فِي العِلْمِ الَّذِي يَأْخُذُهُ.',
        transliteration:
          "Jedrusu Musa fil xhami‘atil islamijje mundhu ‘amejn. Jebdeud-dersu fis-sa‘atith-thamine sabahan ve jentehi fis-sa‘atith-thanije zuhren. Ba‘del hissetil ula istiraha nisfu sa‘a, jeshrebu fihet-tullabush-shaj ve jetekel-lemun ‘anil xhedvel. Maddetuhul mufaddale hijel lugatul ‘arabijje, thummer-rijadijjat vel ‘ulum. Fil mektebe jektubul vaxhibat ve jakraul kutubel xhedide kul-le jewm. Fil mukhtebar jestakhdimul hasub li te‘al-lumil imla. El-ikhtibaratu jewmes-sebt, fejedrusu Musa kethiren fil mesa. BarekAllahu lehu fil ‘ilmil-ledhi je’khudhuh.",
      },
    ],
    ayat: [
      {
        // El-Alek 96:1 — shpallja e parë për Muhammedin (s.a.v.s):
        // "Lexo!". Ajeti që çel të gjithë Kuranin, dhe tematikisht
        // fillimi i çdo dije. بِاسْمِ + رَبِّكَ lidhin fjalët e
        // Kapitullit 1 (اسْم, رَبّ) me urdhrin për të lexuar që
        // karakterizon Kapitullin 7.
        reference: '96:1',
        surahNameAr: 'العَلَق',
        surahNameAl: 'El-Alek',
        arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ',
        albanian:
          'Lexo në emër të Zotit tënd, i Cili krijoi.',
        knownWords: [
          { surface: 'بِاسْمِ', gloss: 'në emër të (nga اسْم)' },
          { surface: 'رَبِّكَ', gloss: 'Zotit tënd (nga رَبّ)' },
        ],
      },
      {
        // Taha 20:114 — duaja më e famshme e dijes, e këshilluar për
        // kërkuesit e diturisë: "O Zoti im, ma shto dijen". Në vetëm
        // tri fjalë përmblidhet qëllimi i kapitullit. Nxënësi mund të
        // përdorë këtë dua çdo ditë.
        reference: '20:114',
        surahNameAr: 'طَه',
        surahNameAl: 'Taha',
        arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
        albanian:
          'Dhe thuaj: "O Zoti im, më shto dijen!"',
        knownWords: [
          { surface: 'رَّبِّ', gloss: 'o Zoti im (nga رَبّ)' },
          { surface: 'عِلْمًا', gloss: 'dije (nga عِلْم)' },
        ],
      },
      {
        // El-Muxhadele 58:11 — premtimi që dija ngre gradën e besimtarit.
        // Përmendet الْعِلْم drejtpërdrejt, dhe ofron motiv për nxënësin:
        // studimi nuk është vetëm detyrë shkollore por ngritje para
        // Allahut.
        reference: '58:11',
        surahNameAr: 'المُجَادَلَة',
        surahNameAl: 'El-Muxhadele',
        arabic:
          'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ ۚ وَاللَّهُ بِمَا تَعْمَلُونَ خَبِيرٌ',
        albanian:
          'Allahu do t\'i ngrejë në shkallë të larta ata që besuan prej jush dhe ata që iu dha dija; Allahu është i Njoftuar për çdo gjë që veproni.',
        knownWords: [
          { surface: 'الْعِلْمَ', gloss: 'dijen (nga عِلْم)' },
        ],
      },
      {
        // El-Alek 96:4 — vargu që lavdëron penën si mjet i dijes: "Ai që
        // mësoi me anë të penës". عَلَّمَ (folje, rrënja ع-ل-م si عِلْم)
        // dhe بِالْقَلَمِ (pena, mjeti i كَتَبَ) bashkohen: mësimi është
        // folje aktive, jo pasiv — dhe pena është urë hyjnore.
        reference: '96:4',
        surahNameAr: 'العَلَق',
        surahNameAl: 'El-Alek',
        arabic: 'الَّذِي عَلَّمَ بِالْقَلَمِ',
        albanian:
          'Ai që (e) mësoi (njeriun) me anë të penës.',
        knownWords: [
          { surface: 'عَلَّمَ', gloss: 'mësoi (folje, nga rrënja ع-ل-م si عِلْم)' },
          {
            surface: 'بِالْقَلَمِ',
            gloss: 'me penë (mjeti i shkrimit, si كَتَبَ)',
          },
        ],
      },
      {
        // El-Bekare 2:2 — fjalët e para të sures më të gjatë: "Ky është
        // Libri, s'ka dyshim në të". الْكِتَاب (libri) ndan rrënjën ك-ت-ب
        // me كَتَبَ (v7-23, "shkroi"). Nxënësi që mëson foljen "shkroi"
        // këtu sheh se Kurani vetë quhet الْكِتَاب — "i Shkruari".
        reference: '2:2',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
        albanian:
          'Ky është Libri, në të cilin nuk ka dyshim; udhëzim për të devotshmit.',
        knownWords: [
          {
            surface: 'الْكِتَابُ',
            gloss: 'Libri (nga rrënja ك-ت-ب si كَتَبَ)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 8,
    titleAr: 'العَمَلُ وَالمِهَن',
    titleAl: 'Puna dhe Profesionet',
    titleEn: 'Work & Professions',
    dialogues: [
      {
        id: 'd8-1',
        albanian: 'Çfarë profesioni ke? Ku punon?',
        arabic: 'مَا مِهْنَتُكَ؟ أَيْنَ تَعْمَلُ؟',
        transliteration: 'Ma mihnetuke? Ejne ta‘melu?',
      },
      {
        id: 'd8-2',
        albanian: 'Unë punoj si inxhinier në një kompani.',
        arabic: 'أَعْمَلُ مُهَنْدِساً فِي شَرِكَةٍ.',
        transliteration: 'A‘melu muhendisen fi sharike.',
      },
      {
        id: 'd8-3',
        albanian: 'Babai im është mjek në spital.',
        arabic: 'وَالِدِي طَبِيبٌ فِي المُسْتَشْفَى.',
        transliteration: 'Walidi tabibun fil mustashfa.',
      },
      {
        id: 'd8-4',
        albanian: 'Motra ime studion në Fakultetin e Farmacisë.',
        arabic: 'أُخْتِي تَدْرُسُ فِي كُلِّيَّةِ الصَّيْدَلَةِ.',
        transliteration: 'Ukhti tedrusu fi kul-lijjetis-sajdele.',
      },
      {
        id: 'd8-5',
        albanian: 'Vëllai i vogël ëndërron të bëhet pilot.',
        arabic: 'أَخِي الصَّغِيرُ يَحْلُمُ أَنْ يَكُونَ طَيَّاراً.',
        transliteration: 'Ekhis-sagir jehlumu en jekune tajjaren.',
      },
      {
        id: 'd8-6',
        albanian: 'E dua punën time dhe i dua fëmijët që mësoj.',
        arabic: 'أُحِبُّ عَمَلِي وَأُحِبُّ الأَطْفَالَ الَّذِينَ أُدَرِّسُهُمْ.',
        transliteration: 'Uhibbu ‘ameli ve uhibbul etfale el-ledhine uderrisuhum.',
      },
    ],
    vocabulary: [
      { id: 'v8-1', arabic: 'عَمَل', albanian: 'Punë', root: 'ع-م-ل', type: 'noun', gender: 'M', plural: 'أَعْمَال' },
      { id: 'v8-2', arabic: 'مِهْنَة', albanian: 'Profesion', root: 'م-ه-ن', type: 'noun', gender: 'F', plural: 'مِهَن' },
      { id: 'v8-3', arabic: 'شَرِكَة', albanian: 'Kompani', root: 'ش-ر-ك', type: 'noun', gender: 'F', plural: 'شَرِكَات' },
      { id: 'v8-4', arabic: 'مُسْتَشْفَى', albanian: 'Spital', root: 'ش-ف-ي', type: 'noun', gender: 'M', plural: 'مُسْتَشْفَيَات' },
      { id: 'v8-5', arabic: 'صَيْدَلِيَّة', albanian: 'Farmaci', root: 'ص-ي-د-ل', type: 'noun', gender: 'F', plural: 'صَيْدَلِيَّات' },
      { id: 'v8-6', arabic: 'طَبِيب', albanian: 'Mjek', root: 'ط-ب-ب', type: 'noun', gender: 'M', plural: 'أَطِبَّاء' },
      { id: 'v8-7', arabic: 'طَبِيبَة', albanian: 'Mjeke', root: 'ط-ب-ب', type: 'noun', gender: 'F', plural: 'طَبِيبَات' },
      { id: 'v8-8', arabic: 'مُهَنْدِس', albanian: 'Inxhinier', root: 'ه-ن-د-س', type: 'noun', gender: 'M', plural: 'مُهَنْدِسُون' },
      { id: 'v8-9', arabic: 'مُمَرِّض', albanian: 'Infermier', root: 'م-ر-ض', type: 'noun', gender: 'M', plural: 'مُمَرِّضُون' },
      { id: 'v8-10', arabic: 'صَيْدَلِيّ', albanian: 'Farmacist', root: 'ص-ي-د-ل', type: 'noun', gender: 'M', plural: 'صَيَادِلَة' },
      { id: 'v8-11', arabic: 'طَيَّار', albanian: 'Pilot', root: 'ط-ي-ر', type: 'noun', gender: 'M', plural: 'طَيَّارُون' },
      { id: 'v8-12', arabic: 'طِفْل', albanian: 'Fëmijë', root: 'ط-ف-ل', type: 'noun', gender: 'M', plural: 'أَطْفَال' },
      { id: 'v8-13', arabic: 'مَرْحَلَة', albanian: 'Etapë shkollore', root: 'ر-ح-ل', type: 'noun', gender: 'F', plural: 'مَرَاحِل' },
      { id: 'v8-14', arabic: 'المَرْحَلَةُ الابْتِدَائِيَّة', albanian: 'Shkolla fillore', root: 'ب-د-ء', type: 'noun', gender: 'F' },
      { id: 'v8-15', arabic: 'المَرْحَلَةُ المُتَوَسِّطَة', albanian: 'Shkolla e mesme', root: 'و-س-ط', type: 'noun', gender: 'F' },
      { id: 'v8-16', arabic: 'كُلِّيَّةُ الهَنْدَسَة', albanian: 'Fakulteti i Inxhinierisë', root: 'ه-ن-د-س', type: 'noun', gender: 'F' },
      { id: 'v8-17', arabic: 'كُلِّيَّةُ الطِّبّ', albanian: 'Fakulteti i Mjekësisë', root: 'ط-ب-ب', type: 'noun', gender: 'F' },
      { id: 'v8-18', arabic: 'كُلِّيَّةُ الصَّيْدَلَة', albanian: 'Fakulteti i Farmacisë', root: 'ص-ي-د-ل', type: 'noun', gender: 'F' },
      { id: 'v8-19', arabic: 'كُلِّيَّةُ التَّمْرِيض', albanian: 'Fakulteti i Infermierisë', root: 'م-ر-ض', type: 'noun', gender: 'F' },
      { id: 'v8-20', arabic: 'كُلِّيَّةُ الطَّيَرَان', albanian: 'Fakulteti i Aviacionit', root: 'ط-ي-ر', type: 'noun', gender: 'F' },
      { id: 'v8-21', arabic: 'طَارَ', present: 'يَطِيرُ', imperative: 'طِرْ', albanian: 'Fluturoi', root: 'ط-ي-ر', type: 'verb' },
      { id: 'v8-22', arabic: 'أَحَبَّ', present: 'يُحِبُّ', imperative: 'أَحْبِبْ', albanian: 'E deshi', root: 'ح-ب-ب', type: 'verb' },
      { id: 'v8-23', arabic: 'دَرَّسَ', present: 'يُدَرِّسُ', imperative: 'دَرِّسْ', albanian: 'Mësoi (dikë)', root: 'د-ر-س', type: 'verb' },
      { id: 'v8-24', arabic: 'سَنَة', albanian: 'Vit', root: 'س-ن-و', type: 'noun', gender: 'F', plural: 'سَنَوَات' },
      { id: 'v8-25', arabic: 'رَسَمَ', albanian: 'Vizatoi', root: 'ر-س-م', type: 'verb', present: 'يَرْسُمُ', imperative: 'اُرْسُمْ' },
      { id: 'v8-26', arabic: 'اِخْتَارَ', albanian: 'Zgjodhi', root: 'خ-ي-ر', type: 'verb', present: 'يَخْتَارُ', imperative: 'اِخْتَرْ' },
      { id: 'v8-27', arabic: 'أَصْبَحَ', albanian: 'U bë (në mëngjes)', root: 'ص-ب-ح', type: 'verb', present: 'يُصْبِحُ', imperative: 'أَصْبِحْ' },
      { id: 'v8-28', arabic: 'مَلَأَ', albanian: 'Mbushi', root: 'م-ل-أ', type: 'verb', present: 'يَمْلَأُ', imperative: 'اِمْلَأْ' },
      { id: 'v8-29', arabic: 'اِسْتَرَاحَ', albanian: 'Pushoi', root: 'ر-و-ح', type: 'verb', present: 'يَسْتَرِيحُ', imperative: 'اِسْتَرِحْ' },
      { id: 'v8-30', arabic: 'شَخْص', albanian: 'Person', root: 'ش-خ-ص', type: 'noun', gender: 'M', plural: 'أَشْخَاص' },
      { id: 'v8-31', arabic: 'قَائِمَة', albanian: 'Listë', root: 'ق-و-م', type: 'noun', gender: 'F', plural: 'قَوَائِم' },
      { id: 'v8-32', arabic: 'فَرَاغ', albanian: 'Koha e lirë', root: 'ف-ر-غ', type: 'noun', gender: 'M', plural: 'فَرَاغَات' },
      { id: 'v8-33', arabic: 'مَكَان', albanian: 'Vend', root: 'ك-و-ن', type: 'noun', gender: 'M', plural: 'أَمَاكِن' },
      { id: 'v8-34', arabic: 'عِبَارَة', albanian: 'Shprehje', root: 'ع-ب-ر', type: 'noun', gender: 'F', plural: 'عِبَارَات' },
    ],
    grammarFocus: [
      'أَعْمَلُ + mbiemër në kallëzore (حال): أَعْمَلُ مُهَنْدِساً',
      'Idafa e fakulteteve: كُلِّيَّةُ + emri i fushës (كُلِّيَّةُ الطِّبّ)',
      'Folja أُحِبُّ + emër në kallëzore: أُحِبُّ عَمَلِي',
      'Numrat rendorë 11–12 (F): الحَادِيَةَ عَشْرَةَ، الثَّانِيَةَ عَشْرَةَ',
      'Përemrat lidhorë: الَّذِي (M) / الَّتِي (F) / الَّذِينَ (shumësi M)',
    ],
    exercises: [
      {
        id: 'ex8-1',
        type: 'transform',
        prompt: 'Ndërto: "unë punoj si inxhinier" (kallëzore hal)',
        source: { arabic: 'أَعْمَلُ + مُهَنْدِس', albanian: 'punoj + inxhinier' },
        answer: 'أَعْمَلُ مُهَنْدِساً.',
        hint: 'Profesioni merr tenvin fetha (ـاً) si hal.',
        grammarPoint: 'Kallëzore حال',
      },
      {
        id: 'ex8-2',
        type: 'transform',
        prompt: 'Ndërto idafën: "Fakulteti i Mjekësisë"',
        source: { arabic: 'كُلِّيَّة + الطِّبّ', albanian: 'fakultet + mjekësi' },
        answer: 'كُلِّيَّةُ الطِّبِّ',
        hint: 'Mudaf pa "AL" me damme; mudaf ilejhi në kesra.',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex8-3',
        type: 'transform',
        prompt: 'Ndërto: "e dua punën time" (أُحِبُّ + kallëzore)',
        source: { arabic: 'عَمَل + ـِي', albanian: 'punë + im' },
        answer: 'أُحِبُّ عَمَلِي.',
        hint: 'أُحِبُّ merr mefûl — me përemër pronor nuk duhet tenvin.',
        grammarPoint: 'أُحِبُّ + kallëzore',
      },
      {
        id: 'ex8-4',
        type: 'transform',
        prompt: 'Zëvendëso الَّذِي me الَّتِي për emër femëror',
        source: { arabic: 'الطَّالِبُ الَّذِي يَدْرُسُ', albanian: 'studenti që studion' },
        answer: 'الطَّالِبَةُ الَّتِي تَدْرُسُ',
        hint: 'الَّذِي (m.) → الَّتِي (f.); dhe folja merr prefiks ت.',
        grammarPoint: 'Përemri lidhor',
      },
      {
        id: 'ex8-5',
        type: 'transform',
        prompt: 'Shpreh: "ora e njëmbëdhjetë" (F)',
        source: { arabic: 'السَّاعَة + إِحْدَى عَشْرَة', albanian: 'ora + 11' },
        answer: 'السَّاعَةُ الحَادِيَةَ عَشْرَةَ',
        hint: 'Të dy pjesët mbi fetha (mebnijj) — الحَادِيَةَ عَشْرَةَ.',
        grammarPoint: 'Numër rendor',
      },
      {
        id: 'ex8-6',
        type: 'transform',
        prompt: 'Ndërto me përemrin lidhor shumësi: "fëmijët që i mësoj"',
        source: { arabic: 'الأَطْفَال + أُدَرِّسُهُمْ', albanian: 'fëmijët + i mësoj' },
        answer: 'الأَطْفَالُ الَّذِينَ أُدَرِّسُهُمْ',
        hint: 'Për shumës mashkullor të logjikshëm: الَّذِينَ.',
        grammarPoint: 'Përemri lidhor',
      },
    ],
    stories: [
      {
        id: 's8-1',
        titleAl: 'Profesionet e familjes së Musait',
        albanian:
          'Familja e Musait është plot me profesione të dobishme. Babai është mjek në spital dhe punon orë të gjata. Nëna ka përfunduar Fakultetin e Edukimit dhe mëson fëmijët në shkollën fillore. Motra studion farmacinë dhe dëshiron të hapë një farmaci të vetën. Vëllai i vogël ëndërron të bëhet pilot dhe të fluturojë në qiell. Musa mendon të bëhet inxhinier pas shkollës së mesme, por së pari do të përfundojë studimet me nderime. Çdo profesion është begati nga Allahu, nëse bëhet me nijet të mirë dhe me sinqeritet.',
        arabic:
          'أُسْرَةُ مُوسَى مَلِيئَةٌ بِالمِهَنِ النَّافِعَةِ. الوَالِدُ طَبِيبٌ فِي المُسْتَشْفَى وَيَعْمَلُ سَاعَاتٍ طَوِيلَةً. الوَالِدَةُ تَخَرَّجَتْ مِنْ كُلِّيَّةِ التَّرْبِيَةِ وَتُدَرِّسُ الأَطْفَالَ فِي المَرْحَلَةِ الابْتِدَائِيَّةِ. الأُخْتُ تَدْرُسُ الصَّيْدَلَةَ وَتُرِيدُ أَنْ تَفْتَحَ صَيْدَلِيَّةً خَاصَّةً. الأَخُ الصَّغِيرُ يَحْلُمُ أَنْ يَكُونَ طَيَّاراً وَأَنْ يَطِيرَ فِي السَّمَاءِ. يُفَكِّرُ مُوسَى أَنْ يَكُونَ مُهَنْدِساً بَعْدَ المَرْحَلَةِ الثَّانَوِيَّةِ، وَلَكِنَّهُ سَيُكْمِلُ الدِّرَاسَةَ بِتَفَوُّقٍ أَوَّلاً. كُلُّ مِهْنَةٍ نِعْمَةٌ مِنَ اللَّهِ إِذَا كَانَتْ بِنِيَّةٍ صَالِحَةٍ وَإِخْلَاصٍ.',
        transliteration:
          "Usretu Musa meli’e bil mihenin-nafi‘a. El-walid tabibun fil mustashfa ve ja‘melu sa‘atin tavile. El-walide tekharrexhet min kul-lijjetit-terbije ve tuderrisul etfal fil merhaletil ibtida’ijje. El-ukht tedrusus-sajdele ve turidu en teftaha sajdelijjeten khasse. El-akhus-sagir jehlumu en jekune tajjaren ve en jetire fis-sema’. Jufekkiru Musa en jekune muhendisen ba‘del merhaletith-thanevijje, ve lakinnehu sejukmilud-dirase bi tefevvukin evvelen. Kul-lu mihnetin ni‘metun minAllahi idha kanet bi nijjetin saliha ve ikhlas.",
      },
    ],
    ayat: [
      {
        // Et-Teube 9:105 — urdhri kuranor për punë: "Veproni" —
        // اعْمَلُوا (urdhër shumës) + عَمَلَكُمْ (puna juaj). Një ajet dhe dy
        // shfaqje të rrënjës ع-م-ل që përbën kapitullin e punës. Nxit
        // nxënësin të shikojë punën si akt para Allahut.
        reference: '9:105',
        surahNameAr: 'التَّوْبَة',
        surahNameAl: 'Et-Teube',
        arabic:
          'وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ وَرَسُولُهُ وَالْمُؤْمِنُونَ وَسَتُرَدُّونَ إِلَىٰ عَالِمِ الْغَيْبِ وَالشَّهَادَةِ فَيُنَبِّئُكُم بِمَا كُنتُمْ تَعْمَلُونَ',
        albanian:
          'Thuaj: punoni! Allahu, i Dërguari i Tij dhe besimtarët do ta shohin punën tuaj, e do të ktheheni te Njohësi i së fshehtës dhe i së dukshmes, që do t\'ju njoftojë për çfarë keni punuar.',
        knownWords: [
          { surface: 'اعْمَلُوا', gloss: 'punoni (urdhër shumës, nga عَمَل)' },
          { surface: 'عَمَلَكُمْ', gloss: 'punën tuaj (nga عَمَل)' },
        ],
      },
      {
        // El-Kehf 18:110 — përfundimi i sures së Kehfit: "kush shpreson
        // takimin me Zotin e vet, le të bëjë vepër të mirë". Lidh
        // عَمَل me shpirtërorin — puna nuk është thjesht profesion, por
        // ofertë e vërtetë para Allahut.
        reference: '18:110',
        surahNameAr: 'الكَهْف',
        surahNameAl: 'El-Kehf',
        arabic:
          'قُلْ إِنَّمَا أَنَا بَشَرٌ مِّثْلُكُمْ يُوحَىٰ إِلَيَّ أَنَّمَا إِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ فَمَن كَانَ يَرْجُو لِقَاءَ رَبِّهِ فَلْيَعْمَلْ عَمَلًا صَالِحًا وَلَا يُشْرِكْ بِعِبَادَةِ رَبِّهِ أَحَدًا',
        albanian:
          'Thuaj: unë jam vetëm njeri si ju, me shpalljen se Zoti juaj është një Zot i vetëm; pra kush shpreson takimin me Zotin e vet, le të bëjë vepër të mirë dhe të mos i shoqërojë askënd në adhurimin ndaj Zotit të tij.',
        knownWords: [
          { surface: 'فَلْيَعْمَلْ', gloss: 'le të bëjë (nga عَمَل)' },
          { surface: 'عَمَلًا', gloss: 'punë / vepër (nga عَمَل)' },
          { surface: 'أَحَدًا', gloss: 'askënd (nga أَحَد)' },
        ],
      },
      {
        // El-Mulk 67:19 — ajeti i zogjve që fluturojnë. الطَّيْر është
        // nga rrënja ط-ي-ر (pilot = طَيَّار, fluturoi = طَارَ). Nxënësi
        // sheh se emri i zogut dhe profesioni i pilotit ndajnë të
        // njëjtën rrënjë.
        reference: '67:19',
        surahNameAr: 'المُلْك',
        surahNameAl: 'El-Mulk',
        arabic:
          'أَوَلَمْ يَرَوْا إِلَى الطَّيْرِ فَوْقَهُمْ صَافَّاتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا الرَّحْمَٰنُ ۚ إِنَّهُ بِكُلِّ شَيْءٍ بَصِيرٌ',
        albanian:
          'A nuk i shohin zogjtë mbi ta, të hapin dhe të mbledhin krahët? Askush nuk i mban atë veç Mëshirëplotit; Ai është Shikues i çdo gjëje.',
        knownWords: [
          {
            surface: 'الطَّيْرِ',
            gloss: 'zogjtë (rrënja ط-ي-ر, si طَارَ dhe طَيَّار)',
          },
        ],
      },
      {
        // El-Haxh 22:5 — fazat e krijimit të njeriut. "Pastaj ju
        // nxjerrim si fëmijë (طِفْلًا), pastaj (ju rritim) që të
        // arrini pjekurinë tuaj". طِفْل (v8-12) është drejt fjalori i
        // kapitullit 8 — profesioni i mësuesit, i mjekut, i infermieres
        // fillon me kujdesin ndaj fëmijës.
        reference: '22:5',
        surahNameAr: 'الحَجّ',
        surahNameAl: 'El-Haxhxh',
        arabic:
          'ثُمَّ نُخْرِجُكُمْ طِفْلًا ثُمَّ لِتَبْلُغُوا أَشُدَّكُمْ',
        albanian:
          'Pastaj ju nxjerrim si fëmijë, pastaj që të arrini pjekurinë tuaj.',
        knownWords: [
          { surface: 'طِفْلًا', gloss: 'fëmijë (nga طِفْل)' },
        ],
      },
      {
        // El-Kasas 28:26 — vajza e Shuajbit (a.s.) këshillon babanë ta
        // punësojë Musain: "punësoje — i forti dhe besniku janë më të
        // mirët për t'u punësuar". اسْتَأْجِرْهُ dhe اسْتَأْجَرْتَ janë
        // nga rrënja أ-ج-ر (pagesa e punës) — një lidhje direkte me
        // konceptin e punësimit dhe profesionit të kapitullit 8.
        reference: '28:26',
        surahNameAr: 'القَصَص',
        surahNameAl: 'El-Kasas',
        arabic:
          'قَالَتْ إِحْدَاهُمَا يَا أَبَتِ اسْتَأْجِرْهُ ۖ إِنَّ خَيْرَ مَنِ اسْتَأْجَرْتَ الْقَوِيُّ الْأَمِينُ',
        albanian:
          'Njëra prej tyre tha: O baba, punësoje; vërtet më i miri që mund të punësosh është i forti dhe i besueshmi.',
        knownWords: [
          {
            surface: 'اسْتَأْجِرْهُ',
            gloss: 'punësoje (nga rrënja أ-ج-ر, pagë / punësim)',
          },
          { surface: 'يَا أَبَتِ', gloss: 'o babai im (nga أَب)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 9,
    titleAr: 'التَّسَوُّق',
    titleAl: 'Tregu dhe Blerjet',
    titleEn: 'Shopping',
    dialogues: [
      {
        id: 'd9-1',
        albanian: 'Çfarë do të blesh sot?',
        arabic: 'مَاذَا تُرِيدُ أَنْ تَشْتَرِيَ الْيَوْمَ؟',
        transliteration: 'Madha turidu en teshterijel jewm?',
      },
      {
        id: 'd9-2',
        albanian: 'Dua një këmishë të bardhë dhe një fustan për nënën.',
        arabic: 'أُرِيدُ قَمِيصاً أَبْيَضَ وَثَوْباً لِلأُمِّ.',
        transliteration: 'Uridu kamisan ebjeda ve thewben lil umm.',
      },
      {
        id: 'd9-3',
        albanian: 'Sa kushton kjo këmishë, të lutem?',
        arabic: 'بِكَمْ هَذَا الْقَمِيصُ، لَوْ سَمَحْتَ؟',
        transliteration: 'Bikem hadhal kamis, lew semaht?',
      },
      {
        id: 'd9-4',
        albanian: 'Njëzet rijal. Pagesa te arka, në të djathtë.',
        arabic: 'عِشْرُونَ رِيَالاً. الدَّفْعُ عِنْدَ الصُّنْدُوقِ، عَلَى الْيَمِينِ.',
        transliteration: "Ishrune rijalen. Ed-deful indes-sunduk, alel jemin.",
      },
      {
        id: 'd9-5',
        albanian: 'Më jep, të lutem, një kilogram qepë dhe gjysmë kile tranguj.',
        arabic: 'أَعْطِنِي لَوْ سَمَحْتَ كِيلُو بَصَلٍ وَنِصْفَ كِيلُو خِيَارٍ.',
        transliteration: 'Atini lew semaht kilu basal ve nisfe kilu khijar.',
      },
      {
        id: 'd9-6',
        albanian: 'A ka fjalor arabisht-shqip në këtë librari?',
        arabic: 'هَلْ يُوجَدُ مُعْجَمٌ عَرَبِيٌّ فِي هَذِهِ الْمَكْتَبَةِ؟',
        transliteration: 'Hel juxhedu mu‘xhemun arabijjun fi hadhihil mektebe?',
      },
    ],
    vocabulary: [
      { id: 'v9-1', arabic: 'سُوق', albanian: 'Treg', root: 'س-و-ق', type: 'noun', gender: 'M', plural: 'أَسْوَاق' },
      { id: 'v9-2', arabic: 'مَتْجَر', albanian: 'Dyqan', root: 'ت-ج-ر', type: 'noun', gender: 'M', plural: 'مَتَاجِر' },
      { id: 'v9-3', arabic: 'قَمِيص', albanian: 'Këmishë', root: 'ق-م-ص', type: 'noun', gender: 'M', plural: 'قُمْصَان' },
      { id: 'v9-4', arabic: 'ثَوْب', albanian: 'Fustan / Rrobë', root: 'ث-و-ب', type: 'noun', gender: 'M', plural: 'ثِيَاب' },
      { id: 'v9-5', arabic: 'بَصَل', albanian: 'Qepë', root: 'ب-ص-ل', type: 'noun', gender: 'M' },
      { id: 'v9-6', arabic: 'خِيَار', albanian: 'Tranguj', root: 'خ-ي-ر', type: 'noun', gender: 'M' },
      { id: 'v9-7', arabic: 'طَمَاطِم', albanian: 'Domate', root: 'ط-م-ط', type: 'noun', gender: 'F' },
      { id: 'v9-8', arabic: 'فُلْفُل', albanian: 'Spec / Piper', root: 'ف-ل-ف-ل', type: 'noun', gender: 'M' },
      { id: 'v9-9', arabic: 'دِينَار', albanian: 'Dinar', root: 'د-ن-ر', type: 'noun', gender: 'M', plural: 'دَنَانِير' },
      { id: 'v9-10', arabic: 'رِيَال', albanian: 'Rijal', root: 'ر-ي-ل', type: 'noun', gender: 'M', plural: 'رِيَالَات' },
      { id: 'v9-11', arabic: 'صُنْدُوق', albanian: 'Arkë (kasë)', root: 'ص-ن-د-ق', type: 'noun', gender: 'M', plural: 'صَنَادِيق' },
      { id: 'v9-12', arabic: 'يَمِين', albanian: 'E djathtë', root: 'ي-م-ن', type: 'noun', gender: 'M' },
      { id: 'v9-13', arabic: 'شَمَال', albanian: 'E majtë', root: 'ش-م-ل', type: 'noun', gender: 'M' },
      { id: 'v9-14', arabic: 'أَمَام', albanian: 'Përpara', root: 'أ-م-م', type: 'particle' },
      { id: 'v9-15', arabic: 'خَلْف', albanian: 'Mbrapa', root: 'خ-ل-ف', type: 'particle' },
      { id: 'v9-16', arabic: 'فَوْق', albanian: 'Mbi / Lart', root: 'ف-و-ق', type: 'particle' },
      { id: 'v9-17', arabic: 'تَحْت', albanian: 'Nën / Poshtë', root: 'ت-ح-ت', type: 'particle' },
      { id: 'v9-18', arabic: 'لَوْ سَمَحْتَ', albanian: 'Të lutem', root: 'س-م-ح', type: 'particle' },
      { id: 'v9-19', arabic: 'مَطْلُوب', albanian: 'I kërkuar', root: 'ط-ل-ب', type: 'adjective' },
      { id: 'v9-20', arabic: 'مُعْجَم', albanian: 'Fjalor', root: 'ع-ج-م', type: 'noun', gender: 'M', plural: 'مَعَاجِم' },
      { id: 'v9-21', arabic: 'اشْتَرَى', present: 'يَشْتَرِي', imperative: 'اِشْتَرِ', albanian: 'Bleu', root: 'ش-ر-ي', type: 'verb' },
      { id: 'v9-22', arabic: 'بَاعَ', present: 'يَبِيعُ', imperative: 'بِعْ', albanian: 'Shiti', root: 'ب-ي-ع', type: 'verb' },
      { id: 'v9-23', arabic: 'دَفَعَ', present: 'يَدْفَعُ', imperative: 'اِدْفَعْ', albanian: 'Pagoi', root: 'د-ف-ع', type: 'verb' },
      { id: 'v9-24', arabic: 'أَعْطَى', present: 'يُعْطِي', imperative: 'أَعْطِ', albanian: 'Dha', root: 'ع-ط-و', type: 'verb' },
      { id: 'v9-25', arabic: 'بِكَمْ', albanian: 'Për sa? (çmimi)', root: 'ك-م', type: 'particle' },
      { id: 'v9-26', arabic: 'عِشْرُونَ', albanian: 'Njëzet (20)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v9-27', arabic: 'ثَلَاثُونَ', albanian: 'Tridhjetë (30)', root: 'ث-ل-ث', type: 'particle' },
      { id: 'v9-28', arabic: 'خَمْسُونَ', albanian: 'Pesëdhjetë (50)', root: 'خ-م-س', type: 'particle' },
      { id: 'v9-29', arabic: 'مِئَة', albanian: 'Njëqind (100)', root: 'م-أ-ي', type: 'particle' },
      { id: 'v9-30', arabic: 'تَسَوَّقَ', albanian: 'Bleu/Bëri pazar', root: 'س-و-ق', type: 'verb', present: 'يَتَسَوَّقُ', imperative: 'تَسَوَّقْ' },
      { id: 'v9-31', arabic: 'دَفْتَر', albanian: 'Fletore', root: 'د-ف-ت-ر', type: 'noun', gender: 'M', plural: 'دَفَاتِر' },
      { id: 'v9-32', arabic: 'قَلَم', albanian: 'Laps/Stilolaps', root: 'ق-ل-م', type: 'noun', gender: 'M', plural: 'أَقْلَام' },
    ],
    grammarFocus: [
      'Pyetja e çmimit بِكَمْ؟ (Bikem?) + emër në tenwin kasra',
      'Numrat e dhjetëshave 20/30/.../90 — بُوق me mbaresë ـُونَ / ـِينَ',
      'Drejtimet e vendit يَمِين/شَمَال/أَمَام/خَلْف/فَوْق/تَحْت — si ظرف مكان',
      'أَعْطِنِي (Atini) — urdhërore + përemër bashkangjitur ـنِي',
    ],
    exercises: [
      {
        id: 'ex9-1',
        type: 'transform',
        prompt: 'Ndërto pyetje të çmimit me بِكَمْ؟',
        source: { arabic: 'هَذَا القَمِيص', albanian: 'kjo këmishë' },
        answer: 'بِكَمْ هَذَا القَمِيصُ؟',
        hint: 'بِكَمْ vjen në fillim; emri mbetet i shquar.',
        grammarPoint: 'بِكَمْ؟',
      },
      {
        id: 'ex9-2',
        type: 'transform',
        prompt: 'Shto çmimin në tenvin kesra: "me njëzet rijal"',
        source: { arabic: 'عِشْرُونَ + رِيَال', albanian: 'njëzet + rijal' },
        answer: 'بِعِشْرِينَ رِيَالاً',
        hint: 'Pas بِـ numri 20 merr ـِينَ; emri i numëruar merr tenvin fetha.',
        grammarPoint: 'Numrat e dhjetëshave',
      },
      {
        id: 'ex9-3',
        type: 'transform',
        prompt: 'Ndërto urdhërore me ـنِي: "më jep"',
        source: { arabic: 'أَعْطَى', albanian: 'dha' },
        answer: 'أَعْطِنِي',
        hint: 'Urdhërorja e أَعْطَى është أَعْطِ; + ـنِي për "mua".',
        grammarPoint: 'Urdhërore + ـنِي',
      },
      {
        id: 'ex9-4',
        type: 'transform',
        prompt: 'Ndërto: "përpara derës"',
        source: { arabic: 'أَمَام + البَاب', albanian: 'përpara + dera' },
        answer: 'أَمَامَ البَابِ',
        hint: 'أَمَامَ është ظرف mekan; emri pas tij merr kesrën.',
        grammarPoint: 'Drejtime',
      },
      {
        id: 'ex9-5',
        type: 'transform',
        prompt: 'Shkruaj numrin 30 në formë kallëzore',
        source: { arabic: 'ثَلَاثُونَ', albanian: 'tridhjetë (emërore)' },
        answer: 'ثَلَاثِينَ',
        hint: 'Dhjetëshet: nominativ ـُونَ → akuzativ/gjenitiv ـِينَ.',
        grammarPoint: 'Numrat e dhjetëshave',
      },
      {
        id: 'ex9-6',
        type: 'transform',
        prompt: 'Ndërto: "Arka është në të djathtë"',
        source: { arabic: 'الصُّنْدُوق + اليَمِين', albanian: 'arka + e djathta' },
        answer: 'الصُّنْدُوقُ عَلَى اليَمِينِ.',
        hint: 'عَلَى + emër i shquar → kesra në fund.',
        grammarPoint: 'Drejtime',
      },
    ],
    stories: [
      {
        id: 's9-1',
        titleAl: 'Musa në treg',
        albanian:
          'Të shtunën Musa shkoi në tregun qendror me babain. Në dyqanin e rrobave bleu një këmishë të bardhë për njëzet rijal dhe një fustan për nënën. Arka ishte në të djathtë, përpara derës. Pastaj shkuan te tregtari i perimeve dhe morën një kilogram qepë, gjysmë kile tranguj dhe pak domate. Në fund Musa hyri në një librari dhe kërkoi një fjalor arabisht-shqip. Shitësi e mori nga rafti lart, mbi tavolinë, dhe i tha: "Pesëdhjetë rijal, të lutem."',
        arabic:
          'يَوْمَ السَّبْتِ ذَهَبَ مُوسَى إِلَى السُّوقِ الْمَرْكَزِيِّ مَعَ أَبِيهِ. فِي مَتْجَرِ الْمَلَابِسِ اشْتَرَى قَمِيصاً أَبْيَضَ بِعِشْرِينَ رِيَالاً وَثَوْباً لِأُمِّهِ. كَانَ الصُّنْدُوقُ عَلَى الْيَمِينِ، أَمَامَ الْبَابِ. ثُمَّ ذَهَبَا إِلَى بَائِعِ الْخُضْرَوَاتِ وَأَخَذَا كِيلُو بَصَلٍ وَنِصْفَ كِيلُو خِيَارٍ وَقَلِيلاً مِنَ الطَّمَاطِمِ. فِي النِّهَايَةِ دَخَلَ مُوسَى مَكْتَبَةً وَطَلَبَ مُعْجَماً عَرَبِيّاً أَلْبَانِيّاً. أَخَذَهُ الْبَائِعُ مِنَ الرَّفِّ فَوْقَ الطَّاوِلَةِ وَقَالَ: «خَمْسُونَ رِيَالاً، لَوْ سَمَحْتَ.»',
        transliteration:
          "Jewmes-sebt dhehebe Musa iles-sukil merkezij-ji me‘a ebih. Fi metxheril melabis ishtera kamisan ebjeda bi‘ishrine rijalen ve thewben li ummih. Kanes-sunduku alel jemin, emamel bab. Thumme dhehebe ile bai‘il khudreveat ve ekhadhe kilu basal ve nisfe kilu khijar ve kalilen minet-tamatim. Fin-nihaje dekhale Musa mektebeten ve talebe mu‘xhemen arabijjen albanijjen. Ekhadhehul bai‘u miner-reffi fewka et-tavile ve kale: «Khamsune rijalen, lew semaht.»",
      },
    ],
    ayat: [
      {
        // Et-Teube 9:111 — metafora më e fuqishme tregtare në Kuran:
        // "Allahu ka blerë nga besimtarët jetën e tyre" për Xhenetin.
        // اشْتَرَى është folja kryesore e Kapitullit 9, këtu e përdorur
        // nga Vetë Allahu — transformon blerjen nga akt material në
        // kontratë hyjnore.
        reference: '9:111',
        surahNameAr: 'التَّوْبَة',
        surahNameAl: 'Et-Teube',
        arabic:
          'إِنَّ اللَّهَ اشْتَرَىٰ مِنَ الْمُؤْمِنِينَ أَنفُسَهُمْ وَأَمْوَالَهُم بِأَنَّ لَهُمُ الْجَنَّةَ',
        albanian:
          'Vërtet Allahu ka blerë prej besimtarëve jetën e tyre dhe pasurinë e tyre me atë që ata do të kenë Xhenetin.',
        knownWords: [
          {
            surface: 'اشْتَرَىٰ',
            gloss: 'bleu (nga اشْتَرَى)',
          },
        ],
      },
      {
        // Sebe 34:15 — dy drejtime bashkë: يَمِين dhe شِمَال, fjalë të
        // Kapitullit 9. Ajeti tregon si Allahu ka bërë kopshte "nga e
        // djathta dhe nga e majta" si mrekulli — drejtimet që nxënësi
        // i mësoi në treg, këtu janë shenjë e krijimit.
        reference: '34:15',
        surahNameAr: 'سَبَأ',
        surahNameAl: 'Sebe',
        arabic:
          'لَقَدْ كَانَ لِسَبَإٍ فِي مَسْكَنِهِمْ آيَةٌ جَنَّتَانِ عَن يَمِينٍ وَشِمَالٍ كُلُوا مِن رِّزْقِ رَبِّكُمْ وَاشْكُرُوا لَهُ بَلْدَةٌ طَيِّبَةٌ وَرَبٌّ غَفُورٌ',
        albanian:
          'Populli i Sebës e kishte në vendbanimin e tij një shenjë: dy kopshte, nga e djathta dhe nga e majta. Hani nga furnizimi i Zotit tuaj dhe falënderoni Atë — vend i bekuar dhe Zot Falës.',
        knownWords: [
          { surface: 'يَمِينٍ', gloss: 'së djathtës (nga يَمِين)' },
          { surface: 'وَشِمَالٍ', gloss: 'dhe së majtës (nga شَمَال/شِمَال)' },
          { surface: 'كُلُوا', gloss: 'hani (nga أَكَلَ)' },
          { surface: 'رَبِّكُمْ', gloss: 'Zotit tuaj (nga رَبّ)' },
        ],
      },
      {
        // El-Bekare 2:254 — "një Ditë kur nuk do të ketë shitblerje".
        // بَيْع (shitje) është fjalë nga e njëjta rrënjë si بَاعَ (shiti)
        // e Kapitullit 9 — folja → emri. Ajeti paralajmëron se tregu i
        // kësaj bote nuk do të vlejë në Ditën e Gjykimit.
        reference: '2:254',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'يَا أَيُّهَا الَّذِينَ آمَنُوا أَنفِقُوا مِمَّا رَزَقْنَاكُم مِّن قَبْلِ أَن يَأْتِيَ يَوْمٌ لَّا بَيْعٌ فِيهِ وَلَا خُلَّةٌ وَلَا شَفَاعَةٌ وَالْكَافِرُونَ هُمُ الظَّالِمُونَ',
        albanian:
          'O ju që besuat! Jepni prej asaj që ju dhamë, para se të vijë një ditë në të cilën nuk do të ketë as shitblerje, as miqësi, as ndërmjetësim — dhe jobesimtarët, pikërisht ata janë të padrejtët.',
        knownWords: [
          { surface: 'بَيْعٌ', gloss: 'shitblerje (nga rrënja ب-ي-ع, si بَاعَ)' },
          { surface: 'يَوْمٌ', gloss: 'ditë (nga يَوْم)' },
        ],
      },
      {
        // Jusuf 12:20 — vëllezërit e shitën Jusufin (a.s.) "për një çmim
        // të ulët, pak dërhemë". Dy fjalë blerjeje në një ajet: ثَمَن
        // (çmim, v9) dhe دَرَاهِم (dërhemë, shumësi i دِرْهَم v9). Tregu
        // biblik dhe tregu modern flasin të njëjtën gjuhë fjalori.
        reference: '12:20',
        surahNameAr: 'يُوسُف',
        surahNameAl: 'Jusuf',
        arabic:
          'وَشَرَوْهُ بِثَمَنٍ بَخْسٍ دَرَاهِمَ مَعْدُودَةٍ وَكَانُوا فِيهِ مِنَ الزَّاهِدِينَ',
        albanian:
          'Dhe e shitën atë (Jusufin) për një çmim të ulët, pak dërhemë të numëruar; dhe ata nuk ishin të interesuar për të.',
        knownWords: [
          { surface: 'بِثَمَنٍ', gloss: 'me një çmim (nga ثَمَن)' },
          {
            surface: 'دَرَاهِمَ',
            gloss: 'dërhemë (shumësi i دِرْهَم)',
          },
        ],
      },
      {
        // Fatir 35:29 — "tregtia që nuk falimenton kurrë" — leximi,
        // namazi, lëmosha. تِجَارَة (tregti) është fjalë e sinonimizuar
        // me botën e blerjeve të kapitullit 9, por këtu Allahu e
        // zhvendos kuptimin: "tregtia" më fitimprurëse s'është në suk,
        // por me Krijuesin.
        reference: '35:29',
        surahNameAr: 'فَاطِر',
        surahNameAl: 'Fatir',
        arabic:
          'إِنَّ الَّذِينَ يَتْلُونَ كِتَابَ اللَّهِ وَأَقَامُوا الصَّلَاةَ وَأَنفَقُوا مِمَّا رَزَقْنَاهُمْ سِرًّا وَعَلَانِيَةً يَرْجُونَ تِجَارَةً لَّن تَبُورَ',
        albanian:
          'Vërtet ata që lexojnë Librin e Allahut, e falin namazin dhe japin prej asaj që i kemi dhënë, fshehtas e haptas, shpresojnë në një tregti që nuk falimenton kurrë.',
        knownWords: [
          { surface: 'تِجَارَةً', gloss: 'tregti (nga تِجَارَة)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 10,
    titleAr: 'الفصول والطقس',
    titleAl: 'Stinët dhe Moti',
    titleEn: 'Seasons & Weather',
    dialogues: [
      {
        id: 'd10-1',
        albanian: 'Si është moti sot?',
        arabic: 'كَيْفَ الطَّقْسُ الْيَوْمَ؟',
        transliteration: "Kejfe et-takses el-jewm?",
      },
      {
        id: 'd10-2',
        albanian: 'Bën ftohtë dhe bie shi.',
        arabic: 'الْجَوُّ بَارِد وَتُمْطِر.',
        transliteration: 'El-xhevvu barid we tumtir.',
      },
      {
        id: 'd10-3',
        albanian: 'Në verë bën shumë nxehtë.',
        arabic: 'فِي الصَّيْفِ الْجَوُّ حَارّ جِدّاً.',
        transliteration: 'Fis-sajf el-xhevvu harr xhidden.',
      },
      {
        id: 'd10-4',
        albanian: 'Më pëlqen pranvera sepse është e këndshme.',
        arabic: 'أُحِبُّ الرَّبِيعَ لِأَنَّهُ جَمِيل.',
        transliteration: 'Uhibbu er-rebia lienne-hu xhemil.',
      },
      {
        id: 'd10-5',
        albanian: 'Sa është temperatura sot?',
        arabic: 'كَمْ دَرَجَةُ الْحَرَارَةِ الْيَوْمَ؟',
        transliteration: "Kem derexhetul hararetil jewm?",
      },
      {
        id: 'd10-6',
        albanian: 'Moti është i butë; merr ombrellë.',
        arabic: 'الْجَوُّ مُعْتَدِلٌ؛ خُذْ مِظَلَّةً.',
        transliteration: 'El-xhevvu mu‘tedil; khudh mizal-leten.',
      },
    ],
    vocabulary: [
      { id: 'v10-1', arabic: 'فَصْل', albanian: 'Stinë', root: 'ف-ص-ل', type: 'noun', gender: 'M', plural: 'فُصُول' },
      { id: 'v10-2', arabic: 'رَبِيع', albanian: 'Pranverë', root: 'ر-ب-ع', type: 'noun', gender: 'M' },
      { id: 'v10-3', arabic: 'صَيْف', albanian: 'Verë', root: 'ص-ي-ف', type: 'noun', gender: 'M' },
      { id: 'v10-4', arabic: 'خَرِيف', albanian: 'Vjeshtë', root: 'خ-ر-ف', type: 'noun', gender: 'M' },
      { id: 'v10-5', arabic: 'شِتَاء', albanian: 'Dimër', root: 'ش-ت-و', type: 'noun', gender: 'M' },
      { id: 'v10-6', arabic: 'طَقْس', albanian: 'Mot', root: 'ط-ق-س', type: 'noun', gender: 'M' },
      { id: 'v10-7', arabic: 'جَوّ', albanian: 'Ajër/Atmosferë', root: 'ج-و-و', type: 'noun', gender: 'M' },
      { id: 'v10-8', arabic: 'حَارّ', albanian: 'I nxehtë', root: 'ح-ر-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-9', arabic: 'بَارِد', albanian: 'I ftohtë', root: 'ب-ر-د', type: 'adjective', gender: 'M' },
      { id: 'v10-10', arabic: 'مَطَر', albanian: 'Shi', root: 'م-ط-ر', type: 'noun', gender: 'M', plural: 'أَمْطَار' },
      { id: 'v10-11', arabic: 'ثَلْج', albanian: 'Borë', root: 'ث-ل-ج', type: 'noun', gender: 'M' },
      { id: 'v10-12', arabic: 'شَمْس', albanian: 'Diell', root: 'ش-م-س', type: 'noun', gender: 'F' },
      { id: 'v10-13', arabic: 'مُعْتَدِل', albanian: 'I butë (mot)', root: 'ع-د-ل', type: 'adjective', gender: 'M' },
      { id: 'v10-14', arabic: 'دَرَجَةُ الْحَرَارَة', albanian: 'Temperatura', root: 'ح-ر-ر', type: 'noun', gender: 'F' },
      { id: 'v10-15', arabic: 'مِظَلَّة', albanian: 'Ombrellë', root: 'ظ-ل-ل', type: 'noun', gender: 'F' },
      { id: 'v10-16', arabic: 'أَمْطَرَ', present: 'يُمْطِرُ', imperative: '—', albanian: 'Ra shi / Bie shi', root: 'م-ط-ر', type: 'verb' },
      { id: 'v10-17', arabic: 'لَبِسَ', present: 'يَلْبَسُ', imperative: 'اِلْبَسْ', albanian: 'Veshi (rroba)', root: 'ل-ب-س', type: 'verb' },
      { id: 'v10-18', arabic: 'أَبْيَض', albanian: 'I bardhë', root: 'ب-ي-ض', type: 'adjective', gender: 'M' },
      { id: 'v10-19', arabic: 'أَسْوَد', albanian: 'I zi', root: 'س-و-د', type: 'adjective', gender: 'M' },
      { id: 'v10-20', arabic: 'أَحْمَر', albanian: 'I kuq', root: 'ح-م-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-21', arabic: 'أَصْفَر', albanian: 'I verdhë', root: 'ص-ف-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-22', arabic: 'أَخْضَر', albanian: 'I gjelbër', root: 'خ-ض-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-23', arabic: 'أَزْرَق', albanian: 'I kaltër', root: 'ز-ر-ق', type: 'adjective', gender: 'M' },
      { id: 'v10-24', arabic: 'تَرَكَ', albanian: 'La', root: 'ت-ر-ك', type: 'verb', present: 'يَتْرُكُ', imperative: 'اُتْرُكْ' },
      { id: 'v10-25', arabic: 'بَارَكَ', albanian: 'Bekoi', root: 'ب-ر-ك', type: 'verb', present: 'يُبَارِكُ', imperative: 'بَارِكْ' },
      { id: 'v10-26', arabic: 'بَقِيَ', albanian: 'Mbeti', root: 'ب-ق-ي', type: 'verb', present: 'يَبْقَى', imperative: 'اِبْقَ' },
      { id: 'v10-27', arabic: 'تَكَلَّمَ', albanian: 'Foli', root: 'ك-ل-م', type: 'verb', present: 'يَتَكَلَّمُ', imperative: 'تَكَلَّمْ' },
      { id: 'v10-28', arabic: 'قَضَى', albanian: 'Kaloi (kohë)', root: 'ق-ض-ي', type: 'verb', present: 'يَقْضِي', imperative: 'اِقْضِ' },
      { id: 'v10-29', arabic: 'أَحْضَرَ', albanian: 'Solli', root: 'ح-ض-ر', type: 'verb', present: 'يُحْضِرُ', imperative: 'أَحْضِرْ' },
      { id: 'v10-30', arabic: 'حَضَرَ', albanian: 'Erdhi', root: 'ح-ض-ر', type: 'verb', present: 'يَحْضُرُ', imperative: 'اُحْضُرْ' },
      { id: 'v10-31', arabic: 'لَيْلَة', albanian: 'Natë (një)', root: 'ل-ي-ل', type: 'noun', gender: 'F', plural: 'لَيَالٍ' },
      { id: 'v10-32', arabic: 'دَرَجَة', albanian: 'Shkallë/Gradë', root: 'د-ر-ج', type: 'noun', gender: 'F', plural: 'دَرَجَات' },
      { id: 'v10-33', arabic: 'زَوْج', albanian: 'Bashkëshort', root: 'ز-و-ج', type: 'noun', gender: 'M', plural: 'أَزْوَاج' },
      { id: 'v10-34', arabic: 'سُوق', albanian: 'Treg', root: 'س-و-ق', type: 'noun', gender: 'M', plural: 'أَسْوَاق' },
      { id: 'v10-35', arabic: 'خَيْمَة', albanian: 'Tendë', root: 'خ-ي-م', type: 'noun', gender: 'F', plural: 'خِيَام' },
      { id: 'v10-36', arabic: 'زَوْجَة', albanian: 'Bashkëshorte', root: 'ز-و-ج', type: 'noun', gender: 'F', plural: 'زَوْجَات' },
    ],
    grammarFocus: [
      'Folja mudari‘ me prefix ت (تَـ): تُمْطِر — bie shi (ajo)',
      'لِأَنَّ (Li-enne) + përemër i lidhur — lidhëza shkakore',
      'Ngjyrat أَفْعَل/فَعْلَاء — mashkullore أَحْمَر, femërore حَمْرَاء',
      'كَمْ + emër i pashquar në tenwin fetha: كَمْ دَرَجَةً؟',
    ],
    exercises: [
      {
        id: 'ex10-1',
        type: 'transform',
        prompt: 'Kthe foljen "bie shi" në formë ajo (f.) e mudarit',
        source: { arabic: 'أَمْطَرَ', albanian: 'ra shi' },
        answer: 'تُمْطِرُ',
        hint: 'Mudariu i أَمْطَرَ: يُمْطِرُ (ai); me ت: تُمْطِرُ (ajo).',
        grammarPoint: 'Mudari me ت',
      },
      {
        id: 'ex10-2',
        type: 'transform',
        prompt: 'Ndërto: "sepse është i bukur"',
        source: { arabic: 'الرَّبِيع + جَمِيل', albanian: 'pranvera + e bukur' },
        answer: 'لِأَنَّهُ جَمِيلٌ',
        hint: 'لِأَنَّ + përemër ـهُ (i tij) për emër mashkullor.',
        grammarPoint: 'لِأَنَّ',
      },
      {
        id: 'ex10-3',
        type: 'transform',
        prompt: 'Kthe ngjyrën në femërore (model فَعْلَاء)',
        source: { arabic: 'أَحْمَر', albanian: 'i kuq' },
        answer: 'حَمْرَاء',
        hint: 'Ngjyrat أَفْعَل → femërorja فَعْلَاء (pa "AL" dhe pa hemze në fillim).',
        grammarPoint: 'Ngjyrat أَفْعَل/فَعْلَاء',
      },
      {
        id: 'ex10-4',
        type: 'transform',
        prompt: 'Ndërto pyetje me كَمْ: "sa gradë?"',
        source: { arabic: 'دَرَجَة', albanian: 'gradë' },
        answer: 'كَمْ دَرَجَةً؟',
        hint: 'كَمْ kërkon tenvin fetha tek emri i pashquar (ة → ـَةً).',
        grammarPoint: 'كَمْ + tenvin',
      },
      {
        id: 'ex10-5',
        type: 'transform',
        prompt: 'Kthe ngjyrën "i gjelbër" në femërore',
        source: { arabic: 'أَخْضَر', albanian: 'i gjelbër' },
        answer: 'خَضْرَاء',
        hint: 'أَفْعَل → فَعْلَاء: أَخْضَر → خَضْرَاء.',
        grammarPoint: 'Ngjyrat أَفْعَل/فَعْلَاء',
      },
      {
        id: 'ex10-6',
        type: 'transform',
        prompt: 'Ndërto: "sepse ata janë aktivë" (për shumës m.)',
        source: { arabic: 'نَشِيطُونَ', albanian: 'aktivë' },
        answer: 'لِأَنَّهُمْ نَشِيطُونَ',
        hint: 'لِأَنَّ + ـهُمْ për shumës mashkullor.',
        grammarPoint: 'لِأَنَّ',
      },
    ],
    stories: [
      {
        id: 's10-1',
        titleAl: 'Katër stinët në Kosovë',
        albanian:
          'Në Kosovë katër stinët janë të qarta dhe të bukura. Në pranverë bie shi dhe lulet lulëzojnë në kopshte. Në verë bën shumë nxehtë dhe ne shkojmë në det ose në male. Në vjeshtë gjethet bien nga pemët dhe fryn erë e ftohtë. Dimri është i ftohtë dhe bie borë e shumtë, atëherë luajmë me borë dhe bëjmë njeri bore.',
        arabic:
          'فِي كُوسُوفُو الْفُصُولُ الأَرْبَعَة وَاضِحَة وَجَمِيلَة. فِي الرَّبِيعِ تُمْطِر وَتَتَفَتَّحُ الْوُرُود فِي الْحَدَائِقِ. فِي الصَّيْفِ الْجَوُّ حَارّ جِدّاً وَنَذْهَبُ إِلَى الْبَحْرِ أَوْ إِلَى الْجِبَالِ. فِي الْخَرِيفِ تَسْقُطُ الأَوْرَاقُ مِنَ الأَشْجَارِ وَتَهُبُّ رِيحٌ بَارِدَة. الشِّتَاءُ بَارِدٌ وَيَنْزِلُ ثَلْجٌ كَثِير، فَنَلْعَبُ بِالثَّلْجِ وَنَصْنَعُ رَجُلَ الثَّلْجِ.',
        transliteration:
          "Fi Kosofo el-fusul el-erba'a vadiha ve xhemile. Fir-rebia tumtir ve tetefettehul vurud fil hada'ik. Fis-sajf el-xhevvu harr xhidden ve nedhhebu ilel bahr ev ilel xhibal. Fil kharif teskutul evraku minel eshxhar ve tehubbu rihun baride. Esh-shita baridun ve jenzilu thelxhun kethir, fe nel'abu bith-thelxh ve nesne'u rexhule eth-thelxh.",
      },
    ],
    ayat: [
      {
        // Kurejsh 106:2 — dy stinë në një ajet! الشِّتَاء dhe الصَّيْف —
        // të dyja fjalë të Kapitullit 10, të përmendura ekzaktësisht
        // në formën që e ka mësuar nxënësi. Tregtia e Kurejshëve mes
        // dy stinëve bëhet mësimi më i thjeshtë kuranor i fjalorit.
        reference: '106:2',
        surahNameAr: 'قُرَيْش',
        surahNameAl: 'Kurejsh',
        arabic: 'إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ',
        albanian:
          'Për sigurimin që ata (Kurejshët) kishin në udhëtimin e tyre të dimrit dhe të verës.',
        knownWords: [
          { surface: 'الشِّتَاءِ', gloss: 'dimrit (nga شِتَاء)' },
          { surface: 'وَالصَّيْفِ', gloss: 'dhe verës (nga صَيْف)' },
        ],
      },
      {
        // Esh-Shems 91:1 — betim me diellin: "Pasha diellin dhe dritën
        // e tij". الشَّمْس e Kapitullit 10 del në hapjen e kësaj sureje
        // të shkurtër, që është plotësisht dedikuar fenomeneve të
        // motit (dielli, hëna, dita, nata, qielli, toka).
        reference: '91:1',
        surahNameAr: 'الشَّمْس',
        surahNameAl: 'Esh-Shems',
        arabic: 'وَالشَّمْسِ وَضُحَاهَا',
        albanian: 'Pasha diellin dhe dritën e tij!',
        knownWords: [
          { surface: 'وَالشَّمْسِ', gloss: 'pasha diellin (nga شَمْس)' },
        ],
      },
      {
        // Fatir 35:27 — tre ngjyrat e mësuara njëherësh: بِيض (të bardha),
        // حُمْر (të kuqe), سُود (të zeza). Shumësat e أَبْيَض, أَحْمَر,
        // أَسْوَد. Allahu thotë se në male ka vija të ndryshme
        // ngjyrash — krijim i pasur, dhe përforcim i plotë i fjalorit
        // të ngjyrave.
        reference: '35:27',
        surahNameAr: 'فَاطِر',
        surahNameAl: 'Fatir',
        arabic:
          'أَلَمْ تَرَ أَنَّ اللَّهَ أَنزَلَ مِنَ السَّمَاءِ مَاءً فَأَخْرَجْنَا بِهِ ثَمَرَاتٍ مُّخْتَلِفًا أَلْوَانُهَا وَمِنَ الْجِبَالِ جُدَدٌ بِيضٌ وَحُمْرٌ مُّخْتَلِفٌ أَلْوَانُهَا وَغَرَابِيبُ سُودٌ',
        albanian:
          'A nuk e ke parë se Allahu zbret ujë nga qielli, me të cilin Ne nxjerrim fruta me ngjyra të ndryshme, dhe në male ka shtigje të bardha, të kuqe me ngjyra të ndryshme, dhe të tjera krejtësisht të zeza?',
        knownWords: [
          { surface: 'مَاءً', gloss: 'ujë (nga مَاء)' },
          { surface: 'بِيضٌ', gloss: 'të bardha (shumësi i أَبْيَض)' },
          { surface: 'وَحُمْرٌ', gloss: 'dhe të kuqe (shumësi i أَحْمَر)' },
          { surface: 'سُودٌ', gloss: 'të zeza (shumësi i أَسْوَد)' },
        ],
      },
      {
        // Junus 10:5 — ajeti i dy dritave qiellore: dielli si ndriçim i
        // ditës, hëna si dritë e natës. الْقَمَر (hëna) është fjalë e re
        // e fjalorit qiellor — plotëson çiftin dritë/hije të kapitullit
        // 10 (stinë + mot).
        reference: '10:5',
        surahNameAr: 'يُونُس',
        surahNameAl: 'Junus',
        arabic: 'هُوَ الَّذِي جَعَلَ الشَّمْسَ ضِيَاءً وَالْقَمَرَ نُورًا',
        albanian:
          'Ai është që e bëri diellin ndriçim dhe hënën dritë.',
        knownWords: [
          { surface: 'وَالْقَمَرَ', gloss: 'dhe hënën (nga قَمَر)' },
        ],
      },
      {
        // El-Xhathije 45:5 — "dhe në ndryshimin e erërave" janë shenja.
        // الرِّيَاح është shumësi i رِيح (erë, fjalori i motit të
        // kapitullit 10) — erërat që ndryshojnë stinët dhe sjellin
        // reshjet. Krijimi si libër që flet vetë.
        reference: '45:5',
        surahNameAr: 'الجَاثِيَة',
        surahNameAl: 'El-Xhathije',
        arabic:
          'وَتَصْرِيفِ الرِّيَاحِ آيَاتٌ لِّقَوْمٍ يَعْقِلُونَ',
        albanian:
          'Dhe në ndryshimin e erërave ka shenja për njerëz që kuptojnë.',
        knownWords: [
          {
            surface: 'الرِّيَاحِ',
            gloss: 'erërave (shumësi i رِيح)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 11,
    titleAr: 'السَّفَرُ وَالتَّنَقُّل',
    titleAl: 'Udhëtimi dhe Transporti',
    titleEn: 'Travel & Transportation',
    dialogues: [
      {
        id: 'd11-1',
        albanian: 'Ku po shkon, o Musa?',
        arabic: 'إِلَى أَيْنَ تَذْهَبُ يَا مُوسَى؟',
        transliteration: 'Ila ejne tedhhebu ja Musa?',
      },
      {
        id: 'd11-2',
        albanian: 'Po vizitoj gjyshin tim në një fshat të qetë.',
        arabic: 'أَزُورُ جَدِّي فِي قَرْيَةٍ هَادِئَةٍ.',
        transliteration: 'Ezuru xheddi fi karjetin hadie.',
      },
      {
        id: 'd11-3',
        albanian: 'A do të udhëtosh me tren apo me avion?',
        arabic: 'هَلْ سَتُسَافِرُ بِالْقِطَارِ أَمْ بِالطَّائِرَةِ؟',
        transliteration: 'Hel setusafiru bil kitar em bit-taire?',
      },
      {
        id: 'd11-4',
        albanian: 'Me tren. Udhëtimi zgjat tri orë.',
        arabic: 'بِالْقِطَارِ. تَسْتَغْرِقُ الرِّحْلَةُ ثَلَاثَ سَاعَاتٍ.',
        transliteration: "Bil kitar. Testegriku er-rihletu theltha sa'at.",
      },
      {
        id: 'd11-5',
        albanian: 'A ke pasaportën? Trafiku është i madh sot.',
        arabic: 'هَلْ مَعَكَ جَوَازُ السَّفَرِ؟ الاِزْدِحَامُ شَدِيدٌ الْيَوْمَ.',
        transliteration: 'Hel me‘ake xhevazus-sefer? El-izdihamu shedidun el-jewm.',
      },
      {
        id: 'd11-6',
        albanian: 'Ajri në qytet është i ndotur, por në fshat është i pastër.',
        arabic: 'الْهَوَاءُ فِي الْمَدِينَةِ مُلَوَّثٌ، وَلَكِنْ فِي الْقَرْيَةِ نَقِيٌّ.',
        transliteration: 'El-hevau fil medine mulevveth, ve lakin fil karje nakijj.',
      },
    ],
    vocabulary: [
      { id: 'v11-1', arabic: 'سَفَر', albanian: 'Udhëtim', root: 'س-ف-ر', type: 'noun', gender: 'M' },
      { id: 'v11-2', arabic: 'رِحْلَة', albanian: 'Udhëtim (i shkurtër)', root: 'ر-ح-ل', type: 'noun', gender: 'F', plural: 'رِحْلَات' },
      { id: 'v11-3', arabic: 'جَوَازُ السَّفَر', albanian: 'Pasaportë', root: 'ج-و-ز', type: 'noun', gender: 'M' },
      { id: 'v11-4', arabic: 'قِطَار', albanian: 'Tren', root: 'ق-ط-ر', type: 'noun', gender: 'M', plural: 'قِطَارَات' },
      { id: 'v11-5', arabic: 'طَائِرَة', albanian: 'Avion', root: 'ط-ي-ر', type: 'noun', gender: 'F', plural: 'طَائِرَات' },
      { id: 'v11-6', arabic: 'سَيَّارَة', albanian: 'Makinë', root: 'س-ي-ر', type: 'noun', gender: 'F', plural: 'سَيَّارَات' },
      { id: 'v11-7', arabic: 'حَافِلَة', albanian: 'Autobus', root: 'ح-ف-ل', type: 'noun', gender: 'F', plural: 'حَافِلَات' },
      { id: 'v11-8', arabic: 'مَدِينَة', albanian: 'Qytet', root: 'م-د-ن', type: 'noun', gender: 'F', plural: 'مُدُن' },
      { id: 'v11-9', arabic: 'قَرْيَة', albanian: 'Fshat', root: 'ق-ر-ي', type: 'noun', gender: 'F', plural: 'قُرَى' },
      { id: 'v11-10', arabic: 'هَوَاء', albanian: 'Ajër', root: 'ه-و-ي', type: 'noun', gender: 'M' },
      { id: 'v11-11', arabic: 'هَادِئ', albanian: 'I qetë', root: 'ه-د-أ', type: 'adjective', gender: 'M' },
      { id: 'v11-12', arabic: 'مُلَوَّث', albanian: 'I ndotur', root: 'ل-و-ث', type: 'adjective', gender: 'M' },
      { id: 'v11-13', arabic: 'نَقِيّ', albanian: 'I pastër', root: 'ن-ق-ي', type: 'adjective', gender: 'M' },
      { id: 'v11-14', arabic: 'اِزْدِحَام', albanian: 'Trafik / Turmë', root: 'ز-ح-م', type: 'noun', gender: 'M' },
      { id: 'v11-15', arabic: 'مُشْكِلَة', albanian: 'Problem', root: 'ش-ك-ل', type: 'noun', gender: 'F', plural: 'مَشَاكِل' },
      { id: 'v11-16', arabic: 'صَدِيق', albanian: 'Shok', root: 'ص-د-ق', type: 'noun', gender: 'M', plural: 'أَصْدِقَاء' },
      { id: 'v11-17', arabic: 'سُوق', albanian: 'Treg', root: 'س-و-ق', type: 'noun', gender: 'M', plural: 'أَسْوَاق' },
      { id: 'v11-18', arabic: 'سَافَرَ', present: 'يُسَافِرُ', imperative: 'سَافِرْ', albanian: 'Udhëtoi', root: 'س-ف-ر', type: 'verb' },
      { id: 'v11-19', arabic: 'رَكِبَ', present: 'يَرْكَبُ', imperative: 'اِرْكَبْ', albanian: 'Hipi (mjet)', root: 'ر-ك-ب', type: 'verb' },
      { id: 'v11-20', arabic: 'زَارَ', present: 'يَزُورُ', imperative: 'زُرْ', albanian: 'Vizitoi', root: 'ز-و-ر', type: 'verb' },
      { id: 'v11-21', arabic: 'اِسْتَغْرَقَ', present: 'يَسْتَغْرِقُ', imperative: 'اِسْتَغْرِقْ', albanian: 'Zgjati (kohë)', root: 'غ-ر-ق', type: 'verb' },
      { id: 'v11-22', arabic: 'اِنْتَقَلَ', present: 'يَنْتَقِلُ', imperative: 'اِنْتَقِلْ', albanian: 'U zhvendos', root: 'ن-ق-ل', type: 'verb' },
      { id: 'v11-23', arabic: 'وَلَكِنْ', albanian: 'Por / Mirëpo', root: 'ل-ك-ن', type: 'particle' },
      { id: 'v11-24', arabic: 'تَزَوَّجَ', albanian: 'U martua', root: 'ز-و-ج', type: 'verb', present: 'يَتَزَوَّجُ', imperative: 'تَزَوَّجْ' },
      { id: 'v11-25', arabic: 'تَلَوَّثَ', albanian: 'U ndot', root: 'ل-و-ث', type: 'verb', present: 'يَتَلَوَّثُ', imperative: 'تَلَوَّثْ' },
      { id: 'v11-26', arabic: 'اِزْدَحَمَ', albanian: 'U mbush me turmë', root: 'ز-ح-م', type: 'verb', present: 'يَزْدَحِمُ', imperative: 'اِزْدَحِمْ' },
      { id: 'v11-27', arabic: 'مُدِير', albanian: 'Drejtor', root: 'د-و-ر', type: 'noun', gender: 'M', plural: 'مُدِيرُون' },
      { id: 'v11-28', arabic: 'بَلَد', albanian: 'Vend/Shtet', root: 'ب-ل-د', type: 'noun', gender: 'M', plural: 'بِلَاد' },
      { id: 'v11-29', arabic: 'رَأْي', albanian: 'Mendim', root: 'ر-أ-ي', type: 'noun', gender: 'M', plural: 'آرَاء' },
      { id: 'v11-30', arabic: 'وَقْت', albanian: 'Kohë', root: 'و-ق-ت', type: 'noun', gender: 'M', plural: 'أَوْقَات' },
      { id: 'v11-31', arabic: 'أُسْتَاذ', albanian: 'Profesor', root: 'أ-س-ت-ذ', type: 'noun', gender: 'M', plural: 'أَسَاتِذَة' },
    ],
    grammarFocus: [
      'Shkronja e ardhmërisë سَـ (se-) + folje mudari‘: سَتُسَافِر',
      'Pyetja أَمْ (em) — zgjedhje mes dy opsioneve (tren apo avion?)',
      'Kundërvënia وَلَكِنْ (ve lakin) — lidhëza kundërshtore',
      'Folja اِسْتَغْرَقَ + كَمِيَّة kohore (sa zgjat) + kallëzore',
    ],
    exercises: [
      {
        id: 'ex11-1',
        type: 'transform',
        prompt: 'Shto سَـ për të ardhmen: "do të udhëtosh"',
        source: { arabic: 'تُسَافِرُ', albanian: 'udhëton' },
        answer: 'سَتُسَافِرُ',
        hint: 'سَـ ngjitet përpara foljes mudari pa hapësirë.',
        grammarPoint: 'E ardhme سَـ',
      },
      {
        id: 'ex11-2',
        type: 'transform',
        prompt: 'Ndërto pyetje zgjedhëse me أَمْ',
        source: { arabic: 'القِطَار / الطَّائِرَة', albanian: 'treni / aeroplani' },
        answer: 'بِالقِطَارِ أَمْ بِالطَّائِرَةِ؟',
        hint: 'بِـ + mjet i shquar; zgjedhja lidhet me أَمْ.',
        grammarPoint: 'Lidhëza أَمْ',
      },
      {
        id: 'ex11-3',
        type: 'transform',
        prompt: 'Ndërto: "në qytet ajri është i ndotur, por në fshat i pastër"',
        source: { arabic: 'المَدِينَة / القَرْيَة', albanian: 'qytet / fshat' },
        answer: 'الهَوَاءُ فِي المَدِينَةِ مُلَوَّثٌ وَلَكِنْ فِي القَرْيَةِ نَقِيٌّ.',
        hint: 'وَلَكِنْ lidh dy fjali kundërshtore.',
        grammarPoint: 'وَلَكِنْ',
      },
      {
        id: 'ex11-4',
        type: 'transform',
        prompt: 'Ndërto: "udhëtimi zgjati tri orë"',
        source: { arabic: 'الرِّحْلَة + ثَلَاث سَاعَات', albanian: 'udhëtimi + tri orë' },
        answer: 'اِسْتَغْرَقَتِ الرِّحْلَةُ ثَلَاثَ سَاعَاتٍ.',
        hint: 'Koha pas اِسْتَغْرَقَ shkon në kallëzore (ثَلَاثَ sāʿātin).',
        grammarPoint: 'اِسْتَغْرَقَ + kohë',
      },
      {
        id: 'ex11-5',
        type: 'transform',
        prompt: 'Shto سَـ: "do të vizitoj gjyshin"',
        source: { arabic: 'أَزُورُ جَدِّي.', albanian: 'Vizitoj gjyshin.' },
        answer: 'سَأَزُورُ جَدِّي.',
        hint: 'سَـ + mudari veta I njëjës (أَزُورُ).',
        grammarPoint: 'E ardhme سَـ',
      },
      {
        id: 'ex11-6',
        type: 'transform',
        prompt: 'Ndërto me وَلَكِنْ: "trafiku është i madh, por unë udhëtoj"',
        source: { arabic: 'الاِزْدِحَام شَدِيد / أُسَافِر', albanian: 'trafiku i madh / unë udhëtoj' },
        answer: 'الاِزْدِحَامُ شَدِيدٌ وَلَكِنْ أُسَافِرُ.',
        hint: 'وَلَكِنْ pasohet nga fjali e plotë.',
        grammarPoint: 'وَلَكِنْ',
      },
    ],
    stories: [
      {
        id: 's11-1',
        titleAl: 'Udhëtimi i Musait në fshat',
        albanian:
          'Të premten në mëngjes Musa u nis për të vizituar gjyshin në një fshat të qetë pranë maleve. Mori çantën, pasaportën dhe një dhuratë të vogël për gjyshen. Trafiku në qytet ishte i madh, prandaj ai hipi në tren dhe jo në autobus. Udhëtimi zgjati tri orë. Në fshat ajri ishte i pastër dhe i kthjellët, ndryshe nga ajri i ndotur i qytetit. Musa takoi shokët e tij të fëmijërisë, u ulën nën një pemë të madhe dhe biseduan për studimet, për punën dhe për udhëtimin e tyre të ardhshëm për në Umre.',
        arabic:
          'يَوْمَ الْجُمُعَةِ صَبَاحاً خَرَجَ مُوسَى لِزِيَارَةِ جَدِّهِ فِي قَرْيَةٍ هَادِئَةٍ قَرِيبَةٍ مِنَ الْجِبَالِ. أَخَذَ حَقِيبَتَهُ وَجَوَازَ سَفَرِهِ وَهَدِيَّةً صَغِيرَةً لِجَدَّتِهِ. كَانَ الاِزْدِحَامُ شَدِيداً فِي الْمَدِينَةِ، فَرَكِبَ الْقِطَارَ وَلَمْ يَرْكَبِ الْحَافِلَةَ. اِسْتَغْرَقَتِ الرِّحْلَةُ ثَلَاثَ سَاعَاتٍ. فِي الْقَرْيَةِ كَانَ الْهَوَاءُ نَقِيّاً صَافِياً، بِخِلَافِ الْهَوَاءِ الْمُلَوَّثِ فِي الْمَدِينَةِ. اِلْتَقَى مُوسَى بِأَصْدِقَاءِ الطُّفُولَةِ، وَجَلَسُوا تَحْتَ شَجَرَةٍ كَبِيرَةٍ وَتَحَدَّثُوا عَنِ الدِّرَاسَةِ وَالْعَمَلِ وَعَنْ رِحْلَتِهِمُ الْقَادِمَةِ إِلَى الْعُمْرَةِ.',
        transliteration:
          "Jewmel xhumu‘ati sabahan kharexhe Musa li zijareti xheddihi fi karjetin hadietin karibetin minel xhibal. Ekhadhe hakibetehu ve xhevaze seferihi ve hedijjeten sagireten li xheddetih. Kanel izdihamu shediden fil medine, fe rekibel kitare ve lem jerkebil hafile. Istegrekatir-rihletu theltha sa‘at. Fil karje kanel hevau nakijjen safien, bi khilafil hevail mulevvethi fil medine. Iltaka Musa bi asdika‘it-tufule, ve xhelesu tehte shexheretin kebire ve tehaddethu anid-dirase vel ‘amel ve an rihletihimul kadimeti ilel umra.",
      },
    ],
    ayat: [
      {
        // El-Bekare 2:185 — ajeti që jep lejën e udhëtarit në Ramazan.
        // سَفَر është fjala kryesore e Kapitullit 11 dhe këtu shfaqet
        // drejtpërdrejt si sfondi i një rregulli fetar praktik —
        // nxënësi e lidh fjalën "udhëtim" me një dispensim real.
        reference: '2:185',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'فَمَن شَهِدَ مِنكُمُ الشَّهْرَ فَلْيَصُمْهُ وَمَن كَانَ مَرِيضًا أَوْ عَلَىٰ سَفَرٍ فَعِدَّةٌ مِّنْ أَيَّامٍ أُخَرَ يُرِيدُ اللَّهُ بِكُمُ الْيُسْرَ وَلَا يُرِيدُ بِكُمُ الْعُسْرَ',
        albanian:
          'Kush e arrin muajin (Ramazanin), le ta agjërojë; e kush është i sëmurë ose në udhëtim, (agjërojë) një numër ditësh të tjera — Allahu dëshiron për ju lehtësi e nuk dëshiron për ju vështirësi.',
        knownWords: [
          { surface: 'سَفَرٍ', gloss: 'udhëtimi (nga سَفَر)' },
          { surface: 'أَيَّامٍ', gloss: 'ditë (shumësi i يَوْم)' },
        ],
      },
      {
        // Ez-Zuhruf 43:12 — Allahu ka krijuar mjetet që "ju hipni mbi
        // to". تَرْكَبُون vjen nga e njëjta rrënjë si رَكِبَ e Kapitullit
        // 11. Ky ajet është parafjala e duasë së udhëtimit që lexon
        // çdo musliman kur hyn në makinë, tren apo avion.
        reference: '43:12',
        surahNameAr: 'الزُّخْرُف',
        surahNameAl: 'Ez-Zuhruf',
        arabic:
          'وَالَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا وَجَعَلَ لَكُم مِّنَ الْفُلْكِ وَالْأَنْعَامِ مَا تَرْكَبُونَ',
        albanian:
          'Dhe Ai i Cili i krijoi të gjitha llojet, dhe ju bëri anijet dhe kafshët (si mjete) që ju hipni në to.',
        knownWords: [
          { surface: 'تَرْكَبُونَ', gloss: 'hipni (nga رَكِبَ)' },
        ],
      },
      {
        // El-Mulk 67:15 — urdhër i butë për udhëtim: "ecni në anët e
        // tokës dhe hani nga furnizimi i Tij". Lidh fjalorin e
        // Kapitullit 11 (udhëtim) me Kapitullin 5 (ushqim/ngrënie) dhe
        // Kapitullin 1 (هُوَ si përemri më i shpeshtë i Allahut).
        reference: '67:15',
        surahNameAr: 'المُلْك',
        surahNameAl: 'El-Mulk',
        arabic:
          'هُوَ الَّذِي جَعَلَ لَكُمُ الْأَرْضَ ذَلُولًا فَامْشُوا فِي مَنَاكِبِهَا وَكُلُوا مِن رِّزْقِهِ وَإِلَيْهِ النُّشُورُ',
        albanian:
          'Ai është që jua bëri tokën të nënshtruar; ecni pra nëpër anët e saj dhe hani nga furnizimi i Tij — e te Ai do të ktheheni.',
        knownWords: [
          { surface: 'هُوَ', gloss: 'Ai' },
          { surface: 'وَكُلُوا', gloss: 'dhe hani (nga أَكَلَ)' },
        ],
      },
      {
        // Ja-Sin 36:41 — "një shenjë për ta: Ne i transportuam pasardhësit
        // e tyre në anije të mbushur". الْفُلْك është fjala kuranore për
        // anijen — jo në fjalorin e drejtpërdrejtë (ku kemi سَفِينَة
        // moderne), por nga rrënja ف-ل-ك që tingëllon njësoj. Lidh
        // udhëtimin modern me anijen e Nuhit (a.s.).
        reference: '36:41',
        surahNameAr: 'يس',
        surahNameAl: 'Ja-Sin',
        arabic:
          'وَآيَةٌ لَّهُمْ أَنَّا حَمَلْنَا ذُرِّيَّتَهُمْ فِي الْفُلْكِ الْمَشْحُونِ',
        albanian:
          'Dhe për ta (ka) një shenjë: Ne i transportuam pasardhësit e tyre në anijen e mbushur.',
        knownWords: [
          {
            surface: 'الْفُلْكِ',
            gloss: 'anijes (kuranore e سَفِينَة)',
          },
        ],
      },
      {
        // Taha 20:77 — çarja e detit për Musain (a.s.): "hapu atyre një
        // rrugë të thatë në det". طَرِيقًا është fjala e kapitullit 11
        // (rruga e udhëtarit). Ajeti tregon se rruga — qoftë në asfalt
        // apo në det — është e hapur vetëm me lejen e Allahut.
        reference: '20:77',
        surahNameAr: 'طَه',
        surahNameAl: 'Taha',
        arabic:
          'فَاضْرِبْ لَهُمْ طَرِيقًا فِي الْبَحْرِ يَبَسًا',
        albanian:
          'Pra hapu atyre një rrugë të thatë në det.',
        knownWords: [
          { surface: 'طَرِيقًا', gloss: 'rrugë (nga طَرِيق)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 12,
    titleAr: 'الْهِوَايَات',
    titleAl: 'Hobitë',
    titleEn: 'Hobbies',
    dialogues: [
      {
        id: 'd12-1',
        albanian: 'Cili është hobi yt i preferuar?',
        arabic: 'مَا هِوَايَتُكَ الْمُفَضَّلَةُ؟',
        transliteration: 'Ma hiwajetukel mufaddale?',
      },
      {
        id: 'd12-2',
        albanian: 'Më pëlqen futbolli dhe noti sepse janë sporte të dobishme.',
        arabic: 'أُحِبُّ كُرَةَ الْقَدَمِ وَالسِّبَاحَةَ لِأَنَّهُمَا رِيَاضَتَانِ مُفِيدَتَانِ.',
        transliteration: "Uhibbu kuret el-kadem ves-sibahate li ennehuma rijadetani mufidetan.",
      },
      {
        id: 'd12-3',
        albanian: 'Motra ime e preferon kaligrafinë arabe; praktikon shkronjat Rukaa dhe Nes’h.',
        arabic: 'أُخْتِي تُفَضِّلُ الْخَطَّ الْعَرَبِيَّ؛ تَتَدَرَّبُ عَلَى خَطِّ الرُّقْعَةِ وَخَطِّ النَّسْخِ.',
        transliteration: "Ukhti tufeddilul khattal arabijj; tetederrebu ala khatt er-rukati ve khatt en-neskh.",
      },
      {
        id: 'd12-4',
        albanian: 'Axha im mbledh pulla; ka një koleksion të madh.',
        arabic: 'عَمِّي يَجْمَعُ الطَّوَابِعَ؛ عِنْدَهُ مَجْمُوعَةٌ كَبِيرَةٌ.',
        transliteration: "Ammi jexhmeu et-tevabia; indehu mexhmu‘atun kebire.",
      },
      {
        id: 'd12-5',
        albanian: 'Çdo javë lexoj një revistë dhe një libër islamik.',
        arabic: 'كُلَّ أُسْبُوعٍ أَقْرَأُ مَجَلَّةً وَكِتَاباً إِسْلَامِيّاً.',
        transliteration: "Kul-le usbu‘in akrau mexhel-leten ve kitaben islamijjen.",
      },
      {
        id: 'd12-6',
        albanian: 'A je korrespondent me shokë nga vende të tjera?',
        arabic: 'هَلْ لَكَ مُرَاسَلَةٌ مَعَ أَصْدِقَاءَ مِنْ بِلَادٍ أُخْرَى؟',
        transliteration: 'Hel leke muraseletun me‘a asdika‘e min biladin ukhra?',
      },
    ],
    vocabulary: [
      { id: 'v12-1', arabic: 'هِوَايَة', albanian: 'Hobi', root: 'ه-و-ي', type: 'noun', gender: 'F', plural: 'هِوَايَات' },
      { id: 'v12-2', arabic: 'مُفَضَّل', albanian: 'I preferuar', root: 'ف-ض-ل', type: 'adjective', gender: 'M' },
      { id: 'v12-3', arabic: 'كُرَةُ الْقَدَم', albanian: 'Futboll', root: 'ك-و-ر', type: 'noun', gender: 'F' },
      { id: 'v12-4', arabic: 'سِبَاحَة', albanian: 'Not', root: 'س-ب-ح', type: 'noun', gender: 'F' },
      { id: 'v12-5', arabic: 'فُرُوسِيَّة', albanian: 'Kalërim', root: 'ف-ر-س', type: 'noun', gender: 'F' },
      { id: 'v12-6', arabic: 'الْخَطُّ الْعَرَبِيّ', albanian: 'Kaligrafi arabe', root: 'خ-ط-ط', type: 'noun', gender: 'M' },
      { id: 'v12-7', arabic: 'خَطُّ الرُّقْعَة', albanian: 'Stili Rukaa', root: 'ر-ق-ع', type: 'noun', gender: 'M' },
      { id: 'v12-8', arabic: 'خَطُّ النَّسْخ', albanian: 'Stili Nes’h', root: 'ن-س-خ', type: 'noun', gender: 'M' },
      { id: 'v12-9', arabic: 'جَمْعُ الطَّوَابِع', albanian: 'Mbledhja e pullave', root: 'ط-ب-ع', type: 'noun', gender: 'M' },
      { id: 'v12-10', arabic: 'طَابِع', albanian: 'Pullë (postale)', root: 'ط-ب-ع', type: 'noun', gender: 'M', plural: 'طَوَابِع' },
      { id: 'v12-11', arabic: 'مَجَلَّة', albanian: 'Revistë', root: 'ج-ل-ل', type: 'noun', gender: 'F', plural: 'مَجَلَّات' },
      { id: 'v12-12', arabic: 'كِتَابٌ إِسْلَامِيّ', albanian: 'Libër islamik', root: 'س-ل-م', type: 'noun', gender: 'M' },
      { id: 'v12-13', arabic: 'قِصَّة', albanian: 'Tregim', root: 'ق-ص-ص', type: 'noun', gender: 'F', plural: 'قِصَص' },
      { id: 'v12-14', arabic: 'أَدَب', albanian: 'Letërsi', root: 'أ-د-ب', type: 'noun', gender: 'M' },
      { id: 'v12-15', arabic: 'آيَة', albanian: 'Ajet', root: 'أ-ي-ي', type: 'noun', gender: 'F', plural: 'آيَات' },
      { id: 'v12-16', arabic: 'مَعْرِض', albanian: 'Ekspozitë', root: 'ع-ر-ض', type: 'noun', gender: 'M', plural: 'مَعَارِض' },
      { id: 'v12-17', arabic: 'جَنَاح', albanian: 'Pavijon', root: 'ج-ن-ح', type: 'noun', gender: 'M', plural: 'أَجْنِحَة' },
      { id: 'v12-18', arabic: 'مُرَاسَلَة', albanian: 'Korrespondencë', root: 'ر-س-ل', type: 'noun', gender: 'F' },
      { id: 'v12-19', arabic: 'تَدْبِيرُ الْمَنْزِل', albanian: 'Menaxhim shtëpie', root: 'د-ب-ر', type: 'noun', gender: 'M' },
      { id: 'v12-20', arabic: 'مُفِيد', albanian: 'I dobishëm', root: 'ف-ي-د', type: 'adjective', gender: 'M' },
      { id: 'v12-21', arabic: 'اِخْتَارَ', present: 'يَخْتَارُ', imperative: 'اِخْتَرْ', albanian: 'Zgjodhi', root: 'خ-ي-ر', type: 'verb' },
      { id: 'v12-22', arabic: 'جَمَعَ', present: 'يَجْمَعُ', imperative: 'اِجْمَعْ', albanian: 'Mblodhi', root: 'ج-م-ع', type: 'verb' },
      { id: 'v12-23', arabic: 'فَضَّلَ', present: 'يُفَضِّلُ', imperative: 'فَضِّلْ', albanian: 'Preferoi', root: 'ف-ض-ل', type: 'verb' },
      { id: 'v12-24', arabic: 'صَحِيفَة', albanian: 'Gazetë', root: 'ص-ح-ف', type: 'noun', gender: 'F', plural: 'صُحُف' },
      { id: 'v12-25', arabic: 'جَمْعِيَّة', albanian: 'Shoqatë', root: 'ج-م-ع', type: 'noun', gender: 'F', plural: 'جَمْعِيَّات' },
      { id: 'v12-26', arabic: 'حَدِيث', albanian: 'Hadith/Bisedë', root: 'ح-د-ث', type: 'noun', gender: 'M', plural: 'أَحَادِيث' },
    ],
    grammarFocus: [
      'Dualis (muthenna): رِيَاضَتَانِ مُفِيدَتَانِ — "dy sporte të dobishme"',
      'لِأَنَّهُمَا (Li-ennehuma) — sepse (për dy)',
      'Idafa e dyfishtë: خَطُّ الرُّقْعَة, جَمْعُ الطَّوَابِع',
      'Mbiemri i krahasimit أَفْعَل — si strukturë semantike (مُفَضَّل)',
    ],
    exercises: [
      {
        id: 'ex12-1',
        type: 'transform',
        prompt: 'Kthe në dyjës nominativ: "dy sporte të dobishme"',
        source: { arabic: 'رِيَاضَة مُفِيدَة', albanian: 'sport i dobishëm (f.)' },
        answer: 'رِيَاضَتَانِ مُفِيدَتَانِ',
        hint: 'Dyjësi i rasës emërore mbaron me ـَانِ si te emri ashtu edhe te mbiemri.',
        grammarPoint: 'Dyjësi',
      },
      {
        id: 'ex12-2',
        type: 'transform',
        prompt: 'Ndërto: "sepse ato (dy) janë të dobishme"',
        source: { arabic: 'رِيَاضَتَانِ مُفِيدَتَانِ', albanian: 'dy sporte të dobishme' },
        answer: 'لِأَنَّهُمَا مُفِيدَتَانِ',
        hint: 'لِأَنَّ + ـهُمَا (ata/ato dy).',
        grammarPoint: 'لِأَنَّهُمَا',
      },
      {
        id: 'ex12-3',
        type: 'transform',
        prompt: 'Ndërto idafën: "stili Rukaa"',
        source: { arabic: 'خَطّ + الرُّقْعَة', albanian: 'stil + Rukaa' },
        answer: 'خَطُّ الرُّقْعَةِ',
        hint: 'Mudaf pa "AL", pa tenvin, me damme.',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex12-4',
        type: 'transform',
        prompt: 'Ndërto idafën: "mbledhja e pullave"',
        source: { arabic: 'جَمْع + الطَّوَابِع', albanian: 'mbledhje + pullat' },
        answer: 'جَمْعُ الطَّوَابِعِ',
        hint: 'Mudaf + mudaf ilejhi në kesra.',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex12-5',
        type: 'transform',
        prompt: 'Kthe në dyjës kallëzor: "pashë dy sporte"',
        source: { arabic: 'رِيَاضَة', albanian: 'sport' },
        answer: 'رَأَيْتُ رِيَاضَتَيْنِ',
        hint: 'Dyjësi kallëzor/gjenitiv merr mbaresën ـَيْنِ.',
        grammarPoint: 'Dyjësi',
      },
      {
        id: 'ex12-6',
        type: 'transform',
        prompt: 'Ndërto mbiemër krahasues me أَفْعَل: "më i dobishëm"',
        source: { arabic: 'مُفِيد', albanian: 'i dobishëm' },
        answer: 'أَفْيَد',
        hint: 'Modeli أَفْعَل për krahasore; rrënja ف-ي-د.',
        grammarPoint: 'Mbiemri أَفْعَل',
      },
    ],
    stories: [
      {
        id: 's12-1',
        titleAl: 'Hobitë e familjes së Musait',
        albanian:
          'Çdo anëtar i familjes së Musait ka një hobi të preferuar. Musa e do futbollin dhe notin sepse janë sporte të dobishme për trupin. Motra e tij, Amina, praktikon kaligrafinë arabe — shkronjat Rukaa dhe Nes’h — dhe i shkruan ajete të bukura për ekspozitën e shkollës. Axha mbledh pulla nga shumë vende dhe ka mbi njëqind copë. Nëna lexon libra islamikë dhe revista çdo javë dhe i flet fëmijëve për tregimet që gjen në to. Edhe Musa ka nisur një korrespondencë me një shok nga Egjipti për të praktikuar arabishten. Hobitë janë të dobishme kur na mësojnë diçka të re.',
        arabic:
          'لِكُلِّ فَرْدٍ مِنْ أُسْرَةِ مُوسَى هِوَايَةٌ مُفَضَّلَةٌ. مُوسَى يُحِبُّ كُرَةَ الْقَدَمِ وَالسِّبَاحَةَ لِأَنَّهُمَا رِيَاضَتَانِ مُفِيدَتَانِ لِلْجِسْمِ. أُخْتُهُ آمِنَةُ تَتَدَرَّبُ عَلَى الْخَطِّ الْعَرَبِيِّ — خَطِّ الرُّقْعَةِ وَخَطِّ النَّسْخِ — وَتَكْتُبُ آيَاتٍ جَمِيلَةً لِمَعْرِضِ الْمَدْرَسَةِ. الْعَمُّ يَجْمَعُ الطَّوَابِعَ مِنْ بِلَادٍ كَثِيرَةٍ، وَعِنْدَهُ أَكْثَرُ مِنْ مِئَةِ طَابِعٍ. الأُمُّ تَقْرَأُ الْكُتُبَ الإِسْلَامِيَّةَ وَالْمَجَلَّاتِ كُلَّ أُسْبُوعٍ، وَتُحَدِّثُ الأَوْلَادَ عَنِ الْقِصَصِ الَّتِي تَجِدُهَا فِيهَا. وَقَدْ بَدَأَ مُوسَى مُرَاسَلَةً مَعَ صَدِيقٍ مِنْ مِصْرَ لِيَتَدَرَّبَ عَلَى الْعَرَبِيَّةِ. الْهِوَايَاتُ مُفِيدَةٌ حِينَ تُعَلِّمُنَا شَيْئاً جَدِيداً.',
        transliteration:
          "Li kul-li ferdin min usreti Musa hiwajetun mufaddale. Musa juhibbu kuret el-kadem ves-sibahate li ennehuma rijadetani mufidetani lil xhism. Ukhtuhu Amine tetederrebu alel khatt el-arabijj — khatt er-rukati ve khatt en-neskh — ve tektubu ajatin xhemileten li ma‘ridil medrese. El-ammu jexhmeu et-tevabia min biladin kethire, ve indehu ektheru min mi‘eti tabi‘. El-ummu tekrau el-kutubel islamijjete vel mexhel-lati kul-le usbu‘, ve tuhaddithul evlade anil kisesil-leti texhiduha fiha. Ve kad bedee Musa muraseleten me‘a sadikin min Misr li jetederrebe alel arabijje. El-hiwajatu mufidetun hine tu‘al-limuna shej’en xhedida.",
      },
    ],
    ayat: [
      {
        // Jusuf 12:3 — Allahu e përshkruan Kuranin si rrëfim më i mirë:
        // "Ne të tregojmë më të bukurën nga rrëfimet". Rrënja ق-ص-ص
        // është e njëjtë me قِصَّة (tregim) — hobi i Kapitullit 12.
        // Lexim i tregimeve si hobi → Kurani është rrëfyesi më i lartë.
        reference: '12:3',
        surahNameAr: 'يُوسُف',
        surahNameAl: 'Jusuf',
        arabic:
          'نَحْنُ نَقُصُّ عَلَيْكَ أَحْسَنَ الْقَصَصِ بِمَا أَوْحَيْنَا إِلَيْكَ هَٰذَا الْقُرْآنَ وَإِن كُنتَ مِن قَبْلِهِ لَمِنَ الْغَافِلِينَ',
        albanian:
          'Ne të rrëfejmë ty rrëfimin më të bukur përmes asaj që ta shpallëm në këtë Kuran; e para tij ishe pa dijeni.',
        knownWords: [
          {
            surface: 'الْقَصَصِ',
            gloss: 'rrëfimet (nga rrënja ق-ص-ص, si قِصَّة)',
          },
          { surface: 'هَٰذَا', gloss: 'ky / këtë' },
        ],
      },
      {
        // El-Kalem 68:1 — betim me penën. القَلَم lidhet drejtpërdrejt
        // me الخَطّ العَرَبِيّ (kaligrafi) e Kapitullit 12. Nxënësi që
        // praktikon shkrimin e bukur duhet ta dijë që Allahu ka bërë
        // betim pikërisht me penën dhe me shkruajten.
        reference: '68:1',
        surahNameAr: 'القَلَم',
        surahNameAl: 'El-Kalem',
        arabic: 'ن وَالْقَلَمِ وَمَا يَسْطُرُونَ',
        albanian: 'Nun. Pasha penën dhe çka shkruajnë (me të)!',
        knownWords: [
          {
            surface: 'وَالْقَلَمِ',
            gloss: 'pasha penën (mjeti i khat-it arab)',
          },
        ],
      },
      {
        // El-Ankebut 29:49 — Kurani si "ajete të qarta në zemrat e
        // atyre që iu dha dija". آيَات (Kap. 12) + عِلْم (Kap. 7) —
        // leximi i revistave dhe librave islamikë si hobi na çon te
        // kjo dije e ruajtur në gjoksin e dijetarëve.
        reference: '29:49',
        surahNameAr: 'العَنْكَبُوت',
        surahNameAl: 'El-Ankebut',
        arabic:
          'بَلْ هُوَ آيَاتٌ بَيِّنَاتٌ فِي صُدُورِ الَّذِينَ أُوتُوا الْعِلْمَ وَمَا يَجْحَدُ بِآيَاتِنَا إِلَّا الظَّالِمُونَ',
        albanian:
          'Por ai (Kurani) është shenja të qarta në zemrat e atyre që u është dhënë dija; e shenjat Tona nuk i mohon kush, përveç të padrejtëve.',
        knownWords: [
          { surface: 'هُوَ', gloss: 'ai' },
          { surface: 'آيَاتٌ', gloss: 'ajete (nga آيَة)' },
          { surface: 'الْعِلْمَ', gloss: 'dijen (nga عِلْم)' },
        ],
      },
      {
        // El-Muzzemmil 73:20 — urdhri "lexoni atë që mundeni nga Kurani".
        // اقْرَءُوا (urdhër shumës, nga قَرَأَ, rrënja ق-ر-أ) e bën
        // leximin hobi të bekuar. Po ashtu الْقُرْآن (fjalë-burim e gjithë
        // leximit) shfaqet në të njëjtin varg.
        reference: '73:20',
        surahNameAr: 'المُزَّمِّل',
        surahNameAl: 'El-Muzzemmil',
        arabic: 'فَاقْرَءُوا مَا تَيَسَّرَ مِنَ الْقُرْآنِ',
        albanian:
          'Pra lexoni prej Kuranit sa të mundeni.',
        knownWords: [
          {
            surface: 'فَاقْرَءُوا',
            gloss: 'pra lexoni (urdhër shumës, nga قَرَأَ)',
          },
        ],
      },
      {
        // El-Bekare 2:282 — ajeti më i gjatë i Kuranit, për shkrimin e
        // borxhit: "shkruajeni atë". فَاكْتُبُوهُ (urdhër shumës, nga
        // كَتَبَ) lidh hobin e shkrimit/kaligrafisë me një urdhër
        // praktik ligjor. Edhe shkrimi i thjeshtë është akt i besimit.
        reference: '2:282',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا تَدَايَنتُم بِدَيْنٍ إِلَىٰ أَجَلٍ مُّسَمًّى فَاكْتُبُوهُ',
        albanian:
          'O ju që besuat! Kur merrni borxh me afat të caktuar, shkruajeni atë.',
        knownWords: [
          {
            surface: 'فَاكْتُبُوهُ',
            gloss: 'shkruajeni atë (urdhër shumës, nga كَتَبَ)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 13,
    titleAr: 'السَّفَرُ لِلْعُمْرَة',
    titleAl: 'Udhëtimi për Umre',
    titleEn: 'Travel for Umrah',
    dialogues: [
      {
        id: 'd13-1',
        albanian: 'Ku do të udhëtosh, o Musa?',
        arabic: 'إِلَى أَيْنَ سَتُسَافِرُ يَا مُوسَى؟',
        transliteration: 'Ila ejne setusafiru ja Musa?',
      },
      {
        id: 'd13-2',
        albanian: 'Do të udhëtoj në Medinen e Ndritshme dhe pastaj në Mekë.',
        arabic: 'سَأُسَافِرُ إِلَى الْمَدِينَةِ الْمُنَوَّرَةِ ثُمَّ إِلَى مَكَّةَ الْمُكَرَّمَةِ.',
        transliteration: 'Seusafiru ilel medinetil munevvere thumme ila Mekke el-mukerreme.',
      },
      {
        id: 'd13-3',
        albanian: 'A ke pasaportë, vizë hyrjeje dhe biletë?',
        arabic: 'هَلْ مَعَكَ جَوَازُ سَفَرٍ وَتَأْشِيرَةُ دُخُولٍ وَتَذْكِرَةٌ؟',
        transliteration: 'Hel me‘ake xhevazu seferin ve te‘shiretu dukhulin ve tedhkiretun?',
      },
      {
        id: 'd13-4',
        albanian: 'Po. Kam bërë edhe rezervimin e hotelit dhe kam valixhen në xhami lindore.',
        arabic: 'نَعَمْ. وَقَدْ حَجَزْتُ الْفُنْدُقَ، وَحَقِيبَتِي فِي الْجَنَاحِ الشَّرْقِيِّ.',
        transliteration: "Na‘am. Ve kad haxheztul funduk, ve hakibeti fil xhenahish-sharkijj.",
      },
      {
        id: 'd13-5',
        albanian: 'Kur është fluturimi jot ardhës?',
        arabic: 'مَتَى رِحْلَتُكَ الْقَادِمَةُ؟',
        transliteration: 'Meta rihletukel kadime?',
      },
      {
        id: 'd13-6',
        albanian: 'Nesër në mëngjes nga aeroporti. Në aeroplan kam humbur një herë valixhen, por më është kthyer.',
        arabic: 'غَداً صَبَاحاً مِنَ الْمَطَارِ. فَقَدْتُ حَقِيبَتِي مَرَّةً فِي الطَّائِرَةِ، ثُمَّ عَادَتْ إِلَيَّ.',
        transliteration: "Gaden sabahan minel matar. Fekadtu hakibeti merreten fit-taire, thumme adet ilejje.",
      },
    ],
    vocabulary: [
      { id: 'v13-1', arabic: 'عُمْرَة', albanian: 'Umre', root: 'ع-م-ر', type: 'noun', gender: 'F' },
      { id: 'v13-2', arabic: 'رِحْلَةُ طَيَرَان', albanian: 'Fluturim', root: 'ط-ي-ر', type: 'noun', gender: 'F' },
      { id: 'v13-3', arabic: 'الْخُطُوطُ الْجَوِّيَّة', albanian: 'Linjat ajrore', root: 'خ-ط-ط', type: 'noun', gender: 'F' },
      { id: 'v13-4', arabic: 'مَطَار', albanian: 'Aeroport', root: 'ط-ي-ر', type: 'noun', gender: 'M', plural: 'مَطَارَات' },
      { id: 'v13-5', arabic: 'جَوَازُ السَّفَر', albanian: 'Pasaportë', root: 'ج-و-ز', type: 'noun', gender: 'M' },
      { id: 'v13-6', arabic: 'تَأْشِيرَةُ دُخُول', albanian: 'Vizë hyrjeje', root: 'أ-ش-ر', type: 'noun', gender: 'F' },
      { id: 'v13-7', arabic: 'تَأْشِيرَةُ خُرُوج', albanian: 'Vizë dalje', root: 'أ-ش-ر', type: 'noun', gender: 'F' },
      { id: 'v13-8', arabic: 'تَذْكِرَة', albanian: 'Biletë', root: 'ذ-ك-ر', type: 'noun', gender: 'F', plural: 'تَذَاكِر' },
      { id: 'v13-9', arabic: 'حَجْز', albanian: 'Rezervim', root: 'ح-ج-ز', type: 'noun', gender: 'M' },
      { id: 'v13-10', arabic: 'فُنْدُق', albanian: 'Hotel', root: 'ف-ن-د-ق', type: 'noun', gender: 'M', plural: 'فَنَادِق' },
      { id: 'v13-11', arabic: 'حَقِيبَة', albanian: 'Valixhe', root: 'ح-ق-ب', type: 'noun', gender: 'F', plural: 'حَقَائِب' },
      { id: 'v13-12', arabic: 'جَنَاح', albanian: 'Krah / Pavijon', root: 'ج-ن-ح', type: 'noun', gender: 'M', plural: 'أَجْنِحَة' },
      { id: 'v13-13', arabic: 'شَرْق', albanian: 'Lindje', root: 'ش-ر-ق', type: 'noun', gender: 'M' },
      { id: 'v13-14', arabic: 'غَرْب', albanian: 'Perëndim', root: 'غ-ر-ب', type: 'noun', gender: 'M' },
      { id: 'v13-15', arabic: 'جَنُوب', albanian: 'Jug', root: 'ج-ن-ب', type: 'noun', gender: 'M' },
      { id: 'v13-16', arabic: 'شَمَال', albanian: 'Veri', root: 'ش-م-ل', type: 'noun', gender: 'M' },
      { id: 'v13-17', arabic: 'قَادِم', albanian: 'I ardhshëm', root: 'ق-د-م', type: 'adjective', gender: 'M' },
      { id: 'v13-18', arabic: 'أَقَامَ', present: 'يُقِيمُ', imperative: 'أَقِمْ', albanian: 'Qëndroi (banoi)', root: 'ق-و-م', type: 'verb' },
      { id: 'v13-19', arabic: 'إِقَامَة', albanian: 'Qëndrim / Leje qëndrimi', root: 'ق-و-م', type: 'noun', gender: 'F' },
      { id: 'v13-20', arabic: 'فَتَحَ', present: 'يَفْتَحُ', imperative: 'اِفْتَحْ', albanian: 'Hapi', root: 'ف-ت-ح', type: 'verb' },
      { id: 'v13-21', arabic: 'فَقَدَ', present: 'يَفْقِدُ', imperative: 'اِفْقِدْ', albanian: 'Humbi', root: 'ف-ق-د', type: 'verb' },
      { id: 'v13-22', arabic: 'مَقْبُولَة', albanian: 'E pranuar (f.)', root: 'ق-ب-ل', type: 'adjective', gender: 'F' },
      { id: 'v13-23', arabic: 'سَافَرَ', present: 'يُسَافِرُ', imperative: 'سَافِرْ', albanian: 'Udhëtoi', root: 'س-ف-ر', type: 'verb' },
      { id: 'v13-24', arabic: 'وَصَلَ', present: 'يَصِلُ', imperative: 'صِلْ', albanian: 'Arriti', root: 'و-ص-ل', type: 'verb' },
      { id: 'v13-25', arabic: 'غَادَرَ', albanian: 'U nis/U largua', root: 'غ-د-ر', type: 'verb', present: 'يُغَادِرُ', imperative: 'غَادِرْ' },
      { id: 'v13-26', arabic: 'أَكَّدَ', albanian: 'Konfirmoi', root: 'أ-ك-د', type: 'verb', present: 'يُؤَكِّدُ', imperative: 'أَكِّدْ' },
      { id: 'v13-27', arabic: 'خَطّ', albanian: 'Linjë', root: 'خ-ط-ط', type: 'noun', gender: 'M', plural: 'خُطُوط' },
      { id: 'v13-28', arabic: 'جَوَاز', albanian: 'Pasaportë', root: 'ج-و-ز', type: 'noun', gender: 'M', plural: 'جَوَازَات' },
      { id: 'v13-29', arabic: 'تَأْشِيرَة', albanian: 'Vizë', root: 'أ-ش-ر', type: 'noun', gender: 'F', plural: 'تَأْشِيرَات' },
      { id: 'v13-30', arabic: 'طَائِرَة', albanian: 'Aeroplan', root: 'ط-ي-ر', type: 'noun', gender: 'F', plural: 'طَائِرَات' },
      { id: 'v13-31', arabic: 'مُسَافِر', albanian: 'Udhëtar', root: 'س-ف-ر', type: 'noun', gender: 'M', plural: 'مُسَافِرُون' },
      { id: 'v13-32', arabic: 'لَوْن', albanian: 'Ngjyrë', root: 'ل-و-ن', type: 'noun', gender: 'M', plural: 'أَلْوَان' },
      { id: 'v13-33', arabic: 'مُوَظَّف', albanian: 'Nëpunës', root: 'و-ظ-ف', type: 'noun', gender: 'M', plural: 'مُوَظَّفُون' },
    ],
    grammarFocus: [
      'E ardhmja me سَـ / سَوْفَ: سَأُسَافِر, سَوْفَ أَزُور',
      'Idafa me përemër të bashkangjitur: جَوَازُ سَفَرِي, حَقِيبَتِي',
      'Parafjala بِـ për mjet: بِالطَّائِرَة, بِالسَّيَّارَة',
      'Folja قَدْ + Madi — veprim i kryer (قَدْ حَجَزْتُ)',
    ],
    exercises: [
      {
        id: 'ex13-1',
        type: 'transform',
        prompt: 'Shto سَـ: "do të udhëtoj"',
        source: { arabic: 'أُسَافِرُ', albanian: 'udhëtoj' },
        answer: 'سَأُسَافِرُ',
        hint: 'سَـ ngjitet pa hapësirë përpara foljes.',
        grammarPoint: 'E ardhme سَـ',
      },
      {
        id: 'ex13-2',
        type: 'transform',
        prompt: 'Shto سَوْفَ: "do të vizitoj"',
        source: { arabic: 'أَزُورُ', albanian: 'vizitoj' },
        answer: 'سَوْفَ أَزُورُ',
        hint: 'سَوْفَ është variant më i gjerë i سَـ; shkruhet si fjalë më vete.',
        grammarPoint: 'E ardhme سَوْفَ',
      },
      {
        id: 'ex13-3',
        type: 'transform',
        prompt: 'Ndërto idafë me përemër: "pasaporta ime"',
        source: { arabic: 'جَوَاز + سَفَر + ـِي', albanian: 'pasaportë + im' },
        answer: 'جَوَازُ سَفَرِي',
        hint: 'Idafa: جَوَازُ (damme, pa AL) + سَفَر me ـِي.',
        grammarPoint: 'Idafa me përemër',
      },
      {
        id: 'ex13-4',
        type: 'transform',
        prompt: 'Shto بِـ për mjetin: "me aeroplan"',
        source: { arabic: 'الطَّائِرَة', albanian: 'aeroplani' },
        answer: 'بِالطَّائِرَةِ',
        hint: 'بِـ + emër i shquar → kesra në fund.',
        grammarPoint: 'بِـ mjeti',
      },
      {
        id: 'ex13-5',
        type: 'transform',
        prompt: 'Shto قَدْ + Madi: "kam rezervuar hotelin"',
        source: { arabic: 'حَجَزْتُ الفُنْدُقَ.', albanian: 'rezervova hotelin' },
        answer: 'قَدْ حَجَزْتُ الفُنْدُقَ.',
        hint: 'قَدْ + Madi tregon veprim të kryer me siguri.',
        grammarPoint: 'قَدْ + Madi',
      },
      {
        id: 'ex13-6',
        type: 'transform',
        prompt: 'Ndërto idafë me përemër: "valixhja ime"',
        source: { arabic: 'حَقِيبَة + ـِي', albanian: 'valixhe + ime' },
        answer: 'حَقِيبَتِي',
        hint: 'ة → ت kur i bashkëngjitet një përemër: حَقِيبَتِي.',
        grammarPoint: 'Idafa me përemër',
      },
    ],
    stories: [
      {
        id: 's13-1',
        titleAl: 'Udhëtimi për Umre',
        albanian:
          'Këtë verë, inshaAllah, do të udhëtoj për në Medinen e Ndritshme. Do të shkoj me aeroplan nga Prishtina për në Xheda dhe pastaj me makinë për në Mekë. Kam pasaportën, biletën dhe valixhen të gatshme. Do të qëndroj dy javë dhe do të vizitoj Xhaminë e Profetit (paqja qoftë mbi të). Kjo do të jetë udhëtimi më i bukur i jetës sime dhe po e pres me shumë dëshirë.',
        arabic:
          'هَذَا الصَّيْفَ إِنْ شَاءَ اللَّهُ سَأُسَافِرُ إِلَى الْمَدِينَةِ الْمُنَوَّرَةِ. سَأَذْهَبُ بِالطَّائِرَةِ مِنْ بْرِشْتِينَا إِلَى جَدَّة ثُمَّ بِالسَّيَّارَةِ إِلَى مَكَّة. عِنْدِي جَوَازُ السَّفَرِ وَالتَّذْكِرَةُ وَالْحَقِيبَةُ جَاهِزَة. سَأَبْقَى أُسْبُوعَيْنِ وَسَأَزُورُ الْمَسْجِدَ النَّبَوِيَّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ. هَذِهِ سَتَكُونُ أَجْمَلَ رِحْلَةٍ فِي حَيَاتِي وَأَنْتَظِرُهَا بِشَوْقٍ كَبِيرٍ.',
        transliteration:
          "Hadha es-sajfe inshallah seusafiru ilel medine el-munevvere. Seedhhebu bit-tajira min Prishtina ila Xhedde thumme bis-sejjara ila Mekke. Indi xhevazus-sefer vet-tedhkire vel hakibe xhahize. Se ebka usbu'ajn ve seezuru el-mesxhid en-nebevijj sallAllahu alejhi ve sellem. Hadhihi setekunu exhmele rihlatin fi hajati ve entezuruha bi shewkin kebir.",
      },
    ],
    ayat: [
      {
        // El-Bekare 2:196 — urdhri kuranor për Umren: "Plotësoni Haxhin
        // dhe Umren për Allahun". العُمْرَة është fjala qendrore e
        // Kapitullit 13, këtu në trajtën e saj më të drejtpërdrejtë.
        reference: '2:196',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic: 'وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ',
        albanian: 'Plotësoni Haxhin dhe Umren për Allahun.',
        knownWords: [
          { surface: 'وَالْعُمْرَةَ', gloss: 'dhe Umren (nga عُمْرَة)' },
        ],
      },
      {
        // El-Bekare 2:158 — Safa-Merva dhe sa‘ji: "kush e bën Haxhin
        // ose Umren". اعْتَمَرَ (kreu Umren) është folja nga e njëjta
        // rrënja ع-م-ر si عُمْرَة. Edhe الْبَيْت (Kap. 3) del sërish
        // si referim për Qaben.
        reference: '2:158',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'إِنَّ الصَّفَا وَالْمَرْوَةَ مِن شَعَائِرِ اللَّهِ فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَن يَطَّوَّفَ بِهِمَا وَمَن تَطَوَّعَ خَيْرًا فَإِنَّ اللَّهَ شَاكِرٌ عَلِيمٌ',
        albanian:
          'Vërtet, Safa dhe Merva janë prej shenjave të Allahut. Ai që kryen Haxhin e Shtëpisë ose Umren, nuk bën mëkat nëse ecën mes tyre; e kush bën vullnetarisht mirë, Allahu është Falënderues, i Gjithëdijshëm.',
        knownWords: [
          { surface: 'الْبَيْتَ', gloss: 'Shtëpinë (Qaben, nga بَيْت)' },
          {
            surface: 'اعْتَمَرَ',
            gloss: 'kreu Umren (nga rrënja ع-م-ر, si عُمْرَة)',
          },
        ],
      },
      {
        // Ali Imran 3:97 — Haxhi si detyrë për ata që mundin rrugën.
        // Përmban tri fjalë kumulative: الْبَيْت (Kap. 3), مَقَام
        // (qëndrim, idhull i آل-ق-ا-ل), dhe indirect lidhje me Kap. 11
        // (udhëtimi). Po ashtu një lidhje e fortë me Kapitullin 6
        // (المَسْجِدُ الحَرَام).
        reference: '3:97',
        surahNameAr: 'آلِ عِمْرَان',
        surahNameAl: 'Ali Imran',
        arabic:
          'فِيهِ آيَاتٌ بَيِّنَاتٌ مَّقَامُ إِبْرَاهِيمَ وَمَن دَخَلَهُ كَانَ آمِنًا وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا',
        albanian:
          'Në të ka shenja të qarta: vendqëndrimi i Ibrahimit. Kush hyn në të është i sigurt. Dhe për hir të Allahut, mbi njerëzit është detyrë Haxhi i Shtëpisë, për atë që mund të shkojë.',
        knownWords: [
          { surface: 'آيَاتٌ', gloss: 'shenja / ajete (nga آيَة)' },
          { surface: 'دَخَلَهُ', gloss: 'hyri në të (nga دَخَلَ)' },
          { surface: 'الْبَيْتِ', gloss: 'Shtëpisë (Qabes, nga بَيْت)' },
        ],
      },
      {
        // El-Bekare 2:125 — Allahu urdhëron Ibrahimin dhe Ismailin të
        // pastrojnë Shtëpinë për "ata që bëjnë tavaf". الطَّائِفِين është
        // pjesore aktive e foljes طَافَ (rrënja ط-و-ف si طَوَاف, rituali
        // kryesor i kapitullit 13). Pelegrini sot vazhdon një urdhër të
        // dhënë mijëra vjet më parë.
        reference: '2:125',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'وَعَهِدْنَا إِلَىٰ إِبْرَاهِيمَ وَإِسْمَاعِيلَ أَن طَهِّرَا بَيْتِيَ لِلطَّائِفِينَ وَالْعَاكِفِينَ وَالرُّكَّعِ السُّجُودِ',
        albanian:
          'Dhe e urdhëruam Ibrahimin dhe Ismailin: Pastroni Shtëpinë Time për ata që bëjnë tavaf, për ata që qëndrojnë në adhurim dhe për ata që kryejnë ruku e sexhde.',
        knownWords: [
          {
            surface: 'لِلطَّائِفِينَ',
            gloss: 'për ata që bëjnë tavaf (nga rrënja ط-و-ف si طَوَاف)',
          },
        ],
      },
      {
        // El-Fet·h 48:27 — ajeti i ëndrrës së Pejgamberit (s.a.v.s): "do
        // të hyni në Mesxhidul-Haram, në siguri, duke rruar kokat ose
        // duke i shkurtuar flokët". Ky është rituali i tehal·lulit që
        // mbyll Umren. الْمَسْجِدَ الْحَرَام është fjalori kyç i kapitullit
        // 6 që ri-aktivizohet këtu në kontekstin specifik të pelegrinazhit.
        reference: '48:27',
        surahNameAr: 'الفَتْح',
        surahNameAl: 'El-Fet·h',
        arabic:
          'لَتَدْخُلُنَّ الْمَسْجِدَ الْحَرَامَ إِن شَاءَ اللَّهُ آمِنِينَ مُحَلِّقِينَ رُءُوسَكُمْ وَمُقَصِّرِينَ لَا تَخَافُونَ',
        albanian:
          'Do të hyni në Mesxhidin e Shenjtë, insh\'Allah, të sigurt, me koka të rruara ose me flokë të shkurtuar, pa frikë.',
        knownWords: [
          {
            surface: 'الْمَسْجِدَ الْحَرَامَ',
            gloss: 'Mesxhidin e Shenjtë (Qabes, Kap. 6)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 14,
    titleAr: 'الْحَجّ',
    titleAl: 'Haxhi',
    titleEn: 'Hajj',
    dialogues: [
      {
        id: 'd14-1',
        albanian: 'A e ke kryer Haxhin ndonjëherë?',
        arabic: 'هَلْ أَدَّيْتَ الْحَجَّ مِنْ قَبْلُ؟',
        transliteration: 'Hel eddejtel haxhxhe min kabl?',
      },
      {
        id: 'd14-2',
        albanian: 'Po, vitin e kaluar. Vesha rrobat e Ihramit në Mikat.',
        arabic: 'نَعَمْ، فِي الْعَامِ الْمَاضِي. لَبِسْتُ ثَوْبَ الإِحْرَامِ فِي الْمِيقَاتِ.',
        transliteration: 'Na‘am, fil amil madi. Lebistu thewbel ihrami fil mikat.',
      },
      {
        id: 'd14-3',
        albanian: 'Sa rrethrrotullime bëre rreth Qabes?',
        arabic: 'كَمْ شَوْطاً طُفْتَ حَوْلَ الْكَعْبَةِ؟',
        transliteration: 'Kem shewten tufte hevlel ka‘be?',
      },
      {
        id: 'd14-4',
        albanian: 'Shtatë rrethrrotullime — tavafi i ifadas — pastaj Sai mes Safas dhe Merves.',
        arabic: 'سَبْعَةُ أَشْوَاطٍ — طَوَافُ الإِفَاضَةِ — ثُمَّ سَعَيْتُ بَيْنَ الصَّفَا وَالْمَرْوَة.',
        transliteration: "Seb‘atu eshwat — tevafu el-ifada — thumme se‘ajtu bejnes-safa vel merve.",
      },
      {
        id: 'd14-5',
        albanian: 'Në Mina hodha gurët te Xhemreja e Madhe dhe bëra kurbanin.',
        arabic: 'فِي مِنَى رَمَيْتُ الْجَمْرَةَ الْكُبْرَى وَذَبَحْتُ الْهَدْيَ.',
        transliteration: "Fi Mina remejtul xhemretel kubra ve dhebahtul hedje.",
      },
      {
        id: 'd14-6',
        albanian: 'Sa e madhe është Teljija! "Labbejkallahumme labbejk."',
        arabic: 'مَا أَعْظَمَ التَّلْبِيَةَ! «لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ».',
        transliteration: 'Ma a‘zamet-telbije! «Lebbejkallahumme lebbejk.»',
      },
    ],
    vocabulary: [
      { id: 'v14-1', arabic: 'الْحَجّ', albanian: 'Haxhi', root: 'ح-ج-ج', type: 'noun', gender: 'M' },
      { id: 'v14-2', arabic: 'ثَوْبُ الإِحْرَام', albanian: 'Rroba e Ihramit', root: 'ح-ر-م', type: 'noun', gender: 'M' },
      { id: 'v14-3', arabic: 'الْمِيقَات', albanian: 'Mikat (pika e Ihramit)', root: 'و-ق-ت', type: 'noun', gender: 'M', plural: 'الْمَوَاقِيت' },
      { id: 'v14-4', arabic: 'الْكَعْبَة', albanian: 'Qabeja', root: 'ك-ع-ب', type: 'noun', gender: 'F' },
      { id: 'v14-5', arabic: 'مَقَامُ إِبْرَاهِيم', albanian: 'Mekami i Ibrahimit', root: 'ق-و-م', type: 'noun', gender: 'M' },
      { id: 'v14-6', arabic: 'طَوَافُ الإِفَاضَة', albanian: 'Tavafi i Ifadas', root: 'ط-و-ف', type: 'noun', gender: 'M' },
      { id: 'v14-7', arabic: 'طَوَافُ الْوَدَاع', albanian: 'Tavafi i lamtumirës', root: 'ط-و-ف', type: 'noun', gender: 'M' },
      { id: 'v14-8', arabic: 'شَوْط', albanian: 'Rrethrrotullim', root: 'ش-و-ط', type: 'noun', gender: 'M', plural: 'أَشْوَاط' },
      { id: 'v14-9', arabic: 'سَعْي', albanian: 'Sai (vrapimi)', root: 'س-ع-ي', type: 'noun', gender: 'M' },
      { id: 'v14-10', arabic: 'عَرَفَات', albanian: 'Arafat', root: 'ع-ر-ف', type: 'noun', gender: 'F' },
      { id: 'v14-11', arabic: 'مُزْدَلِفَة', albanian: 'Muzdelife', root: 'ز-ل-ف', type: 'noun', gender: 'F' },
      { id: 'v14-12', arabic: 'مِنَى', albanian: 'Mina', root: 'م-ن-ي', type: 'noun', gender: 'F' },
      { id: 'v14-13', arabic: 'رَمْيُ الْجِمَار', albanian: 'Hedhja e gurëve', root: 'ر-م-ي', type: 'noun', gender: 'M' },
      { id: 'v14-14', arabic: 'الْجَمْرَةُ الْكُبْرَى', albanian: 'Xhemreja e Madhe', root: 'ج-م-ر', type: 'noun', gender: 'F' },
      { id: 'v14-15', arabic: 'ذَبْح', albanian: 'Prerja (kurbani)', root: 'ذ-ب-ح', type: 'noun', gender: 'M' },
      { id: 'v14-16', arabic: 'الْهَدْي', albanian: 'Kurbani i Haxhit', root: 'ه-د-ي', type: 'noun', gender: 'M' },
      { id: 'v14-17', arabic: 'حَلْق', albanian: 'Rruajtja e kokës', root: 'ح-ل-ق', type: 'noun', gender: 'M' },
      { id: 'v14-18', arabic: 'رَأْس', albanian: 'Kokë', root: 'ر-أ-س', type: 'noun', gender: 'M', plural: 'رُؤُوس' },
      { id: 'v14-19', arabic: 'رَكْعَة', albanian: 'Rekat', root: 'ر-ك-ع', type: 'noun', gender: 'F', plural: 'رَكَعَات' },
      { id: 'v14-20', arabic: 'التَّلْبِيَة', albanian: 'Teljija', root: 'ل-ب-ب', type: 'noun', gender: 'F' },
      { id: 'v14-21', arabic: 'أَحَدَ عَشَرَ', albanian: 'Njëmbëdhjetë (11)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v14-22', arabic: 'اِثْنَا عَشَرَ', albanian: 'Dymbëdhjetë (12)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v14-23', arabic: 'ثَلَاثَةَ عَشَرَ', albanian: 'Trembëdhjetë (13)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v14-24', arabic: 'تِسْعَةَ عَشَرَ', albanian: 'Nëntëmbëdhjetë (19)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v14-25', arabic: 'أَدَّى', present: 'يُؤَدِّي', imperative: 'أَدِّ', albanian: 'Kreu / përmbushi', root: 'أ-د-ي', type: 'verb' },
      { id: 'v14-26', arabic: 'طَافَ', present: 'يَطُوفُ', imperative: 'طُفْ', albanian: 'Bëri tavaf', root: 'ط-و-ف', type: 'verb' },
      { id: 'v14-27', arabic: 'سَعَى', present: 'يَسْعَى', imperative: 'اِسْعَ', albanian: 'Bëri sai', root: 'س-ع-ي', type: 'verb' },
      { id: 'v14-28', arabic: 'رَمَى', present: 'يَرْمِي', imperative: 'اِرْمِ', albanian: 'Hodhi (gurët)', root: 'ر-م-ي', type: 'verb' },
      { id: 'v14-29', arabic: 'ذَبَحَ', present: 'يَذْبَحُ', imperative: 'اِذْبَحْ', albanian: 'Preu', root: 'ذ-ب-ح', type: 'verb' },
      { id: 'v14-30', arabic: 'حَلَقَ', present: 'يَحْلِقُ', imperative: 'اِحْلِقْ', albanian: 'Rruajti kokën', root: 'ح-ل-ق', type: 'verb' },
      { id: 'v14-31', arabic: 'اِعْتَمَرَ', albanian: 'Bëri Umren', root: 'ع-م-ر', type: 'verb', present: 'يَعْتَمِرُ', imperative: 'اِعْتَمِرْ' },
      { id: 'v14-32', arabic: 'شَعَرَ', albanian: 'Ndjeu', root: 'ش-ع-ر', type: 'verb', present: 'يَشْعُرُ', imperative: 'اُشْعُرْ' },
      { id: 'v14-33', arabic: 'خَلَعَ', albanian: 'Hoqi (rroba)', root: 'خ-ل-ع', type: 'verb', present: 'يَخْلَعُ', imperative: 'اِخْلَعْ' },
      { id: 'v14-34', arabic: 'صَامَ', albanian: 'Agjëroi', root: 'ص-و-م', type: 'verb', present: 'يَصُومُ', imperative: 'صُمْ' },
      { id: 'v14-35', arabic: 'لَبِسَ', albanian: 'Veshi', root: 'ل-ب-س', type: 'verb', present: 'يَلْبَسُ', imperative: 'اِلْبَسْ' },
      { id: 'v14-36', arabic: 'لَبَّى', albanian: 'Iu përgjigj (telbije)', root: 'ل-ب-ي', type: 'verb', present: 'يُلَبِّي', imperative: 'لَبِّ' },
      { id: 'v14-37', arabic: 'وَصَلَ', albanian: 'Arriti', root: 'و-ص-ل', type: 'verb', present: 'يَصِلُ', imperative: 'صِلْ' },
      { id: 'v14-38', arabic: 'هَدْي', albanian: 'Kurban i haxhit', root: 'ه-د-ي', type: 'noun', gender: 'M', plural: 'هَدْي' },
    ],
    grammarFocus: [
      'Numrat 11–19: أَحَدَ عَشَر, اِثْنَا عَشَر, … — të dy pjesët mbi fetha',
      'Tëmjiz (specifikim) i numrave 11–99: عَشَر + emër në tenwin fetha',
      'Foljet مَاضِي të Haxhit: أَدَّى، طَافَ، سَعَى، رَمَى، ذَبَحَ، حَلَقَ',
      'Shprehja admirimi مَا أَعْظَمَ + emër në kallëzore (mea‘zamet…)',
    ],
    exercises: [
      {
        id: 'ex14-1',
        type: 'transform',
        prompt: 'Shkruaj numrin 12 në formë mashkullore',
        source: { arabic: '12', albanian: 'dymbëdhjetë' },
        answer: 'اِثْنَا عَشَرَ',
        hint: 'Dymbëdhjeta mashkullore: اِثْنَا عَشَرَ (pjesa e parë në emërore).',
        grammarPoint: 'Numrat 11–19',
      },
      {
        id: 'ex14-2',
        type: 'transform',
        prompt: 'Specifiko me tëmjiz: "njëmbëdhjetë rekate"',
        source: { arabic: 'أَحَدَ عَشَرَ + رَكْعَة', albanian: '11 + rekat' },
        answer: 'أَحَدَ عَشَرَ رَكْعَةً',
        hint: 'Tëmjizi pas 11–99 është i njëjës dhe merr tenvin fetha.',
        grammarPoint: 'Tëmjiz i numrave',
      },
      {
        id: 'ex14-3',
        type: 'transform',
        prompt: 'Kthe në Madi veta I: "bëra tavaf"',
        source: { arabic: 'طَافَ', albanian: 'bëri tavaf' },
        answer: 'طُفْتُ',
        hint: 'Foljet me rrënjë të mesme shkronjë të dobët: طَافَ → طُفْتُ.',
        grammarPoint: 'Madi veta I',
      },
      {
        id: 'ex14-4',
        type: 'transform',
        prompt: 'Kthe në Madi veta I: "hodha gurët"',
        source: { arabic: 'رَمَى الجَمْرَةَ.', albanian: 'hodhi xhemren' },
        answer: 'رَمَيْتُ الجَمْرَةَ.',
        hint: 'Foljet me رَمَى në veta I: ـَيْتُ (rrënja ي shfaqet).',
        grammarPoint: 'Madi veta I',
      },
      {
        id: 'ex14-5',
        type: 'transform',
        prompt: 'Shpreh admirim: "Sa madhështore është Teljija!"',
        source: { arabic: 'التَّلْبِيَة', albanian: 'Teljija' },
        answer: 'مَا أَعْظَمَ التَّلْبِيَةَ!',
        hint: 'مَا أَعْظَمَ + emër në kallëzore (tenvin fetha ose ـَةَ).',
        grammarPoint: 'مَا أَعْظَمَ',
      },
      {
        id: 'ex14-6',
        type: 'transform',
        prompt: 'Kthe në Madi veta I: "kreva Haxhin"',
        source: { arabic: 'أَدَّى الحَجَّ.', albanian: 'kreu Haxhin' },
        answer: 'أَدَّيْتُ الحَجَّ.',
        hint: 'أَدَّى → أَدَّيْتُ (veta I me ـَيْتُ).',
        grammarPoint: 'Madi veta I',
      },
    ],
    stories: [
      {
        id: 's14-1',
        titleAl: 'Musa në Haxh',
        albanian:
          'Vitin e kaluar Musa kreu Haxhin me babain. Në Mikat veshën rrobat e Ihramit dhe filluan teljijen: «Labbejkallahumme labbejk». Kur arritën në Mekë, bënë tavafin e Ifadas shtatë rrethrrotullime rreth Qabes dhe u falën dy rekat pranë Mekamit të Ibrahimit. Pastaj bënë saj mes Safas dhe Merves. Në ditën e Arafatit qëndruan deri në perëndim të diellit dhe iu lutën Allahut me zemër të përulur. Natën e kaluan në Muzdelife dhe mblodhën gurët. Të nesërmen në Mina hodhën Xhemren e Madhe, prenë kurbanin dhe u rruajtën. Haxhi i pranuar është shpërblimi i Xhenetit.',
        arabic:
          'فِي الْعَامِ الْمَاضِي أَدَّى مُوسَى الْحَجَّ مَعَ أَبِيهِ. فِي الْمِيقَاتِ لَبِسَا ثَوْبَ الإِحْرَامِ وَبَدَآ التَّلْبِيَةَ: «لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ». وَلَمَّا وَصَلَا إِلَى مَكَّةَ، طَافَا طَوَافَ الإِفَاضَةِ سَبْعَةَ أَشْوَاطٍ حَوْلَ الْكَعْبَةِ وَصَلَّيَا رَكْعَتَيْنِ عِنْدَ مَقَامِ إِبْرَاهِيمَ. ثُمَّ سَعَيَا بَيْنَ الصَّفَا وَالْمَرْوَةِ. فِي يَوْمِ عَرَفَةَ وَقَفَا حَتَّى غُرُوبِ الشَّمْسِ وَدَعَوَا اللَّهَ بِقَلْبٍ خَاشِعٍ. وَبَاتَا فِي مُزْدَلِفَةَ وَجَمَعَا الْحَصَى. فِي الْيَوْمِ التَّالِي فِي مِنًى رَمَيَا الْجَمْرَةَ الْكُبْرَى وَذَبَحَا الْهَدْيَ وَحَلَقَا رُؤُوسَهُمَا. الْحَجُّ الْمَبْرُورُ جَزَاؤُهُ الْجَنَّةُ.',
        transliteration:
          "Fil amil madi edda Musa el-haxhxhe me‘a ebih. Fil mikati lebisa thewbel ihrami ve bedeaet-telbije: «Lebbejkallahumme lebbejk». Ve lemma vesala ila Mekke, tafa tevafel ifadati seb‘ate eshwat hevlel ka‘be ve sal-laja rek‘atejni inde mekami Ibrahim. Thumme se‘aja bejnes-safa vel merve. Fi jewmi Arafe vekafa hatta gurubish-shems ve de‘aallahe bi kalbin khashi‘. Ve bata fi Muzdelife ve xheme‘al haa. Fil jewmit-tali fi Mina remejal xhemretel kubra ve dhebehaal hedje ve halaka ru‘usehuma. El-haxhxhul mebruru xhezauhul xhenne.",
      },
    ],
    ayat: [
      {
        // El-Haxhxh 22:27 — thirrja historike e Ibrahimit (a.s.) për
        // Haxh: "Thirri njerëzit për Haxhin, të vijnë në këmbë dhe
        // me çdo deve". Ajeti që ka mbushur Qaben me pelegrinë për
        // mijëra vjet.
        reference: '22:27',
        surahNameAr: 'الحَجّ',
        surahNameAl: 'El-Haxhxh',
        arabic:
          'وَأَذِّن فِي النَّاسِ بِالْحَجِّ يَأْتُوكَ رِجَالًا وَعَلَىٰ كُلِّ ضَامِرٍ يَأْتِينَ مِن كُلِّ فَجٍّ عَمِيقٍ',
        albanian:
          'Thirri njerëzit për Haxh, do të vijnë te ti në këmbë dhe mbi çdo deve të hollë, do të vijnë nga çdo rrugë e largët.',
        knownWords: [
          { surface: 'بِالْحَجِّ', gloss: 'për Haxhin (nga حَجّ)' },
        ],
      },
      {
        // El-Bekare 2:197 — "Haxhi është në muaj të caktuar". Fjala
        // الْحَجّ shfaqet tri herë në një ajet të vetëm — përsëritje
        // shkollore e plotë e fjalës kryesore. Gjithashtu أَشْهُر
        // (muaj, nga شَهْر e Kapitullit 7) është carry-over.
        reference: '2:197',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'الْحَجُّ أَشْهُرٌ مَّعْلُومَاتٌ فَمَن فَرَضَ فِيهِنَّ الْحَجَّ فَلَا رَفَثَ وَلَا فُسُوقَ وَلَا جِدَالَ فِي الْحَجِّ وَمَا تَفْعَلُوا مِنْ خَيْرٍ يَعْلَمْهُ اللَّهُ',
        albanian:
          'Haxhi është në muaj të caktuar. Ai që vendos të bëjë Haxhin, të mos flasë fjalë të ndyra, të mos bëjë mëkate, të mos grindet gjatë Haxhit. Çfarëdo të mire që të bëni, Allahu e di.',
        knownWords: [
          { surface: 'الْحَجُّ', gloss: 'Haxhi (nga حَجّ)' },
          { surface: 'الْحَجَّ', gloss: 'Haxhin (nga حَجّ)' },
          { surface: 'الْحَجِّ', gloss: 'Haxhit (nga حَجّ)' },
          { surface: 'أَشْهُرٌ', gloss: 'muaj (shumësi i شَهْر)' },
        ],
      },
      {
        // El-Haxhxh 22:29 — urdhri për tavaf: "le ta bëjnë tavafin e
        // Shtëpisë së vjetër". لْيَطَّوَّفُوا vjen nga rrënja ط-و-ف e
        // njëjtë me طَافَ (kreu tavaf) e Kapitullit 14. Gjithashtu
        // الْبَيْت si referim për Qaben.
        reference: '22:29',
        surahNameAr: 'الحَجّ',
        surahNameAl: 'El-Haxhxh',
        arabic:
          'ثُمَّ لْيَقْضُوا تَفَثَهُمْ وَلْيُوفُوا نُذُورَهُمْ وَلْيَطَّوَّفُوا بِالْبَيْتِ الْعَتِيقِ',
        albanian:
          'Pastaj le t\'i plotësojnë ritet e tyre, le t\'i zbatojnë zotimet e tyre dhe le të bëjnë tavaf rreth Shtëpisë së vjetër.',
        knownWords: [
          {
            surface: 'وَلْيَطَّوَّفُوا',
            gloss: 'le të bëjnë tavaf (nga rrënja ط-و-ف, si طَافَ)',
          },
          { surface: 'بِالْبَيْتِ', gloss: 'Shtëpisë (Qabes, nga بَيْت)' },
        ],
      },
      {
        // El-Bekare 2:198 — ndalesa qendrore e Haxhit: "kur të zbritni
        // nga Arafati". عَرَفَات është fjalor kyç i kapitullit 14 —
        // vendi i mbledhjes së pelegrinëve ditën e Arafatit, shtylla
        // më e madhe e Haxhit. Asnjë Haxh nuk është i vlefshëm pa këtë
        // qëndrim.
        reference: '2:198',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'فَإِذَا أَفَضْتُم مِّنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِندَ الْمَشْعَرِ الْحَرَامِ',
        albanian:
          'E kur të zbritni nga Arafati, përmendeni Allahun pranë Mesh\'aril-Haramit (Muzdelifes).',
        knownWords: [
          {
            surface: 'عَرَفَاتٍ',
            gloss: 'Arafati (vendi i qëndrimit në Haxh)',
          },
        ],
      },
      {
        // El-Bekare 2:196 (vazhdim) — "atëherë (flijoni) çfarë të mundni
        // nga kurbani". الْهَدْي është kurbani që flijohet në Haxh — një
        // fjalë qendrore e kapitullit 14, pa të cilën rituali i Tamat·tu'
        // apo Kiranit nuk plotësohet.
        reference: '2:196',
        surahNameAr: 'البَقَرَة',
        surahNameAl: 'El-Bekare',
        arabic:
          'فَمَن تَمَتَّعَ بِالْعُمْرَةِ إِلَى الْحَجِّ فَمَا اسْتَيْسَرَ مِنَ الْهَدْيِ',
        albanian:
          'E kush e bashkon Umren me Haxhin, le të therë ç\'të mundë nga kurbani.',
        knownWords: [
          { surface: 'بِالْعُمْرَةِ', gloss: 'me Umren (nga عُمْرَة, Kap. 13)' },
          { surface: 'الْهَدْيِ', gloss: 'kurbani i Haxhit (nga هَدْي)' },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 15,
    titleAr: 'الصِّحَّة',
    titleAl: 'Shëndeti',
    titleEn: 'Health',
    dialogues: [
      {
        id: 'd15-1',
        albanian: 'Selamu alejkum, o doktor. Kam dhimbje koke dhe dhimbje gjoksi.',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ. عِنْدِي صُدَاعٌ وَأَلَمٌ فِي الصَّدْرِ.',
        transliteration: 'Es-selamu alejkum ve rahmetullahi ve berakatuh. Indi sudaun ve elemun fis-sadr.',
      },
      {
        id: 'd15-2',
        albanian: 'Që kur të ka zënë? A ke dhimbje dhëmbësh apo veshi?',
        arabic: 'مُنْذُ مَتَى أَصَابَكَ؟ هَلْ عِنْدَكَ أَلَمٌ فِي الأَسْنَانِ أَوِ الأُذُنِ؟',
        transliteration: 'Mundhu meta esabek? Hel indeke elemun fil esnani evil udhun?',
      },
      {
        id: 'd15-3',
        albanian: 'Prej dy ditësh. Gjithashtu kam temperaturë të lartë dhe dhimbje në fyt.',
        arabic: 'مُنْذُ يَوْمَيْنِ. وَعِنْدِي اِرْتِفَاعٌ فِي الْحَرَارَةِ وَأَلَمٌ فِي الْحَنْجَرَةِ.',
        transliteration: "Mundhu jewmejn. Ve indi irtifaun fil hararati ve elemun fil hanxhere.",
      },
      {
        id: 'd15-4',
        albanian: 'Le të bëjmë një ekzaminim të shpejtë dhe të presim rezultatin.',
        arabic: 'لِنَقُمْ بِفَحْصٍ سَرِيعٍ وَنَنْتَظِرِ النَّتِيجَةَ.',
        transliteration: "Linekum bi fehsin seri‘in ve nentezirin-netixhe.",
      },
      {
        id: 'd15-5',
        albanian: 'Ju këshilloj të hani perime, të pushoni dhe të pini pak kripë.',
        arabic: 'أَنْصَحُكَ بِأَكْلِ الْخُضْرَوَاتِ وَالرَّاحَةِ وَقِلَّةِ الْمِلْحِ.',
        transliteration: 'Ensahuke bi ekli el-khudraveti verr-raha ve kil-letil milh.',
      },
      {
        id: 'd15-6',
        albanian: 'Faleminderit. Do të caktoj një takim tjetër te dentisti për veshin.',
        arabic: 'شُكْراً. سَأَحْجِزُ مَوْعِداً آخَرَ عِنْدَ طَبِيبِ الأَسْنَانِ لِلأُذُنِ.',
        transliteration: "Shukren. Se ahxhizu mev‘iden akhare inde tabibi el-esnani lil udhun.",
      },
    ],
    vocabulary: [
      { id: 'v15-1', arabic: 'صِحَّة', albanian: 'Shëndet', root: 'ص-ح-ح', type: 'noun', gender: 'F' },
      { id: 'v15-2', arabic: 'طَبِيب', albanian: 'Mjek', root: 'ط-ب-ب', type: 'noun', gender: 'M', plural: 'أَطِبَّاء' },
      { id: 'v15-3', arabic: 'طَبِيبُ الأَسْنَان', albanian: 'Dentist', root: 'س-ن-ن', type: 'noun', gender: 'M' },
      { id: 'v15-4', arabic: 'مَوْعِد', albanian: 'Termin / Takim', root: 'و-ع-د', type: 'noun', gender: 'M', plural: 'مَوَاعِيد' },
      { id: 'v15-5', arabic: 'فَحْص', albanian: 'Ekzaminim', root: 'ف-ح-ص', type: 'noun', gender: 'M' },
      { id: 'v15-6', arabic: 'نَتِيجَة', albanian: 'Rezultat', root: 'ن-ت-ج', type: 'noun', gender: 'F', plural: 'نَتَائِج' },
      { id: 'v15-7', arabic: 'دَوَاء', albanian: 'Ilaç', root: 'د-و-ي', type: 'noun', gender: 'M', plural: 'أَدْوِيَة' },
      { id: 'v15-8', arabic: 'أَلَم', albanian: 'Dhimbje', root: 'أ-ل-م', type: 'noun', gender: 'M', plural: 'آلَام' },
      { id: 'v15-9', arabic: 'صُدَاع', albanian: 'Dhimbje koke', root: 'ص-د-ع', type: 'noun', gender: 'M' },
      { id: 'v15-10', arabic: 'صَدْر', albanian: 'Gjoks', root: 'ص-د-ر', type: 'noun', gender: 'M' },
      { id: 'v15-11', arabic: 'قَلْب', albanian: 'Zemër', root: 'ق-ل-ب', type: 'noun', gender: 'M', plural: 'قُلُوب' },
      { id: 'v15-12', arabic: 'أَسْنَان', albanian: 'Dhëmbë', root: 'س-ن-ن', type: 'noun', gender: 'F' },
      { id: 'v15-13', arabic: 'أُذُن', albanian: 'Vesh', root: 'أ-ذ-ن', type: 'noun', gender: 'F', plural: 'آذَان' },
      { id: 'v15-14', arabic: 'أَنْف', albanian: 'Hundë', root: 'أ-ن-ف', type: 'noun', gender: 'M' },
      { id: 'v15-15', arabic: 'حَنْجَرَة', albanian: 'Fyt / Grykë', root: 'ح-ن-ج-ر', type: 'noun', gender: 'F' },
      { id: 'v15-16', arabic: 'كُلْيَة', albanian: 'Veshkë', root: 'ك-ل-ي', type: 'noun', gender: 'F', plural: 'كُلَى' },
      { id: 'v15-17', arabic: 'ضَغْط', albanian: 'Tension / Presion', root: 'ض-غ-ط', type: 'noun', gender: 'M' },
      { id: 'v15-18', arabic: 'اِرْتِفَاع', albanian: 'Ngritje / e lartë', root: 'ر-ف-ع', type: 'noun', gender: 'M' },
      { id: 'v15-19', arabic: 'زِيَادَةُ الْوَزْن', albanian: 'Mbipeshë', root: 'ز-ي-د', type: 'noun', gender: 'F' },
      { id: 'v15-20', arabic: 'رَاحَة', albanian: 'Pushim / Qetësi', root: 'ر-و-ح', type: 'noun', gender: 'F' },
      { id: 'v15-21', arabic: 'خُضْرَوَات', albanian: 'Perime', root: 'خ-ض-ر', type: 'noun', gender: 'F' },
      { id: 'v15-22', arabic: 'مِلْح', albanian: 'Kripë', root: 'م-ل-ح', type: 'noun', gender: 'M' },
      { id: 'v15-23', arabic: 'مُمَارَسَة', albanian: 'Ushtrim / Praktikë', root: 'م-ر-س', type: 'noun', gender: 'F' },
      { id: 'v15-24', arabic: 'أَصَابَ', present: 'يُصِيبُ', imperative: 'أَصِبْ', albanian: 'E goditi (sëmundja)', root: 'ص-و-ب', type: 'verb' },
      { id: 'v15-25', arabic: 'فَحَصَ', present: 'يَفْحَصُ', imperative: 'اِفْحَصْ', albanian: 'Ekzaminoi', root: 'ف-ح-ص', type: 'verb' },
      { id: 'v15-26', arabic: 'نَصَحَ', present: 'يَنْصَحُ', imperative: 'اِنْصَحْ', albanian: 'Këshilloi', root: 'ن-ص-ح', type: 'verb' },
      { id: 'v15-27', arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', albanian: 'Paqja, mëshira dhe begatia e Allahut qofshin mbi ju', root: 'س-ل-م', type: 'particle' },
      { id: 'v15-28', arabic: 'اِرْتَفَعَ', albanian: 'U ngrit', root: 'ر-ف-ع', type: 'verb', present: 'يَرْتَفِعُ', imperative: 'اِرْتَفِعْ' },
      { id: 'v15-29', arabic: 'تَغَيَّبَ', albanian: 'Mungoi', root: 'غ-ي-ب', type: 'verb', present: 'يَتَغَيَّبُ', imperative: 'تَغَيَّبْ' },
      { id: 'v15-30', arabic: 'شَفَى', albanian: 'Shëroi', root: 'ش-ف-ي', type: 'verb', present: 'يَشْفِي', imperative: 'اِشْفِ' },
      { id: 'v15-31', arabic: 'قَابَلَ', albanian: 'Takoi', root: 'ق-ب-ل', type: 'verb', present: 'يُقَابِلُ', imperative: 'قَابِلْ' },
      { id: 'v15-32', arabic: 'سِنّ', albanian: 'Dhëmb', root: 'س-ن-ن', type: 'noun', gender: 'M', plural: 'أَسْنَان' },
      { id: 'v15-33', arabic: 'زِيَارَة', albanian: 'Vizitë', root: 'ز-و-ر', type: 'noun', gender: 'F', plural: 'زِيَارَات' },
      { id: 'v15-34', arabic: 'إِسْعَاف', albanian: 'Ndihmë e parë', root: 'س-ع-ف', type: 'noun', gender: 'M', plural: 'إِسْعَافَات' },
    ],
    grammarFocus: [
      'Pyetja mundi i kohës مُنْذُ مَتَى؟ + Madi — që kur?',
      'Numri dual jewmejn/ usbu‘ajn — prej dy ditësh / dy javësh',
      'Forma أَنْصَحُكَ بِ + emër — “të këshilloj për …”',
      'Lidhëza urdhërore لِـ + mudari‘ mexhzum: لِنَقُمْ (le të bëjmë)',
    ],
    exercises: [
      {
        id: 'ex15-1',
        type: 'transform',
        prompt: 'Ndërto pyetje: "Që kur të ka zënë?"',
        source: { arabic: 'أَصَابَكَ', albanian: 'të ka zënë' },
        answer: 'مُنْذُ مَتَى أَصَابَكَ؟',
        hint: 'مُنْذُ مَتَى + Madi për kohëzgjatje.',
        grammarPoint: 'مُنْذُ مَتَى؟',
      },
      {
        id: 'ex15-2',
        type: 'transform',
        prompt: 'Shkruaj dualin kohor: "prej dy ditësh"',
        source: { arabic: 'يَوْم', albanian: 'ditë' },
        answer: 'مُنْذُ يَوْمَيْنِ',
        hint: 'Dualis gjenitiv: ـَيْنِ (yawmayn).',
        grammarPoint: 'Dual kohor',
      },
      {
        id: 'ex15-3',
        type: 'transform',
        prompt: 'Shkruaj dualin kohor: "prej dy javësh"',
        source: { arabic: 'أُسْبُوع', albanian: 'javë' },
        answer: 'مُنْذُ أُسْبُوعَيْنِ',
        hint: 'ـَيْنِ për dualin gjenitiv pas مُنْذُ.',
        grammarPoint: 'Dual kohor',
      },
      {
        id: 'ex15-4',
        type: 'transform',
        prompt: 'Ndërto: "të këshilloj për pushim"',
        source: { arabic: 'الرَّاحَة', albanian: 'pushimi' },
        answer: 'أَنْصَحُكَ بِالرَّاحَةِ',
        hint: 'أَنْصَحُ + ـكَ + بِـ + emër i shquar në kesra.',
        grammarPoint: 'أَنْصَحُكَ بِ',
      },
      {
        id: 'ex15-5',
        type: 'transform',
        prompt: 'Ndërto urdhërore me لِـ: "le të ngrihemi"',
        source: { arabic: 'نَقُومُ', albanian: 'ngrihemi' },
        answer: 'لِنَقُمْ',
        hint: 'لِـ + mudari mexhzum: نَقُومُ → نَقُمْ (sukun, shkurtohet).',
        grammarPoint: 'Mexhzum me لِـ',
      },
      {
        id: 'ex15-6',
        type: 'transform',
        prompt: 'Ndërto: "të këshilloj për ngrënie perimesh"',
        source: { arabic: 'أَكْل + الخُضْرَوَات', albanian: 'ngrënie + perime' },
        answer: 'أَنْصَحُكَ بِأَكْلِ الخُضْرَوَاتِ',
        hint: 'بِـ + idafë: أَكْلِ (kesra pa AL) + الخُضْرَوَاتِ (kesra).',
        grammarPoint: 'أَنْصَحُكَ بِ',
      },
    ],
    stories: [
      {
        id: 's15-1',
        titleAl: 'Musa te mjeku',
        albanian:
          'Prej dy ditësh Musa ndjen dhimbje koke dhe dhimbje në gjoks. Sot shkoi te mjeku dhe i tha: "Selamu alejkum." Mjeku e pyeti që kur i kishte nisur dhimbja, a kishte dhimbje dhëmbësh apo veshi, dhe a ishte rritur temperatura. Bëri një ekzaminim të shpejtë dhe pas pak erdhi rezultati: tensioni ishte pak i lartë dhe pesha e tepërt. Mjeku i tha të pushojë, të hajë perime dhe pak kripë, dhe të ushtrohet çdo ditë. Musa i caktoi edhe një takim te dentisti për një dhimbje të lehtë në dhëmballë. Kur doli nga klinika, falënderoi Allahun për shëndetin.',
        arabic:
          'مُنْذُ يَوْمَيْنِ يَشْعُرُ مُوسَى بِصُدَاعٍ وَأَلَمٍ فِي الصَّدْرِ. الْيَوْمَ ذَهَبَ إِلَى الطَّبِيبِ وَقَالَ: «السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ». سَأَلَهُ الطَّبِيبُ: مُنْذُ مَتَى أَصَابَكَ الأَلَمُ؟ هَلْ عِنْدَكَ وَجَعٌ فِي الأَسْنَانِ أَوِ الأُذُنِ؟ وَهَلِ اِرْتَفَعَتِ الْحَرَارَةُ؟ فَحَصَهُ فَحْصاً سَرِيعاً، وَبَعْدَ قَلِيلٍ جَاءَتِ النَّتِيجَةُ: الضَّغْطُ مُرْتَفِعٌ قَلِيلاً وَعِنْدَهُ زِيَادَةٌ فِي الْوَزْنِ. نَصَحَهُ الطَّبِيبُ بِالرَّاحَةِ وَأَكْلِ الْخُضْرَوَاتِ وَقِلَّةِ الْمِلْحِ وَمُمَارَسَةِ الرِّيَاضَةِ كُلَّ يَوْمٍ. وَحَجَزَ مُوسَى مَوْعِداً آخَرَ عِنْدَ طَبِيبِ الأَسْنَانِ لِأَلَمٍ خَفِيفٍ فِي ضِرْسِهِ. وَلَمَّا خَرَجَ مِنَ الْعِيَادَةِ حَمِدَ اللَّهَ عَلَى الصِّحَّةِ.',
        transliteration:
          "Mundhu jewmejn jesh‘uru Musa bi sudain ve elemin fis-sadr. El-jewme dhehebe ilet-tabibi ve kale: «Es-selamu alejkum ve rahmetullahi ve berakatuh». Seelehut-tabib: Mundhu meta esabekel elem? Hel indeke vexhaun fil esnani evil udhun? Ve helirtefe‘atil harara? Fehasahu fehsan seri‘an, ve ba‘de kalilin xha‘etin-netixhe: Ed-daghtu murtefi‘un kalilen ve indehu zijadetun fil vezn. Nesahahut-tabibu bir-rahati ve ekli el-khudraveti ve kil-letil milhi ve mumareseti er-rijada kul-le jewm. Ve haxheze Musa mev‘iden akhare inde tabibi el-esnani li elemin khafifin fi dirsihi. Ve lemma kharexhe minel ‘ijade hamidallahe ales-sihha.",
      },
    ],
    ayat: [
      {
        // Esh-Shuara 26:80 — nga duatë e Ibrahimit (a.s.): "E kur jam
        // i sëmurë, Ai më shëron". Fjalë nga Kap. 1 (هُوَ) bashkohet
        // me konceptin kryesor të Kapitullit 15 — sëmundja dhe shërimi.
        // Një ajet që çdo besimtar e reciton në raste dobësie trupore.
        reference: '26:80',
        surahNameAr: 'الشُّعَرَاء',
        surahNameAl: 'Esh-Shuara',
        arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ',
        albanian: 'E kur sëmurem, Ai (Allahu) më shëron.',
        knownWords: [
          { surface: 'فَهُوَ', gloss: 'atëherë Ai (nga هُوَ)' },
        ],
      },
      {
        // Err-Ra‘d 13:28 — qetësia e zemrave me përmendjen e Allahut.
        // قُلُوبُهُم dhe الْقُلُوبُ janë shumës i قَلْب (Kap. 15). Zemra
        // si organ dhe zemra si vendi i qetësisë shpirtërore bashkohen
        // në këtë varg.
        reference: '13:28',
        surahNameAr: 'الرَّعْد',
        surahNameAl: 'Err-Ra‘d',
        arabic:
          'الَّذِينَ آمَنُوا وَتَطْمَئِنُّ قُلُوبُهُم بِذِكْرِ اللَّهِ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
        albanian:
          'Ata që besuan dhe zemrat e tyre qetësohen me përmendjen e Allahut — vërtet, me përmendjen e Allahut qetësohen zemrat.',
        knownWords: [
          { surface: 'قُلُوبُهُم', gloss: 'zemrat e tyre (shumësi i قَلْب)' },
          { surface: 'الْقُلُوبُ', gloss: 'zemrat (shumësi i قَلْب)' },
        ],
      },
      {
        // En-Nahl 16:69 — bleta dhe mjalti: "del nga barku i tyre
        // pije me ngjyra të ndryshme, në të ka shërim për njerëzit".
        // شَرَاب (Kap. 5) puqet me konceptin e shërimit — ushqimi dhe
        // shëndeti lidhen së bashku në mrekullinë e bletës.
        reference: '16:69',
        surahNameAr: 'النَّحْل',
        surahNameAl: 'En-Nahl',
        arabic:
          'يَخْرُجُ مِن بُطُونِهَا شَرَابٌ مُّخْتَلِفٌ أَلْوَانُهُ فِيهِ شِفَاءٌ لِّلنَّاسِ إِنَّ فِي ذَٰلِكَ لَآيَةً لِّقَوْمٍ يَتَفَكَّرُونَ',
        albanian:
          'Nga barku i tyre (bletëve) del një pije me ngjyra të ndryshme, në të cilën ka shërim për njerëzit. Vërtet në këtë ka shenjë për njerëz që mendojnë.',
        knownWords: [
          { surface: 'شَرَابٌ', gloss: 'pije (nga شَرَاب)' },
          {
            surface: 'شِفَاءٌ',
            gloss: 'shërim (fjalë kryesore e shëndetit)',
          },
        ],
      },
      {
        // El-Beled 90:8-9 — mrekullitë e vogla të trupit të njeriut që
        // janë pjesë e dhuratave të Allahut: "A nuk i bëmë Ne atij dy
        // sy, dhe një gjuhë e dy buzë?". عَيْنَيْنِ (dy sytë, dyfishi i
        // عَيْن — v15) dhe شَفَتَيْنِ (dy buzët, dyfishi i شَفَة — v15)
        // lidhen me fjalorin e organeve të trupit.
        reference: '90:8',
        surahNameAr: 'البَلَد',
        surahNameAl: 'El-Beled',
        arabic: 'أَلَمْ نَجْعَل لَّهُ عَيْنَيْنِ ۝ وَلِسَانًا وَشَفَتَيْنِ',
        albanian:
          'A nuk i bëmë Ne atij dy sy, dhe një gjuhë dhe dy buzë?',
        knownWords: [
          {
            surface: 'عَيْنَيْنِ',
            gloss: 'dy sy (dyfishi i عَيْن)',
          },
          {
            surface: 'وَشَفَتَيْنِ',
            gloss: 'dhe dy buzë (dyfishi i شَفَة)',
          },
        ],
      },
      {
        // El-Maide 5:6 — ajeti i abdesit: fytyrat, duart, kokat, këmbët.
        // Katër organe të trupit në një varg — direkt fjalori i
        // kapitullit 15: وَجْه, يَد, رَأْس, رِجْل. Shëndeti dhe namazi
        // takohen: pastrimi i trupit si përgatitje për takimin me Zotin.
        reference: '5:6',
        surahNameAr: 'المَائِدَة',
        surahNameAl: 'El-Maide',
        arabic:
          'فَاغْسِلُوا وُجُوهَكُمْ وَأَيْدِيَكُمْ إِلَى الْمَرَافِقِ وَامْسَحُوا بِرُءُوسِكُمْ وَأَرْجُلَكُمْ إِلَى الْكَعْبَيْنِ',
        albanian:
          'Lani fytyrat tuaja dhe duart tuaja deri te bërrylat, fshini kokat tuaja dhe lani këmbët tuaja deri te nyjet.',
        knownWords: [
          {
            surface: 'وُجُوهَكُمْ',
            gloss: 'fytyrat tuaja (shumësi i وَجْه)',
          },
          {
            surface: 'وَأَيْدِيَكُمْ',
            gloss: 'dhe duart tuaja (shumësi i يَد)',
          },
          {
            surface: 'بِرُءُوسِكُمْ',
            gloss: 'kokat tuaja (shumësi i رَأْس)',
          },
          {
            surface: 'وَأَرْجُلَكُمْ',
            gloss: 'dhe këmbët tuaja (shumësi i رِجْل)',
          },
        ],
      },
    ],
  },

  // ────────────────────────────────────────────────────────────
  {
    id: 16,
    titleAr: 'الأَعْيَادُ وَالتَّقْوِيم',
    titleAl: 'Festat dhe Kalendari',
    titleEn: 'Holidays & Calendar',
    dialogues: [
      {
        id: 'd16-1',
        albanian: 'Gëzuar Festën! Kur falet Namazi i Bajramit?',
        arabic: 'عِيدٌ مُبَارَكٌ! مَتَى تُقَامُ صَلَاةُ الْعِيدِ؟',
        transliteration: "Idun mubarek! Meta tukamu salatul ‘id?",
      },
      {
        id: 'd16-2',
        albanian: 'Pas lindjes së diellit, në ditën e Bajramit.',
        arabic: 'بَعْدَ شُرُوقِ الشَّمْسِ، فِي يَوْمِ الْعِيدِ.',
        transliteration: "Ba‘de shurukish-shemsi, fi jewmil ‘id.",
      },
      {
        id: 'd16-3',
        albanian: 'Sot është Fitër Bajrami; a e dhe Zekatul Fitrin?',
        arabic: 'الْيَوْمَ عِيدُ الْفِطْرِ؛ هَلْ أَخْرَجْتَ زَكَاةَ الْفِطْرِ؟',
        transliteration: "El-jewme idul fitr; hel ekhraxhte zekatel fitr?",
      },
      {
        id: 'd16-4',
        albanian: 'Po, një sa grurë para Namazit. Në Kurban Bajram do të presim kurbanin.',
        arabic: 'نَعَمْ، صَاعاً مِنَ الْقَمْحِ قَبْلَ الصَّلَاةِ. فِي عِيدِ الأَضْحَى سَنَذْبَحُ الأُضْحِيَةَ.',
        transliteration: "Na‘am, sa‘an minel kamhi kablas-sala. Fi idil ad-ha senedhbehul ud-hije.",
      },
      {
        id: 'd16-5',
        albanian: 'Muajt hixhri janë dymbëdhjetë: Muharrem, Sefer, Rebiul Evvel…',
        arabic: 'الأَشْهُرُ الْهِجْرِيَّةُ اِثْنَا عَشَرَ: الْمُحَرَّم، صَفَر، رَبِيعٌ الأَوَّل…',
        transliteration: "El-eshhurul hixhrijjetu ithna ashar: el-muharrem, safer, rebiu el-evvel…",
      },
      {
        id: 'd16-6',
        albanian: 'Pushimet e Bajramit do t’i kaloj te gjyshi: do shkoj në fermë, pranë lumit Nil.',
        arabic: 'سَأَقْضِي الْعُطْلَةَ عِنْدَ جَدِّي: سَأَذْهَبُ إِلَى الْمَزْرَعَةِ قُرْبَ نَهْرِ النِّيل.',
        transliteration: "Se ekdil utlete inde xheddi: Seedhhebu ilel mezra‘ati kurbe nehri en-Nil.",
      },
    ],
    vocabulary: [
      { id: 'v16-1', arabic: 'عِيد', albanian: 'Festë / Bajram', root: 'ع-و-د', type: 'noun', gender: 'M', plural: 'أَعْيَاد' },
      { id: 'v16-2', arabic: 'عِيدُ الْفِطْر', albanian: 'Fitër Bajrami', root: 'ف-ط-ر', type: 'noun', gender: 'M' },
      { id: 'v16-3', arabic: 'عِيدُ الأَضْحَى', albanian: 'Kurban Bajrami', root: 'ض-ح-و', type: 'noun', gender: 'M' },
      { id: 'v16-4', arabic: 'صَلَاةُ الْعِيد', albanian: 'Namazi i Bajramit', root: 'ص-ل-و', type: 'noun', gender: 'F' },
      { id: 'v16-5', arabic: 'يَوْمُ الْعِيد', albanian: 'Dita e Bajramit', root: 'ي-و-م', type: 'noun', gender: 'M' },
      { id: 'v16-6', arabic: 'زَكَاةُ الْفِطْر', albanian: 'Zekatul Fitri', root: 'ز-ك-و', type: 'noun', gender: 'F' },
      { id: 'v16-7', arabic: 'صَاع', albanian: 'Sa‘ (masë)', root: 'ص-و-ع', type: 'noun', gender: 'M' },
      { id: 'v16-8', arabic: 'أُضْحِيَة', albanian: 'Kurbani (fli)', root: 'ض-ح-و', type: 'noun', gender: 'F' },
      { id: 'v16-9', arabic: 'حَجّ', albanian: 'Haxhi', root: 'ح-ج-ج', type: 'noun', gender: 'M' },
      { id: 'v16-10', arabic: 'إِسْلَام', albanian: 'Islami', root: 'س-ل-م', type: 'noun', gender: 'M' },
      { id: 'v16-11', arabic: 'الْمُحَرَّم', albanian: 'Muharrem (1)', root: 'ح-ر-م', type: 'noun', gender: 'M' },
      { id: 'v16-12', arabic: 'صَفَر', albanian: 'Sefer (2)', root: 'ص-ف-ر', type: 'noun', gender: 'M' },
      { id: 'v16-13', arabic: 'رَبِيعٌ الأَوَّل', albanian: 'Rebiul Evvel (3)', root: 'ر-ب-ع', type: 'noun', gender: 'M' },
      { id: 'v16-14', arabic: 'رَبِيعٌ الآخِر', albanian: 'Rebiul Ahir (4)', root: 'ر-ب-ع', type: 'noun', gender: 'M' },
      { id: 'v16-15', arabic: 'جُمَادَى الأُولَى', albanian: 'Xhumadel Ula (5)', root: 'ج-م-د', type: 'noun', gender: 'F' },
      { id: 'v16-16', arabic: 'جُمَادَى الآخِرَة', albanian: 'Xhumadel Ahire (6)', root: 'ج-م-د', type: 'noun', gender: 'F' },
      { id: 'v16-17', arabic: 'رَجَب', albanian: 'Rexheb (7)', root: 'ر-ج-ب', type: 'noun', gender: 'M' },
      { id: 'v16-18', arabic: 'شَعْبَان', albanian: 'Shaban (8)', root: 'ش-ع-ب', type: 'noun', gender: 'M' },
      { id: 'v16-19', arabic: 'رَمَضَان', albanian: 'Ramazan (9)', root: 'ر-م-ض', type: 'noun', gender: 'M' },
      { id: 'v16-20', arabic: 'شَوَّال', albanian: 'Shewal (10)', root: 'ش-و-ل', type: 'noun', gender: 'M' },
      { id: 'v16-21', arabic: 'ذُو الْقَعْدَة', albanian: 'Dhul Ka‘de (11)', root: 'ق-ع-د', type: 'noun', gender: 'M' },
      { id: 'v16-22', arabic: 'ذُو الْحِجَّة', albanian: 'Dhul Hixhxhe (12)', root: 'ح-ج-ج', type: 'noun', gender: 'M' },
      { id: 'v16-23', arabic: 'عَاصِمَة', albanian: 'Kryeqytet', root: 'ع-ص-م', type: 'noun', gender: 'F', plural: 'عَوَاصِم' },
      { id: 'v16-24', arabic: 'مَتْحَف', albanian: 'Muze', root: 'ت-ح-ف', type: 'noun', gender: 'M', plural: 'مَتَاحِف' },
      { id: 'v16-25', arabic: 'مَزْرَعَة', albanian: 'Fermë', root: 'ز-ر-ع', type: 'noun', gender: 'F', plural: 'مَزَارِع' },
      { id: 'v16-26', arabic: 'نَهْرُ النِّيل', albanian: 'Lumi Nil', root: 'ن-ه-ر', type: 'noun', gender: 'M' },
      { id: 'v16-27', arabic: 'جَبَل', albanian: 'Mal', root: 'ج-ب-ل', type: 'noun', gender: 'M', plural: 'جِبَال' },
      { id: 'v16-28', arabic: 'بَحْر', albanian: 'Det', root: 'ب-ح-ر', type: 'noun', gender: 'M', plural: 'بِحَار' },
      { id: 'v16-29', arabic: 'أَعْطَى', albanian: 'Dha', root: 'ع-ط-ي', type: 'verb', present: 'يُعْطِي', imperative: 'أَعْطِ' },
      { id: 'v16-30', arabic: 'اِقْتَرَبَ', albanian: 'U afrua', root: 'ق-ر-ب', type: 'verb', present: 'يَقْتَرِبُ', imperative: 'اِقْتَرِبْ' },
      { id: 'v16-31', arabic: 'اِبْتَعَدَ', albanian: 'U largua', root: 'ب-ع-د', type: 'verb', present: 'يَبْتَعِدُ', imperative: 'اِبْتَعِدْ' },
      { id: 'v16-32', arabic: 'سَاعَدَ', albanian: 'Ndihmoi', root: 'س-ع-د', type: 'verb', present: 'يُسَاعِدُ', imperative: 'سَاعِدْ' },
      { id: 'v16-33', arabic: 'رَأَى', albanian: 'Pa', root: 'ر-أ-ي', type: 'verb', present: 'يَرَى', imperative: 'رَ' },
      { id: 'v16-34', arabic: 'نَهْر', albanian: 'Lumë', root: 'ن-ه-ر', type: 'noun', gender: 'M', plural: 'أَنْهَار' },
      { id: 'v16-35', arabic: 'فَرِيق', albanian: 'Ekip/Skuadër', root: 'ف-ر-ق', type: 'noun', gender: 'M', plural: 'فُرَق' },
      { id: 'v16-36', arabic: 'فَقِير', albanian: 'I varfër', root: 'ف-ق-ر', type: 'adjective', gender: 'M' },
    ],
    grammarFocus: [
      'Numërimi i muajve hixhri — اِثْنَا عَشَرَ شَهْراً',
      'Folja e ardhme سَـ + mudari‘: سَأَقْضِي, سَنَذْبَحُ',
      'Idafa me emra kompozit: زَكَاةُ الْفِطْرِ, نَهْرُ النِّيلِ, صَلَاةُ الْعِيدِ',
      'Rasti pasues (mudaf ilejhi) pas emri të përbërë',
    ],
    exercises: [
      {
        id: 'ex16-1',
        type: 'transform',
        prompt: 'Numëro muajt: "dymbëdhjetë muaj"',
        source: { arabic: 'شَهْر + 12', albanian: 'muaj + 12' },
        answer: 'اِثْنَا عَشَرَ شَهْراً',
        hint: 'Tëmjizi pas 12 është njëjës me tenvin fetha.',
        grammarPoint: 'Muajt',
      },
      {
        id: 'ex16-2',
        type: 'transform',
        prompt: 'Shto سَـ: "do të kaloj pushimet"',
        source: { arabic: 'أَقْضِي العُطْلَةَ.', albanian: 'kaloj pushimet' },
        answer: 'سَأَقْضِي العُطْلَةَ.',
        hint: 'سَـ ngjitet me أَقْضِي; folja ruan formën.',
        grammarPoint: 'E ardhme سَـ',
      },
      {
        id: 'ex16-3',
        type: 'transform',
        prompt: 'Ndërto idafën: "Zekatul Fitri"',
        source: { arabic: 'زَكَاة + الفِطْر', albanian: 'zekati + fitri' },
        answer: 'زَكَاةُ الفِطْرِ',
        hint: 'Mudaf me damme pa tenvin; mudaf ilejhi në kesra.',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex16-4',
        type: 'transform',
        prompt: 'Ndërto idafën: "lumi Nil"',
        source: { arabic: 'نَهْر + النِّيل', albanian: 'lum + Nil' },
        answer: 'نَهْرُ النِّيلِ',
        hint: 'Emër kompozit si idafë: نَهْرُ (damme) + النِّيلِ (kesra).',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex16-5',
        type: 'transform',
        prompt: 'Ndërto idafën: "Namazi i Bajramit"',
        source: { arabic: 'صَلَاة + العِيد', albanian: 'namazi + Bajrami' },
        answer: 'صَلَاةُ العِيدِ',
        hint: 'ة mbetet (nuk bëhet ت sepse pasohet nga emër me AL).',
        grammarPoint: 'Idafa',
      },
      {
        id: 'ex16-6',
        type: 'transform',
        prompt: 'Shto سَـ: "do të presim kurbanin"',
        source: { arabic: 'نَذْبَحُ الأُضْحِيَةَ.', albanian: 'presim kurbanin' },
        answer: 'سَنَذْبَحُ الأُضْحِيَةَ.',
        hint: 'سَـ + mudari veta I shumës (نَذْبَحُ).',
        grammarPoint: 'E ardhme سَـ',
      },
    ],
    stories: [
      {
        id: 's16-1',
        titleAl: 'Bajrami i Musait',
        albanian:
          'Kur vjen dita e Fitër Bajramit, Musa zgjohet herët, lahet mirë dhe vesh rrobat më të bukura. Babai e nxjerr zekatul-fitrin — një sa grurë për çdo anëtar të familjes — para Namazit të Bajramit. Pastaj shkojnë të gjithë në xhami për Namazin e Bajramit dhe pas hytbes i urojnë njëri-tjetrit: «Taqabbalallahu minna ve minkum». Në Kurban Bajram babai pret kurbanin dhe e ndan mishin për familjen, komshinjtë dhe të varfrit. Pushimin e Bajramit e kalojnë në fermën e gjyshit pranë lumit — shohin malet, detin e largët dhe vizitojnë edhe një muze në kryeqytet. Muajt hixhri janë dymbëdhjetë: Muharrem, Sefer, Rebiul Evvel, Rebiul Ahir, Xhumadel Ula, Xhumadel Ahire, Rexheb, Shaban, Ramazan, Shewal, Dhul Ka‘de dhe Dhul Hixhxhe — muaji i Haxhit.',
        arabic:
          'حِينَ يَأْتِي يَوْمُ عِيدِ الْفِطْرِ، يَسْتَيْقِظُ مُوسَى مُبَكِّراً وَيَغْتَسِلُ وَيَلْبَسُ أَجْمَلَ الثِّيَابِ. يُخْرِجُ أَبُوهُ زَكَاةَ الْفِطْرِ — صَاعاً مِنَ الْقَمْحِ عَنْ كُلِّ فَرْدٍ مِنَ الأُسْرَةِ — قَبْلَ صَلَاةِ الْعِيدِ. ثُمَّ يَذْهَبُونَ جَمِيعاً إِلَى الْمَسْجِدِ لِصَلَاةِ الْعِيدِ، وَبَعْدَ الْخُطْبَةِ يُبَارِكُونَ لِبَعْضِهِمُ الْبَعْضَ: «تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ». وَفِي عِيدِ الأَضْحَى يَذْبَحُ الأَبُ الأُضْحِيَةَ وَيَقْسِمُ اللَّحْمَ لِلْأُسْرَةِ وَالْجِيرَانِ وَالْفُقَرَاءِ. يَقْضُونَ عُطْلَةَ الْعِيدِ فِي مَزْرَعَةِ الْجَدِّ قُرْبَ النَّهْرِ، يَرَوْنَ الْجِبَالَ وَالْبَحْرَ الْبَعِيدَ، وَيَزُورُونَ مَتْحَفاً فِي الْعَاصِمَةِ. وَالأَشْهُرُ الْهِجْرِيَّةُ اِثْنَا عَشَرَ شَهْراً: الْمُحَرَّم، صَفَر، رَبِيعٌ الأَوَّل، رَبِيعٌ الآخِر، جُمَادَى الأُولَى، جُمَادَى الآخِرَة، رَجَب، شَعْبَان، رَمَضَان، شَوَّال، ذُو الْقَعْدَة، وَذُو الْحِجَّة — شَهْرُ الْحَجِّ.',
        transliteration:
          "Hine jeetij jewmu idil fitr, jestejkizu Musa mubekkiren ve jagtesilu ve jelbesu exhmelath-thijab. Juhrixhu ebuhu zekatel fitri — sa‘an minel kamhi an kul-li ferdin minel usre — kable salatil ‘id. Thumme jedhhebune xhemian ilel mesxhidi li salatil ‘id, ve ba‘delkhutbeti jubarikune li ba‘dihimul ba‘d: «Tekabbelallahu minna ve minkum». Ve fi idil ad-ha jedhbehul ebul ud-hijete ve jaksimul lahme lil usre vel xhirani vel fukara. Jakdune utletel idi fi mezra‘atil xheddi kurben nehr, jerewnel xhibale vel bahrel ba‘id, ve jezurune methafen fil asime. Vel eshhurul hixhrijjetu ithna ashare shehra: el-muharrem, safer, rebi‘ul evvel, rebi‘ul ahir, xhumadel ula, xhumadel ahire, rexheb, sha‘ban, ramadan, shevval, dhul ka‘de, ve dhul hixhxhe — shehrul haxhxh.",
      },
    ],
    ayat: [
      {
        // Et-Teube 9:36 — vargu themelor i kalendarit islamik: "numri i
        // muajve tek Allahu janë dymbëdhjetë muaj". Tri fjalë kryesore të
        // Kapitullit 16: الشُّهُور, شَهْراً dhe اثْنَا عَشَر. Kjo është
        // baza hyjnore e kalendarit që Musai rendit në tregim.
        reference: '9:36',
        surahNameAr: 'التَّوْبَة',
        surahNameAl: 'Et-Teube',
        arabic:
          'إِنَّ عِدَّةَ الشُّهُورِ عِندَ اللَّهِ اثْنَا عَشَرَ شَهْرًا فِي كِتَابِ اللَّهِ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالْأَرْضَ مِنْهَا أَرْبَعَةٌ حُرُمٌ',
        albanian:
          'Vërtet, numri i muajve tek Allahu është dymbëdhjetë muaj në Librin e Allahut, që nga dita që i krijoi qiejt dhe tokën — katër prej tyre janë të shenjtë.',
        knownWords: [
          {
            surface: 'الشُّهُورِ',
            gloss: 'muajve (shumësi i شَهْر)',
          },
          {
            surface: 'اثْنَا عَشَرَ',
            gloss: 'dymbëdhjetë (nga fjalori i kalendarit)',
          },
          { surface: 'شَهْرًا', gloss: 'muaj (nga شَهْر)' },
        ],
      },
      {
        // El-Maide 5:114 — duaja e Isait (a.s.): "O Zoti ynë, na zbrit
        // një sofër nga qielli, që të jetë festë për të parin e të
        // fundit tonë". Fjala عِيد shfaqet drejt në trajtën e pashquar,
        // kuranore — vetë fjala qendrore e Kapitullit 16, e huazuar nga
        // lutja e një pejgamberi para Muhammedit (s.a.v.s).
        reference: '5:114',
        surahNameAr: 'المَائِدَة',
        surahNameAl: 'El-Maide',
        arabic:
          'قَالَ عِيسَى ابْنُ مَرْيَمَ اللَّهُمَّ رَبَّنَا أَنزِلْ عَلَيْنَا مَائِدَةً مِّنَ السَّمَاءِ تَكُونُ لَنَا عِيدًا لِّأَوَّلِنَا وَآخِرِنَا',
        albanian:
          'Isai, i biri i Merjemes, tha: O Allah, Zoti ynë, na zbrit një sofër nga qielli, që të jetë festë për të parin dhe për të fundin tonë.',
        knownWords: [
          { surface: 'عِيدًا', gloss: 'festë (nga عِيد)' },
        ],
      },
      {
        // El-Keuther 108:2 — ajeti më i shkurtër që lidh namazin dhe
        // therrjen e kurbanit: "pra falu për Zotin tënd dhe ther
        // kurban". وَانْحَرْ (nga n-h-r) është rrënja e الأَضْحَى — rituali
        // kryesor i عِيدُ الأَضْحَى (v16-3), kur babai i Musait pret
        // kurbanin.
        reference: '108:2',
        surahNameAr: 'الكَوْثَر',
        surahNameAl: 'El-Keuther',
        arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ',
        albanian:
          'Pra falu për Zotin tënd dhe ther kurban.',
        knownWords: [
          {
            surface: 'وَانْحَرْ',
            gloss: 'dhe ther kurban (rituali i عِيدُ الأَضْحَى)',
          },
        ],
      },
      {
        // El-Maide 5:3 — pasazhi i njohur i "plotësimit të fesë": "sot
        // jua plotësova fenë tuaj… dhe zgjodha për ju Islamin fe".
        // الْإِسْلَام (v16-10) është fjala-identitet e kapitullit, dhe ky
        // varg u shpall në Haxhin e Lamtumirës — ditën e Arafatit,
        // ditën më të madhe të kalendarit islamik.
        reference: '5:3',
        surahNameAr: 'المَائِدَة',
        surahNameAl: 'El-Maide',
        arabic:
          'الْيَوْمَ أَكْمَلْتُ لَكُمْ دِينَكُمْ وَأَتْمَمْتُ عَلَيْكُمْ نِعْمَتِي وَرَضِيتُ لَكُمُ الْإِسْلَامَ دِينًا',
        albanian:
          'Sot jua plotësova fenë tuaj, e përsosa mirësinë Time mbi ju dhe zgjodha për ju Islamin fe.',
        knownWords: [
          { surface: 'الْإِسْلَامَ', gloss: 'Islamin (nga إِسْلَام)' },
        ],
      },
      {
        // Err-Ra‘d 13:3 — Allahu që i ka shtrirë tokën dhe ka bërë "male
        // të palëvizshme dhe lumenj". أَنْهَار (shumësi i نَهْر) lidh
        // drejtpërdrejt me فِی مَزْرَعَةِ الْجَدِّ قُرْبَ النَّهْرِ të
        // tregimit — pushimi i Bajramit në fermë pranë lumit është
        // ecje mes shenjave të Allahut.
        reference: '13:3',
        surahNameAr: 'الرَّعْد',
        surahNameAl: 'Err-Ra‘d',
        arabic:
          'وَهُوَ الَّذِي مَدَّ الْأَرْضَ وَجَعَلَ فِيهَا رَوَاسِيَ وَأَنْهَارًا',
        albanian:
          'Ai është që e ka shtrirë tokën dhe ka vendosur në të male të palëvizshme dhe lumenj.',
        knownWords: [
          {
            surface: 'وَأَنْهَارًا',
            gloss: 'dhe lumenj (shumësi i نَهْر, si نَهْرُ النِّيل)',
          },
        ],
      },
    ],
  },
];

export const getChapter = (id: number): Chapter | undefined =>
  CHAPTERS.find((c) => c.id === id);
