<template>
  <div></div>
</template>

<script>
import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/examples/jsm/misc/GPUComputationRenderer.js'

export default {
  props: {
    textpad: {},
    engine: {}
  },
  data () {
    return {
      uniforms: {}
    }
  },
  methods: {
    setup () {
      this.setupGraphics()
    },
    setupGraphics () {
      let geo = new THREE.BufferGeometry()
      let rowMax = 256
      let colMax = 256
      let total = rowMax * colMax

      let vel0GLSL = `
        // ---------------------------------------
        // Gravity
        // ---------------------------------------

        float constrain(float val, float min, float max) {
            if (val < min) {
                return min;
            } else if (val > max) {
                return max;
            } else {
                return val;
            }
        }

        vec3 getDiff (in vec3 lastPos, in vec3 mousePos) {
          vec3 diff = lastPos.xyz / 33.3 - mousePos;
          float distance = constrain(length(diff), 5.0, 100.0);
          float strength = 0.35 / (distance * distance);

          diff = normalize(diff);
          // delta
          diff = diff * strength * -2.0;
          // diff = diff * strength * (-20.83) * (1.0 / delta) * 0.0183;

          return diff;
        }

        // ---------------------------------------
        // Perlin Noise
        // ---------------------------------------
        float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
        vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

        float noise (vec3 p) {
          vec3 a = floor(p);
          vec3 d = p - a;
          d = d * d * (3.0 - 2.0 * d);

          vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
          vec4 k1 = perm(b.xyxy);
          vec4 k2 = perm(k1.xyxy + b.zzww);

          vec4 c = k2 + a.zzzz;
          vec4 k3 = perm(c);
          vec4 k4 = perm(c + 1.0);

          vec4 o1 = fract(k3 * (1.0 / 41.0));
          vec4 o2 = fract(k4 * (1.0 / 41.0));
          vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
          vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
          return o4.y * d.y + o4.x * (1.0 - d.y);
        }

        // ---------------------------------------
        // Main Code
        // ---------------------------------------
        precision highp sampler2D;
        uniform float time;
        uniform sampler2D meta0;

        void main (void) {
          vec2 uv = gl_FragCoord.xy / resolution.xy;
          vec4 posdata = texture2D(t_pos0, uv);
          vec4 veldata = texture2D(t_vel0, uv);

          vec4 metadata = texture2D(meta0, uv);
          float vIDX = metadata.x;
          float total = metadata.y;

          float tt = floor(time * 0.5);
          float pi = 3.14159265;
          float k = 0.4;

          k += tt * 0.2;
          k = mod(k, 3.0);

          float t = (vIDX / total) * (20.0 * pi);
          float x = 30.0 * cos(k * t) * cos(t + time);
          float y = 30.0 * cos(k * t) * sin(t + time);

          vec3 vel = (vec3(x, y, 0.5) - posdata.xyz) * 0.1;

          gl_FragColor = vec4(vel.xyz, 1.0);
        }
      `

      let pos0GLSL = `
        // ---------------------------------------
        // Main Code
        // ---------------------------------------
        precision highp sampler2D;
        uniform float time;
        uniform sampler2D meta0;

        void main (void) {
          vec2 uv = gl_FragCoord.xy / resolution.xy;

          vec4 posdata = texture2D(t_pos0, uv);
          vec4 veldata = texture2D(t_vel0, uv);

          if (posdata.a == 0.0) {
            vec4 metadata = texture2D(meta0, uv);
            float vIDX = metadata.x;
            float total = metadata.y;

            float tt = time;
            float pi = 3.14159265;
            float k = 0.0;

            float t = (vIDX / total) * (10.0 * pi);
            float x = 30.0 * cos(k * t) * cos(t);
            float y = 30.0 * cos(k * t) * sin(t);
            posdata.x = x;
            posdata.y = y;
          }

          gl_FragColor = vec4(posdata.xyz + veldata.xyz, 1.0);
        }
      `

      let gpuCompute = new GPUComputationRenderer(rowMax, colMax, this.engine.renderer)
      let pos0 = gpuCompute.createTexture()
      let vel0 = gpuCompute.createTexture()
      let meta0 = gpuCompute.createTexture()
      let posVar = gpuCompute.addVariable('t_pos0', pos0GLSL, pos0)
      let velVar = gpuCompute.addVariable('t_vel0', vel0GLSL, vel0)
      gpuCompute.setVariableDependencies(posVar, [posVar, velVar])
      gpuCompute.setVariableDependencies(velVar, [velVar, posVar])

      velVar.material.uniforms.time = { value: 0.0 }
      velVar.material.uniforms.meta0 = { value: meta0 }

      posVar.material.uniforms.time = { value: 0.0 }
      posVar.material.uniforms.meta0 = { value: meta0 }

      // Check for completeness
      let error = gpuCompute.init()
      if (error !== null) {
        console.error(error)
      }

      let makeMetaTex = () => {
        let stride4 = 4
        var ARR_VAL = meta0.image.data
        let vIDX = 0
        for (var col = 0; col < colMax; col++) {
          for (var row = 0; row < rowMax; row++) {
            ARR_VAL[stride4 * vIDX + 0] = vIDX
            ARR_VAL[stride4 * vIDX + 1] = total
            ARR_VAL[stride4 * vIDX + 2] = 0
            ARR_VAL[stride4 * vIDX + 3] = 0

            vIDX++
          }
        }
      }
      makeMetaTex()

      let makePosAttr = () => {
        let stride3 = 3
        var ARR_VAL = []
        let vIDX = 0
        for (var col = 0; col < colMax; col++) {
          for (var row = 0; row < rowMax; row++) {
            ARR_VAL[stride3 * vIDX + 0] = 0
            ARR_VAL[stride3 * vIDX + 1] = 0
            ARR_VAL[stride3 * vIDX + 2] = 0.0

            vIDX++
          }
        }
        geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARR_VAL), 3))
      }
      makePosAttr()

      let makeUVAttr = () => {
        let stride2 = 2
        var ARR_VAL = []
        let vIDX = 0
        for (var col = 0; col < colMax; col++) {
          for (var row = 0; row < rowMax; row++) {
            ARR_VAL[stride2 * vIDX + 0] = row / rowMax
            ARR_VAL[stride2 * vIDX + 1] = col / colMax

            vIDX++
          }
        }
        geo.addAttribute('uv', new THREE.BufferAttribute(new Float32Array(ARR_VAL), 2))
      }
      makeUVAttr()

      let makeMetaAttr = () => {
        let stride4 = 4
        var ARR_VAL = []
        let vIDX = 0
        for (var col = 0; col < colMax; col++) {
          for (var row = 0; row < rowMax; row++) {
            ARR_VAL[stride4 * vIDX + 0] = vIDX
            ARR_VAL[stride4 * vIDX + 1] = total
            ARR_VAL[stride4 * vIDX + 2] = 0
            ARR_VAL[stride4 * vIDX + 3] = 0

            vIDX++
          }
        }
        geo.addAttribute('meta', new THREE.BufferAttribute(new Float32Array(ARR_VAL), 4))
      }
      makeMetaAttr()

      this.uniforms = {
        time: { value: 0 },
        pos0: { value: null },
        vel0: { value: null }
      }

      let mat = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `
          // ---------------------------------------
          // Main Code
          // ---------------------------------------
          precision highp sampler2D;
          #include <common>

          attribute vec3 meta;

          varying vec2 vUv;
          varying vec3 vPos;

          uniform sampler2D pos0;
          uniform sampler2D vel0;

          uniform float time;

          void main (void) {
            vUv = uv;

            vec4 pos0data = texture2D(pos0, uv);
            vec4 vel0data = texture2D(vel0, uv);

            vec3 nPos = pos0data.xyz;

            vPos = nPos;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos.xyz, 1.0);
            gl_PointSize = 5.0;
          }
        `,
        fragmentShader: `
          #include <common>
          // ---------------------------------------
          // Main Code
          // ---------------------------------------
          precision highp sampler2D;

          uniform float time;
          varying vec2 vUv;
          varying vec3 vPos;

          uniform sampler2D vel0;

          void main (void) {
            float d = length(gl_PointCoord.xy - 0.5);
            if (d < 0.5) {
              vec3 particlePosition = vPos;

              vec4 vel0data = texture2D(vel0, vUv);

              vec4 particleColor = vec4(vec3(1.0, 1.0, 1.0), 1.0);
              vec4 lightColor = vec4(abs(vel0data.xyz), 1.0);
              vec3 lightPosition = vec3(0.0, 0.0, sin(time) * 100.0);
              float lightStrength = 100.0;

              float distanceToLightSource = 1.0 / distance(particlePosition, lightPosition);
              vec4 lighterColor = lightColor * distanceToLightSource * lightStrength;
              lighterColor.a = 0.5;
              gl_FragColor = lighterColor;
            } else {
              discard;
            }
          }
        `
      })

      let points = new THREE.Points(geo, mat)
      this.engine.scene.background = new THREE.Color('#aaaaaa')

      this.engine.scene.add(points)
      this.clean = () => {
        this.engine.scene.remove(points)
      }

      this.engine.execStack.flower = () => {
        gpuCompute.compute()

        let pos0tex = gpuCompute.getCurrentRenderTarget(posVar).texture
        this.uniforms.pos0.value = pos0tex
        let vel0tex = gpuCompute.getCurrentRenderTarget(velVar).texture
        this.uniforms.vel0.value = vel0tex

        let time = window.performance.now() * 0.001
        this.uniforms.time.value = time
        posVar.material.uniforms.time.value = time
        velVar.material.uniforms.time.value = time
      }
    }
  },
  mounted () {
    this.setup()
  },
  beforeDestroy () {
    this.clean()
    this.engine.execStack.flower = () => {
    }
  }
}
</script>

<style>

</style>
