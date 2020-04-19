#include <common>

uniform vec3 color;
uniform float time;
// varying vec3 randID;
uniform vec2 resolution;
varying float state;

// const mat2 m = mat2( 0.80,  0.60, -0.60,  0.80 );

// float noise( in vec2 p ) {
// 	return sin(p.x)*sin(p.y);
// }

// float fbm4( vec2 p )
// {
//     float f = 0.0;
//     f += 0.5000 * noise( p ); p = m * p * 2.02;
//     f += 0.2500 * noise( p ); p = m * p * 2.03;
//     f += 0.1250 * noise( p ); p = m * p * 2.01;
//     f += 0.0625 * noise( p );
//     return f / 0.9375;
// }

// float fbm6( vec2 p )
// {
//     float f = 0.0;
//     f += 0.500000*(0.5+0.5*noise( p )); p = m*p*2.02;
//     f += 0.250000*(0.5+0.5*noise( p )); p = m*p*2.03;
//     f += 0.125000*(0.5+0.5*noise( p )); p = m*p*2.01;
//     f += 0.062500*(0.5+0.5*noise( p )); p = m*p*2.04;
//     f += 0.031250*(0.5+0.5*noise( p )); p = m*p*2.01;
//     f += 0.015625*(0.5+0.5*noise( p ));
//     return f/0.96875;
// }

// float pattern (vec2 p) {
//   float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
//   return abs(vout);
// }

void main (void) {
  if (length(gl_PointCoord.xy - 0.5) < 0.5) {
    vec2 muv = gl_FragCoord.xy / resolution.xy;
    gl_FragColor.a = 1.0 * state;
    gl_FragColor.r = color.r + 0.5 * sin(time + muv.y);
    gl_FragColor.g = color.g;
    gl_FragColor.b = color.b + 0.5 * sin(time + muv.x);
  } else {
    discard;
  }

  // vec2 muv = gl_FragCoord.xy / resolution.xy;
  // vec3 outColor = vec3(0.0);
  // vec2 pt = muv.xy;
  // // pt.y = pt.y * (resolution.y / resolution.x);
  // // pt.xy = pt.xy * 3.0;

  // outColor.r = pattern(pt.xy + -1.0 * cos(time));
  // outColor.g = pattern(pt.xy + 0.0);
  // outColor.b = pattern(pt.xy + 1.0 * cos(time));

  // gl_FragColor = vec4(clamp(outColor.rgb, 0.0, 1.0), outColor.r);
}
