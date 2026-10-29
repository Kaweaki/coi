import { PHRASES, TONES } from '../data/phrases'
import { rise } from '../lib/motion'
import { hasSpeech, speak } from '../lib/speech'
import { SoundIcon } from './Icons'

export function Learn() {
  const spoken = hasSpeech()

  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">Bài học · lessons</span>
        <h1 className="display">
          Six tones. <em>One family.</em>
        </h1>
        <p className="lede">
          Vietnamese lives in its tones, and the family words live in Vietnamese. Start with the six
          shapes of a single syllable, then use them on people.
        </p>
      </section>

      <section className="lesson rise" style={rise(1)}>
        <div className="lesson__head">
          <span className="label">Sáu thanh điệu · six tones</span>
          <span className="lesson__hint">tap to hear</span>
        </div>
        <div className="tones">
          {TONES.map((tone) => (
            <button
              key={tone.tone}
              type="button"
              className="tone"
              onClick={() => speak(tone.word)}
              disabled={!spoken}
            >
              <span className="tone__word">{tone.word}</span>
              <span className="tone__meta">
                <span className="tone__name">{tone.tone}</span>
                <span className="tone__en">{tone.en}</span>
                <span className="tone__contour">{tone.contour}</span>
              </span>
              <SoundIcon size={13} className="tone__icon" />
            </button>
          ))}
        </div>
      </section>

      <section className="block rise" style={rise(2)}>
        <div className="block__head">
          <span className="label">Say it before you need it</span>
          <span className="block__count">{PHRASES.length}</span>
        </div>
        <div className="phrases">
          {PHRASES.map((phrase) => (
            <button
              key={phrase.vi}
              type="button"
              className="phrase"
              onClick={() => speak(phrase.vi)}
              disabled={!spoken}
            >
              <span className="phrase__vi">{phrase.vi}</span>
              <span className="phrase__en">{phrase.en}</span>
              {phrase.note ? <span className="phrase__note">{phrase.note}</span> : null}
              <span className="phrase__play" aria-hidden>
                <SoundIcon size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="note-card rise" style={rise(3)}>
        <span className="label">The rule behind every pronoun</span>
        <p>
          Pick the word for the other person, and your own word is already decided: chú means you are
          cháu, anh means you are em. There is no neutral “I” in a family conversation — the pronoun
          is the relationship, spoken from both ends.
        </p>
      </section>

      <p className="tail-note">
        Audio uses your phone’s Vietnamese voice. Add one in Settings → Accessibility → Spoken
        Content if it sounds like English.
      </p>
    </>
  )
}
