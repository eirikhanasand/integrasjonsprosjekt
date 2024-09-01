import { StyleSheet, Dimensions, Platform } from "react-native"

export const GS = StyleSheet.create({
    // Main view of every screen
    content: {
        height: Dimensions.get("window").height+30,
        paddingHorizontal: 12
    },
    // Horizontal card views on setting notifications
    notificationBack: {
        flexDirection: "row",
        alignItems: "center",
    },
    // Notification card text
    notificationText: {
        fontSize: 20,
    },
    // Notification card text
    notificationTip: {
        fontSize: 15,
    },
    // Left view of settings
    view: {
        alignSelf: "center",
        width: "85%",
    },
    // Right view of settings
    view2: {
        justifyContent: "center",
        marginVertical: 2,
    },
    headerView: {
        position: "absolute",
        zIndex: 1,
        display: 'flex', 
        flexDirection: 'row', 
    },
    // Inner header view
    innerHeaderViewOne: {
        flex: 1, 
        display: 'flex', 
        flexDirection: 'row', 
        alignItems: 'center'
    },
    // Reversed inner header view
    innerHeaderViewTwo: {
        flex: 1, 
        display: 'flex', 
        flexDirection: 'row-reverse', 
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    },
    // Header title
    headerTitle: {
        alignSelf: 'center', 
        fontSize: 20,
    },
    // Background view of blur component
    blurBackgroundView: {
        position: "absolute",
        width: "100%",
        justifyContent: "center",
    },
    // Custom menu icon for the header
    customMenuIcon: {
        right: Platform.OS === "ios" 
            ? Dimensions.get("window").width / 50 
            : Dimensions.get("window").width / 30
    },
})

export default GS
