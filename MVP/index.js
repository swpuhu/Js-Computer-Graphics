const { glMatrix } = require("./gl-matrix");

const width = 640;
const height = 360;

const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = width;
canvas.height = height;
const ctx = canvas.getContext('2d');

const generateCubeVertex = (size) => {
    return [
        [-size / 2, size / 2, size / 2],
        [size / 2, size / 2, size / 2],
        [size / 2, size / 2, -size / 2],
        [-size / 2, size / 2, -size / 2],

        [-size / 2, -size / 2, size / 2],
        [size / 2, -size / 2, size / 2],
        [size / 2, -size / 2, -size / 2],
        [-size / 2, -size / 2, -size / 2],
    ];
}

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

    ctx.stroke();
}

/**
 * 
 * @param {number[][]} points 
 */
function translatePoints (points, x, y) {
    const translateMatrix = glMatrix.mat3.create();
    glMatrix.mat3.fromTranslation(translateMatrix, [x, y]);
    glMatrix.mat3.transpose(translateMatrix, translateMatrix);
    for (let i = 0; i < points.length; i++) {
        
    }
}


const points = generateCubeVertex(500);
drawCube(ctx, points);
