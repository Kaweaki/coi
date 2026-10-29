/** Speech synthesis with a Vietnamese voice when the device has one. */

let voices: SpeechSynthesisVoice[] = []

function refresh() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
  voices = window.speechSynthesis.getVoices()
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  refresh()
  window.speechSynthesis.addEventListener?.('voiceschanged', refresh)
}

export function hasSpeech(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

function vietnameseVoice(): SpeechSynthesisVoice | null {
  if (!voices.length) refresh()
  return (
    voices.find((voice) => voice.lang?.toLowerCase().startsWith('vi')) ??
    voices.find((voice) => /vietnam/i.test(voice.name)) ??
    null
  )
}

export function speak(text: string): boolean {
  if (!hasSpeech()) return false
  try {
    const utterance = new SpeechSynthesisUtterance(text)
    const voice = vietnameseVoice()
    if (voice) utterance.voice = voice
    utterance.lang = voice?.lang ?? 'vi-VN'
    utterance.rate = 0.82
    utterance.pitch = 1
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
    return true
  } catch {
    return false
  }
}
