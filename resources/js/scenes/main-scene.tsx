import { CameraShake, Environment, Sparkles, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import type { Group } from 'three';
import { MathUtils } from 'three';
import Door from '@/models/door';
import Fork from '@/models/fork';
import ScrambleText from '@/models/scramble-text';

const DAMP = 8; // tweak this to adjust all damping globally

export default function MainScene() {
    const forkRef = useRef<Group>(null!);
    const rectLightRef = useRef<any>(null!);
    const scroll = useScroll();
    const [doorOpacity, setDoorOpacity] = useState(1);

    useFrame((state, delta) => {
        const r1 = scroll.range(0, 2 / 9);
        const r2 = scroll.range(2 / 9, 1 / 9);
        const r3 = scroll.range(4 / 9, 1 / 9);
        const r4 = scroll.range(5 / 9, 1 / 9);

        const targetZ = -1.25 + 2 * r1 + 8 * r2;
        const targetY = -3 + 3.25 * r2;
        const targetRotX = (Math.PI / 2) * r2;

        const fade = 1 - r2;
        setDoorOpacity(fade);
        if (rectLightRef.current) {
            rectLightRef.current.intensity = 18 * fade;
        }

        forkRef.current.position.z = MathUtils.damp(forkRef.current.position.z, targetZ, DAMP, delta);
        forkRef.current.position.y = MathUtils.damp(forkRef.current.position.y, targetY, DAMP, delta);

        if (r3 > 0.01) {
            // Page 5+: spinning
            const targetPosX = r4 > 0.01 ? 0.075 : -0.25;
            forkRef.current.position.x = MathUtils.damp(forkRef.current.position.x, targetPosX, DAMP, delta);
            forkRef.current.rotation.y = MathUtils.damp(forkRef.current.rotation.y, Math.PI / 4, DAMP, delta);
            forkRef.current.rotation.z += delta * 3;
        } else {
            forkRef.current.rotation.z = ((forkRef.current.rotation.z + Math.PI) % (Math.PI * 2)) - Math.PI;
            forkRef.current.position.x = MathUtils.damp(forkRef.current.position.x, 0, DAMP, delta);
            forkRef.current.rotation.x = MathUtils.damp(forkRef.current.rotation.x, targetRotX, DAMP, delta);
            forkRef.current.rotation.y = MathUtils.damp(forkRef.current.rotation.y, 0, DAMP, delta);
            forkRef.current.rotation.z = MathUtils.damp(forkRef.current.rotation.z, 0, DAMP, delta);
        }
    });

    return (
        <>
            <color attach="background" args={['#1a0000']} />
            <fog attach="fog" args={['#1a0000', 8, 30]} />

            <Door rotation={[Math.PI / 2, Math.PI, 0]} position={[0, -2.9, 0]} opacity={doorOpacity} />
            <group ref={forkRef} position={[0, -3, -1.25]}>
                <Fork />
                <ScrambleText position={[-.025, 0.04, .4]} rotation={[Math.PI/2, 0, Math.PI/2]} scale={.3}/>
            </group>

            <rectAreaLight
                ref={rectLightRef}
                color="#C62828"
                intensity={18}
                width={4.5}
                height={0.1}
                position={[-0.25, -2.9, 0]}
            />
            <ambientLight intensity={0.12} />
            <Environment preset="night" environmentIntensity={1.0} />

            <Sparkles count={60} scale={[6, 5, 6]} size={3} speed={0.3} opacity={0.4} color="#C62828" />

            <CameraShake maxYaw={0.005} maxPitch={0.005} maxRoll={0.002} yawFrequency={0.3} pitchFrequency={0.25} rollFrequency={0.2} />
        </>
    );
}
