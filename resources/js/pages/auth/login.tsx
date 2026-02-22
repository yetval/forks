import { Head } from '@inertiajs/react';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function Login() {
    return (
        <AuthLayout
            title="Log in to your account"
            description="Sign in with your Google account to continue"
        >
            <Head title="Log in" />
            <Button className="w-full" asChild>
                <a href="/auth/google">Sign in with Google</a>
            </Button>

            <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <TextLink href="/register">Sign up</TextLink>
            </div>
        </AuthLayout>
    );
}
