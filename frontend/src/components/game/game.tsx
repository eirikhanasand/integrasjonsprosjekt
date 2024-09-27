import { PureComponent, useState, useEffect, SetStateAction, Dispatch } from "react"
import { GameEngine } from "react-native-game-engine"
import Player from "./player"
import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import T from "@styles/text"
import { useNavigation } from "@react-navigation/native"
import { Navigation } from "@/interfaces"
import Game3D from "./three"

type GamePlayProps = {
    setInGame: Dispatch<SetStateAction<boolean>>
}

type GameProps = {
    paused: boolean
}

type PauseButtonProps = {
    score: number
    onPause: () => void
    onResume: () => void
    setInGame: Dispatch<SetStateAction<boolean>>
}

export default function Gameplay({ setInGame }: GamePlayProps) {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Game states
    const [score, setScore] = useState(0)
    const [multiplier, setMultiplier] = useState(31)
    const [paused, setPaused] = useState(false)

    // Helper functions
    function updateScore() {
        setScore((prev) => prev + 1 * multiplier);
    }

    // Handle score updates based on the paused state
    useEffect(() => {
        if (!paused) {
            const interval = setInterval(() => {
                console.log("Score Updated")
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
        console.log("Game Paused")
        setPaused(true)
    }
    
    // Resumes the game
    function handleResume() {
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
            <Text style={{
                ...T.text20,
                position: 'absolute',
                color: theme.textColor,
                top: 65,
                zIndex: 10,
                right: 10,
                fontWeight: '800'
            }}>
                {score}
            </Text>
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
            <Game paused={paused} />
        </>
    );
}

class Game extends PureComponent<GameProps> {
    constructor(props: GameProps) {
        super(props)
    }

    render() {
        return (
            <GameEngine
                style={{}}
                systems={[]}
                entities={{
                    1: { position: [], renderer: <Player /> },
                }}
                running={!this.props.paused}
            />
        )
    }
}

function PauseButton({ score, onPause, onResume, setInGame }: PauseButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const navigation: Navigation = useNavigation()

    function handlePress() {
        onPause()
        navigation.navigate("PauseScreen", {
            score,
            onResume,
            setInGame,
        })
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                position: 'absolute',
                top: 65,
                zIndex: 10,
                left: 10,
            }}
        >
            <Text style={{
                ...T.text20,
                color: theme.textColor,
                fontWeight: '800'
            }}>
                Pause
            </Text>
        </TouchableOpacity>
    );
}
