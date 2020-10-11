import { Matrix } from '../MVP/mat4.js';
import { parametric, cubicBezier } from '../parametric/parametric.js';
import util from '../glUtil.js';
import { Slider } from '../MVP/UICreator.js';

const canvas = document.createElement('canvas');
const width = 640;
const height = 360;
const near = 500;
const far = 2000;
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);
canvas.style.border = '1px solid #ccc';

const seg = 100;
const start = 0;
const end = 360;
const circle = parametric(
    (t, r) => r * Math.cos(t),
    (t, r) => r * Math.sin(t),
)

// gl.translate(width / 2, height / 2);
let { points } = circle(-Math.PI / 2, Math.PI / 2, 100, 150);
// points = cubicBezier(0, 1, 100, [{x: 0, y: -100}, {x: 100, y: -50}, {x: 100, y: 50}, {x: 0, y: 100}]).points;
const axis = { x: 0, y: 0, z: near };
// 增加z坐标
for (let i = 0; i < points.length; i++) {
    points[i].push(near);
}
// console.log(points);

const lines = [];

for (let i = 0; i <= seg; i++) {
    const newPoints = [];
    const p = i / seg;
    const t = start + (end - start) * p;
    let rotateMatrix = util.createRotateMatrix(axis, t, 'y');
    for (let j = 0; j < points.length; j++) {
        newPoints.push(util.vecMultiMat([points[j][0], points[j][1], points[j][2], 1], rotateMatrix));
    }
    lines.push(newPoints);
}
// console.log(lines);
let vertexPoints = [];
let normals = [];
for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    let nextLine = lines[(i + 1) % lines.length];
    for (let j = 0; j < line.length - 1; j++) {
        let point0 = line[j];
        let point1 = line[j + 1];
        let nextLinePoint0 = nextLine[j];
        let nextLinePoint1 = nextLine[j + 1];
        vertexPoints.push(
            ...point0,
            ...nextLinePoint0,
            ...point1,
            ...nextLinePoint0,
            ...nextLinePoint1,
            ...point1,
        )

        let vec0 = util.subtractVectors(nextLinePoint0, point0, true);
        let vec1 = util.subtractVectors(point1, nextLinePoint0, true);
        let normal1 = util.cross(vec1, vec0);
        let nextVec0 = util.subtractVectors(nextLinePoint1, nextLinePoint0, true);
        let nextVec1 = util.subtractVectors(point1, nextLinePoint1, true);
        let normal2 = util.cross(nextVec1, nextVec0);
        if (isNaN(normal1[0])) {
            // debugger;
        }
        normals.push(
            ...normal1,
            ...normal1,
            ...normal1,
            ...normal2,
            ...normal2,
            ...normal2,
        )
    }
}

vertexPoints = new Float32Array(vertexPoints);
normals = new Float32Array(normals);
// console.log(vertexPoints, normals);




const vertexShader = `
    attribute vec4 a_position;
    attribute vec3 a_normal;
    uniform vec3 u_lightPosition;
    uniform vec3 u_cameraPosition;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToCamera;
    uniform mat4 u_perspective;
    uniform mat4 u_rotateX;
    uniform mat4 u_rotateY;
    uniform mat4 u_rotateZ;
    uniform mat4 u_translate;
    uniform mat3 u_normalWorld;
    void main () {
        gl_Position =  u_perspective * u_translate * u_rotateX * u_rotateY * u_rotateZ * a_position;
        vec3 position = (u_translate * u_rotateX * u_rotateY * u_rotateZ * a_position).xyz;
        v_surfaceToLight = u_lightPosition - position;
        v_surfaceToCamera = u_cameraPosition - position;
        v_normal = u_normalWorld * a_normal;
    }
`

const fragmentShader = `
    precision mediump float;
    varying vec3 v_normal;
    varying vec3 v_surfaceToLight;
    varying vec3 v_surfaceToCamera;
    uniform float u_intensity;
    void main () {
        vec3 normal = normalize(v_normal.xyz);
        vec3 light_dir = normalize(v_surfaceToLight);
        vec3 camera_dir = normalize(v_surfaceToCamera);
        vec3 halfVector = normalize(light_dir + camera_dir);
        
        float r = length(v_surfaceToLight);
        float kd = 1.2; //漫反射系数
        float ks = 1.; // 高光系数
        float ka = 0.1; // 环境光系数
        vec3 kColor = vec3(0.5, 0.5, 0.5);
        vec3 ksColor = vec3(1.);
        vec3 kaColor = vec3(1., 1., 1.);
        float p = 500.;
        vec3 diffuse = kd * max(0.0, dot(light_dir, normal)) * kColor;
        vec3 specular = ks * pow(max(0.0, dot(halfVector, normal)), p) * ksColor;
        vec3 ambient = ka * kaColor;
        gl_FragColor = vec4(diffuse + specular + ambient, 1.0);
    }

`;


let gl = canvas.getContext('webgl');
let program = util.initWebGL(gl, vertexShader, fragmentShader);
gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
let uniformSetters = util.createUniformSetters(gl, program);
let attributeSetters = util.createAttributeSetters(gl, program);



let tx = 0;
let ty = 0;
let tz = 200;
let rotateX = 0;
let rotateY = 0;
let rotateZ = 0;

let cameraX = 0;
let cameraY = 0;
let cameraZ = 0;

const testPoints = new Float32Array([
    0.0, 0.0, near, 1,
    width, 0.0, near, 1,
    0.0, height, near, 1
]);

const translateMatrix = new Matrix(4).createTranslateMatrix(tx, ty, tz).transpose();
const rotateXMatrix = new Matrix(4).createRotateMatrix(rotateX, 'x').transpose();
const rotateYMatrix = new Matrix(4).createRotateMatrix(rotateY, 'y').transpose();
const rotateZMatrix = new Matrix(4).createRotateMatrix(rotateZ, 'z').transpose();
const perspectiveMatrix = new Matrix(4).createPerspectiveMatrix(near, far, width / 2, height / 2).transpose();
const orthographMatrix = new Matrix(4).createOrthographMatrix(-width / 2, width / 2, height / 2, -height / 2, near / 2, far).transpose();
const viewScaleMatrix = new Matrix(4).createViewScaleMatrix(0, width, height, 0, near, far).transpose()

// vertexPoints = testPoints;
let f32size = Float32Array.BYTES_PER_ELEMENT;

let pointsBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pointsBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPoints, gl.STATIC_DRAW);


let normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

let cameraPos = [0, 0, 0];
let cameraMat = util.lookAt(cameraPos, [0, 0, far], [0, 1, 0]);
cameraMat = util.inverse(cameraMat);


let uniforms = {
    u_perspective: util.createPerspective(near, far, -width / 2, width / 2, height / 2, -height / 2),
    u_camera: cameraMat,
    u_rotateX: util.createRotateMatrix(axis, rotateX, 'x'),
    u_rotateY: util.createRotateMatrix(axis, rotateY, 'y'),
    u_rotateZ: util.createRotateMatrix(axis, rotateZ, 'z'),
    u_translate: util.createTranslateMatrix(tx, ty, tz),
    u_normalWorld: new Matrix(3).createRotateMatrix3(rotateX, 'x')
        .multiple(new Matrix(3).createRotateMatrix3(rotateY, 'y'))
        .multiple(new Matrix(3).createRotateMatrix3(rotateZ, 'z'))
        .transpose().matrix,
    u_lightPosition: [-300, 300, 300],
    u_intensity: 100000,
}

let attribs = {
    a_position: {
        buffer: pointsBuffer,
        numComponents: 4
    },
    a_normal: {
        buffer: normalBuffer,
        numComponents: 3
    }
}
gl.vertexAttribPointer()

function draw() {
    uniforms.u_rotateX = util.createRotateMatrix(axis, rotateX, 'x'),
        uniforms.u_rotateY = util.createRotateMatrix(axis, rotateY, 'y'),
        uniforms.u_rotateZ = util.createRotateMatrix(axis, rotateZ, 'z'),
        uniforms.u_normalWorld = new Matrix(3).createRotateMatrix3(rotateX, 'x')
            .multiple(new Matrix(3).createRotateMatrix3(rotateY, 'y'))
            .multiple(new Matrix(3).createRotateMatrix3(rotateZ, 'z'))
            .transpose().matrix
    util.setAttributes(attributeSetters, attribs);
    util.setUniforms(uniformSetters, uniforms);
    // gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.POINTS, 0, vertexPoints.length / 4);
}

const rotateXSlider = new Slider({
    min: -180,
    max: 180,
    value: 0,
    labelText: 'rotateX',
    indicator: true
});
rotateXSlider.mountTo(document.body);
rotateXSlider.onChange = (value) => {
    rotateX = value;
    draw();
}


const rotateYSlider = new Slider({
    min: -180,
    max: 180,
    value: 0,
    labelText: 'rotateY',
    indicator: true
});
rotateYSlider.mountTo(document.body);
rotateYSlider.onChange = (value) => {
    rotateY = value;
    draw();
}


const rotateZSlider = new Slider({
    min: -180,
    max: 180,
    value: 0,
    labelText: 'rotateZ',
    indicator: true
});
rotateZSlider.mountTo(document.body);
rotateZSlider.onChange = (value) => {
    rotateZ = value;
    draw();
}

draw();




