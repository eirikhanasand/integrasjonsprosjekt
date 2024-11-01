import { setAlive, setInGame, setStartTime } from "@redux/game"
import T from "@styles/text"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import PlayerMode from "./mainScreen/playerMode"
import Coins from "./mainScreen/coins"
import PlayerList from "./mainScreen/playerList"
import Scoreboard from "./mainScreen/leaderboard"
import {useEffect, useState} from "react"
import Players from "./mainScreen/players"
import { API } from "@/constants"
import {mod} from "three/src/nodes/math/MathNode";

export default function StartGame() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { inGame, multiplayer, gameId } = useSelector((state: ReduxState) => state.game)
    const { userID } = useSelector((state: ReduxState) => state.user)
    const [players, setPlayers] = useState([lang ? "Spiller 1" : "Player 1"])
    const height = Dimensions.get("window").height
    const width = Dimensions.get("window").width
    const dispatch = useDispatch()    
    const text = lang ? "Trykk for å starte" : "Tap to Play"

    function dispatchGameStart() {
        dispatch(setStartTime(Date.now()))
        dispatch(setInGame(true))
        dispatch(setAlive(true))
    }

    async function fetchGameStatus() {
        if (multiplayer && !inGame) {
            const result = await fetchGameStartStatus(gameId)

            if (result == null) {
                return
            } else {
                const startTime = result.getTime()
                const now = Date.now()

                const timeUntilStart = startTime - now

                if (timeUntilStart <= 0) {
                    dispatchGameStart()
                } else {
                    setTimeout(() => {
                        dispatchGameStart()
                    }, timeUntilStart)
                }
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            console.log("fetching status")
            if (multiplayer) {
                fetchGameStatus()
            }
        }, 3000)
        return () => clearInterval(intervalId)
    }, [])

    async function handleStart() {
        if (multiplayer && gameId) {
            let gameStart =  await startGame(gameId)
        } else {
            dispatchGameStart()
        }
    }


    return (
        <View style={{ display: inGame ? 'none' : 'flex' }}>
            <PlayerMode />
            <Coins />
            {multiplayer && (
                <PlayerList players={players} setPlayers={setPlayers} />
            )}
            <Scoreboard />
            <Players players={players} />
            <TouchableOpacity
                onPress={handleStart}
                style={{
                    width,
                    alignSelf: "center",
                    height: '100%',
                    bottom: 0,
                    zIndex: -100
                }}
            >
                <Text
                    style={{
                        ...T.text30,
                        color: theme.textColor,
                        fontWeight: "600",
                        alignSelf: "center",
                        top: height * 0.8,
                    }}
                >
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

async function startGame(gameId: string): Promise<boolean> {
    const params = new URLSearchParams({
        gameId: gameId,
    }).toString()
    try {
        const response = await fetch(`${API}/game/start?${params}`, {
            method: 'PUT',
        })
        if (!response.ok) {
            console.error('Failed to start game:', response)
            return false
        }
        console.log('sent start-game payload')
        return true
    } catch (error) {
        console.error('Error sending score:', error)
        return false
    }
}

async function fetchGameStartStatus(gameId: string) : Promise<Date | null> {
    console.log("STARTING WITH GAMEID", gameId)
    const params = new URLSearchParams({
        gameId: gameId,
    }).toString()
    try {
        const response = await fetch(`${API}/game/status?${params}`, {
            method: 'HEAD',
        })

        const time = response.headers.get("start-time")
        if (time !== null) {
            console.log("fetched game start with time")
            return new Date(time)
        }

        if (!response.ok) {
            console.error('Failed to start game:', response)
            return null
        }
        console.log('failed to fetch game start')
        return null
    } catch (error) {
        console.error('Error sending score:', error)
        return null
    }
}
