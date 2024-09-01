import { StyleSheet, Platform } from "react-native"

export const MS = StyleSheet.create ({
    // ----- BOTTOM MENU -----
    // Bottom menu view
    bMenu: {
        position: "absolute",
        top: Platform.OS === "ios" ? "90%" : null,
        bottom: Platform.OS === "ios" ? null : -30,
        width: "100%",
        height: "12.5%",
        flexDirection: "row",
        justifyContent: "space-evenly",
    },
    // Bottom menu icon TouchableOpacity
    bMenuIconTouchableOpacity: {
        width: 90,
        height: 65,
    },
    // Bottom menu icons
    bMenuIcon: {
        width: 80,
        height: 65,
        alignSelf: "center",
    },
})

export default MS
