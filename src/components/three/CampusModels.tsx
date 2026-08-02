import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Html, Line, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Custom shaders for sci-fi visualization
const GdgSphereShader = {
  uniforms: {
    uTime: { value: 0 },
    uColorBlue: { value: new THREE.Color('#4285F4') },
    uColorRed: { value: new THREE.Color('#EA4335') },
    uColorYellow: { value: new THREE.Color('#FBBC05') },
    uColorGreen: { value: new THREE.Color('#34A853') },
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
    uniform vec3 uColorRed;
    uniform vec3 uColorYellow;
    uniform vec3 uColorGreen;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;

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
      float n = noise(vPosition * 1.5 + uTime * 0.5);
      float b1 = sin(vPosition.x * 1.5 + uTime * 0.7) * 0.5 + 0.5;
      float b2 = cos(vPosition.y * 1.5 + uTime * 0.4) * 0.5 + 0.5;
      
      vec3 col = mix(uColorBlue, uColorRed, b1);
      col = mix(col, uColorYellow, b2);
      col = mix(col, uColorGreen, n);

      // Fresnel glow outline
      float fresnel = pow(0.75 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
      vec3 glow = vec3(0.5, 0.8, 1.0) * fresnel;

      // Scanning line
      float scan = step(0.97, sin(vPosition.y * 6.0 - uTime * 2.0) * 0.5 + 0.5);
      vec3 scanCol = vec3(1.0, 1.0, 1.0) * scan * 0.5;

      gl_FragColor = vec4(col + glow * 1.8 + scanCol, 0.85);
    }
  `
}

// Hex Shield Shader for Cybersecurity Fortress
const ShieldShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#7DF9FF') }
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    varying vec2 vUv;
    varying vec3 vNormal;

    void main() {
      // Hexagon wireframe simulator
      float pulse = sin(uTime * 3.0) * 0.5 + 0.5;
      float gridX = step(0.97, sin(vUv.x * 50.0) * 0.5 + 0.5);
      float gridY = step(0.97, sin(vUv.y * 50.0) * 0.5 + 0.5);
      float edge = max(gridX, gridY);

      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      vec3 finalCol = mix(uColor * 0.2, uColor, edge + fresnel * 0.8);
      gl_FragColor = vec4(finalCol, 0.15 + edge * 0.45 + fresnel * 0.3);
    }
  `
}

// 1. Central Innovation Hub
export function GdgSphere() {
  const sphereRef = useRef<THREE.Mesh>(null)
  const shaderRef = useRef<THREE.ShaderMaterial>(null)
  const outerRingRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (sphereRef.current) {
      sphereRef.current.rotation.y = elapsed * 0.1
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = elapsed
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z = -elapsed * 0.15
      outerRingRef.current.rotation.x = Math.sin(elapsed * 0.2) * 0.1
    }
  })

  return (
    <group>
      {/* Core glowing GDG Sphere */}
      <mesh ref={sphereRef}>
        <sphereGeometry args={[2.4, 32, 32]} />
        <shaderMaterial
          ref={shaderRef}
          vertexShader={GdgSphereShader.vertexShader}
          fragmentShader={GdgSphereShader.fragmentShader}
          uniforms={GdgSphereShader.uniforms}
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Glass shield */}
      <mesh>
        <sphereGeometry args={[2.55, 32, 32]} />
        <meshPhysicalMaterial
          color="#00e5ff"
          roughness={0.05}
          metalness={0.9}
          transmission={0.85}
          thickness={0.5}
          ior={1.4}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Orbiting structure rings (Central Hub Architecture) */}
      <group ref={outerRingRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3.4, 0.08, 8, 32]} />
          <meshStandardMaterial color="#4285F4" emissive="#4285F4" emissiveIntensity={0.6} />
        </mesh>
        
        {/* Docking nodes along rings */}
        {[0, 1, 2, 3].map((n) => {
          const angle = (n / 4) * Math.PI * 2
          return (
            <mesh key={n} position={[Math.cos(angle) * 3.4, 0, Math.sin(angle) * 3.4]}>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial color="#7DF9FF" roughness={0.1} metalness={0.9} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

// 2. Floating Technology Icons Orbiting Central Hub
export function OrbitingIcons() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.15
    }
  })

  // 3D icon metadata
  const iconsData = useMemo(() => [
    { name: 'Web', color: '#4285F4' },
    { name: 'AI', color: '#EA4335' },
    { name: 'Cloud', color: '#FBBC05' },
    { name: 'Android', color: '#34A853' },
    { name: 'Cyber', color: '#7DF9FF' },
  ], [])

  return (
    <group ref={groupRef}>
      {iconsData.map((icon, idx) => {
        const angle = (idx / iconsData.length) * Math.PI * 2
        const radius = 5.6
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius
        const y = Math.sin(angle * 4) * 0.6 // Waves

        return (
          <group key={icon.name} position={[x, y, z]}>
            <Float floatIntensity={1.8} speed={2.5}>
              <mesh>
                {icon.name === 'Web' && <torusGeometry args={[0.3, 0.06, 8, 24]} />}
                {icon.name === 'AI' && <octahedronGeometry args={[0.35, 0]} />}
                {icon.name === 'Cloud' && <boxGeometry args={[0.4, 0.25, 0.4]} />}
                {icon.name === 'Android' && <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />}
                {icon.name === 'Cyber' && <coneGeometry args={[0.25, 0.5, 4]} />}
                <meshPhysicalMaterial
                  color={icon.color}
                  roughness={0.1}
                  metalness={0.9}
                  emissive={icon.color}
                  emissiveIntensity={0.8}
                />
              </mesh>
              {/* Scanline rings */}
              <mesh scale={1.2}>
                {icon.name === 'Web' && <torusGeometry args={[0.3, 0.06, 8, 24]} />}
                {icon.name === 'AI' && <octahedronGeometry args={[0.35, 0]} />}
                {icon.name === 'Cloud' && <boxGeometry args={[0.4, 0.25, 0.4]} />}
                {icon.name === 'Android' && <cylinderGeometry args={[0.2, 0.2, 0.5, 12]} />}
                {icon.name === 'Cyber' && <coneGeometry args={[0.25, 0.5, 4]} />}
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.12} />
              </mesh>
            </Float>
          </group>
        )
      })}
    </group>
  )
}

// 3. Floating Drones & Small ships flying around the campus
export function FloatingDrones() {
  const dronesRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (dronesRef.current) {
      dronesRef.current.rotation.y = elapsed * 0.05
      // Wave up and down
      dronesRef.current.position.y = Math.sin(elapsed * 0.8) * 0.4
    }
  })

  // Static coordinates for drones
  const droneData = useMemo(() => [
    { pos: [-12, 5, -8], color: '#7DF9FF' },
    { pos: [12, -3, 14], color: '#EA4335' },
    { pos: [-16, -2, -18], color: '#FBBC05' },
    { pos: [18, 6, -10], color: '#34A853' }
  ], [])

  return (
    <group ref={dronesRef}>
      {droneData.map((d, i) => (
        <group key={i} position={d.pos as [number, number, number]}>
          <Float speed={3} floatIntensity={1.5}>
            {/* Drone body */}
            <mesh>
              <boxGeometry args={[0.6, 0.15, 0.4]} />
              <meshStandardMaterial color="#0B1120" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Left Wing */}
            <mesh position={[-0.45, 0, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.25]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            {/* Right Wing */}
            <mesh position={[0.45, 0, 0]}>
              <boxGeometry args={[0.3, 0.05, 0.25]} />
              <meshStandardMaterial color="#334155" metalness={0.9} />
            </mesh>
            {/* Glowing Engine thrusters */}
            <mesh position={[0, -0.05, -0.22]}>
              <boxGeometry args={[0.15, 0.1, 0.05]} />
              <meshBasicMaterial color={d.color} />
            </mesh>
            <pointLight color={d.color} intensity={1.5} distance={3} />
          </Float>
        </group>
      ))}
    </group>
  )
}

// Energy bridge spline generator connecting islands back to central hub
function EnergyBridge({ target }: { target: [number, number, number] }) {
  const points = useMemo(() => {
    // Generate curved bridge from central platform [0, -2.5, 0] to target island
    return [
      new THREE.Vector3(0, -2.5, 0),
      new THREE.Vector3(target[0] * 0.4, -2.0, target[2] * 0.4),
      new THREE.Vector3(target[0] * 0.8, target[1] - 1.0, target[2] * 0.8),
      new THREE.Vector3(target[0], target[1] - 0.5, target[2])
    ]
  }, [target])

  const linePoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points)
    return curve.getPoints(20).map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [points])

  return (
    <group>
      {/* Outer energy beam */}
      <Line
        points={linePoints}
        color="#7DF9FF"
        lineWidth={1.5}
        transparent
        opacity={0.35}
      />
      {/* Core intense beam */}
      <Line
        points={linePoints}
        color="#ffffff"
        lineWidth={0.5}
        transparent
        opacity={0.7}
      />
    </group>
  )
}

// 4. Technology explorable islands (Modular sci-fi architectures)
export function TechIslands({ onIslandClick }: { onIslandClick: (domainName: string) => void }) {
  const shieldRef = useRef<THREE.ShaderMaterial>(null)
  
  useFrame((state) => {
    if (shieldRef.current) {
      shieldRef.current.uniforms.uTime.value = state.clock.getElapsedTime()
    }
  })

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
      {/* Floating Drones */}
      <FloatingDrones />

      {/* Energy bridges from center [0, -2.5, 0] to each tech island */}
      {domains.map((dom) => (
        <EnergyBridge key={`bridge-${dom.name}`} target={dom.pos as [number, number, number]} />
      ))}

      {domains.map((dom) => (
        <group key={dom.name} position={dom.pos as [number, number, number]}>
          <Float speed={1.8} floatIntensity={0.8}>
            
            {/* Modular Platform Base */}
            <group 
              onClick={(e) => {
                e.stopPropagation()
                onIslandClick(dom.name)
              }}
              onPointerOver={() => { document.body.style.cursor = 'pointer' }}
              onPointerOut={() => { document.body.style.cursor = 'auto' }}
            >
              {/* Outer structural deck ring */}
              <mesh>
                <cylinderGeometry args={[2.8, 3.2, 0.4, 8]} />
                <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.15} flatShading />
              </mesh>
              {/* Inner details deck */}
              <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[2.5, 2.5, 0.35, 8]} />
                <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
              </mesh>
              {/* Neon border lines */}
              <mesh position={[0, 0.22, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[2.45, 2.55, 8]} />
                <meshBasicMaterial color={dom.color} side={THREE.DoubleSide} />
              </mesh>
            </group>

            {/* Specifc Modular District Architecture */}
            {dom.name === 'Web' && (
              // Web: Browser Tower structure (multi-layered glass column)
              <group position={[0, 1.4, 0]}>
                {/* Central server column */}
                <mesh>
                  <cylinderGeometry args={[0.3, 0.3, 2.2, 8]} />
                  <meshStandardMaterial color="#0B1120" metalness={0.8} roughness={0.2} />
                </mesh>
                {/* Glass outer sheets */}
                {[0, 1, 2].map((i) => (
                  <mesh key={i} position={[0, 0, 0]} rotation={[0, (i * Math.PI) / 3, 0]}>
                    <boxGeometry args={[1.3, 2.0, 0.05]} />
                    <meshPhysicalMaterial
                      color={dom.color}
                      roughness={0.05}
                      transmission={0.8}
                      thickness={0.5}
                      transparent
                      opacity={0.3}
                    />
                  </mesh>
                ))}
              </group>
            )}

            {dom.name === 'AI' && (
              // AI: Neural brain sphere (procedural network nodes inside glass)
              <group position={[0, 1.2, 0]}>
                <mesh>
                  <sphereGeometry args={[1.0, 16, 16]} />
                  <meshPhysicalMaterial
                    color={dom.color}
                    transmission={0.8}
                    thickness={0.5}
                    transparent
                    opacity={0.15}
                  />
                </mesh>
                {/* Neural Nodes inside */}
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const x = (Math.random() - 0.5) * 1.2
                  const y = (Math.random() - 0.5) * 1.2
                  const z = (Math.random() - 0.5) * 1.2
                  return (
                    <mesh key={i} position={[x, y, z]}>
                      <sphereGeometry args={[0.12, 8, 8]} />
                      <meshBasicMaterial color={dom.color} />
                    </mesh>
                  )
                })}
              </group>
            )}

            {dom.name === 'Cloud' && (
              // Cloud: Datacenter Server Cabinets
              <group position={[0, 1.0, 0]}>
                {[-0.6, 0.6].map((x) => (
                  <group key={x} position={[x, 0, 0]}>
                    <mesh>
                      <boxGeometry args={[0.6, 1.6, 0.7]} />
                      <meshStandardMaterial color="#0B1120" metalness={0.9} roughness={0.1} />
                    </mesh>
                    {/* Glowing LED front screens */}
                    <mesh position={[0, 0, 0.36]}>
                      <boxGeometry args={[0.45, 1.4, 0.02]} />
                      <meshBasicMaterial color={dom.color} transparent opacity={0.35} />
                    </mesh>
                    {/* Scanning lights */}
                    <pointLight color={dom.color} intensity={2.0} distance={2.5} position={[0, 0, 0.4]} />
                  </group>
                ))}
              </group>
            )}

            {dom.name === 'Android' && (
              // Android: Research Tower with orbiting holographic gears
              <group position={[0, 1.4, 0]}>
                <mesh>
                  <cylinderGeometry args={[0.1, 0.5, 2.0, 4]} />
                  <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Orbiting ring */}
                <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2.5, 0, 0]}>
                  <torusGeometry args={[0.9, 0.05, 8, 24]} />
                  <meshBasicMaterial color={dom.color} transparent opacity={0.8} />
                </mesh>
              </group>
            )}

            {dom.name === 'Cybersecurity' && (
              // Cyber: Shield Fortress base with Hexagonal shield mesh
              <group position={[0, 1.1, 0]}>
                {/* Center tower core */}
                <mesh>
                  <cylinderGeometry args={[0.5, 0.8, 1.4, 6]} />
                  <meshStandardMaterial color="#334155" metalness={0.9} />
                </mesh>
                {/* Hex energy field dome */}
                <mesh>
                  <sphereGeometry args={[1.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
                  <shaderMaterial
                    ref={shieldRef}
                    vertexShader={ShieldShader.vertexShader}
                    fragmentShader={ShieldShader.fragmentShader}
                    uniforms={ShieldShader.uniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                  />
                </mesh>
              </group>
            )}

            {dom.name === 'UI/UX' && (
              // UI/UX: Design plaza with floating neon panels
              <group position={[0, 1.2, 0]}>
                {/* Flat glass boards */}
                {[-0.6, 0.6].map((x, i) => (
                  <mesh key={i} position={[x, i * 0.4, 0]} rotation={[0.2, 0.4 * x, 0]}>
                    <boxGeometry args={[0.9, 0.9, 0.03]} />
                    <meshPhysicalMaterial
                      color={dom.color}
                      transmission={0.9}
                      thickness={0.2}
                      transparent
                      opacity={0.4}
                      roughness={0.01}
                    />
                  </mesh>
                ))}
              </group>
            )}

            {dom.name === 'Backend' && (
              // Backend: Modular Server Stack grid with blinking lights
              <group position={[0, 1.0, 0]}>
                {[0, 0.4, 0.8].map((y) => (
                  <mesh key={y} position={[0, y, 0]}>
                    <boxGeometry args={[1.4, 0.25, 1.4]} />
                    <meshStandardMaterial color="#020617" metalness={0.95} roughness={0.1} />
                  </mesh>
                ))}
                <mesh position={[0, 0.4, 0.72]}>
                  <boxGeometry args={[1.2, 1.0, 0.02]} />
                  <meshBasicMaterial color={dom.color} transparent opacity={0.2} />
                </mesh>
              </group>
            )}

            {/* Glowing Accent light on platform */}
            <pointLight color={dom.color} intensity={2.5} distance={6} position={[0, 0.4, 0]} />

            {/* Holographic Text Label */}
            <Html position={[0, -0.9, 0]} center distanceFactor={14}>
              <div className="px-3 py-1 font-display text-[10px] font-bold uppercase tracking-wider rounded-lg border border-brand-border glass-panel glow-cyan text-white whitespace-nowrap cursor-pointer select-none">
                {dom.name}
              </div>
            </Html>
          </Float>
        </group>
      ))}
    </group>
  )
}

// 5. Winding Light Road Pathway for Journey Timeline
export function JourneyTimeline() {
  const points = useMemo(() => {
    const arr = []
    for (let i = 0; i <= 16; i++) {
      const t = i / 16
      const x = -12 + t * 28
      const z = -6 - Math.sin(t * Math.PI * 2) * 10
      const y = -1.5 + Math.sin(t * Math.PI) * 2.5
      arr.push(new THREE.Vector3(x, y, z))
    }
    return arr
  }, [])

  const linePoints = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points)
    return curve.getPoints(30).map(p => [p.x, p.y, p.z] as [number, number, number])
  }, [points])

  const milestones = [
    { label: '2025: Start', pos: points[0], desc: 'September chapter launch' },
    { label: 'Events & Growth', pos: points[5], desc: 'Cloud Jams & Technical Workshops' },
    { label: 'Building Impact', pos: points[10], desc: 'Real-time college application releases' },
    { label: 'The Future', pos: points[16], desc: 'Open Source scales & HackNEXA' }
  ]

  return (
    <group>
      {/* Winding glowing space road */}
      <Line
        points={linePoints}
        color="#7DF9FF"
        lineWidth={3.0}
        transparent
        opacity={0.8}
      />
      <Line
        points={linePoints}
        color="#4285F4"
        lineWidth={1}
        dashed
        dashScale={3}
        transparent
        opacity={0.5}
      />

      {milestones.map((m, idx) => (
        <group key={idx} position={[m.pos.x, m.pos.y, m.pos.z]}>
          {/* Milestone glowing node structure */}
          <mesh>
            <cylinderGeometry args={[0.3, 0.45, 0.6, 6]} />
            <meshStandardMaterial color="#FBBC05" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh scale={1.6} position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color="#FBBC05" wireframe transparent opacity={0.4} />
          </mesh>
          <pointLight color="#FBBC05" intensity={1.5} distance={4} />
          
          <Html position={[0, 0.9, 0]} center distanceFactor={14}>
            <div className="p-2.5 glass-panel rounded-lg border border-brand-border text-center w-36 shadow-lg">
              <h4 className="text-[9px] font-extrabold text-google-yellow font-display uppercase tracking-wider">{m.label}</h4>
              <p className="text-[8px] font-sans text-brand-muted mt-0.5 leading-snug">{m.desc}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  )
}

// 6. Project Laboratory (Tony Stark style lab - glass hologram tables)
export function ProjectLab() {
  const outerCageRef = useRef<THREE.Group>(null)
  const hologramRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (outerCageRef.current) {
      outerCageRef.current.rotation.y = elapsed * 0.05
    }
    if (hologramRef.current) {
      hologramRef.current.rotation.y = -elapsed * 0.25
      hologramRef.current.position.y = Math.sin(elapsed * 2.2) * 0.12
    }
  })

  return (
    <group position={[0, -2, 20]}>
      {/* Stark Lab glass grid foundation */}
      <group ref={outerCageRef}>
        {/* Lab floor disc */}
        <mesh position={[0, -1.8, 0]}>
          <cylinderGeometry args={[3.2, 3.5, 0.25, 12]} />
          <meshStandardMaterial color="#0B1120" metalness={0.9} roughness={0.2} />
        </mesh>
        
        {/* Corner glass columns */}
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(angle) * 2.8, -0.2, Math.sin(angle) * 2.8]}>
              <cylinderGeometry args={[0.08, 0.08, 3.2, 8]} />
              <meshPhysicalMaterial
                color="#4285F4"
                transmission={0.9}
                thickness={0.5}
                transparent
                opacity={0.3}
              />
            </mesh>
          )
        })}
      </group>

      {/* Grid visualizer floor projection */}
      <gridHelper args={[5.5, 14, '#7DF9FF', '#111827']} position={[0, -1.65, 0]} />

      {/* Volumetric Hologram bus and maps */}
      <group ref={hologramRef}>
        {/* Hologram Bus body */}
        <mesh position={[0, 0.35, 0]}>
          <boxGeometry args={[1.8, 0.65, 0.85]} />
          <meshBasicMaterial color="#7DF9FF" wireframe transparent opacity={0.5} />
        </mesh>
        {/* Wheels */}
        {[-0.6, 0.6].map((x) => (
          [-0.45, 0.45].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, -0.05, z]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.16, 0.16, 0.14, 8]} />
              <meshBasicMaterial color="#34A853" wireframe transparent opacity={0.4} />
            </mesh>
          ))
        ))}
        {/* Projector cone light */}
        <mesh position={[0, -1.0, 0]}>
          <cylinderGeometry args={[0.1, 1.4, 2.0, 16, 1, true]} />
          <meshBasicMaterial 
            color="#4285F4" 
            transparent 
            opacity={0.12} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <pointLight color="#7DF9FF" intensity={2.0} distance={5} position={[0, 0.5, 0]} />

      <Html position={[0, 2.4, 0]} center distanceFactor={11}>
        <div className="px-3 py-1 font-display text-[9px] tracking-widest text-google-blue font-bold uppercase border border-google-blue/30 rounded bg-brand-bg/85 backdrop-blur-sm whitespace-nowrap">
          SYSTEM_06: PROJECTS_LAB
        </div>
      </Html>
    </group>
  )
}

// 7. Event Arena (Future Stage & Spotlight beams)
export function EventArena() {
  const lightRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (lightRef.current) {
      // Swing spotlights
      lightRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 1.5) * 0.35
    }
  })

  return (
    <group position={[-15, -6, 5]}>
      {/* Sci-Fi Arena Deck */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[3.8, 4.2, 0.5, 32]} />
        <meshStandardMaterial color="#0B1120" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Interactive deck floor rings */}
      <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.4, 3.6, 32]} />
        <meshBasicMaterial color="#34A853" side={THREE.DoubleSide} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.0, 32]} />
        <meshBasicMaterial color="#FBBC05" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Volumetric stage spotlights */}
      <group ref={lightRef} position={[0, 0.3, 0]}>
        <mesh position={[0, 2.2, 0]}>
          <cylinderGeometry args={[0.5, 3.2, 4.4, 32, 1, true]} />
          <meshBasicMaterial
            color="#34A853"
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>

      <pointLight color="#34A853" intensity={2.5} distance={8} position={[0, 0.5, 0]} />

      <Html position={[0, 4.4, 0]} center distanceFactor={14}>
        <div className="px-3 py-1 font-display text-[9px] tracking-widest text-google-green font-bold uppercase border border-google-green/30 rounded bg-brand-bg/85 backdrop-blur-sm whitespace-nowrap">
          ARENA_04: EVENTS
        </div>
      </Html>
    </group>
  )
}

// 8. Community Headquarters Node Network
export function CommunityNetwork() {
  const nodes = useMemo(() => [
    { id: 0, pos: [0, 2.2, 0], role: 'Lead', color: '#4285F4', size: 0.55 },
    { id: 1, pos: [-2.0, 0.8, -1.0], role: 'Co-Lead', color: '#EA4335', size: 0.45 },
    { id: 2, pos: [2.0, 0.8, 1.0], role: 'Faculty Advisor', color: '#FBBC05', size: 0.45 },
    { id: 3, pos: [-3.4, -0.6, -2.0], role: 'Tech Wing', color: '#7DF9FF', size: 0.35 },
    { id: 4, pos: [-1.4, -0.8, -2.5], role: 'PR Wing', color: '#7DF9FF', size: 0.35 },
    { id: 5, pos: [1.4, -0.8, -2.5], role: 'HR Wing', color: '#7DF9FF', size: 0.35 },
    { id: 6, pos: [3.4, -0.6, -2.0], role: 'Design Wing', color: '#7DF9FF', size: 0.35 },
    { id: 7, pos: [0, -1.2, -3.0], role: 'Event Wing', color: '#7DF9FF', size: 0.35 },
  ], [])

  const lines = useMemo(() => {
    const conns = [
      [0, 1], [0, 2],
      [1, 3], [1, 4], [1, 7],
      [2, 5], [2, 6], [2, 7]
    ]
    return conns.map(([s, e]) => {
      const p1 = nodes[s].pos
      const p2 = nodes[e].pos
      return [
        new THREE.Vector3(p1[0], p1[1], p1[2]),
        new THREE.Vector3(p2[0], p2[1], p2[2])
      ]
    })
  }, [nodes])

  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[15, -4, 20]}>
      {/* Node connectors */}
      {lines.map((pts, idx) => (
        <Line
          key={idx}
          points={pts.map(p => [p.x, p.y, p.z] as [number, number, number])}
          color="#a855f7"
          lineWidth={2.0}
          transparent
          opacity={0.6}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <group key={node.id} position={node.pos as [number, number, number]}>
          <mesh>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial color={node.color} metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh scale={1.5}>
            <sphereGeometry args={[node.size, 8, 8]} />
            <meshBasicMaterial color={node.color} wireframe transparent opacity={0.3} />
          </mesh>
          <pointLight color={node.color} intensity={1.5} distance={3} />
          
          <Html position={[0, -0.65, 0]} center distanceFactor={11}>
            <span className="px-2 py-0.5 rounded text-[8px] font-mono tracking-tighter bg-black/85 text-white border border-brand-border whitespace-nowrap">
              {node.role}
            </span>
          </Html>
        </group>
      ))}
    </group>
  )
}

// 9. Family Wall Carousel Ring
export function FamilyRing() {
  const ringRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.06
    }
  })

  const cardsCount = 8
  const radius = 5.2

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
      {/* Central glow core cylinder */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 3.2, 8]} />
        <meshBasicMaterial color="#a855f7" transparent opacity={0.18} />
      </mesh>

      {/* Circular Profile Slots */}
      {mockUsers.map((user, idx) => {
        const angle = (idx / cardsCount) * Math.PI * 2
        const x = Math.cos(angle) * radius
        const z = Math.sin(angle) * radius

        return (
          <group key={idx} position={[x, 0, z]} rotation={[0, -angle - Math.PI / 2, 0]}>
            <Float floatIntensity={1.0} speed={1.8}>
              {/* Profile Card frame */}
              <mesh>
                <boxGeometry args={[1.3, 1.7, 0.06]} />
                <meshPhysicalMaterial
                  color="#0f172a"
                  roughness={0.05}
                  metalness={0.9}
                  transmission={0.7}
                  thickness={0.3}
                  transparent
                  opacity={0.7}
                />
              </mesh>
              {/* Glowing colored deck frame */}
              <mesh scale={[1.05, 1.05, 1.0]}>
                <boxGeometry args={[1.3, 1.7, 0.03]} />
                <meshBasicMaterial color={user.color} wireframe transparent opacity={0.4} />
              </mesh>
              <pointLight color={user.color} intensity={1.5} distance={3.5} />

              <Html position={[0, 0, 0.05]} center distanceFactor={10}>
                <div className="flex flex-col items-center justify-center p-2 text-center text-white select-none whitespace-nowrap">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 mb-1 flex items-center justify-center bg-white/5 text-[10px] font-bold">
                    {user.name.split(' ').map(n=>n[0]).join('')}
                  </div>
                  <span className="font-bold text-[10px] leading-tight block">{user.name}</span>
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

// 10. Pulsing Join energy portal
export function PortalJoin() {
  const ringRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (ringRef.current) {
      ringRef.current.rotation.z = elapsed * 0.4
      const pulse = 1.0 + Math.sin(elapsed * 4.5) * 0.04
      ringRef.current.scale.set(pulse, pulse, pulse)
    }
  })

  // Procedural particles flowing in
  const particleCount = 120
  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const spd = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 2.0 + Math.random() * 4.0
      pos[i * 3] = Math.cos(angle) * radius
      pos[i * 3 + 1] = Math.sin(angle) * radius
      pos[i * 3 + 2] = -1.0 - Math.random() * 4.0
      spd[i] = 0.02 + Math.random() * 0.04
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

        const r = Math.sqrt(x*x + y*y)
        const angle = Math.atan2(y, x) + 0.025 // spiral

        const newR = r - speeds[i]

        if (newR < 0.2) {
          const newAngle = Math.random() * Math.PI * 2
          const newRad = 4.5 + Math.random() * 1.5
          posAttr.setXYZ(i, Math.cos(newAngle) * newRad, Math.sin(newAngle) * newRad, -2.5 - Math.random() * 2.0)
        } else {
          posAttr.setXYZ(i, Math.cos(angle) * newR, Math.sin(angle) * newR, z + speeds[i] * 2.0)
        }
      }
      posAttr.needsUpdate = true
    }
  })

  return (
    <group position={[0, 4, -40]}>
      {/* Torus portal ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[3.8, 0.4, 16, 64]} />
        <meshPhysicalMaterial
          color="#7DF9FF"
          roughness={0.05}
          metalness={0.9}
          emissive="#4285F4"
          emissiveIntensity={1.8}
        />
      </mesh>

      {/* Swirling glow portal cylinder */}
      <mesh position={[0, 0, -0.8]}>
        <cylinderGeometry args={[3.5, 3.6, 1.8, 32, 1, true]} />
        <meshBasicMaterial
          color="#7DF9FF"
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floating spiral particles */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <PointMaterial
          size={0.2}
          color="#7DF9FF"
          sizeAttenuation
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <pointLight color="#7DF9FF" intensity={3.5} distance={12} position={[0, 0, 2]} />

      <Html position={[0, 4.8, 0]} center distanceFactor={15}>
        <div className="px-4 py-1.5 font-display text-xs tracking-widest text-brand-accent font-bold uppercase border-2 border-brand-accent/40 rounded-full bg-brand-bg/90 backdrop-blur-md shadow-[0_0_20px_rgba(125,249,255,0.4)] whitespace-nowrap animate-pulse">
          PORTAL_09: ENTER_COMMUNITY
        </div>
      </Html>
    </group>
  )
}

// 11. Contact terminal Station (Hologram communicator base)
export function ContactTerminal() {
  const d1 = useRef<THREE.Mesh>(null)
  const d2 = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (d1.current) d1.current.rotation.z = elapsed * 0.2
    if (d2.current) d2.current.rotation.z = -elapsed * 0.4
  })

  return (
    <group position={[-20, 5, -5]}>
      {/* Sci fi console terminal */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.9, 0.45, 16]} />
        <meshStandardMaterial color="#0b1329" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Concentric rotating glowing decks */}
      <mesh ref={d1} position={[0, 0.25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.0, 2.2, 16]} />
        <meshBasicMaterial color="#a855f7" side={THREE.DoubleSide} transparent opacity={0.7} />
      </mesh>
      <mesh ref={d2} position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.7, 16]} />
        <meshBasicMaterial color="#7DF9FF" side={THREE.DoubleSide} transparent opacity={0.6} />
      </mesh>

      {/* Center projector lens and volumetric beam */}
      <mesh position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.3, 0.9, 2.4, 16, 1, true]} />
        <meshBasicMaterial
          color="#7DF9FF"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      <pointLight color="#7DF9FF" intensity={2.0} distance={5} position={[0, 0.5, 0]} />

      <Html position={[0, 3.8, 0]} center distanceFactor={11}>
        <div className="px-3 py-1 font-display text-[9px] tracking-widest text-[#a855f7] font-bold uppercase border border-[#a855f7]/30 rounded bg-brand-bg/85 backdrop-blur-sm whitespace-nowrap">
          STATION_10: COMMUNICATOR
        </div>
      </Html>
    </group>
  )
}

// 12. Earth footer platform
export function EarthFooter() {
  const earthRef = useRef<THREE.Mesh>(null)
  const satsRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime()
    if (earthRef.current) {
      earthRef.current.rotation.y = elapsed * 0.04
    }
    if (satsRef.current) {
      satsRef.current.rotation.y = elapsed * 0.25
      satsRef.current.rotation.x = elapsed * 0.08
    }
  })

  return (
    <group position={[0, -16, -30]}>
      {/* Low-poly rotating Earth */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[5.2, 24, 24]} />
        <meshStandardMaterial
          color="#0b224e"
          emissive="#1e40af"
          emissiveIntensity={0.2}
          roughness={0.7}
          metalness={0.3}
          wireframe
        />
      </mesh>

      {/* Glowing atmospheric wrap ring */}
      <mesh>
        <sphereGeometry args={[5.5, 24, 24]} />
        <meshBasicMaterial
          color="#4285F4"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Satellites */}
      <group ref={satsRef}>
        {/* Sat 1 */}
        <mesh position={[7.8, 0, 0]}>
          <boxGeometry args={[0.22, 0.12, 0.22]} />
          <meshBasicMaterial color="#EA4335" />
        </mesh>
        {/* Sat 2 */}
        <mesh position={[-8.8, 1, -1]}>
          <boxGeometry args={[0.18, 0.18, 0.18]} />
          <meshBasicMaterial color="#34A853" />
        </mesh>
      </group>

      <Html position={[0, -6.2, 0]} center distanceFactor={14}>
        <div className="text-[10px] font-mono tracking-widest text-brand-muted uppercase whitespace-nowrap">
          GDG_ORBITAL_STATION_RMKEC
        </div>
      </Html>
    </group>
  )
}
