import { View, Text, TouchableOpacity } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import SS from "@styles/settingStyles"
import { changeLang } from "@redux/lang"

/**
 * Choosing language of the application
 * @returns View representing a switch which controls the language of the application
 */
export default function Language() {
    const { lang  } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()

    function handleLangChange() {
        dispatch(changeLang())
    }

    return (
        <View>
            <TouchableOpacity onPress={() =>  handleLangChange() }>
                <Text style={{...SS.langSwitch, color: theme.textColor}}>
                    {lang ? "EN" : "NO"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
