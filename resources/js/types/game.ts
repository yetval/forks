export type GameState = {
    stage: 'pregame' | 'running' | 'postgame';
    stage_label: string;
    auth_open: boolean;
    ffa: boolean;
    show_real_names: boolean;
    start: string;
};
