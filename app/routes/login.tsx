import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useLocation } from 'react-router'
import type { Route } from './+types/login'
import { useApp } from '~/context/AppContext'
import { useCookieAcknowledged } from '~/utils/cookies'
import { api } from '~/api/clients'

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Risky Bit' }]
}

type ApiUser = {
  id?: number
  email?: string
  role?: number
  username?: string
  lobbyId?: string
  points?: number | null
}

type AuthResponse = {
  user?: ApiUser
  message?: string
}

export default function Login() {
  const { isLoggedIn, authChecked, login } = useApp()
  const location = useLocation()
  const [tab, setTab] = useState<'reg' | 'login'>('reg')

  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const infoRef = useRef<HTMLDivElement>(null)
  const acknowledged = useCookieAcknowledged()
  const blocked = acknowledged === false

  // All hooks are above this line, so these early returns are safe
  const from = location.state?.from?.pathname || '/terminal'
  if (isLoggedIn) return <Navigate to={from} replace />
  if (!authChecked) {
    return (
      <section className="view view-login">
        <div className="hero">
          <div className="wrap">
            <p className="lead">Wird geladen...</p>
          </div>
        </div>
      </section>
    )
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (blocked || loading) return

    setLoading(true)
    setErrorMessage(null)

    // Read everything from the form BEFORE any await
    const formData = new FormData(e.currentTarget)
    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const code = String(formData.get('code') ?? '').trim()
    const typedUsername = String(formData.get('username') ?? '').trim()

    try {
      const res =
        tab === 'reg'
          ? await api('/api/auth/register', {
              method: 'POST',
              body: JSON.stringify({ username: typedUsername, email, password, code }),
            })
          : await api('/api/auth/login', {
              method: 'POST',
              body: JSON.stringify({ email, password }),
            })

      const data: AuthResponse = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || 'Authentifizierung fehlgeschlagen.')
      }

      const user = data.user
      if (!user) {
        throw new Error('Ungültige Server-Antwort.')
      }

      const ok = login({
        lobbyId: user.lobbyId ?? code,
        username: user.username ?? (typedUsername || email.split('@')[0]),
        points: user.points ?? null,
      })

      if (!ok) {
        throw new Error('Bitte bestätige zuerst den Cookie-Hinweis.')
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Ein unerwarteter Fehler ist aufgetreten.')
    } finally {
      setLoading(false)
    }
  }

  const scrollToInfo = () => {
    infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const switchTab = (t: 'reg' | 'login') => {
    setTab(t)
    setErrorMessage(null)
  }

  return (
    <section className="view view-login">
      <div className="hero">
        <div className="wrap login">
          <div>
            <h1><em>Hacking</em> ohne Constraints</h1>
            <p className="lead">Risky Bit ist eine Hacking-Challenge für Klassen und Gruppen. Gib bei deinem ersten Besuch den Lobbycode deines Veranstalter-Teams ein und lege Benutzername, E-Mail und Passwort fest. Danach meldest du dich nur noch mit E-Mail und Passwort an.</p>
            <button className="btn ghost cta" type="button" onClick={scrollToInfo}>Mehr zur Challenge ↓</button>
          </div>

          <div>
            <div className="panel card bracket">
              <div className="tabs" role="tablist" aria-label="Anmeldeart">
                <button type="button" role="tab" id="tabReg" aria-selected={tab === 'reg'} aria-controls="pReg" onClick={() => switchTab('reg')}>Registrieren</button>
                <button type="button" role="tab" id="tabLogin" aria-selected={tab === 'login'} aria-controls="pLogin" onClick={() => switchTab('login')}>Anmelden</button>
              </div>

              {errorMessage && (
                <div className="form-error" role="alert" style={{ color: 'var(--color-error, red)', margin: '1rem 0' }}>
                  {errorMessage}
                </div>
              )}

              {tab === 'reg' && (
                <form className="form" id="pReg" role="tabpanel" aria-labelledby="tabReg" onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="code">Lobbycode</label>
                    <input className="code" id="code" name="code" type="text" pattern="[A-Za-z]{2}-[A-Za-z0-9]{4}-[A-Za-z0-9]{4}" title="Format: RL-XXXX-XXXX" autoComplete="off" spellCheck={false} required />
                  </div>
                  <div className="field">
                    <label htmlFor="regUser">Benutzername</label>
                    <input id="regUser" name="username" type="text" placeholder="dein_name" minLength={3} autoComplete="username" required />
                  </div>
                  <div className="field">
                    <label htmlFor="regMail">E-Mail</label>
                    <input id="regMail" name="email" type="email" placeholder="du@example.com" autoComplete="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="regPw">Passwort</label>
                    <input id="regPw" name="password" type="password" placeholder="Mindestens 8 Zeichen" minLength={8} autoComplete="new-password" required />
                  </div>
                  {blocked && <p className="form-note" role="alert">Bitte bestätige zuerst den Cookie-Hinweis am unteren Rand. Ohne ihn ist keine Anmeldung möglich.</p>}
                  <button className="btn" type="submit" disabled={blocked || loading}>
                    {loading ? 'Wird geladen...' : 'Registrieren und beitreten'}
                  </button>
                  <p className="hint">Das ist nur beim ersten Mal nötig. Dein Fortschritt wird an Lobbycode, E-Mail und Passwort gebunden.</p>
                </form>
              )}

              {tab === 'login' && (
                <form className="form" id="pLogin" role="tabpanel" aria-labelledby="tabLogin" onSubmit={submit}>
                  <div className="field">
                    <label htmlFor="email">E-Mail</label>
                    <input id="email" name="email" type="email" placeholder="du@example.com" autoComplete="email" required />
                  </div>
                  <div className="field">
                    <label htmlFor="pw">Passwort</label>
                    <input id="pw" name="password" type="password" placeholder="Dein Passwort" autoComplete="current-password" required />
                  </div>
                  {blocked && <p className="form-note" role="alert">Bitte bestätige zuerst den Cookie-Hinweis am unteren Rand. Ohne ihn ist keine Anmeldung möglich.</p>}
                  <button className="btn" type="submit" disabled={blocked || loading}>
                    {loading ? 'Wird geladen...' : 'Anmelden'}
                  </button>
                  <p className="hint">Noch nicht registriert? Wechsle oben zu „Registrieren“ und nutze deinen Lobbycode.</p>
                </form>
              )}
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
