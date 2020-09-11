import {Vec2} from '../util.js'
import util from '../../WebGLLearning/util.js';
const width = 640;
const height = 640;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main () {
        gl_Position = a_position;
        v_texCoord = a_texCoord;
    }
`

const frag = `
    precision highp float;
    varying vec2 v_texCoord;
    void main () {
        vec2 st = v_texCoord * 10.;
        vec2 index = floor(st);
        vec2 grid = fract(st);
        vec2 t = mod(index, 2.0);
        if (t.x == 1.0) {
            grid.x = 1.0 - grid.x;
        }
        if (t.y == 1.0) {
            grid.y = 1.0 - grid.y;
        }
        gl_FragColor = vec4(grid, 0.0, 1.0);
    }
`
const gl = canvas.getContext('webgl');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
const program = util.initWebGL(gl, vert, frag);
gl.useProgram(program);
const position = new Float32Array([
    -1, -1, 0.0, 0.0,
    1, -1, 1.0, 0.0,
    1, 1, 1.0, 1.0,
    1, 1, 1.0, 1.0,
    -1, 1, 0.0, 1.0,
    -1, -1, 0.0, 0.0,
]);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

const vPosition = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.enableVertexAttribArray(vPosition);

const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(aTexCoord);



gl.drawArrays(gl.TRIANGLES, 0, 6);
