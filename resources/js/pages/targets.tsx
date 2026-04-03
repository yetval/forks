import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import KillController from '@/actions/App/Http/Controllers/KillController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
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
    killer: { id: number; name: string; nickname: string | null };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Targets', href: dashboard().url },
];

export default function Targets({ target, kill }: { target: Target | null; kill: KillRecord | null }) {
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
                                    ? 'The game hasn\'t started yet. Hang tight.'
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
                <TargetView target={target} />
            </div>
        </AppLayout>
    );
}

function KilledView({ kill }: { kill: KillRecord | null }) {
    const killerName = kill?.killer.nickname ?? kill?.killer.name ?? 'Unknown';

    return (
        <Card className="w-full max-w-md">
            <CardHeader className="text-center">
                <CardTitle className="text-red-600 dark:text-red-400">You&apos;ve Been Eliminated</CardTitle>
                <CardDescription>Killed by {killerName}</CardDescription>
            </CardHeader>
            {kill && !kill.approved && !kill.contested && (
                <CardContent className="flex justify-center gap-3">
                    <Button onClick={() => router.post(KillController.approve().url)}>
                        Approve Kill
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => router.post(KillController.contest().url)}
                    >
                        Contest Kill
                    </Button>
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

function TargetView({ target }: { target: Target | null }) {
    const [verificationName, setVerificationName] = useState('');
    const [isVisible, setIsVisible] = useState(false);
    const [showCelebration, setShowCelebration] = useState(false);
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
    const { errors } = usePage().props;
    const targetName = target?.name ?? 'No target assigned';
    const hasVerificationError = Boolean((errors as Record<string, string>).verification_name);

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

    // TODO: Use form or useForms here in the future
    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        router.post(KillController.store().url, { verification_name: verificationName }, {
            onSuccess: () => {
                setVerificationName('');
                setShowCelebration(true);
            },
        });
    }

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
                        className={cn('text-2xl transition duration-150', !isVisible && 'blur-xl')}
                        onMouseEnter={() => setIsVisible(true)}
                        onMouseLeave={() => setIsVisible(false)}
                    >
                        {targetName}
                    </CardTitle>
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
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="verification_name">
                                    Your target&apos;s next target&apos;s full name
                                </Label>
                                <Input
                                    id="verification_name"
                                    value={verificationName}
                                    onChange={(e) => setVerificationName(e.target.value)}
                                    placeholder="Enter full name to verify"
                                />
                                <InputError message={(errors as Record<string, string>).verification_name} />
                            </div>
                            <Button type="submit" disabled={!verificationName.trim()}>
                                {showCelebration && !hasVerificationError ? 'Confirmed' : 'Submit Kill'}
                            </Button>
                        </form>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
