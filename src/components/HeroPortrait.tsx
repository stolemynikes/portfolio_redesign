import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/motion';

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Subtle liquid displacement that follows the cursor, plus a whisper of
// film grain so the placeholder/photo shares one texture language.
const FRAG = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uIntensity;
  uniform float uTime;
  varying vec2 vUv;

  float grain(vec2 uv, float t) {
    return fract(sin(dot(uv + t * 0.01, vec2(12.9898, 78.233))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float ripple = smoothstep(0.35, 0.0, dist) * uIntensity;
    uv += (uv - uMouse) * ripple * 0.06;
    vec4 tex = texture2D(uTexture, uv);
    tex.rgb += (grain(vUv, uTime) - 0.5) * 0.035;
    gl_FragColor = tex;
  }
`;

interface Props {
  src: string;
  alt: string;
}

/**
 * Hero portrait as a WebGL plane with mouse-follow displacement.
 * Falls back to a plain <img> for reduced motion or when WebGL fails.
 */
export default function HeroPortrait({ src, alt }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setFallback(true);
      return;
    }
    const wrap = wrapRef.current;
    if (!wrap) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setFallback(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0, 1);

    const uniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: 0 },
      uTime: { value: 0 },
    };

    new THREE.TextureLoader().load(
      src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        uniforms.uTexture.value = tex;
      },
      undefined,
      () => setFallback(true)
    );

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1, 1),
      new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG })
    );
    scene.add(mesh);

    const resize = () => {
      const { width, height } = wrap.getBoundingClientRect();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    resize();
    wrap.appendChild(renderer.domElement);
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute('aria-label', alt);

    const target = new THREE.Vector2(0.5, 0.5);
    let targetIntensity = 0;

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      target.set((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
      targetIntensity = 1;
    };
    const onLeave = () => {
      targetIntensity = 0;
    };
    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let raf = 0;
    const clock = new THREE.Clock();
    const loop = () => {
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uMouse.value.lerp(target, 0.08);
      uniforms.uIntensity.value += (targetIntensity - uniforms.uIntensity.value) * 0.06;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      renderer.domElement.remove();
      renderer.dispose();
      mesh.geometry.dispose();
      (mesh.material as THREE.ShaderMaterial).dispose();
      uniforms.uTexture.value?.dispose();
    };
  }, [src, alt]);

  if (fallback) {
    return (
      <div className="hero-portrait" ref={wrapRef}>
        <img src={src} alt={alt} className="media-fill" />
      </div>
    );
  }
  return <div className="hero-portrait" ref={wrapRef} />;
}
