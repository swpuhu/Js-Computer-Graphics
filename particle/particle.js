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

    uniform float u_scale;
    uniform float u_rotation;
    uniform float u_time;
    uniform float u_duration;
    uniform vec2 u_dir;

    varying float vP;
    void main () {
        float p = min(1.0, u_time / u_duration);
        float rad = u_rotation + 3.14 * 1.0 * p;
        float scale =  u_scale * p * (2.0 - p);
        vec2 offset = 2.0 * u_dir * p * p;
        mat3 translateMatrix = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, offset.x, offset.y, 1.0 ); 
        mat3 rotateMatrix = mat3( cos(rad), sin(rad), 0.0, -sin(rad), cos(rad), 0.0, 0.0, 0.0, 1.0 ); 
        mat3 scaleMatrix = mat3( scale, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, 1.0 );
        gl_PointSize = 1.0;
        vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * a_position.xyz; 
        gl_Position = vec4(pos, 1.0); 
        vP = p;
    }
`

const frag = `
    precision highp float;
    uniform vec4 u_color;
    varying float vP;
    void main () {
        gl_FragColor = vec4(u_color.rgb, (1.0 - vP) * u_color.a);
    }
`
const gl = canvas.getContext('webgl');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
const program = util.initWebGL(gl, vert, frag);
gl.useProgram(program);
const position = new Float32Array([
    -1, -1, 
    0, 1, 
    1, -1,
]);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

const vPosition = gl.getAttribLocation(program, 'a_position');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(vPosition);


function randomTriangles () {
    const u_color = [Math.random(), Math.random(), Math.random(), 1.0];
    const u_rotation = Math.random() * Math.PI;
    const u_scale = Math.random() * 0.2 + 0.03;
    const u_time = 0;
    const u_duration = 3.0;

    const rad = Math.random() * Math.PI * 2;
    const u_dir = [Math.cos(rad), Math.sin(rad)];
    const startTime = performance.now();

    return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime};
}

/**
 * 
 * @param {WebGLRenderingContext} gl 
 * @param {*} param1 
 */
function setUniforms (gl, {
    u_color,
    u_rotation, 
    u_scale, 
    u_time, 
    u_duration, 
    u_dir, 
}) {
    let loc = gl.getUniformLocation(program, 'u_color');
    gl.uniform4fv(loc, u_color);

    loc = gl.getUniformLocation(program, 'u_rotation');
    gl.uniform1f(loc, u_rotation);

    loc = gl.getUniformLocation(program, 'u_scale');
    gl.uniform1f(loc, u_scale);

    loc = gl.getUniformLocation(program, 'u_time');
    gl.uniform1f(loc, u_time);

    loc = gl.getUniformLocation(program, 'u_duration');
    gl.uniform1f(loc, u_duration);

    loc = gl.getUniformLocation(program, 'u_dir');
    gl.uniform2fv(loc, u_dir);
}

let triangles = [];

function update () {
    for (let i = 0; i < 5 * Math.random(); i++) {
        triangles.push(randomTriangles());
    }

    gl.clear(gl.COLOR_BUFFER_BIT);

    triangles.forEach(triangle => {
        triangle.u_time = (performance.now() - triangle.startTime) / 1000;
        setUniforms(gl, triangle);
        gl.drawArrays(gl.TRIANGLES, 0, position.length / 2);
    })

    triangles = triangles.filter(triangle => {
        return triangle.u_time <= triangle.u_duration;
    });

    requestAnimationFrame(update);
}

requestAnimationFrame(update);