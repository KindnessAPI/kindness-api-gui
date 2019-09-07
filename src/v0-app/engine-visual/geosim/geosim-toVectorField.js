import * as THREE from 'three'
import GPUComputationRenderer from './gpgpu.js'

let glsl = x => x[0]

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
  Perlin Noise
  */
  //
  // Classic Perlin 3D Noise
  // by Stefan Gustavson
  //
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

  float cnoise(vec3 P){
    vec3 Pi0 = floor(P); // Integer part for indexing
    vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
    Pi0 = mod(Pi0, 289.0);
    Pi1 = mod(Pi1, 289.0);
    vec3 Pf0 = fract(P); // Fractional part for interpolation
    vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
    vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
    vec4 iy = vec4(Pi0.yy, Pi1.yy);
    vec4 iz0 = Pi0.zzzz;
    vec4 iz1 = Pi1.zzzz;

    vec4 ixy = permute(permute(ix) + iy);
    vec4 ixy0 = permute(ixy + iz0);
    vec4 ixy1 = permute(ixy + iz1);

    vec4 gx0 = ixy0 / 7.0;
    vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
    gx0 = fract(gx0);
    vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
    vec4 sz0 = step(gz0, vec4(0.0));
    gx0 -= sz0 * (step(0.0, gx0) - 0.5);
    gy0 -= sz0 * (step(0.0, gy0) - 0.5);

    vec4 gx1 = ixy1 / 7.0;
    vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
    gx1 = fract(gx1);
    vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
    vec4 sz1 = step(gz1, vec4(0.0));
    gx1 -= sz1 * (step(0.0, gx1) - 0.5);
    gy1 -= sz1 * (step(0.0, gy1) - 0.5);

    vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
    vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
    vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
    vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
    vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
    vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
    vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
    vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

    vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
    g000 *= norm0.x;
    g010 *= norm0.y;
    g100 *= norm0.z;
    g110 *= norm0.w;
    vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
    g001 *= norm1.x;
    g011 *= norm1.y;
    g101 *= norm1.z;
    g111 *= norm1.w;

    float n000 = dot(g000, Pf0);
    float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
    float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
    float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
    float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
    float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
    float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
    float n111 = dot(g111, Pf1);

    vec3 fade_xyz = fade(Pf0);
    vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
    vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
    float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
    return 2.2 * n_xyz;
  }

  /*
    toBall
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


  /*
  Random Pattern
  */
 float random (in vec2 _st) {
      return fract(sin(dot(_st.xy,
        vec2(12.9898,78.233)))*
        43758.5453123);
  }

  /*
  */
  // Based on Morgan McGuire @morgan3d
  // https://www.shadertoy.com/view/4dS3Wd
  float noise (in vec2 _st) {
      vec2 i = floor(_st);
      vec2 f = fract(_st);

      // Four corners in 2D of a tile
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
              (c - a)* u.y * (1.0 - u.x) +
              (d - b) * u.x * u.y;
  }

  /*
    Pattern
  */
  #define NUM_OCTAVES 5
  float fbm ( in vec2 _st) {
      float v = 0.0;
      float a = 0.5;
      vec2 shift = vec2(100.0);
      // Rotate to reduce axial bias
      mat2 rot = mat2(cos(0.5), sin(0.5),
                      -sin(0.5), cos(0.50));
      for (int i = 0; i < NUM_OCTAVES; ++i) {
          v += a * noise(_st);
          _st = rot * _st * 2.0 + shift;
          a *= 0.5;
      }
      return v;
  }

  float pattern( in vec2 p )
  {
      vec2 q = vec2( fbm( p + vec2(0.0,0.0) ),
                      fbm( p + vec2(5.2,1.3) ) );

      vec2 r = vec2( fbm( p + 4.0*q + vec2(1.7,9.2) ),
                      fbm( p + 4.0*q + vec2(8.3,2.8) ) );

      return fbm( p + 4.0*r );
  }

  /*
    Position Main Code
  */
  uniform sampler2D dimension3;
  uniform sampler2D meta0;
  uniform float time;

  // idx = 0.0 ~ 1.0 of xyz
  // position = -0.5 ~ 0.5 of xyz
  vec3 toVectorField (vec3 currentPosition, vec3 idx, vec3 position) {
    vec3 finalPt = currentPosition;

    finalPt.x += sin(finalPt.y * 0.01);
    finalPt.y -= sin(finalPt.x * 0.01);

    return finalPt;
  }

  void main (void) {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 LAST_POS = texture2D(texturePosition, uv);
    vec4 LAST_STATE = texture2D(textureState, uv);
    vec4 D3 = texture2D(dimension3, uv);
    vec4 META0 = texture2D(meta0, uv);

    bool needReset = LAST_STATE.x == 0.0;

    // output
    vec4 out4 = vec4(LAST_POS);

    if (needReset) {
      out4.xyz = D3.xyz * 300.0;
      out4.xyz = toVectorField(out4.xyz, META0.xyz, D3.xyz);
    } else {
      out4.xyz = toVectorField(out4.xyz, META0.xyz, D3.xyz);
    }

    gl_FragColor = out4;
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
    vec4 LAST_STATE = texture2D(textureState, uv);

    vec4 META0 = texture2D(meta0, uv);
    float dotID = META0.x;

    float curentAge = LAST_STATE.x;

    float maxAge = 1.0;

    float agingRate = 0.00001;

    // aging ....
    curentAge += agingRate;

    if (curentAge >= maxAge) {
      curentAge = 0.0;
    }

    gl_FragColor = vec4(curentAge, agingRate, 0.0, 1.0);
  }
`

export const makeAPI = ({ renderer, scene }) => {
  let api = {
    render () {}
  }
  let WIDTH = 1024

  let gpuCompute = new GPUComputationRenderer(WIDTH, WIDTH, renderer)

  let pos0 = gpuCompute.createTexture()
  let d3Offset0 = gpuCompute.createTexture()
  let meta0 = gpuCompute.createTexture()
  let state0 = gpuCompute.createTexture()

  let posVar = gpuCompute.addVariable('texturePosition', simulatePosition, pos0)
  let stateVar = gpuCompute.addVariable('textureState', simulateState, state0)

  // Add variable dependencies
  gpuCompute.setVariableDependencies(posVar, [ posVar, stateVar ])
  gpuCompute.setVariableDependencies(stateVar, [ stateVar, posVar ])

  // pos var
  posVar.material.uniforms.time = { value: 0.0 }
  posVar.material.uniforms.dimension3 = { value: d3Offset0 }
  posVar.material.uniforms.meta0 = { value: meta0 }

  posVar.material.defines.WIDTH = `${WIDTH.toFixed(0)}`

  // state var
  stateVar.material.uniforms.time = { value: 0.0 }
  stateVar.material.uniforms.meta0 = { value: meta0 }

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

    let metaArr = meta0.image.data
    for (var ix = 0; ix < dimension; ix++) {
      for (var iy = 0; iy < dimension; iy++) {
        for (var iz = 0; iz < dimension; iz++) {
          // console.log(iii)
          let id = iii / 4

          metaArr[iii + 0] = ix / dimension
          metaArr[iii + 1] = iy / dimension
          metaArr[iii + 2] = iz / dimension

          // dot id
          metaArr[iii + 3] = id / total

          iii += 4
        }
      }
    }
  }
  processMeta()

  let processLayoutTexture = () => {
    let D3 = d3Offset0.image.data
    let iii = 0
    let dimension = Math.pow(WIDTH * WIDTH, 1 / 3)
    let dimension05 = dimension / 2

    for (var ix = 0; ix < dimension; ix++) {
      for (var iy = 0; iy < dimension; iy++) {
        for (var iz = 0; iz < dimension; iz++) {
          // console.log(iii)
          let id = iii / 4

          D3[iii + 0] = (ix - dimension05) / dimension
          D3[iii + 1] = (iy - dimension05) / dimension
          D3[iii + 2] = (iz - dimension05) / dimension
          D3[iii + 3] = id
          iii += 4
        }
      }
    }
  }
  processLayoutTexture()

  let processStateTexture = () => {
    let D3 = state0.image.data
    let iii = 0
    let dimension = Math.pow(WIDTH * WIDTH, 1 / 3)

    for (var ix = 0; ix < dimension; ix++) {
      for (var iy = 0; iy < dimension; iy++) {
        for (var iz = 0; iz < dimension; iz++) {
          // console.log(iii)
          D3[iii + 0] = 1.0
          D3[iii + 1] = 1.0
          D3[iii + 2] = 1.0
          D3[iii + 3] = 1.0
          iii += 4
        }
      }
    }
  }
  processStateTexture()

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
    solidColor: { value: new THREE.Color(`#000000`) },
    time: { value: 0 },
    tPos: { value: null },
    state0: { value: null }
  }
  var material = new THREE.ShaderMaterial({
    transparent: true,
    uniforms,
    defines: {
      resolution: `vec2(${WIDTH.toFixed(1)}, ${WIDTH.toFixed(1)})`
    },
    vertexShader: glsl`
      varying vec2 vUv;
      uniform sampler2D tPos;
      void main () {
        vec4 posTex = texture2D(tPos, uv);
        gl_PointSize = 1.0;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( posTex.xyz, 1.0 );
      }
    `,
    fragmentShader: glsl`
      uniform vec3 solidColor;
      uniform sampler2D state0;
      varying vec2 vUv;
      void main (void) {
        vec4 stateTexture = texture2D(state0, vUv);

        gl_FragColor = vec4(solidColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  })
  let mesh = new THREE.Points(geo, material)
  scene.add(mesh)

  scene.background = new THREE.Color('#ffffff')
  api.render = () => {
    // Update texture uniforms in your visualization materials with the gpu renderer output
    material.uniforms.tPos.value = gpuCompute.getCurrentRenderTarget(posVar).texture
    material.uniforms.state0.value = gpuCompute.getCurrentRenderTarget(stateVar).texture
    let time = window.performance.now() * 0.001
    posVar.material.uniforms.time.value = time
    gpuCompute.compute()
  }

  api.clean = () => {
    scene.remove(mesh)
  }

  return api
}
