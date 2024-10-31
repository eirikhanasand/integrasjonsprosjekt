// game.tsx (frontend/src/components/game/inGame)

import Map from "./map"
import PauseButton from "./pause"
import RightCorner from "../rightCorner"
import { GameEngine } from "react-native-game-engine"
import { Animated, Dimensions, View } from "react-native"
import { useEffect, useMemo, useRef, useState } from "react"
import CoinSpawner from "./coins"
import Player from "./player"
import { useDispatch, useSelector } from "react-redux"
import {
    addCoins,
    setAlive, setInGame,
    setScore as storeScore,
    setStartTime,
} from "@redux/game"
import ObstacleSpawner from "./obstacles"
import Ghost from "./ghost"
import { Asset } from "expo-asset"
import { getCurrentScores } from "@utils/getRoundScore"
import { setScore as saveScore } from "@redux/game"
import { API } from "@/constants"

// Remove custom AnimatedValue type and use Animated.Value directly
// type AnimatedValue = Animated.Value

// Rename Score to GhostScore to avoid conflicts
type GhostScore = {
    x: number
    y: number
    name: string
    score: number
}

// Update GameProps to include originalX and originalY
type GameProps = {
    paused: boolean
    playerX: Animated.Value
    playerY: Animated.Value
    kill: () => void
    score: number
    originalX: number
    originalY: number
}

// Entity type with correct Animated.Value types
type Entity = {
    position: [Animated.Value, Animated.Value]
    translateX: Animated.Value
    translateY: Animated.Value
    renderer: JSX.Element
}

// TransformEntity with correct types
type TransformEntity = Entity & {
    modelUri: string
    name: string
    score: number
}

export default function Gameplay() {
    const { startTime, multiplier } = useSelector((state: ReduxState) => state.game)

    const [score, setScore] = useState(0)
    const [paused, setPaused] = useState(false)
    const [pauseTime, setPauseTime] = useState<number>(0)
    const originalX = Dimensions.get("window").width * 0.5 - 25
    const originalY = Dimensions.get("window").height * 0.58
    const playerX = useRef(new Animated.Value(originalX)).current
    const playerY = useRef(new Animated.Value(originalY)).current
    const scoreRef = useRef(0)
    const dispatch = useDispatch()

    const { userId, gameId } = useSelector((state: ReduxState) => ({
        userId: state.user.userID,
        gameId: state.game.gameId,
    }))

    function handlePause() {
        setPauseTime(Date.now())
        dispatch(storeScore(score))
        console.log("Game Paused")
        setPaused(true)
    }

    function handleResume() {
        dispatch(setStartTime(startTime + (pauseTime - startTime)))
        setPauseTime(0)
        console.log("Game Resumed")
        setPaused(false)
    }

    async function kill() {
        if (gameId) {
            const aliveCount = await sendDeath(true, userId, gameId);

            if (aliveCount != 0) {
                return
            }
        }
        dispatch(setAlive(false))
        dispatch(setInGame(false))
    }

    function updateScore() {
        setScore((prev) => prev + 1 * (multiplier || 31))
    }


    useEffect(() => {
        if (!paused) {
        const interval = setInterval(() => {
            updateScore()
        }, 50)

        return () => clearInterval(interval)
        }
    }, [paused, multiplier])

    useEffect(() => {
        return () => {
        dispatch(storeScore(scoreRef.current))
        }
    }, [])

    useEffect(() => {
        scoreRef.current = score
        dispatch(saveScore(score))
    }, [score])

    const handleSendScore = () => {
        sendScore(score, userId, "")
    }

    useEffect(() => {
        if (gameId) {
        const interval = setInterval(handleSendScore, 1000)
        return () => clearInterval(interval)
        }
    }, [gameId, score])

    return (
        <>
            <PauseButton onPause={handlePause} onResume={handleResume} />
            <RightCorner score={score} />
            <View
                style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "#87ceeb",
                }}
            >
                <Map />
            </View>
            <Game
                paused={paused}
                playerX={playerX}
                playerY={playerY}
                kill={kill}
                score={score}
                originalX={originalX}
                originalY={originalY}
            />
        </>
    )
}

function Game({
    playerX,
    playerY,
    paused,
    kill,
    score,
    originalX,
    originalY,
}: GameProps) {
    const { startTime } = useSelector((state: ReduxState) => state.game)
    const [ghosts, setGhosts] = useState<GhostScore[]>([])
    const [modelUri, setModelUri] = useState<string>("")
    const [playerModelUri, setPlayerModelUri] = useState<string>("")
    const dispatch = useDispatch()

    // Load Ghost model
    useEffect(() => {
        async function loadModel() {
        try {
            const asset = Asset.fromModule(
            require("@assets/models/characters/ghost.glb")
            )
            await asset.downloadAsync()
            setModelUri(asset.localUri || "")
            console.log("Ghost Model URI:", asset.localUri)
        } catch (error) {
            console.error("Error loading ghost model:", error)
        }
        }

        loadModel()
    }, [])

    // Load Player model
    useEffect(() => {
        async function loadPlayerModel() {
        try {
            const asset = Asset.fromModule(
            require("@assets/models/characters/player.glb")
            )
            await asset.downloadAsync()
            setPlayerModelUri(asset.localUri || "")
            console.log("Player Model URI:", asset.localUri)
        } catch (error) {
            console.error("Error loading player model:", error)
        }
        }

        loadPlayerModel()
    }, [])

    // Load ghosts' scores and positions
    useEffect(() => {
        async function loadGhosts() {
        const current = await getCurrentScores()
        if (current) {
            setGhosts(current)
        }
        }

        // Uncomment to load ghosts periodically
        // loadGhosts()
    }, [])

    // Create ghost entities
    const ghostEntities = useMemo(() => {
        return ghosts.reduce<Record<string, TransformEntity>>((acc, ghost) => {
        const ghostX = new Animated.Value(ghost.x)
        const ghostY = new Animated.Value(ghost.y)

        acc[ghost.name] = {
            position: [ghostX, ghostY],
            translateX: ghostX,
            translateY: ghostY,
            modelUri,
            name: ghost.name,
            score: ghost.score,
            renderer: (
            <Ghost
                translateX={ghostX}
                translateY={ghostY}
                name={ghost.name}
                score={ghost.score}
                modelUri={modelUri}
            />
            ),
        }
        return acc
        }, {})
    }, [ghosts, modelUri])

    if (!modelUri || !playerModelUri) {
        console.log("Loading models...")
        return null
    }

    function addCoin() {
        dispatch(addCoins(1))
    }

    return (
        <GameEngine
        style={{ flex: 1 }}
        systems={[CoinSpawner, ObstacleSpawner]}
        entities={{
            player: {
            position: [playerX, playerY],
            translateX: playerX,
            translateY: playerY,
            name: "PlayerName", // Replace with actual player name
            score: score,
            modelUri: playerModelUri,
            renderer: (
                <Player
                translateX={playerX}
                translateY={playerY}
                name="PlayerName"
                score={score}
                modelUri={playerModelUri}
                originalX={originalX}
                originalY={originalY}
                />
            ),
            },
            ...ghostEntities,
            engine: {
            nextCoinSpawn: startTime - Date.now(),
            nextObstacleSpawn: startTime - Date.now(),
            },
            addCoin,
            kill,
        }}
        running={!paused}
        />
    )
}

async function sendScore(score: number, userId: string, gameId: string) {
    const params = new URLSearchParams({
        userId: userId,
        score: score.toString(),
        gameId: gameId,
    }).toString()

    try {
        const response = await fetch(`${API}/game/score?${params}`, {
            method: "POST",
        })

        if (!response.ok) {
            console.error("Failed to send score:", response.status)
        } else {
            console.log("Score sent successfully")
        }
    } catch (error) {
        console.error("Error sending score:", error)
    }
}

async function sendDeath(death: boolean, userId: string, gameId: string): Promise<number> {
    const params = new URLSearchParams({
        userId: userId,
        died: death.toString(),
        gameId: gameId,
    }).toString()

    try {
        const response = await fetch(`${API}/game/score?${params}`, {
            method: "POST",
        })
        if (!response.ok) {
            console.error("Failed to send death:", response.status)
        } else {
            console.log("Death sent successfully")
        }
        const aliveCount = response.json()

        return aliveCount
    } catch (error) {
        console.error("Error sending death:", error)
    }
    return -1
}
