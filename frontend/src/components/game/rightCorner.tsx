import { Text, View } from "react-native"
import { useSelector } from "react-redux"
import  Coin  from "./inGame/coin"
import T from "@styles/text"
import { getCurrentScores } from "@utils/getRoundScore"
import { useEffect, useState } from "react"

type RightCornerProps = {
    score: number
}

export default function RightCorner({ score }: RightCornerProps) {
    const { theme } = useSelector(( state: ReduxState ) => state.theme)
    const { coins } = useSelector(( state: ReduxState ) => state.game)

    return (
        <View style={{
            position: 'absolute', 
            zIndex: 100, 
            top: 60, 
            alignSelf: 'flex-end',
            right: 10
        }}>
            <View style={{
                backgroundColor: '#222222AA',
                width: 180,
                height: 60,
                borderRadius: 10,
            }}>
                <Text style={{
                    ...T.text20,
                    position: 'absolute',
                    color: theme.textColor,
                    right: 10,
                    top: 5,
                    fontWeight: '800',
                    flexDirection: 'row'
                }}>
                    {score}
                    
                </Text>
                <Text style={{
                    ...T.text20,
                    position: 'absolute',
                    color: theme.textColor,
                    top: 30,
                    right: 35,
                    fontWeight: '800'
                }}>
                    {coins}
                </Text>
            </View>
            <OtherPlayers />
        </View>
    )
}

function OtherPlayers() {
    const [scores, setScores] = useState<Score[] | undefined>(undefined)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { score } = useSelector((state: ReduxState) => state.game)

    useEffect(() => {
        (async() => {
            const current = await getCurrentScores()
            
            if (current) {
                setScores(current)
            }
        })()
    }, [])

    if (!Array.isArray(scores) || !scores.length) {
        return null
    }

    return (
        <View style={{
            backgroundColor: '#22222233', 
            width: 180, 
            maxHeight: 200, 
            marginTop: 10, 
            borderRadius: 10,
            padding: 10
        }}>
            {scores.sort((a, b) => b.score - a.score).map((player) => (
                <View key={player.name} style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                    <Text style={{color: theme.textColor, fontWeight: 'bold', height: 20, fontSize: 15}}>{player.name}</Text>
                    <Text style={{color: score > player.score ? 'green' : 'red', fontWeight: 'bold', height: 20, fontSize: 15}}>{player.score}</Text>
                </View>
            ))}
        </View>
    )
}