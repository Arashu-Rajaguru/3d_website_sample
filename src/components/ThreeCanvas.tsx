import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { ThreeScene } from './ThreeScene'

// Coordinates config for camera flight paths.
// [posX, posY, posZ, lookX, lookY, lookZ]
export const CAMERA_COORDINATES: Record<string, [number, number, number, number, number, number]> = {
  overview: [0, 8, 48, 0, -2, 0],       // Futuristic dashboard overview (cinematic camera angle)
  home: [0, 1.8, 11, 0, 0.8, 0],        // Focused on central GDG sphere
  about: [0, 4, 15, 0, 2, 0],           // Focused on central platform + structures
  journey: [4, 2, 5, 2, -1, -4],        // Fly along the winding trail
  events: [-15, -2.5, 10, -15, -6, 5],  // Hover over the Event Arena
  domains: [0, 6, 25, 0, -1, 5],        // Hover above the Domain Islands
  projects: [0, 0.2, 26, 0, -2, 20],    // Zoom in on the transparent projects cube
  community: [15, -1.5, 25, 15, -4, 20], // Focused on structure node network
  family: [22, -5.5, -9, 22, -8, -15],  // Hover beside circular profile ring
  join: [0, 4, -28, 0, 4, -40],         // High-speed fly-in towards portal
  contact: [-20, 7.5, 1.2, -20, 5, -5],  // Focused on contact terminal base
}

interface CameraControllerProps {
  activeSection: string
}

function CameraController({ activeSection }: CameraControllerProps) {
  const { camera } = useThree()
  
  // Keep track of target lookAt position
  const targetLookAt = useRef(new THREE.Vector3(0, -2, 0))

  useEffect(() => {
    // When section changes, compute mouse offset or other presets
    const coords = CAMERA_COORDINATES[activeSection] || CAMERA_COORDINATES.overview
    targetLookAt.current.set(coords[3], coords[4], coords[5])
  }, [activeSection])

  useFrame((state) => {
    const coords = CAMERA_COORDINATES[activeSection] || CAMERA_COORDINATES.overview
    const [px, py, pz] = coords
    
    // Add micro mouse reaction to camera target positions
    const mouseX = state.pointer.x * 1.5
    const mouseY = state.pointer.y * 1.2

    // Target position with subtle mouse sway
    const targetPos = new THREE.Vector3(px + mouseX, py + mouseY, pz)
    
    // Smoothly lerp position (slower for cinematic feel)
    camera.position.lerp(targetPos, 0.04)

    // Smoothly lerp look-at point
    const currentLookAt = new THREE.Vector3(0, 0, -1)
    currentLookAt.applyQuaternion(camera.quaternion).add(camera.position)
    
    // Lerp a helper vector towards target lookAt
    const lerpedLookAt = new THREE.Vector3().lerpVectors(currentLookAt, targetLookAt.current, 0.04)
    camera.lookAt(lerpedLookAt)
  })

  return null
}

interface ThreeCanvasProps {
  activeSection: string
  onIslandClick: (domainName: string) => void
}

export function ThreeCanvas({ activeSection, onIslandClick }: ThreeCanvasProps) {
  return (
    <div className="w-full h-full fixed top-0 left-0 -z-10 bg-brand-bg select-none">
      <Canvas
        shadows
        camera={{ position: [0, 8, 48], fov: 45, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <color attach="background" args={['#050816']} />
        
        {/* Soft fog for space depth */}
        <fog attach="fog" args={['#050816', 30, 95]} />

        {/* Global Lights */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} castShadow />
        
        {/* Cinematic Spotlight for Central glow */}
        <spotLight
          position={[0, 15, 0]}
          angle={0.6}
          penumbra={0.8}
          intensity={2.5}
          color="#7DF9FF"
          castShadow
        />

        <Suspense fallback={null}>
          <ThreeScene onIslandClick={onIslandClick} />
          
          {/* Post Processing Effects */}
          <EffectComposer>
            <Bloom 
              intensity={1.2} 
              luminanceThreshold={0.2} 
              luminanceSmoothing={0.9} 
              height={120} 
            />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>

        <CameraController activeSection={activeSection} />
      </Canvas>
    </div>
  )
}
