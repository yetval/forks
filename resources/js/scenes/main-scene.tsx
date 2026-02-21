import Fork from '@/models/fork';

export default function MainScene() {
    return (
        <>
            <Fork rotation={[Math.PI / 2, 0, 0]} />
            <ambientLight intensity={0.1} />
            <directionalLight color="red" position={[0, 0, 5]} />
        </>
    );
}
