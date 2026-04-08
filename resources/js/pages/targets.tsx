import { Form, Head, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { approve, contest, store as killStore } from '@/actions/App/Http/Controllers/KillController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { targets } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Target = {
    id: number;
    name: string;
    nickname: string | null;
};

type KillRecord = {
    id: number;
    approved: boolean;
    contested: boolean;
    is_ffa: boolean;
    killer: { id: number; name: string; nickname: string | null };
};

type AlivePlayer = {
    id: number;
    name: string;
    nickname: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Targets', href: targets().url },
];

export default function Targets({
    target,
    kill,
    alive_players,
}: {
    target: Target | null;
    kill: KillRecord | null;
    alive_players: AlivePlayer[];
}) {
    const { game, auth } = usePage().props;
    const user = auth.user;

    if (game.stage !== 'running') {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Targets" />
                <div className="flex flex-1 items-center justify-center p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <CardTitle>
                                {game.stage === 'pregame' ? 'Game Not Started' : 'Game Over'}
                            </CardTitle>
                            <CardDescription>
                                {game.stage === 'pregame'
                                    ? "The game hasn't started yet. Hang tight."
                                    : 'The game is over. Check the results.'}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    if (!user.alive) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Targets" />
                <div className="flex flex-1 items-center justify-center p-4">
                    <KilledView kill={kill} />
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Targets" />
            <div className="flex flex-1 items-center justify-center p-4">
                {game.ffa ? (
                    <FfaTargetView alivePlayers={alive_players} />
                ) : (
                    <TargetView target={target} />
                )}
            </div>
        </AppLayout>
    );
}

function KilledView({ kill }: { kill: KillRecord | null }) {
    const killerName = kill?.killer.name ?? 'Unknown';
    const [showContestForm, setShowContestForm] = useState(false);

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-red-600 dark:text-red-400">You&apos;ve Been Eliminated</CardTitle>
                <CardDescription>Killed by {killerName}</CardDescription>
            </CardHeader>
            {kill && !kill.approved && !kill.contested && (
                <CardContent className="flex flex-col gap-4">
                    {showContestForm ? (
                        <Form {...contest.form()} resetOnSuccess onSuccess={() => setShowContestForm(false)}>
                            {({ errors, processing }) => (
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="contest_reason">Why are you contesting this kill?</Label>
                                    <Textarea
                                        id="contest_reason"
                                        name="contest_reason"
                                        rows={4}
                                        placeholder="Describe why this kill is invalid..."
                                    />
                                    <InputError message={errors.contest_reason} />
                                    <div className="flex gap-2">
                                        <Button type="submit" variant="destructive" disabled={processing}>
                                            Submit Contest
                                        </Button>
                                        <Button type="button" variant="outline" onClick={() => setShowContestForm(false)}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </Form>
                    ) : (
                        <div className="flex justify-center gap-3">
                            <Form {...approve.form()}>
                                <Button type="submit">
                                    Approve Kill
                                </Button>
                            </Form>
                            <Button variant="destructive" onClick={() => setShowContestForm(true)}>
                                Contest Kill
                            </Button>
                        </div>
                    )}
                </CardContent>
            )}
            {kill?.approved && (
                <CardContent className="text-muted-foreground text-center text-sm">
                    Kill approved. You&apos;re out.
                </CardContent>
            )}
            {kill?.contested && (
                <CardContent className="text-muted-foreground text-center text-sm">
                    Kill contested. An admin will review.
                </CardContent>
            )}
        </Card>
    );
}

function FfaTargetView({ alivePlayers }: { alivePlayers: AlivePlayer[] }) {
    const [victimId, setVictimId] = useState<string>('');
    const [showCelebration, setShowCelebration] = useState(false);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateViewportSize = () => {
            setViewportSize({ width: window.innerWidth, height: window.innerHeight });
        };
        updateViewportSize();
        window.addEventListener('resize', updateViewportSize);
        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    useEffect(() => {
        if (!showCelebration) return;
        const timeoutId = window.setTimeout(() => setShowCelebration(false), 10000);
        return () => window.clearTimeout(timeoutId);
    }, [showCelebration]);

    return (
        <>
            {showCelebration && viewportSize.width > 0 && viewportSize.height > 0 && (
                <Confetti width={viewportSize.width} height={viewportSize.height} />
            )}
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardDescription>Free For All</CardDescription>
                    <CardTitle className="text-2xl">Select Your Target</CardTitle>
                </CardHeader>
                <CardContent>
                    {showCelebration && (
                        <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
                            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                Target eliminated.
                            </p>
                        </div>
                    )}
                    <Form
                        {...killStore.form()}
                        resetOnSuccess
                        onSuccess={() => {
                            setVictimId('');
                            setShowCelebration(true);
                        }}
                        className="flex flex-col gap-4"
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="victim_id">Choose a player to eliminate</Label>
                                    <Select name="victim_id" value={victimId} onValueChange={setVictimId}>
                                        <SelectTrigger id="victim_id">
                                            <SelectValue placeholder="Select a player..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {alivePlayers.map((player) => (
                                                <SelectItem key={player.id} value={String(player.id)}>
                                                    {player.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.victim_id} />
                                </div>
                                <Button type="submit" disabled={!victimId || processing}>
                                    Submit Kill
                                </Button>
                            </>
                        )}
                    </Form>
                </CardContent>
            </Card>
        </>
    );
}

function TargetView({ target }: { target: Target | null }) {
    const [verificationName, setVerificationName] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const targetName = target?.name ?? 'No target assigned';

    useEffect(() => {
        const updateViewportSize = () => {
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        updateViewportSize();
        window.addEventListener('resize', updateViewportSize);

        return () => window.removeEventListener('resize', updateViewportSize);
    }, []);

    useEffect(() => {
        if (!showCelebration) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setShowCelebration(false);
        }, 10000);

        return () => window.clearTimeout(timeoutId);
    }, [showCelebration]);

    return (
        <>
            {showCelebration && viewportSize.width > 0 && viewportSize.height > 0 && (
                <Confetti
                    width={viewportSize.width}
                    height={viewportSize.height}
                />
            )}
            <Card className="relative w-full max-w-md">
                <CardHeader className="text-center">
                    <CardDescription>Your Target</CardDescription>
                    <CardTitle
                        className={cn('cursor-pointer text-2xl transition duration-150', !isVisible && 'blur-xl select-none')}
                        onMouseEnter={() => setIsVisible(true)}
                        onMouseLeave={() => setIsVisible(false)}
                        onClick={() => setIsVisible((v) => !v)}
                    >
                        {targetName}
                    </CardTitle>
                    <CardDescription>
                        {isVisible ? 'Move away to hide' : 'Hover or tap to reveal'}
                    </CardDescription>
                </CardHeader>
                {target && (
                    <CardContent>
                        {showCelebration && (
                            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center">
                                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                                    Verification accepted. Target eliminated.
                                </p>
                            </div>
                        )}
                        <Form
                            {...killStore.form()}
                            resetOnSuccess
                            onSuccess={() => {
                                setVerificationName('');
                                setShowCelebration(true);
                            }}
                            className="flex flex-col gap-4"
                        >
                            {({ errors, processing, hasErrors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="verification_name">
                                            Your target&apos;s next target&apos;s full name
                                        </Label>
                                        <Input
                                            id="verification_name"
                                            name="verification_name"
                                            value={verificationName}
                                            onChange={(e) => setVerificationName(e.target.value)}
                                            placeholder="Enter full name to verify"
                                        />
                                        <InputError message={errors.verification_name} />
                                    </div>
                                    <Button type="submit" disabled={!verificationName.trim() || processing}>
                                        {showCelebration && !hasErrors ? 'Confirmed' : 'Submit Kill'}
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
