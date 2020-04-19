precision highp float;

// varying vec3 vNormal;
// varying vec2 vUv;
// varying vec3 vViewPosition;

// uniform vec3 baseColor;
// uniform float time;
// uniform float animateRadius;
// uniform float animateStrength;


// uniform vec3 baseColor;
uniform float baseOpacity;

// varying vec3 vPos;

uniform samplerCube tCube;
// uniform sampler2D tDudv;
uniform float time;

varying vec3 vReflect;
varying vec3 vRefract[3];
varying float vReflectionFactor;
// varying vec2 vUv;

uniform bool useDudv;

varying vec3 vColor;

void main (void) {
  // vec3 tRefract0 = vRefract[0];
  // vec3 tRefract1 = vRefract[1];
  // vec3 tRefract2 = vRefract[2];

  // if (useDudv) {
  //   float waveStrength = 0.12;

  //   // simple distortion (ripple) via dudv map (see https://www.youtube.com/watch?v=6B7IF6GOu7s)
  //   vec2 distortedUv = texture2D( tDudv, vec2( vUv.x, vUv.y ) ).rg * waveStrength;
  //   distortedUv = vUv.xy + vec2( distortedUv.x, distortedUv.y );
  //   vec2 distortion = ( texture2D( tDudv, distortedUv * 0.25 ).rg * 2.0 - 1.0 ) * waveStrength;

  //   tRefract0.xy += distortion;
  //   tRefract1.xy += distortion;
  //   tRefract2.xy += distortion;
  // }

  // vec4 reflectedColor = vec4(1.0);// textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );

  // vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );
  // vec4 refractedColor = vec4(1.0);

  // refractedColor.r = textureCube( tCube, vec3( tRefract0.x, tRefract0.yz ) ).r;
  // refractedColor.g = textureCube( tCube, vec3( tRefract1.x, tRefract1.yz ) ).g;
  // refractedColor.b = textureCube( tCube, vec3( tRefract2.x, tRefract2.yz ) ).b;
  // gl_FragColor = mix( reflectedColor , refractedColor , clamp( vReflectionFactor, 0.0, 1.0 ) );
  // gl_FragColor.a = baseOpacity;

  gl_FragColor.r = 0.25;
  gl_FragColor.g = 0.25;
  gl_FragColor.b = 0.25;
  gl_FragColor.a = 0.25 + vRefract[0].g + vRefract[0].g;// + + vRefract[2].b;
}