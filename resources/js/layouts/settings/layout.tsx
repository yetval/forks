import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';

export default function SettingsLayout({ children }: PropsWithChildren) {
    return (
        <div className="px-4 py-6">
            <Heading
                title="Account"
                description="Manage the profile details used in the game"
            />
            <section className="max-w-2xl space-y-12">{children}</section>
        </div>
    );
}
