import GS from '@styles/globalStyles'
import { ReactNode, useState } from 'react'
import { Dimensions, Platform, View, Text } from 'react-native'
import { HeaderProps} from '@/interfaces'
import { useSelector } from 'react-redux'
import React from 'react'

export default function Header({ options, route }: HeaderProps): ReactNode {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang  } = useSelector((state: ReduxState) => state.lang)
    const GameScreen = route.name === "GameScreen"
    const [title, setTitle] = useState<string>(route.name && (lang
        ? require('@text/no.json').screens[route.name]
        : require('@text/en.json').screens[route.name]))

    if (GameScreen) {
        return
    }

    return (
            <View style={{
                height: 100,
                ...GS.blurBackgroundView, 
                backgroundColor: theme.transparentAndroid
            }}>
            <View style={{...GS.headerView, top: Dimensions.get("window").height / 17}}>
                <View style={GS.innerHeaderViewOne}>
                </View>
                <Text style={{...GS.headerTitle, color: theme.titleTextColor, 
                            width: 300, textAlign: "center", top: title?.length > 30 ? -8 : undefined}}>
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
        </View>
    )
}
