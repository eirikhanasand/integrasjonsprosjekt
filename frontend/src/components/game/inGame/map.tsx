import { useState, useEffect, useRef, memo } from 'react'
import { Asset } from 'expo-asset'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { Platform, Text, View } from 'react-native'
import * as Device from 'expo-device'
import InfiniteMovingCorridor from './infiniteMovingCorridor'
import CoinSpawner from './coinSpawner'

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
  }, [])

  return (
    <View style={{ height: '100%', width: '100%' }}>
      {modelUri ? (
        <Canvas
          camera={{ position: [0, 3, 10], fov: 75 }}
          onCreated={({ gl }) => {
            gl.shadowMap.enabled = true
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
          <InfiniteMovingCorridor modelUri={modelUri} />
          <CoinSpawner playerPosition={[0, 0, 0]} />
        </Canvas>
      ) : (
        <Text>Loading Model...</Text>
      )}
    </View>
  )
}
