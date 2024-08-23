import { StatusBar } from "expo-status-bar"
import GS from "@styles/globalStyles"
import { Animated, Dimensions, PanResponder, View } from "react-native"
import Swipe from "@components/nav/swipe"
import { useSelector } from "react-redux"
import { useRef, useState } from "react"

/**
 * Parent EventScreen component
 *
 * Handles:
 * - Displaying events
 * - Filtering events
 * - Notification Management
 * - Event notifications, both scheduling and cancelling
 *
 * @param {navigation} Navigation Navigation route
 * @returns EventScreen
 */
export default function EventScreen(): JSX.Element {
    // Redux states
    const { theme } = useSelector((state: ReduxState) => state.theme)
    const height = Dimensions.get('window').height
    const width = Dimensions.get('window').width
    const translateX = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(0)).current
    const [directionLock, setDirectionLock] = useState<'horizontal' | 'vertical' | null>(null)
    const [horizontalState, setHorizontalState] = useState<'left' | 'middle' | 'right'>('middle')
    const [verticalState, setVerticalState] = useState<'up' | 'down' | 'normal'>('normal')

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return (
                    Math.abs(gestureState.dx) > 10 || Math.abs(gestureState.dy) > 10
                )
            },
            onPanResponderMove: (_, gestureState) => {
                if (!directionLock) {
                    if (Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
                        setDirectionLock('horizontal')
                    } else {
                        setDirectionLock('vertical')
                    }
                }

                if (directionLock === 'horizontal') {
                    translateX.setValue(gestureState.dx)
                } else {
                    translateY.setValue(gestureState.dy)
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.moveX < width / 3) {
                    Animated.spring(translateX, {
                        toValue: -100,
                        useNativeDriver: true,
                    }).start();
                } else if (gestureState.moveX > width / 3 && gestureState.moveX < width / 1.5) {       
                    Animated.spring(translateX, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start();
                } else {       
                    Animated.spring(translateX, {
                        toValue: 100,
                        useNativeDriver: true,
                    }).start();
                }

                Animated.spring(translateY, {
                    toValue: 0,
                    tension: 0.5,
                    useNativeDriver: true,
                }).start();

            }
        })
    ).current

    // Displays the EventScreen
    return (
        <Swipe right="AdNav">
            <View>
                <StatusBar style={"dark"} />
                <Animated.View 
                    style={{
                        ...GS.content,
                        paddingHorizontal: 5,
                        backgroundColor: theme.darker
                    }}{...panResponder.panHandlers}
                >
                    <Animated.View style={{
                        backgroundColor: 'white', 
                        width: 40, 
                        height: 40, 
                        top: height * 0.7, 
                        alignSelf: 'center',
                        transform: [{ translateX }, { translateY }],
                    }}>

                    </Animated.View>
                </Animated.View>
            </View>
        </Swipe>
    )
}
