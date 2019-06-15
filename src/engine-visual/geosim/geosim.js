import * as THREE from 'three'
import GPUComputationRenderer from './gpgpu.js'

let glsl = x => x[0]

let simulateVelocity = glsl`
  uniform sampler2D index;
  uniform float time;
  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 VEL = texture2D(textureVelocity, uv);

    vec4 IDX = texture2D(index, uv);
    vec4 pos = vec4(0.0);

    pos.x = (IDX.x - IDX.z * 0.5) / IDX.z;
    pos.y = (IDX.y - IDX.z * 0.5) / IDX.z;

    pos.x *= 200.0;
    pos.y *= 200.0;

    pos.z += sin(pos.y * 0.1 + time) * 25.0;
    pos.z += sin(pos.x * 0.1 + time) * 25.0;

    gl_FragColor = vec4(pos.xyz, 1.0);
  }
`

let simulatePosition = glsl`
  uniform sampler2D index;
  uniform float time;
  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 VEL = texture2D(textureVelocity, uv);

    vec4 IDX = texture2D(index, uv);
    vec4 pos = vec4(0.0);

    pos.x = (IDX.x - IDX.z * 0.5) / IDX.z;
    pos.y = (IDX.y - IDX.z * 0.5) / IDX.z;

    pos.x *= 200.0;
    pos.y *= 200.0;

    pos.z += sin(pos.y * 0.1 + time) * 25.0;
    pos.z += sin(pos.x * 0.1 + time) * 25.0;

    pos.xyz += VEL.xyz;

    gl_FragColor = vec4(pos.xyz, 1.0);
  }
`

export const makeAPI = ({ renderer, scene }) => {
  let api = {
    render () {}
  }
  let WIDTH = 1024
  var gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)
  var pos0 = gpuCompute.createTexture()
  var vel0 = gpuCompute.createTexture()
  let idx0 = gpuCompute.createTexture()

  console.log(idx0)

  var velVar = gpuCompute.addVariable('textureVelocity', simulateVelocity, pos0)
  var posVar = gpuCompute.addVariable('texturePosition', simulatePosition, vel0)

  // Add variable dependencies
  gpuCompute.setVariableDependencies(velVar, [ velVar, posVar ])
  gpuCompute.setVariableDependencies(posVar, [ velVar, posVar ])

  // Add custom uniforms
  posVar.material.uniforms.time = { value: 0.0 }
  posVar.material.uniforms.index = { value: idx0 }

  velVar.material.uniforms.time = { value: 0.0 }
  velVar.material.uniforms.index = { value: idx0 }

  // Check for completeness
  var error = gpuCompute.init()
  if (error !== null) {
    console.error(error)
  }

  let geo = new THREE.BufferGeometry()
  let processIndex = ({ indexAtrribute = [], indexTexture = [], uv = [] }) => {
    var na = 0
    var n4 = 0
    var uvi = 0
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        uv[uvi + 0] = i / WIDTH
        uv[uvi + 1] = j / WIDTH

        indexAtrribute[na + 0] = i
        indexAtrribute[na + 1] = j
        indexAtrribute[na + 2] = WIDTH

        indexTexture[n4 + 0] = i
        indexTexture[n4 + 1] = j
        indexTexture[n4 + 2] = WIDTH
        indexTexture[n4 + 3] = 1

        uvi += 2
        na += 3
        n4 += 4
      }
    }

    return {
      uv,
      indexAtrribute,
      indexTexture
    }
  }

  let IDX = processIndex({ indexAtrribute: [], indexTexture: idx0.image.data })
  idx0.needsUpdate = true

  let getPosition = () => {
    let newArr = []
    var na = 0
    // let W5 = WIDTH * 0.5
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        newArr[na + 0] = 0 // (i - W5)
        newArr[na + 1] = 0 // (j - W5)
        newArr[na + 2] = 0
        na += 3
      }
    }
    return newArr
  }

  geo.addAttribute('position', new THREE.Float32BufferAttribute(getPosition(), 3))
  geo.addAttribute('uv', new THREE.Float32BufferAttribute(IDX.uv, 2))
  geo.addAttribute('indexer', new THREE.Float32BufferAttribute(IDX.indexAtrribute, 3))

  var uniforms = {
    solidColor: { value: new THREE.Color(`#ff0000`) },
    time: { value: 0 },
    tPos: { value: null }
  }
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    defines: {
      resolution: `vec2(${WIDTH.toFixed(1)}, ${WIDTH.toFixed(1)})`
    },
    vertexShader: glsl`
      uniform sampler2D tPos;
      void main () {
        vec4 posTex = texture2D(tPos, uv);
        gl_PointSize = 1.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( posTex.xyz, 1.0 );
      }
    `,
    fragmentShader: glsl`
      uniform vec3 solidColor;
      void main (void) {
        gl_FragColor = vec4(solidColor, 0.7);
      }
    `,
    side: THREE.DoubleSide
  })
  let mesh = new THREE.Points(geo, material)
  scene.add(mesh)

  api.render = () => {
    // Update texture uniforms in your visualization materials with the gpu renderer output
    material.uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    let time = window.performance.now() * 0.001
    posVar.material.uniforms.time.value = time
    velVar.material.uniforms.time.value = time
    gpuCompute.compute()
  }

  api.clean = () => {
    scene.remove(mesh)
  }

  return api
}
