import GS from "@styles/globalStyles"
import Swipe from "@components/nav/swipe"
import { StatusBar } from "expo-status-bar"
import { useSelector } from "react-redux"
import { View } from "react-native"

/**
 * Parent AdScreen component
 *
 * Handles:
 * - Displaying ads
 * - Filtering ads
 * - Notification Management
 * - Ad notifications, both scheduling and cancelling
 *
 * @param {navigation} Navigation Navigation route
 * @returns AdScreen
 */
export default function AdScreen(): JSX.Element {
    
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // --- DISPLAYS THE EVENTSCREEN ---
    return (
        <Swipe left="EventNav" right="MenuNav">
            <View>
                <StatusBar style={"dark"} />
                <View style={{
                    ...GS.content,
                    paddingHorizontal: 5,
                    backgroundColor: theme.darker
                }}>
                </View>
            </View>
        </Swipe>
    )
            
}
