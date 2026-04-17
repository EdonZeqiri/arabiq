// Grammar reference data for Bayna Yadayk Book 1.
// All entries are static; used by the right-hand GrammarPanel cheat sheet.

export interface Pronoun {
  arabic: string;
  translit: string;
  albanian: string;
  person: 1 | 2 | 3;
  gender: 'M' | 'F' | 'both';
  number: 'singular' | 'dual' | 'plural';
}

export interface GrammarCode {
  term: string;
  code: string;
  albanian: string;
  desc: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'teal' | 'red' | 'gray';
}

export interface PointingWord {
  arabic: string;
  translit: string;
  albanian: string;
  distance: 'near' | 'far';
  gender: 'M' | 'F';
  number: 'singular' | 'dual' | 'plural';
}

export interface PossessiveSuffix {
  suffix: string; // the attached morpheme, e.g. ـي
  translit: string;
  albanian: string; // "i im", "i yt (m)", ...
  example: string; // full word example, e.g. كِتَابِي
  exampleAl: string; // "libri im"
}

export interface RelativePronoun {
  arabic: string;
  translit: string;
  albanian: string;
  gender: 'M' | 'F';
  number: 'singular' | 'dual' | 'plural';
  example: string;
  exampleAl: string;
}

export interface HarfJarr {
  arabic: string;
  translit: string;
  albanian: string;
  example: string;
  exampleAl: string;
}

export interface MudariPrefix {
  prefix: string;
  translit: string;
  pronoun: string;
  albanian: string;
}

export const PRONOUNS: Pronoun[] = [
  // Veta e 1-rë
  { arabic: 'أَنَا', translit: 'Ene', albanian: 'Unë', person: 1, gender: 'both', number: 'singular' },
  { arabic: 'نَحْنُ', translit: 'Nahnu', albanian: 'Ne', person: 1, gender: 'both', number: 'plural' },
  // Veta e 2-të
  { arabic: 'أَنْتَ', translit: 'Ente', albanian: 'Ti (M)', person: 2, gender: 'M', number: 'singular' },
  { arabic: 'أَنْتِ', translit: 'Enti', albanian: 'Ti (F)', person: 2, gender: 'F', number: 'singular' },
  { arabic: 'أَنْتُمَا', translit: 'Entume', albanian: 'Ju të dy', person: 2, gender: 'both', number: 'dual' },
  { arabic: 'أَنْتُمْ', translit: 'Entum', albanian: 'Ju (M)', person: 2, gender: 'M', number: 'plural' },
  { arabic: 'أَنْتُنَّ', translit: 'Entunne', albanian: 'Ju (F)', person: 2, gender: 'F', number: 'plural' },
  // Veta e 3-të
  { arabic: 'هُوَ', translit: 'Huwe', albanian: 'Ai', person: 3, gender: 'M', number: 'singular' },
  { arabic: 'هِيَ', translit: 'Hije', albanian: 'Ajo', person: 3, gender: 'F', number: 'singular' },
  { arabic: 'هُمَا', translit: 'Hume', albanian: 'Ata/Ato të dy', person: 3, gender: 'both', number: 'dual' },
  { arabic: 'هُمْ', translit: 'Hum', albanian: 'Ata (M)', person: 3, gender: 'M', number: 'plural' },
  { arabic: 'هُنَّ', translit: 'Hunne', albanian: 'Ato (F)', person: 3, gender: 'F', number: 'plural' },
];

export const GRAMMAR_CODES: GrammarCode[] = [
  { term: 'اِسْم', code: 'ISM', albanian: 'Emër', desc: 'Çdo send, person ose vend', color: 'blue' },
  { term: 'فِعْل', code: "FI'L", albanian: 'Folje', desc: 'Çdo veprim', color: 'green' },
  { term: 'حَرْف', code: 'HARF', albanian: 'Parafjalë', desc: 'Fjalët lidhëse', color: 'purple' },
  { term: 'مَاضِي', code: 'MADI', albanian: 'E shkuara', desc: 'Ai bëri / shkroi', color: 'orange' },
  { term: 'مُضَارِع', code: 'MUDARI', albanian: 'E tashmja', desc: 'Ai bën / shkruan', color: 'teal' },
  { term: 'أَمْر', code: 'AMR', albanian: 'Urdhërorja', desc: 'Bëj! Shkruaj!', color: 'red' },
  { term: 'مُفْرَد', code: 'MUFRED', albanian: 'Njëjës', desc: 'Një send/person', color: 'gray' },
  { term: 'جَمْع', code: "JAM'", albanian: 'Shumës', desc: 'Shumë sende/persona', color: 'gray' },
];

export const POINTING_WORDS: PointingWord[] = [
  // Near — this / these
  { arabic: 'هَذَا', translit: 'Hadha', albanian: 'Ky', distance: 'near', gender: 'M', number: 'singular' },
  { arabic: 'هَذِهِ', translit: 'Hadhihi', albanian: 'Kjo', distance: 'near', gender: 'F', number: 'singular' },
  { arabic: 'هَذَانِ', translit: 'Hadhani', albanian: 'Këta të dy', distance: 'near', gender: 'M', number: 'dual' },
  { arabic: 'هَاتَانِ', translit: 'Hatani', albanian: 'Këto të dyja', distance: 'near', gender: 'F', number: 'dual' },
  { arabic: 'هَؤُلَاءِ', translit: "Ha'ulaa'i", albanian: 'Këta / Këto (3+)', distance: 'near', gender: 'M', number: 'plural' },
  // Far — that / those
  { arabic: 'ذَلِكَ', translit: 'Dhalika', albanian: 'Ai (aty)', distance: 'far', gender: 'M', number: 'singular' },
  { arabic: 'تِلْكَ', translit: 'Tilka', albanian: 'Ajo (aty)', distance: 'far', gender: 'F', number: 'singular' },
  { arabic: 'ذَانِكَ', translit: 'Dhanika', albanian: 'Ata të dy', distance: 'far', gender: 'M', number: 'dual' },
  { arabic: 'تَانِكَ', translit: 'Tanika', albanian: 'Ato të dyja', distance: 'far', gender: 'F', number: 'dual' },
  { arabic: 'أُولَئِكَ', translit: "Ula'ika", albanian: 'Ata / Ato (3+)', distance: 'far', gender: 'M', number: 'plural' },
];

// CAC f. 13 — 6 prapashtesat bazike. Këto "ngjiten" në fund të emrit
// dhe e bëjnë atë të caktuar (prandaj s'mund të vijnë me "AL").
// Shembulli merr كِتَاب si rrënjë referenciale.
export const POSSESSIVE_SUFFIXES: PossessiveSuffix[] = [
  { suffix: 'ـِي', translit: '-i', albanian: 'i im', example: 'كِتَابِي', exampleAl: 'libri im' },
  { suffix: 'ـنَا', translit: '-na', albanian: 'ynë / yni', example: 'كِتَابُنَا', exampleAl: 'libri ynë' },
  { suffix: 'ـكَ', translit: '-ke', albanian: 'yt (M)', example: 'كِتَابُكَ', exampleAl: 'libri yt (m.)' },
  { suffix: 'ـكِ', translit: '-ki', albanian: 'yt (F)', example: 'كِتَابُكِ', exampleAl: 'libri yt (f.)' },
  { suffix: 'ـهُ', translit: '-hu', albanian: 'i tij', example: 'كِتَابُهُ', exampleAl: 'libri i tij' },
  { suffix: 'ـهَا', translit: '-ha', albanian: 'i saj', example: 'كِتَابُهَا', exampleAl: 'libri i saj' },
];

// CAC f. 34 — përemrat relativë që lidhin një fjali me emrin/foljen.
// Në shqip: "që / i cili / e cila". Bayna Yadayk i fut nga ch6+.
export const RELATIVE_PRONOUNS: RelativePronoun[] = [
  { arabic: 'الَّذِي', translit: 'El-ledhi', albanian: 'që / i cili', gender: 'M', number: 'singular', example: 'الرَّجُلُ الَّذِي فِي الْمَسْجِدِ', exampleAl: 'Burri që është në xhami' },
  { arabic: 'الَّتِي', translit: 'El-leti', albanian: 'që / e cila', gender: 'F', number: 'singular', example: 'السَّيَّارَةُ الَّتِي فِي الدُّكَّانِ', exampleAl: 'Makina që është në dyqan' },
  { arabic: 'اللَّذَانِ', translit: 'El-ledhani', albanian: 'të cilët (2)', gender: 'M', number: 'dual', example: 'الرَّجُلَانِ اللَّذَانِ فِي الْمَسْجِدِ', exampleAl: 'Dy burrat që janë në xhami' },
  { arabic: 'اللَّتَانِ', translit: 'El-letani', albanian: 'të cilat (2)', gender: 'F', number: 'dual', example: 'السَّيَّارَتَانِ اللَّتَانِ فِي الدُّكَّانِ', exampleAl: 'Dy makinat që janë në dyqan' },
  { arabic: 'الَّذِينَ', translit: 'El-ledhine', albanian: 'të cilët (3+)', gender: 'M', number: 'plural', example: 'الرِّجَالُ الَّذِينَ فِي الْمَسْجِدِ', exampleAl: 'Burrat që janë në xhami' },
  { arabic: 'اللَّوَاتِي', translit: 'El-leuati', albanian: 'të cilat (3+)', gender: 'F', number: 'plural', example: 'الْمُسْلِمَاتُ اللَّوَاتِي فِي الْمَسْجِدِ', exampleAl: 'Muslimanet që janë në xhami' },
];

export const HARFU_JARR: HarfJarr[] = [
  { arabic: 'فِي', translit: 'Fi', albanian: 'Në', example: 'فِي الْبَيْتِ', exampleAl: 'Në shtëpi' },
  { arabic: 'مِنْ', translit: 'Min', albanian: 'Prej/Nga', example: 'مِنَ الْمَدِينَةِ', exampleAl: 'Nga qyteti' },
  { arabic: 'إِلَى', translit: 'Ila', albanian: 'Drejt/Te', example: 'إِلَى الْمَسْجِدِ', exampleAl: 'Drejt xhamisë' },
  { arabic: 'عَلَى', translit: 'Ala', albanian: 'Mbi', example: 'عَلَى الْمَكْتَبِ', exampleAl: 'Mbi tavolinë' },
  { arabic: 'مَعَ', translit: "Ma'a", albanian: 'Me/Bashkë', example: 'مَعَ الأَصْدِقَاء', exampleAl: 'Me miqtë' },
  { arabic: 'عَنْ', translit: 'An', albanian: 'Rreth/Për', example: 'عَنِ الدَّرْسِ', exampleAl: 'Rreth mësimit' },
  { arabic: 'لِ', translit: 'Li', albanian: 'Për (pronësi)', example: 'لِلطَّالِبِ', exampleAl: 'Për studentin' },
];

export const MUDARI_PREFIXES: MudariPrefix[] = [
  { prefix: 'أَ', translit: 'E-', pronoun: 'Ene', albanian: 'Unë' },
  { prefix: 'نَ', translit: 'Ne-', pronoun: 'Nahnu', albanian: 'Ne' },
  { prefix: 'يَ', translit: 'Je-', pronoun: 'Huwe/Hum', albanian: 'Ai/Ata' },
  { prefix: 'تَ', translit: 'Te-', pronoun: 'Ente/Enti/Hije', albanian: 'Ti/Ajo' },
];
