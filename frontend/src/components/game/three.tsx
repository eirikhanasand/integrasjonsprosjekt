import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Asset } from 'expo-asset'
import { Platform } from 'react-native'

export default function Game3D() {
    const sceneRef = useRef<THREE.Scene | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const rendererRef = useRef<Renderer | null>(null)
    const modelLoadedRef = useRef(false)

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

                        if (Platform.OS === 'ios') {
                            console.error("iOS simulators do not support OpenGL, and just crashed.")
                        }

                        sceneRef.current.add(loadedModel)
                        console.log("after")
                        // Logs the bounding box for reference
                        const bbox = new THREE.Box3().setFromObject(loadedModel)
                        console.log('Bounding box:', bbox)

                        // Sets the model as loaded
                        modelLoadedRef.current = true
                    }

                }, undefined, (error) => {
                    console.error('Error loading GLTF model:', error)
                })
            }
        })
    }, [])

    function onContextCreate(gl: any) {
        console.log('called 1')
        const scene = new THREE.Scene()
        console.log('called 2')
        scene.background = new THREE.Color('mediumaquamarine')
        console.log('called 3')
        
        const camera = new THREE.PerspectiveCamera(
            75,
            gl.drawingBufferWidth / gl.drawingBufferHeight,
            0.1,
            1000
        )
        
        console.log('called 4')
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
        
        console.log('called 5')
        const renderer = new Renderer({ gl })
        renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight)
        console.log('called 6')
        
        // Sets the light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);
        console.log('called 7')
        
        const pointLight = new THREE.PointLight(0xffffff, 2, 100);
        pointLight.position.set(50, 50, 50);
        scene.add(pointLight);
        console.log('called 8')
        
        // Saves references
        sceneRef.current = scene
        cameraRef.current = camera
        rendererRef.current = renderer
        
        console.log('called 9')
        // Starts the rendering loop when the model is loaded
        function renderLoop() {
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                if (modelLoadedRef.current) {
                    // Only renders if the model is loaded
                    rendererRef.current.render(sceneRef.current, cameraRef.current)
                    gl.endFrameEXP()
                } else {
                    console.log('not loaded')
                }
                requestAnimationFrame(renderLoop)
            }
        }
        console.log('called 10')
        renderLoop()
        console.log('called 11')
    }

    return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
}
