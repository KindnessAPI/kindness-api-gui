precision highp float;

uniform lowp vec2 sceneRect;
uniform float time;
varying vec2 vUv;

varying vec3 vViewPosition;
varying vec3 vNormal;
uniform sampler2D matcap;

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
  float vout = fbm4( p + time + fbm6( p + fbm4( p + time )) );
  return abs(vout);
}

void main (void) {
  vec3 outColor = vec3(0.0);
  vec2 pt = vUv.xy;
  // pt.y = pt.y * (sceneRect.y / sceneRect.x);
  pt.xy = pt.xy * 3.0;

  vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 matCapUV = vec2( dot( x, vNormal ), dot( y, vNormal ) ) * 0.495 + 0.5; // 0.495 to remove artifacts caused by undersized matcap disks
  vec4 matcapColor = texture2D( matcap, matCapUV );

  outColor.r = pattern(pt.xy + -0.15 * cos(time));
  outColor.g = pattern(pt.xy + 0.0);
  outColor.b = pattern(pt.xy + 0.15 * cos(time));

  gl_FragColor = vec4(clamp(outColor.rgb + matcapColor.xyz, 0.0, 1.0), 1.0);
}