import { GameScreenProps } from "@type/screenTypes";
import { Text, View } from "react-native";
import GS from "@styles/globalStyles";

export default function PauseScreen({ route }: GameScreenProps<"PauseScreen">) {
    return (
        <View style={{ 
            ...GS.content,
            paddingHorizontal: 0,
            backgroundColor: 'red', 
            width: '100%', 
        }}>
            <Text>Current score: {route.params.score}</Text>
        </View>
    )
}