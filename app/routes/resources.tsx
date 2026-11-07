import { useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/resources";
import { useApp } from "~/context/AppContext";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Lernressourcen · Risky Bit" }];
}

export default function Resources() {
  const { resources } = useApp();
  const [current, setCurrent] = useState(0);

  const topics = resources.topics;
  const topic = topics[current];

  return (
    <section className="view">
      <div className="wrap">
        <div className="page-h">
          <p className="eyebrow">Erst den Angriff verstehen, dann die Verteidigung</p>
          <h1>Lernmaterial</h1>
        </div>

        <div className="res">
          <div className="res-list" aria-label="Angriffsarten">
            {topics.map((t, i) => (
              <button key={t.id || i} type="button" aria-pressed={i === current} onClick={() => setCurrent(i)}>
                <strong>{t.title}</strong>
                <span>{t.tags.join(" · ")}</span>
              </button>
            ))}
          </div>

          <article className="panel bracket detail" aria-live="polite">
            {topic && (
              <>
                <div><h2>{topic.title}</h2></div>
                <div className="tags">
                  {topic.tags.map((tag, i) => <span key={i}>{tag}</span>)}
                </div>
                <p>{topic.description}</p>
                <div className="cols">
                  <div className="col">
                    <h3>Angriff</h3>
                    <p>{topic.attack.text}</p>
                    <pre><code>{topic.attack.example}</code></pre>
                  </div>
                  <div className="col def">
                    <h3>Verteidigung</h3>
                    <ul>
                      {topic.defense.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="row"><Link className="btn ghost" to="/terminal">Terminal öffnen</Link></div>
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  );
}
