import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function Login({ status }: { status?: string }) {
    const { game } = usePage().props;

    return (
        <AuthLayout
            title="Log in to your account"
            description="Use your Google account to continue"
        >
            <Head title="Log in" />
            {/* Make this look better in the future */}
            {status ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {status}
                </div>
            ) : null}
            <Button className="w-full" disabled={!game.auth_open} asChild={game.auth_open}>
                {game.auth_open ? <a href="/auth/google">Log in with Google</a> : 'Logins are currently closed'}
            </Button>
        </AuthLayout>
    );
}
