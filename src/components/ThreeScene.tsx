import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Stars } from '@react-three/drei'
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

// Custom shader for moving space nebula
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

    // Fractional Brownian Motion (fBm) noise
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
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
      for (int i = 0; i < 4; ++i) {
        v += a * noise(p);
        p = rot * p * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = vUv * 2.5;
      vec2 q = vec2(fbm(uv + uTime * 0.02), fbm(uv + vec2(1.0)));
      
      // Compute color patterns
      vec2 r = vec2(fbm(uv + q + uTime * 0.03 + vec2(1.7, 9.2)),
                    fbm(uv + q + uTime * 0.01 + vec2(8.3, 2.8)));
      float f = fbm(uv + r);

      // Deep space colors (blue, cyan, purple mix)
      vec3 colorA = vec3(0.02, 0.04, 0.15); // Deep blue
      vec3 colorB = vec3(0.03, 0.11, 0.18); // Cyan-ish
      vec3 colorC = vec3(0.12, 0.02, 0.16); // Purple-ish
      
      vec3 col = mix(colorA, colorB, clamp(f*f*4.0, 0.0, 1.0));
      col = mix(col, colorC, clamp(length(q), 0.0, 1.0));
      col = col * f * 1.6;

      // Soft vignette
      float dist = length(vUv - 0.5);
      col *= smoothstep(0.8, 0.2, dist);

      gl_FragColor = vec4(col * 0.35, 1.0); // Kept dark as background
    }
  `
}

export function ThreeScene({ onIslandClick }: { onIslandClick: (domainName: string) => void }) {
  const nebulaRef = useRef<THREE.ShaderMaterial>(null)
  
  // Create static nebula mesh behind everything
  const nebulaUniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), [])

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (nebulaRef.current) {
      nebulaRef.current.uniforms.uTime.value = elapsed
    }
  })

  // Slow-moving dust particles
  const dustParticlesCount = 150
  const dustPositions = useMemo(() => {
    const pos = new Float32Array(dustParticlesCount * 3)
    for (let i = 0; i < dustParticlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40
      pos[i * 3 + 2] = (Math.random() - 0.5) * 65
    }
    return pos
  }, [])

  const dustRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (dustRef.current) {
      // Very slow hover drift
      const elapsed = state.clock.getElapsedTime()
      dustRef.current.rotation.y = elapsed * 0.01
      dustRef.current.rotation.x = elapsed * 0.005
    }
  })

  return (
    <group>
      {/* Background Nebula Plane (locked to screen) */}
      <mesh position={[0, 0, -85]}>
        <planeGeometry args={[160, 100]} />
        <shaderMaterial
          ref={nebulaRef}
          vertexShader={NebulaShader.vertexShader}
          fragmentShader={NebulaShader.fragmentShader}
          uniforms={nebulaUniforms}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      {/* Background Stars */}
      <Stars radius={150} depth={50} count={3500} factor={4} saturation={0.5} fade speed={1.5} />

      {/* Floating Dust Particles */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#7DF9FF"
          transparent
          opacity={0.45}
          sizeAttenuation
        />
      </points>

      {/* Giant grid floor (reflective layout) */}
      <gridHelper args={[80, 40, '#4285F4', '#0f172a']} position={[0, -10, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.12} />
      </gridHelper>
      <gridHelper args={[80, 20, '#7DF9FF', '#1e293b']} position={[0, -10.05, 0]}>
        <lineBasicMaterial attach="material" transparent opacity={0.06} />
      </gridHelper>

      {/* Central Campus Platform */}
      <group position={[0, -2.5, 0]}>
        {/* Glow core plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[5.2, 5.8, 0.4, 32]} />
          <meshStandardMaterial
            color="#0B1120"
            roughness={0.4}
            metalness={0.8}
          />
        </mesh>
        
        {/* Colorful platform circles */}
        <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.8, 5.0, 64]} />
          <meshBasicMaterial color="#7DF9FF" side={THREE.DoubleSide} transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.5, 4.7, 64]} />
          <meshBasicMaterial color="#4285F4" side={THREE.DoubleSide} transparent opacity={0.6} />
        </mesh>
      </group>

      {/* 3D components */}
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
