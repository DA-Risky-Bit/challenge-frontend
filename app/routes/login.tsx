import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { Route } from './+types/login'
import { useApp } from '~/context/AppContext'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Risky Bit' }]
}

export default function Login() {
  const { isLoggedIn, login } = useApp()
  const location = useLocation()
  const [tab, setTab] = useState<'reg' | 'login'>('reg')
  const infoRef = useRef<HTMLDivElement>(null)

  const from = location.state?.from?.pathname || '/terminal'
  if (isLoggedIn) return <Navigate to={from} replace />

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
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
                <button className="btn" type="submit">Registrieren und beitreten</button>
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
                <button className="btn" type="submit">Anmelden</button>
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
            <h2>[Überschrift einfügen]</h2>
          </div>
          <div className="info-grid">
            <article className="info-b">
              <h3>Inidividuelle Challenges</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            </article>
            <article className="info-b">
              <h3>[Titel 2]</h3>
              <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </article>
            <article className="info-b">
              <h3>[Titel 3]</h3>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
            </article>
          </div>
          <div className="panel info-wide">
            <div>
              <h3>[Titel 4]</h3>
              <p>Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.</p>
              <p>Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.</p>
            </div>
            <div className="ph-box" aria-hidden="true"><span>Bild oder Grafik</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
