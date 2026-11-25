export const horizonGridVertexShader = /* glsl */ `
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

export const horizonGridFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uScroll;
  uniform vec3 uArctic;
  uniform vec3 uIvory;

  varying vec3 vWorldPos;

  float gridLine(float coord, float width) {
    float d = abs(fract(coord - 0.5) - 0.5);
    return 1.0 - smoothstep(0.0, width, d);
  }

  void main() {
    float spacing = 2.8;
    float gx = gridLine(vWorldPos.x / spacing, 0.018);
    float gz = gridLine(vWorldPos.z / spacing + uTime * 0.12 + uScroll * 3.8, 0.018);
    float grid = max(gx, gz);
    float dist = length(vWorldPos.xz) / 54.0;
    float fade = 1.0 - smoothstep(0.14, 0.95, dist);
    vec3 color = mix(uArctic, uIvory, clamp(gx * gz * 0.65, 0.0, 0.55));
    float scrollDim = 1.0 - smoothstep(0.1, 0.9, uScroll) * 0.45;
    gl_FragColor = vec4(color, grid * fade * 0.24 * scrollDim);
  }
`;
