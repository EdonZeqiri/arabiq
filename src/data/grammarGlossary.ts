// Glossary of Arabic grammar terms that appear in chapter "grammarFocus"
// bullets. The aim is pedagogical — a student who lands on "Idafa" or
// "muthenna" without context should be able to tap an info icon and
// get a plain-Albanian explanation in 1-3 sentences.
//
// Matching: each entry carries a list of `aliases`. A bullet is scanned
// case-insensitively for any alias; aliases written in Arabic are
// matched literally. The first occurrence wins — duplicates in one
// bullet do not produce duplicate cards.

export interface GlossaryTerm {
  // Unique id used as a React key and for de-duplication.
  id: string;
  // All spellings that should trigger this entry. Include common
  // Albanian variants (dualë, muthenna) plus Arabic term where useful.
  aliases: string[];
  // Canonical label shown in the popover header.
  label: string;
  // 1-3 sentence Albanian explanation.
  explanation: string;
  // Optional quick example.
  example?: { arabic: string; albanian: string };
}

export const GRAMMAR_GLOSSARY: GlossaryTerm[] = [
  {
    id: 'idafa',
    aliases: ['idafa', 'idāfa', 'iḍāfa', 'الإضافة'],
    label: 'Idāfa (الإضافة) — lidhja pronësore',
    explanation:
      'Bashkim i dy emrave për të shprehur pronë ose përkatësi: "x-i i y-së". Emri i parë (i zotëruari, mudaf) humb AL-in dhe tenvīn-in; emri i dytë (pronari, mudaf ilejhi) merr kesren.',
    example: { arabic: 'كِتَابُ الطَّالِبِ', albanian: 'libri i studentit' },
  },
  {
    id: 'mudaf-ilejhi',
    aliases: ['mudaf ilejhi', 'mudāf ilejhi', 'muḍāf ilayhi'],
    label: 'Mudaf ilejhi — pronari në idafa',
    explanation:
      'Emri i dytë i një konstrukti idafa, gjithmonë në rasën gjenitive (kesra). Në shqip i përgjigjet "i/e dikujt" ose "i/e diçkaje".',
    example: { arabic: 'بَابُ الْبَيْتِ', albanian: 'dera e shtëpisë' },
  },
  {
    id: 'muthenna',
    aliases: ['muthenna', 'muthenā', 'dualis', 'dualë', 'dual', 'dyjës', 'dyjësi'],
    label: 'Muthenā — dyjësi',
    explanation:
      'Forma që tregon saktësisht DY sende/persona. Shqipja nuk e ka këtë kategori gramatikore. Ndërtohet duke i shtuar emrit ـَانِ (rasa emërore) ose ـَيْنِ (kallëzore/gjenitive).',
    example: { arabic: 'طَالِبَانِ', albanian: 'dy studentë' },
  },
  {
    id: 'mudari',
    aliases: ['mudari', "mudari‘", 'mudāri‘', 'muḍāriʿ', 'المضارع'],
    label: "Mudāri‘ (المضارع) — e tashmja / e ardhmja",
    explanation:
      'Forma foljore që tregon veprim që po ndodh ose që do të ndodhë. Ndërtohet me parashtesa: أَـ (unë), نَـ (ne), يَـ (ai/ata), تَـ (ti/ajo).',
    example: { arabic: 'أَكْتُبُ', albanian: 'shkruaj / po shkruaj' },
  },
  {
    id: 'madi',
    aliases: ['madi', 'mādī', 'māḍī', 'الماضي'],
    label: 'Māḍī (الماضي) — e shkuara',
    explanation:
      'Forma foljore për veprim të kryer. Rrënja 3-shkronjëshe merr mbaresa sipas vetës: كَتَبْتُ (shkrova), كَتَبَ (shkroi), كَتَبْنَا (shkruam).',
    example: { arabic: 'ذَهَبَ', albanian: 'shkoi' },
  },
  {
    id: 'amr',
    aliases: ['amr', 'urdhërore', 'urdhërorja'],
    label: 'Amr (الأمر) — urdhërorja',
    explanation:
      'Forma foljore për të dhënë urdhër ose kërkesë. Formohet nga rrënja e mudari‘ duke hequr parashtesën dhe duke shtuar sukun/fetha në fund.',
    example: { arabic: 'اُكْتُبْ', albanian: 'shkruaj!' },
  },
  {
    id: 'mubteda',
    aliases: ['mubteda', 'mubtada', 'mubtadaʾ', 'kryefjalë'],
    label: 'Mubtadaʾ — kryefjala',
    explanation:
      'Pjesa e parë e një fjalie emërore, zakonisht një emër i shquar në rasën emërore. Bashkë me khabar formon fjalinë: "X ësht Y".',
    example: { arabic: 'الْبَيْتُ كَبِيرٌ', albanian: 'Shtëpia është e madhe' },
  },
  {
    id: 'khabar',
    aliases: ['khabar', 'ḫabar', 'kallëzues', 'kallëzuesi'],
    label: 'Khabar — kallëzuesi',
    explanation:
      'Pjesa e dytë e një fjalie emërore; ajo që themi PËR kryefjalën. Zakonisht në rasën emërore (me damma ose tenvin damma).',
    example: { arabic: 'الْمُدَرِّسُ نَشِيطٌ', albanian: 'Mësuesi është aktiv' },
  },
  {
    id: 'nisba',
    aliases: ['nisba', 'nisbe', 'ـيّ', 'ـيَّة'],
    label: 'Nisba (ـيّ / ـيَّة) — përkatësia',
    explanation:
      'Mbaresë që kthen një emër në mbiemër përkatësie (kombësi, qytet, fushë): shton ـِيّ për M dhe ـِيَّة për F.',
    example: { arabic: 'أَلْبَانِيّ / أَلْبَانِيَّة', albanian: 'shqiptar / shqiptare' },
  },
  {
    id: 'ta-marbuta',
    aliases: ['tā marbūṭa', 'ta marbuta', 'ta-marbuta', 'tā marbūta'],
    label: 'Tā marbūṭa (ة) — mbaresa feminine',
    explanation:
      'Shkronja "ه" me dy pika sipër. E shton femëroren te shumica e emrave dhe mbiemrave, dhe shqiptohet "-ah" ose "-at" në varësi të kontekstit.',
    example: { arabic: 'طَالِب → طَالِبَة', albanian: 'student → studente' },
  },
  {
    id: 'tenvin',
    aliases: ['tenvīn', 'tenvin', 'tenwin', 'tanwīn', 'tenwīn'],
    label: 'Tanwīn — nunacioni',
    explanation:
      'Një "n" e shtuar në fund të emrit të PAshquar, e shkruar me fetha/damma/kesra të dyfishuar (ـً ـٌ ـٍ). Nuk shfaqet kur emri ka AL- ose kur është pjesë e idafas.',
    example: { arabic: 'كِتَابٌ', albanian: 'një libër' },
  },
  {
    id: 'emerore',
    aliases: ['rasa emërore', 'emërore', 'marfū‘', 'marfū', 'raf‘'],
    label: 'Rasa emërore (مَرْفُوع)',
    explanation:
      'Rasa e kryefjalës dhe e kallëzuesit në fjalinë emërore. Shenjohet me damma (ـُ) ose tenvin damma (ـٌ).',
    example: { arabic: 'الطَّالِبُ', albanian: 'studenti (si subjekt)' },
  },
  {
    id: 'kallezore',
    aliases: ['rasa kallëzore', 'kallëzore', 'manṣūb', 'mansub', 'naṣb', 'tenwin fetha', 'tenvin fetha'],
    label: 'Rasa kallëzore (مَنْصُوب)',
    explanation:
      'Rasa e kundrinës së drejtë, e gjendjes (hāl), e kohës/vendit dhe pas disa foljeve ndihmëse si كَانَ. Shenjohet me fetha (ـَ) ose tenvin fetha (ـً).',
    example: { arabic: 'أَكَلْتُ تُفَّاحَةً', albanian: 'hëngra një mollë' },
  },
  {
    id: 'gjenitiv',
    aliases: ['rasa gjenitive', 'gjenitive', 'gjenitiv', 'mexhrur', 'majrūr', 'jarr', 'kesra', 'tenwin kasra', 'tenvin kasra'],
    label: 'Rasa gjenitive (مَجْرُور)',
    explanation:
      'Rasa e emrit pas një parafjale (fi, min, ila, ala…) dhe e mudaf ilejhi-t në idafa. Shenjohet me kesra (ـِ) ose tenvin kesra (ـٍ).',
    example: { arabic: 'فِي الْبَيْتِ', albanian: 'në shtëpi' },
  },
  {
    id: 'mansub-folje',
    aliases: ['mansub', 'manṣūb', 'mudari‘ mansub', 'mudari mansub'],
    label: "Mudāri‘ manṣūb — e tashmja nënrenditore",
    explanation:
      'Folja mudari‘ me mbaresë fetha (ـَ) në vend të damma-s, pasi paraprihet nga grimca si أَنْ, لَنْ, كَيْ, لِـ. Përkon me "të" në shqip (të shkoj, të shkruaj).',
    example: { arabic: 'أُرِيدُ أَنْ أَذْهَبَ', albanian: 'dua të shkoj' },
  },
  {
    id: 'mexhzum',
    aliases: ['mexhzum', 'majzūm', 'jazm', 'mudari‘ mexhzum'],
    label: "Mudāri‘ majzūm — e tashmja e prerë",
    explanation:
      'Folja mudari‘ me mbaresë sukun (ـْ) në vend të damma-s, pasi paraprihet nga لَمْ (mohim i së shkuarës), لَا nāhija (ndalesë), ose لِـ urdhëruese.',
    example: { arabic: 'لَمْ يَذْهَبْ', albanian: 'nuk shkoi' },
  },
  {
    id: 'hal',
    aliases: ['hāl', 'hal', 'حال'],
    label: 'Hāl (حال) — gjendja',
    explanation:
      'Mbiemër ose emër në rasën kallëzore që tregon GJENDJEN në të cilën kryhet veprimi: "si" ose "në çfarë forme". Përgjigjet pyetjes "si?".',
    example: { arabic: 'جَاءَ ضَاحِكاً', albanian: 'erdhi duke qeshur' },
  },
  {
    id: 'temjiz',
    aliases: ['temjiz', 'tëmjiz', 'tamyīz'],
    label: 'Tamyīz — specifikim',
    explanation:
      'Emër në rasën kallëzore që qartëson/specifikon diçka të paqartë — sidomos pas numrave 11-99, peshave, matjeve.',
    example: { arabic: 'عِشْرُونَ طَالِباً', albanian: 'njëzet studentë' },
  },
  {
    id: 'fjalia-emerore',
    aliases: ['fjalia emërore', 'xhumle ismije', 'jumla ismiyya'],
    label: 'Fjalia emërore (الجملة الاسمية)',
    explanation:
      'Fjali që fillon me emër dhe përbëhet nga kryefjala (mubteda) + kallëzuesi (khabar). Folja "është" nuk shprehet në arabisht.',
    example: { arabic: 'الْبَابُ مَفْتُوحٌ', albanian: 'dera është e hapur' },
  },
  {
    id: 'harf-xherr',
    aliases: ['harf jarr', 'harfu jarr', 'ḥarf al-jarr', 'parafjalë', 'parafjalët'],
    label: 'Ḥarfu al-jarr — parafjalët',
    explanation:
      'Grimcat që bashkohen me emra dhe i vendosin në rasën gjenitive: في (në), من (nga), إلى (drejt), على (mbi), مع (me), عن (rreth), لـ (për).',
    example: { arabic: 'عَلَى الْمَكْتَبِ', albanian: 'mbi tavolinë' },
  },
];

// Build a single case-insensitive regex that finds any alias. Latin
// aliases get word boundaries; Arabic aliases do not (the Arabic script
// has no \b in JS regex). Called once at module load.
const escapeRegex = (s: string): string =>
  s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasArabic = (s: string): boolean => /[\u0600-\u06FF]/.test(s);

// Sorted longest-first so "mudari‘ mansub" wins over "mudari‘".
const allAliases = GRAMMAR_GLOSSARY.flatMap((term) =>
  term.aliases.map((alias) => ({ alias, termId: term.id })),
).sort((a, b) => b.alias.length - a.alias.length);

const aliasPattern = allAliases
  .map(({ alias }) => {
    const esc = escapeRegex(alias);
    return hasArabic(alias) ? esc : `\\b${esc}\\b`;
  })
  .join('|');

const ALIAS_REGEX = new RegExp(aliasPattern, 'gi');

/**
 * Scan a grammarFocus bullet and return the unique glossary terms
 * referenced, ordered by first appearance in the text.
 */
export function findGlossaryTerms(text: string): GlossaryTerm[] {
  const found = new Set<string>();
  const order: string[] = [];
  for (const match of text.matchAll(ALIAS_REGEX)) {
    const matched = match[0].toLowerCase();
    const entry = allAliases.find(
      (a) => a.alias.toLowerCase() === matched || a.alias === match[0],
    );
    if (entry && !found.has(entry.termId)) {
      found.add(entry.termId);
      order.push(entry.termId);
    }
  }
  return order
    .map((id) => GRAMMAR_GLOSSARY.find((t) => t.id === id))
    .filter((t): t is GlossaryTerm => !!t);
}
