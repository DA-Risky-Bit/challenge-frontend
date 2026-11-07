import { useMemo } from "react";
import type { Route } from "./+types/leaderboard";
import { useApp } from "~/context/AppContext";
import Dots from "~/components/Dots";
import { fmtPts, fmtTime } from "~/utils/format";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Leaderboard · Risky Bit" }];
}

export default function Leaderboard() {
  const { leaderboard, lobbyId, username } = useApp();

  // most points first, then the shorter time
  const rows = useMemo(
    () => [...leaderboard].sort((a, b) => b.points - a.points || a.time - b.time),
    [leaderboard]
  );
  const myIndex = username ? rows.findIndex((r) => r.username === username) : -1;

  return (
    <section className="view">
      <div className="wrap">
        <div className="page-h">
          {lobbyId && <p className="eyebrow">Lobby {lobbyId}</p>}
          <h1>Bestenliste</h1>
        </div>

        <div className="lb-meta">
          {myIndex >= 0 && <p>Du bist <span className="big">#{myIndex + 1}</span> von {rows.length}</p>}
        </div>

        <div className="panel bracket">
          <div className="scroll">
            <table>
              <thead>
                <tr><th>#</th><th>Spieler</th><th>Phase</th><th className="num">Punkte</th><th className="num">Zeit</th></tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const isMe = i === myIndex;
                  const cls = [i < 3 && `r${i + 1}`, isMe && "me"].filter(Boolean).join(" ");
                  return (
                    <tr key={r.username} className={cls || undefined}>
                      <td className="rank"><span className="rk">{i + 1}</span></td>
                      <td>{r.username}{isMe && <span className="tag">DU</span>}</td>
                      <td>
                        <span className="phase" role="img" aria-label={`Phase ${r.stage} von 3`}>
                          {r.stage}<Dots count={r.stage} />
                        </span>
                      </td>
                      <td className="num pts">{fmtPts(r.points)}</td>
                      <td className="num time">{fmtTime(r.time)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
