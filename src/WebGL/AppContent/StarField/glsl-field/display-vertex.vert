precision highp float;
precision highp sampler2D;
uniform sampler2D tex;
uniform vec2 resolution;
// varying vec3 randID;
varying float state;
void main (void) {
  vec4 gpuPosition = texture2D(tex, position.xy);
  // randID = gpuPosition.rgb;
  vec2 posA = gpuPosition.xy;

  state = gpuPosition.z;

  gl_PointSize = 2.0;
  gl_Position = vec4(
    2.0 * posA.x - 1.0,
    1.0 - 2.0 * posA.y,
    1.0,
    1.0
  );

  if (resolution.x > resolution.y) {
    gl_Position.y *= resolution.x / resolution.y;
  } else {
    gl_Position.y *= resolution.x / resolution.y;
    gl_Position.xy *= resolution.y / resolution.x;
  }
}