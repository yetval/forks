import type { Auth } from '@/types/auth';
import type { GameState } from '@/types/game';

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            game: GameState;
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
