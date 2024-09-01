import GS from "@styles/globalStyles"
import Swipe from "@components/nav/swipe"
import { StatusBar } from "expo-status-bar"
import { useSelector } from "react-redux"
import { View } from "react-native"
import Player from "@components/game/player"

/**
 * Parent GameScreen component
 *
 * Handles:
 * - Core gameplay
 *
 * @param {navigation} Navigation Navigation route
 * @returns GameScreen
 */
export default function GameScreen(): JSX.Element {
    
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // --- DISPLAYS THE GAMESCREEN ---
    return (
        <Swipe left="EventNav" right="MenuNav">
            <View>
                <StatusBar style={"dark"} />
                <View style={{
                    ...GS.content,
                    paddingHorizontal: 5,
                    backgroundColor: theme.darker
                }}>
                    <Player />
                </View>
            </View>
        </Swipe>
    )
            
}
