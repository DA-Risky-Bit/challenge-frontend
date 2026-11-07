import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeName = "dark" | "light";
export type ColorKey =
  | "primary"
  | "secondary"
  | "tertiary"
  | "bg"
  | "bgAlt"
  | "muted"
  | "border"
  | "onPrimary"
  | "good";
export type Palette = Record<ColorKey, string>;
type Custom = Record<ThemeName, Partial<Palette>>;

// key, label, CSS variable
export const TOKENS: [ColorKey, string, string][] = [
  ["primary", "Primärfarbe", "--primary-color"],
  ["secondary", "Sekundärfarbe", "--secondary-color"],
  ["tertiary", "Tertiärfarbe (Text)", "--tertiary-color"],
  ["bg", "Hintergrund", "--bg-color"],
  ["bgAlt", "Hintergrund alternativ", "--bg-color-alt"],
  ["muted", "Gedämpfter Text", "--text-muted"],
  ["border", "Rahmen", "--border-color"],
  ["onPrimary", "Text auf Primärfarbe", "--on-primary"],
  ["good", "Erfolg (Grün)", "--good"],
];

// must match the values at the top of app/app.css
export const DEFAULTS: Record<ThemeName, Palette> = {
  dark: { primary: "#e13a4b", secondary: "#7a151f", tertiary: "#f3ede8", bg: "#070505", bgAlt: "#120d0d", muted: "#c8bcb7", border: "#35201f", onPrimary: "#0b0606", good: "#5fd39a" },
  light: { primary: "#c42a3b", secondary: "#7a151f", tertiary: "#1c1112", bg: "#f7f1ec", bgAlt: "#ede3dc", muted: "#6e5a57", border: "#d9cac2", onPrimary: "#ffffff", good: "#1f8a5b" },
};

const THEME_KEY = "riskybit-theme";
const COLORS_KEY = "riskybit-colors";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage not available */
  }
}

const systemTheme = (): ThemeName =>
  window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";

function loadSaved(): ThemeName | null {
  const t = read(THEME_KEY);
  return t === "light" || t === "dark" ? t : null;
}

function loadCustom(): Custom {
  const custom: Custom = { dark: {}, light: {} };
  try {
    const saved = JSON.parse(read(COLORS_KEY) || "null");
    if (saved) {
      for (const t of ["dark", "light"] as const) {
        for (const [k] of TOKENS) {
          const v = saved[t] && saved[t][k];
          if (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) && v.toLowerCase() !== DEFAULTS[t][k]) {
            custom[t][k] = v.toLowerCase();
          }
        }
      }
    }
  } catch {
    /* ignore broken storage */
  }
  return custom;
}

type ThemeState = {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  palette: (t: ThemeName) => Palette;
  setColor: (key: ColorKey, hex: string) => void;
  resetColors: () => void;
};

const ThemeContext = createContext<ThemeState | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // saved = the user's explicit choice; without one the system setting is followed.
  // Storage is read after mount so server and client render the same first pass,
  // until then the values set by the script in root.tsx stay untouched.
  const [ready, setReady] = useState(false);
  const [saved, setSaved] = useState<ThemeName | null>(null);
  const [system, setSystem] = useState<ThemeName>("dark");
  const [custom, setCustom] = useState<Custom>({ dark: {}, light: {} });
  const theme = saved ?? system;

  useEffect(() => {
    setSaved(loadSaved());
    setSystem(systemTheme());
    setCustom(loadCustom());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setSystem(mq.matches ? "light" : "dark");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    if (saved) root.setAttribute("data-theme", saved);
    else root.removeAttribute("data-theme");
  }, [ready, saved]);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    for (const [k, , cssVar] of TOKENS) {
      const v = custom[theme][k];
      if (v) root.style.setProperty(cssVar, v);
      else root.style.removeProperty(cssVar);
    }
  }, [ready, theme, custom]);

  const setTheme = (t: ThemeName) => {
    setSaved(t);
    write(THEME_KEY, t);
  };

  // colours of a theme with the user's overrides applied
  const palette = (t: ThemeName): Palette => ({ ...DEFAULTS[t], ...custom[t] });

  const update = (next: Custom) => {
    setCustom(next);
    write(COLORS_KEY, JSON.stringify(next));
  };

  const setColor = (key: ColorKey, hex: string) => {
    const next: Custom = { ...custom, [theme]: { ...custom[theme] } };
    if (hex === DEFAULTS[theme][key]) delete next[theme][key];
    else next[theme][key] = hex;
    update(next);
  };

  const resetColors = () => update({ ...custom, [theme]: {} });

  return (
    <ThemeContext.Provider value={{ theme, setTheme, palette, setColor, resetColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
