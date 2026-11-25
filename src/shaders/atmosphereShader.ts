export const atmosphereVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

export const atmosphereFragmentShader = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uScroll;
  uniform float uVelocity;
  uniform float uIntensity;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec3 uObsidian;
  uniform vec3 uGraphite;
  uniform vec3 uArctic;

  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = noise(p) * 0.65;
    p = mat2(0.8, 0.6, -0.6, 0.8) * p * 2.02 + vec2(1.7, 9.2);
    v += noise(p) * 0.35;
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 uv = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 pointer = uPointer * 0.25;

    float flow = uTime * 0.06 + uScroll * 1.4;
    vec2 warpedUv = uv * 1.45 - pointer + vec2(flow * 0.35, -flow * 0.25);
    float field = fbm(warpedUv);

    // Anchor subtle Arctic atmospheric energy on right/horizon while keeping left text readable
    vec2 haloCenter = vec2(0.32 * aspect + pointer.x * 0.4, 0.05 - uScroll * 0.25 - pointer.y * 0.3);
    float radialGlow = exp(-dot(uv - haloCenter, uv - haloCenter) * 2.3);

    float mixEnergy = clamp(field * 0.42 + radialGlow * (0.28 + min(uVelocity * 0.25, 0.16)), 0.0, 1.0);
    vec3 baseTone = mix(uObsidian, uGraphite, smoothstep(0.18, 0.82, field));
    vec3 finalColor = mix(baseTone, uArctic, mixEnergy * 0.14 * uIntensity);

    // Subtle film dithering prevents gradient banding across dark obsidian monitors
    float dither = (hash(gl_FragCoord.xy) - 0.5) * 0.012;
    gl_FragColor = vec4(finalColor + dither, 1.0);
  }
`;
