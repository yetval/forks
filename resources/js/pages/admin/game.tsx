import { Head, router, usePage } from '@inertiajs/react';
import GameController from '@/actions/App/Http/Controllers/Admin/GameController';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Toggle } from '@/components/ui/toggle';
import AppLayout from '@/layouts/app-layout';
import { game as gameRoute } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type GameStats = {
    total: number;
    alive: number;
    dead: number;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Game', href: gameRoute().url },
];

const STAGES = [
    {
        value: 'pregame',
        label: 'Pregame',
        description: 'Set up the game. Open logins so players can register and complete their profiles.',
        advanceLabel: 'Start Game',
        advanceDescription: 'This will move the game to the running stage. Make sure targets are assigned.',
    },
    {
        value: 'running',
        label: 'Running',
        description: 'Targets are assigned and eliminations are active. The game is live.',
        advanceLabel: 'End Game',
        advanceDescription: 'This will end the game. Players will see final results.',
    },
    {
        value: 'postgame',
        label: 'Postgame',
        description: 'Game over. Final results and stats are visible to all players.',
        advanceLabel: 'Reset to Pregame',
        advanceDescription: 'This will reset the game back to the pregame stage.',
    },
] as const;

function ConfirmButton({
    title,
    description,
    onConfirm,
    children,
}: {
    title: string;
    description: string;
    onConfirm: () => void;
    children: React.ReactNode;
}) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button>
                    {children}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default function Game({ stats }: { stats: GameStats }) {
    const { game } = usePage().props;
    const currentIndex = STAGES.findIndex((s) => s.value === game.stage);
    const currentStage = STAGES[currentIndex];
    const nextStage = STAGES[(currentIndex + 1) % STAGES.length];

    function postUpdate(data: Record<string, unknown>) {
        router.post(GameController.update().url, data, {
            preserveScroll: true,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Game" />
            <div className="flex flex-col gap-6 p-4">
                <div className="grid grid-cols-3 gap-4">
                    <Card className="py-4">
                        <CardContent className="text-center">
                            <p className="text-3xl font-bold">{stats.total}</p>
                            <p className="text-muted-foreground text-sm">Total Players</p>
                        </CardContent>
                    </Card>
                    <Card className="py-4">
                        <CardContent className="text-center">
                            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.alive}</p>
                            <p className="text-muted-foreground text-sm">Alive</p>
                        </CardContent>
                    </Card>
                    <Card className="py-4">
                        <CardContent className="text-center">
                            <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.dead}</p>
                            <p className="text-muted-foreground text-sm">Dead</p>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {STAGES.map((stage, i) => {
                            const isCurrent = game.stage === stage.value;
                            return (
                                <Card
                                    key={stage.value}
                                    className={
                                        isCurrent ? 'border-primary ring-primary/20 ring-2' : undefined
                                    }
                                >
                                    <CardHeader>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${
                                                    isCurrent && 'bg-primary text-primary-foreground'
                                                }`}
                                            >
                                                {i + 1}
                                            </div>
                                            <CardTitle className="text-sm">{stage.label}</CardTitle>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{stage.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    <div className="mt-4">
                        <ConfirmButton
                            title={currentStage.advanceLabel}
                            description={currentStage.advanceDescription}
                            onConfirm={() => postUpdate({ stage: nextStage.value })}
                        >
                            {currentStage.advanceLabel}
                        </ConfirmButton>
                    </div>
                </div>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardTitle>Player Logins</CardTitle>
                        <CardDescription>Allow players to log in and register</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-sm">{game.auth_open ? 'Open' : 'Closed'}</span>
                            <Toggle
                                pressed={game.auth_open}
                                onPressedChange={(pressed) => postUpdate({ auth_open: pressed })}
                                aria-label="Toggle player logins"
                            >
                                {game.auth_open ? 'On' : 'Off'}
                            </Toggle>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
