import { Form, Head } from '@inertiajs/react';
import { dismiss, revert } from '@/actions/App/Http/Controllers/Admin/KillController';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { kills as killsRoute } from '@/routes';
import type { BreadcrumbItem } from '@/types';

type KillRecord = {
    id: number;
    killer: { id: number; name: string };
    victim: { id: number; name: string };
    approved: boolean;
    contested: boolean;
    is_ffa: boolean;
    contest_reason: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Kills', href: killsRoute().url },
];

export default function Kills({ kills }: { kills: KillRecord[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kills" />
            <div className="flex flex-col gap-6 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Kill History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {kills.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No kills yet.</p>
                        ) : (
                            <div className="rounded-xl border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Killer</TableHead>
                                            <TableHead>Victim</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Contest Reason</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {kills.map((kill) => (
                                            <TableRow key={kill.id}>
                                                <TableCell>{kill.killer.name}</TableCell>
                                                <TableCell>{kill.victim.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-wrap gap-1">
                                                        {kill.is_ffa && (
                                                            <Badge variant="secondary">FFA</Badge>
                                                        )}
                                                        {kill.approved && (
                                                            <Badge variant="default">Approved</Badge>
                                                        )}
                                                        {kill.contested && (
                                                            <Badge variant="destructive">Contested</Badge>
                                                        )}
                                                        {!kill.approved && !kill.contested && (
                                                            <Badge variant="outline">Pending</Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {kill.contest_reason ?? '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {kill.contested && (
                                                            <AlertDialog>
                                                                <AlertDialogTrigger asChild>
                                                                    <Button variant="outline" size="sm">
                                                                        Dismiss
                                                                    </Button>
                                                                </AlertDialogTrigger>
                                                                <AlertDialogContent>
                                                                    <AlertDialogHeader>
                                                                        <AlertDialogTitle>Dismiss Contest</AlertDialogTitle>
                                                                        <AlertDialogDescription>
                                                                            This will dismiss {kill.victim.name}'s contest and confirm the kill as valid.
                                                                        </AlertDialogDescription>
                                                                    </AlertDialogHeader>
                                                                    <AlertDialogFooter>
                                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                        <Form {...dismiss.form(kill.id)}>
                                                                            <AlertDialogAction type="submit">
                                                                                Dismiss
                                                                            </AlertDialogAction>
                                                                        </Form>
                                                                    </AlertDialogFooter>
                                                                </AlertDialogContent>
                                                            </AlertDialog>
                                                        )}
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm">
                                                                    Revert
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Revert Kill</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This will restore {kill.victim.name} to alive status and reset target assignments. This cannot be undone.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                    <Form {...revert.form(kill.id)} method="delete">
                                                                        <AlertDialogAction type="submit">
                                                                            Revert
                                                                        </AlertDialogAction>
                                                                    </Form>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
