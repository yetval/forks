import { Head } from '@inertiajs/react';
import { Scroll, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import Countdown from '@/components/countdown';
import MainScene from '@/scenes/main-scene';

// Set your game start date here
const GAME_START = new Date('2026-03-01T00:00:00');

export default function Hero() {
    return (
        <>
            <Head title="Hero">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="relative h-screen w-screen">
                <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
                    <ScrollControls pages={9} damping={0.1}>
                        <MainScene />
                        <Scroll className={'w-screen'} html>
                            <div className="absolute top-[150vh] flex h-screen w-full items-center justify-center px-8">
                                <p className="text-center text-xl font-extralight text-zinc-300 uppercase">
                                    One night, a fork will
                                    <br />
                                    <span
                                        className="text-white text-8xl"
                                    >
                                        slide under your door.
                                    </span>
                                </p>
                            </div>

                            <div className="absolute top-[300vh] flex h-screen w-full items-center justify-center px-8">
                                <p className="text-center text-xl font-extralight text-zinc-300 uppercase">
                                    On it —
                                    <br />
                                    <span className="text-white text-8xl">
                                        someone else's name.
                                    </span>
                                </p>
                            </div>

                            <div className="absolute top-[400vh] flex h-screen w-full flex-col items-center justify-center">
                                <p className="text-center text-xl font-extralight text-zinc-300 uppercase">
                                    Welcome to
                                </p>
                                <h1
                                    className="font-bold leading-none text-[14rem] tracking-tighter text-white uppercase"
                                >
                                    FORKS
                                </h1>
                                <p className="text-xl font-extralight text-zinc-300 uppercase">
                                    NCSSM Morganton
                                </p>
                            </div>

                            {/* Page 6: How it works */}
                            <div className="absolute top-[500vh] flex h-screen w-1/2 items-center pl-16">
                                <div>
                                    <p className="text-xl font-extralight text-zinc-300 uppercase">The rules</p>
                                    <h2 className="mt-2 text-5xl font-bold text-white">How it works</h2>
                                    <ul className="mt-6 space-y-3 text-lg leading-relaxed text-zinc-300">
                                        <li>You get a fork with another player's name — that's your target</li>
                                        <li>Tap them on the shoulder with your fork to eliminate them</li>
                                        <li>Inherit their fork and their target</li>
                                        <li>Last one standing wins</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Page 7: Immunity */}
                            <div className="absolute top-[600vh] flex h-screen w-1/2 items-center pl-16">
                                <div>
                                    <h2 className="text-5xl font-bold text-white">Immunity</h2>
                                    <ul className="mt-6 space-y-3 text-lg leading-relaxed text-zinc-300">
                                        <li>Touch your fork to your nose to become immune</li>
                                        <li>Must hold the fork with your palm — no taping or clipping</li>
                                        <li>Any fork works for defense, not just your assigned one</li>
                                        <li>You can't eliminate anyone while immune</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Page 8: Don't be dumb */}
                            <div className="absolute top-[700vh] flex h-screen w-1/2 items-center pl-16">
                                <div>
                                    <h2 className="text-5xl font-bold text-white">Don't be dumb</h2>
                                    <ul className="mt-6 space-y-3 text-lg leading-relaxed text-zinc-300">
                                        <li>No running — injuries = disqualification</li>
                                        <li>Be gentle when eliminating people</li>
                                        <li>Broken fork? DM the Forkmaster for a replacement</li>
                                        <li>Disputes go to the Forkmaster, whose decision is final</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Page 9: CTA + Countdown */}
                            <div className="absolute top-[800vh] flex h-screen w-full flex-col items-center justify-center">
                                <Countdown target={GAME_START} />
                            </div>

                            {/* Footer */}
                            <div className="absolute top-[895vh] flex w-full items-center justify-center">
                                <p className="text-sm font-extralight tracking-wide">
                                    Built by Evan Kim
                                </p>
                            </div>

                        </Scroll>
                    </ScrollControls>
                </Canvas>
            </div>
        </>
    );
}
