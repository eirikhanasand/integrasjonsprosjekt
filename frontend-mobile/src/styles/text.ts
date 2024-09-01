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
    }
})

export default T
