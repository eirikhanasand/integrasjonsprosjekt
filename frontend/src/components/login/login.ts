import { authenticate } from "@redux/user"
import { Dispatch } from "react"
import { Linking } from "react-native"
import { UnknownAction } from "redux"

const API_LOGIN_URL = ""

type HandleLoginProps = {
    dispatch: Dispatch<UnknownAction>
}

// Login with Dicord
export default function handleLogin({ dispatch }: HandleLoginProps) {
    // Send to Discord login page
    dispatch(authenticate())
    // Should redirect to GameNav not ShopNav here
}

async function redirectToLogin() {
    try {
        // Step 1: Get the login URL from your server
        const response = await fetch(API_LOGIN_URL);
        const { authUrl } = await response.json();
    
        // Step 2: Open the Discord login page in the browser
        if (authUrl) {
            Linking.openURL(authUrl);
        } else {
            console.error('Failed to get Discord auth URL');
        }
    } catch (error) {
        console.error('Login error:', error);
    }
}
