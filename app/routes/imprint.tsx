import type { Route } from "./+types/imprint";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Impressum · Risky Bit" }];
}

export default function Imprint() {
  return (
    <section className="view">
      <div className="wrap">
        <div className="page-h">
          <p className="eyebrow">Rechtliche Informationen</p>
          <h1>Impressum</h1>
        </div>
        <div className="prose"></div>
      </div>
    </section>
  );
}
