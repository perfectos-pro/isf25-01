import frag from './ColorDiffusionFlow.fs?raw';

const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile failed:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link failed:', gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

const vertexSrc = \`
  attribute vec4 position;
  void main() {
    gl_Position = position;
  }
\`;

const program = createProgram(gl, vertexSrc, frag);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
  -1, -1,
   1, -1,
  -1,  1,
  -1,  1,
   1, -1,
   1,  1,
]), gl.STATIC_DRAW);

const positionLocation = gl.getAttribLocation(program, "position");
gl.useProgram(program);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

function render(time) {
  const t = time * 0.001;
  const res = [canvas.width, canvas.height];
  gl.viewport(0, 0, canvas.width, canvas.height);

  const uTime = gl.getUniformLocation(program, "TIME");
  const uRes = gl.getUniformLocation(program, "RENDERSIZE");
  const uDate = gl.getUniformLocation(program, "DATE");

  gl.uniform1f(uTime, t);
  gl.uniform2f(uRes, res[0], res[1]);
  const d = new Date();
  gl.uniform4f(uDate, d.getFullYear(), d.getMonth()+1, d.getDate(), d.getSeconds());

  gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
