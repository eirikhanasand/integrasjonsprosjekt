import { setAlive, setInGame, setStartTime } from "@redux/game";
import T from "@styles/text";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import PlayerMode from "./mainScreen/playerMode";
import Coins from "./mainScreen/coins";
import PlayerList from "./mainScreen/playerList";
import Scoreboard from "./mainScreen/leaderboard";
import {useEffect, useState} from "react";
import Players from "./mainScreen/players";
import {API} from "@/constants";
import {mul} from "three/src/nodes/math/OperatorNode";

export default function StartGame() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const { lang } = useSelector((state: ReduxState) => state.lang);
    const { inGame } = useSelector((state: ReduxState) => state.game);

    const multiplayer = useSelector((state: ReduxState) => state.game.multiplayer)

    const [mode, setMode] = useState<'singleplayer' | 'multiplayer'>(multiplayer ? "multiplayer" : "singleplayer");

    const [players, setPlayers] = useState([lang ? "Spiller 1" : "Player 1"]);
    const height = Dimensions.get("window").height;
    const width = Dimensions.get("window").width;
    const dispatch = useDispatch();


    // Helper functions
    const text = lang ? "Trykk for å starte" : "Tap to Play";

    function dispatchGameStart() {
        dispatch(setStartTime(Date.now()));
        dispatch(setInGame(true));
        dispatch(setAlive(true));
    }

    async function fetchGameStatus() {
        const gameId = useSelector((state: ReduxState) => state.game.gameId)

        if (mode == "multiplayer") {
            const result = await fetchGameStartStatus(gameId)
            if (result == null) {
                return;
            } else {
                const startTime = result.getTime();
                const now = Date.now();

                const timeUntilStart = startTime - now;

                if (timeUntilStart <= 0) {
                    dispatchGameStart()
                } else {
                    setTimeout(() => {
                        dispatchGameStart()
                    }, timeUntilStart);
                }
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchGameStatus()
        }, 3000);
        return () => clearInterval(intervalId);
    }, []);

    function handleStart() {
        const gameId = useSelector((state: ReduxState) => state.game.gameId)

        if (mode == "multiplayer" && gameId == true) {
            startGame(gameId)
        } else {
            dispatchGameStart()
        }
    }


    return (
        <View style={{ display: inGame ? 'none' : 'flex' }}>
            <PlayerMode mode={mode} setMode={setMode} /> {}
            <Coins />
            {mode == "multiplayer" && (
                <PlayerList players={players} setPlayers={setPlayers} />
            )}
            <Scoreboard />
            <Players players={players} />
            <TouchableOpacity
                onPress={handleStart}
                style={{
                    width: width * 0.8,
                    alignSelf: "center",
                    height: 200,
                    bottom: 0,
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
    );
}

async function startGame(gameId: string): Promise<boolean> {
    const params = new URLSearchParams({
        gameId: gameId,
    }).toString();
    try {
        const response = await fetch(`${API}/game/start?${params}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            console.error('Failed to start game:', response.status);
            return false
        } else {
            console.log('Score sent successfully');
            return true
        }
    } catch (error) {
        console.error('Error sending score:', error);
        return false
    }
}

async function fetchGameStartStatus(gameId: string) : Promise<Date | null> {
    const params = new URLSearchParams({
        gameId: gameId,
    }).toString();
    try {
        const response = await fetch(`${API}/game/status?${params}`, {
            method: 'HEAD',
        });
        const time = response.headers.get("time-start");
        if (time !== null) {
            return new Date(time)
        }
        if (!response.ok) {
            console.error('Failed to start game:', response.status);
            return null
        } else {
            console.log('Score sent successfully');
            return null
        }
    } catch (error) {
        console.error('Error sending score:', error);
        return null
    }
}
