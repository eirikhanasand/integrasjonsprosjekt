import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import  Coin  from "../inGame/coin"

export default function Coins() {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { coins } = useSelector((state: ReduxState) => state.game)
    const [mode, setMode] = useState<'singleplayer' | 'multiplayer'>('singleplayer')
    
    function handlePress() {
        setMode(mode === 'singleplayer' ? 'multiplayer' : 'singleplayer')
    }

    return (
        <View style={{ 
            width: 140, 
            height: 40, 
            top: 50, 
            right: 20, 
            position: 'absolute',
            borderRadius: 20,
        }}>
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                justifyContent: 'center',
                alignItems: 'flex-end',
                backgroundColor: theme.contrast, 
                width: 140, 
                height: 40,
                borderRadius: 8,
            }}>
                <Text style={{color: theme.textColor, right: 30, fontSize: 18, fontWeight: 'bold'}}>
                    {coins}
                    
                </Text>
            </TouchableOpacity>
        </View>
    )
}