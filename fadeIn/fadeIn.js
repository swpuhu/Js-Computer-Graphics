import {Vec2} from '../util.js'
import util from '../../WebGLLearning/util.js';
const width = 640;
const height = 360;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const vert = `
    attribute vec4 a_position;
    attribute vec2 a_texCoord;

    uniform mat4 u_projection;

    varying vec2 v_texCoord;

    void main () {
        gl_Position = u_projection * a_position;
        v_texCoord = a_texCoord;
    }
`

const frag = `
    precision highp float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    uniform vec2 u_resolution;
    uniform float u_time;


    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.543123);
    }
    void main () {
        vec2 uv = v_texCoord;
        uv.y *= u_resolution.y / u_resolution.x;
        vec2 st = uv * 10.;
        float d = distance(fract(st), vec2(0.5));
        float p = u_time + random(floor(st));
        float shading = 0.5 + 0.5 * sin(p);
        d = smoothstep(d, d + 0.01, 1.0 * shading);
        vec4 color = texture2D(u_texture, v_texCoord);
        gl_FragColor.rgb = color.rgb * clamp(0.0, 1.0, d + 1.0 * shading);
        gl_FragColor.a = color.a;
    }
`
const gl = canvas.getContext('webgl');
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
gl.enable(gl.BLEND);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
const program = util.initWebGL(gl, vert, frag);
gl.useProgram(program);
const position = new Float32Array([
    0.0, 0.0, 0.0, 0.0,
    width, 0.0, 1.0, 0.0,
    width, height, 1.0, 1.0,
    width, height, 1.0, 1.0,
    0.0, height, 0.0, 1.0,
    0.0, 0.0, 0.0, 0.0,
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

const uniformSetter = util.createUniformSetters(gl, program);
const uniforms = {
    u_projection: util.createProjection(width, height, 1),
    u_resolution: [width, height],
    u_time: 1000
}

const draw = () => {
    util.setUniforms(uniformSetter, uniforms);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}


const animate = () => {
    requestAnimationFrame(animate);
    uniforms.u_time += 0.01;
    draw();
}

const texture = util.createTexture(gl);
const image = new Image();
image.src = '../assets/gaoda1.jpg';
image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    animate();
}

