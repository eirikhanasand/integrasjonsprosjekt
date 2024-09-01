import { StyleSheet, Platform } from "react-native"

function adjustForDevice(size: number): number {
    if (Platform.OS !== "ios") {
        return size - 2
    } 
    
    return size
}

/**
 * Text Styles
 */
export const T = StyleSheet.create({
    //  Text of size 20
    text20: {
        fontSize: adjustForDevice(20),
    },
    //  Text of size 22
    text22: {
        fontSize: adjustForDevice(22),
    },
    //  Text of size 30
    text30: {
        fontSize: adjustForDevice(30),
    }
})

export default T
