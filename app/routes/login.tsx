import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { Route } from './+types/login'
import { useApp } from '~/context/AppContext'
import { useCookieAcknowledged } from '~/utils/cookies'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Risky Bit' }]
}

export default function Login() {
  const { isLoggedIn, login } = useApp()
  const location = useLocation()
  const [tab, setTab] = useState<'reg' | 'login'>('reg')
  const infoRef = useRef<HTMLDivElement>(null)
  const acknowledged = useCookieAcknowledged()
  const blocked = acknowledged === false

  const from = location.state?.from?.pathname || '/terminal'
  if (isLoggedIn) return <Navigate to={from} replace />

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blocked) return
    login()
  }

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
      <section className="view view-login">
        <div className="hero">
          <div className="wrap login">
            <div>
              <h1><em>Hacking</em> ohne Constraints</h1>
              <p className="lead">Risky Bit ist eine Hacking-Challenge für Klassen und Gruppen. Gib bei deinem ersten Besuch den Lobbycode deines Veranstalter-Teams ein und lege E-Mail und Passwort fest. Danach meldest du dich nur noch mit E-Mail und Passwort an.</p>
              <button className="btn ghost cta" type="button" onClick={scrollToInfo}>Mehr zur Challenge ↓</button>
            </div>

            <div>
              <div className="panel card bracket">
                <div className="tabs" role="tablist" aria-label="Anmeldeart">
                  <button type="button" role="tab" id="tabReg" aria-selected={tab === 'reg'} aria-controls="pReg" onClick={() => setTab('reg')}>Registrieren</button>
                  <button type="button" role="tab" id="tabLogin" aria-selected={tab === 'login'} aria-controls="pLogin" onClick={() => setTab('login')}>Anmelden</button>
                </div>

                <form className="form" id="pReg" role="tabpanel" aria-labelledby="tabReg" hidden={tab !== 'reg'} onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="code">Lobbycode</label>
                    <input className="code" id="code" name="code" type="text" pattern="[A-Za-z]{2}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}" title="Format: RL-XXXX-XXXX" autoComplete="off" spellCheck={false} />
                  </div>
                  <div className="field">
                    <label htmlFor="regMail">E-Mail</label>
                    <input id="regMail" name="email" type="email" placeholder="du@example.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="regPw">Passwort</label>
                    <input id="regPw" name="pw" type="password" placeholder="Mindestens 8 Zeichen" minLength={8} autoComplete="new-password" />
                  </div>
                  {blocked && <p className="form-note" role="alert">Bitte bestätige zuerst den Cookie-Hinweis am unteren Rand. Ohne ihn ist keine Anmeldung möglich.</p>}
                  <button className="btn" type="submit" disabled={blocked}>Registrieren und beitreten</button>
                  <p className="hint">Das ist nur beim ersten Mal nötig. Dein Fortschritt wird an Lobbycode, E-Mail und Passwort gebunden.</p>
                </form>

                <form className="form" id="pLogin" role="tabpanel" aria-labelledby="tabLogin" hidden={tab !== 'login'} onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="email">E-Mail</label>
                    <input id="email" name="email" type="email" placeholder="du@example.com" />
                  </div>
                  <div className="field">
                    <label htmlFor="pw">Passwort</label>
                    <input id="pw" name="pw" type="password" placeholder="Dein Passwort" autoComplete="current-password" />
                  </div>
                  {blocked && <p className="form-note" role="alert">Bitte bestätige zuerst den Cookie-Hinweis am unteren Rand. Ohne ihn ist keine Anmeldung möglich.</p>}
                  <button className="btn" type="submit" disabled={blocked}>Anmelden</button>
                  <p className="hint">Noch nicht registriert? Wechsle oben zu „Registrieren“ und nutze deinen Lobbycode.</p>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="info" id="info" ref={infoRef}>
          <div className="wrap">
            <div className="info-h">
              <p className="eyebrow">Mehr zur Challenge</p>
              <h2>Über Risky Bit</h2>
            </div>
            <div className="info-grid">
              <article className="info-b">
                <h3>Keine Constraints</h3>
                <p>Risky Bit gibt keine Vorgaben, wie die Challenge gelöst werden soll. Dadurch kann man als User verschiedenste Lösungsansätze ausprobieren und sein Hacking-Geschick unter Beweis stellen.</p>
              </article>
              <article className="info-b">
                <h3>Lernressourcen</h3>
                <p>Mit den eigens erstellten Risky Bit Lernressourcen kann man schnell und einfach relevante Ansätze erhalten. Durch die sorgfältige Auswahl der Themengebiete wird auch sichergestellt, dass nicht jeder Ansatz zum Ziel führt - es liegt am Skill des Users, die richtigen Ansätze zu seinem Vorteil zu nutzen.</p>
              </article>
              <article className="info-b">
                <h3>Flexibilität</h3>
                <p>Durch die geschickten Backend-Lösungen kann Risky Bit sicherstellen, dass auch bei hoher Last die UX auf höchstem Niveau bleibt. Von automatischem Erstellen neuer Container bei hoher Last bis hin zu geregelten Container-Ressourcen kann Risky Bit sicherstellen, dass auch eine hohe Anzahl an Nutzern kein Problem darstellt.</p>
              </article>
            </div>
            <div className="panel info-wide">
              <div>
                <h3>Leaderboard</h3>
                <p>Keine Challenge würde sonderlich viel Spaß bereiten, wenn sie nicht als Wettkampf ausgetragen wird. Daher bietet Risky Bit für jede Lobby ein eigenes, privates Leaderboard, mit dem sich alle Teilnehmer untereinander messen können.</p>
                <p>Dabei wird das eigens für Risky Bit entwickelte Punktesystem verwendet, das sowohl Fairness als auch Spielspaß für alle Nutzer gewährleistet.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
  )
}