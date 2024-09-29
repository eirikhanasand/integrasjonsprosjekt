import { Text, View } from "react-native"
import { useSelector } from "react-redux"
import { Coin } from "./coins"
import T from "@styles/text"

type RightCornerProps = {
    score: number
}

export default function RightCorner({ score }: RightCornerProps) {
    const { theme } = useSelector(( state: ReduxState ) => state.theme)
    const { coins } = useSelector(( state: ReduxState ) => state.game)

    return (
        <View style={{
            backgroundColor: '#222222AA', 
            position: 'absolute', 
            width: 200, 
            height: 60, 
            zIndex: 100, 
            top: 60, 
            alignSelf: 'flex-end',
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
                <View>
                    <Coin style={{
                        position: 'absolute',
                        width: 18, 
                        height: 18, 
                        backgroundColor: 'yellow',
                        borderRadius: 20,
                        right: 1,
                        top: 6.5
                    }} />
                </View>
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
    )
}
