import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { Asset } from 'expo-asset'

export default function Game3D() {
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<Renderer | null>(null)
    const [model, setModel] = useState<THREE.Object3D | null>(null)

    useEffect(() => {
        // Preload the model
        async function loadModel() {
            const asset = Asset.fromModule(require('@assets/models/map/test.fbx'))
            await asset.downloadAsync()
            return asset.localUri
        }

        loadModel().then((modelUri) => {
            if (modelUri) {
                const loader = new FBXLoader()
                loader.load(modelUri, (loadedModel) => {
                    setModel(loadedModel)
                    console.log('Model loaded:', loadedModel)
                }, undefined, (error) => {
                    console.error('Error loading model:', error)
                })
            }
        })
    }, [])

    useEffect(() => {
        if (!model || !sceneRef.current || !cameraRef.current || !rendererRef.current) return

        const scene = sceneRef.current
        const camera = cameraRef.current
        const renderer = rendererRef.current
        camera.position.set(0, 50, 150);
        camera.lookAt(new THREE.Vector3(0, 0, 0)); 
        model.scale.set(1, 1, 1) // Adjusted scale for better visibility
        model.position.set(0, 0, 0)
        scene.add(model)

        const ambientLight = new THREE.AmbientLight(0xffffff) // Soft white light
        scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 1, 100)
        pointLight.position.set(50, 50, 50)
        scene.add(pointLight)

        // Log bounding box
        const bbox = new THREE.Box3().setFromObject(model)
        console.log('Bounding box:', bbox)
    }, [model])

    function onContextCreate(gl: any) {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x66cdaa);
    
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        );
        // Adjust camera to better fit the model
        camera.position.set(0, 100, 300);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
    
        const renderer = new Renderer({ gl });
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    
        // Starts the rendering loop
        function renderLoop() {
            requestAnimationFrame(renderLoop);
            if (sceneRef.current && cameraRef.current && rendererRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
                gl.endFrameEXP();
            }
        }
        renderLoop();
    
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;
    }
  
    return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
}
