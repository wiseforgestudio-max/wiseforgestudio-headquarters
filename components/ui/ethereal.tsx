'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type HeroSection = {
  id: string
  headline: string
  subheadline: string
  body: string
}

type ColorPalette = {
  primary: string
  secondary: string
  tertiary: string
  accent: string
  dark: string
}

type ScrollHeroProps = {
  sections?: HeroSection[]
  colorPalette?: ColorPalette
  logo?: string
  menuItems?: string[]
}

const defaultSections: HeroSection[] = [
  { id: 'hero', headline: 'Ethereal', subheadline: 'Beyond Reality', body: 'Immersive experiences through computational artistry' },
  { id: 'about', headline: 'Innovation', subheadline: 'Through Design', body: 'Pushing boundaries of digital experiences' },
  { id: 'services', headline: 'Crafted', subheadline: 'With Purpose', body: 'Every pixel serves a greater vision' },
  { id: 'contact', headline: 'Connect', subheadline: 'Create Together', body: "Let's build something extraordinary" },
]

const defaultPalette: ColorPalette = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  tertiary: '#ec4899',
  accent: '#06ffa5',
  dark: '#0a0a0a',
}

export default function ScrollHero({
  sections = defaultSections,
  colorPalette = defaultPalette,
  logo = 'STUDIO',
  menuItems = ['Work', 'About', 'Services', 'Contact'],
}: ScrollHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const sectionsRef = useRef<Array<HTMLElement | null>>([])
  const progressRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef({ progress: 0, velocity: 0, rotation: { x: 0, y: 0 } })
  const mouseRef = useRef({ x: 0.5, y: 0.5, sx: 0.5, sy: 0.5 })
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState(0)

  const paletteGLSL = useMemo(
    () => `
      vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d){
        return a + b*cos(6.28318*(c*t + d));
      }
    `,
    []
  )

  const vertexShader = useMemo(
    () => `
      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vDist;

      uniform float uTime;
      uniform float uScrollVelocity;

      vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec4 mod289(vec4 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314*r; }

      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0)) + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0*floor(p*ns.z*ns.z);
        vec4 x_ = floor(j*ns.z);
        vec4 y_ = floor(j - 7.0*x_);
        vec4 x = x_*ns.x + ns.yyyy;
        vec4 y = y_*ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m*m;
        return 42.0*dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      float fbm(vec3 p){
        float v = 0.0;
        float a = 0.5;
        for(int i=0;i<5;i++){
          v += a * snoise(p);
          p *= 2.0;
          a *= 0.5;
        }
        return v;
      }

      void main(){
        vUv = uv;
        vec3 pos = position;
        vec3 p = pos * 1.1;
        float t = uTime * 0.25;
        float warp1 = fbm(p + vec3(t, -t, t*0.5));
        float warp2 = snoise(p*2.0 + vec3(-t*0.7, t*0.9, t*0.2));
        float warp = warp1*0.25 + warp2*0.1;
        float twist = uScrollVelocity * 0.6;
        float angle = pos.y * twist;
        mat2 R = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
        pos.xz = R * pos.xz;
        float ridge = max(0.0, 1.0 - abs(snoise(p*1.5)));
        float disp = warp + ridge*0.15;
        vDist = disp;
        pos += normal * disp;
        vec4 world = modelMatrix * vec4(pos,1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    []
  )

  const fragmentShader = useMemo(
    () => `
      precision highp float;

      varying vec2 vUv;
      varying vec3 vWorldPos;
      varying float vDist;

      uniform float uTime;
      uniform float uScrollProgress;
      uniform float uSectionIndex;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      uniform vec3 uColor3;
      uniform vec3 uAccent;

      ${paletteGLSL}

      float saturate(float x){ return clamp(x,0.0,1.0); }
      vec3 normalFromDerivatives(vec3 p){ return normalize(cross(dFdx(p), dFdy(p))); }
      vec3 F_Schlick(float cosTheta, vec3 F0){ return F0 + (1.0 - F0)*pow(1.0 - cosTheta, 5.0); }

      float D_GGX(float NdotH, float rough){
        float a = rough*rough;
        float a2 = a*a;
        float d = (NdotH*NdotH)*(a2 - 1.0) + 1.0;
        return a2 / (3.14159 * d * d);
      }

      float G_SchlickGGX(float NdotV, float rough){
        float r = rough + 1.0;
        float k = (r*r)/8.0;
        return NdotV / (NdotV*(1.0 - k) + k);
      }

      float G_Smith(float NdotV, float NdotL, float rough){
        return G_SchlickGGX(NdotV, rough) * G_SchlickGGX(NdotL, rough);
      }

      vec3 envGradient(vec3 r, vec3 skyA, vec3 skyB, vec3 ground){
        float h = r.y * 0.5 + 0.5;
        vec3 sky = mix(skyB, skyA, h);
        return mix(ground, sky, saturate(h*1.2));
      }

      float gradParam(vec2 uv, float time){
        vec2 q = uv*2.0 - 1.0;
        q.x *= 1.2;
        float a = sin(q.x*2.5 + time*0.25);
        float b = cos(q.y*3.0 - time*0.2);
        return saturate(0.5 + 0.5*(a*0.6 + b*0.4));
      }

      void main(){
        vec3 N = normalFromDerivatives(vWorldPos);
        vec3 V = normalize(cameraPosition - vWorldPos);
        float t = uTime*0.6;
        vec3 L1 = normalize(vec3( 6.0*sin(t*0.7),  4.0,  6.0*cos(t*0.7)) - vWorldPos);
        vec3 L2 = normalize(vec3(-5.0*cos(t*0.5), -3.5, 5.0*sin(t*0.45)) - vWorldPos);
        vec3 L3 = normalize(vec3(0.0, 6.0*sin(t*0.25), -6.0) - vWorldPos);

        float gp = gradParam(vUv, uTime) + vDist*0.6;
        float sectionMix = clamp(uSectionIndex/3.0, 0.0, 1.0);

        vec3 palA = cosPalette(gp, vec3(0.55,0.55,0.58), vec3(0.45,0.35,0.35), vec3(0.95,0.80,0.70), vec3(0.00,0.35,0.55));
        vec3 palB = cosPalette(gp + 0.15*sin(uTime*0.25), vec3(0.55,0.56,0.58), vec3(0.35,0.45,0.55), vec3(0.90,0.55,0.75), vec3(0.25,0.10,0.60));
        vec3 baseAlbedo = mix(palA, palB, sectionMix);
        baseAlbedo = mix(baseAlbedo, uColor1, 0.15);
        baseAlbedo = mix(baseAlbedo, uColor2, 0.10);

        float metallic = 0.25 + 0.15*sin(uTime*0.2 + gp*3.0);
        float rough = clamp(0.18 + 0.12*sin(gp*6.283 + uTime*0.35), 0.06, 0.6);
        vec3 F0 = mix(vec3(0.04), baseAlbedo, metallic);

        vec3 H1 = normalize(V + L1);
        vec3 H2 = normalize(V + L2);
        vec3 H3 = normalize(V + L3);

        float NdotV = saturate(dot(N,V));
        float NdotL1 = saturate(dot(N,L1));
        float NdotL2 = saturate(dot(N,L2));
        float NdotL3 = saturate(dot(N,L3));

        vec3 spec1 = (D_GGX(saturate(dot(N,H1)), rough) * G_Smith(NdotV, NdotL1, rough) * F_Schlick(saturate(dot(V,H1)), F0)) / max(4.0*NdotV*NdotL1, 0.001);
        vec3 spec2 = (D_GGX(saturate(dot(N,H2)), rough) * G_Smith(NdotV, NdotL2, rough) * F_Schlick(saturate(dot(V,H2)), F0)) / max(4.0*NdotV*NdotL2, 0.001);
        vec3 spec3 = (D_GGX(saturate(dot(N,H3)), rough) * G_Smith(NdotV, NdotL3, rough) * F_Schlick(saturate(dot(V,H3)), F0)) / max(4.0*NdotV*NdotL3, 0.001);

        vec3 kS = F_Schlick(NdotV, F0);
        vec3 kD = (vec3(1.0) - kS) * (1.0 - metallic);
        vec3 diffuse = baseAlbedo / 3.14159;

        vec3 direct =
          (kD*diffuse + spec1) * vec3(1.0) * NdotL1 * 0.9 +
          (kD*diffuse + spec2) * mix(uColor3, vec3(0.9,0.95,1.0), 0.6) * NdotL2 * 0.6 +
          (kD*diffuse + spec3) * mix(uAccent, vec3(1.0,0.9,0.75), 0.5) * NdotL3 * 0.5;

        vec3 env = envGradient(reflect(-V, N), vec3(0.12,0.16,0.25), vec3(0.04,0.06,0.10), vec3(0.01,0.01,0.012));
        vec3 envSpec = F_Schlick(saturate(dot(N,V)), F0) * env * (1.0 - rough) * 0.6;
        vec3 rimCol = mix(uAccent, uColor3, 0.4) * pow(1.0 - saturate(dot(N,V)), 2.0) * 0.35;
        vec3 glow = mix(uAccent, uColor3, 0.5) * abs(vDist) * 0.25;

        vec3 color = clamp(direct + envSpec + rimCol + glow + sin(vUv.x*40.0 + uTime) * sin(vUv.y*38.0 - uTime) * 0.015, 0.0, 4.0);
        gl_FragColor = vec4(color, 1.0 - uScrollProgress*0.12);
      }
    `,
    [paletteGLSL]
  )

  const cinematicPostShader = useMemo(
    () => ({
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2() },
        uTemperature: { value: 0.08 },
        uTint: { value: 0.02 },
        uContrast: { value: 1.06 },
        uSaturation: { value: 1.05 },
        uVignette: { value: 0.35 },
        uAberration: { value: 0.0018 },
        uGrain: { value: 0.22 },
        uLetterbox: { value: 0.6 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main(){ vUv = uv; gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }
      `,
      fragmentShader: `
        precision highp float;
        varying vec2 vUv;
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform vec2 uResolution;
        uniform float uTemperature;
        uniform float uTint;
        uniform float uContrast;
        uniform float uSaturation;
        uniform float uVignette;
        uniform float uAberration;
        uniform float uGrain;
        uniform float uLetterbox;

        float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453); }
        vec3 aces(vec3 x){ float a=2.51,b=0.03,c=2.43,d=0.59,e=0.14; return clamp((x*(a*x+b))/(x*(c*x+d)+e),0.0,1.0); }
        vec3 tempTint(vec3 c, float temp, float tint){ c.r += temp*0.2; c.b -= temp*0.2; c.g += tint*0.15; return c; }
        vec3 satContrast(vec3 c, float sat, float con){ vec3 g = vec3(dot(c, vec3(0.299,0.587,0.114))); c = mix(g, c, sat); return (c - 0.5)*con + 0.5; }

        void main(){
          vec2 p = vUv - 0.5;
          vec2 dir = normalize(p + 1e-6);
          float dist = length(p);
          vec2 off = dir * uAberration * dist;
          vec3 col = vec3(texture2D(tDiffuse, vUv + off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - off).b);
          col += (rand(vUv*vec2(uResolution.x, uResolution.y) + uTime*60.0) - 0.5) * uGrain * 0.08;
          col = tempTint(col, uTemperature, uTint);
          col = satContrast(col, uSaturation, uContrast);
          col *= mix(1.0, smoothstep(0.85, 0.2, dist), uVignette);
          col *= smoothstep(uLetterbox, 0.0, abs(vUv.y - 0.5));
          col = aces(col);
          gl_FragColor = vec4(pow(col, vec3(1.0/2.2)), 1.0);
        }
      `,
    }),
    []
  )

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100)
    camera.position.set(0, 0, 5)

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1
    renderer.outputColorSpace = THREE.SRGBColorSpace

    const geometry = new THREE.IcosahedronGeometry(1.85, 5)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uScrollVelocity: { value: 0 },
        uSectionT: { value: 0 },
        uSectionIndex: { value: 0 },
        uColor1: { value: new THREE.Color(colorPalette.primary) },
        uColor2: { value: new THREE.Color(colorPalette.secondary) },
        uColor3: { value: new THREE.Color(colorPalette.tertiary) },
        uAccent: { value: new THREE.Color(colorPalette.accent) },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    meshRef.current = mesh
    scene.add(mesh)

    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.7, 0.35, 0.92))
    const cinePass = new ShaderPass(cinematicPostShader)
    cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    composer.addPass(cinePass)

    const clock = new THREE.Clock()
    let frameId = 0

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      composer.setSize(window.innerWidth, window.innerHeight)
      cinePass.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)
    }

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      const time = clock.getElapsedTime()
      material.uniforms.uTime.value = time
      material.uniforms.uScrollProgress.value = scrollRef.current.progress
      material.uniforms.uScrollVelocity.value = scrollRef.current.velocity
      mesh.rotation.x = scrollRef.current.rotation.x
      mesh.rotation.y = scrollRef.current.rotation.y
      mesh.position.y = Math.abs(scrollRef.current.velocity) < 0.01 ? Math.sin(time * 0.45) * 0.06 : mesh.position.y * 0.9
      cinePass.uniforms.uTime.value = time
      composer.render()
    }

    window.addEventListener('resize', onResize)
    animate()
    setIsLoaded(true)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(frameId)
      geometry.dispose()
      material.dispose()
      composer.dispose()
      renderer.dispose()
    }
  }, [cinematicPostShader, colorPalette, fragmentShader, vertexShader])

  useEffect(() => {
    if (!isLoaded || !containerRef.current || !meshRef.current) return

    let lastY = window.scrollY
    let velocityTimeout: ReturnType<typeof setTimeout> | undefined

    const progressTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        scrollRef.current.progress = self.progress
        const currentY = window.scrollY
        scrollRef.current.velocity = THREE.MathUtils.clamp((currentY - lastY) * 0.01, -1, 1)
        lastY = currentY
        gsap.to(scrollRef.current.rotation, {
          x: self.progress * Math.PI * 3,
          y: self.progress * Math.PI * 4.5,
          duration: 0.3,
          ease: 'power2.out',
        })
        clearTimeout(velocityTimeout)
        velocityTimeout = setTimeout(() => {
          gsap.to(scrollRef.current, { velocity: 0, duration: 0.5, ease: 'power2.out' })
        }, 120)
        if (progressRef.current) gsap.to(progressRef.current, { scaleY: self.progress, duration: 0.12 })
      },
    })

    const triggers = sections.map((_, index) => {
      const sectionNode = sectionsRef.current[index]
      if (!sectionNode) return null

      gsap.fromTo(
        sectionNode.querySelectorAll('.section-headline, .section-subheadline, .section-body'),
        { opacity: 0, y: 80, rotationX: -10 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 1,
          stagger: 0.15,
          scrollTrigger: { trigger: sectionNode, start: 'top 80%', end: 'top 20%', scrub: 1 },
        }
      )

      return ScrollTrigger.create({
        trigger: sectionNode,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => {
          setActiveSection(index)
          const shader = meshRef.current?.material as THREE.ShaderMaterial | undefined
          if (!shader) return
          gsap.to(shader.uniforms.uSectionIndex, { value: index, duration: 1.2, ease: 'power2.inOut' })
          gsap.fromTo(shader.uniforms.uSectionT, { value: 0 }, { value: 1, duration: 0.5, ease: 'power2.in', yoyo: true, repeat: 1 })
        },
        onEnterBack: () => {
          setActiveSection(index)
          const shader = meshRef.current?.material as THREE.ShaderMaterial | undefined
          if (!shader) return
          gsap.to(shader.uniforms.uSectionIndex, { value: index, duration: 1.2, ease: 'power2.inOut' })
        },
      })
    })

    return () => {
      progressTrigger.kill()
      triggers.forEach((trigger) => trigger?.kill())
      clearTimeout(velocityTimeout)
    }
  }, [isLoaded, sections])

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX / window.innerWidth
      mouseRef.current.y = 1 - event.clientY / window.innerHeight
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={containerRef} className="scroll-hero" style={{ ['--ethereal-dark' as string]: colorPalette.dark }}>
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="scroll-progress">
        <div ref={progressRef} className="scroll-progress-bar" />
      </div>

      <nav className="nav-container">
        <div className="nav-inner">
          <div className="nav-logo">{logo}</div>
          <div className="nav-menu">
            {menuItems.map((item, index) => (
              <a key={item} href={`#${item.toLowerCase()}`} className={`nav-item ${activeSection === index ? 'active' : ''}`}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(element) => {
            sectionsRef.current[index] = element
          }}
          className="hero-section"
          data-section={index}
        >
          <div className="section-content">
            <h1 className="section-headline">{section.headline}</h1>
            <h2 className="section-subheadline">{section.subheadline}</h2>
            <p className="section-body">{section.body}</p>
          </div>
        </section>
      ))}

      <div className={`loading-overlay ${isLoaded ? 'loaded' : ''}`}>
        <div className="loading-text">Loading</div>
      </div>
    </div>
  )
}
