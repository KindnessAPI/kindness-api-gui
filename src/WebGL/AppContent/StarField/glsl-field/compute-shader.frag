precision highp float;
precision highp sampler2D;
uniform float time;
uniform sampler2D lastValue;


// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

uniform float u_speed_factor;
uniform float u_tail_amount;
uniform float u_drop_rate;
uniform float u_mode;
uniform float u_drop_rate_bump;


vec2 multiverse (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  // many lines of multiverse
  p.xy *= 10.0;
  p.x += 11.0;
  v.x = cos((max(p.x, p.y) - min(length(p), p.y)));
  v.y = cos(max((p.y - cos(length(p))),p.x)) * cos((p.x - p.x));
  v.xy *= 1.0;

  return v;
}

vec2 galaxy (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  // galaxy
  v.x += p.y;
  v.y += sin(sin((min(exp(length(p)),p.y)-p.x)));

  return v;
}

vec2 circle (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  // circle
  v.x += -p.y;
  v.y += p.x;

  return v;
}


vec2 river (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  // river
  v.x += sin(length(p));
  v.y += cos((length(p)-p.x*p.y));

  return v;
}


vec2 squares (vec2 pp) {
  vec2 p = vec2(pp * 2.7);
  vec2 v = vec2(0.0);

  v.x = p.y;
  v.y = p.x/length(p)/max(p.y,sin(length(p)));

  return v;
}


vec2 dotted (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  p *= 3.5;
  p.y += 1.5;
  p.x *= 2.5;
  v.x += cos(p.x + 2.0 * p.y);
  v.y += sin(p.x - 2.0 * p.y);
  v.xy *= 0.5;

  return v;
}


vec2 stoneFlow (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  // flow to a stone
  p *= 2.0 * 2.0 * 3.1415;
  v.x = p.y - length(p);
  v.y = length(p);
  v.xy *= 1.0;


  return v;
}

vec2 jade (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  p.xy *= 10.0;
  v.x = sin(min(p.y,length(p)));
  v.y = (sin(p.y)-p.x);
  v.xy *= 1.0;


  return v;
}

vec2 converge (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  p.xy *= 2.0;
  p.y += 1.0;
  v.x = length(p);
  v.y = cos(p.y);
  v.xy *= 1.0;

  return v;
}

vec2 boxes (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  p.xy *= 3.1415 * 2.0 * 1.5;
  v.x = cos(p.y);
  v.y = sin(p.x);
  v.xy *= 1.0;

  return v;
}

vec2 passWave (vec2 pp) {
  vec2 p = vec2(pp);
  vec2 v = vec2(0.0);

  p.xy *= 2.0 * 3.1415;
  p.x += 4.0;
  v.x = max(sin(p.x),p.x)/p.x;
  v.y = (min(exp(cos(length(p))),sin(p.x))+cos(p.x));

  return v;
}

vec2 get_vel (vec2 pp) {
  // galaxy
  if (u_mode == 0.0) {
    if (fract(time) < 0.5) {
      return galaxy(-pp * 2.0);
    } else {
      return galaxy(pp * 2.0);
    }
  // dotted
  } else if (u_mode == 1.0) {
    if (fract(time) < 0.5) {
      return dotted(-pp);
    } else {
      return dotted(pp);
    }
  // magic
  } else if (u_mode == 4.0) {
    float signv = sin(time * 3.0) * cos(time);
    return dotted(signv * pp);

    // if (length(pp) < 0.5 * abs(signv)) {
    //   return converge(signv * -pp);
    // } else {
    //   return dotted(signv * pp) + circle(signv * pp);
    // }
  // boxes
  } else if (u_mode == 2.0) {
    if (fract(time) < 0.5) {
      return boxes(pp);
    } else {
      return boxes(-pp);
    }
  // flow
  } else if (u_mode == 3.0) {
    if (fract(time) < 0.5) {
      return converge(pp);
    } else {
      return converge(-pp);
    }
  }
}

void main (void) {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec4 oldPos = texture2D(lastValue, uv);

  vec4 nPos = vec4(oldPos);

  vec2 pos = nPos.xy;
  float opacity = oldPos.z;

  const vec2 u_min = vec2(0.0);
  const vec2 u_max = vec2(0.1);

  // const float u_speed_factor = 7.75;
  // const float u_drop_rate = 0.03;
  // const float u_drop_rate_bump = 0.03;

  vec2 sumVelocity = vec2(0.0);

  sumVelocity += get_vel((pos * 2.0 - 1.0));

  vec2 velocity = mix(u_min, u_max, sumVelocity);

  float speed_t = length(velocity) / length(u_max);

  vec2 offset = vec2(velocity.x, velocity.y) * 0.001 * u_speed_factor;

  // update particle position, wrapping around the date line
  pos = mod(pos + offset, 1.0);

  vec2 u_rand_seed = vec2(uv);

  // a random seed to use for the particle drop
  vec2 seed = (1.0 + pos + uv) * u_rand_seed;

  // drop rate is a chance a particle will restart at random position, to avoid degeneration
  float drop_rate = u_drop_rate + speed_t * u_drop_rate_bump;
  float drop = step(1.0 - drop_rate, rand(seed));

  vec2 random_pos = vec2(
    rand(seed + 0.2),
    rand(seed + 0.1)
  );

  pos = mix(pos, random_pos, drop);

  opacity = 1.0 - length(velocity.xy) * 10.0;

  if (length(uv) > u_tail_amount) {
    gl_FragColor = vec4(0.0, 0.0, opacity, 1.0);
  } else {
    gl_FragColor = vec4(pos.xy, opacity, 1.0);
  }

}