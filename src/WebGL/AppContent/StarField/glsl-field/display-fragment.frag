#include <common>

uniform vec3 color;
uniform float time;
// varying vec3 randID;

void main (void) {
  gl_FragColor = vec4(color, 1.0);
}