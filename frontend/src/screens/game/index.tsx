import GS from "@styles/globalStyles"
import Swipe from "@components/nav/swipe"
import { useSelector } from "react-redux"
import { View } from "react-native"
import Gameplay from "@components/game/game"
import { useState } from "react"
import StartGame from "@components/game/startGame"

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

    // Game states
    const [inGame, setInGame] = useState(false)
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
                    <StartGame inGame={inGame} setInGame={setInGame} />
                    {inGame && <Gameplay setInGame={setInGame} />}
                </View>
            </View>
        </Swipe>
    )
            
}