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

    uniform vec2 u_mouse;
    vec2 polar (vec2 st) {
        return vec2(length(st), atan(st.y, st.x));
    }

    vec3 hsv2rgb(vec3 c) {
        vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
        rgb = rgb * rgb * (3.0 - 2.0 * rgb);
        return c.z * mix(vec3(1.0), rgb, c.y);
    }

    void main () {
        vec2 st = v_texCoord - vec2(0.5);
        st = polar(st);
        float d = smoothstep(st.x, st.x + 0.005, 0.2);
        if (st.y < 0.0) st.y += 6.28;
        float p = st.y / 6.28;
        gl_FragColor.rgb = d * hsv2rgb(vec3(p, u_mouse.x, u_mouse.y));
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


