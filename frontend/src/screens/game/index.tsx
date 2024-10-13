import GS from "@styles/globalStyles";
import Swipe from "@components/nav/swipe";
import { useSelector } from "react-redux";
import { View } from "react-native";
import Gameplay from "@components/game/inGame/game";
import StartGame from "@components/game/startGame";
import EndScreen from "./endScreen";
import { useMemo } from "react";

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
    const { inGame = false, alive = false } = useSelector((state: ReduxState) => state.game)

    // Game states
    const left = inGame ? undefined : "ShopNav"
    const right = inGame ? undefined : "MenuNav"

    // Memoized components to avoid unnecessary re-renders
    const gameplayComponent = useMemo(() => {
        return inGame && alive ? <Gameplay /> : null
    }, [inGame, alive])

    const endScreenComponent = useMemo(() => {
        return inGame && !alive ? <EndScreen /> : null
    }, [inGame, alive])

    // --- DISPLAYS THE GAMESCREEN ---
    return (
        <Swipe left={left} right={right}>
            <View>
                <View
                    style={{
                        ...GS.content,
                        paddingHorizontal: 0,
                        backgroundColor: theme.darker,
                    }}
                >
                    {/* StartGame is rendered at all times */}
                    <StartGame />

                    {/* Conditionally render Gameplay or EndScreen based on the game state */}
                    {gameplayComponent}
                    {endScreenComponent}
                </View>
            </View>
        </Swipe>
    );
}
