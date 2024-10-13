import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import GS from "@styles/globalStyles";
import { useDispatch, useSelector } from "react-redux";
import { setHighScore, setInGame } from "@redux/game";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Navigation } from "@/interfaces";

export default function EndScreen() {
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const { lang } = useSelector((state: ReduxState) => state.lang);
    const { coins, highscore, score } = useSelector((state: ReduxState) => state.game);
    const navigation: Navigation = useNavigation();
    const dispatch = useDispatch();

    const [highScoreText, setHighScoreText] = useState('');

    // Only update high score and high score text when the component mounts or when score changes
    useEffect(() => {
        if (score >= (highscore || 0)) {
            dispatch(setHighScore(score));  // Only dispatch if a new high score is achieved
            setHighScoreText(lang ? `Ny rekord: ${score}!` : `New highscore: ${score}!`);
        } else {
            setHighScoreText(lang ? `Rekord: ${highscore}` : `Highscore: ${highscore}`);
        }
    }, [score, highscore, lang, dispatch]);

    function handleExitEndScreen() {
        dispatch(setInGame(false));
        navigation.navigate("GameScreen");
    }

    return (
        <View style={{...styles.container, backgroundColor: theme.background}}>
            <Text style={{...styles.gameOver, color: theme.textColor}}>
                {lang ? 'Spillet er slutt!' : 'Game over!'}
            </Text>
            <Text style={{...styles.text, color: theme.textColor}}>{highScoreText}</Text>
            {score < (highscore || 0) && (
                <Text style={{...styles.text, color: theme.textColor}}>
                    {lang ? 'Poengsum' : 'Score'}: {score}
                </Text>
            )}
            <Text style={{...styles.text, color: theme.textColor}}>
                {lang ? 'Mynter' : 'Coins'}: {coins}
            </Text>

            {/* Button to exit the game and return to start screen */}
            <Button handler={handleExitEndScreen} text={lang ? 'Fortsett' : 'Continue'} theme={theme} />
        </View>
    );
}

function Button({ handler, text, theme }: { handler: () => void, text: string, theme: any }) {
    return (
        <TouchableOpacity 
            style={{...styles.button, backgroundColor: theme.contrast}} 
            onPress={handler}
        >
            <Text style={{...styles.buttonText, color: theme.textColor}}>
                {text}
            </Text>
        </TouchableOpacity>
    );
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
});
