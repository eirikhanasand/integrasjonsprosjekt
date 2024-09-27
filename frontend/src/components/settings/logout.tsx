import { View, Text, TouchableOpacity } from "react-native"
import { useSelector, useDispatch } from "react-redux"
import SS from "@styles/settingStyles"
import { logout } from "@redux/user"

/**
 * Logs out the user from the application
 * @returns View representing a switch which allows the user to log out
 */
export default function Logout() {
    const { lang  } = useSelector((state: ReduxState) => state.lang)
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const dispatch = useDispatch()

    function handleLogout() {
        dispatch(logout())
    }

    return (
        <View>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={{
                    ...SS.logoutSwitch, 
                    color: 'red',
                    left: lang ? -25 : -20,
                }}>
                    {lang ? "Logg ut" : "Logout"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}
