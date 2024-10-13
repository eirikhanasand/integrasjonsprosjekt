import { useState, useEffect, useRef, memo } from 'react'
import { Asset } from 'expo-asset'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Platform, Text, View } from 'react-native'
import * as Device from 'expo-device'

export default function Map() {
    const [modelUri, setModelUri] = useState<string | null>(null)

    // Preload the model
    useEffect(() => {
        async function loadModel() {
            try {
                const asset = Asset.fromModule(require("@assets/models/map/Level.glb"))
                await asset.downloadAsync()
                setModelUri(asset.localUri)  // This should only set once
                console.log('Map Model URI:', asset.localUri)
            } catch (error) {
                console.error('Error loading map model:', error)
            }
        }

        loadModel()
    }, [])  // Empty array ensures the effect runs only once on mount

    return (
        <View style={{ height: '100%', width: '100%' }}>
            {modelUri ? (
                <Canvas
                    camera={{ position: [0, 3, 10], fov: 75 }}
                    onCreated={({ gl }) => {
                        gl.shadowMap.enabled = true  // Enable shadow maps for better quality (if supported)
                        console.log('Map Canvas created')
                    }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight 
                        position={[5, 10, 7.5]} 
                        intensity={1.5} 
                        castShadow 
                        shadow-mapSize-width={1024} 
                        shadow-mapSize-height={1024}
                    />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <InfiniteMovingCorridor modelUri={modelUri} />
                </Canvas>
            ) : (
                <Text>Loading Model...</Text>
            )}
        </View>
    )
}

const InfiniteMovingCorridor = memo(({ modelUri }: { modelUri: string }) => {
    if (Platform.OS === 'ios' && !Device.isDevice) {
        console.error("iOS simulators do not support loading glb files. Map will not be displayed.")
        return null
    }

    console.log("Map Model component called with URI:", modelUri)

    // Use useGLTF to load the model
    const { scene } = useGLTF(modelUri, true)

    // Create a ref to keep track of the corridor's position
    const corridorRef = useRef<THREE.Group>(null)

    // Move the corridor forward (towards the camera) to simulate the motion
    useFrame(() => {
        if (corridorRef.current) {
            // Adjust the speed of the movement (increase/decrease as needed)
            corridorRef.current.position.z += 0.1  // Moving forward along the Z-axis

            // Reset the corridor position when it reaches the camera
            if (corridorRef.current.position.z > 10) {
                corridorRef.current.position.z = 0  // Reset the position for an infinite loop
            }
        }
    })

    useEffect(() => {
        if (scene) {
            console.log("Inside Map Model useEffect - Map Loaded")
            const bbox = new THREE.Box3().setFromObject(scene)
            console.log('Map Bounding box:', bbox)

            // Optional: Perform bounding box or scene transformations based on the scene size
        }
    }, [scene])  // Only run this effect when 'scene' changes, preventing infinite re-renders

    // Fallback message in case model doesn't load correctly
    if (!scene) return <Text>Failed to load model</Text>

    return (
        <primitive
            ref={corridorRef}  // Attach the ref to track this object
            object={scene}
            scale={[1, 1, 1]}
            position={[0, 1, 0]}  // Start it behind the camera and move it forward
            rotation={[0, 0, 0]}
        />
    )
})
