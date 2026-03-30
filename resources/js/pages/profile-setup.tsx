import { Form, Head } from '@inertiajs/react';
import { store } from '@/actions/App/Http/Controllers/ProfileSetupController';
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

const DORM_LOCATIONS = [
    '1st South',
    '2nd South',
    '3rd South',
    '4th South',
    '2nd North',
    '3rd North',
    '4th North',
    '5th North',
];

export default function ProfileSetup() {
    return (
        <AppLayout>
            <Head title="Complete your profile" />

            <div className="px-4 py-6">
                <Heading
                    title="Complete your profile"
                    description="Fill in your details before you can play"
                />

                <Form action={store()} className="max-w-xl space-y-6">
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nickname">Nickname</Label>
                                <Input
                                    id="nickname"
                                    name="nickname"
                                    placeholder="What people call you"
                                    autoComplete="off"
                                />
                                <InputError message={errors.nickname} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first_name">
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        autoComplete="given-name"
                                    />
                                    <InputError message={errors.first_name} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        autoComplete="family-name"
                                    />
                                    <InputError message={errors.last_name} />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone number</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="(555) 555-5555"
                                    autoComplete="tel"
                                />
                                <InputError message={errors.phone} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="dorm_location">Dorm</Label>
                                <Select name="dorm_location">
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
                                <InputError message={errors.dorm_location} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="grade_year">Grade</Label>
                                <Select name="grade_year">
                                    <SelectTrigger id="grade_year">
                                        <SelectValue placeholder="Select your grade" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Junior">
                                            Junior
                                        </SelectItem>
                                        <SelectItem value="Senior">
                                            Senior
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.grade_year} />
                            </div>

                            <Button disabled={processing}>
                                Complete setup
                            </Button>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
