// Curriculum data for Al-Arabiya Bayna Yadayk — Book 1.
// Chapters 1–5 carry the richest datasets; 6–16 are stocked with real titles,
// at least 3 dialogues and ~10 vocabulary words each.

export interface Dialogue {
  id: string;
  albanian: string;
  arabic: string;
  transliteration: string;
}

export interface VocabWord {
  id: string;
  arabic: string;
  albanian: string;
  root: string;
  type: 'noun' | 'verb' | 'particle' | 'adjective';
  gender?: 'M' | 'F';
  plural?: string;
}

export interface Story {
  id: string;
  titleAl: string;
  albanian: string;
  arabic: string;
  transliteration: string;
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
      },
      {
        id: 'd1-2',
        albanian: 'Emri im është Ahmed. Nga vjen ti?',
        arabic: 'اِسْمِي أَحْمَد. مِنْ أَيْنَ أَنْتَ؟',
        transliteration: 'Ismi Ahmed. Min eyne ente?',
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
    ],
    grammarFocus: [
      'Përemrat vetorë: أَنَا (Ene), أَنْتَ (Ente), أَنْتِ (Enti), هُوَ (Huwe), هِيَ (Hije)',
      'Emrat tregues: هَذَا (Hadha) / هَذِهِ (Hadhihi)',
      'Nisba (ـيّ / ـيَّة) për kombësinë: أَلْبَانِيّ / أَلْبَانِيَّة',
      'Fjalia emërore: mubteda (kryefjalë) + khabar (kallëzues)',
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
        transliteration: 'Hejja bina nusalli xhema‘aten.',
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
      { id: 'v2-18', arabic: 'صَلَّى', albanian: 'U fal', root: 'ص-ل-و', type: 'verb' },
      { id: 'v2-19', arabic: 'قَرَأَ', albanian: 'Lexoi', root: 'ق-ر-أ', type: 'verb' },
      { id: 'v2-20', arabic: 'مَنْ', albanian: 'Kush', root: '-', type: 'particle' },
    ],
    grammarFocus: [
      'Mbaresat pronëzuese: ـي (-i, im), ـكَ (-ke, yt), ـهُ (-hu, i tij), ـهَا (-ha, i saj)',
      'Idafa (lidhja pronësore): وَالِدُ مُوسَى (babai i Musait)',
      'Dualë (muthenna): أَخَوَانِ (dy vëllezër), بِنْتَانِ (dy bija)',
      'هَيَّا بِنَا + folje: Hajde të…',
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
          "Usreti kebire ve habibe. Walidi tabib ve ja'melu fil mustashfa, ve walideti mu'allime fil medrese. Li ekhevani kebirani ve ukhtun sagire. Xheddi ve xheddeti jeskunani ma'ana fil bejt. Kulle mesa'in ne'kulu xhemi'an, thumme nusalli xhema'aten. Elhamdulilah, e'tanallahu usreten mubareke.",
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
      { id: 'v3-18', arabic: 'سَكَنَ', albanian: 'Banoi', root: 'س-ك-ن', type: 'verb' },
      { id: 'v3-19', arabic: 'اسْتَأْجَرَ', albanian: 'Mori me qira', root: 'أ-ج-ر', type: 'verb' },
      { id: 'v3-20', arabic: 'دَخَلَ', albanian: 'Hyri', root: 'د-خ-ل', type: 'verb' },
      { id: 'v3-21', arabic: 'جَمِيل', albanian: 'I bukur', root: 'ج-م-ل', type: 'adjective', gender: 'M' },
      { id: 'v3-22', arabic: 'قَبِيح', albanian: 'I shëmtuar', root: 'ق-ب-ح', type: 'adjective', gender: 'M' },
      { id: 'v3-23', arabic: 'كَمْ', albanian: 'Sa', root: '-', type: 'particle' },
      { id: 'v3-24', arabic: 'أَيّ', albanian: 'Cili', root: '-', type: 'particle' },
    ],
    grammarFocus: [
      'لَدَى + përemër: لَدَيَّ / لَدَيْنَا / لَدَيْكَ / لَدَيْهِ (kam, kemi, ke, ka)',
      'Parafjala في (fi — në): fi hadhel bejt',
      'Pyetje me كَمْ (sa) + emri në tenvin kallëzor: kem gurfeten',
      'Urdhërore e kortezisë: تَفَضَّلْ / اُدْخُلْ',
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
      { id: 'v4-14', arabic: 'اِسْتَيْقَظَ', albanian: 'U zgjua', root: 'ي-ق-ظ', type: 'verb' },
      { id: 'v4-15', arabic: 'نَامَ', albanian: 'Fjeti', root: 'ن-و-م', type: 'verb' },
      { id: 'v4-16', arabic: 'ذَهَبَ', albanian: 'Shkoi', root: 'ذ-ه-ب', type: 'verb' },
      { id: 'v4-17', arabic: 'كَنَسَ', albanian: 'Fshiu', root: 'ك-ن-س', type: 'verb' },
      { id: 'v4-18', arabic: 'غَسَلَ', albanian: 'Lau', root: 'غ-س-ل', type: 'verb' },
      { id: 'v4-19', arabic: 'كَوَى', albanian: 'Hekurosi', root: 'ك-و-ي', type: 'verb' },
      { id: 'v4-20', arabic: 'شَاهَدَ', albanian: 'Shikoi', root: 'ش-ه-د', type: 'verb' },
      { id: 'v4-21', arabic: 'مُبَكِّراً', albanian: 'Herët', root: 'ب-ك-ر', type: 'particle' },
      { id: 'v4-22', arabic: 'مُتَأَخِّراً', albanian: 'Vonë', root: 'أ-خ-ر', type: 'particle' },
      { id: 'v4-23', arabic: 'قَبْلَ', albanian: 'Para', root: 'ق-ب-ل', type: 'particle' },
      { id: 'v4-24', arabic: 'بَعْدَ', albanian: 'Pas', root: 'ب-ع-د', type: 'particle' },
      { id: 'v4-25', arabic: 'مَتَى', albanian: 'Kur', root: '-', type: 'particle' },
      { id: 'v4-26', arabic: 'عِنْدَ', albanian: 'Tek / kur', root: 'ع-ن-د', type: 'particle' },
    ],
    grammarFocus: [
      'Folja mudari‘ e rregullt: يَسْتَيْقِظُ / تَسْتَيْقِظُ / أَسْتَيْقِظُ',
      'Mohimi me لَا + mudari‘: لَا أَتَأَخَّرُ (nuk vonohem)',
      'Parafjala بِـ për mjet: بِالحَافِلَةِ (me autobus)',
      'قَبْلَ / بَعْدَ + emër gjenitiv: قَبْلَ الصَّلَاةِ',
      'Numrat rendorë (M): الأَوَّل، الثَّانِي، الثَّالِث، الرَّابِع، الخَامِس',
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
          "Jestejkizu Musa mubekkiren kulle jewm, kable salatil fexhr. Ba'des-salati je'kulul fatur ma'al usre ve jeshrebul halibe ma'ash-shaj. Fis-sa'atis-sabi'a jedhhebu ilel medrese bil hafile, li ennel medrese be‘ide. Ba'ded-dersi jerxhi‘u ilel bejt, ve jusa‘idu walidetehu fi kensil gurefi ve gaslil melabis. Fil mesa jushahidut-tilfaze ma‘a walidihi ve jakrau es-sahife. Fi jewmil ‘utle la jestejkizu mubekkiren, ve lakin jesterihu ma‘a usretihi fil bejt. Huwe la jete’ekhkheru ebeden ve jenamu mubekkiren li jekune neshitan fil gad.",
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
      { id: 'v5-21', arabic: 'أَكَلَ', albanian: 'Hëngri', root: 'أ-ك-ل', type: 'verb' },
      { id: 'v5-22', arabic: 'شَرِبَ', albanian: 'Piu', root: 'ش-ر-ب', type: 'verb' },
      { id: 'v5-23', arabic: 'طَلَبَ', albanian: 'Kërkoi', root: 'ط-ل-ب', type: 'verb' },
      { id: 'v5-24', arabic: 'فَضَّلَ', albanian: 'Preferoi', root: 'ف-ض-ل', type: 'verb' },
      { id: 'v5-25', arabic: 'جَائِع', albanian: 'I uritur', root: 'ج-و-ع', type: 'adjective', gender: 'M' },
      { id: 'v5-26', arabic: 'شَبْعَان', albanian: 'I ngopur', root: 'ش-ب-ع', type: 'adjective', gender: 'M' },
      { id: 'v5-27', arabic: 'كَثِير', albanian: 'Shumë', root: 'ك-ث-ر', type: 'adjective', gender: 'M' },
      { id: 'v5-28', arabic: 'قَلِيل', albanian: 'Pak', root: 'ق-ل-ل', type: 'adjective', gender: 'M' },
      { id: 'v5-29', arabic: 'جِدّاً', albanian: 'Shumë (adv.)', root: '-', type: 'particle' },
    ],
    grammarFocus: [
      'Emri i shkuar (madi) në veten I: أَكَلْتُ، شَرِبْتُ، طَلَبْتُ',
      'Ndalesa (لَا ناهِيَة) me mudari‘ mexhzum: لَا تَزِدْ (mos shto)',
      'Lidhëza أَمْ për pyetje zgjedhëse: شَاياً أَمْ قَهْوَةً؟',
      'بِـ me pije: شَاياً بِالحَلِيبِ، قَهْوَةً بِدُونِ سُكَّرٍ',
      'Numrat rendorë (F): الأُولَى، الثَّانِيَة، الثَّالِثَة، الرَّابِعَة، الخَامِسَة',
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
          "Kulle sabahin je'kulu Musa el-khubze bit-temri ve jeshrebul halibe ma'ash-shaj. Fil gada tetbukhul walide el-erruzze ma'al lahm ve selete tazexhe. El-walid jufeddilul kahwe bi dunis-sukker, vel ukht es-sagire tetlubul fakihe ba'det-ta'am. Fil mesa netenewelu ‘asha’en khafifen — semeken ev dexhaxhen ma‘al khudar. Ed-dujuf je’tune kethiren ila bejtina, fe tu‘iddul walide maideten xhemile lehum. El-mau enfe‘u sharabin, ve la ne’kulu kethiren hatta la nekune thikalen.",
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
      { id: 'v6-19', arabic: 'سَمِعَ', albanian: 'Dëgjoi', root: 'س-م-ع', type: 'verb' },
      { id: 'v6-20', arabic: 'اسْتَطَاعَ', albanian: 'Mundi', root: 'ط-و-ع', type: 'verb' },
      { id: 'v6-21', arabic: 'رَكِبَ', albanian: 'Hipi', root: 'ر-ك-ب', type: 'verb' },
      { id: 'v6-22', arabic: 'انْتَظَرَ', albanian: 'Priti', root: 'ن-ظ-ر', type: 'verb' },
      { id: 'v6-23', arabic: 'وَضَعَ', albanian: 'Vendosi', root: 'و-ض-ع', type: 'verb' },
      { id: 'v6-24', arabic: 'قَرِيب', albanian: 'I afërt', root: 'ق-ر-ب', type: 'adjective', gender: 'M' },
      { id: 'v6-25', arabic: 'بَعِيد', albanian: 'I largët', root: 'ب-ع-د', type: 'adjective', gender: 'M' },
      { id: 'v6-26', arabic: 'بِجَانِبِ', albanian: 'Pranë', root: 'ج-ن-ب', type: 'particle' },
      { id: 'v6-27', arabic: 'صَحِيح', albanian: 'I saktë / i shëndetshëm', root: 'ص-ح-ح', type: 'adjective', gender: 'M' },
    ],
    grammarFocus: [
      'أَسْتَطِيعُ + أَنْ + mudari‘ mansub: أَسْتَطِيعُ أَنْ أَذْهَبَ (mund të shkoj)',
      'E ardhmja me سَـ / سَوْفَ + mudari‘: سَنَرْكَبُ (do të hipim)',
      'لِـ (lam) + emër/folje: لِلنَّوْمِ، لِيَكُونَ',
      'Numrat rendorë 6–10 (M): السَّادِس، السَّابِع، الثَّامِن، التَّاسِع، العَاشِر',
      'Shprehje lutjesh: إِنْ شَاءَ اللَّهُ، جَزَاكَ اللَّهُ خَيْراً',
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
          "Jeda‘u Musa el-munebbihe kabled-nevm, li’ella jete’ekhkhare ‘an salatil fexhr. ‘Indema jesme‘ul edhan jekumu seri‘an ve jetevedda. El-mesxhidu karibun min bejtihi, bi xhanibil hadika, ve lakinnehu jerkebus-sejjare ehjanen hine jenzilu meterun kethir. Fil mesxhid jeltaki bi asdikaihi ve jete‘allemul ajati minel imam. Inshallah jewmen ma sejusalli fil mesxhidin-nebevijj bil medine ve fil mesxhidil harami bi Mekke. Es-salatu lejset lil kusala, bel lil mu’minin en-neshitin elledhine juhibbunAllah.",
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
      { id: 'v7-21', arabic: 'بَدَأَ', albanian: 'Filloi', root: 'ب-د-ء', type: 'verb' },
      { id: 'v7-22', arabic: 'انْتَهَى', albanian: 'Mbaroi', root: 'ن-ه-ي', type: 'verb' },
      { id: 'v7-23', arabic: 'كَتَبَ', albanian: 'Shkroi', root: 'ك-ت-ب', type: 'verb' },
      { id: 'v7-24', arabic: 'دَرَسَ', albanian: 'Studioi', root: 'د-ر-س', type: 'verb' },
      { id: 'v7-25', arabic: 'كَانَ', albanian: 'Ishte', root: 'ك-و-ن', type: 'verb' },
      { id: 'v7-26', arabic: 'نَظَرَ', albanian: 'Shikoi', root: 'ن-ظ-ر', type: 'verb' },
      { id: 'v7-27', arabic: 'طَوِيل', albanian: 'I gjatë', root: 'ط-و-ل', type: 'adjective', gender: 'M' },
      { id: 'v7-28', arabic: 'قَصِير', albanian: 'I shkurtër', root: 'ق-ص-ر', type: 'adjective', gender: 'M' },
    ],
    grammarFocus: [
      'Ora në formë femërore: السَّاعَةُ الثَّامِنَةُ، السَّاعَةُ الخَامِسَةُ',
      'Idafa e trefishtë: مَادَّةُ اللُّغَةِ العَرَبِيَّةِ',
      'كَانَ + khaber (kallëzues) në kallëzore: كَانَ الدَّرْسُ طَوِيلاً',
      'Pyetje me كَمْ për orën: كَمِ السَّاعَةُ؟',
      'Ditët e javës: السَّبْت، الأَحَد، الاثْنَيْن، الثُّلَاثَاء، الأَرْبَعَاء، الخَمِيس، الجُمُعَة',
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
          "Jedrusu Musa fil xhami‘atil islamijje mundhu ‘amejn. Jebdeud-dersu fis-sa‘atith-thamine sabahan ve jentehi fis-sa‘atith-thanije zuhren. Ba‘del hissetil ula istiraha nisfu sa‘a, jeshrebu fihet-tullabush-shaj ve jetekellemun ‘anil xhedvel. Maddetuhul mufaddale hijel lugatul ‘arabijje, thummer-rijadijjat vel ‘ulum. Fil mektebe jektubul vaxhibat ve jakraul kutubel xhedide kulle jewm. Fil mukhtebar jestakhdimul hasub li te‘allumil imla. El-ikhtibaratu jewmes-sebt, fejedrusu Musa kethiren fil mesa. BarekAllahu lehu fil ‘ilmilledhi je’khudhuh.",
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
        transliteration: 'Ukhti tedrusu fi kullijjetis-sajdele.',
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
        transliteration: 'Uhibbu ‘ameli ve uhibbul etfale elledhine uderrisuhum.',
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
      { id: 'v8-21', arabic: 'طَارَ', albanian: 'Fluturoi', root: 'ط-ي-ر', type: 'verb' },
      { id: 'v8-22', arabic: 'أَحَبَّ', albanian: 'E deshi', root: 'ح-ب-ب', type: 'verb' },
      { id: 'v8-23', arabic: 'دَرَّسَ', albanian: 'Mësoi (dikë)', root: 'د-ر-س', type: 'verb' },
      { id: 'v8-24', arabic: 'سَنَة', albanian: 'Vit', root: 'س-ن-و', type: 'noun', gender: 'F', plural: 'سَنَوَات' },
    ],
    grammarFocus: [
      'أَعْمَلُ + mbiemër në kallëzore (حال): أَعْمَلُ مُهَنْدِساً',
      'Idafa e fakulteteve: كُلِّيَّةُ + emri i fushës (كُلِّيَّةُ الطِّبّ)',
      'Folja أُحِبُّ + emër në kallëzore: أُحِبُّ عَمَلِي',
      'Numrat rendorë 11–12 (F): الحَادِيَةَ عَشْرَةَ، الثَّانِيَةَ عَشْرَةَ',
      'Përemrat lidhorë: الَّذِي (M) / الَّتِي (F) / الَّذِينَ (shumësi M)',
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
          "Usretu Musa meli’e bil mihenin-nafi‘a. El-walid tabibun fil mustashfa ve ja‘melu sa‘atin tavile. El-walide tekharrexhet min kullijjetit-terbije ve tuderrisul etfal fil merhaletil ibtida’ijje. El-ukht tedrusus-sajdele ve turidu en teftaha sajdelijjeten khasse. El-akhus-sagir jehlumu en jekune tajjaren ve en jetire fis-sema’. Jufekkiru Musa en jekune muhendisen ba‘del merhaletith-thanevijje, ve lakinnehu sejukmilud-dirase bi tefevvukin evvelen. Kullu mihnetin ni‘metun minAllahi idha kanet bi nijjetin saliha ve ikhlas.",
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
      { id: 'v9-21', arabic: 'اشْتَرَى', albanian: 'Bleu', root: 'ش-ر-ي', type: 'verb' },
      { id: 'v9-22', arabic: 'بَاعَ', albanian: 'Shiti', root: 'ب-ي-ع', type: 'verb' },
      { id: 'v9-23', arabic: 'دَفَعَ', albanian: 'Pagoi', root: 'د-ف-ع', type: 'verb' },
      { id: 'v9-24', arabic: 'أَعْطَى', albanian: 'Dha', root: 'ع-ط-و', type: 'verb' },
      { id: 'v9-25', arabic: 'بِكَمْ', albanian: 'Për sa? (çmimi)', root: 'ك-م', type: 'particle' },
      { id: 'v9-26', arabic: 'عِشْرُونَ', albanian: 'Njëzet (20)', root: 'ع-ش-ر', type: 'particle' },
      { id: 'v9-27', arabic: 'ثَلَاثُونَ', albanian: 'Tridhjetë (30)', root: 'ث-ل-ث', type: 'particle' },
      { id: 'v9-28', arabic: 'خَمْسُونَ', albanian: 'Pesëdhjetë (50)', root: 'خ-م-س', type: 'particle' },
      { id: 'v9-29', arabic: 'مِئَة', albanian: 'Njëqind (100)', root: 'م-أ-ي', type: 'particle' },
    ],
    grammarFocus: [
      'Pyetja e çmimit بِكَمْ؟ (Bikem?) + emër në tenwin kasra',
      'Numrat e dhjetëshave 20/30/.../90 — بُوق me mbaresë ـُونَ / ـِينَ',
      'Drejtimet e vendit يَمِين/شَمَال/أَمَام/خَلْف/فَوْق/تَحْت — si ظرف مكان',
      'أَعْطِنِي (Atini) — urdhërore + përemër bashkangjitur ـنِي',
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
        transliteration: 'El-xhevvu mu‘tedil; khudh mizalleten.',
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
      { id: 'v10-16', arabic: 'أَمْطَرَ', albanian: 'Ra shi', root: 'م-ط-ر', type: 'verb' },
      { id: 'v10-17', arabic: 'يُمْطِر', albanian: 'Bie shi (tash)', root: 'م-ط-ر', type: 'verb' },
      { id: 'v10-18', arabic: 'أَبْيَض', albanian: 'I bardhë', root: 'ب-ي-ض', type: 'adjective', gender: 'M' },
      { id: 'v10-19', arabic: 'أَسْوَد', albanian: 'I zi', root: 'س-و-د', type: 'adjective', gender: 'M' },
      { id: 'v10-20', arabic: 'أَحْمَر', albanian: 'I kuq', root: 'ح-م-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-21', arabic: 'أَصْفَر', albanian: 'I verdhë', root: 'ص-ف-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-22', arabic: 'أَخْضَر', albanian: 'I gjelbër', root: 'خ-ض-ر', type: 'adjective', gender: 'M' },
      { id: 'v10-23', arabic: 'أَزْرَق', albanian: 'I kaltër', root: 'ز-ر-ق', type: 'adjective', gender: 'M' },
    ],
    grammarFocus: [
      'Folja mudari‘ me prefix ت (تَـ): تُمْطِر — bie shi (ajo)',
      'لِأَنَّ (Li-enne) + përemër i lidhur — lidhëza shkakore',
      'Ngjyrat أَفْعَل/فَعْلَاء — mashkullore أَحْمَر, femërore حَمْرَاء',
      'كَمْ + emër i pashquar në tenwin fetha: كَمْ دَرَجَةً؟',
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
      { id: 'v11-18', arabic: 'سَافَرَ', albanian: 'Udhëtoi', root: 'س-ف-ر', type: 'verb' },
      { id: 'v11-19', arabic: 'رَكِبَ', albanian: 'Hipi (mjet)', root: 'ر-ك-ب', type: 'verb' },
      { id: 'v11-20', arabic: 'زَارَ', albanian: 'Vizitoi', root: 'ز-و-ر', type: 'verb' },
      { id: 'v11-21', arabic: 'اِسْتَغْرَقَ', albanian: 'Zgjati (kohë)', root: 'غ-ر-ق', type: 'verb' },
      { id: 'v11-22', arabic: 'اِنْتَقَلَ', albanian: 'U zhvendos', root: 'ن-ق-ل', type: 'verb' },
      { id: 'v11-23', arabic: 'وَلَكِنْ', albanian: 'Por / Mirëpo', root: 'ل-ك-ن', type: 'particle' },
    ],
    grammarFocus: [
      'Shkronja e ardhmërisë سَـ (se-) + folje mudari‘: سَتُسَافِر',
      'Pyetja أَمْ (em) — zgjedhje mes dy opsioneve (tren apo avion?)',
      'Kundërvënia وَلَكِنْ (ve lakin) — lidhëza kundërshtore',
      'Folja اِسْتَغْرَقَ + كَمِيَّة kohore (sa zgjat) + kallëzore',
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
        transliteration: "Kulle usbu‘in akrau mexhelleten ve kitaben islamijjen.",
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
      { id: 'v12-21', arabic: 'اِخْتَارَ', albanian: 'Zgjodhi', root: 'خ-ي-ر', type: 'verb' },
      { id: 'v12-22', arabic: 'جَمَعَ', albanian: 'Mblodhi', root: 'ج-م-ع', type: 'verb' },
      { id: 'v12-23', arabic: 'فَضَّلَ', albanian: 'Preferoi', root: 'ف-ض-ل', type: 'verb' },
    ],
    grammarFocus: [
      'Dualis (muthenna): رِيَاضَتَانِ مُفِيدَتَانِ — "dy sporte të dobishme"',
      'لِأَنَّهُمَا (Li-ennehuma) — sepse (për dy)',
      'Idafa e dyfishtë: خَطُّ الرُّقْعَة, جَمْعُ الطَّوَابِع',
      'Mbiemri i krahasimit أَفْعَل — si strukturë semantike (مُفَضَّل)',
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
          "Li kulli ferdin min usreti Musa hiwajetun mufaddale. Musa juhibbu kuret el-kadem ves-sibahate li ennehuma rijadetani mufidetani lil xhism. Ukhtuhu Amine tetederrebu alel khatt el-arabijj — khatt er-rukati ve khatt en-neskh — ve tektubu ajatin xhemileten li ma‘ridil medrese. El-ammu jexhmeu et-tevabia min biladin kethire, ve indehu ektheru min mi‘eti tabi‘. El-ummu tekrau el-kutubel islamijjete vel mexhellati kulle usbu‘, ve tuhaddithul evlade anil kisesil leti texhiduha fiha. Ve kad bedee Musa muraseleten me‘a sadikin min Misr li jetederrebe alel arabijje. El-hiwajatu mufidetun hine tu‘allimuna shej’en xhedida.",
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
      { id: 'v13-18', arabic: 'أَقَامَ', albanian: 'Qëndroi (banoi)', root: 'ق-و-م', type: 'verb' },
      { id: 'v13-19', arabic: 'إِقَامَة', albanian: 'Qëndrim / Leje qëndrimi', root: 'ق-و-م', type: 'noun', gender: 'F' },
      { id: 'v13-20', arabic: 'فَتَحَ', albanian: 'Hapi', root: 'ف-ت-ح', type: 'verb' },
      { id: 'v13-21', arabic: 'فَقَدَ', albanian: 'Humbi', root: 'ف-ق-د', type: 'verb' },
      { id: 'v13-22', arabic: 'مَقْبُولَة', albanian: 'E pranuar (f.)', root: 'ق-ب-ل', type: 'adjective', gender: 'F' },
      { id: 'v13-23', arabic: 'سَافَرَ', albanian: 'Udhëtoi', root: 'س-ف-ر', type: 'verb' },
      { id: 'v13-24', arabic: 'وَصَلَ', albanian: 'Arriti', root: 'و-ص-ل', type: 'verb' },
    ],
    grammarFocus: [
      'E ardhmja me سَـ / سَوْفَ: سَأُسَافِر, سَوْفَ أَزُور',
      'Idafa me përemër të bashkangjitur: جَوَازُ سَفَرِي, حَقِيبَتِي',
      'Parafjala بِـ për mjet: بِالطَّائِرَة, بِالسَّيَّارَة',
      'Folja قَدْ + Madi — veprim i kryer (قَدْ حَجَزْتُ)',
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
      { id: 'v14-25', arabic: 'أَدَّى', albanian: 'Kreu / përmbushi', root: 'أ-د-ي', type: 'verb' },
      { id: 'v14-26', arabic: 'طَافَ', albanian: 'Bëri tavaf', root: 'ط-و-ف', type: 'verb' },
      { id: 'v14-27', arabic: 'سَعَى', albanian: 'Bëri sai', root: 'س-ع-ي', type: 'verb' },
      { id: 'v14-28', arabic: 'رَمَى', albanian: 'Hodhi (gurët)', root: 'ر-م-ي', type: 'verb' },
      { id: 'v14-29', arabic: 'ذَبَحَ', albanian: 'Preu', root: 'ذ-ب-ح', type: 'verb' },
      { id: 'v14-30', arabic: 'حَلَقَ', albanian: 'Rruajti kokën', root: 'ح-ل-ق', type: 'verb' },
    ],
    grammarFocus: [
      'Numrat 11–19: أَحَدَ عَشَر, اِثْنَا عَشَر, … — të dy pjesët mbi fetha',
      'Tëmjiz (specifikim) i numrave 11–99: عَشَر + emër në tenwin fetha',
      'Foljet مَاضِي të Haxhit: أَدَّى، طَافَ، سَعَى، رَمَى، ذَبَحَ، حَلَقَ',
      'Shprehja admirimi مَا أَعْظَمَ + emër në kallëzore (mea‘zamet…)',
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
          "Fil amil madi edda Musa el-haxhxhe me‘a ebih. Fil mikati lebisa thewbel ihrami ve bedeaet-telbije: «Lebbejkallahumme lebbejk». Ve lemma vesala ila Mekke, tafa tevafel ifadati seb‘ate eshwat hevlel ka‘be ve sallaja rek‘atejni inde mekami Ibrahim. Thumme se‘aja bejnes-safa vel merve. Fi jewmi Arafe vekafa hatta gurubish-shems ve de‘aallahe bi kalbin khashi‘. Ve bata fi Muzdelife ve xheme‘al haa. Fil jewmit-tali fi Mina remejal xhemretel kubra ve dhebehaal hedje ve halaka ru‘usehuma. El-haxhxhul mebruru xhezauhul xhenne.",
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
        transliteration: 'Ensahuke bi ekli el-khudraveti verr-raha ve killetil milh.',
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
      { id: 'v15-24', arabic: 'أَصَابَ', albanian: 'E goditi (sëmundja)', root: 'ص-و-ب', type: 'verb' },
      { id: 'v15-25', arabic: 'فَحَصَ', albanian: 'Ekzaminoi', root: 'ف-ح-ص', type: 'verb' },
      { id: 'v15-26', arabic: 'نَصَحَ', albanian: 'Këshilloi', root: 'ن-ص-ح', type: 'verb' },
      { id: 'v15-27', arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ', albanian: 'Paqja, mëshira dhe begatia e Allahut qofshin mbi ju', root: 'س-ل-م', type: 'particle' },
    ],
    grammarFocus: [
      'Pyetja mundi i kohës مُنْذُ مَتَى؟ + Madi — që kur?',
      'Numri dual jewmejn/ usbu‘ajn — prej dy ditësh / dy javësh',
      'Forma أَنْصَحُكَ بِ + emër — “të këshilloj për …”',
      'Lidhëza urdhërore لِـ + mudari‘ mexhzum: لِنَقُمْ (le të bëjmë)',
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
          "Mundhu jewmejn jesh‘uru Musa bi sudain ve elemin fis-sadr. El-jewme dhehebe ilet-tabibi ve kale: «Es-selamu alejkum ve rahmetullahi ve berakatuh». Seelehut-tabib: Mundhu meta esabekel elem? Hel indeke vexhaun fil esnani evil udhun? Ve helirtefe‘atil harara? Fehasahu fehsan seri‘an, ve ba‘de kalilin xha‘etin-netixhe: Ed-daghtu murtefi‘un kalilen ve indehu zijadetun fil vezn. Nesahahut-tabibu bir-rahati ve ekli el-khudraveti ve killetil milhi ve mumareseti er-rijada kulle jewm. Ve haxheze Musa mev‘iden akhare inde tabibi el-esnani li elemin khafifin fi dirsihi. Ve lemma kharexhe minel ‘ijade hamidallahe ales-sihha.",
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
    ],
    grammarFocus: [
      'Numërimi i muajve hixhri — اِثْنَا عَشَرَ شَهْراً',
      'Folja e ardhme سَـ + mudari‘: سَأَقْضِي, سَنَذْبَحُ',
      'Idafa me emra kompozit: زَكَاةُ الْفِطْرِ, نَهْرُ النِّيلِ, صَلَاةُ الْعِيدِ',
      'Rasti pasues (mudaf ilejhi) pas emri të përbërë',
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
          "Hine jeetij jewmu idil fitr, jestejkizu Musa mubekkiren ve jagtesilu ve jelbesu exhmelath-thijab. Juhrixhu ebuhu zekatel fitri — sa‘an minel kamhi an kulli ferdin minel usre — kable salatil ‘id. Thumme jedhhebune xhemian ilel mesxhidi li salatil ‘id, ve ba‘delkhutbeti jubarikune li ba‘dihimul ba‘d: «Tekabbelallahu minna ve minkum». Ve fi idil ad-ha jedhbehul ebul ud-hijete ve jaksimul lahme lil usre vel xhirani vel fukara. Jakdune utletel idi fi mezra‘atil xheddi kurben nehr, jerewnel xhibale vel bahrel ba‘id, ve jezurune methafen fil asime. Vel eshhurul hixhrijjetu ithna ashare shehra: el-muharrem, safer, rebi‘ul evvel, rebi‘ul ahir, xhumadel ula, xhumadel ahire, rexheb, sha‘ban, ramadan, shevval, dhul ka‘de, ve dhul hixhxhe — shehrul haxhxh.",
      },
    ],
  },
];

export const getChapter = (id: number): Chapter | undefined =>
  CHAPTERS.find((c) => c.id === id);
