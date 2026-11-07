import { useEffect, useRef, useState, type FormEvent } from "react";
import type { TerminalLine } from "~/types";

type Props = {
  lines: TerminalLine[];
  prompt: string;
  onCommand?: (command: string) => void;
};

export default function Terminal({ lines, prompt, onCommand }: Props) {
  const [cmd, setCmd] = useState("");
  const outRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cmd.trim()) return;
    onCommand?.(cmd);
    setCmd("");
  };

  return (
    <div className="panel bracket termbox">
      <div className="term-bar">
        <span className="status"><i></i>Verbunden</span>
      </div>
      <div className="term-body" ref={outRef} role="log" tabIndex={0} aria-label="Terminal-Ausgabe">
        {lines.map((l, i) => <div key={i} className={l.kind}>{l.text}</div>)}
      </div>
      <form className="term-in" autoComplete="off" onSubmit={submit}>
        <label htmlFor="termCmd">{prompt}</label>
        <input id="termCmd" type="text" spellCheck={false} autoCapitalize="off" autoComplete="off" placeholder="Befehl eingeben" value={cmd} onChange={(e) => setCmd(e.target.value)} />
      </form>
    </div>
  );
}
