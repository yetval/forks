export type GameState = {
    stage: 'pregame' | 'running' | 'postgame';
    stage_label: string;
    auth_open: boolean;
};
