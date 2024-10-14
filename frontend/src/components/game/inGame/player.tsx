// player.tsx (frontend/src/components/game/inGame)

import GS from "@styles/globalStyles";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useState, useEffect, useRef, memo } from 'react';
import { Asset } from 'expo-asset';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Animated, Platform, Text, ViewStyle } from 'react-native';
import * as Device from 'expo-device';
import pixelStore from "./glPixelStorei";

// Remove the import of AnimatedValue from "@/interfaces"
// Use Animated.Value directly from 'react-native'

interface PlayerProps {
  translateX: Animated.Value;
  translateY: Animated.Value;
  name: string;
  score: number;
  modelUri: string;
  originalX: number;
  originalY: number;
}

// Define types for directions if not already defined
type HorizontalDirection = 'left' | 'middle' | 'right';
type VerticalDirection = 'up' | 'normal' | 'down';

export default function Player({
  translateX,
  translateY,
  originalX,
  originalY,
  name,
  score,
  modelUri,
}: PlayerProps) {
  const [directionLock, setDirectionLock] = useState<'horizontal' | 'vertical' | null>(null);
  const [horizontalState, setHorizontalState] = useState<HorizontalDirection>('middle');
  const [verticalState, setVerticalState] = useState<VerticalDirection>('normal');
  const cooldown = useRef(false);

  // State variables to keep track of current positions
  const [currentTranslateX, setCurrentTranslateX] = useState<number>(originalX);
  const [currentTranslateY, setCurrentTranslateY] = useState<number>(originalY);

  // Add listeners to update current positions
  useEffect(() => {
    const translateXListenerId = translateX.addListener(({ value }) => {
      setCurrentTranslateX(value);
    });

    const translateYListenerId = translateY.addListener(({ value }) => {
      setCurrentTranslateY(value);
    });

    return () => {
      translateX.removeListener(translateXListenerId);
      translateY.removeListener(translateYListenerId);
    };
  }, [translateX, translateY]);

  function moveLeft() {
    setHorizontalState((prevState) => {
      if (prevState === 'left') {
        return 'left';
      }

      const newTranslateX = currentTranslateX - 100;

      // Starts the animation
      Animated.timing(translateX, {
        toValue: newTranslateX,
        duration: 200,
        delay: 50,
        useNativeDriver: true,
      }).start();

      return prevState === 'middle' ? 'left' : 'middle';
    });
  }

  function moveRight() {
    setHorizontalState((prevState) => {
      if (prevState === 'right') {
        return 'right';
      }

      const newTranslateX = currentTranslateX + 100;

      // Starts the animation
      Animated.timing(translateX, {
        toValue: newTranslateX,
        duration: 200,
        delay: 50,
        useNativeDriver: true,
      }).start();

      return prevState === 'middle' ? 'right' : 'middle';
    });
  }

  function moveUp() {
    setVerticalState((prevState) => {
      if (prevState === 'up') {
        return 'up';
      }

      const newTranslateY = currentTranslateY - 100;

      // Starts the animation
      Animated.timing(translateY, {
        toValue: newTranslateY,
        duration: 200,
        delay: 50,
        useNativeDriver: true,
      }).start(() => {
        // Return to original position after 400ms
        Animated.timing(translateY, {
          toValue: currentTranslateY,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });

      return 'normal';
    });
  }

  function moveDown() {
    setVerticalState((prevState) => {
      if (prevState === 'down') {
        return 'down';
      }

      const newTranslateY = currentTranslateY + 100;

      // Starts the animation
      Animated.timing(translateY, {
        toValue: newTranslateY,
        duration: 200,
        delay: 50,
        useNativeDriver: true,
      }).start(() => {
        // Return to original position after 400ms
        Animated.timing(translateY, {
          toValue: currentTranslateY,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });

      return 'normal';
    });
  }

  function onGestureEvent(event: any) {
    const { translationX, translationY } = event.nativeEvent;
    const { velocityX, velocityY } = event.nativeEvent;

    // Handle horizontal swipe
    if ((Math.abs(velocityX) < 20 && Math.abs(velocityY) < 20) || cooldown.current) {
      return;
    }

    // Allows the player to move again 800ms after the previous move
    setTimeout(() => {
      cooldown.current = false;
    }, 800);

    if (Math.abs(velocityX) > Math.abs(velocityY)) {
      setDirectionLock('horizontal');
      if (translationX > 50 && directionLock !== 'vertical') {
        moveRight();
      } else if (translationX < -50 && directionLock !== 'vertical') {
        moveLeft();
      }
    } else {
      setDirectionLock('vertical');
      // Handle vertical swipe
      if (translationY > 50 && directionLock !== 'horizontal') {
        cooldown.current = true;
        moveDown();
      } else if (translationY < -50 && directionLock !== 'horizontal') {
        cooldown.current = true;
        moveUp();
      }
    }

    // Resets lock after swipe is handled
    setDirectionLock(null);
  }

  // Move checkBounds inside the Player component
  function checkBounds(
    currentTranslateY: number,
    originalY: number,
    verticalState: VerticalDirection
  ) {
    if (
      (currentTranslateY < originalY - 10 || currentTranslateY > originalY + 10) &&
      verticalState === 'normal'
    ) {
      // Reset position
      Animated.timing(translateY, {
        toValue: originalY,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }

  // Checks if the player is out of bounds once per second.
  useEffect(() => {
    const intervalId = setInterval(() => {
      checkBounds(currentTranslateY, originalY, verticalState);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentTranslateY, originalY, verticalState]);

  return (
    <PanGestureHandler onHandlerStateChange={onGestureEvent}>
      <Animated.View
        style={[
          GS.content,
          {
            width: '100%',
            paddingHorizontal: 5,
            position: 'absolute',
          },
        ]}
      >
        <Character transform={[{ translateX }, { translateY }]} />
      </Animated.View>
    </PanGestureHandler>
  );
}

function Character({ transform }: { transform: any }) {
  const [modelUri, setModelUri] = useState<string | null>(null);

  // Preload the model
  useEffect(() => {
    async function loadModel() {
      try {
        const asset = Asset.fromModule(require("@assets/models/characters/player.glb"));
        await asset.downloadAsync();
        setModelUri(asset.localUri);
        console.log('Player Model URI:', asset.localUri);
      } catch (error) {
        console.error('Error loading player model:', error);
      }
    }

    loadModel();
  }, []);

  const animatedStyle = {
    width: 150,
    height: 300,
    transform,
    right: 55,
  } as Animated.AnimatedProps<ViewStyle>;

  return (
    <Animated.View style={animatedStyle}>
      {modelUri ? (
        <Canvas
          camera={{ position: [0, 5, 5], fov: 75 }}
          onCreated={(state) => {
            // Suppresses unsupported values
            const _gl = state.gl.getContext();
            const pixelStorei = _gl.pixelStorei.bind(_gl);
            _gl.pixelStorei = pixelStore(pixelStorei, _gl);
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
  );
}

const Model = memo(({ modelUri }: { modelUri: string }) => {
  if (Platform.OS === 'ios' && !Device.isDevice) {
    console.error(
      "iOS simulators do not support loading glb files. Character will not be displayed."
    );
    return null;
  }

  console.log("Player model component called with URI:", modelUri);

  const { scene } = useGLTF(modelUri, true);

  useEffect(() => {
    if (scene) {
      console.log("Inside Player model useEffect - Character Loaded");
      const bbox = new THREE.Box3().setFromObject(scene);
      console.log('Player Bounding box:', bbox);
    }
  }, [scene]);

  return scene ? (
    <primitive
      object={scene}
      scale={[4, 4, 4]}
      position={[0, -3.5, 0]}
      rotation={[0, Math.PI, 0]}
    />
  ) : null;
});
