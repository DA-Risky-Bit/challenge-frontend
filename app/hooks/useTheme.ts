import { useEffect, useState } from "react";

export type ThemeName = "dark" | "light";

const KEY = "riskybit-theme";

function readSaved(): ThemeName | null {
    try {
        const t = localStorage.getItem(KEY);
        return t === "light" || t === "dark" ? t : null;
    } catch {
        return null;
    }
}

// Without a saved choice the browser setting decides (app.css handles that).
// This hook only tells the settings page which theme is active and saves a manual choice.
export default function useTheme() {
    const [saved, setSaved] = useState<ThemeName | null>(null);
    const [system, setSystem] = useState<ThemeName>("dark");

    useEffect(() => {
        setSaved(readSaved());
        const mq = window.matchMedia("(prefers-color-scheme: light)");
        const sync = () => setSystem(mq.matches ? "light" : "dark");
        sync();
        mq.addEventListener("change", sync);
        return () => mq.removeEventListener("change", sync);
    }, []);

    const setTheme = (t: ThemeName) => {
        setSaved(t);
        document.documentElement.setAttribute("data-theme", t);
        try {
            localStorage.setItem(KEY, t);
        } catch {
            /* storage not available */
        }
    };

    return { theme: saved ?? system, setTheme };
}