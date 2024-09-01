import GS from "@styles/globalStyles"
import { View } from "react-native"
import Swipe from "@components/nav/swipe"
import { useSelector } from "react-redux"

/**
 * Parent ShopScreen component
 *
 * @param {navigation} Navigation Navigation route
 * @returns ShopScreen
 */
export default function ShopScreen(): JSX.Element {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)

    // Displays the ShopScreen UI
    return (
        <Swipe right="GameNav">
            <View style={{ ...GS.content, backgroundColor: theme.darker }}>
            </View>
        </Swipe>
    )
}
