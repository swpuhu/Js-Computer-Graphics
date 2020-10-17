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
        [2.8, 0, -3],
        [0, 2, -6],
        [-2, 0, -6],
        [2.5, -1, -5],
        [2.5, 2.5, -5],
        [-2, 0.5, -5]
    ];

    const ind = [
        [0, 1, 2],
        [3, 4, 5]
    ];

    const cols = [
        [255, 255, 0],
        [0, 255, 255],
        [255, 0, 255],
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255],
    ];

    const posId = r.loadPositions(pos);
    const indId = r.loadIndices(ind);
    const colId = r.loadColors(cols);

    let frameCount = 0;
    let startTime = Date.now();
    const mainLoop = () => {
        r.clear(Enum_Buffers.colorBuffer | Enum_Buffers.depthBuffer);
        r.setModel(getModelMatrix());
        r.setView(getViewMatrix(eyePos));
        r.setProjection(getProjection(45, 1, 0.1, 50));
    
        r.draw(posId, indId, colId, PrimitiveType.TRIANGLE);
        const imageData = r.getFramebuffer();
        const nowTime = Date.now();
        ctx.putImageData(imageData, 0, 0);
        frameCount++;
        // console.log('frame count: ' + frameCount++);
        console.log('frame rate: ' + frameCount / (nowTime - startTime) * 1000);
        // requestAnimationFrame(mainLoop);
    }
    mainLoop();
}

main();