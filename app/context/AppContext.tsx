import {
    createContext,
    useContext,
    useEffect,
    useState,
    type Dispatch,
    type ReactNode,
    type SetStateAction,
} from "react";
import challengeData from "~/data/challenge.json";
import resourcesData from "~/data/resources.json";
import { hasAcknowledged } from "~/utils/cookies";
import { api, resetCsrf } from "~/api/clients";
import type {
    Answers,
    Challenge,
    LeaderboardEntry,
    Resources,
    Stage,
} from "~/types";

export type AuthPayload = {
    lobbyId: string;
    username: string;
    points?: number | null;
};

type AppState = {
    isLoggedIn: boolean;
    authChecked: boolean;
    login: (payload: AuthPayload) => boolean;
    logout: () => void;

    lobbyId: string;
    setLobbyId: Dispatch<SetStateAction<string>>;
    username: string;
    setUsername: Dispatch<SetStateAction<string>>;
    points: number | null;
    setPoints: Dispatch<SetStateAction<number | null>>;

    stage: Stage;
    setStage: Dispatch<SetStateAction<Stage>>;
    answers: Answers;
    setAnswers: Dispatch<SetStateAction<Answers>>;

    leaderboard: LeaderboardEntry[];
    setLeaderboard: Dispatch<SetStateAction<LeaderboardEntry[]>>;

    challenge: Challenge;
    setChallenge: Dispatch<SetStateAction<Challenge>>;
    resources: Resources;
    setResources: Dispatch<SetStateAction<Resources>>;
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);

    const [lobbyId, setLobbyId] = useState("");
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState<number | null>(null);

    // furthest stage reached: 1, 2 or 3
    const [stage, setStage] = useState<Stage>(1);
    const [answers, setAnswers] = useState<Answers>({});

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    const [challenge, setChallenge] = useState<Challenge>(challengeData);
    const [resources, setResources] = useState<Resources>(resourcesData);

    const login = (payload: AuthPayload) => {
        if (!hasAcknowledged()) return false;
        setLoggedIn(true);
        setLobbyId(payload.lobbyId);
        setUsername(payload.username);
        setPoints(payload.points ?? null);
        return true;
    };

    const logout = () => {
        api("/api/auth/logout", { method: "POST" }).catch(() => {});
        clearSession();
    };

    const clearSession = () => {
        setLoggedIn(false);
        setLobbyId("");
        setUsername("");
        setPoints(null);
        setStage(1);
        setAnswers({});
        setLeaderboard([]);
        resetCsrf();
    };

    // On mount: if the session flag is set, ask the server who we are.
    // If the cookie is gone the API client fires 'session-expired' → logout().
    useEffect(() => {
        let cancelled = false;

        const check = async () => {
            if (!hasAcknowledged()) return;

            const res = await api("/api/auth/me");
            if (cancelled) return;

            if (res.ok) {
                const data = await res.json();
                const u = data.user ?? data;
                login({
                    lobbyId: u.lobbyId ?? "",
                    username: u.username ?? u.email?.split("@")[0] ?? "",
                    points: u.points ?? null,
                });
            } else {
                clearSession();
            }
        };

        check()
            .catch(() => {
                if (!cancelled) clearSession();
            })
            .finally(() => {
                if (!cancelled) setAuthChecked(true);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Hard logout when the API tells us the session died (401s in api client)
    useEffect(() => {
        const onSessionExpired = () => clearSession();
        window.addEventListener("session-expired", onSessionExpired);
        return () => window.removeEventListener("session-expired", onSessionExpired);
    }, []);

    const value: AppState = {
        isLoggedIn,
        authChecked,
        login,
        logout,
        lobbyId,
        setLobbyId,
        username,
        setUsername,
        points,
        setPoints,
        stage,
        setStage,
        answers,
        setAnswers,
        leaderboard,
        setLeaderboard,
        challenge,
        setChallenge,
        resources,
        setResources,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
    return ctx;
}
