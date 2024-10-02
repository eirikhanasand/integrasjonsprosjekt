import { Dimensions, View } from "react-native";

export default function Players({players}: {players: any[]}) {
    const height = Dimensions.get('window').height
    const originalHeight = height * 0.8
    const playerCount = players.length
    const row = Math.floor((playerCount - 1) / 5)

    function getHeight() {
        const loss = (row) * 70
        return originalHeight - loss
    }

    return(
        <View style={{zIndex: -100, height}}>
            {/* Player Representation */}
            <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'center', 
                flexWrap: 'wrap', 
                top: getHeight()
            }}>
                {players.map((player, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: 'red',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            margin: 10,
                        }}
                    />
                ))}
            </View>
        </View>
    )
}