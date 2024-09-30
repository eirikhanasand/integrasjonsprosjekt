import { Navigation } from "@/interfaces"
import { useNavigation } from "@react-navigation/native"
import T from "@styles/text"
import { Text, TouchableOpacity } from "react-native"
import { useSelector } from "react-redux"

type PauseButtonProps = {
    onPause: () => void
    onResume: () => void
}

export default function PauseButton({ onPause, onResume }: PauseButtonProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const navigation: Navigation = useNavigation()

    function handlePress() {
        onPause()
        navigation.navigate("PauseScreen", { onResume })
    }

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={{
                position: 'absolute',
                top: 65,
                zIndex: 100,
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