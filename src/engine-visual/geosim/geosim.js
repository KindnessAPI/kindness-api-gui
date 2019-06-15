import * as THREE from 'three'
import GPUComputationRenderer from './gpgpu.js'

let glsl = x => x[0]

let simulateVelocity = glsl`
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

  uniform sampler2D index;
  uniform float time;
  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 LAST_POS = texture2D(texturePosition, uv);
    vec4 LAST_VEL = texture2D(textureVelocity, uv);
    vec4 IDX = texture2D(index, uv);

    vec4 out4 = vec4(LAST_VEL);

    out4.xyz += getDiff(LAST_POS.xyz, vec3(0.0));

    gl_FragColor = vec4(out4.xyz, 1.0);
  }
`

let simulatePosition = glsl`
  /*
    LIBRARY
  */
  #include <common>

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

  /*
    MAIN CODE
  */
  uniform sampler2D index;
  uniform float time;
  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 LAST_POS = texture2D(texturePosition, uv);
    vec4 LAST_VEL = texture2D(textureVelocity, uv);
    vec4 IDX = texture2D(index, uv);
    float isDone = 0.0;

    vec4 out4 = vec4(LAST_POS);

    if (out4.w == 0.0) {
      out4.x = (IDX.x - IDX.z * 0.5) / IDX.z;
      out4.y = (IDX.y - IDX.z * 0.5) / IDX.z;

      out4.x *= 200.0;
      out4.y *= 200.0;

      out4.w = 1.0;
    }

    // out4.z += sin(out4.y * 0.1 + time) * 25.0;
    // out4.z += sin(out4.x * 0.1 + time) * 25.0;

    out4.xyz += LAST_VEL.xyz;

    out4.xyz = rotateY(0.025) * out4.xyz;
    out4.xyz = rotateX(0.025) * out4.xyz;
    out4.xyz = rotateZ(0.025) * out4.xyz;

    gl_FragColor = out4;
  }
`

export const makeAPI = ({ renderer, scene }) => {
  let api = {
    render () {}
  }
  let WIDTH = 512
  var gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)
  var pos0 = gpuCompute.createTexture()
  var vel0 = gpuCompute.createTexture()
  let idx0 = gpuCompute.createTexture()

  // console.log(idx0)

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
  geo.addAttribute('lookupIndex', new THREE.Float32BufferAttribute(IDX.indexAtrribute, 3))

  var uniforms = {
    solidColor: { value: new THREE.Color(`#ff00ff`) },
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
      /*
        Baller
      */

      #define M_PI 3.1415926535897932384626433832795
      float atan2(in float y, in float x) {
        bool xgty = (abs(x) > abs(y));
        return mix(M_PI/2.0 - atan(x,y), atan(y,x), float(xgty));
      }

      vec3 fromBall(float r, float az, float el) {
        return vec3(
          r * cos(el) * cos(az),
          r * cos(el) * sin(az),
          r * sin(el)
        );
      }

      void toBall(vec3 pos, out float az, out float el) {
        az = atan2(pos.y, pos.x);
        el = atan2(pos.z, sqrt(pos.x * pos.x + pos.y * pos.y));
      }

      // float az = 0.0;
      // float el = 0.0;
      // vec3 noiser = vec3(lastVel);
      // toBall(noiser, az, el);
      // lastVel.xyz = fromBall(1.0, az, el);

      uniform sampler2D tPos;
      void main () {
        vec4 posTex = texture2D(tPos, uv);
        // posTex.xyz

        // gl_PointSize = 1.0;
        // float az = 0.0;
        // float el = 0.0;
        // vec3 noiser = vec3(posTex.xyz);
        // toBall(noiser, az, el);
        // vec3 nPos = fromBall(100.0, az, el);

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
