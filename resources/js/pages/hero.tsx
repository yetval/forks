import { Head } from '@inertiajs/react';
import { ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import MainScene from '@/scenes/main-scene';

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
            <div className="h-screen w-screen">
                <Canvas>
                    <ScrollControls pages={3} damping={0.1}>
                        <MainScene />
                    </ScrollControls>
                </Canvas>
            </div>
        </>
    );
}
