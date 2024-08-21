import GS from '@styles/globalStyles'
import { PropsWithChildren, ReactNode, useState } from 'react'
import { BlurView } from 'expo-blur'
import { Dimensions, Platform, View, Text } from 'react-native'
import { HeaderProps} from '@/interfaces'
import { useSelector } from 'react-redux'

export default function Header({ options, route }: HeaderProps): ReactNode {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang  } = useSelector((state: ReduxState) => state.lang)
    const SES = route.name === "SpecificEventScreen"
    const SAS = route.name === "SpecificAdScreen"

    const [title, setTitle] = useState<string>(route.name && (lang
        ? require('@text/no.json').screens[route.name]
        : require('@text/en.json').screens[route.name]))

    return (
        <BlurWrapper>
            <View style={{...GS.headerView, top: Dimensions.get("window").height / 17}}>
                <View style={GS.innerHeaderViewOne}>
                </View>
                <Text style={{...GS.headerTitle, color: theme.titleTextColor, 
                            width: SES || SAS ? 300 : 150, textAlign: "center", top: title?.length > 30 ? -8 : undefined}}>
                            {title}
                        </Text>
                    <View style={GS.innerHeaderViewTwo}>
                    {options.headerComponents?.right?.map((node, index) => (
                        <View style={index === 1
                            ? {...GS.customMenuIcon, width: Platform.OS === "ios" ? 28 : 5} 
                            : GS.customMenuIcon} key={index}>{node}
                        </View>
                    ))}
                </View>
            </View>
            {options.headerComponents?.bottom?.map((node, index) => 
                <View key={index}>{node}</View>
            )}
        </BlurWrapper>
    )
}

// Wraps the content in blur
function BlurWrapper(props: PropsWithChildren) {
    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <>
            <BlurView 
                style={{height: 100}} 
                experimentalBlurMethod='dimezisBlurView' 
                intensity={Platform.OS === "ios" ? 30 : 20} 
            />
            <View style={{
                ...GS.blurBackgroundView, 
                backgroundColor: theme.transparentAndroid
            }}>
                {props.children}
            </View>
        </>
    )
}
