import type { ReactNode } from "react";

type Props = {
  side: "l" | "r";
  id: string;
  label: string;
  kicker: string;
  title: string;
  dots?: ReactNode;
  open: boolean;
  locked?: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export default function SidePanel({ side, id, label, kicker, title, dots, open, locked, onToggle, children }: Props) {
  return (
    <aside className={`side side-${side} panel`} data-open={open} aria-label={label}>
      <button className="side-h" type="button" aria-expanded={open} aria-controls={id} tabIndex={locked ? -1 : undefined} onClick={onToggle}>
        <span className="side-t">
          <span className="side-k">{kicker}</span>
          <span className="side-n">{title}</span>
        </span>
        {dots}
        <svg className="chev" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" aria-hidden="true"><path d="M15 5L8 12l7 7" /></svg>
      </button>
      <div className="side-b" id={id}>{children}</div>
    </aside>
  );
}
