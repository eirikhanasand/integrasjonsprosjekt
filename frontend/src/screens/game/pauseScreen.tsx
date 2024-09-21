import { GameStackParamList } from "@type/screenTypes";
import { StackScreenProps } from "@react-navigation/stack";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import GS from "@styles/globalStyles";
import React from "react";

type PauseScreenProps = StackScreenProps<GameStackParamList, "PauseScreen">;

export default function PauseScreen({ route, navigation }: PauseScreenProps) {
    const { score, onResume } = route.params;

    const handleUnpause = () => {
        if (onResume) {
            onResume(); // Call the onResume callback to resume the game
        }
        navigation.goBack(); // Return to game screen
    };

    const handleGoToShop = () => {
 //       navigation.navigate("ShopScreen"); // Navigate to the shop screen
    };

    const handleExitGame = () => {
//        navigation.navigate("StartScreen"); // Navigate back to the start screen
    };

    return (
        <View style={{ 
            ...GS.content,
            paddingHorizontal: 0,
            backgroundColor: 'red', 
            width: '100%', 
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Text style={styles.text}>Current score: {score}</Text>
            
            {/* Button to resume game */}
            <TouchableOpacity style={styles.button} onPress={handleUnpause}>
                <Text style={styles.buttonText}>Return to Game</Text>
            </TouchableOpacity>

            {/* Button to navigate to shop screen */}
            <TouchableOpacity style={styles.button} onPress={handleGoToShop}>
                <Text style={styles.buttonText}>Go to Shop</Text>
            </TouchableOpacity>

            {/* Button to exit the game and return to start screen */}
            <TouchableOpacity style={styles.button} onPress={handleExitGame}>
                <Text style={styles.buttonText}>Exit to Main menu</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        marginBottom: 20,
        color: 'white',
    },
    button: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    buttonText: {
        color: 'red',
        fontWeight: 'bold',
    },
});
