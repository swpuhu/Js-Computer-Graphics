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
    uniform float u_scale;
    uniform float u_rotation;
    uniform float u_time;
    uniform float u_duration;
    uniform vec2 u_dir;
    uniform vec2 u_offset;
    varying vec2 v_texCoord;

    varying float vP;
    void main () {
        vec2 offset2 = u_offset;
        offset2.y = 1.0 - offset2.y;
        offset2 = 2.0 * offset2 - 1.0;

        float p = min(1.0, u_time / u_duration);
        float rad = u_rotation + 3.14 * 1.0 * p;
        float scale =  u_scale * p * (2.0 - p);
        vec2 offset = u_scale * u_dir * p * p;
        mat3 translateMatrix = mat3( 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, offset.x, offset.y, 1.0 ); 
        mat3 rotateMatrix = mat3( cos(rad), sin(rad), 0.0, -sin(rad), cos(rad), 0.0, 0.0, 0.0, 1.0 ); 
        mat3 scaleMatrix = mat3( scale, 0.0, 0.0, 0.0, scale, 0.0, 0.0, 0.0, 1.0 );
        gl_PointSize = 1.0;
        vec3 pos = translateMatrix * rotateMatrix * scaleMatrix * a_position.xyz; 
        pos.xy = pos.xy + offset2;
        gl_Position = vec4(pos, 1.0); 
        v_texCoord = a_texCoord;
        vP = p;
    }
`

const frag = `
    precision highp float;
    uniform vec4 u_color;
    uniform sampler2D u_texture;
    varying float vP;
    varying vec2 v_texCoord;
    void main () {
        // gl_FragColor = vec4(u_color.rgb, (1.0 - vP) * u_color.a);
        vec4 color = texture2D(u_texture, v_texCoord);
        gl_FragColor = vec4(color.rgb, (1.0 - vP) * color.a);
    }
`
const gl = canvas.getContext('webgl');
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
const program = util.initWebGL(gl, vert, frag);
gl.useProgram(program);
const position = new Float32Array([
    -1, -1, 0, 0,
    1, -1,  1, 0,
    -1, 1,  0, 1,
    -1, 1,  0, 1,
    1, -1,  1, 0,
    1, 1,   1, 1
]);


gl.clearColor(0.0, 0.0, 0.0, 1.0);
const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW);

const vPosition = gl.getAttribLocation(program, 'a_position');
const aTexCoord = gl.getAttribLocation(program, 'a_texCoord');
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);
gl.vertexAttribPointer(aTexCoord, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);
gl.enableVertexAttribArray(vPosition);
gl.enableVertexAttribArray(aTexCoord);


function randomTriangles (x, y) {
    const u_color = [Math.random(), Math.random(), Math.random(), 1.0];
    const u_rotation = Math.random() * Math.random() * 5.0;
    const u_scale = Math.random() * 0.1 + 0.03;
    const u_time = 0;
    const u_duration = 2;

    const rad = Math.random() * Math.PI * 1;
    const u_dir = [Math.cos(rad), Math.sin(rad)];
    const u_offset = [x, y];
    const startTime = performance.now();
    const flowerIndex = Math.random() < 0.5 ? 0 : 1;

    return {u_color, u_rotation, u_scale, u_time, u_duration, u_dir, startTime, u_offset, flowerIndex};
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
    u_offset,
    flowerIndex
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

    loc = gl.getUniformLocation(program, 'u_offset');
    gl.uniform2fv(loc, u_offset);

    flowerIndex === 0 ? gl.bindTexture(gl.TEXTURE_2D, texture1) : gl.bindTexture(gl.TEXTURE_2D, texture2);
}

let triangles = [];
let id;
function update (x = 0, y = 0) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    triangles.forEach(triangle => {
        triangle.u_time = (performance.now() - triangle.startTime) / 1000;
        setUniforms(gl, triangle);
        gl.drawArrays(gl.TRIANGLES, 0, position.length / 4);
    })

    triangles = triangles.filter(triangle => {
        return triangle.u_time <= triangle.u_duration;
    });
    requestAnimationFrame(update);
}

const texture1 = util.createTexture(gl);
const texture2 = util.createTexture(gl);
const image1 = new Image();
const image2 = new Image();
image1.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
}


image2.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
}

image1.src = '../assets/flower1.png';
image2.src = '../assets/flower3.png';
update();

const throttle = (fn, delay = 50) => {
    let timer = null;
    return function (...args) {
        if (timer) {
            return;
        }
        timer = setTimeout(() => {
            fn.apply(this, args);
            clearTimeout(timer);
            timer = null;
        }, delay);
    }
}

document.onmousedown = (e) => {
    triangles.push(randomTriangles((e.clientX - canvas.offsetLeft) / canvas.width, (e.clientY - canvas.offsetTop) / canvas.height));
    document.onmousemove = throttle((ev) => {

        for (let i = 0; i < 5 * Math.random(); i++) {
            triangles.push(randomTriangles((ev.clientX - canvas.offsetLeft) / canvas.width, (ev.clientY - canvas.offsetTop) / canvas.height));
        }
    }, 50)
    document.onmouseup = () => {
        cancelAnimationFrame(id);
        document.onmousemove = null;
        document.onmouseup = null;
    }
}