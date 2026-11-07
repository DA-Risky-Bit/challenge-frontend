import { NavLink } from "react-router";

export default function Footer() {
  return (
    <footer className="foot">
      <span>© 2026 Risky Bit · Diplomarbeit HTL Rennweg</span>
      <NavLink to="/impressum">Impressum</NavLink>
    </footer>
  );
}
