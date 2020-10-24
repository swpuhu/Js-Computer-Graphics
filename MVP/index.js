import { Matrix, lookAt, inverse } from "./mat4.js";
import { Slider } from "./UICreator.js";
const width = 640;
const height = 360;

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext("2d");

const generateCubeVertex = (size, near) => {
    return [
        [-size / 2, size / 2, near, 1],
        [size / 2, size / 2, near, 1],
        [size / 2, size / 2, near + size, 1],
        [-size / 2, size / 2, near + size, 1],

        [-size / 2, -size / 2, near, 1],
        [size / 2, -size / 2, near, 1],
        [size / 2, -size / 2, near + size, 1],
        [-size / 2, -size / 2, near + size, 1],
    ];
};

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number[][]} vertices
 */
function drawCube(ctx, vertices) {
    ctx.beginPath();
    ctx.moveTo(...vertices[0]);
    for (let i = 1; i < vertices.length / 2; i++) {
        ctx.lineTo(...vertices[i]);
    }
    ctx.lineTo(...vertices[0]);
    ctx.moveTo(...vertices[4]);
    for (let i = 5; i < 8; i++) {
        ctx.lineTo(...vertices[i]);
    }
    ctx.lineTo(...vertices[4]);

    for (let i = 0; i < 4; i++) {
        ctx.moveTo(...vertices[i]);
        ctx.lineTo(...vertices[i + 4]);
    }
    ctx.stroke();
}

let tx = 0;
let ty = 0;
let tz = 500;
let rotateX = 0;
let rotateY = 0;
let rotateZ = 0;
const near = 500;
const far = 1000;

let cameraX = 0;
let cameraY = 0;
let cameraZ = 0;

const translateMatrix = new Matrix(4).createTranslateMatrix(tx, ty, tz);
const rotateXMatrix = new Matrix(4).createRotateMatrix(rotateX, "x");
const rotateYMatrix = new Matrix(4).createRotateMatrix(rotateY, "y");
const rotateZMatrix = new Matrix(4).createRotateMatrix(rotateZ, "z");
const perspectiveMatrix = new Matrix(4).createPerspectiveMatrix(
    near,
    far,
    width / 2,
    height / 2
);
const orthographMatrix = new Matrix(4).createOrthographMatrix(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    near,
    far
);
let viewingMatrix = new Matrix(
    4,
    inverse(lookAt([cameraX, cameraY, cameraZ], [tx, ty, tz], [0, 1, 0]))
);
const viewScaleMatrix = new Matrix(4).createViewScaleMatrix(
    0,
    width,
    height,
    0,
    near,
    far
);

/**
 *
 * @param {number[][]} points
 */
function transformPoints(points, x, y) {
    viewingMatrix = new Matrix(
        4,
        inverse(lookAt([cameraX, cameraY, cameraZ], [0, 0, tz], [0, 1, 0]))
    );
    const matrix = perspectiveMatrix
        .multiple(viewingMatrix)
        .multiple(translateMatrix)
        .multiple(rotateXMatrix)
        .multiple(rotateYMatrix)
        .multiple(rotateZMatrix);
    const res = [];
    for (let i = 0; i < points.length; i++) {
        res.push(matrix.multiVec(points[i]));
        for (let j = 0; j < 4; j++) {
            res[i][j] /= res[i][3];
        }
    }
    return res;
}

const points = generateCubeVertex(200, -100);
ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
function draw() {
    const newPoints = transformPoints(points);
    ctx.clearRect(0, 0, width, height);
    // ctx.fillRect(0, 0, width, height);
    drawCube(ctx, newPoints);
}

draw();

const sliderTx = new Slider({
    min: -width,
    max: width,
    value: tx,
    step: 1,
    labelText: "X轴平移距离",
});
sliderTx.onChange = (value) => {
    tx = value;
    translateMatrix.createTranslateMatrix(tx, ty, tz);
    draw();
};
sliderTx.mountTo(document.body);

const sliderTy = new Slider({
    min: -height,
    max: height,
    value: ty,
    step: 1,
    labelText: "Y轴平移距离",
});
sliderTy.onChange = (value) => {
    ty = value;
    translateMatrix.createTranslateMatrix(tx, ty, tz);
    draw();
};
sliderTy.mountTo(document.body);

const sliderTz = new Slider({
    min: 0,
    max: far,
    value: tz,
    step: 1,
    labelText: "Z轴平移距离",
});
sliderTz.onChange = (value) => {
    tz = value;
    translateMatrix.createTranslateMatrix(tx, ty, tz);
    draw();
};
sliderTz.mountTo(document.body);

const rotateXSlider = new Slider({
    min: 0,
    max: 360,
    value: 0,
    step: 1,
    labelText: "绕X轴旋转角度",
});
rotateXSlider.onChange = (value) => {
    rotateX = value;
    rotateXMatrix.createRotateMatrix(rotateX, "x");
    draw();
};
rotateXSlider.mountTo(document.body);

const rotateYSlider = new Slider({
    min: 0,
    max: 360,
    value: 0,
    step: 1,
    labelText: "绕Y轴旋转角度",
});
rotateYSlider.onChange = (value) => {
    rotateY = value;
    rotateYMatrix.createRotateMatrix(rotateY, "y");
    draw();
};
rotateYSlider.mountTo(document.body);

const rotateZSlider = new Slider({
    min: 0,
    max: 360,
    value: 0,
    step: 1,
    labelText: "绕Z轴旋转角度",
});
rotateZSlider.onChange = (value) => {
    rotateZ = value;
    rotateZMatrix.createRotateMatrix(rotateZ, "z");
    draw();
};
rotateZSlider.mountTo(document.body);

const cameraXSlider = new Slider({
    min: -width / 2,
    max: width / 2,
    value: 0,
    step: 1,
    labelText: "相机X轴坐标",
});
cameraXSlider.onChange = (value) => {
    cameraX = value;
    draw();
};
cameraXSlider.mountTo(document.body);

const cameraYSlider = new Slider({
    min: -height / 2,
    max: height / 2,
    value: 0,
    step: 1,
    labelText: "相机Y轴坐标",
});
cameraYSlider.onChange = (value) => {
    cameraY = value;
    draw();
};
cameraYSlider.mountTo(document.body);

const cameraZSlider = new Slider({
    min: -near,
    max: near,
    value: 0,
    step: 1,
    labelText: "相机Z轴坐标",
});
cameraZSlider.onChange = (value) => {
    cameraZ = value;
    draw();
};
cameraZSlider.mountTo(document.body);

function update() {
    rotateX += 0.5;
    rotateY += 0.7;
    rotateZ += 0.8;
    rotateXSlider.setValue(rotateX % 360);
    rotateYSlider.setValue(rotateY % 360);
    rotateZSlider.setValue(rotateZ % 360);
    requestAnimationFrame(update);
}

// update();

const matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
