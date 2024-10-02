import { StyleProp, View, ViewStyle } from "react-native"
import { Svg, Path } from "react-native-svg"

export default function PlayIcon({style, color}: {style?: StyleProp<ViewStyle>, color: string}) {
    return (
        <View style={style}>
            <Svg viewBox="0 0 24 24">
                <Path fill={color} d="M7,6.82 L7,17.18 C7,17.97 7.87,18.45 8.54,18.02 L16.68,12.84 C17.3,12.45 17.3,11.55 16.68,11.15 L8.54,5.98 C7.87,5.55 7,6.03 7,6.82 Z" />
            </Svg>
        </View>
    )
}
