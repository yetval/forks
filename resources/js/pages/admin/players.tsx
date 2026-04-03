import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import TargetController from '@/actions/App/Http/Controllers/Admin/TargetController';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/components/ui/combobox';
import { Separator } from '@/components/ui/separator';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { players as playersRoute } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type Player = {
    id: number;
    name: string;
    nickname: string | null;
    email: string;
    phone: string | null;
    dorm_location: string | null;
    grade_year: string | null;
    alive: boolean;
    total_kills: number;
    is_admin: boolean;
    current_target: { id: number; name: string; nickname: string | null } | null;
    killed_by_user: { id: number; name: string; nickname: string | null } | null;
};

type TargetRule = {
    id: number;
    player1: { id: number; name: string };
    player2: { id: number; name: string };
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Players', href: playersRoute().url },
];

export default function Players({ players, targetRules }: { players: Player[]; targetRules: TargetRule[] }) {
    const [player1, setPlayer1] = useState<string | null>(null);
    const [player2, setPlayer2] = useState<string | null>(null);
    const playerNames = players.map((p) => p.name);

    function handleAddRule() {
        const p1 = players.find((p) => p.name === player1);
        const p2 = players.find((p) => p.name === player2);
        if (!p1 || !p2) return;

        router.post(TargetController.store().url, { player_1: p1.id, player_2: p2.id }, {
            onSuccess: () => {
                setPlayer1(null);
                setPlayer2(null);
            },
        });
    }

    function handleDeleteRule(id: number) {
        router.delete(TargetController.destroy(id).url);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Players" />
            <div className="flex flex-col gap-6 p-4">
                {/* Target management buttons (stubbed) */}
                <div className="flex gap-3">
                    <Button>Create Targets</Button>
                    <Button variant="secondary">Reshuffle Targets</Button>
                    <Button variant="destructive">Clear Targets</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Target Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-4">
                        {targetRules.length > 0 && (
                            <div className="rounded-xl border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Player 1</TableHead>
                                            <TableHead>Player 2</TableHead>
                                            <TableHead className="w-24" />
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {targetRules.map((rule) => (
                                            <TableRow key={rule.id}>
                                                <TableCell>{rule.player1.name}</TableCell>
                                                <TableCell>{rule.player2.name}</TableCell>
                                                <TableCell>
                                                    <Button variant="destructive" size="sm" onClick={() => handleDeleteRule(rule.id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        <div className="flex gap-3">
                            <Combobox
                                value={player1}
                                onValueChange={setPlayer1}
                                items={playerNames}
                            >
                                <ComboboxInput placeholder="Player 1" className="w-48" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No players found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <Combobox
                                value={player2}
                                onValueChange={setPlayer2}
                                items={playerNames}
                            >
                                <ComboboxInput placeholder="Player 2" className="w-48" />
                                <ComboboxContent>
                                    <ComboboxEmpty>No players found.</ComboboxEmpty>
                                    <ComboboxList>
                                        {(item) => (
                                            <ComboboxItem key={item} value={item}>
                                                {item}
                                            </ComboboxItem>
                                        )}
                                    </ComboboxList>
                                </ComboboxContent>
                            </Combobox>
                            <Button onClick={handleAddRule} disabled={!player1 || !player2 || player1 === player2}>
                                Add Rule
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Separator />

                <div>
                    <p className="text-muted-foreground mb-3 text-sm">{players.length} players</p>
                    <div className="rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Nickname</TableHead>
                                    <TableHead>Dorm</TableHead>
                                    <TableHead>Grade</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Target</TableHead>
                                    <TableHead>Kills</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Killed By</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {players.map((player) => (
                                    <TableRow key={player.id}>
                                        <TableCell>
                                            {player.name}
                                            {player.is_admin && (
                                                <Badge variant="outline" className="ml-2">Admin</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{player.nickname ?? '-'}</TableCell>
                                        <TableCell>{player.dorm_location ?? '-'}</TableCell>
                                        <TableCell>{player.grade_year ?? '-'}</TableCell>
                                        <TableCell>{player.phone ?? '-'}</TableCell>
                                        <TableCell>
                                            {player.current_target
                                                ? player.current_target.name
                                                : '-'}
                                        </TableCell>
                                        <TableCell>{player.total_kills}</TableCell>
                                        <TableCell>
                                            <Badge variant={player.alive ? 'default' : 'destructive'}>
                                                {player.alive ? 'Alive' : 'Dead'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {player.killed_by_user
                                                ? player.killed_by_user.name
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
