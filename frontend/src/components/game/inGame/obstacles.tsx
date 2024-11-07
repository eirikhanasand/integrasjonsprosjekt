import { AnimatedValue } from "@/interfaces"
import { Animated, Dimensions, StyleProp, ViewStyle } from "react-native"

type Entity = {
    position: [number, number]
    renderer: JSX.Element
}

type EngineEntity = {
    nextObstacleSpawn: number
}

type Entities = {
    [key: string]: Entity | EngineEntity
    engine: EngineEntity
    player: Entity
}

type CoinProps = {
    style?: StyleProp<ViewStyle>
    location?: {
        x: AnimatedValue
        y: AnimatedValue
    }
}

export default function ObstacleSpawner(entities: Entities, { time }: { time: { delta: number } }) {
    let engine = entities["engine"]
    let player = entities["player"] as Entity
    const kill = entities.kill
    const lineLength = 5
    const lanes = [0, 0, 0];
    // 0-2 lanes will be populated
    const numLanesToSpawn = Math.floor(Math.random() * 3)
    const lanesToFill = new Set<number>()
    while (lanesToFill.size < numLanesToSpawn) {
        // Randomly fills lanes
        lanesToFill.add(Math.floor(Math.random() * 3))
    }

    for (const lane of lanesToFill) {
        lanes[lane] = 1
    }
 
    // Interpolates obstacles toward the player
    Object.keys(entities).forEach((key) => {
        if (key.startsWith("obstacle_")) {
            let obstacle = entities[key] as Entity
            const [cx, cy] = obstacle.position
            let [pxValue, pyValue] = player.position
            // Moves obstacle towards the player based on delta time
            const speed = 1 * (time.delta / 16.67)
            // @ts-expect-error (hidden method on player position)
            const px = pxValue.__getValue()
            // @ts-expect-error (hidden method on player position)
            const py = pyValue.__getValue()
            const newX = cx
            const newY = cy + speed
            
            obstacle.position = [newX, newY]
            // @ts-expect-error (location does exist)
            obstacle.location.x.setValue(newX)
            // @ts-expect-error (location does exist)
            obstacle.location.y.setValue(newY)

            // Despawns the obstacle - player killed
            if (Math.abs(cy +300 - py) < 10 && Math.abs(cx - px) < 10) {
                // @ts-expect-error
                kill()
                delete entities[key]
            }

            // Despawns the coin - player passed it already, and its outside of the screen
            if (cy > Dimensions.get('window').height) {
                delete entities[key]
            }
        }
    })

    // Spawns coins based on delta time
    if (!engine.nextObstacleSpawn) {
        engine.nextObstacleSpawn = 0
    }

    engine.nextObstacleSpawn -= time.delta
    if (engine.nextObstacleSpawn <= 0) {
        lanes[0] && spawnObstacle(0, entities)
        lanes[1] && spawnObstacle(1, entities)
        lanes[2] && spawnObstacle(2, entities)

        // Resets the spawn timer (spawns every second / lineLength)
        engine.nextObstacleSpawn = 2000 * lineLength
    }

    return entities
}

export function Obstacle({ style, location }: CoinProps) {
    return (
        <Animated.View style={style ? style : {
            transform: location ? [
                { translateX: location.x }, 
                { translateY: location.y }
            ] : [],
            width: 50,
            height: 300,
            backgroundColor: 'red',
            position: 'absolute',
            zIndex: 50
        }} />
    )
}

function spawnObstacle(lane: number, entities: Entities) {
    const obstacle = createObstacle(lane)
    const newObstacleId = `obstacle_${lane}_${new Date().getTime()}`
    const newObstacle: Entity = {
        // @ts-expect-error (__getValue() isnt defined in type)
        position: [obstacle.x.__getValue(), obstacle.y.__getValue()],
        // @ts-expect-error (location isnt expected here)
        location: obstacle,
        renderer: <Obstacle />
    }

    entities[newObstacleId] = newObstacle
}

function createObstacle(lane: number) {
    const originalX = Dimensions.get('window').width * 0.5 - 125

    return {
        x: new Animated.Value(originalX + lane * 100),
        y: new Animated.Value(-100),
    }
}
