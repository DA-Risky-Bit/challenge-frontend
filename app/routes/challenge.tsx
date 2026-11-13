import {useEffect, useState, type FormEvent} from "react";
import type {Route} from "./+types/challenge";
import {useApp} from "~/context/AppContext";
import {WS_URL} from "~/config";
import solutions from "~/data/solutions.json";
import type {Stage} from "~/types";
import SidePanel from "~/components/SidePanel";
import Terminal from "~/components/Terminal";
import RichParagraph from "~/components/RichParagraph";
import Dots from "~/components/Dots";

export function meta({}: Route.MetaArgs) {
    return [{title: "Challenge · Risky Bit"}];
}

export default function Challenge() {
    const {challenge, stage, setStage, lobbyId, answers, setAnswers} = useApp();

    // `stage` is the furthest stage reached; `shown` is the one on screen (never beyond `stage`)
    const [view, setView] = useState<number>(stage);
    useEffect(() => setView(stage), [stage]);
    const shown = Math.min(view, stage);
    const reviewing = shown < stage;

    const current = challenge.stages.find((s) => s.stage === shown);
    const fields = current?.submit.fields ?? [];

    // the terminal belongs to the current stage; it stays connected (just hidden) while an earlier stage is reviewed
    const liveHasTerminal = challenge.stages.find((s) => s.stage === stage)?.terminal !== false;
    const hasTerminal = liveHasTerminal && !reviewing;

    // a phase is solved when every value in solutions.json for it is entered; then the next phase opens
    const [wrong, setWrong] = useState(false);
    useEffect(() => setWrong(false), [shown]);

    function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const solution = (solutions as Record<string, Record<string, string>>)[shown];
        if (reviewing || !solution) return;
        const values = Object.fromEntries(Array.from(new FormData(e.currentTarget), ([name, value]) => [name, String(value).trim()]));
        const correct = Object.entries(solution).every(([name, expected]) => values[name]?.toLowerCase() === expected.toLowerCase());
        if (!correct) {
            setWrong(true);
            return;
        }
        setAnswers((a) => ({...a, [shown]: values}));
        setStage(Math.min(shown + 1, 3) as Stage);
    }

    const [leftOpen, setLeftOpen] = useState(true);
    const [rightOpen, setRightOpen] = useState(true);
    const storyOpen = !hasTerminal || leftOpen;

    // small screens start with the side panels collapsed
    useEffect(() => {
        if (window.innerWidth < 1280) setLeftOpen(false);
        if (window.innerWidth < 1000) setRightOpen(false);
    }, []);

    return (
        <section className="view">
            <div className="wrap wide">
                <div className="page-h has-tools">
                    <div className="page-h-t">
                        {lobbyId && <p className="eyebrow">Lobby {lobbyId}</p>}
                        <h1>{current?.title}</h1>
                    </div>
                    <div className="seg sm" role="group" aria-label="Phase wählen">
                        {challenge.stages.map((s) => (
                            <button
                                key={s.stage}
                                type="button"
                                aria-pressed={s.stage === shown}
                                disabled={s.stage > stage}
                                title={s.stage > stage ? "Noch nicht freigeschaltet" : undefined}
                                onClick={() => setView(s.stage)}
                            >
                                Phase {s.stage}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="stage" data-l={storyOpen ? "open" : "closed"} data-r={rightOpen ? "open" : "closed"}
                     data-terminal={hasTerminal}>
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
                            {(current?.story ?? []).map((p, i) => <RichParagraph key={i} content={p}/>)}
                        </div>
                    </SidePanel>

                    {liveHasTerminal && <Terminal url={WS_URL}/>}

                    <SidePanel
                        side="r"
                        id="sideRBody"
                        label="Abgabe"
                        kicker="Abgabe"
                        title={`Phase ${shown} von 3`}
                        dots={<Dots count={shown}/>}
                        open={rightOpen}
                        onToggle={() => setRightOpen(!rightOpen)}
                    >
                        <div className="obj">
                            <h3>Ziel</h3>
                            <p>{current?.goal}</p>
                        </div>
                        <form className="form" key={shown} autoComplete="off" onSubmit={submit}
                              onInput={() => setWrong(false)}>
                            <fieldset className="fs">
                                {fields.map((f) => (
                                    <div className="field" key={f.name}>
                                        <label htmlFor={`sub-${f.name}`}>{f.label}</label>
                                        <input
                                            id={`sub-${f.name}`}
                                            name={f.name}
                                            type={f.type}
                                            className={f.mono ? "path" : undefined}
                                            placeholder={reviewing ? undefined : f.placeholder}
                                            defaultValue={reviewing ? answers[shown]?.[f.name] ?? "" : undefined}
                                            readOnly={reviewing}
                                            autoCapitalize="off"
                                            spellCheck={false}
                                            required
                                        />
                                    </div>
                                ))}
                            </fieldset>
                            {reviewing ? (
                                <p className="hint">Diese Phase ist abgeschlossen.</p>
                            ) : (
                                <>
                                    {wrong && <p className="form-note" role="alert">Mindestens eine Sicherheitsfrage ist
                                        falsch.</p>}
                                    <button className="btn" type="submit">Abgeben</button>
                                </>
                            )}
                        </form>
                    </SidePanel>
                </div>
            </div>
        </section>
    );
}