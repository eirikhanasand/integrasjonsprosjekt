import { StatusBar } from "expo-status-bar"
import GS from "@styles/globalStyles"
import { View } from "react-native"
import Swipe from "@components/nav/swipe"
import { useSelector } from "react-redux"

/**
 * Parent EventScreen component
 *
 * Handles:
 * - Displaying events
 * - Filtering events
 * - Notification Management
 * - Event notifications, both scheduling and cancelling
 *
 * @param {navigation} Navigation Navigation route
 * @returns EventScreen
 */
export default function EventScreen(): JSX.Element {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Displays the EventScreen
    return (
        <Swipe right="AdNav">
            <View>
                <StatusBar style={"dark"} />
                <View 
                    style={{
                        ...GS.content,
                        paddingHorizontal: 5,
                        backgroundColor: theme.darker
                    }}
                    testID="eventScreen"
                >
                </View>
            </View>
        </Swipe>
    )
}
