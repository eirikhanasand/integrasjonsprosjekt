import { setAlive, setInGame, setStartTime } from "@redux/game"
import T from "@styles/text"
import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import PlayerMode from "./mainScreen/playerMode"
import Coins from "./mainScreen/coins"
import Players from "./mainScreen/players"
import Scoreboard from "./mainScreen/leaderboard"

export default function StartGame() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { inGame } = useSelector((state: ReduxState) => state.game)
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width
    const dispatch = useDispatch()

    // Game states
    const text = lang ? "Trykk for å starte" : "Tap to Play"

    // Helper functions
    // Hides start game text while playing
    if (inGame) {
        return null
    }

    function handleStart() {
        dispatch(setStartTime(Date.now()))
        dispatch(setInGame(true))
        dispatch(setAlive(true))
    }

    return (
        <View>
            <PlayerMode />
            <Coins />
            <Players />
            <Scoreboard />
            <TouchableOpacity
                onPress={handleStart}
                style={{
                   
                    top: height * 0.5,
                    width: width * 0.8,
                    alignSelf: 'center',
                    height: 200,
                }}
            >
                <Text style={{
                    ...T.text30,
                    color: theme.textColor,
                    fontWeight: '600',
                    alignSelf: 'center',
                    marginVertical: 'auto'
                }}>
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
