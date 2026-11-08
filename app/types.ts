export type Stage = 1 | 2 | 3;

export type Segment = string | { text: string; href?: string };
export type Paragraph = string | Segment[];

export type SubmitField = {
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    mono?: boolean;
};

export type StageContent = {
    stage: number;
    title: string;
    terminal: boolean;
    story: Paragraph[];
    goal: string;
    submit: { fields: SubmitField[] };
};

export type Challenge = { stages: StageContent[] };

export type Topic = {
    id: string;
    title: string;
    tags: string[];
    description: string;
    attack: { text: string; example: string };
    defense: string[];
};

export type Resources = { topics: Topic[] };

// time in seconds
export type LeaderboardEntry = {
    username: string;
    points: number;
    time: number;
    stage: number;
};