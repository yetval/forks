import { Transition } from '@headlessui/react';
import { Head, useForm, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { edit } from '@/routes/profile';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account',
        href: edit().url,
    },
];

const DORM_LOCATIONS = [
    '1st South',
    '2nd South',
    '3rd South',
    '4th South',
    '2nd North',
    '3rd North',
    '4th North',
    '5th North',
] as const;

const GRADE_YEARS = ['Junior', 'Senior'] as const;

export default function Profile({
    isProfileComplete,
}: {
    isProfileComplete: boolean;
}) {
    const { auth } = usePage().props;
    const form = useForm({
        nickname: String(auth.user.nickname ?? ''),
        phone: String(auth.user.phone ?? ''),
        dorm_location: String(auth.user.dorm_location ?? ''),
        grade_year: String(auth.user.grade_year ?? ''),
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.patch(ProfileController.update.url(), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={isProfileComplete ? 'Account' : 'Complete profile'} />

            <h1 className="sr-only">Account</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title={
                            isProfileComplete
                                ? 'Profile details'
                                : 'Complete your profile'
                        }
                        description={
                            isProfileComplete
                                ? 'Update the details used in the game.'
                                : 'Add the details required before you can play.'
                        }
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Google account email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={auth.user.email}
                                readOnly
                                disabled
                                className="bg-muted/60"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="nickname">Nickname</Label>
                            <Input
                                id="nickname"
                                name="nickname"
                                value={form.data.nickname}
                                onChange={(event) =>
                                    form.setData('nickname', event.target.value)
                                }
                                placeholder="What people call you"
                                autoComplete="off"
                            />
                            <InputError message={form.errors.nickname} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone number</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={form.data.phone}
                                onChange={(event) =>
                                    form.setData('phone', event.target.value)
                                }
                                placeholder="(555) 555-5555"
                                autoComplete="tel"
                            />
                            <InputError message={form.errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dorm_location">Dorm</Label>
                            <Select
                                value={form.data.dorm_location}
                                onValueChange={(value) =>
                                    form.setData('dorm_location', value)
                                }
                            >
                                <SelectTrigger id="dorm_location">
                                    <SelectValue placeholder="Select your dorm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {DORM_LOCATIONS.map((dorm) => (
                                        <SelectItem key={dorm} value={dorm}>
                                            {dorm}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.dorm_location} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="grade_year">Grade</Label>
                            <Select
                                value={form.data.grade_year}
                                onValueChange={(value) =>
                                    form.setData('grade_year', value)
                                }
                            >
                                <SelectTrigger id="grade_year">
                                    <SelectValue placeholder="Select your grade" />
                                </SelectTrigger>
                                <SelectContent>
                                    {GRADE_YEARS.map((gradeYear) => (
                                        <SelectItem
                                            key={gradeYear}
                                            value={gradeYear}
                                        >
                                            {gradeYear}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.grade_year} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={form.processing}
                                data-test="update-profile-button"
                            >
                                {isProfileComplete ? 'Save changes' : 'Complete setup'}
                            </Button>

                            <Transition
                                show={form.recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
