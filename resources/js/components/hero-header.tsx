import { Link, usePage } from '@inertiajs/react';
import { Utensils } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';

export default function HeroHeader() {
    const { auth } = usePage().props;
    const getInitials = useInitials();

    return (
        <header className="fixed top-0 z-50 flex w-full items-center justify-between px-6 py-4">
            <Link href="/" className="text-white">
                <Utensils className="size-5" />
            </Link>
            <div className="flex items-center gap-3">
                <Button variant="link" size="sm" asChild>
                    <a href="/forks-game-rules.pdf" target="_blank">
                        Rules
                    </a>
                </Button>
                {auth.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="size-10 rounded-full p-1">
                                <Avatar className="size-8 overflow-hidden rounded-full">
                                    <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                    <AvatarFallback className="rounded-lg bg-zinc-700 text-white">
                                        {getInitials(auth.user.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <>
                        <Button variant="link" size="sm" asChild>
                            <a href="/login">Sign in</a>
                        </Button>
                        <Button size="sm" asChild>
                            <a href="/auth/google">Sign up</a>
                        </Button>
                    </>
                )}
            </div>
        </header>
    );
}
