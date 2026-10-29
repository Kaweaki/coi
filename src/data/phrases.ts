export type Phrase = { vi: string; en: string; sv: string; note?: string; noteVi?: string; noteSv?: string }

export const TONES: {
  word: string
  tone: string
  en: string
  vi: string
  sv: string
  contour: string
  contourVi: string
  contourSv: string
}[] = [
  {
    word: 'ma',
    tone: 'ngang',
    en: 'ghost',
    vi: 'con ma',
    sv: 'spöke',
    contour: 'level',
    contourVi: 'bằng phẳng',
    contourSv: 'jämn',
  },
  {
    word: 'mà',
    tone: 'huyền',
    en: 'but, however',
    vi: 'nhưng',
    sv: 'men',
    contour: 'falls',
    contourVi: 'hạ giọng',
    contourSv: 'faller',
  },
  {
    word: 'mã',
    tone: 'ngã',
    en: 'code; a chess knight',
    vi: 'mã (con mã)',
    sv: 'kod; en schackhäst',
    contour: 'breaks up',
    contourVi: 'gãy giọng',
    contourSv: 'bryts',
  },
  {
    word: 'mả',
    tone: 'hỏi',
    en: 'tomb',
    vi: 'mả (ngôi mộ)',
    sv: 'grav',
    contour: 'dips, then lifts',
    contourVi: 'xuống rồi lên',
    contourSv: 'dyker, stiger',
  },
  {
    word: 'má',
    tone: 'sắc',
    en: 'cheek; mom (south)',
    vi: 'má (mẹ, miền Nam)',
    sv: 'kind; mamma (söder)',
    contour: 'rises',
    contourVi: 'lên giọng',
    contourSv: 'stiger',
  },
  {
    word: 'mạ',
    tone: 'nặng',
    en: 'rice seedling',
    vi: 'mạ (cây mạ)',
    sv: 'risplanta',
    contour: 'drops, heavy',
    contourVi: 'nặng, hạ xuống',
    contourSv: 'tungt fall',
  },
]

export const PHRASES: Phrase[] = [
  {
    vi: 'Dạ, cháu chào bác ạ.',
    en: 'Hello, bác.',
    sv: 'Hej, bác.',
    note: 'Dạ opens the sentence, ạ closes it. Politeness lives at both edges.',
    noteVi: 'Dạ mở câu, ạ đóng câu. Phép lịch sự nằm ở hai đầu.',
    noteSv: 'Dạ öppnar meningen, ạ stänger den. Artigheten sitter i båda kanterna.',
  },
  {
    vi: 'Dạ, con chào bố mẹ ạ.',
    en: 'Hello, dad and mom.',
    sv: 'Hej, pappa och mamma.',
    note: 'You are con to them, so you announce yourself as con — not “tôi”.',
    noteVi: 'Bạn là con với họ, nên bạn xưng con — không phải “tôi”.',
    noteSv: 'Du är con för dem, så du presenterar dig som con — inte “tôi”.',
  },
  {
    vi: 'Em chào anh ạ.',
    en: 'Hello, older brother.',
    sv: 'Hej, storebror.',
    note: 'The younger speaker is em, the older is anh. Both are first person, depending on the room.',
    noteVi:
      'Người nói nhỏ hơn là em, người lớn hơn là anh. Cả hai đều là ngôi thứ nhất, tuỳ người đối diện.',
    noteSv:
      'Den yngre talaren är em, den äldre är anh. Båda är jag, beroende på vem som är i rummet.',
  },
  {
    vi: 'Anh ăn cơm chưa ạ?',
    en: 'Have you eaten yet?',
    sv: 'Har du ätit än?',
    note: 'The standard warm greeting — a real question about lunch, not small talk.',
    noteVi: 'Câu chào quen thuộc — hỏi thật về bữa ăn, không phải câu xã giao.',
    noteSv: 'Den varma standardhälsningen — en riktig fråga om lunch, inte kallprat.',
  },
  {
    vi: 'Cảm ơn chú ạ.',
    en: 'Thank you, chú.',
    sv: 'Tack, chú.',
    note: 'Thanks take the pronoun, not “bạn”. Using the right one is most of the courtesy.',
    noteVi: 'Cảm ơn đi với đại từ, không phải “bạn”. Dùng đúng đại từ là phần lớn của phép lịch sự.',
    noteSv: 'Tack tar pronomenet, inte “bạn”. Rätt ord är det mesta av artigheten.',
  },
  {
    vi: 'Dạ, vâng ạ.',
    en: 'Yes, sir / ma’am.',
    sv: 'Ja, sir / fru.',
    note: 'Vâng agrees, dạ acknowledges. Together they are the polite yes.',
    noteVi: 'Vâng là đồng ý, dạ là nhận lời. Cùng nhau thành câu “vâng” lễ phép.',
    noteSv: 'Vâng instämmer, dạ bekräftar. Tillsammans är de det artiga jaet.',
  },
]
