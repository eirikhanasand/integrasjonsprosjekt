import GS from "@styles/globalStyles";
import Swipe from "@components/nav/swipe";
import { useDispatch, useSelector } from "react-redux";
import { Text, TouchableOpacity, View, Alert } from "react-native";
import { useEffect } from "react";
import handleLogin from "@components/login/login";
import {authenticate, setUserID, setUsername} from "@redux/user";
import {Navigation} from "@/interfaces";
import {useNavigation} from "@react-navigation/native";

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
    const { theme } = useSelector((state: ReduxState) => state.theme);
    const dispatch = useDispatch();
    const currentState = useSelector((state: ReduxState) => state.user.authState)
    const navigation: Navigation = useNavigation()

    function initiateLogin() {
        handleLogin({ dispatch });
    };

    function handleAuthCallback () {
        const url = new URL(window.location.href);
        const userId = url.searchParams.get("user_id");
        const username = url.searchParams.get("username");
        const state = url.searchParams.get("state")

        console.log("state maxxing")

        if (currentState != state) {
            Alert.alert("failed login", `state mismatch`);
        }
        if (userId && username) {
            dispatch(setUserID(userId));
            dispatch(setUsername(username))
            dispatch(authenticate())

            navigation.navigate("GameScreen");

            Alert.alert("Login Successful", `Welcome ${username}!`);
        } else {
            console.log("No user data found");
        }
    };
    useEffect(() => {
        handleAuthCallback();
    }, []);

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
                        onPress={initiateLogin}
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