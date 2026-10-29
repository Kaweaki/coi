import { PHRASES, TONES } from '../data/phrases'
import { useLang } from '../lib/lang'
import { rise } from '../lib/motion'
import { hasSpeech, speak } from '../lib/speech'
import { SoundIcon } from './Icons'

export function Learn() {
  const { lang, t } = useLang()
  const spoken = hasSpeech()

  return (
    <>
      <section className="intro rise" style={rise(0)}>
        <span className="eyebrow">{t.learnEyebrow}</span>
        <h1 className="display">
          {t.learnTitle} <em>{t.learnTitleEm}</em>
        </h1>
        <p className="lede">{t.learnLede}</p>
      </section>

      <section className="lesson rise" style={rise(1)}>
        <div className="lesson__head">
          <span className="label">{t.learnTones}</span>
          <span className="lesson__hint">{t.learnTap}</span>
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
                <span className="tone__en">{lang === 'vi' ? tone.vi : tone.en}</span>
                <span className="tone__contour">
                  {lang === 'vi' ? tone.contourVi : tone.contour}
                </span>
              </span>
              <SoundIcon size={13} className="tone__icon" />
            </button>
          ))}
        </div>
      </section>

      <section className="block rise" style={rise(2)}>
        <div className="block__head">
          <span className="label">{t.learnPhrases}</span>
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
              {phrase.note ? (
                <span className="phrase__note">
                  {lang === 'vi' && phrase.noteVi ? phrase.noteVi : phrase.note}
                </span>
              ) : null}
              <span className="phrase__play" aria-hidden>
                <SoundIcon size={14} />
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="note-card rise" style={rise(3)}>
        <span className="label">{t.learnRule}</span>
        <p>{t.learnRuleBody}</p>
      </section>

      <p className="tail-note">{t.learnAudio}</p>
    </>
  )
}
