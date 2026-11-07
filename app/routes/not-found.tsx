import { Link } from "react-router";
import type { Route } from "./+types/not-found";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Nicht gefunden · Risky Bit" }];
}

export default function NotFound() {
  return (
    <section className="view">
      <div className="wrap">
        <div className="page-h">
          <p className="eyebrow">404</p>
          <h1>Seite nicht gefunden</h1>
        </div>
        <Link className="btn ghost" to="/">Zur Startseite</Link>
      </div>
    </section>
  );
}
