import {Matrix} from '../MVP/mat4.js';
import {Rasterizer, Enum_Buffers, PrimitiveType} from './Rasterizer.js';
const width = 700;
const height = 700;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);


function getViewMatrix (eyePos) {
    return new Matrix(4, [
        1, 0, 0, -eyePos[0],
        0, 1, 0, -eyePos[1],
        0, 0, 1, -eyePos[2],
        0, 0, 0, 1,
    ]);
}

function getModelMatrix() {
    return new Matrix(4).identity();
}

function getProjection(eyeFov, aspect, zNear, zFar) {
    const f = Math.tan(Math.PI / 2 - eyeFov * Math.PI / 180 * 0.5);
    return new Matrix(4, [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (zNear + zFar) / (zFar - zNear), 2 * zNear * zFar / (zFar - zNear),
        0, 0, -1, 0
    ]);
}

function main () {
    const r = new Rasterizer(ctx);
    const eyePos = [0, 0, 5];

    const pos = [
        [2, 0, -2],
        [0, 2, -2],
        [-2, 0, -2],
        [3.5, -1, -5],
        [2.5, 1.5, -5],
        [-1, 0.5, -5]
    ];

    const ind = [
        [0, 1, 2],
        [3, 4, 5]
    ];

    const cols = [
        [217.0, 238.0, 185.0],
        [217.0, 238.0, 185.0],
        [217.0, 238.0, 185.0],
        [185.0, 217.0, 238.0],
        [185.0, 217.0, 238.0],
        [185.0, 217.0, 238.0]
    ];

    const posId = r.loadPositions(pos);
    const indId = r.loadIndices(ind);
    const colId = r.loadColors(cols);

    let frameCount = 0;
    r.clear(Enum_Buffers.colorBuffer | Enum_Buffers.depthBuffer);
    r.setModel(getModelMatrix());
    r.setView(getViewMatrix(eyePos));
    r.setProjection(getProjection(45, 1, 0.1, 50));

    r.draw(posId, indId, colId, PrimitiveType.TRIANGLE);
    const imageData = r.getFramebuffer();

    ctx.putImageData(imageData, 0, 0);
}

main();