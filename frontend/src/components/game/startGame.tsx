import { setAlive, setInGame, setStartTime } from "@redux/game"
import T from "@styles/text"
import { Text, TouchableOpacity } from "react-native"
import { useDispatch, useSelector } from "react-redux"

export default function StartGame() {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { inGame } = useSelector((state: ReduxState) => state.game)
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
        <TouchableOpacity
            onPress={handleStart}
            style={{
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100,
                width: '100%',
                height: '100%',
            }}
        >
            <Text style={{
                ...T.text30,
                color: theme.textColor,
                fontWeight: '600',
            }}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}