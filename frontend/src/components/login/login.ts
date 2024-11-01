import {authenticate, setAuthState} from "@redux/user"
import { Dispatch } from "react"
import {Linking, Platform} from "react-native"
import { UnknownAction } from "redux"
import {API} from "@/constants";
import uuid from "expo-modules-core/build/uuid/uuid.web";
import {randomUUID} from "node:crypto";

const API_LOGIN_URL = API+"/login"

type HandleLoginProps = {
    dispatch: Dispatch<UnknownAction>
}

// Login with Dicord
export default function handleLogin({ dispatch }: HandleLoginProps) {
    const state = randomUUID().toString()
    dispatch(setAuthState(state))

    redirectToLogin(state)
}

async function redirectToLogin(state: string) {
    try {
        console.log(API_LOGIN_URL)

        const params = new URLSearchParams({
            state: state
        }).toString()

        // Step 1: Get the login URL from your server
        const response = await fetch(API_LOGIN_URL+params.toString(), {
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
