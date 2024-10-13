import Map from "./map";
import PauseButton from "./pause";
import RightCorner from "../rightCorner";
import { GameEngine } from "react-native-game-engine";
import { Animated, Dimensions, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import CoinSpawner from "./coins";
import Player from "./player";
import { useDispatch, useSelector } from "react-redux";
import { addCoins, setAlive, setScore as storeScore, setStartTime } from "@redux/game";
import ObstacleSpawner from "./obstacles";
import { AnimatedValue } from "@/interfaces";
import Ghost from "./ghost";
import { Asset } from "expo-asset";
import { getCurrentScores } from "@utils/getRoundScore";
import { setScore as saveScore } from "@redux/game";
import { API } from "@/constants";

type GameProps = {
    paused: boolean;
    playerX: AnimatedValue;
    playerY: AnimatedValue;
    kill: () => void;
};

type TransformEntity = Entity & {
    translateX: AnimatedValue | number;
    translateY: AnimatedValue | number;
    modelUri: string;
    name: string;
    score: number;
};

type Ghost = {
    x: AnimatedValue;
    y: AnimatedValue;
    name: string;
    score: number;
};

export default function Gameplay() {
    const { startTime, multiplier, inGame } = useSelector((state: ReduxState) => state.game); // Added inGame state to control if game is running
    const [score, setScore] = useState(0);
    const [paused, setPaused] = useState(false);
    const [pauseTime, setPauseTime] = useState<number>(0);
    const playerX = useRef(new Animated.Value(Dimensions.get('window').width * 0.5 - 25)).current;
    const playerY = useRef(new Animated.Value(Dimensions.get('window').height * 0.58)).current;
    const scoreRef = useRef(0);
    const dispatch = useDispatch();

    const { userId, gameId } = useSelector((state: ReduxState) => ({
        userId: state.user.userID,
        gameId: state.game.gameId,
    }));

    // Helper function to update score
    function updateScore() {
        setScore((prev) => prev + 1 * (multiplier || 31));
    }

    // Pauses the game
    function handlePause() {
        setPauseTime(Date.now());
        dispatch(storeScore(score));
        console.log("Game Paused");
        setPaused(true);
    }

    // Resumes the game
    function handleResume() {
        dispatch(setStartTime(startTime + (pauseTime - startTime)));
        setPauseTime(0);
        setPaused(false);
    }

    // Kills the player
    function kill() {
        if (gameId !== "") {  // Changed from `gameId === true` to `gameId !== ""` for correct comparison
            sendDeath(true, userId, gameId);
        }
    }

    // Handle score updates based on the paused state
    useEffect(() => {
        if (!paused && inGame) { // Ensure score only updates when game is active
            const interval = setInterval(() => {
                updateScore();
            }, 2000); // Update score every 2 seconds

            return () => {
                clearInterval(interval); // Clear interval when paused or unmounted
            };
        }
    }, [paused, multiplier, inGame]); // Score updates only when the game is running

    // Stores score when the component is unmounted or game pauses
    useEffect(() => {
        return () => {
            dispatch(storeScore(scoreRef.current));
        };
    }, []);

    // Sync scoreRef with score and dispatch to Redux
    useEffect(() => {
        scoreRef.current = score;
        dispatch(saveScore(score)); // Dispatch score to Redux
    }, [score]);

    // Send score to API
    const handleSendScore = () => {
        sendScore(score, userId, gameId);
    };

    useEffect(() => {
        if (gameId !== "") { // Ensure gameId is correctly compared
            const interval = setInterval(handleSendScore, 1000);
            return () => clearInterval(interval);
        }
    }, [gameId]);

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
            <Game paused={paused} playerX={playerX} playerY={playerY} kill={kill} />
        </>
    );
}

function Game({ playerX, playerY, paused, kill }: GameProps) {
    const { startTime } = useSelector((state: ReduxState) => state.game);
    const [ghosts, setGhosts] = useState<Score[]>([]);
    const [modelUri, setModelUri] = useState<string | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        async function loadModel() {
            const asset = await Asset.fromModule(require("@assets/models/characters/ghost.glb")).downloadAsync();
            setModelUri(asset.localUri);
        }

        loadModel();
    }, []);

    useEffect(() => {
        async function loadGhosts() {
            const current = await getCurrentScores();

            if (current) {
                setGhosts(current);
            }
        }

        loadGhosts();
    }, []);

    if (!modelUri) {
        return null;
    }

    function addCoin() {
        dispatch(addCoins(1));
    }

    return (
        <GameEngine
            systems={[CoinSpawner, ObstacleSpawner]}
            entities={{
                player: {
                    position: [playerX, playerY],
                    translateX: playerX,
                    translateY: playerY,
                    renderer: <Player translateX={playerX} translateY={playerY} />,
                },
                ...ghosts.reduce<Record<string, TransformEntity>>((acc, ghost) => {
                    acc[ghost.name] = {
                        position: [ghost.x, ghost.y],
                        translateX: ghost.x,
                        translateY: ghost.y,
                        modelUri,
                        name: ghost.name,
                        score: ghost.score,
                        renderer: <Ghost translateX={ghost.x} translateY={ghost.y} modelUri={modelUri} name={ghost.name} score={ghost.score} />,
                    };
                    return acc;
                }, {}),
                addCoin,
                kill,
            }}
            running={!paused}
        />
    );
}

async function sendScore(score: number, userId: string, gameId: string) {
    const params = new URLSearchParams({
        userId: userId,
        score: score.toString(),
        gameId: gameId,
    }).toString();
    try {
        const response = await fetch(`${API}/game/score?${params}`, {
            method: "POST",
        });
        if (!response.ok) {
            console.error("Failed to send score:", response.status);
        } else {
            console.log("Score sent successfully");
        }
    } catch (error) {
        console.error("Error sending score:", error);
    }
}

async function sendDeath(death: boolean, userId: string, gameId: string) {
    const params = new URLSearchParams({
        userId: userId,
        died: death.toString(),
        gameId: gameId,
    }).toString();
    try {
        const response = await fetch(`${API}/game/score?${params}`, {
            method: "POST",
        });
        if (!response.ok) {
            console.error("Failed to send score:", response.status);
        } else {
            console.log("Score sent successfully");
        }
    } catch (error) {
        console.error("Error sending score:", error);
    }
}
