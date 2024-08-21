import { ReactNode } from "react"
import { View } from "react-native"

type SwipeProps = {
    children?: ReactNode
    left?: string
    right?: string
}

export default function Swipe({children}: SwipeProps) {

    return (
        <View>{children}</View>
    )
}
