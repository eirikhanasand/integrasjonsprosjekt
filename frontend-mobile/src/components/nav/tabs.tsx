import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Footer from "@nav/footer"
import GameScreen from "@screens/game"
import ShopScreen from "@screens/shop"
import MS from "@styles/menuStyles"
import { Image } from "react-native"
import SettingScreen from "@screens/menu/settings"
import Header from "./header"
import { 
    GameStackParamList, 
    ShopStackParamList, 
    MenuStackParamList, 
    RootStackParamList, 
    TabBarParamList 
} from "@type/screenTypes"
import { createStackNavigator } from "@react-navigation/stack"


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
            header: props => <Header {...props}/>}}>
            <ShopStack.Screen name="ShopScreen" component={ShopScreen}/>
        </ShopStack.Navigator>
    )
}

function Game() {
    return (
        <GameStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>}}>
            <GameStack.Screen name="GameScreen" component={GameScreen}/>
        </GameStack.Navigator>
    )
}

function Menu() {
    return (
        <MenuStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>}}>
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

    return (
        <Tab.Navigator
            // Set initialscreen at to not defaut to top of tab stack
            initialRouteName={"GameNav"}
            backBehavior="history"
            screenOptions={{headerShown: false}}
            // Sets the tab bar component
            tabBar={props => <Footer 
                state={props.state} 
                descriptors={props.descriptors} 
                navigation={props.navigation} 
            />}
        >
            <Tab.Screen 
                name="ShopNav" 
                component={Shop} 
                options={({
                    tabBarIcon: () => (
                        <Image
                            style={MS.bMenuIcon} 
                            source={require("@assets/menu/calendar-orange.png")} 
                        />
                    )
                })}
            />
            <Tab.Screen 
                name="GameNav" 
                component={Game} 
                options={({
                    tabBarIcon: () => (
                        <Image
                            style={MS.bMenuIcon} 
                            source={require("@assets/menu/business-orange.png")}
                        />
                    )
                })}
            />
            <Tab.Screen 
                name="MenuNav" 
                component={Menu}
                options={({
                    tabBarIcon: () => (
                        <Image
                            style={MS.bMenuIcon} 
                            source={require("@assets/menu/calendar-orange.png")}
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
