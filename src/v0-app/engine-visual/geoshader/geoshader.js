// import * as THREE from 'three'
// import GPUComputationRenderer from './gpgpu.js'

var THREE = {
  ...require('three'),
  ...require('three/examples/jsm/misc/GPUComputationRenderer.js')
}

let glsl = v => v[0]

let displayVert = glsl`
#include <common>
  uniform sampler2D tPos;
  uniform sampler2D tIdx;
  uniform sampler2D tAudio;

  varying vec3 v_tt;
  varying vec3 v_audio;

  void main() {
    // vec3 newPos = vec3(1.0);

    // position is changed to host uv vals
    vec4 tt = texture2D(tPos, position.xy);
    vec4 idx = texture2D(tIdx, position.xy);
    float squareIDX = idx.y;
    float totalSquares = idx.z;

    vec2 audioTextureDimension = vec2(
      totalSquares * 2.0,
      1.0
    );
    vec2 audioUV = vec2(mod(squareIDX, audioTextureDimension.x), 0.0) / audioTextureDimension;
    vec4 audioInfo = texture2D(tAudio, audioUV);

    v_audio = vec3(
      audioInfo.r,
      audioUV.x,
      0
    );

    v_tt = normalize(tt.xyz);

    vec4 mvPosition = modelViewMatrix * tt;
    vec4 outputPos = projectionMatrix * mvPosition;

    gl_Position = outputPos;
  }

`

let displayFrag = glsl`
#include <common>

  varying vec3 v_tt;
  varying vec3 v_audio;

  uniform float time;

  void main() {
    gl_FragColor = vec4(
      abs(v_tt.x * 1.0) + abs((v_tt.x)) + abs(v_audio.y),
      abs(v_tt.y * 1.0) + abs((v_tt.x)) + abs(v_audio.z),
      abs(v_tt.z * 1.0) + abs((v_tt.y)) + abs(v_audio.x),
      0.6
    );
  }
`

let tPos = glsl`
uniform float time;
uniform sampler2D tIdx;

mat3 rotateX(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c, s,
        0.0, -s, c
    );
}

mat3 rotateY(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, 0.0, -s,
        0.0, 1.0, 0.0,
        s, 0.0, c
    );
}

mat3 rotateZ(float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
        c, s, 0.0,
        -s, c, 0.0,
        0.0, 0.0, 1.0
    );
}

void main () {
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 newCell = gl_FragCoord.xy;
  vec2 uv = newCell * cellSize;
  vec4 pos = texture2D(tPos, uv);
  vec4 idx = texture2D(tIdx, uv);

  bool isInvalid = false;

  float vertexIDX = idx.x;
  float squareIDX = idx.y;

  float strips = 100.0;

  float stripX = mod(squareIDX, strips);
  float stripY = floor(squareIDX / 200.0);

  float sX = 0.5;
  float sY = 0.2;
  float k = 1.0;
  float timer = time * 0.3;

  float offsetX = (stripX * 4.0) - strips * 2.0;
  float offsetY = (stripY * 2.0 * sY) - 200.0 * sY;

  if (vertexIDX == 0.0) {
    pos.x = 1.0 * sX + offsetX;
    pos.y = 1.0 * sY + offsetY;
    pos.z = 0.0;
  } else if (vertexIDX == 1.0) {
    pos.x = -1.0 * sX + offsetX;
    pos.y = 1.0 * sY + offsetY;
    pos.z = 0.0;
  } else if (vertexIDX == 2.0) {
    pos.x = -1.0 * sX + offsetX;
    pos.y = -1.0 * sY + offsetY;
    pos.z = 0.0;
  } else if (vertexIDX == 3.0) {
    pos.x = 1.0 * sX + offsetX;
    pos.y = 1.0 * sY + offsetY;
    pos.z = 0.0;
  } else if (vertexIDX == 4.0) {
    pos.x = -1.0 * sX + offsetX;
    pos.y = -1.0 * sY + offsetY;
    pos.z = 0.0;
  } else if (vertexIDX == 5.0) {
    pos.x = 1.0 * sX + offsetX;
    pos.y = -1.0 * sY + offsetY;
    pos.z = 0.0;
  } else {
    isInvalid = true;
  }

  pos.x = pos.x + sin(time + pos.y * 0.3) * 3.0;

  pos.z += sin(time + cos(time * 0.1) * pos.x * 0.3) * 3.0;
  pos.z += sin(time + cos(time * 0.1) * pos.y * 0.3) * 3.0;

  if (isInvalid) {
    pos.w = 0.0;
  } else {
    pos.w = 1.0;
  }

  gl_FragColor = pos;
}
`

export const makeAPI = ({ renderer, scene }) => {
  let api = {
    render () {}
  }

  var WIDTH = 1024
  var gpuCompute = new THREE.GPUComputationRenderer(WIDTH, WIDTH, renderer)

  // ----- simulation pass ---------
  var posIdx = gpuCompute.createTexture()
  var slot = posIdx.image.data
  var p = 0
  for (var j = 0; j < WIDTH; j++) {
    for (var i = 0; i < WIDTH; i++) {
      let id = p / 4
      slot[p + 0] = id % 6 // square 1 / 6 index
      slot[p + 1] = Math.floor(id / 6) // square
      slot[p + 2] = (WIDTH * WIDTH) / 6.0 // total
      slot[p + 3] = id
      p += 4
    }
  }

  var posDynamic = gpuCompute.createTexture()
  var posVar = gpuCompute.addVariable('tPos', tPos, posDynamic)
  posVar.material.uniforms.tAudio = { value: null }
  posVar.material.uniforms.tIdx = { value: posIdx }
  posVar.material.uniforms.time = { value: 0 }
  gpuCompute.setVariableDependencies(posVar, [ posVar ])

  var error = gpuCompute.init()
  if (error !== null) {
    console.error(error)
  }

  // ------------- display pass ----------

  var geo = new THREE.BufferGeometry()
  let getUVInfo = () => {
    let newArr = []
    var na = 0
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        newArr[na + 0] = i / WIDTH
        newArr[na + 1] = j / WIDTH
        newArr[na + 2] = 0
        na += 3
      }
    }
    return newArr
  }

  geo.addAttribute('position', new THREE.Float32BufferAttribute(getUVInfo(), 3))
  geo.addAttribute('posIdx', new THREE.Float32BufferAttribute(posIdx.image.data, 4))

  var uniforms = {
    time: { value: 0 },
    tPos: { value: null },
    tIdx: { value: null }
  }
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    defines: {
      resolution: `vec2(${renderer.domElement.width.toFixed(1)}, ${renderer.domElement.height.toFixed(1)})`
    },
    vertexShader: displayVert,
    fragmentShader: displayFrag,
    side: THREE.DoubleSide
  })

  var mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  api.render = () => {
    posVar.material.uniforms.time.value = window.performance.now() * 0.001
    uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    uniforms.tIdx.value = posIdx

    uniforms.time.value = window.performance.now() * 0.001
    gpuCompute.compute()
  }

  return api
}
