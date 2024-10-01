import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Footer from "@nav/footer"
import GameScreen from "@screens/game"
import ShopScreen from "@screens/shop"
import MS from "@styles/menuStyles"
import { Image } from "react-native"
import SettingScreen from "@screens/menu/settings"
import PauseScreen from "@screens/game/pauseScreen"
import Header from "./header"
import { 
    GameStackParamList, 
    ShopStackParamList, 
    MenuStackParamList, 
    RootStackParamList, 
    TabBarParamList
 } from "@/interfaces"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "@screens/login"
import { useSelector } from "react-redux"
import ShopIcon from "@components/shared/shop"
import SettingsIcon from "@components/shared/gear"
import PlayIcon from "@components/shared/play"

// Declares Tab to equal CBTN function
const Root = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabBarParamList>()
const ShopStack = createStackNavigator<ShopStackParamList>()
const GameStack = createStackNavigator<GameStackParamList>()
const MenuStack = createStackNavigator<MenuStackParamList>()

function Shop() {
    return (
        <ShopStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>
        }}>
            <ShopStack.Screen name="ShopScreen" component={ShopScreen}/>
        </ShopStack.Navigator>
    )
}

function Game() {
    return (
        <GameStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>
        }}>
            <GameStack.Screen name="GameScreen" component={GameScreen}/>
            <GameStack.Screen name="PauseScreen" component={PauseScreen}/>
        </GameStack.Navigator>
    )
}

function Menu() {
    return (
        <MenuStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>
        }}>
            <MenuStack.Screen name="SettingScreen" component={SettingScreen} />
        </MenuStack.Navigator>
    )
}

/**
 * Declares the tab navigator, and declares the eventstack, adstack and menustack.
 * 
 * @returns Application with navigation
 */
function Tabs(): JSX.Element {
    const { authenticated } = useSelector((state: ReduxState) => state.user)
    const { inGame } = useSelector((state: ReduxState) => state.game)
    const { theme } = useSelector((state: ReduxState) => state.theme)

    if (!authenticated) {
        return (
            <Tab.Navigator
                // Set initialscreen at to not defaut to top of tab stack
                initialRouteName={"LoginNav"}
                backBehavior="history"
                screenOptions={{headerShown: false}}
                // Hides default tabBar without showing anything
                tabBar={_ => undefined}
            >
                <Tab.Screen name="LoginNav" component={LoginScreen} />
            </Tab.Navigator>
        )
    }

    return (
        <Tab.Navigator
            // Set initialscreen at to not defaut to top of tab stack
            initialRouteName={"GameNav"}
            backBehavior="history"
            screenOptions={{headerShown: false}}
            // Sets the tab bar component
            tabBar={props => inGame ? undefined : <Footer 
                state={props.state} 
                descriptors={props.descriptors} 
                navigation={props.navigation} 
            />}
        >
            <Tab.Screen 
                name="ShopNav" 
                component={Shop} 
                options={({
                    tabBarIcon: ({focused}) => (
                        <ShopIcon 
                            color={focused ? theme.orange : theme.oppositeTextColor} 
                            style={{...MS.bMenuIcon, padding: 15}}    
                        />
                    )
                })}
            />
            <Tab.Screen 
                name="GameNav" 
                component={Game} 
                options={({
                    tabBarIcon: ({focused}) => (
                        <PlayIcon
                            color={focused ? theme.orange : theme.oppositeTextColor} 
                            style={{...MS.bMenuIcon, padding: 8}}
                        />
                    )
                })}
            />
            <Tab.Screen 
                name="MenuNav" 
                component={Menu}
                options={({
                    tabBarIcon: ({focused}) => (
                        <SettingsIcon 
                            color={focused ? theme.orange : theme.oppositeTextColor} 
                            style={{...MS.bMenuIcon, padding: 18}}
                        />
                    )
            })}
            />
        </Tab.Navigator>
    )
}

/**
 * Declares navigator of the app, wraps the navigator in the container, and
 * declares the InfoModal and the tab navigation.
 * 
 * @returns Application with navigation
 */
export default function Navigator(): JSX.Element {
    
    return (
        <NavigationContainer>
            <Root.Navigator screenOptions={{headerShown: false}}>
                <Root.Screen name="Tabs" component={Tabs}/>
            </Root.Navigator>
        </NavigationContainer>
    )
}
