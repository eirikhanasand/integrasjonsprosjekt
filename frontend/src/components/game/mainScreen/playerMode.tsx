import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";

export default function PlayerMode() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const [mode, setMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer')
    const modeText = mode === 'singleplayer' ? 'Single Player' : 'Multiplayer'
    
    function handlePress() {
        setMode(mode === 'singleplayer' ? 'multiplayer' : 'singleplayer')
    }

    return (
        <View style={{ 
            width: 140, 
            height: 40, 
            top: 50, 
            left: 20, 
            position: 'absolute',
            borderRadius: 20,
        }}>
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.contrast, 
                width: 140, 
                height: 40,
                borderRadius: 8,
            }}>
                <Text style={{color: theme.textColor}}>
                    {modeText}
                </Text>
            </TouchableOpacity>
        </View>
    )
}