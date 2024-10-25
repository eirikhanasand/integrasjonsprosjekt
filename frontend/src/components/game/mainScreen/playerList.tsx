import { Dimensions, Text, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { useSelector } from "react-redux"

export default function PlayerList({players, setPlayers}: {players: any[], setPlayers: (_: any) => void}) {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height



    function handlePress() {
        setPlayers([...players, `Spiller ${players.length + 1}`])
        console.log("Clicked invite button (unimplemented)")
        const gameId = useSelector((state: ReduxState) =>  state.game.gameId)

        navigator.clipboard.writeText(gameId)
    }

    return (
        <View style={{ 
            width: 140, 
            height: 200,
            top: height * 0.2,
            backgroundColor: 'red',
            left: 20, 
            position: 'absolute',
            borderRadius: 20,
        }}>
            <ScrollView style={{
                backgroundColor: 'yellow', 
                marginBottom: 50, 
                borderTopLeftRadius: 20, 
                borderTopRightRadius: 20, 
                padding: 10
            }}>
            {players.map((player, index) => (
                <Text key={index} style={{ fontWeight: 'bold' }}>{player}</Text>
            ))}
            </ScrollView>
            <TouchableOpacity onPress={handlePress} activeOpacity={1} style={{
                justifyContent: 'center',
                alignSelf: 'center',
                bottom: 10,
                position: 'absolute',
                backgroundColor: theme.contrast, 
                width: 120, 
                height: 30,
                borderRadius: 8,
            }}>
                <Text style={{color: theme.textColor, textAlign: 'center', fontWeight: 'bold'}}>
                    Invite
                </Text>
            </TouchableOpacity>
        </View>
    )
}