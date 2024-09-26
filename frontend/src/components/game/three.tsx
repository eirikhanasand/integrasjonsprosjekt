import { useState, useEffect } from 'react';
import { Asset } from 'expo-asset';
import { GLView } from 'expo-gl';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Renderer } from 'expo-three';

export default function Game3D() {
    const [modelUri, setModelUri] = useState<string | null>(null);
    const [glContext, setGlContext] = useState<any>(null);

    // Preload the model
    useEffect(() => {
        async function loadModel() {
            try {
                const asset = Asset.fromModule(require('@assets/models/map/test5.glb'));
                await asset.downloadAsync(); 
                setModelUri(asset.localUri);  
                console.log('Model URI:', asset.localUri); 
            } catch (error) {
                console.error('Error loading model:', error); 
            }
        }

        loadModel(); 
    }, []);

    function onContextCreate(gl: any) {
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
        setGlContext(gl);
        console.log('WebGL context created'); 

        gl.endFrameEXP();
    }

    useEffect(() => {
        if (glContext && modelUri) {
            console.log('Starting rendering with glContext and modelUri');
        } else {
            console.log("glContext or modelUri is not set yet.");
        }
    }, [glContext, modelUri]);

    function log(number:number) {console.log(number)}
    return (
        <GLView
            style={{ flex: 1 }}
            onContextCreate={onContextCreate} 
        >
            {glContext ? (
                modelUri ? (
                    <Canvas
                    gl={glContext}
                    camera={{ position: [0, 5, 10], fov: 75 }}
                    onCreated={(state) => {
                        console.log('Canvas created');
                        
                        const handleRender = state.gl.render.bind(state.gl);
                        state.gl.render = (...args) => {
                            handleRender(...args);
                            glContext.endFrameEXP(); 
                        };
                    }}
                    >
                        {log(3) as any}
                        {/* {console.log("inside cabv", Model)} */}
                        <ambientLight intensity={0.5} />
                        {/* {console.log("inside cabv 1")} */}
                        <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />
                        {/* {console.log("inside cabv 2")} */}
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        {/* {console.log("inside cabv 3")} */}
                        <spotLight position={[-5, 10, -5]} angle={0.2} penumbra={1} intensity={1} castShadow />

                        {console.log("inside cabv 4", modelUri)}
                        <Model modelUri={modelUri} />
                        {console.log("inside cabv 5", modelUri)}
                    </Canvas>
                ) : (
                    <p>Loading Model...</p> 
                )
            ) : (
                <p>Loading WebGL Context...</p> 
            )}
        </GLView>
    );
}

function Model({ modelUri }: { modelUri: string }) {
    console.log("model called before uri")
    console.log("Model component called with URI:", modelUri);

    const { scene } = useGLTF(modelUri, true); 

    useEffect(() => {
        if (scene) {
            console.log("Inside Model useEffect - Scene Loaded"); 
            const bbox = new THREE.Box3().setFromObject(scene); 
            console.log('Bounding box:', bbox); 
        } else {
            console.log("Scene is not loaded yet.");
        }
    }, [scene]);

    if (!scene) {
        return null;
    }

    return <primitive object={scene} scale={[1, 1, 1]} position={[0, 0, 0]} />;
}