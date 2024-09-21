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
            <TouchableOpacity style={styles.button} onPress={handleUnpause}>
                <Text style={styles.buttonText}>Return to Game</Text>
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
    },
    buttonText: {
        color: 'red',
        fontWeight: 'bold',
    },
});
