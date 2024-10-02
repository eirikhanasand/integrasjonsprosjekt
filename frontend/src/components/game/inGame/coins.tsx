import { AnimatedValue } from "@/interfaces"
import { Animated, Dimensions, StyleProp, ViewStyle } from "react-native"

type CoinProps = {
    style?: StyleProp<ViewStyle>
    location?: {
        x: AnimatedValue
        y: AnimatedValue
    }
}

export default function CoinSpawner(entities: Entities, { time }: { time: { delta: number } }) {
    let engine = entities["engine"]
    let player = entities["player"] as Entity
    const addCoin = entities.addCoin
    const lineLength = 5
    const lanes = [
        Math.floor(Math.random() * 2), 
        Math.floor(Math.random() * 2), 
        Math.floor(Math.random() * 2)
    ]
 
    // Interpolates coins toward the player
    Object.keys(entities).forEach((key) => {
        if (key.startsWith("coin_")) {
            let coin = entities[key] as Entity
            const [cx, cy] = coin.position
            let [pxValue, pyValue] = player.position
            // Moves coin towards the player based on delta time
            const speed = 1 * (time.delta / 16.67)
            const px = pxValue.__getValue()
            const py = pyValue.__getValue()
            const newX = cx
            const newY = cy + speed
            
            coin.position = [newX, newY]
            // @ts-expect-error (location does exist)
            coin.location.x.setValue(newX)
            // @ts-expect-error (location does exist)
            coin.location.y.setValue(newY)

            // Despawns the coin - picked up by player
            if (Math.abs((cy - 50) - py) < 10 && Math.abs(cx - px) < 10) {
                // @ts-expect-error
                addCoin()
                delete entities[key]
            }

            // Despawns the coin - player passed it already, and its outside of the screen
            if (cy > Dimensions.get('window').height) {
                delete entities[key]
            }
        }
    })

    // Spawns coins based on delta time
    if (!engine.nextCoinSpawn) {
        engine.nextCoinSpawn = 0
    }

    engine.nextCoinSpawn -= time.delta
    if (engine.nextCoinSpawn <= 0) {
        lanes[0] && spawnLine(0, entities, lineLength)
        lanes[1] && spawnLine(1, entities, lineLength)
        lanes[2] && spawnLine(2, entities, lineLength)

        // Resets the spawn timer (spawns every second / lineLength)
        engine.nextCoinSpawn = 2000 * lineLength
    }

    return entities
}

export function Coin({ style, location }: CoinProps) {
    return (
        <Animated.View style={style ? style : {
            transform: location ? [
                { translateX: location.x }, 
                { translateY: location.y }
            ] : [],
            width: 50,
            height: 50,
            backgroundColor: 'yellow',
            borderRadius: 25,
            position: 'absolute',
            zIndex: 100
        }} />
    )
}

function spawnLine(lane: number, entities: Entities, length: number) {
    for (let index = 0; index < length; index++) {
        setTimeout(() => {
            spawnCoin(lane, entities)
        }, index * 1000)
    }
}

function spawnCoin(lane: number, entities: Entities) {
    const coin = createCoin(lane)
    const newCoinId = `coin_${lane}_${new Date().getTime()}`
    const newCoin: Entity = {
        position: [coin.x.__getValue(), coin.y.__getValue()],
        // @ts-expect-error (location isnt expected here)
        location: coin,
        renderer: <Coin />
    }

    entities[newCoinId] = newCoin
}

function createCoin(lane: number): {
    x: AnimatedValue
    y: AnimatedValue
} {
    const originalX = Dimensions.get('window').width * 0.5 - 125

    return {
        x: new Animated.Value(originalX + lane * 100) as AnimatedValue,
        y: new Animated.Value(150) as AnimatedValue,
    }
}
