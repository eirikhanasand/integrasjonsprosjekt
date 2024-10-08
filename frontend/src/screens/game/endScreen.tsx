import { Text, View, TouchableOpacity, StyleSheet } from "react-native"
import GS from "@styles/globalStyles"
import { useDispatch, useSelector } from "react-redux"
import { setHighScore, setInGame } from "@redux/game"
import { useNavigation } from "@react-navigation/native"
import { Navigation } from "@/interfaces"

export default function EndScreen() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const { coins, highscore, score } = useSelector((state: ReduxState) => state.game)
    let highScoreText = ''
    const navigation: Navigation = useNavigation()
    const dispatch = useDispatch()

    function handleExitEndScreen() {
        dispatch(setInGame(false))
        navigation.navigate("GameScreen")
    }
    
    function HighScore() {
        dispatch(setHighScore(score))
        if (score >= (highscore || 0)) {
            highScoreText = lang ? `Ny rekord: ${highscore}!` : `New highscore: ${highscore}!`
        } else {
            highScoreText = lang ? `Rekord: ${highscore}` : `Highscore: ${highscore}`
        }

        return <Text style={{...styles.text, color: theme.textColor}}>{highScoreText}</Text>
    }

    return (
        <View style={{...styles.container, backgroundColor: theme.background}}>
            <Text style={{...styles.gameOver, color: theme.textColor}}>
                {lang ? 'Spillet er slutt!' : 'Game over!'}
            </Text>
            <HighScore />
            {score >= (highscore || 0) ? null : <Text style={{...styles.text, color: theme.textColor}}>
                {lang ? 'Poengsum' : 'Score'}: {score}
            </Text>}
            <Text style={{...styles.text, color: theme.textColor}}>
                {lang ? 'Mynter' : 'Coins'}: {coins}
            </Text>

            {/* Button to exit the game and return to start screen */}
            <Button handler={handleExitEndScreen} text={lang ? 'Fortsett' : 'Continue'} />
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
    gameOver: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 80,
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
