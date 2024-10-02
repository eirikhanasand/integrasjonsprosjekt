import { AnimatedValue } from "@/interfaces"
import { Animated } from "react-native"
import { Canvas } from '@react-three/fiber'
import { Text } from 'react-native'
import pixelStore from "./glPixelStorei"
import GhostModel from "./ghostModel"

type GhostProps = {
    translateX: AnimatedValue
    translateY: AnimatedValue
    name: string
    score: number
    modelUri: string
}

export default function Ghost({translateX, translateY, name, score, modelUri}: GhostProps) {
    console.log(translateX, translateY,name, score, modelUri )
    return (
        <Animated.View style={{
            width: 150, 
            height: 300,
            transform: [{translateX}, {translateY}],
            right: 300,
            opacity: 0.35,
            backgroundColor: 'purple',
            position: 'absolute'
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
                        console.log('Ghost canvas created')
                    }}
                >
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <GhostModel modelUri={modelUri} name={name} />
                </Canvas>
            ) : (
                <Text>Loading Ghost...</Text>
            )}
        </Animated.View>
    )
}

