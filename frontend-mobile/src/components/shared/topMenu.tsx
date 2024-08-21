import { useSelector } from "react-redux"
import MS from "@styles/menuStyles"
import { BlurView } from "expo-blur"
import { Navigation } from "@/interfaces"
import { 
    View, 
    Image, 
    TouchableOpacity, 
    Platform, 
    Text, 
    Dimensions 
} from "react-native"

type TopMenuProps = {
    navigation: Navigation
    title: string
    screen: string
    back?: string
}
/**
 * Top Menu on every page
 * @param {*} props
 * @returns
 */
export default function TopMenu({ title }: TopMenuProps) {

    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <>
            {Platform.OS === "ios"
                ? <BlurView style={MS.topMenu} intensity={30}/>
                : <View style={{
                    ...MS.topMenu,
                    backgroundColor: theme.transparentAndroid}}/>}
            <View style={{...MS.topMenu, backgroundColor: theme.transparent}}>
                <Text
                    style={{
                        ...MS.smallMultilineTitle,
                        top: title.length > 28
                            ? Dimensions.get("window").height / 22
                            : Dimensions.get("window").height / 17,
                        color: theme.titleTextColor
                    }}
                >
                    {title}
                </Text>
            </View>
        </>
    )
}
