import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Stars, Float } from '@react-three/drei'
import {
  GdgSphere,
  OrbitingIcons,
  TechIslands,
  JourneyTimeline,
  ProjectLab,
  EventArena,
  CommunityNetwork,
  FamilyRing,
  PortalJoin,
  ContactTerminal,
  EarthFooter
} from './three/CampusModels'

// Custom shader for moving space nebula with Google colored aurora sweeps
const NebulaShader = {
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                 mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv * 2.2;
      
      // Wavy aurora offsets
      float auroraWave = sin(uv.x * 2.0 + uTime * 0.4) * 0.3;
      vec2 q = vec2(fbm(uv + uTime * 0.015), fbm(uv + vec2(1.0)));
      vec2 r = vec2(fbm(uv + q + uTime * 0.02 + vec2(1.5, 8.5) + auroraWave),
                    fbm(uv + q + uTime * 0.01 + vec2(6.5, 2.2)));
      float f = fbm(uv + r);

      // Deep space palette + Google colored glowing auroras
      vec3 spaceBlue = vec3(0.01, 0.02, 0.08);
      vec3 googleBlue = vec3(0.05, 0.15, 0.35); // Blue aurora
      vec3 googleRed = vec3(0.3, 0.05, 0.15);  // Red aurora
      vec3 googleGreen = vec3(0.05, 0.25, 0.15); // Green aurora

      vec3 col = mix(spaceBlue, googleBlue, clamp(f*f*3.0, 0.0, 1.0));
      col = mix(col, googleRed, clamp(length(q), 0.0, 1.0));
      col = mix(col, googleGreen, clamp(r.x * r.y, 0.0, 1.0));
      col = col * f * 1.5;

      // Darken edges for vignette effect
      float edgeVignette = length(vUv - 0.5);
      col *= smoothstep(0.9, 0.1, edgeVignette);

      gl_FragColor = vec4(col * 0.45, 1.0);
    }
  `
}

// Procedural floating asteroids component in deep space background
function AsteroidField() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      const elapsed = state.clock.getElapsedTime()
      // Orbit asteroid belt
      groupRef.current.rotation.y = elapsed * 0.005
      
      // Rotate asteroids individually
      groupRef.current.children.forEach((ast, idx) => {
        ast.rotation.y += 0.003 * (idx % 2 === 0 ? 1 : -1)
        ast.rotation.x += 0.002
      })
    }
  })

  // Asteroid data coordinates
  const asteroids = useMemo(() => {
    const list = []
    const count = 12
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
      const distance = 40 + Math.random() * 25
      const x = Math.cos(angle) * distance
      const z = Math.sin(angle) * distance
      const y = (Math.random() - 0.5) * 20
      const size = 0.4 + Math.random() * 1.2
      list.push({ pos: [x, y, z], size })
    }
    return list
  }, [])

  return (
    <group ref={groupRef}>
      {asteroids.map((ast, idx) => (
        <mesh key={idx} position={ast.pos as [number, number, number]}>
          <icosahedronGeometry args={[ast.size, 0]} />
          <meshStandardMaterial 
            color="#2d3748" 
            roughness={0.9} 
            metalness={0.1} 
            flatShading 
          />
        </mesh>
      ))}
    </group>
  )
}

// Glowing Crystals around the central deck
function DeckCrystals() {
  const crystalPositions = useMemo(() => [
    [-3.8, -2.1, -2.2],
    [3.8, -2.1, -2.2],
    [-2.2, -2.1, 3.8],
    [2.2, -2.1, 3.8]
  ], [])

  return (
    <group>
      {crystalPositions.map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <Float speed={2} floatIntensity={0.5}>
            {/* Crystal shard */}
            <mesh rotation={[0.2, 0.4 * idx, 0]}>
              <cylinderGeometry args={[0, 0.25, 0.7, 5]} />
              <meshPhysicalMaterial
                color="#7DF9FF"
                transmission={0.8}
                roughness={0.05}
                thickness={0.5}
                emissive="#7DF9FF"
                emissiveIntensity={0.8}
              />
            </mesh>
            <pointLight color="#7DF9FF" intensity={1.5} distance={2.5} />
          </Float>
        </group>
      ))}
    </group>
  )
}

// Pulsing expansion energy rings on grid floor
function GridEnergyPulses() {
  const pulse1 = useRef<THREE.Mesh>(null)
  const pulse2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (pulse1.current) {
      // Loop expansion scale
      const s = (elapsed * 6.0) % 25.0
      pulse1.current.scale.set(s, s, 1)
      // Fade out on edge
      const mat = pulse1.current.material as THREE.Material
      mat.opacity = THREE.MathUtils.lerp(0.8, 0.0, s / 25.0)
    }
    if (pulse2.current) {
      const s = ((elapsed * 6.0) + 12.5) % 25.0
      pulse2.current.scale.set(s, s, 1)
      const mat = pulse2.current.material as THREE.Material
      mat.opacity = THREE.MathUtils.lerp(0.8, 0.0, s / 25.0)
    }
  })

  return (
    <group position={[0, -9.9, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={pulse1}>
        <ringGeometry args={[0.98, 1.0, 64]} />
        <meshBasicMaterial color="#7DF9FF" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={pulse2}>
        <ringGeometry args={[0.98, 1.0, 64]} />
        <meshBasicMaterial color="#4285F4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export function ThreeScene({ onIslandClick }: { onIslandClick: (domainName: string) => void }) {
  const nebulaRef = useRef<THREE.ShaderMaterial>(null)
  
  const nebulaUniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (nebulaRef.current) {
      nebulaRef.current.uniforms.uTime.value = elapsed
    }
  })

  // Dense cosmic dust field
  const dustCount = 150
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80
      pos[i * 3 + 1] = (Math.random() - 0.5) * 50
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80
    }
    return pos
  }, [])

  const dustRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (dustRef.current) {
      const elapsed = state.clock.getElapsedTime()
      dustRef.current.rotation.y = elapsed * 0.008
      dustRef.current.rotation.x = elapsed * 0.003
    }
  })

  return (
    <group>
      {/* Background Aurora / Nebula plane */}
      <mesh position={[0, 0, -85]}>
        <planeGeometry args={[170, 110]} />
        <shaderMaterial
          ref={nebulaRef}
          vertexShader={NebulaShader.vertexShader}
          fragmentShader={NebulaShader.fragmentShader}
          uniforms={nebulaUniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Deep Space Stars */}
      <Stars radius={160} depth={60} count={1200} factor={4} saturation={0.5} fade speed={1.5} />

      {/* Floating Asteroid Belt */}
      <AsteroidField />

      {/* Concentric Energy pulses expanding outwards on floor */}
      <GridEnergyPulses />

      {/* Glowing dust particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.16}
          color="#7DF9FF"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Reflective Grid helper floors */}
      <gridHelper args={[90, 45, '#4285F4', '#0f172a']} position={[0, -10, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.15} />
      </gridHelper>
      <gridHelper args={[90, 22, '#7DF9FF', '#1e293b']} position={[0, -10.05, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.08} />
      </gridHelper>

      {/* Central Campus Platform Dock */}
      <group position={[0, -2.5, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[5.2, 5.8, 0.4, 32]} />
          <meshStandardMaterial color="#0B1120" metalness={0.9} roughness={0.15} />
        </mesh>
        
        {/* Glow deck rings */}
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.0, 64]} />
          <meshBasicMaterial color="#7DF9FF" side={THREE.DoubleSide} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.5, 4.7, 64]} />
          <meshBasicMaterial color="#4285F4" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Deck crystals */}
      <DeckCrystals />

      {/* R3F structures */}
      <GdgSphere />
      <OrbitingIcons />
      <TechIslands onIslandClick={onIslandClick} />
      <JourneyTimeline />
      <ProjectLab />
      <EventArena />
      <CommunityNetwork />
      <FamilyRing />
      <PortalJoin />
      <ContactTerminal />
      <EarthFooter />
    </group>
  )
}
