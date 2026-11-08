import { useEffect, useRef, useState } from "react";
import type { Terminal as XTerm } from "@xterm/xterm";
import "@xterm/xterm/css/xterm.css";

type Status = "connecting" | "open" | "closed";

const LABEL: Record<Status, string> = {
    connecting: "Verbinde …",
    open: "Verbunden",
    closed: "Getrennt",
};

const cssVar = (name: string) =>
    getComputedStyle(document.documentElement).getPropertyValue(name).trim();

function alpha(hex: string, a: number) {
    const m = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!m) return hex;
    const n = parseInt(m[1], 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// terminal colours follow the CSS variables of the current theme
function readTheme() {
    const primary = cssVar("--primary-color");
    const good = cssVar("--good");
    return {
        background: cssVar("--bg-color-alt"),
        foreground: cssVar("--tertiary-color"),
        cursor: primary,
        cursorAccent: cssVar("--bg-color-alt"),
        selectionBackground: alpha(primary, 0.35),
        red: primary,
        brightRed: primary,
        green: good,
        brightGreen: good,
    };
}

// xterm measures its character cells once, so the font has to be loaded first
async function fontReady(family: string) {
    try {
        await Promise.race([
            document.fonts.load(`13.5px ${family}`),
            new Promise((resolve) => setTimeout(resolve, 1500)),
        ]);
    } catch {
        /* fall back to whatever is available */
    }
}

// Sends everything typed to the server and writes everything received to the screen (plain text frames).
export default function Terminal({ url }: { url: string }) {
    const hostRef = useRef<HTMLDivElement>(null);
    const [term, setTerm] = useState<XTerm | null>(null);
    const [status, setStatus] = useState<Status>("connecting");
    const [attempt, setAttempt] = useState(0);

    // xterm only runs in the browser, so it is loaded after mount
    useEffect(() => {
        let disposed = false;
        let dispose = () => {};

        (async () => {
            const [{ Terminal: XTermCtor }, { FitAddon }] = await Promise.all([
                import("@xterm/xterm"),
                import("@xterm/addon-fit"),
            ]);
            const fontFamily = cssVar("--font-mono");
            await fontReady(fontFamily);
            const host = hostRef.current;
            if (disposed || !host) return;

            const t = new XTermCtor({
                cursorBlink: true,
                fontSize: 13.5,
                fontFamily,
                minimumContrastRatio: 4.5,
                theme: readTheme(),
            });
            const fit = new FitAddon();
            t.loadAddon(fit);
            t.open(host);

            const refit = () => {
                try {
                    fit.fit();
                } catch {
                    /* container has no size yet */
                }
            };
            refit();
            const resizeObserver = new ResizeObserver(refit);
            resizeObserver.observe(host);

            const syncTheme = () => {
                t.options.theme = readTheme();
            };
            const themeObserver = new MutationObserver(syncTheme);
            themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
            const media = window.matchMedia("(prefers-color-scheme: light)");
            media.addEventListener("change", syncTheme);

            dispose = () => {
                resizeObserver.disconnect();
                themeObserver.disconnect();
                media.removeEventListener("change", syncTheme);
                t.dispose();
            };
            setTerm(t);
        })();

        return () => {
            disposed = true;
            dispose();
            setTerm(null);
        };
    }, []);

    // connection; "Neu verbinden" starts a new one on the same screen
    useEffect(() => {
        if (!term) return;
        setStatus("connecting");

        let ws: WebSocket;
        try {
            ws = new WebSocket(url);
        } catch {
            setStatus("closed");
            return;
        }
        ws.binaryType = "arraybuffer";
        ws.onopen = () => setStatus("open");
        ws.onclose = () => setStatus("closed");
        ws.onmessage = (e) => term.write(typeof e.data === "string" ? e.data : new Uint8Array(e.data));
        const input = term.onData((data) => {
            if (ws.readyState === WebSocket.OPEN) ws.send(data);
        });

        return () => {
            input.dispose();
            ws.onopen = ws.onclose = ws.onmessage = null;
            ws.close();
        };
    }, [term, url, attempt]);

    return (
        <div className="panel bracket termbox">
            <div className="term-bar">
                <span className="status" data-state={status}><i></i>{LABEL[status]}</span>
                {status === "closed" && (
                    <button className="link-btn" type="button" onClick={() => setAttempt((a) => a + 1)}>Neu verbinden</button>
                )}
            </div>
            <div className="term-host" ref={hostRef} aria-label="Terminal" />
        </div>
    );
}