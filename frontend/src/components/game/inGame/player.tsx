import { AnimatedValue } from "@/interfaces"
import GS from "@styles/globalStyles"
import { PanGestureHandler } from "react-native-gesture-handler"
import { useState, useEffect, useRef, memo } from 'react'
import { Asset } from 'expo-asset'
import { Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Animated, Platform, Text } from 'react-native'
import * as Device from 'expo-device'
import pixelStore from "./glPixelStorei"

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
            <Animated.View style={{ ...GS.content, width: '100%', paddingHorizontal: 5, position: 'absolute' }}>
                <Character transform={[{translateX}, {translateY}]} />
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

function Character({transform}: {transform: any}) {
    const [modelUri, setModelUri] = useState<string | null>(null)

    // Preload the model
    useEffect(() => {
        async function loadModel() {
            try {
                const asset = Asset.fromModule(require("@assets/models/characters/player.glb"))
                await asset.downloadAsync()
                setModelUri(asset.localUri)
                console.log('Player Model URI:', asset.localUri)
            } catch (error) {
                console.error('Error loading player model:', error)
            }
        }

        loadModel()
    }, [])

    return (
        <Animated.View style={{
            width: 150, 
            height: 300,
            transform,
            right: 55,
        }}>

            {modelUri ? (
                <Canvas 
                    // gl={{ physicallyCorrectLights: true }} 
                    camera={{ position: [0, 5, 5], fov: 75 }}  
                    onCreated={(state) => {
                        // Supresses unsupported values
                        const _gl = state.gl.getContext()
                        const pixelStorei = _gl.pixelStorei.bind(_gl)
                        _gl.pixelStorei = pixelStore(pixelStorei, _gl)
                        console.log('Player canvas created');
                    }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Model modelUri={modelUri} />
            </Canvas>
            ) : (
                <Text>Loading Player...</Text>
            )}
        </Animated.View>
    )
}

const Model = memo(({ modelUri }: { modelUri: string }) => {
    if (Platform.OS === 'ios' && !Device.isDevice) {
        console.error("iOS simulators do not support loading glb files. Character will not be displayed.")
        return null
    }

    console.log("Player model component called with URI:", modelUri)

    const { scene } = useGLTF(modelUri, true)

    useEffect(() => {
        if (scene) {
            console.log("Inside Player model useEffect - Character Loaded")
            const bbox = new THREE.Box3().setFromObject(scene)
            // const boxHelper = new THREE.BoxHelper(scene, 0xff0000)
            // scene.add(boxHelper)
            console.log('Player Bounding box:', bbox)
        }
    }, [scene])

    return scene ? <primitive object={scene} scale={[4, 4, 4]} position={[0, -3.5, 0]} rotation={[0, Math.PI, 0]} /> : null;
})
