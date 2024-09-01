import T from "@styles/text";
import { Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

type StartGameProps = {
    inGame: boolean
    setInGame: (inGame: boolean) => void
}

export default function StartGame({inGame, setInGame}: StartGameProps) {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)

    // Game states
    const text = lang ? "Trykk for å starte" : "Tap to Play"

    // Helper functions
    // Hides start game text while playing
    if (inGame) {
        return null
    }

    return (
        <TouchableOpacity
            onPress={() => setInGame(true)}
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