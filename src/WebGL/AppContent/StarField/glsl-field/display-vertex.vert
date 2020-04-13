precision highp float;
precision highp sampler2D;
uniform sampler2D tex;
uniform vec2 screen;

// varying vec3 randID;
void main (void) {

  vec4 colorA = texture2D(tex, position.xy);
  // randID = colorA.rgb;
  vec2 posA = colorA.xy;

  gl_PointSize = 1.0;
  gl_Position = vec4(
    2.0 * posA.x - 1.0,
    1.0 - 2.0 * posA.y,
    1.0,
    1.0
  );

  if (screen.x > screen.y) {
    gl_Position.y *= screen.x / screen.y;
  } else {
    gl_Position.y *= screen.x / screen.y;
    gl_Position.xy *= screen.y / screen.x;
  }
}