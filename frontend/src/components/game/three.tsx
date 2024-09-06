import { GLView } from 'expo-gl'
import { Renderer } from 'expo-three'
import * as THREE from 'three'

export default function Game3D() {
    function onContextCreate(gl: any) {
        console.log('GL context created')
      
        const renderer = new Renderer({ gl })
        console.log('Renderer created')
      
        // Try rendering a basic background
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xff0000)
        const camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000)
        camera.position.z = 5
        renderer.render(scene, camera)
        gl.endFrameEXP()
      
        console.log('Frame rendered')
    }
  
    return <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
}