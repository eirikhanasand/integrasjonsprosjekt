import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { NavigationContainer } from "@react-navigation/native"
import Footer from "@nav/footer"
import AdScreen from "@screens/ads"
import EventScreen from "@screens/event"
import MS from "@styles/menuStyles"
import { Image } from "react-native"
import SettingScreen from "@screens/menu/settings"
import Header from "./header"
import { 
    AdStackParamList, 
    EventStackParamList, 
    MenuStackParamList, 
    RootStackParamList, 
    TabBarParamList 
} from "@type/screenTypes"
import { createStackNavigator } from "@react-navigation/stack"


// Declares Tab to equal CBTN function
const Root = createStackNavigator<RootStackParamList>()
const Tab = createBottomTabNavigator<TabBarParamList>()
const EventStack = createStackNavigator<EventStackParamList>()
const AdStack = createStackNavigator<AdStackParamList>()
const MenuStack = createStackNavigator<MenuStackParamList>()

function Events() {
    return (
        <EventStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>}}>
            <EventStack.Screen name="EventScreen" component={EventScreen}/>
        </EventStack.Navigator>
    )
}

function Ads() {
    return (
        <AdStack.Navigator screenOptions={{
            animationEnabled: false,
            headerTransparent: true,
            header: props => <Header {...props}/>}}>
            <AdStack.Screen name="AdScreen" component={AdScreen}/>
        </AdStack.Navigator>
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
            initialRouteName={"EventNav"}
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
                name="EventNav" 
                component={Events} 
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
                name="AdNav" 
                component={Ads} 
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
