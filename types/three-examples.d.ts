declare module 'three/examples/jsm/postprocessing/EffectComposer' {
  import { Camera, Scene, WebGLRenderer } from 'three'
  import { Pass } from 'three/examples/jsm/postprocessing/Pass'

  export class EffectComposer {
    constructor(renderer: WebGLRenderer)
    passes: Pass[]
    addPass(pass: Pass): void
    setSize(width: number, height: number): void
    render(): void
    dispose(): void
  }
}

declare module 'three/examples/jsm/postprocessing/RenderPass' {
  import { Camera, Scene } from 'three'
  import { Pass } from 'three/examples/jsm/postprocessing/Pass'

  export class RenderPass extends Pass {
    constructor(scene: Scene, camera: Camera)
  }
}

declare module 'three/examples/jsm/postprocessing/ShaderPass' {
  import { IUniform, ShaderMaterial, WebGLRenderTarget } from 'three'
  import { Pass } from 'three/examples/jsm/postprocessing/Pass'

  export class ShaderPass extends Pass {
    constructor(shader: { uniforms: Record<string, IUniform>; vertexShader: string; fragmentShader: string })
    uniforms: Record<string, IUniform>
    material: ShaderMaterial
    renderToScreen: boolean
    render(renderer: unknown, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void
  }
}

declare module 'three/examples/jsm/postprocessing/UnrealBloomPass' {
  import { Vector2 } from 'three'
  import { Pass } from 'three/examples/jsm/postprocessing/Pass'

  export class UnrealBloomPass extends Pass {
    constructor(resolution: Vector2, strength?: number, radius?: number, threshold?: number)
    strength: number
    radius: number
    threshold: number
  }
}
