import * as THREE from 'three'
import GPUComputationRenderer from './gpgpu.js'

let glsl = x => x[0]

let simulatePosition = glsl`
  /*
    LIBRARY
  */
  #include <common>

  mat3 rotateX (float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, s,
      0.0, -s, c
    );
  }

  mat3 rotateY (float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }

  mat3 rotateZ (float rad) {
    float c = cos(rad);
    float s = sin(rad);
    return mat3(
      c, s, 0.0,
      -s, c, 0.0,
      0.0, 0.0, 1.0
    );
  }

  mat3 rotateQ (vec3 axis, float rad) {
    float hr = rad / 2.0;
    float s = sin( hr );
    vec4 q = vec4(axis * s, cos( hr ));
    vec3 q2 = q.xyz + q.xyz;
    vec3 qq2 = q.xyz * q2;
    vec2 qx = q.xx * q2.yz;
    float qy = q.y * q2.z;
    vec3 qw = q.w * q2.xyz;

    return mat3(
      1.0 - (qq2.y + qq2.z),  qx.x - qw.z,            qx.y + qw.y,
      qx.x + qw.z,            1.0 - (qq2.x + qq2.z),  qy - qw.x,
      qx.y - qw.y,            qy + qw.x,              1.0 - (qq2.x + qq2.y)
    );
  }

  /*
    Position Main Code
  */
  precision highp sampler2D;
  uniform sampler2D meta0;
  uniform float time;

  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 LAST_POS = texture2D(texturePosition, uv);
    vec4 META0 = texture2D(meta0, uv);
    vec4 pos = vec4(0.0);

    float vertexIDX = META0.x;
    float squareIDX = META0.y;
    float totalSquares = META0.z;
    float pointIDX = META0.w;

    /*
      Assemble
    */
    vec3 plane = vec3(0.6, 0.3, 0.0);
    bool isInvalid = false;
    if (vertexIDX == 0.0) {
      pos.x = 1.0 * plane.x;
      pos.y = 1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else if (vertexIDX == 1.0) {
      pos.x = -1.0 * plane.x;
      pos.y = 1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else if (vertexIDX == 2.0) {
      pos.x = -1.0 * plane.x;
      pos.y = -1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else if (vertexIDX == 3.0) {
      pos.x = 1.0 * plane.x;
      pos.y = 1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else if (vertexIDX == 4.0) {
      pos.x = -1.0 * plane.x;
      pos.y = -1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else if (vertexIDX == 5.0) {
      pos.x = 1.0 * plane.x;
      pos.y = -1.0 * plane.y;
      pos.z = 1.0 * plane.z;
    } else {
      isInvalid = true;
    }

    if (!isInvalid) {
      float dimension = (pow(totalSquares, 0.5));

      vec3 offset = vec3(
        plane.x * 15.25 * (squareIDX / dimension),
        plane.y * 1.0 * (mod(squareIDX, dimension)),
        plane.z * 0.0
      );

      pos.xyz += offset.xyz;

      float pX = pos.x;
      float pY = pos.y;
      float pZ = pos.y;

      float piz = 0.001 * 2.0 * 3.14159265;

      pos.xyz = rotateQ(normalize(vec3(1.0, pZ * piz, 1.0)), time + pX * piz) * rotateY(time + pY * piz) * pos.xyz;
      pos.z += sin(time  + pX * piz * 0.333) * 50.0;

      pos.xyz *= 0.075;

      pos.w = 1.0;
      gl_FragColor = pos;
    } else {
      pos.w = 0.0;
      gl_FragColor = pos;
    }
  }
`

let simulateState = glsl`
  /*
    LIBRARY
  */
  #include <common>

  /*
    Simulation Main Code
  */
  uniform float time;
  uniform sampler2D meta0;
  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    vec4 LAST_COLOR = texture2D(textureColor, uv);
    vec4 META0 = texture2D(meta0, uv);

    float vertexIDX = META0.x;
    float squareIDX = META0.y;
    float totalSquares = META0.z;
    float pointIDX = META0.w;

    float red = uv.x + 0.5;
    float green = uv.y + 0.5;
    float blue = 0.5;

    gl_FragColor = vec4(red, green, blue, 1.0);
  }
`

export const makeAPI = ({ renderer, scene }) => {
  let api = {
    render () {}
  }
  let WIDTH = 1024

  let gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)

  let pos0 = gpuCompute.createTexture()
  let color0 = gpuCompute.createTexture()

  // meta0
  let meta0 = gpuCompute.createTexture()

  let posVar = gpuCompute.addVariable('texturePosition', simulatePosition, pos0)
  let colorVar = gpuCompute.addVariable('textureColor', simulateState, color0)

  // Add variable dependencies
  gpuCompute.setVariableDependencies(posVar, [posVar])
  gpuCompute.setVariableDependencies(colorVar, [colorVar])

  // pos var
  posVar.material.uniforms.time = { value: 0.0 }
  posVar.material.uniforms.meta0 = { value: meta0 }

  // state var
  colorVar.material.uniforms.time = { value: 0.0 }
  colorVar.material.uniforms.meta0 = { value: meta0 }

  // Check for completeness
  let error = gpuCompute.init()
  if (error !== null) {
    console.error(error)
  }

  let geo = new THREE.BufferGeometry()

  let processMeta = () => {
    let iii = 0
    let dimension = Math.pow(WIDTH * WIDTH, 1 / 3)
    let total = dimension * dimension * dimension
    // let dimension05 = dimension / 2

    let ARR_VALUE = meta0.image.data
    for (var ix = 0; ix < dimension; ix++) {
      for (var iy = 0; iy < dimension; iy++) {
        for (var iz = 0; iz < dimension; iz++) {
          // console.log(iii)
          let id = iii / 4

          ARR_VALUE[iii + 0] = id % 6 // square vertex ID
          ARR_VALUE[iii + 1] = Math.floor(id / 6) // square ID
          ARR_VALUE[iii + 2] = total / 6.0 // percentage

          // dot id
          ARR_VALUE[iii + 3] = id // point ID

          iii += 4
        }
      }
    }
  }
  processMeta()

  let getUV = () => {
    let uv = []
    let uvi = 0
    for (var j = 0; j < WIDTH; j++) {
      for (var i = 0; i < WIDTH; i++) {
        uv[uvi + 0] = i / WIDTH
        uv[uvi + 1] = j / WIDTH

        uvi += 2
      }
    }
    return uv
  }

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
  geo.addAttribute('uv', new THREE.Float32BufferAttribute(getUV(), 2))

  var uniforms = {
    time: { value: 0 },
    geoShader: { value: null },
    colorShader: { value: null }
  }

  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    defines: {
      resolution: `vec2(${WIDTH.toFixed(1)}, ${WIDTH.toFixed(1)})`
    },
    vertexShader: glsl`
      precision highp float;
      precision highp sampler2D;

      varying highp vec2 vUv;
      varying highp vec3 vPos;

      uniform sampler2D geoShader;
      void main () {
        vUv = uv;
        vec4 posTex = texture2D(geoShader, uv);
        gl_PointSize = 1.0;
        vPos = posTex.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(posTex.xyz, posTex.w);
      }
    `,
    fragmentShader: glsl`
      precision highp float;
      precision highp sampler2D;

      uniform sampler2D colorShader;
      varying highp vec2 vUv;
      varying highp vec3 vPos;
      void main () {
        vec4 colorVal = texture2D(colorShader, vUv);
        gl_FragColor = vec4(vec3(
          vPos.x / 100.0 * 0.6 + 0.5,
          vPos.y / 100.0 * 0.6 + 0.5,
          vPos.z / 100.0 * 0.6 + 0.5
        ), 0.9);
      }
    `,
    side: THREE.DoubleSide
  })
  let mesh = new THREE.Mesh(geo, material)
  scene.add(mesh)

  scene.background = new THREE.Color('#ffffff')
  api.render = () => {
    // Update texture uniforms in your visualization materials with the gpu renderer output
    material.uniforms.geoShader.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    material.uniforms.colorShader.value = gpuCompute.getCurrentRenderTarget(colorVar).texture

    let time = window.performance.now() * 0.001
    posVar.material.uniforms.time.value = time
    colorVar.material.uniforms.time.value = time
    gpuCompute.compute()
  }

  api.clean = () => {
    scene.remove(mesh)
  }

  return api
}
