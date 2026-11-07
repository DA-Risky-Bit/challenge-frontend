import type { Route } from "./+types/settings";
import useTheme from "~/hooks/useTheme";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Einstellungen · Risky Bit" }];
}

export default function Settings() {
  const { theme, setTheme } = useTheme();

  return (
      <section className="view">
        <div className="wrap">
          <div className="page-h">
            <p className="eyebrow">Anpassen</p>
            <h1>Einstellungen</h1>
          </div>

          <section className="panel bracket set-card" aria-labelledby="hDesign">
            <h2 id="hDesign">Design</h2>
            <p className="hint">Standardmäßig folgt die Seite der Einstellung deines Browsers. Hier kannst du Hell oder Dunkel fest wählen.</p>
            <div className="seg" role="group" aria-label="Design wählen">
              <button type="button" aria-pressed={theme === "dark"} onClick={() => setTheme("dark")}>Dunkel</button>
              <button type="button" aria-pressed={theme === "light"} onClick={() => setTheme("light")}>Hell</button>
            </div>
          </section>
        </div>
      </section>
  );
}