import { Text } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';

const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const MIN_LENGTH = 3;
const MAX_LENGTH = 8;
const SCRAMBLE_SPEED = 0.06;
const LENGTH_CHANGE_SPEED = 0.5;

function randomLength(): number {
    return MIN_LENGTH + Math.floor(Math.random() * (MAX_LENGTH - MIN_LENGTH + 1));
}

function randomString(length: number): string {
    return Array.from({ length }, () =>
        CHARSET[Math.floor(Math.random() * CHARSET.length)],
    ).join('');
}

export default function ScrambleText(props: ThreeElements['group']) {
    const [display, setDisplay] = useState(() => randomString(randomLength()));
    const scrambleTimer = useRef(0);
    const lengthTimer = useRef(0);
    const currentLength = useRef(randomLength());

    useFrame((_, delta) => {
        scrambleTimer.current += delta;
        lengthTimer.current += delta;

        if (lengthTimer.current >= LENGTH_CHANGE_SPEED) {
            lengthTimer.current = 0;
            currentLength.current = randomLength();
        }

        if (scrambleTimer.current >= SCRAMBLE_SPEED) {
            scrambleTimer.current = 0;
            setDisplay(randomString(currentLength.current));
        }
    });

    return (
        <group {...props}>
            <Text
                fontSize={0.12}
                color="#b91c1c"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
            >
                {display}
            </Text>
        </group>
    );
}
