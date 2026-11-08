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
import type {
    Answers,
    Challenge,
    LeaderboardEntry,
    Resources,
    Stage,
} from "~/types";

type AppState = {
    isLoggedIn: boolean;
    authChecked: boolean;
    login: () => boolean;
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

const AUTH_KEY = "riskybit-auth";

function readAuth() {
    try {
        return sessionStorage.getItem(AUTH_KEY) === "1";
    } catch {
        return false;
    }
}

function writeAuth(on: boolean) {
    try {
        if (on) sessionStorage.setItem(AUTH_KEY, "1");
        else sessionStorage.removeItem(AUTH_KEY);
    } catch {
        /* storage not available */
    }
}

export function AppProvider({ children }: { children: ReactNode }) {
    // storage is read after mount so server and client render the same first pass
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    useEffect(() => {
        setLoggedIn(readAuth() && hasAcknowledged());
        setAuthChecked(true);
    }, []);

    const [lobbyId, setLobbyId] = useState("");
    const [username, setUsername] = useState("");
    const [points, setPoints] = useState<number | null>(null);

    // furthest stage reached: 1, 2 or 3; earlier stages can be reviewed, later ones stay locked
    const [stage, setStage] = useState<Stage>(3);
    // submitted inputs of finished stages: { 1: { username: "…" } }
    const [answers, setAnswers] = useState<Answers>({});

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

    // JSON blueprints: app/data/challenge.json and app/data/resources.json
    const [challenge, setChallenge] = useState<Challenge>(challengeData);
    const [resources, setResources] = useState<Resources>(resourcesData);

    // signing in needs the cookie notice to be acknowledged
    const login = () => {
        if (!hasAcknowledged()) return false;
        writeAuth(true);
        setLoggedIn(true);
        return true;
    };
    const logout = () => {
        writeAuth(false);
        setLoggedIn(false);
    };

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