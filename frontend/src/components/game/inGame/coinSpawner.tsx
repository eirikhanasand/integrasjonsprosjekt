import { useFrame } from '@react-three/fiber';
import { useDispatch } from 'react-redux';
import { useState, useRef } from 'react';
import Coin from './coin';
import { addCoins as addCoinsAction } from '@redux/game';

type CoinEntity = {
  id: string;
  position: [number, number, number];
  lane: number;
  speed: number;
};

type CoinSpawnerProps = {
  playerPosition: [number, number, number];
};

function CoinSpawner({ playerPosition }: CoinSpawnerProps) {
  const dispatch = useDispatch();
  const [coins, setCoins] = useState<CoinEntity[]>([]);
  const coinsRef = useRef<CoinEntity[]>([]);
  const lanes = [-2, 0, 2];
  const spawnInterval = 2000; // Interval in milliseconds
  const resetDistance = -20; // Distance behind the player for initial spawn
  const despawnThresholdZ = 10; // Z-position threshold to despawn coins after passing player
  const lastSpawnTime = useRef(0);

  const spawnCoin = (lane: number) => {
    const newCoin: CoinEntity = {
      id: `coin_${Date.now()}_${Math.random()}`,
      position: [lane, 2, playerPosition[2] + resetDistance],
      lane,
      speed: 0.3, // Adjusted speed for testing
    };
    console.log(`Spawning coin at Z position: ${newCoin.position[2]}`);
    coinsRef.current.push(newCoin);
    setCoins([...coinsRef.current]);
  };

  const spawnCoinLine = () => {
    const lanesToFill = new Set<number>();
    const numLanesToSpawn = Math.floor(Math.random() * 3) + 1;
    while (lanesToFill.size < numLanesToSpawn) {
      lanesToFill.add(Math.floor(Math.random() * lanes.length));
    }
    lanesToFill.forEach((laneIndex) => spawnCoin(lanes[laneIndex]));
  };

  const removeCoin = (id: string) => {
    coinsRef.current = coinsRef.current.filter((coin) => coin.id !== id);
    setCoins([...coinsRef.current]);
  };

  useFrame(({ clock }) => {
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime() * 1000;

    // Spawn coins based on time interval
    if (elapsedTime - lastSpawnTime.current >= spawnInterval) {
      spawnCoinLine();
      lastSpawnTime.current = elapsedTime;
    }

    // Update coin positions and handle interactions
    coinsRef.current.forEach((coin) => {
      coin.position[2] += coin.speed * delta * 60; // Move coins towards the player
      const distanceToPlayer = Math.abs(coin.position[2] - playerPosition[2]);
      const isSameLane = coin.position[0] === playerPosition[0]; // Exact lane match

      if (distanceToPlayer < 1 && isSameLane) {
        console.log(`Collecting coin at Z position: ${coin.position[2]}`);
        dispatch(addCoinsAction(1));
        removeCoin(coin.id); // Remove coin upon collection
      }
    });

    // Filter out coins that have moved past the player by more than despawnThresholdZ
    coinsRef.current = coinsRef.current.filter((coin) => {
      const shouldKeep = coin.position[2] < playerPosition[2] + despawnThresholdZ;
      if (!shouldKeep) {
        console.log(`Despawning coin at Z position: ${coin.position[2]}`);
      }
      return shouldKeep;
    });

    // Sync state for rendering updates
    setCoins([...coinsRef.current]);
  });

  return (
    <>
      {coins.map((coin) => (
        <Coin
          key={coin.id}
          position={coin.position}
          lane={coin.lane}
          speed={coin.speed}
          onRemove={() => removeCoin(coin.id)}
        />
      ))}
    </>
  );
}

export default CoinSpawner;
