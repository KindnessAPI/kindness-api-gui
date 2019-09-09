<template>
  <div></div>
</template>

<script>
import * as THREE from 'three'

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
      let dots = Math.pow(512 * 512, 0.5)
      console.log(dots)
      let rowMax = 512
      let colMax = 512
      let total = rowMax * colMax

      let makePos = () => {
        let stride3 = 3
        var ARR_VAL = []
        let vIDX = 0
        for (var col = 0; col < colMax; col++) {
          for (var row = 0; row < rowMax; row++) {
            // angle = 0.1 * vIDX
            // let x = (1 + 10) * Math.cos(angle)
            // let y = (1 + 10) * Math.sin(angle)
            let cos = Math.cos
            let sin = Math.sin
            let PI = Math.PI

            let k = 4
            let t = (vIDX / total) * (2 * PI)
            let x = 30 * cos(k * t) * cos(t)
            let y = 30 * cos(k * t) * sin(t)

            ARR_VAL[stride3 * vIDX + 0] = x
            ARR_VAL[stride3 * vIDX + 1] = y
            ARR_VAL[stride3 * vIDX + 2] = 0.0

            vIDX++
          }
        }
        geo.addAttribute('position', new THREE.BufferAttribute(new Float32Array(ARR_VAL), 3))
      }
      makePos()

      let makePt = () => {
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
      makePt()

      this.uniforms = {
        time: { value: 0 }
      }

      let mat = new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: `

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

          attribute vec3 meta;

          varying vec3 vPos;
          varying vec3 vNormal;

          uniform float time;

          void main (void) {
            float vIDX = meta.x;
            float total = meta.y;

            float pi = 3.14159265;
            float k = 0.8;

            float t = (vIDX / total) * (10.0 * pi);
            float x = 30.0 * cos(k * t) * cos(t);
            float y = 30.0 * cos(k * t) * sin(t);

            vec3 nPos = position;
            nPos.x = x;
            nPos.y = y;
            nPos.z = noise(nPos * 0.1 + time) * 2.0;

            vPos = nPos;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(nPos, 1.0);
            gl_PointSize = 20.0;
          }
        `,
        fragmentShader: `
          // ---------------------------------------
          // Main Code
          // ---------------------------------------

          uniform float time;
          varying vec3 vPos;
          varying vec3 vNormal;
          void main (void) {
            float d = length(gl_PointCoord.xy - 0.5);
            if (d < 0.5) {
              vec3 particlePosition = vPos;

              vec4 particleColor = vec4(vec3(1.0, 1.0, 1.0), 1.0);
              vec4 lightColor = vec4(0.0, 0.0, abs(sin(time)), 0.5);
              vec3 lightPosition = vec3(0.0, 0.0, sin(time) * 100.0);
              float lightStrength = 100.0;

              float distanceToLightSource = 1.0 / distance(particlePosition, lightPosition);
              vec4 lighterColor = lightColor * distanceToLightSource * lightStrength;

              gl_FragColor = lighterColor;
            } else {
              discard;
            }
          }
        `
      })
      let points = new THREE.Points(geo, mat)
      // this.engine.scene.background = new THREE.Color('#000000')

      this.engine.scene.add(points)
      this.clean = () => {
        this.engine.scene.remove(points)
      }

      this.engine.execStack.flower = () => {
        this.uniforms.time.value = window.performance.now() * 0.001
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
