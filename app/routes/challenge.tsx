import { useEffect, useState } from "react";
import type { Route } from "./+types/challenge";
import { useApp } from "~/context/AppContext";
import SidePanel from "~/components/SidePanel";
import Terminal from "~/components/Terminal";
import RichParagraph from "~/components/RichParagraph";
import Dots from "~/components/Dots";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Challenge · Risky Bit" }];
}

export default function Challenge() {
  const { challenge, stage, lobbyId, username, terminalLines } = useApp();

  const current = challenge.stages.find((s) => s.stage === stage);
  const hasTerminal = current?.terminal !== false;
  const fields = current?.submit.fields ?? [];

  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const storyOpen = !hasTerminal || leftOpen;

  // small screens start with the side panels collapsed
  useEffect(() => {
    if (window.innerWidth < 1280) setLeftOpen(false);
    if (window.innerWidth < 1000) setRightOpen(false);
  }, []);

  const prompt = username && lobbyId ? `${username}@${lobbyId}:~$` : "$";

  return (
    <section className="view">
      <div className="wrap wide">
        <div className="page-h">
          {lobbyId && <p className="eyebrow">Lobby {lobbyId}</p>}
          <h1>{current?.title}</h1>
        </div>

        <div className="stage" data-l={storyOpen ? "open" : "closed"} data-r={rightOpen ? "open" : "closed"} data-terminal={hasTerminal}>
          <SidePanel
            side="l"
            id="sideLBody"
            label="Story"
            kicker="Hintergrund"
            title="Die Story"
            open={storyOpen}
            locked={!hasTerminal}
            onToggle={() => setLeftOpen(!leftOpen)}
          >
            <div className="story">
              {(current?.story ?? []).map((p, i) => <RichParagraph key={i} content={p} />)}
            </div>
          </SidePanel>

          {hasTerminal && <Terminal lines={terminalLines} prompt={prompt} />}

          <SidePanel
            side="r"
            id="sideRBody"
            label="Abgabe"
            kicker="Abgabe"
            title={`Phase ${stage} von 3`}
            dots={<Dots count={stage} />}
            open={rightOpen}
            onToggle={() => setRightOpen(!rightOpen)}
          >
            <div className="obj">
              <h3>Ziel</h3>
              <p>{current?.goal}</p>
            </div>
            <form className="form" key={stage} autoComplete="off" onSubmit={(e) => e.preventDefault()}>
              <fieldset className="fs">
                {fields.map((f) => (
                  <div className="field" key={f.name}>
                    <label htmlFor={`sub-${f.name}`}>{f.label}</label>
                    <input
                      id={`sub-${f.name}`}
                      name={f.name}
                      type={f.type}
                      className={f.mono ? "path" : undefined}
                      placeholder={f.placeholder}
                      autoCapitalize="off"
                      spellCheck={false}
                      required
                    />
                  </div>
                ))}
              </fieldset>
              <button className="btn" type="submit">Abgeben</button>
            </form>
          </SidePanel>
        </div>
      </div>
    </section>
  );
}
