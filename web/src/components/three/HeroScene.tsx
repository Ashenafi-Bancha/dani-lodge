'use client';

/* eslint-disable react-hooks/immutability, react-hooks/purity --
   three.js uniforms are updated every frame by design (the standard React
   Three Fiber pattern), and the particle positions are randomised once. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const photoVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * The pavilion photo with a sense of depth: foliage and the lower frame
 * (nearer to the viewer) shift more with the mouse than the sky, a slow mist
 * drifts through the lower half, warm light falls from the top right, and the
 * whole scene warms toward golden hour as the visitor scrolls away.
 */
const photoFragment = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uRes;
  uniform vec2 uTexSize;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uProgress;
  varying vec2 vUv;

  vec2 coverUv(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uTexSize.x / uTexSize.y;
    vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec3 probe = texture2D(uTex, uv).rgb;
    float foliage = clamp((probe.g - max(probe.r, probe.b)) * 3.0, 0.0, 1.0);
    float depth = clamp(smoothstep(0.1, 1.0, 1.0 - vUv.y) * 0.75 + foliage * 0.35, 0.0, 1.0);

    vec2 drift = vec2(sin(uTime * 0.11), cos(uTime * 0.09)) * 0.004;
    vec2 offset = (uMouse * 0.018 + drift) * depth;
    vec3 col = texture2D(uTex, (uv - 0.5) * 0.965 + 0.5 + offset).rgb;

    float mist = fbm(vUv * vec2(2.2, 4.0) + vec2(uTime * 0.02, uTime * 0.006));
    float band = smoothstep(0.78, 0.3, vUv.y) * smoothstep(0.0, 0.3, vUv.y);
    col = mix(col, vec3(0.93, 0.95, 0.9), mist * band * 0.26);

    float sun = smoothstep(1.25, 0.0, distance(vUv, vec2(0.86, 1.05)));
    col += vec3(1.0, 0.82, 0.5) * sun * 0.1;

    col = mix(col, col * vec3(1.08, 0.9, 0.72), uProgress * 0.8);
    col *= mix(1.0, 0.78, smoothstep(0.45, 0.98, distance(vUv, vec2(0.5))));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const motesVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vAlpha;
  void main() {
    vec3 p = position;
    p.y += mod(uTime * (0.05 + aSeed * 0.08) + aSeed * 10.0, 6.0) - 3.0;
    p.x += sin(uTime * 0.3 + aSeed * 12.0) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (18.0 + aSeed * 26.0) * uPixelRatio / -mv.z;
    vAlpha = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aSeed) + aSeed * 30.0));
  }
`;

const motesFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(1.0, 0.88, 0.6, glow * glow * vAlpha * 0.55);
  }
`;

interface SceneProps {
  texture: THREE.Texture;
  onFirstFrame: () => void;
}

function Photo({ texture, onFirstFrame }: SceneProps) {
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2());
  const target = useRef(new THREE.Vector2());
  const reported = useRef(false);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uRes: { value: new THREE.Vector2(1, 1) },
      uTexSize: { value: new THREE.Vector2((texture.image as HTMLImageElement).width, (texture.image as HTMLImageElement).height) },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uProgress: { value: 0 },
    }),
    [texture]
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state, delta) => {
    mouse.current.lerp(target.current, Math.min(1, delta * 2.2));
    uniforms.uMouse.value.copy(mouse.current);
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uRes.value.set(size.width, size.height);
    uniforms.uProgress.value = Math.min(1, window.scrollY / window.innerHeight);
    if (!reported.current) {
      reported.current = true;
      onFirstFrame();
    }
  });

  return (
    <mesh renderOrder={0} frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial vertexShader={photoVertex} fragmentShader={photoFragment} uniforms={uniforms} depthWrite={false} />
    </mesh>
  );
}

/** Dust and pollen drifting through the light. */
function Motes({ count = 140 }: { count?: number }) {
  const { gl } = useThree();
  const geometry = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      seeds[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count]);

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPixelRatio: { value: gl.getPixelRatio() } }), [gl]);
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <points geometry={geometry} renderOrder={1} frustumCulled={false}>
      <shaderMaterial
        vertexShader={motesVertex}
        fragmentShader={motesFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

interface HeroSceneProps {
  imageSrc: string;
  onReady: () => void;
}

/**
 * Loaded only on capable desktops, after the page is already visible.
 * Stops rendering entirely while the hero is off screen.
 */
export default function HeroScene({ imageSrc, onReady }: HeroSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    let cancelled = false;
    new THREE.TextureLoader().load(imageSrc, (tex) => {
      if (cancelled) return;
      tex.colorSpace = THREE.NoColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {texture && (
        <Canvas
          dpr={[1, 1.5]}
          flat
          linear
          frameloop={onScreen ? 'always' : 'never'}
          gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
          camera={{ position: [0, 0, 5], fov: 50 }}
        >
          <Photo texture={texture} onFirstFrame={onReady} />
          <Motes />
        </Canvas>
      )}
    </div>
  );
}
