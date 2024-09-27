import { StyleSheet } from "react-native"
import T from "./text"

export const SS = StyleSheet.create({
    // langSwitch text style in notificationScreen
    logoutSwitch: {
        ...T.text20
    },
    langSwitch: {
        left: 12.5,
        ...T.text20
    },
})

export default SS
