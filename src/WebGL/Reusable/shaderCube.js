import { WebGLCubeRenderTarget, Camera, Scene, Mesh, PlaneBufferGeometry, ShaderMaterial, CubeRefractionMapping } from 'three'
import { Vector2, MeshBasicMaterial, DoubleSide, RGBFormat, LinearFilter, CubeReflectionMapping, WebGLRenderTarget, EquirectangularReflectionMapping } from 'three/build/three.module'

export class ShaderCube {
  constructor ({ renderer, loop }) {
    this.renderer = renderer
    this.resX = 128
    this.renderTarget = new WebGLCubeRenderTarget(this.resX, { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter })
    this.renderTargetPlane = new WebGLRenderTarget(this.resX, this.resX, { format: RGBFormat, magFilter: LinearFilter, minFilter: LinearFilter })
    this.camera = new Camera()
    this.scene = new Scene()
    this.geo = new PlaneBufferGeometry(2, 2, 2, 2)
    let uniforms = {
      time: {
        value: 0
      },
      resolution: {
        value: new Vector2(this.resX, this.resX)
      }
    }
    this.mat = new ShaderMaterial({
      side: DoubleSide,
      transparent: true,
      uniforms,
      vertexShader: `
        void main (void) {
          gl_Position = vec4( position, 1.0 );
        }
      `,
      fragmentShader: `
        #include <common>
        uniform vec2 resolution;
        uniform float time;

        const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

        float noise( in vec2 p ) {
          return sin(p.x)*sin(p.y);
        }

        float fbm4( vec2 p )
        {
            float f = 0.0;
            f += 0.5000 * noise( p ); p = m * p * 2.02;
            f += 0.2500 * noise( p ); p = m * p * 2.03;
            f += 0.1250 * noise( p ); p = m * p * 2.01;
            f += 0.0625 * noise( p );
            return f / 0.9375;
        }

        float fbm6( vec2 p )
        {
            float f = 0.0;
            f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
            f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
            f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
            f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
            f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
            f += 0.015625*(0.5+0.5*noise( p ));
            return f/0.96875;
        }

        float pattern (vec2 p) {
          float vout = fbm4( p + time + fbm6(  p + fbm4( p + time )) );
          return abs(vout);
        }

        void main (void) {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          gl_FragColor = vec4(vec3(
            1.0 - pattern(uv * 13.333 + -0.15 * cos(time * 0.1)),
            1.0 - pattern(uv * 13.333 + 0.0 * cos(time * 0.1)),
            1.0 - pattern(uv * 13.333 + 0.15 * cos(time * 0.1))
          ), 1.0);
        }
      `
    })
    this.renderTargetPlane.texture.mapping = EquirectangularReflectionMapping

    loop(() => {
      uniforms.time.value = window.performance.now() * 0.001
      this.render()
      this.renderTarget.fromEquirectangularTexture(renderer, this.renderTargetPlane.texture)
      this.renderTarget.texture.needsUpdate = true
    })
    this.plane = new Mesh(this.geo, this.mat)
    this.renderTarget.texture.mapping = CubeRefractionMapping
    this.renderTarget.texture.mapping = CubeReflectionMapping
    this.out = {
      material: new MeshBasicMaterial({ color: 0xffffff, envMap: this.renderTarget.texture })
    }
    this.scene.add(this.plane)
  }
  render () {
    let camera = this.camera
    let renderer = this.renderer
    let scene = this.scene
    // let renderTarget = this.renderTarget
    // var generateMipmaps = renderTarget.texture.generateMipmaps
    // renderTarget.texture.generateMipmaps = false

    renderer.setRenderTarget(this.renderTargetPlane)
    renderer.render(scene, camera)

    renderer.setRenderTarget(null)
  }
}
