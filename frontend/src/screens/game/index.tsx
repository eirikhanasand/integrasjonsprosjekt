import GS from "@styles/globalStyles"
import Swipe from "@components/nav/swipe"
import { useSelector } from "react-redux"
import { View } from "react-native"
import Gameplay from "@components/game/inGame/game"
import StartGame from "@components/game/startGame"
import EndScreen from "./endScreen"

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
    const { inGame, alive } = useSelector((state: ReduxState) => state.game)

    // Game states
    const left = inGame ? undefined : "ShopNav"
    const right = inGame ? undefined : "MenuNav"

    // --- DISPLAYS THE GAMESCREEN ---
    return (
        <Swipe left={left} right={right}>
            <View>
                <View style={{
                    ...GS.content,
                    paddingHorizontal: 0,
                    backgroundColor: theme.darker
                }}>
                    <StartGame />
                    {inGame && alive && <Gameplay  />}
                    {inGame && !alive && <EndScreen />}
                </View>
            </View>
        </Swipe>
    )
            
}