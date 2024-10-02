import { useState, useEffect, memo } from 'react'
import { Asset } from 'expo-asset'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Platform, Text, View } from 'react-native'
import * as Device from 'expo-device'

export default function Map() {
    const [modelUri, setModelUri] = useState<string | null>(null);

    // Preload the model
    useEffect(() => {
        async function loadModel() {
            try {
                const asset = Asset.fromModule(require("@assets/models/map/Level.glb"))
                await asset.downloadAsync()
                setModelUri(asset.localUri)
                console.log('Map Model URI:', asset.localUri)
            } catch (error) {
                console.error('Error loading map model:', error)
            }
        }

        loadModel()
    }, [])

    return (
        <View style={{ height: '100%', width: '100%' }}>
            {modelUri ? (
                <Canvas
                    camera={{ position: [0, 5, 10], fov: 75 }}
                    onCreated={() => {
                        console.log('Map Canvas created')
                    }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <Model modelUri={modelUri} />
                </Canvas>
            ) : (
                <Text>Loading Model...</Text>
            )}
        </View>
    )
}

const Model = memo(({ modelUri }: { modelUri: string }) => {
    if (Platform.OS === 'ios' && !Device.isDevice) {
        console.error("iOS simulators do not support loading glb files. Map will not be displayed.")
        return null
    }

    console.log("Map Model component called with URI:", modelUri)

    // Use useGLTF to load the model
    const { scene } = useGLTF(modelUri, true)

    useEffect(() => {
        if (scene) {
            console.log("Inside Map Model useEffect - Map Loaded")
            const bbox = new THREE.Box3().setFromObject(scene)
            console.log('Map Bounding box:', bbox)
        }
    }, [scene])

    return scene ? <primitive object={scene} scale={[1, 1, 1]} position={[0, 1, 10]} rotation={[-0.1, 0, 0]} /> : null
})
