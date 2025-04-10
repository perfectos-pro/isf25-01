void main() {
  float T = iTime * 1.9;
  float TT = iTime * 0.6;
  vec2 p = 2.0 * gl_FragCoord.xy / iResolution.xy;

  for(int i = 1; i < 11; i++) {
    vec2 newp = p;
    float ii = float(i);
    newp.x += 0.85 / ii * sin(ii * 3.1415 * p.y + T * 0.095 + cos((TT / (5.0 * ii)) * ii));
    newp.y += 0.25 / ii * cos(ii * 3.1415 * p.x + TT + 0.095 + sin((T / (5.0 * ii)) * ii));
    p = newp + log(mod(iTime, 60.0)) / 85.0;
  }

  vec3 col = vec3(
    cos(p.x + p.y + 3.0 * 0.45) * 0.5 + 0.5,
    sin(p.x + p.y + 6.0 * 1.33) * 0.5 + 0.5,
    (sin(p.x + p.y + 9.0 * 1.0) + cos(p.x + p.y + 12.0 * 0.22)) * 0.25 + 0.5
  );

  gl_FragColor = vec4(col * col, 1.0);
}