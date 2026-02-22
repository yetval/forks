import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { login } from '@/routes';
import { store } from '@/routes/register';

export default function Register() {
    return (
        <AuthLayout
            title="Create an account"
            description="Enter your details below to create your account"
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
