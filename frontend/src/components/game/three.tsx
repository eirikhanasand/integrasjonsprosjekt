import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Asset } from 'expo-asset'

export default function Game3D() {
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<Renderer | null>(null)
    const [modelLoaded, setModelLoaded] = useState(false)

    useEffect(() => {
        // Preloads model
        async function loadModel() {
            const asset = Asset.fromModule(require('@assets/models/map/background2.glb'))
            await asset.downloadAsync()
            return asset.localUri
        }

        loadModel().then((modelUri) => {
            if (modelUri) {
                const loader = new GLTFLoader()
                loader.load(modelUri, (gltf) => {
                    const loadedModel = gltf.scene

                    // Adds the model to the scene if the scene exists
                    if (sceneRef.current) {
                        loadedModel.scale.set(1, 1, 1)
                        loadedModel.position.set(0, 0, 0)
                        sceneRef.current.add(loadedModel)

                        // Logs the bounding box for reference
                        const bbox = new THREE.Box3().setFromObject(loadedModel)
                        console.log('Bounding box:', bbox)

                        // Sets the model as loaded
                        setModelLoaded(true)
                    }

                }, undefined, (error) => {
                    console.error('Error loading GLTF model:', error)
                })
            }
        })
    }, [])

    function onContextCreate(gl: any) {
        const scene = new THREE.Scene()
        scene.background = new THREE.Color('mediumaquamarine')

        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        )
        
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);

        const renderer = new Renderer({ gl })
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)

        // Sets the light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 100);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);

        // Saves references
        sceneRef.current = scene
        cameraRef.current = camera
        rendererRef.current = renderer

        // Starts the rendering loop when the model is loaded
        function renderLoop() {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                if (modelLoaded) {
                    // Only renders if the model is loaded
                    rendererRef.current.render(sceneRef.current, cameraRef.current)
                    gl.endFrameEXP()
                }
                requestAnimationFrame(renderLoop)
            }
        }
        renderLoop()
    }

    return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
}
