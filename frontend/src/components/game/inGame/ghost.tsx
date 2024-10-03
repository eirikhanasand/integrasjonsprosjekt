import { AnimatedValue } from "@/interfaces"
import { Animated } from "react-native"
import { Canvas } from '@react-three/fiber'
import { Text } from 'react-native'
import pixelStore from "./glPixelStorei"
import { memo, useEffect } from "react"
import { Platform } from "react-native"
import * as Device from "expo-device"
import * as THREE from "three"
import { useGLTF } from "@react-three/drei"

type GhostProps = {
    translateX: AnimatedValue
    translateY: AnimatedValue
    name: string
    score: number
    modelUri: string
}

export default function Ghost({translateX, translateY, name, score, modelUri}: GhostProps) {
    // console.log(translateX, translateY,name, score, modelUri )
    return (
        <Animated.View style={{
            width: 150, 
            height: 300,
            transform: [{translateX}, {translateY}],
            right: 300,
            opacity: 0.35,
            position: 'absolute'
        }}>
            {modelUri ? (
                <Canvas 
                    // gl={{ physicallyCorrectLights: true }} 
                    camera={{ position: [0, 5, 5], fov: 75 }}  
                    onCreated={(state) => {
                        // Supresses unsupported values
                        const _gl = state.gl.getContext()
                        const pixelStorei = _gl.pixelStorei.bind(_gl)
                        _gl.pixelStorei = pixelStore(pixelStorei, _gl)
                        console.log('Ghost canvas created')
                    }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <GhostModel modelUri={modelUri} name={name} />
                </Canvas>
            ) : (
                <Text>Loading Ghost...</Text>
            )}
        </Animated.View>
    )
}

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
            const clonedScene = scene.clone(true)
            const bbox = new THREE.Box3().setFromObject(clonedScene)
            const boxHelper = new THREE.BoxHelper(clonedScene, 0xff0000)
            clonedScene.add(boxHelper)
            console.log('Ghost Bounding box:', bbox)
        }
    }, [scene])

    console.log(scene ? `Scene found and ghost loaded for ${name}` : `Scene not found for ${name}, unable to load ghost.`)
    return scene ? <primitive object={scene.clone()} scale={[1.7, 2.7, 1.7]} position={[0, -3.5, 0]} /> : null
})
