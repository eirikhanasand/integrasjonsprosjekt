import Map from "./map"
import PauseButton from "./pause"
import RightCorner from "../rightCorner"
import { GameEngine } from "react-native-game-engine"
import { Animated, Dimensions, View } from "react-native"
import { useEffect, useRef, useState } from "react"
import CoinSpawner from "./coins"
import Player from "./player"
import { useDispatch, useSelector } from "react-redux"
import { addCoins, setAlive, setScore as storeScore, setStartTime } from "@redux/game"
import ObstacleSpawner from "./obstacles"
import { AnimatedValue } from "@/interfaces"

type GameProps = {
    paused: boolean
    playerX: AnimatedValue
    playerY: AnimatedValue
    kill: () => void
}

export default function Gameplay() {
    const { startTime, multiplier } = useSelector((state: ReduxState) => state.game)
    
    // Game states
    const [score, setScore] = useState(0)
    const [paused, setPaused] = useState(false)
    const [pauseTime, setPauseTime] = useState<number>(0)
    const originalX = Dimensions.get('window').width * 0.5 - 25
    const originalY = Dimensions.get('window').height * 0.73
    const playerX = useRef(new Animated.Value(originalX)).current as AnimatedValue
    const playerY = useRef(new Animated.Value(originalY)).current as AnimatedValue
    const scoreRef = useRef(0)
    const dispatch = useDispatch()

    // Helper functions
    function updateScore() {
        setScore((prev) => prev + 1 * (multiplier || 31))
    }

    // Pauses the game
    function handlePause() {
        setPauseTime(Date.now())
        dispatch(storeScore(score))
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

    // Kills the player
    function kill() {
        dispatch(setAlive(false))
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

    // Stores score when the component is unmounted
    useEffect(() => {
        return () => {
            dispatch(storeScore(scoreRef.current))
        }
    }, [])

    // Updates scoreRef to equal score
    useEffect(() => {
        scoreRef.current = score
    }, [score])

    return (
        <>
            <PauseButton onPause={handlePause} onResume={handleResume} />
            <RightCorner score={score} />
            <View style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#87ceeb'
            }}>
                <Map />
            </View>
            <Game paused={paused} playerX={playerX} playerY={playerY} kill={kill} />
        </>
    )
}

function Game({playerX, playerY, paused, kill}: GameProps) {
    const { startTime } = useSelector((state: ReduxState) => state.game)
    const dispatch = useDispatch()

    function addCoin() {
        dispatch(addCoins(1))
    }

    return (
        <GameEngine
            style={{flex: 1}}
            systems={[CoinSpawner, ObstacleSpawner]}
            entities={{
                player: { 
                    position: [playerX, playerY], 
                    translateX: playerX, 
                    translateY: playerY,
                    // @ts-expect-error (expects translateX and translateY, but they are already passed)
                    renderer: <Player /> 
                },
                engine: { 
                    nextCoinSpawn: startTime - Date.now(),
                    nextObstacleSpawn: startTime - Date.now()
                },
                addCoin,
                kill
            }}
            running={!paused}
        />
    )
}