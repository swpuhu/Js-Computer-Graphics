import {Vec2} from '../util.js'

const width = 640;
const height = 360;
const canvas = document.createElement('canvas');
canvas.width = width;
canvas.height = height;
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');
ctx.translate(0, canvas.height);
ctx.scale(1, -1);
ctx.lineCap = 'round';


/**
 * 
 * @param {CanvasRenderingContext2D} context 
 */
function drawScanner(context, r, alpha, isIn = false) {
    context.save();
    context.fillStyle = isIn ? '#ff660088' : '#0066ff88';
    context.beginPath();
    context.moveTo(width / 2, 0);
    context.arc(width / 2, 0, r, (90 - alpha / 2) / 180 * Math.PI, (90 + alpha / 2) / 180 * Math.PI);
    context.fill();
    context.restore();
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {number} x 
 * @param {number} y 
 */
function drawPoint (ctx, x, y) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function drawScence (x, y, isInScanner) {
    ctx.clearRect(0, 0, width, height);
    drawScanner(ctx, width / 2, 60, isInScanner);
    drawPoint(ctx, x, y);
}
ctx.fillStyle = '#ff6600';

canvas.onmousemove = function (e) {
    const x = e.clientX;
    const y = height - e.clientY;
    let bool = isInScanner(60, new Vec2(x - width / 2, y));
    drawScence(x, y, bool);
}

/**
 * 
 * @param {number} angle
 * @param {Vec2} vec 
 */
function isInScanner (angle, vec) {
    return Math.abs(new Vec2(0, 1).cross(vec.normalize())) <= Math.sin(angle / 180 / 2 * Math.PI);
}


drawScence(0, 0);