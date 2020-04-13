precision highp float;
precision highp sampler2D;

uniform sampler2D tScreen;
uniform vec2 res;

uniform float u_opacity;

void main (void) {
  vec2 uv = gl_FragCoord.xy / res.xy;
  vec4 screenColor = texture2D(tScreen, vec2(uv.x, uv.y));

  // float u_opacity = 0.875;
  // gl_FragColor = vec4(floor(255.0 * screenColor * u_opacity) / 255.0);

  gl_FragColor = screenColor * u_opacity;
}
