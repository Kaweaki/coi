export type Lang = 'en' | 'vi' | 'sv'

export type Fact = { title: string; body: string }

export const LANGS: { code: Lang; name: string; short: string }[] = [
  { code: 'en', name: 'English', short: 'EN' },
  { code: 'vi', name: 'Tiếng Việt', short: 'VI' },
  { code: 'sv', name: 'Svenska', short: 'SV' },
]

/** The maker's mark. Same words in every language, by design. */
export const ATTRIBUTION = 'Attributed to Harald Blimark · 2026 · Trademark'
export const VERSION = '2.0.0'

export type Copy = {
  langLabel: string
  tabsLabel: string
  tabAsk: string
  tabTree: string
  tabLearn: string

  installTitle: string
  installHint: string
  installDismiss: string

  askEyebrow: string
  askTitle: string
  askTitleEm: string
  askTitleTail: string
  askLede: string
  askPlaceholder: string
  askHint: string
  askClear: string
  askStart: string
  askRecent: string
  askPeople: string
  askOther: string
  askOne: string
  askEmptyLabel: string
  askEmptyBody: string
  emptyTitle: (query: string) => string
  heroYou: string
  heroThem: string
  hearIt: string
  fullPicture: string
  namedBadge: string
  factsLabel: string
  facts: Fact[]
  chips: string[]

  treeEyebrow: string
  treeTitle: string
  treeTitleEm: string
  treeTitleTail: string
  treeLede: string
  treeMapLabel: string
  treeDrag: string
  treeHint: string
  treeOpen: string
  treeSelf: string
  treeNoi: string
  treeNgoai: string
  treeZoomIn: string
  treeZoomOut: string
  treeReset: string

  detailYou: string
  detailThem: string
  detailSay: string
  detailHear: string
  detailPronounce: string
  detailNoVoice: string
  detailSave: string
  detailSaved: string
  detailClose: string
  detailFoot: string

  nameLabel: string
  namePlaceholder: string
  nameSave: string
  nameRemove: string
  nameHint: string

  learnEyebrow: string
  learnTitle: string
  learnTitleEm: string
  learnLede: string
  learnTones: string
  learnTap: string
  learnPhrases: string
  learnRule: string
  learnRuleBody: string
  learnAudio: string

  account: string
  accountIntro: string
  accountLanguage: string
  accountNames: string
  accountNoNames: string
  accountData: string
  accountVersion: string
  accountClose: string
}

const EN: Copy = {
  langLabel: 'Language',
  tabsLabel: 'Sections',
  tabAsk: 'Ask',
  tabTree: 'Tree',
  tabLearn: 'Learn',

  installTitle: 'Keep Cội on your Home Screen',
  installHint: 'Share, then Add to Home Screen',
  installDismiss: 'Dismiss',

  askEyebrow: 'Bảng xưng hô · kinship',
  askTitle: 'Who is this',
  askTitleEm: 'person',
  askTitleTail: 'to you?',
  askLede:
    'Type it the way you would explain it out loud. Cội answers with the word you use for them — and the one they use for you.',
  askPlaceholder: "My mother's younger brother",
  askHint: 'A relationship — or a name you saved.',
  askClear: 'Clear the search',
  askStart: 'Start with',
  askRecent: 'Recent',
  askPeople: 'Your people',
  askOther: 'Other readings',
  askOne: 'One reading. Nothing ambiguous in that chain.',
  askEmptyLabel: 'Không tìm thấy',
  askEmptyBody:
    'Describe the chain instead of the title — “father’s older sister” or “my sister’s husband”. Four words are the sweet spot.',
  emptyTitle: (query) => `No match for “${query}” yet.`,
  heroYou: 'You call them',
  heroThem: 'They call you',
  hearIt: 'Hear it',
  fullPicture: 'Full picture',
  namedBadge: 'your name',
  factsLabel: 'Three things worth knowing',
  facts: [
    {
      title: 'Pronouns are a relationship, not a person.',
      body: 'Your friend’s father is chú to you and bác to someone two years older.',
    },
    {
      title: 'Age beats family.',
      body: 'You need to know whether someone is older or younger than the person who connects you — that single fact changes the word.',
    },
    {
      title: 'You change too.',
      body: 'When you speak to chú, you are cháu. The pair moves together, in both directions, in the same sentence.',
    },
  ],
  chips: [
    "My mother's younger brother",
    "My father's older sister",
    "My wife's mother",
    "My older brother's son",
  ],

  treeEyebrow: 'Cây gia đình · family tree',
  treeTitle: 'Your family,',
  treeTitleEm: 'mapped',
  treeTitleTail: '.',
  treeLede:
    'One map, read outward from you. Drag to move, zoom in, and press anyone to trace exactly how the two of you are related.',
  treeMapLabel: 'Bản đồ · the map',
  treeDrag: 'drag · zoom',
  treeHint: 'You are the root. Press anyone to trace the line back to you.',
  treeOpen: 'Open',
  treeSelf: 'the point of view',
  treeNoi: 'bên nội',
  treeNgoai: 'bên ngoại',
  treeZoomIn: 'Zoom in',
  treeZoomOut: 'Zoom out',
  treeReset: 'Centre on you',

  detailYou: 'You call them',
  detailThem: 'They call you',
  detailSay: 'Say it out loud',
  detailHear: 'Hear the greeting',
  detailPronounce: 'Pronounce',
  detailNoVoice: 'No voice',
  detailSave: 'Save',
  detailSaved: 'Saved',
  detailClose: 'Close',
  detailFoot: 'Cội · bảng xưng hô, not a dictionary',

  nameLabel: 'Their name',
  namePlaceholder: 'e.g. Uncle Bình',
  nameSave: 'Save name',
  nameRemove: 'Remove name',
  nameHint: 'Saved on this device, and searchable.',

  learnEyebrow: 'Bài học · lessons',
  learnTitle: 'Six tones.',
  learnTitleEm: 'One family.',
  learnLede:
    'Vietnamese lives in its tones, and the family words live in Vietnamese. Start with the six shapes of a single syllable, then use them on people.',
  learnTones: 'Sáu thanh điệu · six tones',
  learnTap: 'tap to hear',
  learnPhrases: 'Say it before you need it',
  learnRule: 'The rule behind every pronoun',
  learnRuleBody:
    'Pick the word for the other person, and your own word is already decided: chú means you are cháu, anh means you are em. There is no neutral “I” in a family conversation — the pronoun is the relationship, spoken from both ends.',
  learnAudio:
    'Audio uses your phone’s Vietnamese voice. Add one in Settings → Accessibility → Spoken Content if it sounds like English.',

  account: 'Account',
  accountIntro: 'A small handbook for Vietnamese kinship, made to live on the Home Screen.',
  accountLanguage: 'Language',
  accountNames: 'Named people',
  accountNoNames: 'No names yet. Open a relative and add theirs.',
  accountData: 'Names are stored only on this device.',
  accountVersion: 'Version',
  accountClose: 'Close',
}

const VI: Copy = {
  langLabel: 'Ngôn ngữ',
  tabsLabel: 'Mục',
  tabAsk: 'Hỏi',
  tabTree: 'Cây',
  tabLearn: 'Học',

  installTitle: 'Đưa Cội ra Màn hình chính',
  installHint: 'Chia sẻ, rồi Thêm vào MH chính',
  installDismiss: 'Bỏ qua',

  askEyebrow: 'Bảng xưng hô · kinship',
  askTitle: 'Người này là',
  askTitleEm: 'ai',
  askTitleTail: 'với bạn?',
  askLede: 'Viết quan hệ theo cách bạn vẫn nói. Cội trả lời từ bạn gọi họ — và từ họ gọi bạn.',
  askPlaceholder: 'Mẹ của tôi',
  askHint: 'Một quan hệ — hoặc tên bạn đã lưu.',
  askClear: 'Xoá tìm kiếm',
  askStart: 'Bắt đầu với',
  askRecent: 'Gần đây',
  askPeople: 'Người của bạn',
  askOther: 'Cách gọi khác',
  askOne: 'Một cách gọi. Chuỗi này không mơ hồ.',
  askEmptyLabel: 'Không tìm thấy',
  askEmptyBody:
    'Hãy mô tả cả chuỗi thay vì chức danh — “chị gái của bố” hay “chồng của chị tôi”. Bốn từ là vừa đủ.',
  emptyTitle: (query) => `Chưa có kết quả cho “${query}”.`,
  heroYou: 'Bạn gọi họ',
  heroThem: 'Họ gọi bạn',
  hearIt: 'Nghe',
  fullPicture: 'Xem đầy đủ',
  namedBadge: 'tên bạn đặt',
  factsLabel: 'Ba điều nên biết',
  facts: [
    {
      title: 'Đại từ là quan hệ, không phải người.',
      body: 'Bố của bạn bạn là chú với bạn, nhưng là bác với người hơn bạn hai tuổi.',
    },
    {
      title: 'Tuổi quan trọng hơn vai vế.',
      body: 'Bạn cần biết người đó lớn hay nhỏ hơn người nối bạn với họ — chỉ một điều đó đổi cách gọi.',
    },
    {
      title: 'Bạn cũng đổi.',
      body: 'Khi nói với chú, bạn là cháu. Cặp từ đi cùng nhau, cả hai chiều, trong cùng một câu.',
    },
  ],
  chips: ['Mẹ của tôi', 'Ông nội', 'Cậu', 'Chị dâu'],

  treeEyebrow: 'Cây gia đình · family tree',
  treeTitle: 'Gia đình bạn,',
  treeTitleEm: 'trên bản đồ',
  treeTitleTail: '.',
  treeLede:
    'Một bản đồ, đọc từ bạn mà ra. Kéo để di chuyển, phóng to, và chạm vào một người để lần theo đúng quan hệ giữa hai người.',
  treeMapLabel: 'Bản đồ · the map',
  treeDrag: 'kéo · phóng to',
  treeHint: 'Bạn là gốc. Chạm vào một người để lần ngược đường về bạn.',
  treeOpen: 'Mở',
  treeSelf: 'góc nhìn',
  treeNoi: 'bên nội',
  treeNgoai: 'bên ngoại',
  treeZoomIn: 'Phóng to',
  treeZoomOut: 'Thu nhỏ',
  treeReset: 'Về giữa bạn',

  detailYou: 'Bạn gọi họ',
  detailThem: 'Họ gọi bạn',
  detailSay: 'Nói thành tiếng',
  detailHear: 'Nghe câu chào',
  detailPronounce: 'Phát âm',
  detailNoVoice: 'Không có giọng',
  detailSave: 'Lưu',
  detailSaved: 'Đã lưu',
  detailClose: 'Đóng',
  detailFoot: 'Cội · bảng xưng hô, không phải từ điển',

  nameLabel: 'Tên của họ',
  namePlaceholder: 'ví dụ: Bác Bình',
  nameSave: 'Lưu tên',
  nameRemove: 'Xoá tên',
  nameHint: 'Lưu trên thiết bị này, và tìm được.',

  learnEyebrow: 'Bài học · lessons',
  learnTitle: 'Sáu thanh điệu.',
  learnTitleEm: 'Một nhà.',
  learnLede:
    'Tiếng Việt sống trong thanh điệu, và từ chỉ người sống trong tiếng Việt. Bắt đầu với sáu dáng của một âm tiết, rồi dùng chúng với người.',
  learnTones: 'Sáu thanh điệu · six tones',
  learnTap: 'chạm để nghe',
  learnPhrases: 'Nói trước khi cần',
  learnRule: 'Quy tắc sau mỗi đại từ',
  learnRuleBody:
    'Chọn từ cho người kia, từ của bạn đã được quyết định: chú nghĩa là bạn là cháu, anh nghĩa là bạn là em. Trong câu chuyện gia đình không có “tôi” trung tính — đại từ chính là quan hệ, nói từ cả hai phía.',
  learnAudio:
    'Âm thanh dùng giọng tiếng Việt của điện thoại. Thêm giọng trong Cài đặt → Trợ năng → Nội dung đọc nếu nghe như tiếng Anh.',

  account: 'Tài khoản',
  accountIntro: 'Một cuốn sổ nhỏ về cách xưng hô, để sống trên Màn hình chính.',
  accountLanguage: 'Ngôn ngữ',
  accountNames: 'Người đã đặt tên',
  accountNoNames: 'Chưa có tên nào. Mở một người thân và thêm tên của họ.',
  accountData: 'Tên chỉ được lưu trên thiết bị này.',
  accountVersion: 'Phiên bản',
  accountClose: 'Đóng',
}

const SV: Copy = {
  langLabel: 'Språk',
  tabsLabel: 'Avsnitt',
  tabAsk: 'Fråga',
  tabTree: 'Träd',
  tabLearn: 'Lär',

  installTitle: 'Lägg Cội på hemskärmen',
  installHint: 'Dela, sedan Lägg till på hemskärmen',
  installDismiss: 'Stäng',

  askEyebrow: 'Släktord · kinship',
  askTitle: 'Vem är den här',
  askTitleEm: 'personen',
  askTitleTail: 'för dig?',
  askLede:
    'Skriv det som du skulle förklara det högt. Cội svarar med ordet du använder för dem — och det de använder för dig.',
  askPlaceholder: 'min mammas yngre bror',
  askHint: 'En släkting — eller ett namn du sparat.',
  askClear: 'Rensa sökningen',
  askStart: 'Börja med',
  askRecent: 'Senaste',
  askPeople: 'Dina personer',
  askOther: 'Andra läsningar',
  askOne: 'En läsning. Inget tvetydigt i den kedjan.',
  askEmptyLabel: 'Inget hittat',
  askEmptyBody:
    'Beskriv kedjan i stället för titeln — “pappas äldre syster” eller “min systers man”. Fyra ord är lagom.',
  emptyTitle: (query) => `Inget resultat för “${query}” ännu.`,
  heroYou: 'Du kallar dem',
  heroThem: 'De kallar dig',
  hearIt: 'Lyssna',
  fullPicture: 'Hela bilden',
  namedBadge: 'ditt namn',
  factsLabel: 'Tre saker att veta',
  facts: [
    {
      title: 'Pronomen är en relation, inte en person.',
      body: 'Din väns pappa är chú för dig och bác för någon två år äldre.',
    },
    {
      title: 'Ålder slår släkt.',
      body: 'Du måste veta om personen är äldre eller yngre än den som förbinder er — det enda avgör ordet.',
    },
    {
      title: 'Du förändras också.',
      body: 'När du talar till chú är du cháu. Paret rör sig tillsammans, åt båda håll, i samma mening.',
    },
  ],
  chips: [
    'min mammas yngre bror',
    'min pappas äldre syster',
    'min frus mamma',
    'min äldre brors son',
  ],

  treeEyebrow: 'Släktträd · family tree',
  treeTitle: 'Din familj,',
  treeTitleEm: 'kartlagd',
  treeTitleTail: '.',
  treeLede:
    'En karta, läst utåt från dig. Dra för att flytta, zooma, och tryck på någon för att spåra exakt hur ni är släkt.',
  treeMapLabel: 'Kartan · the map',
  treeDrag: 'dra · zooma',
  treeHint: 'Du är roten. Tryck på någon för att spåra linjen tillbaka till dig.',
  treeOpen: 'Öppna',
  treeSelf: 'utgångspunkten',
  treeNoi: 'bên nội',
  treeNgoai: 'bên ngoại',
  treeZoomIn: 'Zooma in',
  treeZoomOut: 'Zooma ut',
  treeReset: 'Centrera på dig',

  detailYou: 'Du kallar dem',
  detailThem: 'De kallar dig',
  detailSay: 'Säg det högt',
  detailHear: 'Hör hälsningen',
  detailPronounce: 'Uttala',
  detailNoVoice: 'Ingen röst',
  detailSave: 'Spara',
  detailSaved: 'Sparad',
  detailClose: 'Stäng',
  detailFoot: 'Cội · släktskap, inte en ordbok',

  nameLabel: 'Deras namn',
  namePlaceholder: 't.ex. Farbror Bình',
  nameSave: 'Spara namn',
  nameRemove: 'Ta bort namn',
  nameHint: 'Sparas på den här enheten och går att söka.',

  learnEyebrow: 'Lektioner · lessons',
  learnTitle: 'Sex toner.',
  learnTitleEm: 'En familj.',
  learnLede:
    'Vietnamesiskan lever i tonerna, och släktorden lever i vietnamesiskan. Börja med sex former av en stavelse, använd dem sedan på människor.',
  learnTones: 'Sex toner · six tones',
  learnTap: 'tryck för att lyssna',
  learnPhrases: 'Säg det innan du behöver det',
  learnRule: 'Regeln bakom varje pronomen',
  learnRuleBody:
    'Välj ordet för den andra, och ditt eget ord är redan bestämt: chú betyder att du är cháu, anh att du är em. Det finns inget neutralt “jag” i ett familjesamtal — pronomenet är relationen, sagt från båda håll.',
  learnAudio:
    'Ljudet använder telefonens vietnamesiska röst. Lägg till en i Inställningar → Tillgänglighet → Uppläst innehåll om det låter engelskt.',

  account: 'Konto',
  accountIntro: 'En liten handbok för vietnamesiskt släktskap, gjord för hemskärmen.',
  accountLanguage: 'Språk',
  accountNames: 'Namngivna personer',
  accountNoNames: 'Inga namn än. Öppna en släkting och lägg till namnet.',
  accountData: 'Namnen sparas bara på den här enheten.',
  accountVersion: 'Version',
  accountClose: 'Stäng',
}

export const COPY: Record<Lang, Copy> = { en: EN, vi: VI, sv: SV }
