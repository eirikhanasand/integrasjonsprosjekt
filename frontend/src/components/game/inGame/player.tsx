import { AnimatedValue } from "@/interfaces"
import GS from "@styles/globalStyles"
import { useEffect, useRef, useState } from "react"
import { Animated } from "react-native"
import { PanGestureHandler } from "react-native-gesture-handler"

type PlayerProps = {
    translateX: AnimatedValue
    translateY: AnimatedValue
}

export default function Player({translateX, translateY}: PlayerProps) {
    const [directionLock, setDirectionLock] = useState<'horizontal' | 'vertical' | null>(null)
    const [_h, setHorizontalState] = useState<HorizontalDirection>('middle')
    const [verticalState, setVerticalState] = useState<VerticalDirection>('normal')
    const [_o] = useState<number>(translateX.__getValue())
    const [originalY] = useState<number>(translateY.__getValue())
    const cooldown = useRef(false)

    function moveLeft() {
        setHorizontalState((prevState) => {
            if (prevState === 'left') {
                return 'left'
            }

            // Starts the animation based on previous state
            Animated.timing(translateX, {
                toValue: translateX.__getValue() - 100,
                duration: 200,
                delay: 50,
                useNativeDriver: true,
            }).start()
    
            // Returns the new state
            return prevState === 'middle' ? 'left' : 'middle'
        })
    }

    function moveRight() {
        setHorizontalState((prevState) => {
            if (prevState === 'right') {
                return 'right'
            }

            // Starts the animation based on previous state
            Animated.timing(translateX, {
                toValue: translateX.__getValue() + 100,
                duration: 200,
                delay: 50,
                useNativeDriver: true,
            }).start()
    
            // Returns the new state
            return prevState === 'middle' ? 'right' : 'middle'
        })
    }

    function moveUp() {
        setVerticalState((prevState) => {
            if (prevState === 'up') {
                return 'up'
            }

            // Starts the animation based on previous state
            Animated.timing(translateY, {
                toValue: translateY.__getValue() - 100,
                duration: 200,
                delay: 50,
                useNativeDriver: true,
            }).start()

            setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: translateY.__getValue() + 100,
                    duration: 200,
                    useNativeDriver: true,
                }).start()
            }, 400)


            // Returns the new state
            // return prevState === 'normal' ? 'up' : 'normal'
            return 'normal'
        })
    }

    function moveDown() {
        setVerticalState((prevState) => {
            if (prevState === 'down') {
                return 'down'
            }

            // Starts the animation based on previous state
            Animated.timing(translateY, {
                toValue: translateY.__getValue() + 100,
                duration: 200,
                delay: 50,
                useNativeDriver: true,
            }).start()

            setTimeout(() => {
                Animated.timing(translateY, {
                    toValue: translateY.__getValue() - 100,
                    duration: 200,
                    useNativeDriver: true,
                }).start()
            }, 400)

            // Returns the new state
            // return prevState === 'normal' ? 'up' : 'normal'
            return 'normal'
        })
    }

    function onGestureEvent(event: any) {
        const { translationX, translationY } = event.nativeEvent
        const { velocityX, velocityY } = event.nativeEvent

        // Handle horizontal swipe
        if (Math.abs(velocityX) < 20 && Math.abs(velocityY) < 20 || cooldown.current) {
            return
        }
        
        // Allows the player to move again 800ms after the previous move
        setTimeout(() => {
            cooldown.current = false
        }, 800)

        if (Math.abs(velocityX) > Math.abs(velocityY)) {
                setDirectionLock('horizontal')
            if (translationX > 50 && directionLock !== 'vertical') {
                moveRight()
            } else if (translationX < -50 && directionLock !== 'vertical') {
                moveLeft()
            }
        } else {
            setDirectionLock('vertical')
            // Handle vertical swipe
            if (translationY > 50 && directionLock !== 'horizontal') {
                cooldown.current = true
                moveDown()
            } else if (translationY < -50 && directionLock !== 'horizontal') {
                cooldown.current = true
                moveUp()
            }
        }
    
        // Resets lock after swipe is handled
        setDirectionLock(null)
    }

    // Checks if the player is out of bounds once per second.
    useEffect(() => {
        const intervalId = setInterval(() => {
            checkBounds(translateY, originalY, verticalState)
          }, 1000)

          return () => {
            clearInterval(intervalId)
          }
    }, [])
      
    return (
        <PanGestureHandler onHandlerStateChange={onGestureEvent}>
            <Animated.View 
                style={{
                    ...GS.content,
                    paddingHorizontal: 5,
                }}>
                <Animated.View style={{
                    backgroundColor: 'white', 
                    width: 40, 
                    height: 40,
                    transform: [{translateX}, {translateY}]
                }}/>
            </Animated.View>
        </PanGestureHandler>
    )
}

/**
 * Checks if the player is out of bounds - possible by quickly and excessively swiping up or down very fast.
 * Fixes it by immediately resetting the players position.
 * @param translateY 
 * @param originalY 
 * @param cooldown 
 * @param verticalState 
 */
function checkBounds(translateY: AnimatedValue, originalY: number, verticalState: VerticalDirection) {
    const currentY = translateY.__getValue()
    if ((currentY < originalY - 10 || currentY > originalY + 10) && verticalState === 'normal') {
        Animated.timing(translateY, {
            toValue: originalY,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            // Logs when the player is out of bounds - log disabled as it might log excessively during normal gameplay.
            // console.warn("Player out of bounds - Position reset")
        })
    }
}
