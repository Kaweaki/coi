export type Phrase = { vi: string; en: string; note?: string; noteVi?: string }

export const TONES: {
  word: string
  tone: string
  en: string
  vi: string
  contour: string
  contourVi: string
}[] = [
  {
    word: 'ma',
    tone: 'ngang',
    en: 'ghost',
    vi: 'con ma',
    contour: 'level',
    contourVi: 'bằng phẳng',
  },
  {
    word: 'mà',
    tone: 'huyền',
    en: 'but, however',
    vi: 'nhưng',
    contour: 'falls',
    contourVi: 'hạ giọng',
  },
  {
    word: 'mã',
    tone: 'ngã',
    en: 'code; a chess knight',
    vi: 'mã (con mã)',
    contour: 'breaks up',
    contourVi: 'gãy giọng',
  },
  {
    word: 'mả',
    tone: 'hỏi',
    en: 'tomb',
    vi: 'mả (ngôi mộ)',
    contour: 'dips, then lifts',
    contourVi: 'xuống rồi lên',
  },
  {
    word: 'má',
    tone: 'sắc',
    en: 'cheek; mom (south)',
    vi: 'má (mẹ, miền Nam)',
    contour: 'rises',
    contourVi: 'lên giọng',
  },
  {
    word: 'mạ',
    tone: 'nặng',
    en: 'rice seedling',
    vi: 'mạ (cây mạ)',
    contour: 'drops, heavy',
    contourVi: 'nặng, hạ xuống',
  },
]

export const PHRASES: Phrase[] = [
  {
    vi: 'Dạ, cháu chào bác ạ.',
    en: 'Hello, bác.',
    note: 'Dạ opens the sentence, ạ closes it. Politeness lives at both edges.',
    noteVi: 'Dạ mở câu, ạ đóng câu. Phép lịch sự nằm ở hai đầu.',
  },
  {
    vi: 'Dạ, con chào bố mẹ ạ.',
    en: 'Hello, dad and mom.',
    note: 'You are con to them, so you announce yourself as con — not “tôi”.',
    noteVi: 'Bạn là con với họ, nên bạn xưng con — không phải “tôi”.',
  },
  {
    vi: 'Em chào anh ạ.',
    en: 'Hello, older brother.',
    note: 'The younger speaker is em, the older is anh. Both are first person, depending on the room.',
    noteVi:
      'Người nói nhỏ hơn là em, người lớn hơn là anh. Cả hai đều là ngôi thứ nhất, tuỳ người đối diện.',
  },
  {
    vi: 'Anh ăn cơm chưa ạ?',
    en: 'Have you eaten yet?',
    note: 'The standard warm greeting — a real question about lunch, not small talk.',
    noteVi: 'Câu chào quen thuộc — hỏi thật về bữa ăn, không phải câu xã giao.',
  },
  {
    vi: 'Cảm ơn chú ạ.',
    en: 'Thank you, chú.',
    note: 'Thanks take the pronoun, not “bạn”. Using the right one is most of the courtesy.',
    noteVi: 'Cảm ơn đi với đại từ, không phải “bạn”. Dùng đúng đại từ là phần lớn của phép lịch sự.',
  },
  {
    vi: 'Dạ, vâng ạ.',
    en: 'Yes, sir / ma’am.',
    note: 'Vâng agrees, dạ acknowledges. Together they are the polite yes.',
    noteVi: 'Vâng là đồng ý, dạ là nhận lời. Cùng nhau thành câu “vâng” lễ phép.',
  },
]
