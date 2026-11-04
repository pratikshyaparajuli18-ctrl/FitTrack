// @vertex
#version 300 es

void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);

  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}

// @fragment
#version 300 es
precision highp float;
precision highp int;

uniform vec3 u_bg;
uniform vec3 u_accent;

uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;

out vec4 fragColor;

float hash(vec2 p) {
  // random values to make psuedo random points (hashing)
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

// fractional Brownian motion
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);

  f = f * f * (3.0 - 2.0 * f);

  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
             mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}

// random height field moving through time
float height(vec2 p) {
  p += vec2(u_time * 0.015, u_time * 0.01);
  return 0.6 * noise(p * 2.5) + 0.3 * noise(p * 5.0) + 0.1 * noise(p * 10.0);
}

// The lines for each height value making a contour map
float contour(float h) {
  float level = h / 0.04;
  float d = abs(fract(level + 0.5) - 0.5);

  float width = max(fwidth(level), 0.01);

  return 1.0 - smoothstep(0.0, width * 0.8, d);
}

// Applying gravity around the mouse to make contour lines disappear
float mouse_distortion(vec2 p) {
  vec2 mouse = (u_mouse - u_resolution * 0.5) / u_resolution.y;

  vec2 d = p - mouse;

  float r = length(d / vec2(0.12, 0.13));
  r += (noise(p * 3.0) - 0.5) * 0.2;

  float depth = 1.0 - smoothstep(0.3, 1.0, r);

  float influence = exp(-dot(d, d) / (0.1 * 0.1));
  p -= d * 0.2 * influence;

  return depth;
}

void main() {
  vec2 p = (gl_FragCoord.xy - u_resolution * 0.5) / u_resolution.y;

  float depth = mouse_distortion(p);
  // wrap contour lines around mouse
  float h = height(p) - depth * 0.1;

  float lines = contour(h);

  lines *= 1.0 - smoothstep(0.1, 0.9, depth);

  vec3 color = mix(u_bg, u_accent, lines * 0.7);

  fragColor = vec4(color, 1.0);
}
