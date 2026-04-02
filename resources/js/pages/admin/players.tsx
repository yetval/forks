import { Head } from '@inertiajs/react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Players', href: playersRoute().url },
];

export default function Players({ players }: { players: Player[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Players" />
            <div className="flex flex-col gap-4 p-4">
                <p className="text-muted-foreground text-sm">{players.length} players</p>
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
                                            ? (player.current_target.name)
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
                                            ? (player.killed_by_user.name)
                                            : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
