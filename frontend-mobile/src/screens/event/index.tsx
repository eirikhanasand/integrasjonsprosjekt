import { StatusBar } from "expo-status-bar"
import GS from "@styles/globalStyles"
import { Animated, Dimensions, PanResponder, Text, View } from "react-native"
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
    const translateX = useRef(new Animated.Value(0)).current
    const translateY = useRef(new Animated.Value(0)).current
    const [directionLock, setDirectionLock] = useState<'horizontal' | 'vertical' | null>(null)
    const [horizontalState, setHorizontalState] = useState<'left' | 'middle' | 'right'>('middle')
    const [verticalState, setVerticalState] = useState<'down' | 'normal' | 'up'>('normal')

    function moveLeft() {
        setHorizontalState((prevState) => {
            const newPosition = prevState === 'right' ? 0 : -100
    
            // Starts the animation based on previous state
            Animated.timing(translateX, {
                toValue: newPosition,
                duration: 1,
                delay: 50,
                useNativeDriver: true,
            }).start()
    
            // Returns the new state
            return 'left'
        })
    }
    
    function moveRight() {
        setHorizontalState((prevState) => {
            const newPosition = prevState === 'left' ? 0 : 100
    
            // Starts the animation based on previous state
            Animated.timing(translateX, {
                toValue: newPosition,
                duration: 1,
                delay: 50,
                useNativeDriver: true,
            }).start()
    
            // Returns the new state
            return 'right'
        })
    }

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                // Creates the threshold for movement necesarry to trigger the panResponder
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

                // Checks for horizontal or vertical movement and locks it
                // in the direction its moving the most
                if (directionLock === 'horizontal') {
                    translateX.setValue(gestureState.dx)
                } else {
                    translateY.setValue(gestureState.dy)
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                // Checks for left or right movement
                if (gestureState.dx > 20) {
                    moveRight()
                } else if (gestureState.dx < -20) {
                    moveLeft()
                }

                // Resets the vertical movement
                Animated.spring(translateY, {
                    toValue: 0,
                    stiffness: 200,
                    damping: 200,
                    mass: 1,
                    useNativeDriver: true,
                }).start()

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
                    }}/>
                </Animated.View>
            </View>
        </Swipe>
    )
}
