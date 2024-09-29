import { Navigation } from "@/interfaces"
import { useNavigation } from "@react-navigation/native"
import T from "@styles/text"
import { Dispatch, SetStateAction } from "react"
import { Text, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"

type PauseButtonProps = {
    score: number
    onPause: () => void
    onResume: () => void
    setInGame: Dispatch<SetStateAction<boolean>>
}

export default function PauseButton({ score, onPause, onResume, setInGame }: PauseButtonProps) {
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
    )
}