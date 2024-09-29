import Game3D from "./three"
import PauseButton from "./pause"
import RightCorner from "./rightCorner"
import { GameEngine } from "react-native-game-engine"
import { Animated, Dimensions, View } from "react-native"
import { 
    Dispatch,
    SetStateAction, 
    useEffect, 
    useRef, 
    useState, 
} from "react"
import CoinSpawner from "./coins"
import Player from "./player"
import { useDispatch, useSelector } from "react-redux"
import { addCoins, setStartTime } from "@redux/game"

type GamePlayProps = {
    setInGame: Dispatch<SetStateAction<boolean>>
}

type GameProps = {
    paused: boolean
    playerX: Animated.Value
    playerY: Animated.Value
}

export default function Gameplay({ setInGame }: GamePlayProps) {
    const { startTime } = useSelector((state: ReduxState) => state.game)
    
    // Game states
    const [score, setScore] = useState(0)
    const [multiplier, setMultiplier] = useState(31)
    const [paused, setPaused] = useState(false)
    const [pauseTime, setPauseTime] = useState<number>(0)
    const originalX = Dimensions.get('window').width * 0.5 - 25
    const originalY = Dimensions.get('window').height * 0.73
    const playerX = useRef(new Animated.Value(originalX)).current
    const playerY = useRef(new Animated.Value(originalY)).current
    const dispatch = useDispatch()

    // Helper functions
    function updateScore() {
        setScore((prev) => prev + 1 * multiplier)
    }

    // Handle score updates based on the paused state
    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                updateScore()
            }, 50)

            return () => {
                console.log("Clearing Interval")
                clearInterval(interval)
            }
        }
    }, [paused, multiplier])

    // Pauses the game
    function handlePause() {
        setPauseTime(Date.now())
        console.log("Game Paused")
        setPaused(true)
    }
    
    // Resumes the game
    function handleResume() {
        dispatch(setStartTime(startTime + (pauseTime - startTime)))
        setPauseTime(0)
        console.log("Game Resumed")
        setPaused(false)
    }

    return (
        <>
            <PauseButton
                score={score}
                onPause={handlePause} 
                onResume={handleResume} 
                setInGame={setInGame}
            />
            <RightCorner score={score} />
            <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
            }}>
                <Game3D />
            </View>
            <Game paused={paused} playerX={playerX} playerY={playerY} />
        </>
    )
}

function Game({playerX, playerY, paused}: GameProps) {
    const { startTime } = useSelector((state: ReduxState) => state.game)
    const dispatch = useDispatch()

    function addCoin() {
        dispatch(addCoins(1))
    }

    return (
        <GameEngine
            systems={[CoinSpawner]}
            entities={{
                player: { 
                    position: [playerX, playerY], 
                    translateX: playerX, 
                    translateY: playerY,
                    // @ts-expect-error (expects translateX and translateY, but they are already passed)
                    renderer: <Player /> 
                },
                engine: { nextCoinSpawn: startTime - Date.now() },
                addCoin
            }}
            running={!paused}
        />
    )
}
