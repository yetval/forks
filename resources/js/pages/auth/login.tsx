import { Head, usePage } from '@inertiajs/react';
import AuthLayout from '@/layouts/auth-layout';
import googleSignIn from '@/assets/sign_in_google.svg';

export default function Login({ status }: { status?: string }) {
    const { game } = usePage().props;

    return (
        <AuthLayout
            title="Log in to your account"
            description="Use your Google account to continue"
        >
            <Head title="Log in" />
            {status ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
                    {status}
                </div>
            ) : null}
            {game.auth_open ? (
                <a href="/auth/google" className="flex justify-center">
                    <img src={googleSignIn} alt="Sign in with Google" height={40} />
                </a>
            ) : (
                <p className="text-muted-foreground text-center text-sm">Logins are currently closed</p>
            )}
        </AuthLayout>
    );
}
