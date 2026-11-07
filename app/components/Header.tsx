import { Link, NavLink, useNavigate } from "react-router";
import { useApp } from "~/context/AppContext";
import { fmtPts } from "~/utils/format";
import iconDark from "~/assets/logo-icon-dark.png";
import iconLight from "~/assets/logo-icon-light.png";
import textDark from "~/assets/logo-text-dark.png";
import textLight from "~/assets/logo-text-light.png";

export default function Header() {
  const { isLoggedIn, logout, username, points } = useApp();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/");
  };

  const hasChip = isLoggedIn && (username || points != null);

  return (
      <header className="top">
        <div className="top-in">
          <Link className="brand" to={isLoggedIn ? "/terminal" : "/"}>
            <img className="logo-icon on-dark" src={iconDark} alt="" />
            <img className="logo-icon on-light" src={iconLight} alt="" />
            <img className="logo-text on-dark" src={textDark} alt="Risky Bit" />
            <img className="logo-text on-light" src={textLight} alt="Risky Bit" />
          </Link>

          {isLoggedIn && (
              <nav className="nav" aria-label="Hauptnavigation">
                <NavLink to="/terminal">Challenge</NavLink>
                <NavLink to="/leaderboard">Leaderboard</NavLink>
                <NavLink to="/resources">Lernressourcen</NavLink>
              </nav>
          )}

          <div className="top-r">
            {hasChip && (
                <div className="chip" aria-label="Dein Punktestand">
                  <span className="chip-name">{username}</span>
                  <b>{points != null && `${fmtPts(points)} Pkt.`}</b>
                </div>
            )}
            <NavLink className="icon-btn" to="/settings" aria-label="Einstellungen">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="miter" aria-hidden="true"><path d="M3 7h18M3 17h18" /><rect x="14" y="4" width="4" height="6" fill="var(--bg-color)" /><rect x="6" y="14" width="4" height="6" fill="var(--bg-color)" /></svg>
            </NavLink>
            {isLoggedIn && (
                <button className="link-btn" type="button" onClick={signOut}>Abmelden</button>
            )}
          </div>
        </div>
      </header>
  );
}