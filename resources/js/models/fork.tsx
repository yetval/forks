import React, { useRef } from 'react';
import { useGLTF } from '@react-three/drei';

export default function Fork(props) {
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

