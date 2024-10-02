import { memo, useEffect } from "react"
import { Platform } from "react-native"
import * as Device from "expo-device"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"

type GhostModelProps = {
    modelUri: string
    name: string
}

const GhostModel = memo(({ modelUri, name }: GhostModelProps) => {

    if (Platform.OS === 'ios' && !Device.isDevice) {
        console.error("iOS simulators do not support loading glb files. Character will not be displayed.")
        return null
    }

    console.log("Ghost model component called with URI:", modelUri)

    const { scene } = useGLTF(modelUri, true)

    useEffect(() => {
        if (scene) {
            console.log(`Inside Ghost model useEffect - Ghost Loaded for ${name}`)
            const bbox = new THREE.Box3().setFromObject(scene)
            const boxHelper = new THREE.BoxHelper(scene, 0xff0000)
            scene.add(boxHelper)
            console.log('Ghost Bounding box:', bbox)
        }
    }, [scene])
    console.log(scene ? `Scene found and ghost loaded for ${name}` : `Scene not found for ${name}, unable to load ghost.`)
    return scene ? <primitive object={scene} scale={[1.7, 2.7, 1.7]} position={[0, -3.5, 0]} /> : null
})

export default GhostModel