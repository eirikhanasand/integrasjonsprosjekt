import { useState, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Define the types for the obstacle entity
type ObstacleEntity = {
  id: string,
  position: [number, number, number],  // 3D position
  speed: number
};

// Define the types for the obstacle spawner's props
type ObstacleSpawnerProps = {
  playerPosition: [number, number, number]  // Player position in 3D space
};

// Define the types for the obstacle's props
type ObstacleProps = {
  position: [number, number, number],  // 3D position of the obstacle
  speed: number,  // Movement speed
  onRemove: () => void  // Function to call when the obstacle is removed
};

// Obstacle component that moves in the 3D space
function Obstacle({ position, speed, onRemove }: ObstacleProps) {
  const obstacleRef = useRef<THREE.Mesh>(null);

  // Update the position of the obstacle on each frame
  useFrame(() => {
    if (obstacleRef.current) {
      obstacleRef.current.position.z -= speed;  // Move the obstacle towards the player

      // Remove the obstacle if it goes behind the player
      if (obstacleRef.current.position.z < 0) {
        onRemove();  // Call the remove function
      }
    }
  });

  return (
    <mesh ref={obstacleRef} position={position}>
      <boxGeometry args={[1, 3, 1]} />  {/* Geometry of the obstacle */}
      <meshStandardMaterial color="red" />  {/* Material for the obstacle */}
    </mesh>
  );
}

// ObstacleSpawner component responsible for spawning and managing obstacles
function ObstacleSpawner({ playerPosition }: ObstacleSpawnerProps) {
  const [obstacles, setObstacles] = useState<ObstacleEntity[]>([]);  // Store obstacles in state
  const lanes = [-2, 0, 2];  // Lanes for obstacle placement on the X-axis

  // Function to spawn a new obstacle
  const spawnObstacle = () => {
    const lane = lanes[Math.floor(Math.random() * lanes.length)];  // Random lane
    const zPosition = -50;  // Start far behind the player
    const newObstacle: ObstacleEntity = {
      id: `obstacle_${Date.now()}`,  // Unique ID
      position: [lane, 1, zPosition],  // Position of the obstacle
      speed: 0.1,  // Speed of the obstacle
    };
    setObstacles((prevObstacles) => [...prevObstacles, newObstacle]);  // Add new obstacle to the list
  };

  // Use useFrame to spawn obstacles at intervals
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (Math.floor(elapsed) % 2 === 0) {
      spawnObstacle();  // Spawn a new obstacle every 2 seconds
    }
  });

  // Function to remove an obstacle when it goes behind the player
  const removeObstacle = (id: string) => {
    setObstacles((prevObstacles) => prevObstacles.filter((obs) => obs.id !== id));  // Remove obstacle from the list
  };

  return (
    <>
      {/* Render all obstacles */}
      {obstacles.map((obstacle) => (
        <Obstacle
          key={obstacle.id}  // Use unique ID as key
          position={obstacle.position}  // Pass position
          speed={obstacle.speed}  // Pass speed
          onRemove={() => removeObstacle(obstacle.id)}  // Pass the remove function
        />
      ))}
    </>
  );
}

export default ObstacleSpawner;
