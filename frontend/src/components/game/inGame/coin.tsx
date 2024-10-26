import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

type CoinProps = {
  position: [number, number, number],
  lane: number,
  speed: number,
  onRemove: () => void
}

function Coin({ position, lane, speed, onRemove }: CoinProps) {
  const coinRef = useRef<THREE.Mesh>(null)

  // Log to ensure the Coin component is rendering
  console.log("Rendering Coin at:", position)

  useFrame(() => {
    if (coinRef.current) {
      coinRef.current.position.z += speed  // Move towards the player

      // If the coin passes the player, remove it
      if (coinRef.current.position.z > 0) {
        console.log("Coin removed at Z:", coinRef.current.position.z)
        onRemove()
      }
    }
  })

  return (
    <mesh ref={coinRef} position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}

export default Coin
