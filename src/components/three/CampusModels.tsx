import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, Line, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom shaders for futuristic visual effects
const GdgSphereShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBlue: { value: new THREE.Color('#4285F4') },
    uColorGreen: { value: new THREE.Color('#34A853') },
    uColorYellow: { value: new THREE.Color('#FBBC05') },
    uColorRed: { value: new THREE.Color('#EA4335') },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColorBlue;
    uniform vec3 uColorGreen;
    uniform vec3 uColorYellow;
    uniform vec3 uColorRed;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Simple 3D Noise function
    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }
    float noise(vec3 x) {
      vec3 i = floor(x);
      vec3 f = fract(x);
      f = f*f*(3.0-2.0*f);
      return mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                     mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                     mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
    }

    void main() {
      // Shifting waves based on position and noise
      float n = noise(vPosition * 2.0 + uTime * 0.8);
      float blend1 = sin(vPosition.x * 2.0 + uTime) * 0.5 + 0.5;
      float blend2 = cos(vPosition.y * 2.0 + uTime * 0.7) * 0.5 + 0.5;
      
      vec3 finalColor = mix(uColorBlue, uColorGreen, blend1);
      finalColor = mix(finalColor, uColorYellow, blend2);
      finalColor = mix(finalColor, uColorRed, n);

      // Fresnel glow effect
      float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 3.0);
      vec3 glow = vec3(0.5, 0.8, 1.0) * intensity;
      
      gl_FragColor = vec4(finalColor + glow * 1.5, 0.85);
    }
  `
}

// 1. Central GDG Sphere
export function GdgSphere() {
  const meshRef = useRef<THREE.Mesh>(null)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.15
      meshRef.current.rotation.x = elapsed * 0.05
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed
    }
  })

  return (
    <group>
      {/* Outer wireframe sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[2.5, 32, 32]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={GdgSphereShader.vertexShader}
          fragmentShader={GdgSphereShader.fragmentShader}
          uniforms={GdgSphereShader.uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner crystal core */}
      <mesh>
        <sphereGeometry args={[2.0, 16, 16]} />
        <meshPhysicalMaterial
          color="#00e5ff"
          roughness={0.1}
          metalness={0.1}
          transmission={0.8}
          thickness={1.5}
          ior={1.5}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Orbital glowing ring */}
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.2, 0.04, 8, 64]} />
        <meshBasicMaterial color="#7DF9FF" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

// 2. Floating Technology Icons Orbiting Central Hub
export function OrbitingIcons() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2
    }
  })

  // 3D icon representations
  const iconsData = useMemo(() => [
    { name: 'Web', color: '#4285F4', geometry: new THREE.TorusGeometry(0.3, 0.08, 12, 24) },
    { name: 'AI', color: '#ea4335', geometry: new THREE.IcosahedronGeometry(0.4, 1) },
    { name: 'Cloud', color: '#FBBC05', geometry: new THREE.BoxGeometry(0.5, 0.3, 0.5) },
    { name: 'Android', color: '#34A853', geometry: new THREE.CylinderGeometry(0.25, 0.25, 0.6, 16) },
    { name: 'Cyber', color: '#7DF9FF', geometry: new THREE.ConeGeometry(0.3, 0.6, 4) },
  ], [])

  return (
    <group ref={groupRef}>
      {iconsData.map((icon, idx) => {
        const angle = (idx / iconsData.length) * Math.PI * 2
        const radius = 5.2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle * 3) * 0.5 // Wave movement

        return (
          <group key={icon.name} position={[x, y, z]}>
            <Float floatIntensity={1.5} speed={2}>
              <mesh geometry={icon.geometry}>
                <meshPhysicalMaterial
                  color={icon.color}
                  roughness={0.2}
                  metalness={0.8}
                  emissive={icon.color}
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Outer wireframe */}
              <mesh geometry={icon.geometry} scale={1.15}>
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.15} />
              </mesh>
            </Float>
          </group>
        )
      })}
    </group>
  )
}

// 3. Floating Islands for Tech Domains
export function TechIslands({ onIslandClick }: { onIslandClick: (domainName: string) => void }) {
  const domains = useMemo(() => [
    { name: 'Web', color: '#4285F4', pos: [-15, 2, -15] },
    { name: 'AI', color: '#EA4335', pos: [15, 4, -20] },
    { name: 'Cloud', color: '#FBBC05', pos: [-20, 0, 15] },
    { name: 'Android', color: '#34A853', pos: [20, -2, 10] },
    { name: 'Cybersecurity', color: '#7DF9FF', pos: [0, -5, -25] },
    { name: 'UI/UX', color: '#A855F7', pos: [-25, -4, -10] },
    { name: 'Backend', color: '#10B981', pos: [25, 3, -5] },
  ], [])

  return (
    <group>
      {domains.map((dom) => (
        <group key={dom.name} position={dom.pos as [number, number, number]}>
          <Float speed={1.5} floatIntensity={1.0}>
            {/* Island Base */}
            <mesh 
              onClick={(e) => {
                e.stopPropagation()
                onIslandClick(dom.name)
              }}
              onPointerOver={() => { document.body.style.cursor = 'pointer' }}
              onPointerOut={() => { document.body.style.cursor = 'auto' }}
            >
              <cylinderGeometry args={[2.5, 3.2, 0.8, 8]} />
              <meshStandardMaterial
                color="#0B1120"
                roughness={0.8}
                metalness={0.2}
                flatShading
              />
            </mesh>

            {/* Glowing Ring Platform */}
            <mesh position={[0, 0.45, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.2, 2.4, 32]} />
              <meshBasicMaterial color={dom.color} side={THREE.DoubleSide} transparent opacity={0.8} />
            </mesh>

            {/* Visualizer Icon on Island */}
            <mesh position={[0, 1.0, 0]}>
              <boxGeometry args={[0.8, 0.8, 0.8]} />
              <meshPhysicalMaterial
                color={dom.color}
                roughness={0.1}
                metalness={0.9}
                transmission={0.4}
                thickness={1.0}
                emissive={dom.color}
                emissiveIntensity={0.4}
              />
            </mesh>

            {/* Holographic Label */}
            <Html position={[0, -0.8, 0]} center distanceFactor={12}>
              <div className="px-3 py-1 font-display text-xs font-semibold uppercase tracking-wider rounded border glass-panel glow-cyan text-white whitespace-nowrap cursor-pointer select-none">
                {dom.name}
              </div>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  )
}

// 4. Journey Timeline Winding Pathway
export function JourneyTimeline() {
  const points = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 20; i++) {
      const t = i / 20
      const x = -10 + t * 25
      const z = -5 - Math.sin(t * Math.PI * 2) * 8
      const y = -2 + Math.sin(t * Math.PI) * 3
      arr.push(new THREE.Vector3(x, y, z))
    }
    return arr
  }, [])

  const linePoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points)
    return curve.getPoints(100).map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [points])

  // Milestone points along curve
  const milestones = [
    { label: '2025: Start', pos: points[0], desc: 'September 2025 Foundation' },
    { label: 'Events & Growth', pos: points[7], desc: 'Cloud Study Jams & Workshops' },
    { label: 'Building Impact', pos: points[13], desc: 'First Major College Software projects' },
    { label: 'The Future', pos: points[20], desc: 'Open Source & Scalable Hackathons' }
  ]

  return (
    <group>
      {/* Light path trail */}
      <Line
        points={linePoints}
        color="#7DF9FF"
        lineWidth={2.5}
        transparent
        opacity={0.7}
      />
      {/* Secondary wireframe pipe */}
      <Line
        points={linePoints}
        color="#4285F4"
        lineWidth={1}
        dashed
        dashScale={2}
        transparent
        opacity={0.4}
      />

      {milestones.map((m, idx) => (
        <group key={idx} position={[m.pos.x, m.pos.y, m.pos.z]}>
          <mesh>
            <sphereGeometry args={[0.4, 16, 16]} />
            <meshBasicMaterial color="#FBBC05" />
          </mesh>
          <mesh scale={1.8}>
            <sphereGeometry args={[0.4, 8, 8]} />
            <meshBasicMaterial color="#FBBC05" wireframe transparent opacity={0.3} />
          </mesh>
          <Html position={[0, 0.8, 0]} center distanceFactor={15}>
            <div className="p-2 glass-panel rounded-lg border border-brand-border text-center w-40">
              <h4 className="text-xxs font-bold text-google-yellow font-display uppercase">{m.label}</h4>
              <p className="text-xxs font-sans text-brand-muted mt-0.5 leading-tight">{m.desc}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

// 5. Project Laboratory with 3D Hologram Bus & Map
export function ProjectLab() {
  const outerCubeRef = useRef<THREE.Mesh>(null)
  const hologramRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (outerCubeRef.current) {
      outerCubeRef.current.rotation.y = elapsed * 0.1
    }
    if (hologramRef.current) {
      hologramRef.current.rotation.y = -elapsed * 0.3
      hologramRef.current.position.y = Math.sin(elapsed * 2) * 0.15
    }
  })

  return (
    <group position={[0, -2, 20]}>
      {/* Laboratory glass cage */}
      <mesh ref={outerCubeRef}>
        <boxGeometry args={[4.5, 4.5, 4.5]} />
        <meshPhysicalMaterial
          color="#4285F4"
          roughness={0.05}
          metalness={0.1}
          transmission={0.9}
          thickness={0.5}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Grid structure wireframe floor */}
      <gridHelper args={[4, 10, '#7DF9FF', '#111827']} position={[0, -2.2, 0]} />

      {/* Rotating hologram bus inside */}
      <group ref={hologramRef}>
        {/* Hologram Bus body */}
        <mesh position={[0, 0.4, 0]}>
          <boxGeometry args={[1.6, 0.7, 0.8]} />
          <meshBasicMaterial color="#7DF9FF" wireframe transparent opacity={0.6} />
        </mesh>
        {/* Wheels */}
        {[-0.5, 0.5].map((z) => (
          [-0.6, 0.6].map((x) => (
            <mesh key={`${x}-${z}`} position={[x, 0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.18, 0.15, 8]} />
              <meshBasicMaterial color="#34A853" wireframe transparent opacity={0.5} />
            </mesh>
          ))
        ))}
        {/* Light Beam projector */}
        <mesh position={[0, -1.1, 0]}>
          <cylinderGeometry args={[0.05, 1.2, 2.2, 16, 1, true]} />
          <meshBasicMaterial 
            color="#4285F4" 
            transparent 
            opacity={0.15} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <Html position={[0, 2.8, 0]} center distanceFactor={12}>
        <div className="px-3 py-1 font-display text-xxs tracking-widest text-google-blue font-bold uppercase border border-google-blue/30 rounded bg-brand-bg/80 backdrop-blur-sm whitespace-nowrap">
          SYSTEM_06: PROJECTS_LAB
        </div>
      </Html>
    </group>
  )
}

// 6. Event Arena
export function EventArena() {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (ring1.current) ring1.current.rotation.z = elapsed * 0.4
    if (ring2.current) ring2.current.rotation.z = -elapsed * 0.2
  })

  return (
    <group position={[-15, -6, 5]}>
      {/* Arena Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.5, 3.8, 0.5, 32]} />
        <meshStandardMaterial color="#0B1120" roughness={0.6} />
      </mesh>

      {/* Glowing concentric rings */}
      <mesh ref={ring1} position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.0, 3.2, 32]} />
        <meshBasicMaterial color="#34A853" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      <mesh ref={ring2} position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.7, 32]} />
        <meshBasicMaterial color="#FBBC05" side={THREE.DoubleSide} transparent opacity={0.4} />
      </mesh>

      {/* Upward Volumetric light beams */}
      <mesh position={[0, 2.0, 0]}>
        <cylinderGeometry args={[1.5, 2.8, 4.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#34A853"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Tiny Event Stage floating tags */}
      <Html position={[0, 4.5, 0]} center distanceFactor={15}>
        <div className="px-3 py-1 font-display text-xxs tracking-widest text-google-green font-bold uppercase border border-google-green/30 rounded bg-brand-bg/80 backdrop-blur-sm whitespace-nowrap">
          ARENA_04: EVENTS
        </div>
      </Html>
    </group>
  )
}

// 7. Community Structure Node Network
export function CommunityNetwork() {
  const nodes = useMemo(() => {
    // Standard coordinates for structure network nodes
    const data = [
      { id: 0, pos: [0, 2, 0], role: 'Lead', color: '#4285F4', scale: 0.55 },
      { id: 1, pos: [-1.8, 0.8, -1.0], role: 'Co-Lead', color: '#ea4335', scale: 0.45 },
      { id: 2, pos: [1.8, 0.8, 1.0], role: 'Faculty', color: '#FBBC05', scale: 0.45 },
      { id: 3, pos: [-3.2, -0.6, -2.0], role: 'Tech Wing', color: '#7DF9FF', scale: 0.35 },
      { id: 4, pos: [-1.2, -0.8, -2.5], role: 'PR Wing', color: '#7DF9FF', scale: 0.35 },
      { id: 5, pos: [1.2, -0.8, -2.5], role: 'HR Wing', color: '#7DF9FF', scale: 0.35 },
      { id: 6, pos: [3.2, -0.6, -2.0], role: 'Design Wing', color: '#7DF9FF', scale: 0.35 },
      { id: 7, pos: [0, -1.2, -3.0], role: 'Event Wing', color: '#7DF9FF', scale: 0.35 },
    ]
    return data
  }, [])

  const lines = useMemo(() => {
    // Node connection mappings
    const connections = [
      [0, 1], [0, 2],
      [1, 3], [1, 4], [1, 7],
      [2, 5], [2, 6], [2, 7]
    ]
    return connections.map(([start, end]) => {
      const p1 = nodes[start].pos
      const p2 = nodes[end].pos
      return [
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3(p2[0], p2[1], p2[2])
      ]
    })
  }, [nodes])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.25
    }
  })

  return (
    <group ref={groupRef} position={[15, -4, 20]}>
      {/* Glowing network lines */}
      {lines.map((pts, idx) => (
        <Line
          key={idx}
          points={pts.map(p => [p.x, p.y, p.z] as [number, number, number])}
          color="#a855f7"
          lineWidth={1.5}
          transparent
          opacity={0.5}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[node.scale, 16, 16]} />
            <meshBasicMaterial color={node.color} />
          </mesh>
          <mesh scale={1.5}>
            <sphereGeometry args={[node.scale, 8, 8]} />
            <meshBasicMaterial color={node.color} wireframe transparent opacity={0.25} />
          </mesh>
          <Html position={[0, -0.6, 0]} center distanceFactor={12}>
            <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-tighter bg-black/70 text-white border border-brand-border select-none whitespace-nowrap">
              {node.role}
            </span>
          </Html>
        </group>
      ))}
    </group>
  )
}

// 8. Family Wall - Rotating Circular 3D Profile Carousel
export function FamilyRing() {
  const ringRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.08
    }
  })

  const cardsCount = 8
  const radius = 4.8

  const mockUsers = [
    { role: 'Lead', name: 'Rohan K', color: '#4285F4' },
    { role: 'Co-Lead', name: 'Sneha M', color: '#EA4335' },
    { role: 'Tech Admin', name: 'Abhishek R', color: '#FBBC05' },
    { role: 'PR Exec', name: 'Kavitha P', color: '#34A853' },
    { role: 'HR Head', name: 'Ganesh S', color: '#7DF9FF' },
    { role: 'Event Manager', name: 'Divya T', color: '#A855F7' },
    { role: 'Design Lead', name: 'Nikhil K', color: '#10B981' },
    { role: 'Support Co', name: 'Meera G', color: '#EC4899' },
  ]

  return (
    <group ref={ringRef} position={[22, -8, -15]}>
      {/* Central lighting cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 3, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.15} />
      </mesh>

      {/* Floating frames in a circle */}
      {mockUsers.map((user, idx) => {
        const angle = (idx / cardsCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        
        return (
          <group key={idx} position={[x, 0, z]} rotation={[0, -angle - Math.PI / 2, 0]}>
            <Float floatIntensity={0.8} speed={1.5}>
              {/* Glass frame */}
              <mesh>
                <boxGeometry args={[1.2, 1.6, 0.05]} />
                <meshPhysicalMaterial
                  color="#111827"
                  roughness={0.1}
                  metalness={0.8}
                  transmission={0.6}
                  thickness={0.2}
                  transparent
                  opacity={0.6}
                />
              </mesh>
              {/* Border glow */}
              <mesh scale={[1.05, 1.05, 1.0]}>
                <boxGeometry args={[1.2, 1.6, 0.02]} />
                <meshBasicMaterial color={user.color} wireframe transparent opacity={0.3} />
              </mesh>

              <Html position={[0, 0.0, 0.04]} center distanceFactor={10}>
                <div className="flex flex-col items-center justify-center p-2 text-center text-white select-none whitespace-nowrap">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 mb-1 flex items-center justify-center bg-white/5 text-[9px] font-bold">
                    {user.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <span className="font-bold text-[9px] leading-tight block">{user.name}</span>
                  <span className="text-[7px] text-brand-muted uppercase font-mono mt-0.5 leading-none">{user.role}</span>
                </div>
              </Html>
            </Float>
          </group>
        )
      })}
    </group>
  )
}

// 9. Pulsing Portal (Join Us)
export function PortalJoin() {
  const ringRef = useRef<THREE.Mesh>(null)
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.5
      // Pulsing scale
      const s = 1.0 + Math.sin(elapsed * 4) * 0.03
      ringRef.current.scale.set(s, s, s)
    }
  })

  // Procedural particles flowing in
  const particleCount = 80
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // Cylindrical coordinates spiraling in
      const angle = Math.random() * Math.PI * 2
      const radius = 2.0 + Math.random() * 3.0
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = -1.0 - Math.random() * 3.0 // behind
      spd[i] = 0.02 + Math.random() * 0.03
    }
    return [pos, spd]
  }, [])

  const pointsRef = useRef<THREE.Points>(null)
  
  useFrame(() => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position
      const count = posAttr.count
      for (let i = 0; i < count; i++) {
        let x = posAttr.getX(i)
        let y = posAttr.getY(i)
        let z = posAttr.getZ(i)
        
        // pull towards center in spiral
        const r = Math.sqrt(x*x + y*y)
        const angle = Math.atan2(y, x) + 0.02 // spiral offset
        
        const newR = r - speeds[i]
        
        if (newR < 0.2) {
          // respawn at outer bounds
          const newAngle = Math.random() * Math.PI * 2
          const newRad = 4.0 + Math.random() * 1.0
          posAttr.setXYZ(i, Math.cos(newAngle) * newRad, Math.sin(newAngle) * newRad, -2.5 - Math.random() * 1.5)
        } else {
          // move closer and pull forward (Z decreases)
          posAttr.setXYZ(i, Math.cos(angle) * newR, Math.sin(angle) * newR, z + speeds[i] * 1.5)
        }
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <group position={[0, 4, -40]}>
      {/* Outer portal ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.6, 0.3, 16, 64]} />
        <meshPhysicalMaterial
          color="#7DF9FF"
          roughness={0.1}
          metalness={0.8}
          emissive="#4285F4"
          emissiveIntensity={1.5}
        />
      </mesh>
      
      {/* Inner glowing portal core disc */}
      <mesh>
        <planeGeometry args={[7.0, 7.0]} />
        <meshBasicMaterial 
          color="#050816" 
          transparent 
          opacity={0.85} 
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Volumetric light tube behind ring */}
      <mesh position={[0, 0, -1.0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[3.2, 3.4, 2.0, 32, 1, true]} />
        <meshBasicMaterial
          color="#7DF9FF"
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating Particles flowing into portal */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.18}
          color="#7DF9FF"
          sizeAttenuation
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <Html position={[0, 4.8, 0]} center distanceFactor={18}>
        <div className="px-4 py-1.5 font-display text-xs tracking-widest text-brand-accent font-bold uppercase border-2 border-brand-accent/40 rounded-full bg-brand-bg/90 backdrop-blur-md shadow-[0_0_20px_rgba(125,249,255,0.4)] whitespace-nowrap animate-pulse">
          PORTAL_09: ENTER_COMMUNITY
        </div>
      </Html>
    </group>
  )
}

// 10. Contact Hologram Station
export function ContactTerminal() {
  const disc1 = useRef<THREE.Mesh>(null)
  const disc2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (disc1.current) disc1.current.rotation.z = elapsed * 0.25
    if (disc2.current) disc2.current.rotation.z = -elapsed * 0.5
  })

  return (
    <group position={[-20, 5, -5]}>
      {/* Base platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.8, 0.4, 16]} />
        <meshStandardMaterial color="#0B1120" roughness={0.7} />
      </mesh>

      {/* Rotating alignment rings */}
      <mesh ref={disc1} position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.2, 16]} />
        <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>
      <mesh ref={disc2} position={[0, 0.23, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 16]} />
        <meshBasicMaterial color="#7DF9FF" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Center hologram coordinates sphere */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial color="#7DF9FF" wireframe transparent opacity={0.4} />
      </mesh>

      {/* Glowing beam */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.3, 0.8, 3.0, 16, 1, true]} />
        <meshBasicMaterial
          color="#7DF9FF"
          transparent
          opacity={0.08}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <Html position={[0, 3.8, 0]} center distanceFactor={12}>
        <div className="px-3 py-1 font-display text-xxs tracking-widest text-[#a855f7] font-bold uppercase border border-[#a855f7]/30 rounded bg-brand-bg/80 backdrop-blur-sm whitespace-nowrap">
          STATION_10: COMMUNICATOR
        </div>
      </Html>
    </group>
  )
}

// 11. Earth & Satellites (Footer Orbital Platform)
export function EarthFooter() {
  const earthRef = useRef<THREE.Mesh>(null)
  const satellitesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsed * 0.05
    }
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y = elapsed * 0.3
      satellitesRef.current.rotation.x = elapsed * 0.1
    }
  })

  return (
    <group position={[0, -16, -30]}>
      {/* Low poly Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[5.0, 24, 24]} />
        <meshStandardMaterial
          color="#0d1f40"
          emissive="#1e3a8a"
          emissiveIntensity={0.15}
          roughness={0.8}
          metalness={0.2}
          wireframe
        />
      </mesh>

      {/* Atmosphere Glow Ring */}
      <mesh>
        <sphereGeometry args={[5.3, 24, 24]} />
        <meshBasicMaterial
          color="#4285F4"
          wireframe
          transparent
          opacity={0.06}
        />
      </mesh>

      {/* Orbiting Satellites group */}
      <group ref={satellitesRef}>
        {/* Satellite 1 */}
        <mesh position={[7.5, 0, 0]}>
          <boxGeometry args={[0.2, 0.1, 0.2]} />
          <meshBasicMaterial color="#EA4335" />
        </mesh>
        {/* Satellite 2 */}
        <mesh position={[-8.5, 1, -1]}>
          <boxGeometry args={[0.15, 0.15, 0.15]} />
          <meshBasicMaterial color="#34A853" />
        </mesh>
        {/* Satellite 3 */}
        <mesh position={[0, 8.0, 1]}>
          <boxGeometry args={[0.2, 0.2, 0.05]} />
          <meshBasicMaterial color="#FBBC05" />
        </mesh>
      </group>

      <Html position={[0, -6.2, 0]} center distanceFactor={15}>
        <div className="text-[10px] font-mono tracking-widest text-brand-muted uppercase whitespace-nowrap">
          GDG_ORBITAL_STATION_RMKEC
        </div>
      </Html>
    </group>
  )
}
