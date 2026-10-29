export type Phrase = { vi: string; en: string; note?: string }

export const TONES: { word: string; tone: string; en: string; contour: string }[] = [
  { word: 'ma', tone: 'ngang', en: 'ghost', contour: 'level' },
  { word: 'mà', tone: 'huyền', en: 'but, however', contour: 'falls' },
  { word: 'mã', tone: 'ngã', en: 'code; a chess knight', contour: 'breaks up' },
  { word: 'mả', tone: 'hỏi', en: 'tomb', contour: 'dips, then lifts' },
  { word: 'má', tone: 'sắc', en: 'cheek; mom (south)', contour: 'rises' },
  { word: 'mạ', tone: 'nặng', en: 'rice seedling', contour: 'drops, heavy' },
]

export const PHRASES: Phrase[] = [
  {
    vi: 'Dạ, cháu chào bác ạ.',
    en: 'Hello, bác.',
    note: 'Dạ opens the sentence, ạ closes it. Politeness lives at both edges.',
  },
  {
    vi: 'Dạ, con chào bố mẹ ạ.',
    en: 'Hello, dad and mom.',
    note: 'You are con to them, so you announce yourself as con — not “tôi”.',
  },
  {
    vi: 'Em chào anh ạ.',
    en: 'Hello, older brother.',
    note: 'The younger speaker is em, the older is anh. Both are first person, depending on the room.',
  },
  {
    vi: 'Anh ăn cơm chưa ạ?',
    en: 'Have you eaten yet?',
    note: 'The standard warm greeting — a real question about lunch, not small talk.',
  },
  {
    vi: 'Cảm ơn chú ạ.',
    en: 'Thank you, chú.',
    note: 'Thanks take the pronoun, not “bạn”. Using the right one is most of the courtesy.',
  },
  {
    vi: 'Dạ, vâng ạ.',
    en: 'Yes, sir / ma’am.',
    note: 'Vâng agrees, dạ acknowledges. Together they are the polite yes.',
  },
]
