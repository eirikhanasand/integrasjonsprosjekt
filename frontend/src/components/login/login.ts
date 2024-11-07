import { authenticate, setAuthState } from "@redux/user"
import { Dispatch } from "react"
import { Linking, Platform } from "react-native"
import { UnknownAction } from "redux"
import { API } from "@/constants"
import { v4 as uuidv4 } from 'uuid'

type HandleLoginProps = {
    dispatch: Dispatch<UnknownAction>
}

// Login with Dicord
export default function handleLogin({ dispatch }: HandleLoginProps) {
    const state = uuidv4();
    dispatch(setAuthState(state))
    redirectToLogin(state)
}

async function redirectToLogin(state: string) {
    try {
        const params = new URLSearchParams({
            state: state
        }).toString()

        // Step 1: Get the login URL from your server
        const response = await fetch(`${API}/login?${params}`, {
            method: "GET",
        })

        const authUrl = await response.json();
        
        if (authUrl) {
            console.log("attempting to open url")

            if (Platform.OS === 'web') {
                window.location.href = authUrl;
            } else {
                await Linking.openURL(authUrl);
            }
        } else {
            console.error('Failed to get Discord auth URL');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}
