import Swipe from "@components/nav/swipe"
import { ReactNode } from "react"
import { Dimensions, View } from "react-native"
import { useSelector } from "react-redux"
import GS from "@styles/globalStyles"
import Space from "./utils"

type ParentProps = {
    children?: ReactNode
    left?: string
    right?: string
    paddingHorizontal?: number
}

export default function Parent({children, left, right, paddingHorizontal}: ParentProps) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <Swipe left={left} right={right}>
            <View
                style={{...GS.content, paddingHorizontal: paddingHorizontal || 12, backgroundColor: theme.darker}}
            >
                <View style={{...GS.content, paddingHorizontal: paddingHorizontal || 12}}>
                    <Space height={Dimensions.get("window").height / 8} />
                    {children}
                </View>
            </View>
        </Swipe>
    )
}