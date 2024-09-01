import { View } from "react-native"

type SpaceProps = {
    height: number
}

/**
 * Function for creating an empty view, for adding spaces between objects such 
 * as views paragraphs etc
 *
 * @param {float} height How big the space should be
 * @returns Empty view of the given height
 */
export default function Space({height}: SpaceProps): JSX.Element {
    return <View style={{height: height}}/>
}
