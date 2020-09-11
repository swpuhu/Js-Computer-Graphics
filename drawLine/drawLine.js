import { Vec2 } from '../util.js'
import util from '../../WebGLLearning/util.js';
const width = 500;
const height = 500;
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
// 直线
const frag = `
    precision highp float;
    varying vec2 v_texCoord;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.543123);
    }
    void main () {
        vec3 line = vec3(1.0, 1.0, 0.0);
        vec2 st = v_texCoord;
        float d = abs(cross(vec3(st, 0.0), normalize(line)).z);
        d = fract(20. * d);
        gl_FragColor.rgb =  (smoothstep(0.45, 0.5, d) - smoothstep(0.5, 0.55, d)) * vec3(1.0);
        gl_FragColor.a = 1.0;
    }
`
// 圆
const frag2 = `
    precision highp float;
    varying vec2 v_texCoord;

    float random (vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.543123);
    }
    void main () {
        float d = distance(v_texCoord, vec2(0.5));
        d = fract(20. * d);
        gl_FragColor.rgb =  (smoothstep(0.15, 0.2, d) - smoothstep(0.2, 0.25, d)) * vec3(1.0);
        gl_FragColor.a = 1.0;
    }
`
// 线段
const frag3 = `
precision highp float;
varying vec2 v_texCoord;
uniform vec2 u_origin;
uniform vec2 u_mouse;

float seg_distance(in vec2 st, in vec2 a, in vec2 b) {
    vec3 ab = vec3(b - a, 0.);
    vec3 p = vec3(st - a, 0.);
    float l = length(ab);
    float d = abs(cross(p, normalize(ab)).z);
    float proj = dot(p, ab) / l;
    if (proj >= 0. && proj <= l) return d;
    return min(distance(st, a), distance(st, b));
}
void main () {
    float d = seg_distance(v_texCoord, u_origin, u_mouse);
    gl_FragColor.rgb = (1.0 - smoothstep(0.0, 0.005, d)) * vec3(1.0);
    gl_FragColor.a = 1.0;
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
    u_time: 1000,
    u_mouse: [0.5, 0.8],
    u_origin: [0.5, 0.5]
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

canvas.onmousemove = function (e) {
    const x = e.clientX;
    const y = e.clientY;
    uniforms.u_mouse = [x / width, 1.0 - y / height]
    draw();

}



draw();


