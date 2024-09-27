import { PureComponent, useState } from "react"
import { GameEngine } from "react-native-game-engine"
import Player from "./player"
import { Text, View, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"
import T from "@styles/text"
import { useNavigation } from "@react-navigation/native"
import { Navigation } from "@/interfaces"
import Game3D from "./three"

type GameProps = {
    // Add game props here
}

type PauseButtonProps = {
    score: number
}

export default function Gameplay() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Game states
    const [score, setScore] = useState(0)
    const [multiplier, setMultiplier] = useState(31)

    // Helper functions
    function updateScore() {
        setScore((prev) => prev + 1 * multiplier)
    }

    setTimeout(() => {
        updateScore()
        // 1 = 100k in 56 seconds, might be good for boosters.
        // 60 = 26k in 1 minute
    }, 60);


    return (
        <>
            <PauseButton score={score} />
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

            <Game />
        </>
    )
}

class Game extends PureComponent {
    constructor(props: GameProps) {
        super(props)
    }

    render() {
        return (
            <GameEngine
                style={{ }}
                systems={[]}
                entities={{
                    1: { position: [], renderer: <Player />},
                }}
            />
        )
    }
}

function PauseButton({score}: PauseButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const navigation: Navigation = useNavigation()

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate("PauseScreen", { score })}
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
    )
}