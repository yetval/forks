import { useGLTF } from '@react-three/drei';
import type { ThreeElements } from '@react-three/fiber';
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        Object_4: THREE.Mesh
        Object_5: THREE.Mesh
    }
    materials: {
        ['Plastic_Glass_Shader.002']: THREE.MeshStandardMaterial
    }
}
type GroupProps = ThreeElements['group']

export default function Fork(props: GroupProps){
    const { nodes, materials } = useGLTF('/plastic_fork.glb') as unknown as GLTFResult
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
    )
}

useGLTF.preload('/plastic_fork.glb')
