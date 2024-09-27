import { GameStackParamList } from "@type/screenTypes"
import { StackScreenProps } from "@react-navigation/stack"
import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import GS from "@styles/globalStyles"
import { useSelector } from "react-redux"

type PauseScreenProps = StackScreenProps<GameStackParamList, "PauseScreen">

export default function PauseScreen({ route, navigation }: PauseScreenProps) {
    const { score, onResume, setInGame } = route.params
    const { theme } = useSelector((state: ReduxState) => state.theme)

    function handleUnpause() {
        if (onResume) {
            onResume()
        }
        navigation.goBack()
    }

    function handleGoToShop() {
        // navigation.navigate("ShopScreen");
    }

    function handleExitGame() {
        setInGame(false)
        navigation.navigate("GameScreen")
    }

    return (
        <View style={{ 
            ...styles.container,
            backgroundColor: theme.background, 
        }}>
            <Text style={{...styles.text, color: theme.textColor}}>
                Current score: {score}
            </Text>
            
            {/* Button to resume game */}
            <Button handler={handleUnpause} text="Return to Game" />

            {/* Button to navigate to shop screen */}
            <Button handler={handleGoToShop} text="Go to Shop" />

            {/* Button to exit the game and return to start screen */}
            <Button handler={handleExitGame} text="Exit to Main menu" />
        </View>
    );
}

function Button({handler, text}: { handler: () => void, text: string }) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <TouchableOpacity 
            style={{...styles.button, backgroundColor: theme.contrast}} 
            onPress={handler}
        >
            <Text style={{...styles.buttonText, color: theme.textColor}}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: { 
        ...GS.content,
        paddingHorizontal: 0,
        width: '100%', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold'
    },
    button: {
        padding: 15,
        paddingVertical: 10,
        borderRadius: 5,
        marginVertical: 10,
        width: 160,
    },
    buttonText: {
        fontWeight: 'bold',
        textAlign: 'center'
    },
})
