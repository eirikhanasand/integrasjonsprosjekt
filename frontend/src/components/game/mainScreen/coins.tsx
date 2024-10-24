import { useState } from "react"
import { Text, TouchableOpacity, View } from "react-native"
import { useSelector } from "react-redux"
import { Coin } from "../inGame/coins"

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
                    <View>
                        <Coin style={{
                            position: 'absolute',
                            width: 18, 
                            height: 18, 
                            backgroundColor: 'yellow',
                            borderRadius: 20,
                            right: -22,
                            bottom: -1
                        }} />
                    </View>
                </Text>
            </TouchableOpacity>
        </View>
    )
}