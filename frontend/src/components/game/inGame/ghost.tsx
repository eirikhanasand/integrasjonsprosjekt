import { Animated, View, Text, ViewStyle } from 'react-native';
import { Canvas } from '@react-three/fiber';
import pixelStore from './glPixelStorei';
import { memo, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useSelector } from 'react-redux';

type GhostProps = {
  translateX: Animated.Value;
  translateY: Animated.Value;
  name: string;
  score: number;
  modelUri: string;
};

export default function Ghost({ translateX, translateY, name, score, modelUri }: GhostProps) {
  const { theme } = useSelector((state: ReduxState) => state.theme);
  const { score: playerScore } = useSelector((state: ReduxState) => state.game);

  const animatedStyle = {
    width: 150,
    height: 300,
    transform: [{ translateX }, { translateY }],
    right: 300,
    position: 'absolute',
  } as Animated.AnimatedProps<ViewStyle>;

  return (
    <Animated.View style={animatedStyle}>
      {modelUri ? (
        <>
          <Canvas
            camera={{ position: [0, 5, 5], fov: 75 }}
            style={{ opacity: 0.35 }}
            onCreated={(state) => {
              const _gl = state.gl.getContext();
              const pixelStorei = _gl.pixelStorei.bind(_gl);
              _gl.pixelStorei = pixelStore(pixelStorei, _gl);
              console.log('Ghost canvas created');
            }}
          >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <GhostModel modelUri={modelUri} name={name} />
          </Canvas>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#22222233',
              height: 30,
              position: 'absolute',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 5,
              borderRadius: 10,
              right: -30,
            }}
          >
            <Text
              style={{
                color: theme.textColor,
                fontWeight: 'bold',
                height: 20,
                fontSize: 15,
                marginRight: 10,
              }}
            >
              {name}
            </Text>
            <Text
              style={{
                color: playerScore > score ? 'green' : 'red',
                fontWeight: 'bold',
                height: 20,
                fontSize: 15,
              }}
            >
              {score}
            </Text>
          </View>
        </>
      ) : (
        <Text>Loading Ghost...</Text>
      )}
    </Animated.View>
  );
}

type GhostModelProps = {
    modelUri: string
    name: string
}

const GhostModel = memo(({ modelUri, name }: GhostModelProps) => {

    if (Platform.OS === 'ios' && !Device.isDevice) {
        console.error("iOS simulators do not support loading glb files. Character will not be displayed.")
        return null
    }

    console.log("Ghost model component called with URI:", modelUri)

    const { scene } = useGLTF(modelUri, true)

    useEffect(() => {
        if (scene) {
            console.log(`Inside Ghost model useEffect - Ghost Loaded for ${name}`)
            const clonedScene = scene.clone(true)
            const bbox = new THREE.Box3().setFromObject(clonedScene)
            const boxHelper = new THREE.BoxHelper(clonedScene, 0xff0000)
            clonedScene.add(boxHelper)
            console.log('Ghost Bounding box:', bbox)
        }
    }, [scene])

    console.log(scene ? `Scene found and ghost loaded for ${name}` : `Scene not found for ${name}, unable to load ghost.`)
    return scene ? <primitive object={scene.clone()} scale={[1.7, 2.7, 1.7]} position={[0, -3.5, 0]} /> : null
})
