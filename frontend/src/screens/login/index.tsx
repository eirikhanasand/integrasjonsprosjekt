import GS from "@styles/globalStyles"
import Swipe from "@components/nav/swipe"
import { useDispatch, useSelector } from "react-redux"
import { Text, TouchableOpacity, View } from "react-native"
import { authenticate } from "@redux/user"

/**
 * Parent GameScreen component
 *
 * Handles:
 * - Core gameplay
 *
 * @param {navigation} Navigation Navigation route
 * @returns LoginScreen
 */
export default function LoginScreen(): JSX.Element {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()

    // Login with Dicord
    function handleLogin() {
        // Send to Discord login page
        dispatch(authenticate())
        // Should redirect to GameNav not ShopNav here
    }

    function handleRegister() {
        // Send to Discord register page
        // Then either authenticate and send to gamenav or send to loginscreen
    }

    // --- DISPLAYS THE LOGINSCREEN ---
    return (
        <Swipe>
            <View>
                <View style={{
                    ...GS.content,
                    paddingHorizontal: 0,
                    backgroundColor: theme.darker,
                    justifyContent: 'center',
                    alignContent: 'center'
                }}>
                    <TouchableOpacity 
                        style={{ 
                            backgroundColor: theme.contrast, 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            margin: 'auto',
                            padding: 12,
                            borderRadius: 12
                        }}
                        onPress={handleLogin}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }}>
                            Login with Discord
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Swipe>
    )
            
}