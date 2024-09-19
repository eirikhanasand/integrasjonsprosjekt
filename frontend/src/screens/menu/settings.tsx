import { Text, View, Dimensions } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import Language from "@/components/settings/language"
import Cluster from "@/components/shared/cluster"
import Space from "@/components/shared/utils"
import GS from "@styles/globalStyles"
import { useSelector } from "react-redux"
import en from "@text/menu/settings/en.json"
import no from "@text/menu/settings/no.json"
import Swipe from "@components/nav/swipe"
import Logout from "@components/settings/logout"

export default function SettingScreen(): JSX.Element {

    const { theme } = useSelector((state: ReduxState) => state.theme)

    return (
        <Swipe left="GameNav">
            <View>
                <View style={{...GS.content, backgroundColor: theme.darker}}>
                    <Content />
                </View>
            </View>
        </Swipe>
    )
}

function Content(): JSX.Element {
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const { lang } = useSelector((state: ReduxState) => state.lang)
    const info = lang ? no.info : en.info

    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <Space height={10} /> 
            <Space height={Dimensions.get("window").height / 8.1} /> 
            <Cluster marginHorizontal={0}>
                <View style={GS.notificationBack}>
                    <View style={GS.view}>
                        <Text style={{
                            ...GS.notificationText, 
                            color: theme.textColor
                        }}>
                            {info[0].title}
                        </Text>
                        <Text style={{
                            ...GS.notificationTip, 
                            color: theme.oppositeTextColor
                        }}>
                            {info[0].description}
                        </Text>
                    </View>
                    <View style={GS.view2}><Logout/></View>
                </View>
            </Cluster>
            <Cluster marginHorizontal={0}>
                <View style={GS.notificationBack}>
                    <View style={GS.view}>
                        <Text style={{
                            ...GS.notificationText, 
                            color: theme.textColor
                        }}>
                            {info[1].title}
                        </Text>
                        <Text style={{
                            ...GS.notificationTip, 
                            color: theme.oppositeTextColor
                        }}>
                            {info[1].description}
                        </Text>
                    </View>
                    <View style={GS.view2}><Language/></View>
                </View>
            </Cluster>

            <Space height={Dimensions.get("window").height / 7 + 10} />
        </ScrollView>
    )
}
