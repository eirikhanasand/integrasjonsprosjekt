import { useFrame } from '@react-three/fiber'
import { useRef, useState, useEffect, memo } from 'react'
import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { Text } from 'react-native'

const InfiniteMovingCorridor = memo(({ modelUri }: { modelUri: string }) => {
  const [lastframetime, setTime] = useState(new Date().getTime())
  const corridorRef = useRef<THREE.Group>(null)

  const { scene } = useGLTF(modelUri, true)

  useFrame(() => {
    const timenow = new Date().getTime()
    if (corridorRef.current) {
      const deltaTime = timenow - lastframetime
      corridorRef.current.position.z += 0.01 * deltaTime

      if (corridorRef.current.position.z > 30) {
        corridorRef.current.position.z = 0
      }
    }
    setTime(timenow)
  })

  useEffect(() => {
    if (scene) {
      console.log("Inside Map Model useEffect - Map Loaded")
      const bbox = new THREE.Box3().setFromObject(scene)
      console.log('Map Bounding box:', bbox)
    }
  }, [scene])

  if (!scene) return <Text>Failed to load model</Text>

  return (
    <primitive
      ref={corridorRef}
      object={scene}
      scale={[1, 1, 1]}
      position={[0, 1, 0]}
      rotation={[0, 0, 0]}
    />
  )
})

export default InfiniteMovingCorridor
