import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let clock: THREE.Clock
let mixer: THREE.AnimationMixer

export const initThreeJSScene = (mountRef: HTMLElement) => {
    // Initialize the Three.js scene
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.appendChild(renderer.domElement)

    // Add lighting
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(0, 1, 1).normalize()
    scene.add(light)

    // Clock for animations
    clock = new THREE.Clock()

    // Load FBX Model
    const loader = new FBXLoader()
    // Adjust the scale based on the model size
    loader.load('@assets/models/characters/character_running.fbx', (fbx: THREE.Object3D) => {
        // Adjust the scale based on the model size
        fbx.scale.set(0.01, 0.01, 0.01)
        scene.add(fbx)

        // Setup Animation Mixer for the running animation
        mixer = new THREE.AnimationMixer(fbx)
        const action = mixer.clipAction(fbx.animations[0])
        action.play()

        // Animate the scene
        function animate() {
            requestAnimationFrame(animate)

            const delta = clock.getDelta()
            mixer.update(delta)

            renderer.render(scene, camera)
        }

        animate()
    })
}
