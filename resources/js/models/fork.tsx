import { useGLTF } from '@react-three/drei';
import { ThreeElements } from '@react-three/fiber';
import React, { JSX, useRef } from 'react';



type GroupProps = ThreeElements['group']
export default function Fork(props: GroupProps) {
    const { nodes, materials } = useGLTF('/plastic_fork.glb');
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_4.geometry}
                material={materials['Plastic_Glass_Shader.002']}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Object_5.geometry}
                material={materials['Plastic_Glass_Shader.002']}
            />
        </group>
    );
}

useGLTF.preload('/plastic_fork.glb');

