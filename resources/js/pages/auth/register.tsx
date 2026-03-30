import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Use your Google account to join the game"
        >
            <Head title="Register" />
            <Button className="w-full" asChild>
                <a href="/auth/google">Create account with Google</a>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <TextLink href={login()}>
                    Log in
                </TextLink>
            </div>
        </AuthLayout>
    );
}
