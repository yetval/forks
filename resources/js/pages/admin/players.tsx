import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import TargetController from '@/actions/App/Http/Controllers/Admin/TargetController';
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
    const playerNames = players.filter((p) => !p.is_admin).map((p) => p.name);

    const p1 = players.find((p) => p.name === player1);
    const p2 = players.find((p) => p.name === player2);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Players" />
            <div className="flex flex-col gap-6 p-4">
                <div className="flex gap-3">
                    <Form {...TargetController.assignTargets.form()}>
                        <Button type="submit">
                            Create Targets
                        </Button>
                    </Form>
                    <Form {...TargetController.clearTargets.form()}>
                        <Button type="submit" variant="destructive">
                            Clear Targets
                        </Button>
                    </Form>
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
                                                    <Form {...TargetController.destroy.form(rule.id)} method="delete">
                                                        <Button type="submit" variant="destructive" size="sm">Delete</Button>
                                                    </Form>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        <Form
                            {...TargetController.store.form()}
                            resetOnSuccess
                            onSuccess={() => {
                                setPlayer1(null);
                                setPlayer2(null);
                            }}
                        >
                            <div className="flex gap-3">
                                <input type="hidden" name="player_1" value={p1?.id ?? ''} />
                                <input type="hidden" name="player_2" value={p2?.id ?? ''} />
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
                                <Button type="submit" disabled={!player1 || !player2 || player1 === player2}>
                                    Add Rule
                                </Button>
                            </div>
                        </Form>
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
